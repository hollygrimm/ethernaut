import { ethers } from 'hardhat';
import chai from 'chai';
import { King__factory, PwnKing__factory, King, PwnKing } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';

const { expect } = chai;

let contract: King;
let contractFactory: King__factory;
let pwnContract: PwnKing;
let pwnContractFactory: PwnKing__factory;
let wallets: SignerWithAddress[];
let deployerWallet: SignerWithAddress;
let userWallet: SignerWithAddress;

describe('PwnKing Tests', () => {
    beforeEach(async () => {
        wallets = await ethers.getSigners();
        deployerWallet = wallets[0];
        userWallet = wallets[1];
        contractFactory = (await ethers.getContractFactory(
            'King',
            deployerWallet
        )) as King__factory;

        const oneEth: BigNumber = ethers.BigNumber.from('1000000000000000000');
        contract = (await contractFactory.deploy({ value: oneEth })) as King;

        expect(contract.address).to.be.properAddress;

        pwnContractFactory = (await ethers.getContractFactory(
            'PwnKing',
            deployerWallet
        )) as PwnKing__factory;

        pwnContract = (await pwnContractFactory.deploy(contract.address)) as PwnKing;

        expect(pwnContract.address).to.be.properAddress;
    });

    describe('Function tests', async () => {
        it('Player can become king if they send enough', async () => {
            // Send 1 ETH
            const enoughEthToBecomeKing: BigNumber = ethers.BigNumber.from('1000000000000000000');

            expect(await contract._king()).equal(deployerWallet.address);

            await (userWallet.sendTransaction)({
                to: contract.address,
                value: enoughEthToBecomeKing
            })
            expect(await contract._king()).equal(userWallet.address);
            expect(await contract.prize()).equal(enoughEthToBecomeKing);
        }),
            it('Player cannot become king if they do not send enough', async () => {
                // Send .1 ETH
                const notenoughEthToBecomeKing: BigNumber = ethers.BigNumber.from('100000000000000000');

                expect(await contract._king()).equal(deployerWallet.address);

                await expect((userWallet.sendTransaction)({
                    to: contract.address,
                    value: notenoughEthToBecomeKing
                })).to.be.revertedWith('');
                expect(await contract._king()).equal(deployerWallet.address);

                // reverted, so prize equal to initial deployed amount
                const oneEth: BigNumber = ethers.BigNumber.from('1000000000000000000');
                expect(await contract.prize()).equal(oneEth);
            }),
            it('Pwn', async () => {
                // Send enough ETH to make PwnContract become King
                const enoughEthToBecomeKing: BigNumber = ethers.BigNumber.from('1000000000000000000');
                await pwnContract.pwn({ value: enoughEthToBecomeKing });

                // PwnContract Address is new owner
                console.log(`PwnContract address is owner: ${pwnContract.address}`);
                expect(await contract._king()).equal(pwnContract.address);
                expect(await contract.prize()).equal(enoughEthToBecomeKing);

                console.log(`\nBreak contract...`)

                // Have deployerWallet take back over kingship from PwnContract, but tx is reverted
                await expect(deployerWallet.call({to: contract.address, value: enoughEthToBecomeKing})).to.be.revertedWith('');

                // pwnContract still owner
                expect(await contract._king()).equal(pwnContract.address);
            });
    });
});


