import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

describe("AIPOULiquidityLock", function () {
  async function deployFixture() {
    const [deployer, beneficiary, caller] = await ethers.getSigners();
    const amount = ethers.parseUnits("1000", 18);

    const AIPOU = await ethers.getContractFactory("AIPOU");
    const token = await AIPOU.deploy(
      deployer.address,
      deployer.address,
      amount,
      amount,
      deployer.address
    );

    const unlockTime = (await time.latest()) + 365 * 24 * 60 * 60;
    const Lock = await ethers.getContractFactory("AIPOULiquidityLock");
    const lock = await Lock.deploy(await token.getAddress(), beneficiary.address, unlockTime);
    await token.transfer(await lock.getAddress(), amount);

    return { token, lock, beneficiary, caller, amount, unlockTime };
  }

  it("stores immutable lock terms and holds the tokens", async function () {
    const { token, lock, beneficiary, amount, unlockTime } = await deployFixture();

    expect(await lock.liquidityToken()).to.equal(await token.getAddress());
    expect(await lock.beneficiary()).to.equal(beneficiary.address);
    expect(await lock.unlockTime()).to.equal(unlockTime);
    expect(await token.balanceOf(await lock.getAddress())).to.equal(amount);
  });

  it("rejects release before the public unlock time", async function () {
    const { lock, unlockTime } = await deployFixture();

    await expect(lock.release())
      .to.be.revertedWithCustomError(lock, "LiquidityStillLocked")
      .withArgs(unlockTime);
  });

  it("allows anyone to release only to the beneficiary after unlock", async function () {
    const { token, lock, beneficiary, caller, amount, unlockTime } = await deployFixture();
    await time.increaseTo(unlockTime);

    await expect(lock.connect(caller).release())
      .to.emit(lock, "LiquidityReleased")
      .withArgs(beneficiary.address, amount);

    expect(await token.balanceOf(beneficiary.address)).to.equal(amount);
    expect(await token.balanceOf(await lock.getAddress())).to.equal(0);
    await expect(lock.release()).to.be.revertedWithCustomError(lock, "NothingToRelease");
  });

  it("rejects invalid constructor terms", async function () {
    const [, beneficiary] = await ethers.getSigners();
    const Lock = await ethers.getContractFactory("AIPOULiquidityLock");
    const future = (await time.latest()) + 100;

    await expect(Lock.deploy(ethers.ZeroAddress, beneficiary.address, future)).to.be.revertedWithCustomError(
      Lock,
      "ZeroAddress"
    );
    await expect(Lock.deploy(beneficiary.address, ethers.ZeroAddress, future)).to.be.revertedWithCustomError(
      Lock,
      "ZeroAddress"
    );
    await expect(Lock.deploy(beneficiary.address, beneficiary.address, await time.latest())).to.be.revertedWithCustomError(
      Lock,
      "UnlockTimeNotFuture"
    );
  });
});
