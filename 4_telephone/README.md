# 4 Telephone

[Open Ethernaut Level 4, Connect Wallet, and Create Instance](https://ethernaut.openzeppelin.com/level/0x0b6F6CE4BCfB70525A31454292017F640C10c768)

## Create Environment Variables for the Level

Create `.env.contract` (listed in .gitignore).

```sh
cd 4_telephone
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

Create a new terminal, go to this level's folder and run this to deploy the TELEPHONE contract:

```sh
cd 4_telephone
hh deploytelephone --network localhost
```

update `LOCALHOST_TELEPHONE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the PwnTelephone contract:

```sh
hh deploypwntelephone --network localhost
```

update `LOCALHOST_PWNTELEPHONE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Pwn TELEPHONE:

```sh
hh pwn --network localhost
```

## Deploy to Rinkeby

Note the deployed Telephone contract's address from the instance deployed by Ethernaut and update `RINKEBY_TELEPHONE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the PwnTelephone contract:

```sh
hh deploypwntelephone --network rinkeby
```

update `RINKEBY_PWNTELEPHONE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Pwn telephone:

```sh
hh pwn --network rinkeby
```

## Explanation

`tx.origin` is the original user wallet that initiated the transaction from a chain of calls.

Create a 2nd contract `pwntelephone.sol` that calls  `changeOwner` on `telephone.sol`. `msg.sender` will be the address of the `pwntelephone.sol` contract. `tx.origin` will be user wallet address.

* <https://medium.com/@nicolezhu/ethernaut-lvl-4-walkthrough-how-to-abuse-tx-origin-msg-sender-ef37d6751c8>

## TODO

* Add additional test coverage
