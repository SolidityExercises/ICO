const LimeToken = artifacts.require('./fakes/LimeTokenMock.sol');

const assertRevert = require('../utils/assertRevert');
const constants = require('../utils/constants');

contract('LimeTokenTest', ([owner, other]) => {
	let sut;

	before(() => {
		web3.eth.defaultAccount = owner;
	});

	beforeEach(async () => {
		sut = await LimeToken.new(5, {from: owner});
	});

	it('name Should be properly set on instantiation', async () => {
		const result = await sut.name.call();

		assert.equal(result, 'LimeChain Exam Token');
	});

	it('symbol Should be properly set on instantiation', async () => {
		const result = await sut.symbol.call();

		assert.equal(result, 'LET');
	});

	it('decimals Should be properly set on instantiation', async () => {
		const result = await sut.decimals.call();

		assert.equal(result, 18);
	});

	it('totalSupply Should be properly set on instantiation', async () => {
		const defaultTotalSupply = 1000000;

		const result = await sut.totalSupply.call();

		assert.equal(result, defaultTotalSupply);
	});

	it('investmentAllowedAfter Should be properly set on instantiation', async () => {
		const tx = await web3.eth.getTransaction(sut.transactionHash);
		const block = await web3.eth.getBlock(tx.blockNumber);
		const now = block.timestamp;

		const result = await sut.investmentAllowedAfter.call();

		assert.equal(result, now + constants.days(30));
	});

	it('transfer Should revert when invoked during the token sale', async () => {
		const transferValue = 100;
		await sut.mint(owner, transferValue);

		const result = sut.transfer(other, transferValue);

		await assertRevert(result);
	});

	it('transfer Should not revert when invoked after the token sale end', async () => {
		const transferValue = 100;
		await sut.mint(owner, transferValue);
		await increaseTime(constants.days(30));

		await sut.transfer(other, transferValue);

		const result = await sut.balanceOf.call(other);

		assert.equal(result, transferValue);
	});

	it('transferFrom Should revert when invoked during the token sale', async () => {
		const transferValue = 100;
		await sut.mint(owner, transferValue);
		await sut.approve(other, transferValue);

		const result = sut.transferFrom(owner, other, transferValue, { from: other });

		await assertRevert(result);
	});

	it('transferFrom Should not revert when invoked after the token sale end', async () => {
		const transferValue = 100;
		await sut.mint(owner, transferValue);
		await sut.approve(other, transferValue);
		await increaseTime(constants.days(30));

		await sut.transferFrom(owner, other, transferValue, { from: other });
		const result = await sut.balanceOf.call(other);

		assert.equal(result, transferValue);
	});
});
