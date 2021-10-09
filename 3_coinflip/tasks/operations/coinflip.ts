import { task } from 'hardhat/config';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { HackCoinFlip } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_COINFLIP } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';
import { BigNumber } from '@ethersproject/bignumber';

import { abi } from '../../artifacts/contracts/hackcoinflip.sol/HackCoinFlip.json';

task(TASK_COINFLIP, 'Break this contract')
  .setAction(async (_taskArgs, hre) => {

    let userWallet: SignerWithAddress;

    [userWallet] = await hre.ethers.getSigners();
    const address = await userWallet.getAddress();
    console.log(`user address: ${address}`);

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    var contractAddress = '';
    if (network.name === 'rinkeby') {
      contractAddress = process.env.RINKEBY_HACKCOINFLIP_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_HACKCOINFLIP_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const contract: HackCoinFlip = new hre.ethers.Contract(contractAddress, abi, userWallet) as HackCoinFlip;

    const hackFlipTx: ContractTransaction = await contract.connect(userWallet)
      .hackFlip({ gasLimit: 150000 });

    let receipt: ContractReceipt = await hackFlipTx.wait();

    const wins: BigNumber = await contract.getWins();
    console.log(`consecutive wins: ${wins}`);

    process.exit(0)
  });