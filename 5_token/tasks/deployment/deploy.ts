import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Token, Token__factory } from '../../typechain';
import { TASK_DEPLOY } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';
import { BigNumber } from '@ethersproject/bignumber';

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
      'Token',
      deployerWallet
    )) as Token__factory;

    console.log('Deploying Contract...');
    const initialSupply: BigNumber = hre.ethers.BigNumber.from('20');
    const contract: Token = await contractFactory.deploy(initialSupply);
    await contract.deployed();

    console.log('Contract deployed to:', contract.address);
  });

