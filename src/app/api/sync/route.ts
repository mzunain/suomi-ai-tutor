import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for MVP (replace with database in production)
const syncStore = new Map<string, any>();

/**
 * POST /api/sync
 * Save user progress to cloud
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, progress, timestamp, deviceId } = data;

    if (!userId || !progress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the sync data
    const existing = syncStore.get(userId) || { versions: [] };
    
    // Add new version
    existing.versions.push({
      progress,
      timestamp,
      deviceId,
    });

    // Keep only last 10 versions
    if (existing.versions.length > 10) {
      existing.versions = existing.versions.slice(-10);
    }

    syncStore.set(userId, existing);

    return NextResponse.json({
      success: true,
      message: 'Progress synced successfully',
      timestamp,
    });
  } catch (error) {
    console.error('[Sync] Error:', error);
    return NextResponse.json(
      { error: 'Failed to sync' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sync/[userId]
 * Retrieve user progress from cloud
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
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
