import { NextResponse } from "next/server";
import { getDailyChallenges } from "@/data/challenges";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const challenges = getDailyChallenges(today);
  return NextResponse.json({ date: today, challenges });
}
