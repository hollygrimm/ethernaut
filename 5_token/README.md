# 5 Token Function

[Open Ethernaut Level 5, Connect Wallet, and Create Instance](https://ethernaut.openzeppelin.com/level/0x63bE8347A617476CA461649897238A31835a32CE)

## Create Environment Variables for the Level

Create .env.contract (listed in .gitignore).

```sh
cd 5_token
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
cd 5_token
hh deploy --network localhost
```

update `LOCALHOST_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract. Run the accounts task:

```sh
hh accounts --network localhost
```

Become owner of local contract:

```sh
hh pwn --network localhost
```

## Deploy to Rinkeby

Note the deployed contract's address from the instance deployed by Ethernaut and update value in `.env.contract`:

* RINKEBY_CONTRACT_ADDRESS=

Withdraw from contract:

```sh
hh pwn --network rinkeby
```

## Explanation

```sol
    balances[msg.sender] -= _value;
    balances[_to] += _value;
```

The sender's balance is 0 and by transferring a `_value` of 1, it will substract 1 from 0. Because it's an unsigned integer, this will cause a token value underflow. The resulting sender's balance will be 2^256 - 1.

Always use `Safemath.sol`.
