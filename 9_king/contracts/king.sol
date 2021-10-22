// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "hardhat/console.sol";

contract King {

  address payable king;
  uint public prize;
  address payable public owner;

  constructor() public payable {
    owner = msg.sender;  
    king = msg.sender;
    prize = msg.value;
  }

  receive() external payable {
    console.log("Old King", king);
    console.log("Calling receive from sender:", msg.sender);
    require(msg.value >= prize || msg.sender == owner);
    console.log("About to transfer prize to old king:", msg.value);
    king.transfer(msg.value);
    console.log("Prize transferred");
    king = msg.sender;
    console.log("New King", king);
    prize = msg.value;
  }

  function _king() public view returns (address payable) {
    return king;
  }
}