const account = artifacts.require('Account')

module.exports = function(deployer){
    deployer.deploy(account)
}