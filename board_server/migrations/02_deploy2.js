// sol파일을 지정
const user = artifacts.require("./User")

module.exports = function(deployer){
    deployer.deploy(user)
    .then(function(){
        console.log("Deployed")
    })
}