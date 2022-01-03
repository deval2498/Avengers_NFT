require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config()
 const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
 const MNEMONIC = process.env.MNEMONIC
 const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
module.exports = {
  solidity: {
    compilers: [
      {version : "0.8.4"},{version: "0.4.11"},{version: "0.6.6"},{version: "0.7.0"},{version: "0.4.24"}
    ]
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  networks: {
    hardhat: {},
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [MNEMONIC]
    }
  }
};
