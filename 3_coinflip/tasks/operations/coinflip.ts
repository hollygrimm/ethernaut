import { task } from 'hardhat/config';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { HackCoinFlip } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_COINFLIP } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';
import { BigNumber } from '@ethersproject/bignumber';

import abi from '../../data/abi/HackCoinFlip.json';

task(TASK_COINFLIP, 'Break this contract')
  .setAction(async (_taskArgs, hre) => {

    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const userWallet = wallets[1];

    const address = await userWallet.getAddress();
    console.log(`user address: ${address}`);

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    let contractAddress = '';
    if (network.name === 'rinkeby') {
      contractAddress = process.env.RINKEBY_HACKCOINFLIP_CONTRACT_ADDRESS || '';
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_HACKCOINFLIP_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const contract: HackCoinFlip = new hre.ethers.Contract(contractAddress, abi, userWallet) as HackCoinFlip;

    const hackFlipTx: ContractTransaction = await contract.connect(userWallet)
      .hackFlip({ gasLimit: 150000 });

    const receipt: ContractReceipt = await hackFlipTx.wait();

    if (receipt.events) {
      const event = receipt.events.filter(e => e.event === 'WinsUpdated')[0];

      if (event.args) {
        console.log(`Wins emitted from WinsUpdated: ${event.args}`);
      }
    } else {
      console.log('Failed to emit WinsUpdated event');
    }

    const wins: BigNumber = await contract.getWins();
    console.log(`Consecutive wins: ${wins}`);

    process.exit(0)
  });