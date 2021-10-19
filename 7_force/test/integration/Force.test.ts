import { ethers } from 'hardhat';
import chai from 'chai';
import { Force__factory, PwnForce__factory, Force, PwnForce } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';

const { expect } = chai;

let contract: Force;
let contractFactory: Force__factory;
let pwnContract: PwnForce;
let pwnContractFactory: PwnForce__factory;
let wallets: SignerWithAddress[];
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('PwnForce Tests', () => {
    beforeEach(async () => {
        wallets = await ethers.getSigners();
        deployerWallet = wallets[0];
        userWallet = wallets[1];
        contractFactory = (await ethers.getContractFactory(
            'Force',
            deployerWallet
        )) as Force__factory;

        contract = (await contractFactory.deploy()) as Force;

        expect(contract.address).to.be.properAddress;

        pwnContractFactory = (await ethers.getContractFactory(
            'PwnForce',
            deployerWallet
        )) as PwnForce__factory;

        pwnContract = (await pwnContractFactory.deploy(contract.address)) as PwnForce;

        expect(pwnContract.address).to.be.properAddress;
    });

    describe('Function tests', async () => {
        it('Cannot send money to fallback function on Force contract', async () => {
            const amt: BigNumber = ethers.BigNumber.from('1');
            await expect(contract.connect(userWallet).fallback({ value: amt })).to.be.revertedWith('function selector was not recognized and there\'s no fallback nor receive function');
        });
        it('Cannot sendTransaction to Force contract', async () => {
            const amt: BigNumber = ethers.BigNumber.from('1');
            await expect(userWallet.sendTransaction({ to: contract.address, value: amt})).to.be.revertedWith('function selector was not recognized and there\'s no fallback nor receive function');
        });
        it('Add money to pwnForce contract, call selfdestruct and send money to force', async () => {
            // Balance on Force Contract is zero
            expect(await ethers.provider.getBalance(contract.address)).to.be.equal(0);

            // send 10 wei to the Pwn Force Contract
            const amt: BigNumber = ethers.BigNumber.from('10');
            await expect(pwnContract.connect(userWallet).collect({ value: amt})).to.emit(pwnContract, 'BalanceUpdated').withArgs(amt);

            // call selfdestruct and send money to the Force Contract
            await pwnContract.connect(userWallet).selfDestroy();

            // check balance on the Force Contract
            const forceContractBal = await ethers.provider.getBalance(contract.address);
            console.log(`New Contract Balance: ${ethers.utils.formatEther(forceContractBal)}`);
            expect(forceContractBal).to.be.equal(amt);
        });
    });
});


