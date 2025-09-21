import { Station } from '../types';

export const stations: Station[] = [
  {
    id: 'MAS',
    code: 'MAS',
    name: 'Chennai Central',
    platforms: 12,
    coordinates: { lat: 13.0827, lng: 80.2707 },
    distance: 0
  },
  {
    id: 'PER',
    code: 'PER',
    name: 'Perambur',
    platforms: 4,
    coordinates: { lat: 13.1185, lng: 80.2324 },
    distance: 8
  },
  {
    id: 'VLK',
    code: 'VLK',
    name: 'Villivakkam',
    platforms: 2,
    coordinates: { lat: 13.1394, lng: 80.2089 },
    distance: 12
  },
  {
    id: 'KOK',
    code: 'KOK',
    name: 'Korukkupet',
    platforms: 2,
    coordinates: { lat: 13.1567, lng: 80.1876 },
    distance: 16
  },
  {
    id: 'WST',
    code: 'WST',
    name: 'Washermanpet',
    platforms: 2,
    coordinates: { lat: 13.1789, lng: 80.1654 },
    distance: 20
  },
  {
    id: 'TNP',
    code: 'TNP',
    name: 'Tondiarpet',
    platforms: 2,
    coordinates: { lat: 13.1923, lng: 80.1432 },
    distance: 24
  },
  {
    id: 'KVP',
    code: 'KVP',
    name: 'Kaveri Pakkam',
    platforms: 2,
    coordinates: { lat: 13.2156, lng: 80.1298 },
    distance: 28
  },
  {
    id: 'ENR',
    code: 'ENR',
    name: 'Ennore',
    platforms: 3,
    coordinates: { lat: 13.2389, lng: 80.1165 },
    distance: 32
  },
  {
    id: 'AIP',
    code: 'AIP',
    name: 'Athipattu',
    platforms: 2,
    coordinates: { lat: 13.2634, lng: 80.1023 },
    distance: 36
  },
  {
    id: 'MJR',
    code: 'MJR',
    name: 'Minjur',
    platforms: 2,
    coordinates: { lat: 13.2789, lng: 80.0876 },
    distance: 40
  },
  {
    id: 'PON',
    code: 'PON',
    name: 'Ponneri',
    platforms: 3,
    coordinates: { lat: 13.3345, lng: 80.0654 },
    distance: 44
  },
  {
    id: 'KTM',
    code: 'KTM',
    name: 'Kattupalli',
    platforms: 2,
    coordinates: { lat: 13.3567, lng: 80.0432 },
    distance: 48
  },
  {
    id: 'TRL',
    code: 'TRL',
    name: 'Tiruvallur',
    platforms: 4,
    coordinates: { lat: 13.3789, lng: 80.0298 },
    distance: 52
  },
  {
    id: 'GPD',
    code: 'GPD',
    name: 'Gummidipundi',
    platforms: 3,
    coordinates: { lat: 13.4123, lng: 80.0165 },
    distance: 58
  }
];

export const getStationByCode = (code: string): Station | undefined => {
  return stations.find(station => station.code === code);
};

export const getStationsByRoute = (route: string[]): Station[] => {
  return route.map(code => getStationByCode(code)).filter(Boolean) as Station[];
};