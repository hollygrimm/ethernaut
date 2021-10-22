import { task } from 'hardhat/config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { King__factory, King } from '../../typechain';
import { TASK_DEPLOY_KING } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';
import { BigNumber } from 'ethers';

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY_KING, 'Deploy King contract')
  .setAction(async (args, hre) => {
    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];
    const deployerAddress = await deployerWallet.getAddress();
    console.log(`deployer address: ${deployerAddress}`);

    const contractFactory = (await hre.ethers.getContractFactory(
      'King',
      deployerWallet
    )) as King__factory;

    console.log('Deploying King...');
    const oneEth: BigNumber = hre.ethers.BigNumber.from('1000000000000000000');
    const contract: King = await contractFactory.deploy({ value: oneEth });
    await contract.deployed();

    console.log('King deployed to:', contract.address);
  });

