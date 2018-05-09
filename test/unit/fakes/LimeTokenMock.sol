pragma solidity ^0.4.18;

import '../../../contracts/LimeToken.sol';

contract LimeTokenMock is LimeToken {
 	modifier onlyIfInvestmentAllowed() {
                require(now >= 2);
	        _;
        }
}
