import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Delegate__factory, Delegate } from '../../typechain';
import { TASK_DEPLOY_DELEGATE } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby
task(TASK_DEPLOY_DELEGATE, 'Deploy Delegate contract')
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];
    const deployerAddress = await deployerWallet.getAddress();
    console.log(`deployer address: ${deployerAddress}`);

    const contractFactory = (await hre.ethers.getContractFactory(
      'Delegate',
      deployerWallet
    )) as Delegate__factory;

    console.log('Deploying Delegate...');
    //TODO: THIS DEPLOY IS NOT NEEDED?
    const contract: Delegate = await contractFactory.deploy(deployerWallet.address);
    await contract.deployed();

    console.log('Delegate deployed to:', contract.address);
  });

