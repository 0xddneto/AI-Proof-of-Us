// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AIPOU is ERC20, ERC20Capped, ERC20Permit, Ownable {
    address public emissionController;

    error ZeroAddress();
    error NotEmissionController();

    event EmissionControllerUpdated(address indexed previousController, address indexed newController);

    constructor(
        address initialOwner,
        address initialRecipient,
        uint256 initialSupply,
        uint256 cap,
        address initialEmissionController
    )
        ERC20("AI Proof of Use", "AIPOU")
        ERC20Capped(cap)
        ERC20Permit("AI Proof of Use")
        Ownable(initialOwner)
    {
        if (
            initialOwner == address(0) ||
            initialRecipient == address(0) ||
            initialEmissionController == address(0)
        ) {
            revert ZeroAddress();
        }

        emissionController = initialEmissionController;
        _mint(initialRecipient, initialSupply);

        emit EmissionControllerUpdated(address(0), initialEmissionController);
    }

    function setEmissionController(address newController) external onlyOwner {
        if (newController == address(0)) {
            revert ZeroAddress();
        }

        address previousController = emissionController;
        emissionController = newController;

        emit EmissionControllerUpdated(previousController, newController);
    }

    function mintUsageReward(address to, uint256 amount) external {
        if (msg.sender != emissionController) {
            revert NotEmissionController();
        }

        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}

