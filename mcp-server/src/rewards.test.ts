import test from "node:test";
import assert from "node:assert/strict";
import { estimateReward } from "./rewards.js";

test("client_signed tier applies 0.75 multiplier", () => {
  const reward = estimateReward({
    inputTokens: 1000,
    outputTokens: 500,
    durationSeconds: 300,
    trustTier: "client_signed"
  });
  const tokenScore = Math.min(1500 / 1000, 30);
  const durationScore = Math.min(300 / 300, 12);
  const expected = (tokenScore + durationScore) * 0.75;
  assert.equal(reward, expected.toFixed(4));
});

test("provider_signed tier applies 1.5 multiplier", () => {
  const reward = estimateReward({
    inputTokens: 1000,
    outputTokens: 500,
    durationSeconds: 300,
    trustTier: "provider_signed"
  });
  const tokenScore = Math.min(1500 / 1000, 30);
  const durationScore = Math.min(300 / 300, 12);
  const expected = (tokenScore + durationScore) * 1.5;
  assert.equal(reward, expected.toFixed(4));
});

test("provider_signed yields higher reward than client_signed for same input", () => {
  const clientReward = Number(estimateReward({
    inputTokens: 2000,
    outputTokens: 800,
    durationSeconds: 600,
    trustTier: "client_signed"
  }));
  const providerReward = Number(estimateReward({
    inputTokens: 2000,
    outputTokens: 800,
    durationSeconds: 600,
    trustTier: "provider_signed"
  }));
  assert.ok(providerReward > clientReward);
});

test("token score is capped at 30", () => {
  const lowTokens = estimateReward({
    inputTokens: 500,
    outputTokens: 500,
    durationSeconds: 0,
    trustTier: "client_signed"
  });
  const cappedTokens = estimateReward({
    inputTokens: 100000,
    outputTokens: 100000,
    durationSeconds: 0,
    trustTier: "client_signed"
  });
  assert.equal(Number(cappedTokens), 30 * 0.75);
  assert.ok(Number(cappedTokens) > Number(lowTokens));
});

test("duration score is capped at 12", () => {
  const lowDuration = estimateReward({
    inputTokens: 0,
    outputTokens: 0,
    durationSeconds: 60,
    trustTier: "client_signed"
  });
  const cappedDuration = estimateReward({
    inputTokens: 0,
    outputTokens: 0,
    durationSeconds: 99999,
    trustTier: "client_signed"
  });
  assert.equal(Number(cappedDuration), 12 * 0.75);
  assert.ok(Number(cappedDuration) > Number(lowDuration));
});

test("total reward is capped at 50", () => {
  const maxReward = estimateReward({
    inputTokens: 1000000,
    outputTokens: 1000000,
    durationSeconds: 100000,
    trustTier: "provider_signed"
  });
  assert.equal(Number(maxReward), 50);
});

test("zero input yields zero reward", () => {
  const reward = estimateReward({
    inputTokens: 0,
    outputTokens: 0,
    durationSeconds: 0,
    trustTier: "client_signed"
  });
  assert.equal(reward, "0.0000");
});

test("negative token counts are treated as zero", () => {
  const reward = estimateReward({
    inputTokens: -500,
    outputTokens: -200,
    durationSeconds: 300,
    trustTier: "client_signed"
  });
  const durationScore = Math.min(300 / 300, 12);
  const expected = durationScore * 0.75;
  assert.equal(reward, expected.toFixed(4));
});

test("negative duration is treated as zero", () => {
  const reward = estimateReward({
    inputTokens: 1000,
    outputTokens: 0,
    durationSeconds: -100,
    trustTier: "client_signed"
  });
  const tokenScore = Math.min(1000 / 1000, 30);
  const expected = tokenScore * 0.75;
  assert.equal(reward, expected.toFixed(4));
});

test("reward is always a fixed 4-decimal string", () => {
  const reward = estimateReward({
    inputTokens: 100,
    outputTokens: 100,
    durationSeconds: 30,
    trustTier: "client_signed"
  });
  assert.match(reward, /^\d+\.\d{4}$/);
});

test("high token count with low duration hits token cap but not total cap", () => {
  const reward = estimateReward({
    inputTokens: 50000,
    outputTokens: 50000,
    durationSeconds: 0,
    trustTier: "client_signed"
  });
  assert.equal(Number(reward), 30 * 0.75);
});
