// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const GRF_ADDRESS = "0x7Ee3809B59d2Fa34F6641Bc7d279E12209C7060e";
const RHN_ADDRESS = "0xf5a6D032209e60E6D7E52839fb954CF4c728Da0A";

async function main() {
  const DecentralizedExchange = await hre.ethers.getContractFactory(
    "DecentralizedExchange"
  );
  const decentralizedExchange = await DecentralizedExchange.deploy(
    ethers.utils.hexlify(GRF_ADDRESS),
    ethers.utils.hexlify(RHN_ADDRESS),
    3
  );

  const rev = await decentralizedExchange.deployed();

  console.log(`Exchange deployed to ${decentralizedExchange.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
