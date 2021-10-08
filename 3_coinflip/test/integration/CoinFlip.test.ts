import { ethers } from 'hardhat';
import chai from 'chai';
import { CoinFlip__factory, HackCoinFlip__factory, CoinFlip, HackCoinFlip } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ContractTransaction } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';

const { expect } = chai;

let contract: CoinFlip;
let contractFactory: CoinFlip__factory;
let hackContract: HackCoinFlip;
let hackContractFactory: HackCoinFlip__factory;
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('HackCoinFlip Tests', () => {
    beforeEach(async () => {
        [deployerWallet, userWallet] = await ethers.getSigners();

        contractFactory = (await ethers.getContractFactory(
            'CoinFlip',
            deployerWallet
        )) as CoinFlip__factory;

        contract = (await contractFactory.deploy()) as CoinFlip;

        expect(contract.address).to.be.properAddress;

        hackContractFactory = (await ethers.getContractFactory(
            'HackCoinFlip',
            deployerWallet
        )) as HackCoinFlip__factory;

        hackContract = (await hackContractFactory.deploy(contract.address)) as HackCoinFlip;

        expect(hackContract.address).to.be.properAddress;
    });

    describe('Function tests', async () => {
        it('Hack Flip ten times', async () => {
            for(var i = 1; i==10; i++){
                await expect(hackContract.connect(userWallet).hackFlip())
                .to.emit(hackContract, 'WinsUpdated');
    
                expect(await hackContract.getWins()).to.equal(i);
            }
        });
    });
});


