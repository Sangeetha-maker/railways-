import { NextResponse } from 'next/server';
import { trainService } from '@/lib/services/trainService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const station = searchParams.get('station');
    const id = searchParams.get('id');

    let trains;
    
    if (id) {
      const train = trainService.getTrainById(id);
      if (train) {
        return NextResponse.json({
          success: true,
          data: train
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Train not found' },
          { status: 404 }
        );
      }
    } else if (type) {
      trains = trainService.getTrainsByType(type as any);
    } else if (station) {
      trains = trainService.getTrainsByStation(station);
    } else {
      trains = trainService.getAllTrains();
    }

    return NextResponse.json({
      success: true,
      data: trains,
      count: trains.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in trains API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trains' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { trainId, status, delay, stationCode, priority } = body;

    if (!trainId) {
      return NextResponse.json(
        { success: false, error: 'Train ID is required' },
        { status: 400 }
      );
    }

    let success = false;
    
    if (stationCode) {
      success = trainService.updateTrainPosition(trainId, stationCode);
    }
    
    if (status || delay !== undefined) {
      success = trainService.updateTrainStatus(trainId, status, delay) || success;
    }

    if (priority !== undefined) {
      const train = trainService.getTrainById(trainId);
      if (train) {
        train.priority = priority;
        success = true;
      }
    }

    if (success) {
      const updatedTrain = trainService.getTrainById(trainId);
      return NextResponse.json({
        success: true,
        data: updatedTrain,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Train not found or update failed' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating train:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update train' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'refresh') {
      // Force refresh of train data
      const trains = trainService.getAllTrains();
      return NextResponse.json({
        success: true,
        data: trains,
        count: trains.length,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in trains POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}