import { Train } from '../types';
import { stations } from '../data/stations';

// Mock train data generator
export class TrainService {
  private trains: Train[] = [];

  constructor() {
    this.generateMockTrains();
  }

  private generateMockTrains(): void {
    const trainTypes: Train['type'][] = ['EMU', 'Express', 'Superfast', 'Freight'];
    const statuses: Train['status'][] = ['On Time', 'Delayed', 'Departed'];
    
    // Generate EMU trains (local service)
    for (let i = 1; i <= 15; i++) {
      const currentStationIndex = Math.floor(Math.random() * stations.length);
      const nextStationIndex = Math.min(currentStationIndex + 1, stations.length - 1);
      
      this.trains.push({
        id: `EMU-${i.toString().padStart(3, '0')}`,
        number: `43${i.toString().padStart(3, '0')}`,
        name: `EMU Local ${i}`,
        type: 'EMU',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        currentStation: stations[currentStationIndex].code,
        nextStation: stations[nextStationIndex].code,
        speed: Math.floor(Math.random() * 60) + 20,
        delay: Math.floor(Math.random() * 15),
        passengerLoad: Math.floor(Math.random() * 40) + 60,
        platform: `${Math.floor(Math.random() * 4) + 1}`,
        estimatedArrival: this.generateTime(0, 30),
        estimatedDeparture: this.generateTime(2, 35),
        route: stations.slice(0, Math.floor(Math.random() * 5) + 8).map(s => s.code),
        priority: Math.floor(Math.random() * 3) + 3,
        coordinates: {
          lat: stations[currentStationIndex].coordinates.lat + (Math.random() - 0.5) * 0.01,
          lng: stations[currentStationIndex].coordinates.lng + (Math.random() - 0.5) * 0.01
        }
      });
    }

    // Generate Express trains
    for (let i = 1; i <= 6; i++) {
      const currentStationIndex = Math.floor(Math.random() * stations.length);
      const nextStationIndex = Math.min(currentStationIndex + 1, stations.length - 1);
      
      this.trains.push({
        id: `EXP-${i.toString().padStart(3, '0')}`,
        number: `166${i}`,
        name: `Chennai Express ${i}`,
        type: 'Express',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        currentStation: stations[currentStationIndex].code,
        nextStation: stations[nextStationIndex].code,
        speed: Math.floor(Math.random() * 40) + 80,
        delay: Math.floor(Math.random() * 20),
        passengerLoad: Math.floor(Math.random() * 30) + 70,
        platform: `${Math.floor(Math.random() * 6) + 1}`,
        estimatedArrival: this.generateTime(0, 60),
        estimatedDeparture: this.generateTime(5, 65),
        route: stations.map(s => s.code),
        priority: Math.floor(Math.random() * 3) + 6,
        coordinates: {
          lat: stations[currentStationIndex].coordinates.lat + (Math.random() - 0.5) * 0.01,
          lng: stations[currentStationIndex].coordinates.lng + (Math.random() - 0.5) * 0.01
        }
      });
    }

    // Generate Freight trains
    for (let i = 1; i <= 3; i++) {
      const currentStationIndex = Math.floor(Math.random() * stations.length);
      const nextStationIndex = Math.min(currentStationIndex + 1, stations.length - 1);
      
      this.trains.push({
        id: `FRT-${i.toString().padStart(3, '0')}`,
        number: `560${i}`,
        name: `Freight ${i}`,
        type: 'Freight',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        currentStation: stations[currentStationIndex].code,
        nextStation: stations[nextStationIndex].code,
        speed: Math.floor(Math.random() * 30) + 40,
        delay: Math.floor(Math.random() * 30),
        passengerLoad: 0,
        estimatedArrival: this.generateTime(0, 120),
        estimatedDeparture: this.generateTime(10, 130),
        route: stations.slice(0, Math.floor(Math.random() * 8) + 6).map(s => s.code),
        priority: Math.floor(Math.random() * 2) + 1,
        coordinates: {
          lat: stations[currentStationIndex].coordinates.lat + (Math.random() - 0.5) * 0.01,
          lng: stations[currentStationIndex].coordinates.lng + (Math.random() - 0.5) * 0.01
        }
      });
    }
  }

  private generateTime(minOffset: number, maxOffset: number): string {
    const now = new Date();
    const offset = Math.floor(Math.random() * (maxOffset - minOffset)) + minOffset;
    const time = new Date(now.getTime() + offset * 60000);
    return time.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  getAllTrains(): Train[] {
    return this.trains;
  }

  getTrainById(id: string): Train | undefined {
    return this.trains.find(train => train.id === id);
  }

  getTrainsByType(type: Train['type']): Train[] {
    return this.trains.filter(train => train.type === type);
  }

  getTrainsByStation(stationCode: string): Train[] {
    return this.trains.filter(train => 
      train.currentStation === stationCode || 
      train.nextStation === stationCode ||
      train.route.includes(stationCode)
    );
  }

  updateTrainPosition(trainId: string, stationCode: string): boolean {
    const train = this.getTrainById(trainId);
    if (train) {
      const stationIndex = train.route.indexOf(stationCode);
      if (stationIndex !== -1) {
        train.currentStation = stationCode;
        train.nextStation = train.route[stationIndex + 1] || train.route[train.route.length - 1];
        return true;
      }
    }
    return false;
  }

  updateTrainStatus(trainId: string, status: Train['status'], delay?: number): boolean {
    const train = this.getTrainById(trainId);
    if (train) {
      train.status = status;
      if (delay !== undefined) {
        train.delay = delay;
      }
      return true;
    }
    return false;
  }
}

export const trainService = new TrainService();