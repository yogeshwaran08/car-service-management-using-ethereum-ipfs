const CarServiceContract = artifacts.require("CarServiceContract");

module.exports = function(deployer) {
  deployer.deploy(CarServiceContract);
};
