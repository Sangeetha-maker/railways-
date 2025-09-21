import { NextResponse } from 'next/server';
import { trainService } from '@/lib/services/trainService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const station = searchParams.get('station');

    let trains;
    
    if (type) {
      trains = trainService.getTrainsByType(type as any);
    } else if (station) {
      trains = trainService.getTrainsByStation(station);
    } else {
      trains = trainService.getAllTrains();
    }

    return NextResponse.json({
      success: true,
      data: trains,
      count: trains.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trains' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { trainId, status, delay, stationCode } = body;

    let success = false;
    
    if (stationCode) {
      success = trainService.updateTrainPosition(trainId, stationCode);
    }
    
    if (status || delay !== undefined) {
      success = trainService.updateTrainStatus(trainId, status, delay);
    }

    if (success) {
      const updatedTrain = trainService.getTrainById(trainId);
      return NextResponse.json({
        success: true,
        data: updatedTrain
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Train not found or update failed' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update train' },
      { status: 500 }
    );
  }
}