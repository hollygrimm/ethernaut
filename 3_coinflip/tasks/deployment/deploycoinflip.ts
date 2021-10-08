import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { CoinFlip__factory, CoinFlip } from '../../typechain';
import { TASK_DEPLOY_COINFLIP } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY_COINFLIP, 'Deploy CoinFlip contract')
  .setAction(async (args, hre) => {
    let deployer: SignerWithAddress;

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    [deployer] = await hre.ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`deployer address: ${address}`);

    const contractFactory = (await hre.ethers.getContractFactory(
      'CoinFlip',
      deployer
    )) as CoinFlip__factory;

    console.log('Deploying CoinFlip...');
    const contract: CoinFlip = await contractFactory.deploy();
    await contract.deployed();

    console.log('CoinFlip deployed to:', contract.address);
  });

