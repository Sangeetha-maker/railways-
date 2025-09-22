import { NextResponse } from 'next/server';
import { safetyService } from '@/lib/services/safetyService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const runCheck = searchParams.get('runCheck') === 'true';
    const id = searchParams.get('id');

    let alerts;
    
    if (id) {
      const allAlerts = safetyService.getAllAlerts();
      const alert = allAlerts.find(a => a.id === id);
      if (alert) {
        return NextResponse.json({
          success: true,
          data: alert
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Alert not found' },
          { status: 404 }
        );
      }
    } else if (runCheck) {
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
      count: alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in safety API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch safety alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { type, severity, title, description, affectedTrains, affectedStations } = body;
      
      if (!type || !severity || !title || !description) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const alert = safetyService.createAlert({
        type,
        severity,
        title,
        description,
        affectedTrains: affectedTrains || [],
        affectedStations: affectedStations || [],
        resolved: false
      });

      return NextResponse.json({
        success: true,
        data: alert,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'run-check') {
      const alerts = safetyService.runSafetyCheck();
      return NextResponse.json({
        success: true,
        data: alerts,
        count: alerts.length,
        timestamp: new Date().toISOString()
      });
    }

    // Legacy support - create alert from body
    const alert = safetyService.createAlert(body);
    return NextResponse.json({
      success: true,
      data: alert,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertId, action } = body;
    
    if (!alertId) {
      return NextResponse.json(
        { success: false, error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    if (action === 'resolve') {
      const success = safetyService.resolveAlert(alertId);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Alert resolved successfully',
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Alert not found' },
          { status: 404 }
        );
      }
    }

    // Legacy support
    const success = safetyService.resolveAlert(alertId);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Alert resolved successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error resolving alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resolve alert' },
      { status: 500 }
    );
  }
}