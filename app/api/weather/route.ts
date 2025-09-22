import { NextResponse } from 'next/server';
import { weatherService } from '@/lib/services/weatherService';

export async function GET() {
  try {
    const weather = weatherService.getCurrentWeather();
    const impact = weatherService.getWeatherImpact();
    const speedRestriction = weatherService.getSpeedRestriction();
    const lastUpdate = weatherService.getLastUpdate();

    return NextResponse.json({
      success: true,
      data: {
        ...weather,
        impactDescription: impact,
        speedRestriction,
        lastUpdate: lastUpdate.toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in weather API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'refresh') {
      // Force weather update
      const weather = weatherService.getCurrentWeather();
      const impact = weatherService.getWeatherImpact();
      const speedRestriction = weatherService.getSpeedRestriction();

      return NextResponse.json({
        success: true,
        data: {
          ...weather,
          impactDescription: impact,
          speedRestriction
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in weather POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process weather request' },
      { status: 500 }
    );
  }
}