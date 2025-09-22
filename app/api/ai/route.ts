import { NextResponse } from 'next/server';
import { aiService } from '@/lib/services/aiService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (id) {
      const recommendations = aiService.getAllRecommendations();
      const conflicts = aiService.getAllConflicts();
      
      const item = recommendations.find(r => r.id === id) || conflicts.find(c => c.id === id);
      
      if (item) {
        return NextResponse.json({
          success: true,
          data: item
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Item not found' },
          { status: 404 }
        );
      }
    }

    if (action === 'conflicts') {
      const conflictType = searchParams.get('conflictType');
      const conflicts = conflictType 
        ? aiService.getConflictsByType(conflictType as any)
        : aiService.getAllConflicts();
      
      return NextResponse.json({
        success: true,
        data: conflicts,
        count: conflicts.length,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'weather-recommendations') {
      const recommendations = aiService.generateWeatherBasedRecommendations();
      return NextResponse.json({
        success: true,
        data: recommendations,
        count: recommendations.length,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'priority-optimization') {
      const recommendations = aiService.generatePriorityOptimization();
      return NextResponse.json({
        success: true,
        data: recommendations,
        count: recommendations.length,
        timestamp: new Date().toISOString()
      });
    }

    // Default: get recommendations
    const recommendations = type 
      ? aiService.getRecommendationsByType(type as any)
      : aiService.getAllRecommendations();

    return NextResponse.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI API:', error);
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
      if (!scenario || !scenario.trainId) {
        return NextResponse.json(
          { success: false, error: 'Scenario with trainId is required' },
          { status: 400 }
        );
      }

      const analysis = aiService.runWhatIfAnalysis(scenario);
      return NextResponse.json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'refresh') {
      // Force refresh of AI analysis
      const recommendations = aiService.getAllRecommendations();
      const conflicts = aiService.getAllConflicts();
      
      return NextResponse.json({
        success: true,
        data: {
          recommendations,
          conflicts
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in AI POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}