const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Decentralized Exchange", function () {
  var owner, account1, account2;
  var revoToken;
  var ownerContract, acc1Connection, acc2Connection;
  const ONE_GWEI = 1_000_000_000;

  async function deployContracts() {
    // Contracts are deployed using the first signer/account by default
    [owner, account1, account2] = await ethers.getSigners();

    const GRFTokenFactory = await ethers.getContractFactory("GRFToken");
    grfToken = await GRFTokenFactory.deploy();

    const RHNTokenFactory = await ethers.getContractFactory("RHNToken");
    rhnToken = await RHNTokenFactory.deploy();

    const DEXFactory = await ethers.getContractFactory("DecentralizedExchange");
    dex = await DEXFactory.deploy(grfToken.address, rhnToken.address, 3);
  }

  this.beforeAll(async () => {
    await deployContracts();
  });

  describe("Token Contracts", function () {
    describe("GRF Token", function () {
      it("Should assign 1000 * 10 ** 18 token to owner", async function () {
        let resString = (await grfToken.balanceOf(owner.address)).toString();

        let testInt = 1;
        for (let i = 0; i < 21; i++) {
          testInt += "0";
        }

        expect(resString).to.equal(testInt);
      });

      it("Faucet function sends 100 token", async function () {
        const acc1Connection = grfToken.connect(account1);

        await acc1Connection.faucet();

        let resString = (await grfToken.balanceOf(account1.address)).toString();

        let testInt = 1;
        for (let i = 0; i < 20; i++) {
          testInt += "0";
        }

        expect(resString).to.equal(testInt);
      });
    });

    describe("RHN Token", function () {
      it("Should assign 1000 * 10 ** 18 token to owner", async function () {
        let resString = (await rhnToken.balanceOf(owner.address)).toString();

        let testInt = 1;
        for (let i = 0; i < 21; i++) {
          testInt += "0";
        }

        expect(resString).to.equal(testInt);
      });

      it("Faucet function sends 100 token", async function () {
        const acc2Connection = rhnToken.connect(account2);

        await acc2Connection.faucet();

        let resString = (await rhnToken.balanceOf(account2.address)).toString();

        let testInt = 1;
        for (let i = 0; i < 20; i++) {
          testInt += "0";
        }

        expect(resString).to.equal(testInt);
      });
    });
  });

  describe("AMM functionality", function () {
    it("Adds Liquidty", async function () {
      await grfToken.approve(dex.address, ethers.utils.parseEther("100"));
      await rhnToken.approve(dex.address, ethers.utils.parseEther("100"));

      await dex.addLiquidity(
        ethers.utils.parseEther("100"),
        ethers.utils.parseEther("100")
      );

      expect((await dex.getReserveA()).toString()).to.equal(
        ethers.utils.parseEther("100")
      );
      expect((await dex.getReserveB()).toString()).to.equal(
        ethers.utils.parseEther("100")
      );
    });

    it("Checks Liquidity", async function () {
      expect((await dex.getReserveB()).toString()).to.equal(
        ethers.utils.parseEther("100")
      );
    });

    it("Swaps", async function () {
      await grfToken.approve(dex.address, ethers.utils.parseEther("50"));

      let r = await dex.swap(grfToken.address, ethers.utils.parseEther("50"));

      expect((await dex.getReserveA()).toString()).to.equal(
        ethers.utils.parseEther("150")
      );

      expect((await dex.getReserveB()).toString()).to.equal(
        ethers.utils.parseEther("67.340067340067340068")
      );
    });

    it("Mints shares", async function () {
      expect((await dex.getReserveA()).toString()).to.equal(
        ethers.utils.parseEther("150")
      );

      expect((await dex.getReserveB()).toString()).to.equal(
        ethers.utils.parseEther("67.340067340067340068")
      );
    });

    it("Calculates liquidty to add", async function () {
      let addressDex = dex.address;

      let grfBalance = await grfToken.balanceOf(addressDex);
      let rhnBalance = await rhnToken.balanceOf(addressDex);

      let tokenAmount = ethers.utils.parseEther("50");

      let resA = (rhnBalance * tokenAmount) / grfBalance;

      let contractResultA = await dex.calculateLiquidty(
        tokenAmount,
        grfToken.address
      );

      let resB = (grfBalance * tokenAmount) / rhnBalance;

      let contractResultB = await dex.calculateLiquidty(
        tokenAmount,
        rhnToken.address
      );

      expect(resA / contractResultA).to.equal(1);
      expect(resB / contractResultB).to.equal(1);
    });
  });
});
