const mileage = artifacts.require("./Mileage")

module.exports = function(deployer){
    deployer.deploy(mileage)
    .then(function(){
        console.log('Contract Deployed')
    })
}