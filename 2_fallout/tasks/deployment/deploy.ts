import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Fallout, Fallout__factory } from '../../typechain';
import { TASK_DEPLOY } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY, 'Deploy contract')
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];

    const address = await deployerWallet.getAddress();
    console.log(`deployer address: ${address}`);

    const contractFactory = (await hre.ethers.getContractFactory(
      'Fallout',
      deployerWallet
    )) as Fallout__factory;

    console.log('Deploying Contract...');
    const contract: Fallout = await contractFactory.deploy();
    await contract.deployed();

    console.log('Contract deployed to:', contract.address);
  });

