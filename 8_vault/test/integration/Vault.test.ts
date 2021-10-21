import { ethers } from 'hardhat';
import chai from 'chai';
import { Vault__factory, Vault } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { TransactionResponse, TransactionReceipt } from '@ethersproject/abstract-provider';
import { getDefaultProvider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';

const { expect } = chai;

let vaultContract: Vault;
let vaultContractFactory: Vault__factory;
let wallets: SignerWithAddress[];
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('Vault Tests', () => {
    // Create password, must be less than 32 bytes or 32 characters
    const thePassword = '230489sdfh230489sdfh230489sdfh$';
    beforeEach(async () => {
        wallets = await ethers.getSigners();
        deployerWallet = wallets[0];
        userWallet = wallets[1];

        vaultContractFactory = (await ethers.getContractFactory(
            'Vault',
            deployerWallet
        )) as Vault__factory;

        vaultContract = (await vaultContractFactory.deploy(ethers.utils.formatBytes32String(thePassword))) as Vault;
    });

    describe('Function tests', async () => {
        it('can read public variable directly', async () => {          
            expect(await vaultContract.locked()).to.be.equal(true);  
        });
        it('can read locked variable from storage', async () => {          
            const abicoder = new ethers.utils.AbiCoder();
            expect(await ethers.provider.getStorageAt(vaultContract.address, 0)).to.be.equal(abicoder.encode(["bool"], [true]));  
        });
        it('can read password variable from storage', async () => {          
            expect(await ethers.provider.getStorageAt(vaultContract.address, 1)).to.be.equal(ethers.utils.formatBytes32String(thePassword));  
        });
        it('unlock Contract', async () => {          
            // is locked
            expect(await vaultContract.locked()).to.be.equal(true);

            expect(await ethers.provider.getStorageAt(vaultContract.address, 1)).to.be.equal(ethers.utils.formatBytes32String(thePassword));

            //Unlock
            const tx: TransactionResponse = await vaultContract.connect(userWallet).unlock(ethers.utils.formatBytes32String(thePassword));
            const contractReceipt: TransactionReceipt = await tx.wait();
            expect(contractReceipt.status).to.be.equal(1);
            
            // is unlocked
            expect(await vaultContract.locked()).to.be.equal(false);       
        });
    });
});


