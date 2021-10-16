# 6 Delegation

[Open Ethernaut Level 6, Connect Wallet, and Create Instance](https://ethernaut.openzeppelin.com/level/0x9451961b7Aea1Df57bc20CC68D72f662241b5493)

## Create Environment Variables for the Level

Create `.env.contract` (listed in .gitignore).

```sh
cd 6_delegation
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

Create a new terminal, go to this level's folder and run this to deploy the Delegate contract:

```sh
cd 6_delegation
hh deploydelegate --network localhost
```

update `LOCALHOST_DELEGATE_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Deploy the Delegation contract:

```sh
hh deploydelegation --network localhost
```

update `LOCALHOST_DELEGATION_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Claim Ownership of Delegation Contract:

```sh
hh pwn --network localhost
```

## Deploy to Rinkeby

Note the deployed Delegation contract's address from the instance deployed by Ethernaut and update `RINKEBY_DELEGATION_CONTRACT_ADDRESS` inside `.env.contract` with address of newly deployed contract.

Claim Ownership of Delegation Contract:

```sh
hh pwn --network rinkeby
```

## Explanation

`delegatecall` is a way of invoking functions from another contract. When you use `delegatecall`, you are using the calling contract's storage attributes. In this case, storage `slot0` corresponding to the `owner` of the *Delegation* contract is being updated when calling `Delegate.pwn()` using `delegatecall`.

Additionally, the actual storage slots are updated with the `delegatecall`, ignoring the variable names in the contract. The storage layout of the two contracts must align for this to work.

* <https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7/>
* <https://medium.com/coinmonks/ethernaut-lvl-6-walkthrough-how-to-abuse-the-delicate-delegatecall-466b26c429e4>
