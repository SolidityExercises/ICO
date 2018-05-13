pragma solidity ^0.4.18;

import '../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract LimeToken is MintableToken {
        string public name = 'LimeChain Exam Token';
        string public symbol = 'LET';
        uint8 public constant decimals = 18;

	address public tokenSaleContract;

	uint256 public transferAllowedAfter;

	modifier onlyWhenTransferAllowed() {
		require(transferAllowedAfter < now);
		require(msg.sender == tokenSaleContract || msg.sender == owner);
		_;
	}

	function setTokenSaleContract(address _tokenSaleContract) public onlyOwner {
		tokenSaleContract = _tokenSaleContract;
	}

	function mintTokens(address _to, uint256 _amount) public onlyOwner returns (bool) {
		return super.mint(_to, _amount);
	}

	function saleTransfer(address _to, uint256 _value) public returns (bool) {
		require(msg.sender == tokenSaleContract || msg.sender == owner);
		require(balances[owner] >= _value);

		balances[owner] -= _value; // can not underflow

		balances[_to] = balances[_to].add(_value);

		emit Transfer(owner, _to, _value);

		return true;
	}

        function transfer(address _to, uint256 _value) public onlyWhenTransferAllowed returns (bool) {
	        return super.transfer(_to, _value);
        }

	// transferFrom is forbidden to be called from other than the owner/crowdsale as it is considered deprecated
	// https://github.com/trustlines-network/contracts/issues/16
        function transferFrom(address _from, address _to, uint256 _value) public onlyWhenTransferAllowed returns (bool) {
	        return super.transferFrom(_from, _to, _value);
        }

	constructor(uint256 _tokenTotalAmount) public {
		totalSupply_ = _tokenTotalAmount * (10 ** uint256(decimals));

		balances[msg.sender] = totalSupply_;

		transferAllowedAfter = now + 30 days;

		emit Transfer(address(0x0), msg.sender, totalSupply_);
	}
}
