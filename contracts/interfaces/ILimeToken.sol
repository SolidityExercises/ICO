interface ILimeToken {
        function mintTokens(
                address _to,
                uint256 _amount
        ) external returns(bool);

	function transfer(
                address _to,
                uint256 _value
        ) external returns(bool);

	function transferFrom(
                address _from,
		address to,
                uint256 _value
        ) external returns(bool);

	function saleTransfer(
		address _to, 
		uint256 _value
	) external returns(bool);
}
