import { NextResponse } from 'next/server';
import { weatherService } from '@/lib/services/weatherService';

export async function GET() {
  try {
    const weather = weatherService.getCurrentWeather();
    const impact = weatherService.getWeatherImpact();
    const speedRestriction = weatherService.getSpeedRestriction();

    return NextResponse.json({
      success: true,
      data: {
        ...weather,
        impactDescription: impact,
        speedRestriction
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}