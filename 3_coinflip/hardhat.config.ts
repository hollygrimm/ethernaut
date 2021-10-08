import { config as dotEnvConfig, config as dotEnvContractConfig } from 'dotenv';
dotEnvConfig({ path: '../.env' });
dotEnvContractConfig({ path: '.env.contract' });
import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-gas-reporter';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-typechain';
import 'solidity-coverage';

import './tasks/accounts';
import './tasks/deployment/deploycoinflip';
import './tasks/deployment/deployhackcoinflip';
import './tasks/operations/coinflip';

const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
const MAINNET_PRIVATE_KEY =
    process.env.MAINNET_PRIVATE_KEY ||
    '';
const RINKEBY_PRIVATE_KEY =
    process.env.RINKEBY_PRIVATE_KEY ||
    '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    solidity: {
        compilers: [{ version: '0.6.0', settings: {} }],
    },
    networks: {
        hardhat: {
            initialBaseFeePerGas: 0, //https://github.com/sc-forks/solidity-coverage/issues/652
        },
        localhost: {},
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [RINKEBY_PRIVATE_KEY],
        },
        coverage: {
            url: 'http://127.0.0.1:8555', // Coverage launches its own ganache-cli client
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: 'USD',
        gasPrice: 21,
    },
};

export default config;