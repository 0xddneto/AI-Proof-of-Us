import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";

function leaf(account: string, amount: bigint, receiptId: string): string {
  const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "uint256", "bytes32"],
    [account, amount, receiptId]
  );
  return ethers.keccak256(ethers.concat([ethers.keccak256(encoded)]));
}

function treeFor(leaves: string[]): MerkleTree {
  return new MerkleTree(
    leaves.map((item) => Buffer.from(ethers.getBytes(item))),
    (value) => Buffer.from(ethers.getBytes(ethers.keccak256(value))),
    { sortLeaves: true, sortPairs: true }
  );
}

describe("AIPOUClaims", function () {
  async function deployClaims() {
    const [owner, validator, user, secondUser, attacker] = await ethers.getSigners();
    const AIPOU = await ethers.getContractFactory("AIPOU");
    const token = await AIPOU.deploy(
      owner.address,
      owner.address,
      ethers.parseUnits("100000000", 18),
      ethers.parseUnits("1000000000", 18),
      owner.address
    );
    const Claims = await ethers.getContractFactory("AIPOUClaims");
    const claims = await Claims.deploy(await token.getAddress(), owner.address, validator.address);
    await token.setEmissionController(await claims.getAddress());
    return { token, claims, owner, validator, user, secondUser, attacker };
  }

  it("publishes a root and mints a valid reward", async function () {
    const { token, claims, validator, user } = await deployClaims();
    const amount = ethers.parseUnits("12.5", 18);
    const receiptId = ethers.keccak256(ethers.toUtf8Bytes("receipt-1"));
    const root = leaf(user.address, amount, receiptId);

    await claims.connect(validator).publishRoot(root);
    await expect(claims.claim(root, user.address, amount, receiptId, []))
      .to.emit(claims, "RewardClaimed")
      .withArgs(receiptId, user.address, amount, root);

    expect(await token.balanceOf(user.address)).to.equal(amount);
  });

  it("rejects duplicate receipts even when the proof remains valid", async function () {
    const { claims, validator, user } = await deployClaims();
    const amount = ethers.parseUnits("3", 18);
    const receiptId = ethers.keccak256(ethers.toUtf8Bytes("receipt-replay"));
    const root = leaf(user.address, amount, receiptId);

    await claims.connect(validator).publishRoot(root);
    await claims.claim(root, user.address, amount, receiptId, []);
    await expect(claims.claim(root, user.address, amount, receiptId, []))
      .to.be.revertedWithCustomError(claims, "ReceiptAlreadyClaimed");
  });

  it("derives each batch leaf from account, amount, and receipt id", async function () {
    const { token, claims, validator, user, secondUser } = await deployClaims();
    const amountA = ethers.parseUnits("4", 18);
    const amountB = ethers.parseUnits("7", 18);
    const receiptA = ethers.keccak256(ethers.toUtf8Bytes("batch-a"));
    const receiptB = ethers.keccak256(ethers.toUtf8Bytes("batch-b"));
    const leafA = leaf(user.address, amountA, receiptA);
    const leafB = leaf(secondUser.address, amountB, receiptB);
    const tree = treeFor([leafA, leafB]);
    const root = tree.getHexRoot();

    await claims.connect(validator).publishRoot(root);
    await claims.claimBatch(
      root,
      [user.address, secondUser.address],
      [amountA, amountB],
      [receiptA, receiptB],
      [
        tree.getHexProof(Buffer.from(ethers.getBytes(leafA))),
        tree.getHexProof(Buffer.from(ethers.getBytes(leafB)))
      ]
    );

    expect(await token.balanceOf(user.address)).to.equal(amountA);
    expect(await token.balanceOf(secondUser.address)).to.equal(amountB);
  });

  it("allows only the validator to publish roots", async function () {
    const { claims, attacker } = await deployClaims();
    const root = ethers.keccak256(ethers.toUtf8Bytes("unauthorized-root"));

    await expect(claims.connect(attacker).publishRoot(root))
      .to.be.revertedWithCustomError(claims, "UnauthorizedValidator");
  });
});
