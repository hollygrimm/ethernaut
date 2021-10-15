# The Ethernaut Tests and Solutions

Here you will find tests and solutions in HardHat for <https://ethernaut.openzeppelin.com/>

Pull Requests / Contributions are welcomed!

## Quick start

```sh
git clone https://github.com/hollygrimm/ethernaut
cd ethernaut
npm i
# list hardhat tasks:
npx hardhat
```

### Install hardhat-shorthand

Install to use shorthand where `hh == npx hardhat`

```sh
npm i -g hardhat-shorthand
hardhat-completion install
```

### Create Infura and Etherscan Accounts

Create free accounts on:

* <https://infura.io>
* <https://etherscan.io>

Create .env (listed in .gitignore). Do **not** check in .env to public repo:

```sh
cp .env.sample .env
```

enter the following values into .env:

* INFURA_API_KEY=
* ETHERSCAN_API_KEY=

### Add your Rinkeby Account

Get ether on Rinkeby:
<https://faucet.rinkeby.io/>

Supply the private key of the contract owner in .env. **Never** share your private key:

* RINKEBY_PRIVATE_KEY=

## Levels

### 1. Fallback [README.md](1_fallback/README.md)

### 2. Fallout [README.md](2_fallout/README.md)

### 3. Coin Flip [README.md](3_coinflip/README.md)

## Recommended Visual Studio Code Extensions

* <https://github.com/juanfranblanco/vscode-solidity> by Juan Blanco
* ESLint by Dirk Baeumer

## References

* <https://github.com/OpenZeppelin/ethernaut>
* <https://github.com/nomiclabs/hardhat>
* <https://github.com/ItsNickBarry/hardhat-abi-exporter>
