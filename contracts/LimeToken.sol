pragma solidity ^0.4.18;

import '../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract LimeToken is MintableToken {
        string public name = 'LimeChain Exam Token';
        string public symbol = 'LET';
        uint8 public constant decimals = 18;

        uint256 public investmentAllowedAfter;

        modifier onlyIfInvestmentAllowed() {
                require(now >= investmentAllowedAfter);
	        _;
        }

        function transfer(address _to, uint256 _value) public onlyIfInvestmentAllowed returns (bool) {
	        return super.transfer(_to, _value);
        }

        function transferFrom(address _from, address _to, uint256 _value) public onlyIfInvestmentAllowed returns (bool) {
	        return super.transferFrom(_from, _to, _value);
        }

        constructor (uint256 _investmentAllowedAfter) public {
	        //contract cannot assume the balance is zero upon creation
	        require(address(this).balance == 0);
	        require(mint(msg.sender, 1000000));

	        investmentAllowedAfter = _investmentAllowedAfter;

	        emit Mint(msg.sender, 1000000);
        }
}
