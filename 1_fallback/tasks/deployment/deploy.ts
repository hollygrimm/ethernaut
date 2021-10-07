import { task } from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Fallback, Fallback__factory } from "../../typechain";
import { TASK_DEPLOY } from "../task-names";
import { Network } from "@ethersproject/networks/lib/types";

//hh deploy --network hardhat|localhost|rinkeby|mainnet
task(TASK_DEPLOY, "Deploy contract")
  .setAction(async (args, hre) => {
    let deployerWallet: SignerWithAddress;

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);
    
    [deployerWallet] = await hre.ethers.getSigners();
    const address = await deployerWallet.getAddress();
    console.log(`deployer address: ${address}`);

    const contractFactory = (await hre.ethers.getContractFactory(
      'Fallback',
      deployerWallet
    )) as Fallback__factory;

    console.log('Deploying Contract...');
    const contract: Fallback = await contractFactory.deploy();
    await contract.deployed();

    console.log('Contract deployed to:', contract.address);
  });

