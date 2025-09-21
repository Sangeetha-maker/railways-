import { AIRecommendation, Conflict, Train } from '../types';
import { trainService } from './trainService';
import { weatherService } from './weatherService';
import { safetyService } from './safetyService';

export class AIService {
  private recommendations: AIRecommendation[] = [];
  private conflicts: Conflict[] = [];

  constructor() {
    this.generateInitialRecommendations();
    this.detectConflicts();
  }

  private generateInitialRecommendations(): void {
    this.recommendations = [
      {
        id: 'REC-001',
        type: 'Priority',
        title: 'Increase EMU Priority During Peak Hours',
        description: 'Boost EMU train priority from 8 AM to 10 AM to improve passenger flow',
        impact: 'Reduce average delay by 3-5 minutes for local services',
        confidence: 87,
        affectedTrains: trainService.getTrainsByType('EMU').map(t => t.id),
        timestamp: new Date().toISOString()
      },
      {
        id: 'REC-002',
        type: 'Platform',
        title: 'Optimize Platform 1 Usage',
        description: 'Reassign Express trains to Platform 1 for better passenger access',
        impact: 'Improve boarding efficiency by 15%',
        confidence: 92,
        affectedTrains: trainService.getTrainsByType('Express').slice(0, 2).map(t => t.id),
        timestamp: new Date().toISOString()
      }
    ];
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
          id: `CONF-${Date.now()}-${key}`,
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
      const key = `${train.currentStation}-${train.estimatedArrival}`;
      if (!stationArrivals[key]) {
        stationArrivals[key] = [];
      }
      stationArrivals[key].push(train);
    });

    Object.entries(stationArrivals).forEach(([key, conflictingTrains]) => {
      if (conflictingTrains.length > 1) {
        this.conflicts.push({
          id: `CONF-${Date.now()}-${key}`,
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

  private calculateConflictPriority(trains: Train[]): number {
    const maxTrainPriority = Math.max(...trains.map(t => t.priority));
    const passengerImpact = trains.reduce((sum, t) => sum + t.passengerLoad, 0);
    
    return Math.min(10, Math.floor(maxTrainPriority + (passengerImpact / 100)));
  }

  getAllRecommendations(): AIRecommendation[] {
    return this.recommendations;
  }

  getRecommendationsByType(type: AIRecommendation['type']): AIRecommendation[] {
    return this.recommendations.filter(rec => rec.type === type);
  }

  getAllConflicts(): Conflict[] {
    this.detectConflicts(); // Refresh conflicts
    return this.conflicts;
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

    // Simulate changes
    const originalPriority = train.priority;
    const originalDelay = train.delay;

    if (scenario.newPriority) train.priority = scenario.newPriority;
    if (scenario.delayMinutes) train.delay += scenario.delayMinutes;

    // Analyze impact
    const newConflicts = this.getAllConflicts();
    const affectedTrains = this.findAffectedTrains(train);

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

    // Restore original values
    train.priority = originalPriority;
    train.delay = originalDelay;

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
    
    impact += `- Estimated passenger impact: ${train.passengerLoad}% capacity affected`;
    
    return impact;
  }
}

export const aiService = new AIService();