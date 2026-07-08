// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AIPOULiquidityLock {
    using SafeERC20 for IERC20;

    IERC20 public immutable liquidityToken;
    address public immutable beneficiary;
    uint64 public immutable unlockTime;

    error ZeroAddress();
    error UnlockTimeNotFuture();
    error LiquidityStillLocked(uint64 unlockTime);
    error NothingToRelease();

    event LiquidityReleased(address indexed beneficiary, uint256 amount);

    constructor(address token_, address beneficiary_, uint64 unlockTime_) {
        if (token_ == address(0) || beneficiary_ == address(0)) revert ZeroAddress();
        if (unlockTime_ <= block.timestamp) revert UnlockTimeNotFuture();

        liquidityToken = IERC20(token_);
        beneficiary = beneficiary_;
        unlockTime = unlockTime_;
    }

    function release() external {
        if (block.timestamp < unlockTime) revert LiquidityStillLocked(unlockTime);

        uint256 amount = liquidityToken.balanceOf(address(this));
        if (amount == 0) revert NothingToRelease();

        liquidityToken.safeTransfer(beneficiary, amount);
        emit LiquidityReleased(beneficiary, amount);
    }
}
