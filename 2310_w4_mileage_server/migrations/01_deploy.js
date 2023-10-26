// solidity 파일을 로드하는 기본 경로는 ./contracts
const mileage = artifacts.require("./Mileage")

module.exports = function(deployer){
    deployer.deploy(mileage)
    .then(function(){
        console.log('Contract Deployed')
    })
}