// Core data types for the Railway DSS
export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'EMU' | 'Express' | 'Superfast' | 'Freight';
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Departed';
  currentStation: string;
  nextStation: string;
  speed: number;
  delay: number; // in minutes
  passengerLoad: number; // percentage
  platform?: string;
  estimatedArrival: string;
  estimatedDeparture: string;
  route: string[];
  priority: number; // 1-10, 10 being highest
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Station {
  id: string;
  code: string;
  name: string;
  platforms: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number; // from Chennai Central in km
}

export interface WeatherData {
  temperature: number;
  condition: string;
  visibility: number; // in km
  windSpeed: number;
  humidity: number;
  impact: 'Normal' | 'Caution' | 'Restricted';
}

export interface SafetyAlert {
  id: string;
  type: 'Weather' | 'Maintenance' | 'Signal' | 'Track' | 'Emergency';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  affectedTrains: string[];
  affectedStations: string[];
  timestamp: string;
  resolved: boolean;
}

export interface Conflict {
  id: string;
  type: 'Platform' | 'Track' | 'Signal' | 'Timing';
  trains: string[];
  station: string;
  description: string;
  suggestedResolution: string;
  priority: number;
  timestamp: string;
}

export interface AIRecommendation {
  id: string;
  type: 'Priority' | 'Route' | 'Platform' | 'Delay';
  title: string;
  description: string;
  impact: string;
  confidence: number; // 0-100
  affectedTrains: string[];
  timestamp: string;
}

export interface SystemMetrics {
  activeTrains: number;
  onTimePerformance: number;
  activeAlerts: number;
  passengersToday: number;
  averageDelay: number;
  platformUtilization: number;
}