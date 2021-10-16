import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Delegation__factory, Delegation } from '../../typechain';
import { TASK_DEPLOY_DELEGATION } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby
task(TASK_DEPLOY_DELEGATION, 'Deploy Delegation contract')
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];
    const address = await deployerWallet.getAddress();
    console.log(`deployer address: ${address}`);

    let delegateContractAddress = '';
    if (network.name === 'rinkeby') {
      delegateContractAddress = process.env.RINKEBY_DELEGATE_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      delegateContractAddress = process.env.LOCALHOST_DELEGATE_CONTRACT_ADDRESS || '';
    }

    const contractFactory = (await hre.ethers.getContractFactory(
      'Delegation',
      deployerWallet
    )) as Delegation__factory;

    console.log('Deploying Delegation...');
    const contract: Delegation = await contractFactory.deploy(delegateContractAddress);
    await contract.deployed();

    console.log('Delegation deployed to:', contract.address);
  });

