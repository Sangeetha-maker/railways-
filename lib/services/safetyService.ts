import { SafetyAlert, Train } from '../types';
import { weatherService } from './weatherService';
import { trainService } from './trainService';

export class SafetyService {
  private alerts: SafetyAlert[] = [];

  constructor() {
    this.generateInitialAlerts();
    
    // Run safety checks every minute
    setInterval(() => {
      this.runAutomaticSafetyCheck();
    }, 60000);
  }

  private generateInitialAlerts(): void {
    this.alerts = [
      {
        id: 'ALERT-001',
        type: 'Maintenance',
        severity: 'Medium',
        title: 'Platform 3 Maintenance',
        description: 'Scheduled maintenance work on Platform 3 at Chennai Central',
        affectedTrains: ['EMU-001', 'EMU-002'],
        affectedStations: ['MAS'],
        timestamp: new Date().toISOString(),
        resolved: false
      },
      {
        id: 'ALERT-002',
        type: 'Weather',
        severity: 'Low',
        title: 'Weather Advisory',
        description: 'Light rain expected in the evening. Monitor track conditions.',
        affectedTrains: [],
        affectedStations: ['MAS', 'PER', 'VLK'],
        timestamp: new Date().toISOString(),
        resolved: false
      }
    ];
  }

  private runAutomaticSafetyCheck(): void {
    // Clear old resolved alerts
    this.alerts = this.alerts.filter(alert => !alert.resolved || 
      (new Date().getTime() - new Date(alert.timestamp).getTime()) < 3600000); // Keep for 1 hour

    // Run all safety checks
    const newAlerts = [
      ...this.checkWeatherCompliance(),
      ...this.checkGSRCompliance(),
      ...this.checkPlatformOccupancy(),
      ...this.checkSignalCompliance()
    ];

    // Add new alerts
    newAlerts.forEach(alert => {
      // Check if similar alert already exists
      const existingAlert = this.alerts.find(a => 
        a.type === alert.type && 
        a.title === alert.title && 
        !a.resolved
      );
      
      if (!existingAlert) {
        this.alerts.push(alert);
      }
    });
  }

  getAllAlerts(): SafetyAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  getAlertsByType(type: SafetyAlert['type']): SafetyAlert[] {
    return this.alerts.filter(alert => alert.type === type && !alert.resolved);
  }

  getAlertsBySeverity(severity: SafetyAlert['severity']): SafetyAlert[] {
    return this.alerts.filter(alert => alert.severity === severity && !alert.resolved);
  }

  createAlert(alert: Omit<SafetyAlert, 'id' | 'timestamp'>): SafetyAlert {
    const newAlert: SafetyAlert = {
      ...alert,
      id: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    this.alerts.push(newAlert);
    return newAlert;
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  checkWeatherCompliance(): SafetyAlert[] {
    const weather = weatherService.getCurrentWeather();
    const weatherAlerts: SafetyAlert[] = [];

    if (weather.impact === 'Restricted') {
      weatherAlerts.push(this.createAlert({
        type: 'Weather',
        severity: 'High',
        title: 'Severe Weather Conditions',
        description: `${weather.condition} with visibility ${weather.visibility} km. Speed restricted to 25 km/h.`,
        affectedTrains: trainService.getAllTrains().map(t => t.id),
        affectedStations: ['MAS', 'PER', 'VLK', 'KOK', 'WST'],
        resolved: false
      }));
    } else if (weather.impact === 'Caution') {
      weatherAlerts.push(this.createAlert({
        type: 'Weather',
        severity: 'Medium',
        title: 'Weather Caution',
        description: `${weather.condition}. Speed restricted to 50 km/h. Monitor conditions.`,
        affectedTrains: trainService.getAllTrains().map(t => t.id),
        affectedStations: ['MAS', 'PER', 'VLK'],
        resolved: false
      }));
    }

    return weatherAlerts;
  }

  checkSpeedCompliance(train: Train): boolean {
    const maxSpeed = weatherService.getSpeedRestriction();
    return train.speed <= maxSpeed;
  }

  checkGSRCompliance(): SafetyAlert[] {
    const violations: SafetyAlert[] = [];
    const trains = trainService.getAllTrains();
    const maxSpeed = weatherService.getSpeedRestriction();

    trains.forEach(train => {
      if (train.speed > maxSpeed) {
        violations.push(this.createAlert({
          type: 'Signal',
          severity: 'High',
          title: 'Speed Limit Violation',
          description: `Train ${train.number} exceeding speed limit. Current: ${train.speed} km/h, Max: ${maxSpeed} km/h`,
          affectedTrains: [train.id],
          affectedStations: [train.currentStation],
          resolved: false
        }));
      }
    });

    return violations;
  }

  checkPlatformOccupancy(): SafetyAlert[] {
    const violations: SafetyAlert[] = [];
    const platformOccupancy: { [key: string]: Train[] } = {};

    // Group trains by current station and platform
    trainService.getAllTrains().forEach(train => {
      if (train.platform && train.status !== 'Departed') {
        const key = `${train.currentStation}-${train.platform}`;
        if (!platformOccupancy[key]) {
          platformOccupancy[key] = [];
        }
        platformOccupancy[key].push(train);
      }
    });

    // Check for platform conflicts
    Object.entries(platformOccupancy).forEach(([key, trains]) => {
      if (trains.length > 1) {
        violations.push(this.createAlert({
          type: 'Track',
          severity: 'Critical',
          title: 'Platform Conflict',
          description: `Multiple trains assigned to ${key.replace('-', ' Platform ')}`,
          affectedTrains: trains.map(t => t.id),
          affectedStations: [trains[0].currentStation],
          resolved: false
        }));
      }
    });

    return violations;
  }

  checkSignalCompliance(): SafetyAlert[] {
    const violations: SafetyAlert[] = [];
    const trains = trainService.getAllTrains();

    // Check for trains with excessive delays
    trains.forEach(train => {
      if (train.delay > 30) {
        violations.push(this.createAlert({
          type: 'Signal',
          severity: 'Medium',
          title: 'Excessive Delay',
          description: `Train ${train.number} delayed by ${train.delay} minutes`,
          affectedTrains: [train.id],
          affectedStations: [train.currentStation],
          resolved: false
        }));
      }
    });

    return violations;
  }

  runSafetyCheck(): SafetyAlert[] {
    this.runAutomaticSafetyCheck();
    return this.getAllAlerts();
  }
}

export const safetyService = new SafetyService();