import { WeatherData } from '../types';

export class WeatherService {
  private currentWeather: WeatherData;
  private lastUpdate: Date;

  constructor() {
    this.currentWeather = this.generateMockWeather();
    this.lastUpdate = new Date();
    
    // Update weather every 5 minutes
    setInterval(() => {
      this.updateWeather();
    }, 300000);
  }

  private generateMockWeather(): WeatherData {
    const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Fog', 'Thunderstorm'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    let visibility = 10;
    let impact: WeatherData['impact'] = 'Normal';
    
    // Adjust visibility and impact based on condition
    switch (condition) {
      case 'Fog':
        visibility = Math.random() * 2 + 0.5; // 0.5-2.5 km
        impact = visibility < 2 ? 'Restricted' : 'Caution';
        break;
      case 'Heavy Rain':
      case 'Thunderstorm':
        visibility = Math.random() * 3 + 2; // 2-5 km
        impact = 'Caution';
        break;
      case 'Light Rain':
        visibility = Math.random() * 2 + 5; // 5-7 km
        impact = 'Caution';
        break;
      default:
        visibility = Math.random() * 5 + 8; // 8-13 km
        impact = 'Normal';
    }

    return {
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition,
      visibility: Math.round(visibility * 10) / 10,
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      impact
    };
  }

  private updateWeather(): void {
    // 20% chance to change weather
    if (Math.random() < 0.2) {
      this.currentWeather = this.generateMockWeather();
      this.lastUpdate = new Date();
    }
  }

  getCurrentWeather(): WeatherData {
    return { ...this.currentWeather };
  }

  getWeatherImpact(): string {
    const weather = this.getCurrentWeather();
    
    switch (weather.impact) {
      case 'Restricted':
        return `Severe weather conditions. Speed restrictions: 25 km/h. Visibility: ${weather.visibility} km.`;
      case 'Caution':
        return `Caution advised. Speed restrictions: 50 km/h. Monitor conditions closely.`;
      default:
        return 'Normal weather conditions. No restrictions.';
    }
  }

  getSpeedRestriction(): number {
    const weather = this.getCurrentWeather();
    
    switch (weather.impact) {
      case 'Restricted':
        return 25;
      case 'Caution':
        return 50;
      default:
        return 120; // Normal max speed
    }
  }

  getLastUpdate(): Date {
    return new Date(this.lastUpdate);
  }
}

export const weatherService = new WeatherService();