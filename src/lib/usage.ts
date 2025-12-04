import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const Free_points = 10;
const Free_duration = 30 * 24 * 60 * 60; // seconds
const Generation_points = 1;
const Pro_points = 100;

export async function getUsagetracker({ isPro = false, keyPrefixOverride }: { isPro?: boolean, keyPrefixOverride?: string } = {}) {
  const keyPrefix = keyPrefixOverride ?? (isPro ? "ratelimit:pro" : "ratelimit:free");

  const usagetracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    keyPrefix,
    points: isPro ? Pro_points : Free_points,
    duration: Free_duration,
  });

  return usagetracker;
}

export async function consumeCredits() {
  const { userId, has } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const hasPremium = has({ plan: "pro_user" }); // Use the plan key, not display name

  const usagetracker = await getUsagetracker({ isPro: hasPremium });

  const result = await usagetracker.consume(userId, Generation_points);
  return result;
}

export async function getUsageStatus() {
  const { userId, has } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const hasPremium = has({ plan: "pro_user" }); // Use the plan key here too
  const usagetracker = await getUsagetracker({ isPro: hasPremium });

  const result = await usagetracker.get(userId);
  return result;
}

// call this once when user upgrades to Pro
export async function handleUpgradeToPro(userId: string) {
  // delete old record (so new limiter starts fresh with 100 points)
  // Use free key prefix because older record likely is under free prefix
  const freeLimiter = await getUsagetracker({ isPro: false });
  try {
    await freeLimiter.delete(userId);
  } catch (err) {
    console.warn("Could not delete existing usage key via rate-limiter (fallback to DB)", err);
    // fallback: remove directly from DB (example — adapt to your schema)
    await prisma.usage.deleteMany({ where: { key: `ratelimit:${userId}` } }).catch(e => console.warn(e));
  }
}
