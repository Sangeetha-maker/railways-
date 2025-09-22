import { AIRecommendation, Conflict, Train } from '../types';
import { trainService } from './trainService';
import { weatherService } from './weatherService';
import { safetyService } from './safetyService';

export class AIService {
  private recommendations: AIRecommendation[] = [];
  private conflicts: Conflict[] = [];

  constructor() {
    this.generateInitialRecommendations();
    
    // Update AI analysis every 2 minutes
    setInterval(() => {
      this.updateAnalysis();
    }, 120000);
  }

  private updateAnalysis(): void {
    this.generateRecommendations();
    this.detectConflicts();
  }

  private generateInitialRecommendations(): void {
    this.generateRecommendations();
    this.detectConflicts();
  }

  private generateRecommendations(): void {
    this.recommendations = [];
    
    const currentHour = new Date().getHours();
    const weather = weatherService.getCurrentWeather();
    const trains = trainService.getAllTrains();

    // Peak hour recommendations
    if ((currentHour >= 8 && currentHour <= 10) || (currentHour >= 18 && currentHour <= 20)) {
      this.recommendations.push({
        id: `REC-PEAK-${Date.now()}`,
        type: 'Priority',
        title: 'Peak Hour Priority Adjustment',
        description: 'Increase EMU train priority during peak hours for better passenger service',
        impact: 'Reduce passenger waiting time by 20%',
        confidence: 88,
        affectedTrains: trainService.getTrainsByType('EMU').map(t => t.id),
        timestamp: new Date().toISOString()
      });
    }

    // Weather-based recommendations
    if (weather.impact !== 'Normal') {
      this.recommendations.push({
        id: `REC-WEATHER-${Date.now()}`,
        type: 'Route',
        title: 'Weather-Based Speed Restrictions',
        description: `Implement ${weatherService.getSpeedRestriction()} km/h speed limit due to ${weather.condition.toLowerCase()}`,
        impact: weather.impact === 'Restricted' ? 'Ensure safety compliance, expect 10-15 minute delays' : 'Monitor conditions closely',
        confidence: 95,
        affectedTrains: trains.map(t => t.id),
        timestamp: new Date().toISOString()
      });
    }

    // Platform optimization
    const delayedTrains = trains.filter(t => t.delay > 10);
    if (delayedTrains.length > 3) {
      this.recommendations.push({
        id: `REC-PLATFORM-${Date.now()}`,
        type: 'Platform',
        title: 'Platform Reallocation',
        description: 'Optimize platform assignments to reduce delays',
        impact: 'Reduce average delay by 5-8 minutes',
        confidence: 82,
        affectedTrains: delayedTrains.slice(0, 5).map(t => t.id),
        timestamp: new Date().toISOString()
      });
    }

    // Priority optimization
    const lowPriorityDelayed = trains.filter(t => t.delay > 15 && t.priority < 5);
    if (lowPriorityDelayed.length > 0) {
      this.recommendations.push({
        id: `REC-PRIORITY-${Date.now()}`,
        type: 'Priority',
        title: 'Priority Adjustment for Delayed Trains',
        description: 'Increase priority for significantly delayed trains',
        impact: 'Improve recovery time for delayed services',
        confidence: 75,
        affectedTrains: lowPriorityDelayed.map(t => t.id),
        timestamp: new Date().toISOString()
      });
    }
  }

  private detectConflicts(): void {
    this.conflicts = [];
    const trains = trainService.getAllTrains();
    
    // Platform conflicts
    const platformOccupancy: { [key: string]: Train[] } = {};
    
    trains.forEach(train => {
      if (train.platform && train.status !== 'Departed') {
        const key = `${train.currentStation}-${train.platform}`;
        if (!platformOccupancy[key]) {
          platformOccupancy[key] = [];
        }
        platformOccupancy[key].push(train);
      }
    });

    Object.entries(platformOccupancy).forEach(([key, conflictingTrains]) => {
      if (conflictingTrains.length > 1) {
        this.conflicts.push({
          id: `CONF-PLATFORM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'Platform',
          trains: conflictingTrains.map(t => t.id),
          station: conflictingTrains[0].currentStation,
          description: `Multiple trains assigned to ${key.replace('-', ' Platform ')}`,
          suggestedResolution: this.generatePlatformResolution(conflictingTrains),
          priority: this.calculateConflictPriority(conflictingTrains),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Timing conflicts (trains arriving at same time)
    const stationArrivals: { [key: string]: Train[] } = {};
    
    trains.forEach(train => {
      if (train.estimatedArrival) {
        const key = `${train.currentStation}-${train.estimatedArrival}`;
        if (!stationArrivals[key]) {
          stationArrivals[key] = [];
        }
        stationArrivals[key].push(train);
      }
    });

    Object.entries(stationArrivals).forEach(([key, conflictingTrains]) => {
      if (conflictingTrains.length > 1) {
        this.conflicts.push({
          id: `CONF-TIMING-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'Timing',
          trains: conflictingTrains.map(t => t.id),
          station: conflictingTrains[0].currentStation,
          description: `Multiple trains scheduled to arrive at ${conflictingTrains[0].estimatedArrival}`,
          suggestedResolution: this.generateTimingResolution(conflictingTrains),
          priority: this.calculateConflictPriority(conflictingTrains),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Track conflicts (same route segment)
    const routeSegments: { [key: string]: Train[] } = {};
    
    trains.forEach(train => {
      const segment = `${train.currentStation}-${train.nextStation}`;
      if (!routeSegments[segment]) {
        routeSegments[segment] = [];
      }
      routeSegments[segment].push(train);
    });

    Object.entries(routeSegments).forEach(([segment, conflictingTrains]) => {
      if (conflictingTrains.length > 1) {
        // Check if trains are close in time
        const timeDiff = Math.abs(
          new Date(`1970-01-01T${conflictingTrains[0].estimatedArrival}:00`).getTime() -
          new Date(`1970-01-01T${conflictingTrains[1].estimatedArrival}:00`).getTime()
        );
        
        if (timeDiff < 300000) { // Less than 5 minutes apart
          this.conflicts.push({
            id: `CONF-TRACK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'Track',
            trains: conflictingTrains.map(t => t.id),
            station: conflictingTrains[0].currentStation,
            description: `Multiple trains on same track segment: ${segment}`,
            suggestedResolution: this.generateTrackResolution(conflictingTrains),
            priority: this.calculateConflictPriority(conflictingTrains),
            timestamp: new Date().toISOString()
          });
        }
      }
    });
  }

  private generatePlatformResolution(trains: Train[]): string {
    const highestPriority = trains.reduce((max, train) => 
      train.priority > max.priority ? train : max
    );
    
    return `Assign Platform to ${highestPriority.number} (Priority: ${highestPriority.priority}). Redirect other trains to available platforms.`;
  }

  private generateTimingResolution(trains: Train[]): string {
    const sortedByPriority = trains.sort((a, b) => b.priority - a.priority);
    
    return `Maintain schedule for ${sortedByPriority[0].number} (highest priority). Delay others by 2-3 minutes.`;
  }

  private generateTrackResolution(trains: Train[]): string {
    const sortedByPriority = trains.sort((a, b) => b.priority - a.priority);
    
    return `Give track priority to ${sortedByPriority[0].number}. Hold ${sortedByPriority[1].number} at current station for 5 minutes.`;
  }

  private calculateConflictPriority(trains: Train[]): number {
    const maxTrainPriority = Math.max(...trains.map(t => t.priority));
    const passengerImpact = trains.reduce((sum, t) => sum + t.passengerLoad, 0);
    
    return Math.min(10, Math.floor(maxTrainPriority + (passengerImpact / 100)));
  }

  getAllRecommendations(): AIRecommendation[] {
    return [...this.recommendations];
  }

  getRecommendationsByType(type: AIRecommendation['type']): AIRecommendation[] {
    return this.recommendations.filter(rec => rec.type === type);
  }

  getAllConflicts(): Conflict[] {
    return [...this.conflicts];
  }

  getConflictsByType(type: Conflict['type']): Conflict[] {
    return this.conflicts.filter(conflict => conflict.type === type);
  }

  generateWeatherBasedRecommendations(): AIRecommendation[] {
    const weather = weatherService.getCurrentWeather();
    const recommendations: AIRecommendation[] = [];

    if (weather.impact === 'Restricted') {
      recommendations.push({
        id: `REC-WEATHER-${Date.now()}`,
        type: 'Route',
        title: 'Weather-Based Speed Restrictions',
        description: `Implement 25 km/h speed limit due to ${weather.condition.toLowerCase()}`,
        impact: 'Ensure safety compliance, expect 10-15 minute delays',
        confidence: 95,
        affectedTrains: trainService.getAllTrains().map(t => t.id),
        timestamp: new Date().toISOString()
      });
    }

    return recommendations;
  }

  generatePriorityOptimization(): AIRecommendation[] {
    const currentHour = new Date().getHours();
    const recommendations: AIRecommendation[] = [];

    // Peak hour optimization (8-10 AM, 6-8 PM)
    if ((currentHour >= 8 && currentHour <= 10) || (currentHour >= 18 && currentHour <= 20)) {
      recommendations.push({
        id: `REC-PEAK-${Date.now()}`,
        type: 'Priority',
        title: 'Peak Hour Priority Adjustment',
        description: 'Increase EMU train priority during peak hours for better passenger service',
        impact: 'Reduce passenger waiting time by 20%',
        confidence: 88,
        affectedTrains: trainService.getTrainsByType('EMU').map(t => t.id),
        timestamp: new Date().toISOString()
      });
    }

    return recommendations;
  }

  runWhatIfAnalysis(scenario: {
    trainId: string;
    newPriority?: number;
    newRoute?: string[];
    delayMinutes?: number;
  }): {
    impact: string;
    affectedTrains: string[];
    newConflicts: Conflict[];
    recommendations: AIRecommendation[];
  } {
    const train = trainService.getTrainById(scenario.trainId);
    if (!train) {
      return {
        impact: 'Train not found',
        affectedTrains: [],
        newConflicts: [],
        recommendations: []
      };
    }

    // Store original values
    const originalPriority = train.priority;
    const originalDelay = train.delay;
    const originalRoute = [...train.route];

    // Apply scenario changes temporarily
    if (scenario.newPriority !== undefined) train.priority = scenario.newPriority;
    if (scenario.delayMinutes !== undefined) train.delay += scenario.delayMinutes;
    if (scenario.newRoute) train.route = scenario.newRoute;

    // Analyze impact
    const affectedTrains = this.findAffectedTrains(train);
    
    // Detect new conflicts with changes
    const originalConflicts = [...this.conflicts];
    this.detectConflicts();
    const newConflicts = this.conflicts.filter(conflict => 
      !originalConflicts.some(orig => orig.id === conflict.id)
    );

    // Generate recommendations based on analysis
    const recommendations: AIRecommendation[] = [];
    
    if (scenario.newPriority && scenario.newPriority > originalPriority) {
      recommendations.push({
        id: `WHATIF-${Date.now()}`,
        type: 'Priority',
        title: 'Priority Increase Impact',
        description: `Increasing priority to ${scenario.newPriority} will improve scheduling`,
        impact: `Reduce delays for ${train.number} by 2-4 minutes`,
        confidence: 82,
        affectedTrains: [train.id],
        timestamp: new Date().toISOString()
      });
    }

    if (scenario.delayMinutes && scenario.delayMinutes > 0) {
      recommendations.push({
        id: `WHATIF-DELAY-${Date.now()}`,
        type: 'Delay',
        title: 'Delay Impact Analysis',
        description: `Adding ${scenario.delayMinutes} minutes delay will affect downstream services`,
        impact: `${affectedTrains.length} trains may experience cascading delays`,
        confidence: 75,
        affectedTrains: affectedTrains.map(t => t.id),
        timestamp: new Date().toISOString()
      });
    }

    // Restore original values
    train.priority = originalPriority;
    train.delay = originalDelay;
    train.route = originalRoute;
    this.conflicts = originalConflicts;

    return {
      impact: this.calculateScenarioImpact(scenario, train),
      affectedTrains: affectedTrains.map(t => t.id),
      newConflicts,
      recommendations
    };
  }

  private findAffectedTrains(changedTrain: Train): Train[] {
    return trainService.getAllTrains().filter(train => 
      train.id !== changedTrain.id &&
      (train.currentStation === changedTrain.currentStation ||
       train.nextStation === changedTrain.currentStation ||
       train.route.some(station => changedTrain.route.includes(station)))
    );
  }

  private calculateScenarioImpact(scenario: any, train: Train): string {
    let impact = `Changes to ${train.number}:\n`;
    
    if (scenario.newPriority) {
      impact += `- Priority change: ${train.priority} → ${scenario.newPriority}\n`;
    }
    
    if (scenario.delayMinutes) {
      impact += `- Additional delay: +${scenario.delayMinutes} minutes\n`;
    }
    
    if (scenario.newRoute) {
      impact += `- Route change: ${scenario.newRoute.length} stations\n`;
    }
    
    impact += `- Estimated passenger impact: ${train.passengerLoad}% capacity affected`;
    
    return impact;
  }
}

export const aiService = new AIService();