// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IAIPOURewardToken {
    function mintUsageReward(address to, uint256 amount) external;
}

contract AIPOUClaims is Ownable {
    IAIPOURewardToken public immutable token;
    address public validator;

    mapping(bytes32 root => bool approved) public approvedRoots;
    mapping(bytes32 receiptId => bool claimed) public claimedReceipts;

    error EmptyBatch();
    error InvalidArrayLengths();
    error InvalidProof();
    error ReceiptAlreadyClaimed();
    error RootNotApproved();
    error UnauthorizedValidator();
    error ZeroAddress();
    error ZeroRoot();

    event MerkleRootPublished(bytes32 indexed root);
    event MerkleRootRevoked(bytes32 indexed root);
    event RewardClaimed(bytes32 indexed receiptId, address indexed account, uint256 amount, bytes32 indexed root);
    event ValidatorUpdated(address indexed previousValidator, address indexed newValidator);

    constructor(address tokenAddress, address initialOwner, address initialValidator) Ownable(initialOwner) {
        if (tokenAddress == address(0) || initialOwner == address(0) || initialValidator == address(0)) {
            revert ZeroAddress();
        }

        token = IAIPOURewardToken(tokenAddress);
        validator = initialValidator;
        emit ValidatorUpdated(address(0), initialValidator);
    }

    modifier onlyValidator() {
        if (msg.sender != validator) revert UnauthorizedValidator();
        _;
    }

    function setValidator(address newValidator) external onlyOwner {
        if (newValidator == address(0)) revert ZeroAddress();
        address previousValidator = validator;
        validator = newValidator;
        emit ValidatorUpdated(previousValidator, newValidator);
    }

    function publishRoot(bytes32 root) external onlyValidator {
        if (root == bytes32(0)) revert ZeroRoot();
        approvedRoots[root] = true;
        emit MerkleRootPublished(root);
    }

    function revokeRoot(bytes32 root) external onlyOwner {
        approvedRoots[root] = false;
        emit MerkleRootRevoked(root);
    }

    function claim(
        bytes32 root,
        address account,
        uint256 amount,
        bytes32 receiptId,
        bytes32[] calldata proof
    ) public {
        if (!approvedRoots[root]) revert RootNotApproved();
        if (claimedReceipts[receiptId]) revert ReceiptAlreadyClaimed();

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(account, amount, receiptId))));
        if (!MerkleProof.verifyCalldata(proof, root, leaf)) revert InvalidProof();

        claimedReceipts[receiptId] = true;
        token.mintUsageReward(account, amount);
        emit RewardClaimed(receiptId, account, amount, root);
    }

    function claimBatch(
        bytes32 root,
        address[] calldata accounts,
        uint256[] calldata amounts,
        bytes32[] calldata receiptIds,
        bytes32[][] calldata proofs
    ) external {
        uint256 length = accounts.length;
        if (length == 0) revert EmptyBatch();
        if (amounts.length != length || receiptIds.length != length || proofs.length != length) {
            revert InvalidArrayLengths();
        }

        for (uint256 i = 0; i < length; ++i) {
            claim(root, accounts[i], amounts[i], receiptIds[i], proofs[i]);
        }
    }
}
