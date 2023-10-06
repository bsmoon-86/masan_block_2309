const board = artifacts.require('Board')

module.exports = function(deployer){
    deployer.deploy(board)
    .then(function(){
        console.log('Contract deploy')
    })
}