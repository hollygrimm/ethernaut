# 3 Coin Flip

[Open Ethernaut Level 3, Connect Wallet, and Create Instance](https://ethernaut.openzeppelin.com/level/0x4dF32584890A0026e56f7535d0f2C6486753624f)

## Compile
Clean and compile:
```sh
cd 3_coinflip
hh clean
TS_NODE_TRANSPILE_ONLY=1 hh compile
hh compile
```

## Deploy on Local Development Node
Start a local development node
```sh
hh node
```

Create a new terminal, go to this level's folder and run this to deploy the CoinFlip contract:
```sh
cd 3_coinflip
hh deploycoinflip --network localhost
```

update `LOCALHOST_COINFLIP_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the HackCoinFlip contract:
```sh
hh deployhackcoinflip --network localhost
```

update `LOCALHOST_HACKCOINFLIP_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Hack CoinFlip:
```sh
hh coinflip --network localhost
```

## Deploy to Rinkeby

Note the deployed CoinFlip contract's address from the instance deployed by Ethernaut and update `RINKEBY_COINFLIP_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the HackCoinFlip contract:
```sh
hh deployhackcoinflip --network rinkeby
```

update `RINKEBY_HACKCOINFLIP_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Hack coinflip:
```sh
hh coinflip --network rinkeby
```
