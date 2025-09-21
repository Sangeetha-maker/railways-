import { useState, useEffect } from 'react';
import { Train, WeatherData, SafetyAlert, AIRecommendation, Conflict, SystemMetrics } from '../types';

export function useTrains() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrains = async (type?: string, station?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (station) params.append('station', station);
      
      const response = await fetch(`/api/trains?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTrains(data.data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch trains');
    } finally {
      setLoading(false);
    }
  };

  const updateTrain = async (trainId: string, updates: any) => {
    try {
      const response = await fetch('/api/trains', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainId, ...updates })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTrains(); // Refresh data
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Failed to update train');
      throw err;
    }
  };

  useEffect(() => {
    fetchTrains();
    const interval = setInterval(fetchTrains, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { trains, loading, error, fetchTrains, updateTrain };
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/weather');
      const data = await response.json();
      
      if (data.success) {
        setWeather(data.data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error, fetchWeather };
}

export function useSafety() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async (type?: string, severity?: string, runCheck?: boolean) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (severity) params.append('severity', severity);
      if (runCheck) params.append('runCheck', 'true');
      
      const response = await fetch(`/api/safety?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setAlerts(data.data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch safety alerts');
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (alert: any) => {
    try {
      const response = await fetch('/api/safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchAlerts(); // Refresh data
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Failed to create alert');
      throw err;
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/safety', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchAlerts(); // Refresh data
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Failed to resolve alert');
      throw err;
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(() => fetchAlerts(undefined, undefined, true), 60000); // Run safety check every minute
    return () => clearInterval(interval);
  }, []);

  return { alerts, loading, error, fetchAlerts, createAlert, resolveAlert };
}

export function useAI() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (type?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      
      const response = await fetch(`/api/ai?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const fetchConflicts = async (type?: string) => {
    try {
      const params = new URLSearchParams();
      params.append('action', 'conflicts');
      if (type) params.append('conflictType', type);
      
      const response = await fetch(`/api/ai?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setConflicts(data.data);
      }
    } catch (err) {
      setError('Failed to fetch conflicts');
    }
  };

  const runWhatIfAnalysis = async (scenario: any) => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'what-if-analysis', scenario })
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Failed to run what-if analysis');
      throw err;
    }
  };

  useEffect(() => {
    fetchRecommendations();
    fetchConflicts();
    const interval = setInterval(() => {
      fetchRecommendations();
      fetchConflicts();
    }, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, []);

  return { 
    recommendations, 
    conflicts, 
    loading, 
    error, 
    fetchRecommendations, 
    fetchConflicts, 
    runWhatIfAnalysis 
  };
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error, fetchMetrics };
}