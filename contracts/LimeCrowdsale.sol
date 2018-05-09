pragma solidity ^0.4.21;

import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import './LimeToken.sol';

contract LimeCrowdsale {
    using SafeMath for uint256;

    event TokensBought(address from, address  to, uint256 amount);

    LimeToken token;

    address public wallet;
    uint256 public totalWeiRaised;

    // start and end timestamps where investments are allowed (both inclusive)
    uint256 public saleStart;
    uint256 public saleEnd;

    // end timestamps for the two phases where rates for the investments are changed (both inclusive)
    uint256 public firstPhaseEnd;
    uint256 public secondPhaseEnd;

    constructor (address _wallet) public {
	    //contract cannot assume the balance is zero upon creation
	    require(address(this).balance == 0);
	    require(_wallet != address(0));

	    wallet = _wallet;
		
	    saleStart = now;
	    saleEnd = saleStart + 30 days;

	    firstPhaseEnd = saleStart + 7 days;
	    secondPhaseEnd = firstPhaseEnd + 7 days;

	    token = new LimeToken(saleEnd);
    }

    function () external payable {
        totalWeiRaised = totalWeiRaised.add(msg.value);
        _forwardFunds();
    }

    modifier beforeSaleEnd() {
	require(now <= saleEnd);
	_;
    }

    function buyTokens() public payable beforeSaleEnd returns (bool) {
	    require(msg.value != 0);

	    uint256 tokenAmount = getTokenAmount(msg.value);

	    totalWeiRaised = totalWeiRaised.add(msg.value);

	    token.transfer(msg.sender, tokenAmount);

	    emit TokensBought(address(this), msg.sender, msg.value);

	    _forwardFunds();

	    return true;
    }

    function getTokenAmount(uint256 _weiAmount) public view beforeSaleEnd returns(uint256) {
            uint256 currentPhaseRate = 100;
	    uint256 nextPhaseRate;

	    uint256 currentPhaseWei;
	    uint256 nextPhaseWei;

	    uint256 tokensAmount;

	    if(now <= firstPhaseEnd){
	        phaseEtherCap = 10 ether;
	        currentPhaseRate = 500;
	        nextPhaseRate = 300;
	    } else if (now > firstPhaseEnd && now <= secondPhaseEnd) {
	        phaseEtherCap = 30 ether;
	        currentPhaseRate = 200;
	        nextPhaseRate = 150;
	    }

	    if(phaseEtherCap < totalWeiRaised){
            currentPhaseRate = nextPhaseRate;
	    }

            // case when wei amount should be split and converted between two phases using different rate for each one
	    if(totalWeiRaised < phaseEtherCap && totalWeiRaised + _weiAmount > phaseEtherCap){
		    nextPhaseWei = (totalWeiRaised +  _weiAmount) - phaseEtherCap;
		    currentPhaseWei = phaseEtherCap - totalWeiRaised;
		    tokensAmount = _calculateTokenAmount(currentPhaseWei, currentPhaseRate).add(_calculateTokenAmount(nextPhaseWei, nextPhaseRate));
	    } else {
		    tokensAmount = _calculateTokenAmount(_weiAmount, currentPhaseRate);
	    }

	    return tokensAmount;
    }

    function _calculateTokenAmount(uint256 _weiAmount, uint256 _rate) private pure returns (uint256) {
	    return _weiAmount.mul(_rate);
    }

    function _forwardFunds() internal {
            wallet.transfer(msg.value);
    }
}
