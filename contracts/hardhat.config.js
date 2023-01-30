require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

const FUJI_PRIVATE_KEY = process.env.FUJI_PRIVATE_KEY;
const API_KEY = process.env.API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [FUJI_PRIVATE_KEY],
      chainId: 43113,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: API_KEY,
  },
  solidity: "0.8.17",
};
