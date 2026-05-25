import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    include: { lesson: { select: { id: true, title: true, difficulty: true } } },
    orderBy: { completedAt: "desc" },
  });

  return NextResponse.json({ progress });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { lessonId, score, timeSpent, exerciseResults } = body;

  if (!lessonId || score === undefined) {
    return NextResponse.json({ error: "Missing lessonId or score" }, { status: 400 });
  }

  const progress = await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: {
      completed: true,
      completedAt: new Date(),
      score: Math.max(score, 0),
      timeSpent: timeSpent ?? 0,
      attempts: { increment: 1 },
      exerciseResults: exerciseResults ?? undefined,
    },
    create: {
      userId: session.user.id,
      lessonId,
      completed: true,
      completedAt: new Date(),
      score: Math.max(score, 0),
      timeSpent: timeSpent ?? 0,
      attempts: 1,
      exerciseResults: exerciseResults ?? undefined,
    },
  });

  // Award XP to user
  const xpReward = Math.round((score / 100) * 50);
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      xp: { increment: xpReward },
      lastActive: new Date(),
    },
  });

  return NextResponse.json({ progress, xpAwarded: xpReward });
}
