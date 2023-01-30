import { ethers } from "ethers";

const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const DEX_ABI = require("./DexABI.json");
const GRF_ABI = require("./GRFABI.json");
const RHN_ABI = require("./RHNABI.json");

const dexAddress = "0x9f73371e74639e42007395083f054d7B637c8Cd7";
const grfAddress = "0x7Ee3809B59d2Fa34F6641Bc7d279E12209C7060e";
const rhnAddress = "0xf5a6D032209e60E6D7E52839fb954CF4c728Da0A";

export var dexContract;
export var grfContract;
export var rhnContract;

export var signer;
export var provider;
export var walletAddress;

export const connectWallet = async (setAdress) => {
  if (window.ethereum) {
    await window.ethereum.enable();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = await provider.getSigner();
    setAdress(await signer.getAddress());
    walletAddress = await signer.getAddress();

    dexContract = new ethers.Contract(dexAddress, DEX_ABI, signer);
    grfContract = new ethers.Contract(grfAddress, GRF_ABI, signer);
    rhnContract = new ethers.Contract(rhnAddress, RHN_ABI, signer);
  } else {
    return "You should install metamask";
  }
};

export const getCurrentWalletConnected = async (setAdress) => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = await provider.getSigner();
        walletAddress = await signer.getAddress();
        setAdress(walletAddress);

        dexContract = new ethers.Contract(dexAddress, DEX_ABI, signer);
        grfContract = new ethers.Contract(grfAddress, GRF_ABI, signer);
        rhnContract = new ethers.Contract(rhnAddress, RHN_ABI, signer);
      } else {
        return {
          address: "",
          status: "Connect Metamask",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "Error",
      };
    }
  } else {
    return {
      address: "",
      status: "Install Metamask",
    };
  }
};

export const getGRFBalance = async (_address, setBalance) => {
  var res = ethers.utils.formatEther(
    (await grfContract.balanceOf(_address)).toString()
  );
  setBalance(res);
};

export const getRHNBalance = async (_address, setBalance) => {
  var res = ethers.utils.formatEther(
    (await rhnContract.balanceOf(_address)).toString()
  );
  setBalance(res);
};

export const getFaucetTokens = async (_contract) => {
  await _contract.faucet();
};

export const faucetListen = async (_contract, setSth) => {
  if (_contract) {
    _contract.on("TokenSend", (address) => {
      if (address.toString() == walletAddress) {
        setSth();
      }
    });
  }
};

/// Swap

export const getAllowance = async (_contract, setAllowance) => {
  if (_contract) {
    var res = ethers.utils.formatEther(
      (
        await _contract.allowance(signer.getAddress(), dexContract.address)
      ).toString()
    );
    setAllowance(res);
  }
};

export const addAllowance = async (_contract) => {
  if (_contract) {
    await _contract.approve(
      dexContract.address,
      ethers.utils.parseEther("100000")
    );
  }
};

export const listenAllowanceEvent = async (setGRF, setRHN, setSuccess) => {
  if (grfContract) {
    grfContract.on("Approval", (owner, spender, amount) => {
      if (
        owner.toString() == walletAddress &&
        spender.toString() == dexAddress
      ) {
        setGRF(ethers.utils.formatEther(amount.toString()));
        setSuccess(true);
      }
    });
  }

  if (rhnContract) {
    rhnContract.on("Approval", (owner, spender, amount) => {
      if (
        owner.toString() == walletAddress &&
        spender.toString() == dexAddress
      ) {
        setRHN(ethers.utils.formatEther(amount.toString()));
        setSuccess(true);
      }
    });
  }
};

export const getReserves = async (setGRF, setRHN) => {
  var res1 = ethers.utils.formatEther(
    (await dexContract.getReserveA()).toString()
  );
  setGRF(res1);

  var res2 = ethers.utils.formatEther(
    (await dexContract.getReserveB()).toString()
  );
  setRHN(res2);
};

export const calculateSwapOut = async (
  _tokenInAmount,
  inputReserve,
  outputReserve,
  setRes
) => {
  let inputWithFee = _tokenInAmount * 100 - _tokenInAmount * 3;

  let tokenOutputAmount =
    (outputReserve * inputWithFee) / (inputReserve + inputWithFee);
  setRes(tokenOutputAmount / 100);
};

export const swaptokens = async (_contract, _amount) => {
  await dexContract.swap(_contract.address, ethers.utils.parseEther(_amount));
};

///
/// Liquidity

export const getTotalShares = async (setShares) => {
  var res = ethers.utils.formatEther(
    (await dexContract.totalSupply()).toString()
  );
  setShares(res);
};

export const getUserShares = async (setShares) => {
  var res = ethers.utils.formatEther(
    (await dexContract.getShares(signer.getAddress())).toString()
  );
  setShares(res);
};

export const addLiq = async (grfAmount, rhnAmount) => {
  await dexContract.addLiquidity(
    ethers.utils.parseEther(grfAmount),
    ethers.utils.parseEther(rhnAmount)
  );
};

export const calculateLiqGRFAmount = async (grfAmount, setRHN) => {
  var res = ethers.utils.formatEther(
    (
      await dexContract.calculateLiquidty(
        ethers.utils.parseEther(grfAmount),
        grfAddress
      )
    ).toString()
  );
  setRHN(res);
};

export const calculateLiqRHNAmount = async (rhnAmount, setGRF) => {
  var res = ethers.utils.formatEther(
    (
      await dexContract.calculateLiquidty(
        ethers.utils.parseEther(rhnAmount),
        rhnAddress
      )
    ).toString()
  );
  setGRF(res);
};
