// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract DecentralizedExchange {
  IERC20 public tokenA;
  IERC20 public tokenB;
  uint256 public fee;

  uint256 public totalSupply;

  mapping(address => uint256) public balances;

  event Exchanged(address _user, uint256 _tokenIn, uint256 _tokenOut);
  event RemovedLiquidty(address _user, uint256 _tokenA, uint256 _tokenB);
  event AddedLiquidity(address _user, uint256 _tokenA, uint256 _tokenB, uint256 _shares);


  constructor(address _tokenA_Address, address _tokenB_address, uint256 _fee){
    tokenA = IERC20(_tokenA_Address);
    tokenB = IERC20(_tokenB_address);

    fee = _fee;
  }


  function _mint(uint256 _balance, address _to) private {
    totalSupply += _balance;
    balances[_to] += _balance;
  }


  function _burn(uint256 _balance, address _from) private {
    totalSupply -= _balance;
    balances[_from] -= _balance;
  }



  function swap(address _tokenBuyAddress, uint256 _tokenInAmount) public {
    IERC20 inputToken;
    IERC20 outputToken;
    uint256 inputReserve;
    uint256 outputReserve;
    uint256 tokenOutputAmount;
    if(_tokenBuyAddress == address(tokenA)){
      inputToken = tokenA;
      outputToken = tokenB;
    } else {
      inputToken = tokenB;
      outputToken = tokenA;
    }

    inputReserve = inputToken.balanceOf(address(this));
    outputReserve = outputToken.balanceOf(address(this));

    inputToken.transferFrom(msg.sender,address(this), _tokenInAmount);

    uint256 inputWithFee = (_tokenInAmount * 100 - _tokenInAmount * fee) / 100;

    tokenOutputAmount = (outputReserve * inputWithFee) / (inputReserve + inputWithFee);

    outputToken.transfer(msg.sender, tokenOutputAmount);

    emit Exchanged(msg.sender, _tokenInAmount, tokenOutputAmount);
  }



  function addLiquidity(uint256 _tokenAAmount, uint256 _tokenBAmount) public {
    tokenA.transferFrom(msg.sender, address(this), _tokenAAmount);
    tokenB.transferFrom(msg.sender, address(this), _tokenBAmount);

    uint256 reserveA = tokenA.balanceOf(address(this));
    uint256 reserveB = tokenB.balanceOf(address(this));
    uint256 s;

    if(reserveA > 0 && reserveB > 0) {
      require((reserveA * _tokenBAmount) == (reserveB * _tokenAAmount) , "Not correct proportion");
    }


    if(totalSupply == 0) {
      s = sqrt(_tokenAAmount * _tokenBAmount);
    } else {
      s = totalSupply * (_tokenAAmount / reserveA);
    }


    _mint(s, msg.sender);
    
    emit AddedLiquidity(msg.sender, _tokenAAmount, _tokenBAmount, s);
  }



  function removeLiquidity(uint256 _shares) public {
    require(balances[msg.sender] >= _shares, "Shares are not enough");

    uint256 reserveA = tokenA.balanceOf(address(this));
    uint256 reserveB = tokenB.balanceOf(address(this));

    uint256 tokenACount = (_shares / totalSupply) * reserveA;
    uint256 tokenBCount = (_shares / totalSupply) * reserveB;

    _burn(_shares, msg.sender);


    tokenA.transfer(msg.sender, tokenACount);
    tokenB.transfer(msg.sender, tokenBCount);

    emit RemovedLiquidty(msg.sender, tokenACount, tokenBCount);
  }

  function calculateLiquidty(uint256 _tokenCount, address _tokenInAddress) public view 
  returns (uint256 _data) 
  {
    IERC20 inputToken;
    IERC20 outputToken;
    uint256 inputReserve;
    uint256 outputReserve;
    uint256 resTokenAmount = 0;


    if(_tokenInAddress == address(tokenA)){
      inputToken = tokenA;
      outputToken = tokenB;
    } else {
      inputToken = tokenB;
      outputToken = tokenA;
    }

    inputReserve = inputToken.balanceOf(address(this));
    outputReserve = outputToken.balanceOf(address(this));


    if(inputReserve > 0 && outputReserve > 0) {
      resTokenAmount = outputReserve * _tokenCount / inputReserve;
    }


    return resTokenAmount;
  }



  function sqrt(uint y) internal pure returns (uint z) {
    if (y > 3) {
        z = y;
        uint x = y / 2 + 1;
        while (x < z) {
            z = x;
            x = (y / x + x) / 2;
        }
    } else if (y != 0) {
        z = 1;
    }
  }

  function getAddressTokenA() external view returns (address) {
    return address(tokenA);
  }

  function getAddressTokenB() external view returns (address) {
    return address(tokenB);
  }

  function getReserveA() external view returns (uint256) {
    return tokenA.balanceOf(address(this));
  }

  function getReserveB() external view returns (uint256) {
    return tokenB.balanceOf(address(this));
  }

  function getShares(address _address) external view returns (uint256) {
    return balances[_address];
  }
}