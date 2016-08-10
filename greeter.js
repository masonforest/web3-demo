var Web3 = require('web3');
var web3 = new Web3();
var fs = require("fs");
var Promise = require('bluebird');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

web3.eth.compile.solidity = Promise.promisify(web3.eth.compile.solidity);
web3.eth.getAccounts = Promise.promisify(web3.eth.getAccounts);

var greeterSource = fs.readFileSync('./sol/EthUSD.sol', 'utf8');
web3.eth.compile.solidity(greeterSource).then((greeter) => {
  return [greeter, web3.eth.contract(greeter.info.abiDefinition)];
}).spread((greeter, greeterContract) => {
  web3.eth.getAccounts().then((accounts) => {
  greeterContract.new(
    "Hello World!",
    {
      from: accounts[0],
      data: greeter.code,
      gas: 300000
    }, function(e, contract){
      if(!e) {

        if(!contract.address) {
          console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

        } else {
          console.log("Contract mined! Address: " + contract.address);
        }
      }
    });
  });
});

