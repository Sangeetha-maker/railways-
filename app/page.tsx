'use client';

import { useState, useEffect } from 'react';
import { Train, Activity, AlertTriangle, Cloud, Users, Clock, TrendingUp } from 'lucide-react';

export default function RailwayDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState({
    activeTrains: 24,
    onTimePerformance: 94,
    activeAlerts: 3,
    passengersToday: 45678,
    averageDelay: 4.2,
    platformUtilization: 78
  });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: 'Live Train Monitoring',
      description: 'Real-time tracking of EMU, Express, Superfast, and Freight trains',
      icon: Train,
      color: 'bg-blue-500',
      stats: `${metrics.activeTrains} Active Trains`
    },
    {
      title: 'AI Decision Support',
      description: 'Intelligent conflict resolution and operational recommendations',
      icon: Activity,
      color: 'bg-green-500',
      stats: '12 Recommendations'
    },
    {
      title: 'Safety Compliance',
      description: 'Automated safety rule checking with G&SR, SWR, Operating rules',
      icon: AlertTriangle,
      color: 'bg-red-500',
      stats: `${metrics.activeAlerts} Active Alerts`
    },
    {
      title: 'Weather Integration',
      description: 'Live weather data from Chennai affecting railway operations',
      icon: Cloud,
      color: 'bg-purple-500',
      stats: 'Clear, 28°C'
    },
    {
      title: 'What-If Analysis',
      description: 'Simulate operational changes and analyze their impact',
      icon: TrendingUp,
      color: 'bg-orange-500',
      stats: '5 Scenarios'
    },
    {
      title: 'Peak Hour Management',
      description: 'Dynamic priority adjustment based on time of day',
      icon: Clock,
      color: 'bg-indigo-500',
      stats: 'Peak Mode Active'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Train className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Railway Decision Support System</h1>
                <p className="text-blue-200">Chennai Central - Gummidipundi Section</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-mono text-lg">
                {mounted ? currentTime.toLocaleTimeString('en-IN', { 
                  hour12: false,
                  timeZone: 'Asia/Kolkata'
                }) : '--:--:--'}
              </div>
              <div className="text-blue-200 text-sm">IST</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Active Trains</p>
                <p className="text-3xl font-bold text-white">{metrics.activeTrains}</p>
              </div>
              <Train className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">On-Time Performance</p>
                <p className="text-3xl font-bold text-white">{metrics.onTimePerformance}%</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">Active Alerts</p>
                <p className="text-3xl font-bold text-white">{metrics.activeAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Passengers Today</p>
                <p className="text-3xl font-bold text-white">{metrics.passengersToday.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white">All Systems Operational</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-white">Weather: Clear, 28°C</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-white">Peak Hour Mode: Active</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${feature.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-blue-200 text-sm mb-3">{feature.description}</p>
                    <div className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full inline-block">
                      {feature.stats}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white">EMU-001 departed Chennai Central on time</span>
              <span className="text-blue-300 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white">Express-1661 delayed by 3 minutes at Perambur</span>
              <span className="text-blue-300 ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white">Platform 3 maintenance completed at Chennai Central</span>
              <span className="text-blue-300 ml-auto">12 min ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}