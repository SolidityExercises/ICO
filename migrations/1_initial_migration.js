var Migrations = artifacts.require("./Migrations.sol");
const MintableToken = artifacts.require("../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol");
const LimeToken = artifacts.require("../contracts/LimeToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MintableToken);
  deployer.link(MintableToken, LimeToken); 
  deployer.deploy(LimeToken, 5);
};
