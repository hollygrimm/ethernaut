import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { HackCoinFlip__factory, HackCoinFlip } from '../../typechain';
import { TASK_DEPLOY_HACKCOINFLIP } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY_HACKCOINFLIP, 'Deploy HackCoinFlip contract')
  .setAction(async (args, hre) => {
    let deployer: SignerWithAddress;

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    [deployer] = await hre.ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`deployer address: ${address}`);

    var contractAddress = '';
    if (network.name === 'rinkeby') {
      contractAddress = process.env.RINKEBY_COINFLIP_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_COINFLIP_CONTRACT_ADDRESS || '';
    }

    const contractFactory = (await hre.ethers.getContractFactory(
      'HackCoinFlip',
      deployer
    )) as HackCoinFlip__factory;

    console.log('Deploying HackCoinFlip...');
    const contract: HackCoinFlip = await contractFactory.deploy(contractAddress);
    await contract.deployed();

    console.log('HackCoinFlip deployed to:', contract.address);
  });

