import { ethers } from 'hardhat';
import chai from 'chai';
import { Telephone__factory, PwnTelephone__factory, Telephone, PwnTelephone } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

const { expect } = chai;

let contract: Telephone;
let contractFactory: Telephone__factory;
let pwnContract: PwnTelephone;
let pwnContractFactory: PwnTelephone__factory;
let wallets: SignerWithAddress[];
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('PwnTelephone Tests', () => {
    beforeEach(async () => {
        wallets = await ethers.getSigners();
        deployerWallet = wallets[0];
        userWallet = wallets[1];
        contractFactory = (await ethers.getContractFactory(
            'Telephone',
            deployerWallet
        )) as Telephone__factory;

        contract = (await contractFactory.deploy()) as Telephone;

        expect(contract.address).to.be.properAddress;

        pwnContractFactory = (await ethers.getContractFactory(
            'PwnTelephone',
            deployerWallet
        )) as PwnTelephone__factory;

        pwnContract = (await pwnContractFactory.deploy(contract.address)) as PwnTelephone;

        expect(pwnContract.address).to.be.properAddress;
    });

    describe('Function tests', async () => {
        it('Claim Ownership', async () => {
            const prevOwner: string = await contract.owner();
            console.log(`Prev owner: ${prevOwner}`);
          
            await expect(prevOwner).to.not.be.equal(userWallet.address);

            await pwnContract.connect(userWallet).changeOwner(userWallet.address);

            const newOwner: string = await contract.owner();
            console.log(`New owner: ${newOwner}`);
          
            await expect(newOwner).to.be.equal(userWallet.address);
        });
    });
});


