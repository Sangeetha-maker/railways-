import { NextResponse } from 'next/server';
import { aiService } from '@/lib/services/aiService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const action = searchParams.get('action');

    if (action === 'conflicts') {
      const conflictType = searchParams.get('conflictType');
      const conflicts = conflictType 
        ? aiService.getConflictsByType(conflictType as any)
        : aiService.getAllConflicts();
      
      return NextResponse.json({
        success: true,
        data: conflicts,
        count: conflicts.length
      });
    }

    if (action === 'weather-recommendations') {
      const recommendations = aiService.generateWeatherBasedRecommendations();
      return NextResponse.json({
        success: true,
        data: recommendations,
        count: recommendations.length
      });
    }

    if (action === 'priority-optimization') {
      const recommendations = aiService.generatePriorityOptimization();
      return NextResponse.json({
        success: true,
        data: recommendations,
        count: recommendations.length
      });
    }

    // Default: get recommendations
    const recommendations = type 
      ? aiService.getRecommendationsByType(type as any)
      : aiService.getAllRecommendations();

    return NextResponse.json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, scenario } = body;

    if (action === 'what-if-analysis') {
      const analysis = aiService.runWhatIfAnalysis(scenario);
      return NextResponse.json({
        success: true,
        data: analysis
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}