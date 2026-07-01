import { expect } from "chai";
import { ethers } from "hardhat";

describe("AIPOU", function () {
  async function deployToken() {
    const [owner, initialRecipient, emissionController, user, attacker] = await ethers.getSigners();
    const cap = ethers.parseUnits("1000000000", 18);
    const initialSupply = ethers.parseUnits("100000000", 18);

    const AIPOU = await ethers.getContractFactory("AIPOU");
    const token = await AIPOU.deploy(
      owner.address,
      initialRecipient.address,
      initialSupply,
      cap,
      emissionController.address
    );

    return { token, owner, initialRecipient, emissionController, user, attacker, cap, initialSupply };
  }

  it("deploys with the expected token metadata and initial supply", async function () {
    const { token, initialRecipient, initialSupply, cap } = await deployToken();

    expect(await token.name()).to.equal("AI Proof of Use");
    expect(await token.symbol()).to.equal("AIPOU");
    expect(await token.cap()).to.equal(cap);
    expect(await token.balanceOf(initialRecipient.address)).to.equal(initialSupply);
  });

  it("allows only the emission controller to mint usage rewards", async function () {
    const { token, emissionController, user, attacker } = await deployToken();
    const reward = ethers.parseUnits("100", 18);

    await expect(token.connect(attacker).mintUsageReward(user.address, reward))
      .to.be.revertedWithCustomError(token, "NotEmissionController");

    await token.connect(emissionController).mintUsageReward(user.address, reward);
    expect(await token.balanceOf(user.address)).to.equal(reward);
  });

  it("lets the owner rotate the emission controller", async function () {
    const { token, owner, user, emissionController } = await deployToken();
    const reward = ethers.parseUnits("50", 18);

    await token.connect(owner).setEmissionController(user.address);
    expect(await token.emissionController()).to.equal(user.address);

    await expect(token.connect(emissionController).mintUsageReward(user.address, reward))
      .to.be.revertedWithCustomError(token, "NotEmissionController");

    await token.connect(user).mintUsageReward(user.address, reward);
    expect(await token.balanceOf(user.address)).to.equal(reward);
  });
});

