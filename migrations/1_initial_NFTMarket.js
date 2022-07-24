const nFTMarketPlace = artifacts.require("../contracts/NFTMarketPlace.sol");

module.exports = function (deployer) {
  deployer.deploy(nFTMarketPlace);
};
