import { ethers } from 'hardhat';
import chai from 'chai';
import { Fallout__factory, Fallout } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

const { expect } = chai;

let fallout: Fallout;
let falloutFactory: Fallout__factory;

let wallets: SignerWithAddress[];
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('Fallout Tests', () => {
    beforeEach(async () => {
        wallets = await ethers.getSigners();
        deployerWallet = wallets[0];
        userWallet = wallets[1];

        falloutFactory = (await ethers.getContractFactory(
            'Fallout',
            deployerWallet
        )) as Fallout__factory;

        fallout = (await falloutFactory.deploy()) as Fallout;

        expect(fallout.address).to.be.properAddress;
    });

    describe('Function tests', async () => {
        it('User is not owner', async () => {
            expect(await fallout.owner()).to.not.equal(userWallet.address);
        });
    });

    describe('User becomes Owner by calling Fal1out', async () => {
        it('User calls Fal1out to become owner', async () => {
            // User is not owner
            expect(await fallout.owner()).to.not.equal(userWallet.address);

            // User calls Fal1out
            await fallout.connect(userWallet).Fal1out();

            // User is now owner
            expect(await fallout.owner()).to.equal(userWallet.address);
        });
    });
});


