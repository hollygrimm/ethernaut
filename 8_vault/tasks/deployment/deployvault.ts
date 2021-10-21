import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Vault__factory, Vault } from '../../typechain';
import { TASK_DEPLOY_VAULT } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

//hh deploy --network hardhat|localhost|rinkeby
task(TASK_DEPLOY_VAULT, 'Deploy Vault contract')
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];
    const deployerAddress = await deployerWallet.getAddress();
    console.log(`deployer address: ${deployerAddress}`);

    const contractFactory = (await hre.ethers.getContractFactory(
      'Vault',
      deployerWallet
    )) as Vault__factory;

    let contractPassword = '';
    if (network.name === 'rinkeby') {
      contractPassword = process.env.RINKEBY_VAULT_CONTRACT_PASSWORD || '';
    } else if (network.name === 'unknown') { //localhost network
      contractPassword = process.env.LOCALHOST_VAULT_CONTRACT_PASSWORD || '';
    }
    console.log(`contractPassword: ${contractPassword}`);

    console.log('Deploying Vault...');
    const contract: Vault = await contractFactory.deploy(hre.ethers.utils.formatBytes32String(contractPassword));
    await contract.deployed();

    console.log('Vault deployed to:', contract.address);
  });

