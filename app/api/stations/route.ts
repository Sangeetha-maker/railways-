import { NextResponse } from 'next/server';
import { stations, getStationByCode } from '@/lib/data/stations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      const station = getStationByCode(code);
      if (station) {
        return NextResponse.json({
          success: true,
          data: station
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Station not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: stations,
      count: stations.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}