import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for MVP (replace with database in production)
const syncStore = new Map<string, any>();

/**
 * GET /api/sync/[userId]
 * Retrieve user progress from cloud
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;
    const data = syncStore.get(userId);

    if (!data || !data.versions || data.versions.length === 0) {
      return NextResponse.json(
        { error: 'No data found' },
        { status: 404 }
      );
    }

    // Get the most recent version
    const latest = data.versions[data.versions.length - 1];

    return NextResponse.json({
      userId,
      progress: latest.progress,
      timestamp: latest.timestamp,
      deviceId: latest.deviceId,
    });
  } catch (error) {
    console.error('[Sync] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve sync data' },
      { status: 500 }
    );
  }
}
