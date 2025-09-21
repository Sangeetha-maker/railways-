import { NextResponse } from 'next/server';
import { safetyService } from '@/lib/services/safetyService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const runCheck = searchParams.get('runCheck') === 'true';

    let alerts;
    
    if (runCheck) {
      alerts = safetyService.runSafetyCheck();
    } else if (type) {
      alerts = safetyService.getAlertsByType(type as any);
    } else if (severity) {
      alerts = safetyService.getAlertsBySeverity(severity as any);
    } else {
      alerts = safetyService.getAllAlerts();
    }

    return NextResponse.json({
      success: true,
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch safety alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const alert = safetyService.createAlert(body);

    return NextResponse.json({
      success: true,
      data: alert
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertId } = body;
    
    const success = safetyService.resolveAlert(alertId);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Alert resolved successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to resolve alert' },
      { status: 500 }
    );
  }
}