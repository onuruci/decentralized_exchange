// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GRFToken is ERC20 {
  event TokenSend(address _to);
  
  constructor() ERC20("Grf", "GRF") {
    _mint(msg.sender, 1000 * 10 ** 18);
  }

  function faucet() public {
    _mint(msg.sender, 100 * 10 **18);
    emit TokenSend(msg.sender);
  }
}