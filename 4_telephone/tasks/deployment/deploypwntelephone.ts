import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { PwnTelephone__factory, PwnTelephone } from '../../typechain';
import { TASK_DEPLOY_PWNTELEPHONE } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY_PWNTELEPHONE, 'Deploy PwnTelephone contract')
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const userWallet = wallets[1];
    const address = await userWallet.getAddress();
    console.log(`deployer address: ${address}`);

    let contractAddress = '';
    if (network.name === 'rinkeby') {
      contractAddress = process.env.RINKEBY_TELEPHONE_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_TELEPHONE_CONTRACT_ADDRESS || '';
    }

    const contractFactory = (await hre.ethers.getContractFactory(
      'PwnTelephone',
      userWallet
    )) as PwnTelephone__factory;

    console.log('Deploying PwnTelephone...');
    const contract: PwnTelephone = await contractFactory.deploy(contractAddress);
    await contract.deployed();

    console.log('PwnTelephone deployed to:', contract.address);
  });

