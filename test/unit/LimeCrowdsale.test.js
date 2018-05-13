const LimeToken = artifacts.require('../../contracts/LimeToken.sol');
const LimeCrowdsale = artifacts.require('../../contracts/LimeCrowdsale.sol');

const assertRevert = require('../utils/assertRevert');
const constants = require('../utils/constants');
const increaseTime = require('../utils/increaseTime');

contract('LimeCrowdsale', ([owner, other, token, wallet]) => {
	let sut, limeToken;

	before(() => {
		web3.eth.defaultAccount = owner;
	});

	beforeEach(async () => {
		limeToken = await LimeToken.new(0);
		sut = await LimeCrowdsale.new(limeToken.address, wallet);
		limeToken.setTokenSaleContract(sut.address);
	});

	describe('saleStart should', async () => {

		it('be properly set on instantiation', async () => {
			const tx = await web3.eth.getTransaction(sut.transactionHash);
			const block = await web3.eth.getBlock(tx.blockNumber);
			const now = block.timestamp;

			const result = await sut.saleStart.call();

			assert.equal(result, now);
		});
	});

	describe('saleEnd should', async () => {

		it('be properly set on instantiation', async () => {
			const tx = await web3.eth.getTransaction(sut.transactionHash);
			const block = await web3.eth.getBlock(tx.blockNumber);
			const now = block.timestamp;

			const result = await sut.saleEnd.call();

			assert.equal(result, now + constants.days(30));
		});
	});

	describe('firstPhaseEnd and secondPhaseEnd should', async () => {

		it('be properly set on instantiation', async () => {
			const tx = await web3.eth.getTransaction(sut.transactionHash);
			const block = await web3.eth.getBlock(tx.blockNumber);
			const now = block.timestamp;

			const firstPhaseEndResult = await sut.firstPhaseEnd.call();
			const secondPhaseEndResult = await sut.secondPhaseEnd.call();

			assert.equal(firstPhaseEndResult, now + constants.days(7));
			assert.equal(secondPhaseEndResult, now + constants.days(7) + constants.days(7));
		});
	});

	describe('buyTokens should', async () => {

		it('transfer exact amount of tokens when called during the first phase, when total balance is less than or equal to 10ETH.', async () => {
			limeToken.mintTokens(owner, 500e18);
			await sut.buyTokens({ value: 1e18, from: other});

			const ownerExpectedBalance = await limeToken.balanceOf.call(other);

			assert.equal(ownerExpectedBalance.valueOf(), 500e18);
		});

		it('transfer exact amount of tokens when called during the first phase, when total balance is greater than or equal to 10ETH.', async () => {
			await web3.eth.sendTransaction({ to: sut.address, value: 11e18 });
			limeToken.mintTokens(owner, 300e18);

			await sut.buyTokens({ value: 1e18, from: other });

			const ownerExpectedBalance = await limeToken.balanceOf.call(other);

			assert.equal(ownerExpectedBalance.valueOf(), 300e18);
		});

		it('transfer exact amount of tokens when called during the first phase, when total balance is less than 10ETH before the transfer and more than 10ETH after the transfer', async () => {
			await web3.eth.sendTransaction({ to: sut.address, value: 8e18 });
			limeToken.mintTokens(owner, 1600e18);

			await sut.buyTokens({ value: 4e18, from: other });

			const ownerExpectedBalance = await limeToken.balanceOf.call(other);

			assert.equal(ownerExpectedBalance.valueOf(), 1600e18);
		});

		it('transfer exact amount of tokens when called during the second phase, when total balance is less than or equal to 30ETH.', async () => {
			limeToken.mintTokens(owner, 400e18);
			await increaseTime(constants.days(7+1));

			await sut.buyTokens({ value: 2e18, from: other });

			const ownerExpectedBalance = await limeToken.balanceOf.call(other);

			assert.equal(ownerExpectedBalance.valueOf(), 400e18);
		});

		it('transfer exact amount tokens when called during the second phase, when contract balance is greater than or equal to 30ETH.', async () => {
			await web3.eth.sendTransaction({ to: sut.address, value: 35e18 });
			limeToken.mintTokens(owner, 150e18);
			await increaseTime(constants.days(7+1));

			await sut.buyTokens({ value: 1e18, from: other });

			const ownerExpectedBalance = await limeToken.balanceOf.call(other);

			assert.equal(ownerExpectedBalance.valueOf(), 150e18);
		});

		it('transfer exact amount tokens when called during the second phase, when total balance is less than 30ETH before the transfer and more than 30ETH after the transfer', async () => {
			await web3.eth.sendTransaction({ to: sut.address, value: 28e18 });
			limeToken.mintTokens(owner, 700e18);
			await increaseTime(constants.days(7+1));

			await sut.buyTokens({ value: 4e18, from: other });

			const ownerExpectedBalance = await limeToken.balanceOf.call(other);

			assert.equal(ownerExpectedBalance.valueOf(), 700e18);
		});

		it('transfer exact amount tokens when called during the third phase', async () => {
			limeToken.mintTokens(owner, 100e18);
			await increaseTime(constants.days(15));

			await sut.buyTokens({ value: 1e18, from: other });

			const ownerExpectedBalance = await limeToken.balanceOf.call(other);

			assert.equal(ownerExpectedBalance.valueOf(), 100e18);
		});

		it('decrease the token balance with exact amount bought', async () => {
			limeToken.mintTokens(owner, 542e18);

			await sut.buyTokens({ value: 1e18, from: other });

			const ownerExpectedBalance = await limeToken.balanceOf.call(owner);

			assert.equal(ownerExpectedBalance.valueOf(), 42e18);
		});

		it('increase the sender token balance with exact amount', async () => {
			const oldBalance = await limeToken.balanceOf.call(other);
			limeToken.mintTokens(owner, 500e18);

			await sut.buyTokens({ value: 1e18, from: other});

			const newBalance = await limeToken.balanceOf.call(other);

			assert.equal(oldBalance, 0);
			assert.equal(newBalance, 500e18);
		});

		it('revert when the contract does not have enough balance', async () => {
			const result = sut.buyTokens({ value: 1e18, from: other });

			await assertRevert(result);
		});

		it('revert when called after the token sale end', async () => {
			limeToken.mintTokens(owner, 500e18);
			await increaseTime(constants.days(31));

			const result = sut.buyTokens({ value: 1e18, from: other });

			await assertRevert(result);
		});
	});	
});
