# 7 Force

[Open Ethernaut Level 7, Connect Wallet, and Create Instance](https://ethernaut.openzeppelin.com/level/0x22699e6AdD7159C3C385bf4d7e1C647ddB3a99ea)

## Create Environment Variables for the Level

Create `.env.contract` (listed in .gitignore).

```sh
cd 7_force
cp .env.contract.sample .env.contract
```

## Compile

Clean and compile:

```sh
hh clean
TS_NODE_TRANSPILE_ONLY=1 hh compile
hh compile
hh test
hh coverage
```

## Deploy on Local Development Node

Start a local development node

```sh
hh node
```

Create a new terminal, go to this level's folder and run this to deploy the FORCE contract:

```sh
cd 7_force
hh deployforce --network localhost
```

update `LOCALHOST_FORCE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the PwnForce contract:

```sh
hh deploypwnforce --network localhost
```

update `LOCALHOST_PWNFORCE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Pwn FORCE:

```sh
hh pwn --network localhost
```

## Deploy to Rinkeby

Note the deployed Force contract's address from the instance deployed by Ethernaut and update `RINKEBY_FORCE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the PwnForce contract:

```sh
hh deploypwnforce --network rinkeby
```

update `RINKEBY_PWNFORCE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Pwn force:

```sh
hh pwn --network rinkeby
```

## Explanation
`selfdestruct` is used to clean up void contracts. `force.sol` did not have any payable fallback functions to receive funds. The only way to send funds to it was by creating a second contract with a small balance, selfdestruct the new contract, and send the contract balance to `force.sol`. Avoid `address(this).balance == 0` for any contract logic.

Note: created an empty constructor to get hardhat to compile `force.sol`


* <https://medium.com/coinmonks/ethernaut-lvl-7-walkthrough-how-to-selfdestruct-and-create-an-ether-blackhole-eb5bb72d2c57>

