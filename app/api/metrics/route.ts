import { NextResponse } from 'next/server';
import { trainService } from '@/lib/services/trainService';
import { safetyService } from '@/lib/services/safetyService';
import { SystemMetrics } from '@/lib/types';

export async function GET() {
  try {
    const trains = trainService.getAllTrains();
    const alerts = safetyService.getAllAlerts();
    
    // Calculate metrics
    const activeTrains = trains.filter(t => t.status !== 'Cancelled').length;
    const onTimeTrains = trains.filter(t => t.delay <= 5).length;
    const onTimePerformance = Math.round((onTimeTrains / trains.length) * 100);
    
    const totalPassengers = trains
      .filter(t => t.type === 'EMU' || t.type === 'Express')
      .reduce((sum, train) => {
        // Estimate passengers based on load percentage and train type
        const capacity = train.type === 'EMU' ? 1200 : 800;
        return sum + Math.floor((train.passengerLoad / 100) * capacity);
      }, 0);

    const averageDelay = Math.round(
      trains.reduce((sum, train) => sum + train.delay, 0) / trains.length
    );

    // Platform utilization (mock calculation)
    const platformUtilization = Math.round(
      (trains.filter(t => t.platform && t.status !== 'Departed').length / 
       (trains.length * 0.6)) * 100
    );

    const metrics: SystemMetrics = {
      activeTrains,
      onTimePerformance,
      activeAlerts: alerts.length,
      passengersToday: totalPassengers,
      averageDelay,
      platformUtilization
    };

    return NextResponse.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}