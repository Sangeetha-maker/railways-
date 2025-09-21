import { Train, MapPin, AlertTriangle, Cloud, Activity, Users } from 'lucide-react';
import { useMetrics, useWeather, useSafety } from '@/lib/hooks/useRailwayData';
import { useEffect, useState } from 'react';

function DashboardContent() {
  const { metrics, loading: metricsLoading } = useMetrics();
  const { weather, loading: weatherLoading } = useWeather();
  const { alerts, loading: alertsLoading } = useSafety();

  if (metricsLoading || weatherLoading || alertsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Railway System...</p>
        </div>
      </div>
    );
  }

export default function Home() {
  return <DashboardContent />;
}

function DashboardContent() {
  const { metrics } = useMetrics();
  const { weather } = useWeather();
  const { alerts } = useSafety();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Train className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Railway DSS</h1>
                <p className="text-sm text-gray-600">Chennai Central - Gummidipundi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Railway Decision Support System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive railway management for Chennai Central - Gummidipundi section with 
            real-time monitoring, AI-powered decisions, and safety compliance.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trains</p>
                <p className="text-3xl font-bold text-gray-900">{metrics?.activeTrains || 0}</p>
              </div>
              <Train className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-sm text-green-600 mt-2">Real-time tracking</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Performance</p>
                <p className="text-3xl font-bold text-gray-900">{metrics?.onTimePerformance || 0}%</p>
              </div>
              <Activity className="h-12 w-12 text-blue-500" />
            </div>
            <p className="text-sm text-blue-600 mt-2">Avg delay: {metrics?.averageDelay || 0} min</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{alerts?.length || 0}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
            </div>
            <p className="text-sm text-yellow-600 mt-2">Safety monitoring active</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passengers Today</p>
                <p className="text-3xl font-bold text-gray-900">{((metrics?.passengersToday || 0) / 1000).toFixed(1)}K</p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
            <p className="text-sm text-purple-600 mt-2">Platform util: {metrics?.platformUtilization || 0}%</p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Live Monitoring</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Real-time tracking of EMU, Express, Superfast, and Freight trains with 
              position updates, speed monitoring, and delay tracking.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              View Live Map
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI Decision Support</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Intelligent conflict resolution, priority-based scheduling, and 
              operational recommendations powered by advanced algorithms.
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Access AI Engine
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Safety Compliance</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Automated checking of G&SR, SWR, Operating, and Signal rules with 
              real-time violation detection and alerts.
            </p>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Safety Dashboard
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Cloud className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Weather Integration</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Live weather data from Chennai affecting operations with automatic 
              safety protocol adjustments for visibility and conditions.
            </p>
            <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
              Weather Impact
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">What-If Analysis</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Simulate operational changes, analyze impact of priority adjustments, 
              and optimize platform utilization strategies.
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Run Simulation
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Train className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Conflict Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Automatic detection and resolution of train conflicts with 
              peak hour management and dynamic priority adjustments.
            </p>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Manage Conflicts
            </button>
          </div>
        </div>

        {/* Current Weather & Alerts */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-blue-600" />
              Current Weather - Chennai
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{weather?.temperature || 0}°C</p>
                <p className="text-gray-600">{weather?.condition || 'Loading...'}</p>
                <p className="text-sm text-gray-500">Visibility: {weather?.visibility || 0} km</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Wind: {weather?.windSpeed || 0} km/h</p>
                <p className="text-sm text-gray-600">Humidity: {weather?.humidity || 0}%</p>
                <p className={`text-sm font-medium ${
                  weather?.impact === 'Normal' ? 'text-green-600' : 
                  weather?.impact === 'Caution' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {weather?.impact || 'Normal'} Operations
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Active Alerts
            </h3>
            <div className="space-y-3">
              {alerts && alerts.length > 0 ? (
                alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    alert.severity === 'Critical' ? 'bg-red-50' :
                    alert.severity === 'High' ? 'bg-orange-50' :
                    alert.severity === 'Medium' ? 'bg-yellow-50' : 'bg-blue-50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      alert.severity === 'Critical' ? 'bg-red-500' :
                      alert.severity === 'High' ? 'bg-orange-500' :
                      alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">All Clear</p>
                    <p className="text-sm text-gray-600">No active safety alerts</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}