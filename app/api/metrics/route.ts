import { NextResponse } from 'next/server';
import { trainService } from '@/lib/services/trainService';
import { safetyService } from '@/lib/services/safetyService';
import { weatherService } from '@/lib/services/weatherService';
import { aiService } from '@/lib/services/aiService';
import { SystemMetrics } from '@/lib/types';

export async function GET() {
  try {
    const trains = trainService.getAllTrains();
    const alerts = safetyService.getAllAlerts();
    const weather = weatherService.getCurrentWeather();
    const recommendations = aiService.getAllRecommendations();
    const conflicts = aiService.getAllConflicts();
    
    // Calculate metrics
    const activeTrains = trains.filter(t => t.status !== 'Cancelled').length;
    const onTimeTrains = trains.filter(t => t.delay <= 5).length;
    const onTimePerformance = trains.length > 0 ? Math.round((onTimeTrains / trains.length) * 100) : 100;
    
    const totalPassengers = trains
      .filter(t => t.type === 'EMU' || t.type === 'Express')
      .reduce((sum, train) => {
        // Estimate passengers based on load percentage and train type
        const capacity = train.type === 'EMU' ? 1200 : 800;
        return sum + Math.floor((train.passengerLoad / 100) * capacity);
      }, 0);

    const averageDelay = trains.length > 0 ? Math.round(
      trains.reduce((sum, train) => sum + train.delay, 0) / trains.length * 10
    ) / 10 : 0;

    // Platform utilization calculation
    const trainsWithPlatforms = trains.filter(t => t.platform && t.status !== 'Departed').length;
    const totalPlatformCapacity = trains.length * 0.6; // Assume 60% platform capacity usage is optimal
    const platformUtilization = totalPlatformCapacity > 0 ? Math.round(
      (trainsWithPlatforms / totalPlatformCapacity) * 100
    ) : 0;

    const metrics: SystemMetrics = {
      activeTrains,
      onTimePerformance,
      activeAlerts: alerts.length,
      passengersToday: totalPassengers,
      averageDelay,
      platformUtilization: Math.min(100, platformUtilization)
    };

    return NextResponse.json({
      success: true,
      data: metrics,
      additional: {
        weather: {
          condition: weather.condition,
          temperature: weather.temperature,
          impact: weather.impact
        },
        aiInsights: {
          recommendations: recommendations.length,
          conflicts: conflicts.length,
          highPriorityConflicts: conflicts.filter(c => c.priority >= 8).length
        },
        trainBreakdown: {
          emu: trains.filter(t => t.type === 'EMU').length,
          express: trains.filter(t => t.type === 'Express').length,
          freight: trains.filter(t => t.type === 'Freight').length
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in metrics API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, timeRange } = body;

    if (action === 'historical') {
      // Mock historical data - in real implementation, this would come from a database
      const hours = timeRange || 24;
      const historicalData = [];
      
      for (let i = hours; i >= 0; i--) {
        const timestamp = new Date(Date.now() - i * 3600000);
        historicalData.push({
          timestamp: timestamp.toISOString(),
          activeTrains: Math.floor(Math.random() * 5) + 20,
          onTimePerformance: Math.floor(Math.random() * 10) + 90,
          averageDelay: Math.random() * 8 + 2,
          platformUtilization: Math.floor(Math.random() * 20) + 70
        });
      }

      return NextResponse.json({
        success: true,
        data: historicalData,
        timeRange: hours,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in metrics POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process metrics request' },
      { status: 500 }
    );
  }
}