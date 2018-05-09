const LimeCrowdsale = artifacts.require('./fakes/LimeCrowdsaleMock.sol');

const assertRevert = require('../utils/assertRevert');
const constants = require('../utils/constants');
const increaseTime = require('../utils/increaseTime');

contract('LimeCrowdsale', ([owner, other]) => {
	let sut;

	before(() => {
		web3.eth.defaultAccount = owner;
	});

	beforeEach(async () => {
		sut = await LimeCrowdsale.new();
	});

	it('saleStart should be properly set on instantiation', async () => {
		const tx = await web3.eth.getTransaction(sut.transactionHash);
		const block = await web3.eth.getBlock(tx.blockNumber);
		const now = block.timestamp;

		const result = await sut.saleStart.call();

		assert.equal(result, now);
	});

	it('saleEnd should be properly set on instantiation', async () => {
		const tx = await web3.eth.getTransaction(sut.transactionHash);
		const block = await web3.eth.getBlock(tx.blockNumber);
		const now = block.timestamp;

		const result = await sut.saleEnd.call();

		assert.equal(result, now + constants.days(30));
	});

	it('firstPhaseEnd and secondPhaseEnd should be properly set on instantiation', async () => {
		const tx = await web3.eth.getTransaction(sut.transactionHash);
		const block = await web3.eth.getBlock(tx.blockNumber);
		const now = block.timestamp;

		const firstPhaseEndResult = await sut.firstPhaseEnd.call();
		const secondPhaseEndResult = await sut.secondPhaseEnd.call();

		assert.equal(firstPhaseEndResult, now + constants.days(7));
		assert.equal(secondPhaseEndResult, now + constants.days(7) + constants.days(7));
	});

	it('buyTokens should transfer exact amount of tokens when called during the first phase, when total balance is less than or equal to 10ETH.', async () => {
		await sut.mint(sut.address, 500e18);

		await sut.buyTokens({ value: 1e18 });

		const result = await sut.token.balanceOf.call(owner);

		assert.equal(result, 500e18);
	});

	it('buyTokens should transfer exact amount of tokens when called during the first phase, when total balance is greater than or equal to 10ETH.', async () => {

		await web3.eth.sendTransaction({ to: sut.address, value: 1e18 });
		await sut.mint(sut.address, 300e18);

		await sut.buyTokens({ value: 1e18 });

		const result = await sut.token.balanceOf.call(owner);

		assert.equal(result, 300e18);
	});

	it('buyTokens should transfer exact amount of tokens when called during the first phase, when total balance is less than 10ETH before the transfer and more than 10ETH after the transfer', async () => {
		await web3.eth.sendTransaction({ to: sut.address, value: 8e18 });
		await sut.mint(sut.address, 1600e18);

		await sut.buyTokens({ value: 4e18 });

		const result = await sut.token.balanceOf.call(owner);

		assert.equal(result, 1600e18);
	});

	it('buyTokens should transfer exact amount of tokens when called during the second phase, when total balance is less than or equal to 30ETH.', async () => {
		await sut.mint(sut.address, 400e18);
		await increaseTime(constants.days(7));

		await sut.buyTokens({ value: 2e18 });

		const result = await sut.token.balanceOf.call(owner);

		assert.equal(result, 400e18);
	});

	it('buyTokens should transfer exact amount tokens when called during the second phase, when contract balance is greater than or equal to 30ETH.', async () => {
		await web3.eth.sendTransaction({ to: sut.address, value: 35e18 });
		await sut.mint(sut.address, 150e18);
		await increaseTime(constants.days(7));

		await sut.buyTokens({ value: 1e18 });

		const result = await sut.token.balanceOf.call(owner);

		assert.equal(result, 150e18);
	});

	it('buyTokens should transfer exact amount tokens when called during the second phase, when total balance is less than 30ETH before the transfer and more than 30ETH after the transfer', async () => {
		await web3.eth.sendTransaction({ to: sut.address, value: 28e18 });
		await sut.mint(sut.address, 700e18);
		await increaseTime(constants.days(7));

		await sut.buyTokens({ value: 4e18 });

		const result = await sut.token.balanceOf.call(owner);

		assert.equal(result, 700e18);
	});

	it('buyTokens should transfer exact amount tokens when called during the third phase', async () => {
		await sut.mint(sut.address, 100e18);
		await increaseTime(constants.days(15));

		await sut.buyTokens({ value: 1e18 });

		const result = await sut.token.balanceOf.call(owner);

		assert.equal(result, 100e18);
	});

	it('buyTokens should decrease the token balance with exact amount bought', async () => {
		await sut.mint(sut.address, 542e18);

		await sut.buyTokens({ value: 1e18 });

		const result = await sut.balanceOf.call(sut.address);

		assert.equal(result, 42e18);
	});

	it('buyTokens should increase the sender token balance with exact amount', async () => {
		const oldBalance = await sut.balanceOf.call(owner);
		await sut.mint(sut.address, 500e18);

		await sut.buyTokens({ value: 1e18 });

		const newBalance = await sut.token.balanceOf.call(owner);

		assert.equal(oldBalance, 0);
		assert.equal(newBalance, 500e18);
	});

	it('buyTokens should revert when the contract does not have enough balance', async () => {
		const result = sut.buyTokens({ value: 1e18 });

		await assertRevert(result);
	});

	it('buyTokens should revert when called after the token sale end', async () => {
		await sut.mint(sut.address, 500e18);
		await increaseTime(constants.days(31));

		const result = sut.buyTokens({ value: 1e18 });

		await assertRevert(result);
	});
});
