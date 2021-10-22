# 9 King

[Open Ethernaut Level 9, Connect Wallet, and Create Instance](https://ethernaut.openzeppelin.com/level/0x5cECE66f3EB19f7Df3192Ae37C27D96D8396433D)

## Create Environment Variables for the Level

Create `.env.contract` (listed in .gitignore).

```sh
cd 9_king
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

Create a new terminal, go to this level's folder and run this to deploy the KING contract:

```sh
cd 9_king
hh deployking --network localhost
```

update `LOCALHOST_KING_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the PwnKing contract:

```sh
hh deploypwnking --network localhost
```

update `LOCALHOST_PWNKING_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Pwn KING:

```sh
hh pwn --network localhost
```

## Deploy to Rinkeby

Note the deployed King contract's address from the instance deployed by Ethernaut and update `RINKEBY_KING_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the PwnKing contract:

```sh
hh deploypwnking --network rinkeby
```

update `RINKEBY_PWNKING_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Pwn king:

```sh
hh pwn --network rinkeby
```

## Explanation

Using a contract account with no payable fallback will cause a `transaction reverted` error when `king.transfer(msg.value);` is called.

* http://www.kingoftheether.com/postmortem.html
* https://medium.com/coinmonks/ethernaut-lvl-9-king-walkthrough-how-bad-contracts-can-abuse-withdrawals-db12754f359b