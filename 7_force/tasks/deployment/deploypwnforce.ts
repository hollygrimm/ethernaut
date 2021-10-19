import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { PwnForce__factory, PwnForce } from '../../typechain';
import { TASK_DEPLOY_PWNFORCE } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY_PWNFORCE, 'Deploy PwnForce contract')
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const userWallet = wallets[1];
    const address = await userWallet.getAddress();
    console.log(`deployer address: ${address}`);

    let contractAddress = '';
    if (network.name === 'rinkeby') {
      contractAddress = process.env.RINKEBY_FORCE_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_FORCE_CONTRACT_ADDRESS || '';
    }

    const contractFactory = (await hre.ethers.getContractFactory(
      'PwnForce',
      userWallet
    )) as PwnForce__factory;

    console.log('Deploying PwnForce...');
    const contract: PwnForce = await contractFactory.deploy(contractAddress);
    await contract.deployed();

    console.log('PwnForce deployed to:', contract.address);
  });

