const LimeToken = artifacts.require('../../contracts/LimeToken.sol');

const assertRevert = require('../utils/assertRevert');
const constants = require('../utils/constants');
const increaseTime = require('../utils/increaseTime');

contract('LimeToken', ([owner, other]) => {
	let sut;

	before(() => {
		web3.eth.defaultAccount = owner;
	});

	beforeEach(async () => {
		sut = await LimeToken.new(100);
	});

	describe('name should', async () => {

		it('be properly set on instantiation', async () => {
			const result = await sut.name.call();

			assert.equal(result, 'LimeChain Exam Token');
		});
	});

	describe('symbol should', async () => {

		it('be properly set on instantiation', async () => {
			const result = await sut.symbol.call();

			assert.equal(result, 'LET');
		});
	});

	describe('decimals should', async () => {

		it('be properly set on instantiation', async () => {
			const result = await sut.decimals.call();

			assert.equal(result, 18);
		});
	});

	describe('totalSupply should', async () => {

		it('be properly set on instantiation', async () => {
			const defaultTotalSupply = 100e18;

			const result = await sut.totalSupply.call();

			assert.equal(result, defaultTotalSupply);
		});
	});

	describe('transferAllowedAfter should', async () => {

		it('be properly set on instantiation', async () => {
			const tx = await web3.eth.getTransaction(sut.transactionHash);
			const block = await web3.eth.getBlock(tx.blockNumber);
			const now = block.timestamp;

			const result = await sut.transferAllowedAfter.call();

			assert.equal(result, now + constants.days(30));
		});
	});

	describe('transfer should', async () => {

		it('revert when invoked during the token sale', async () => {
			const transferValue = 100;

			const result = sut.transfer(other, transferValue);

			await assertRevert(result);
		});

		it('not revert when invoked after the token sale end', async () => {
			const transferValue = 100;

			await increaseTime(constants.days(30 + 1));

			await sut.transfer(other, transferValue);

			const result = await sut.balanceOf.call(other);

			assert.equal(result, transferValue);
		});
	});

	describe('transferFrom should', async () => {

		it('revert when invoked during the token sale', async () => {
			const transferValue = 100;
		
			await sut.approve(other, transferValue);

			await increaseTime(constants.days(30 + 1));

			const result = sut.transferFrom(owner, other, transferValue, { from: other });

			await assertRevert(result);
		});
	});
});
