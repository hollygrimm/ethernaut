# 2 Fallout Function

[Open Ethernaut Level 2, Connect Wallet, and Create Instance](https://ethernaut.openzeppelin.com/level/0x5732B2F88cbd19B6f01E3a96e9f0D90B917281E5

## Create Environment Variables for the Level

Create .env.contract (listed in .gitignore).

```sh
cd 2_fallout
cp .env.contract.sample .env.contract
```

## Deploy and Test Locally

Clean, compile and test:

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

Create a new terminal, go to this level's folder and run this to deploy your contract:

```sh
cd 2_fallout
hh deploy --network localhost
```

update `LOCALHOST_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract. Run the accounts task:

```sh
hh accounts --network localhost
```

Become owner of local contract:

```sh
hh makeowner --network localhost
```

## Deploy to Rinkeby

Note the deployed contract's address from the instance deployed by Ethernaut and update value in `.env.contract`:

* RINKEBY_CONTRACT_ADDRESS=

Withdraw from contract:

```sh
hh makeowner --network rinkeby
```
