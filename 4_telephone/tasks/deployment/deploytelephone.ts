import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Telephone__factory, Telephone } from '../../typechain';
import { TASK_DEPLOY_TELEPHONE } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY_TELEPHONE, 'Deploy Telephone contract')
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];
    const deployerAddress = await deployerWallet.getAddress();
    console.log(`deployer address: ${deployerAddress}`);

    const contractFactory = (await hre.ethers.getContractFactory(
      'Telephone',
      deployerWallet
    )) as Telephone__factory;

    console.log('Deploying Telephone...');
    const contract: Telephone = await contractFactory.deploy();
    await contract.deployed();

    console.log('Telephone deployed to:', contract.address);
  });

