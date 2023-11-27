const Survey = artifacts.require('Survey')

module.exports = function(deployer){
    deployer.deploy(Survey)
    .then(function(){
        console.log('Contract deployed')
    })
}