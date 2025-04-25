import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CoreUIFramework, { useUI } from '../core/CoreUIFramework';
import { useIsMobile, useIsTablet } from '../core/hooks/useMediaQuery';
import './styles/MonitoringInterface.css';

/**
 * Enhanced Monitoring Interface for Lumina AI
 * Provides real-time monitoring of system performance, logs, and alerts
 * with improved interactivity, accessibility, and responsive design
 */
const MonitoringInterface = ({ userId }) => {
  const { addNotification, theme, reducedMotion } = useUI();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const [activeTab, setActiveTab] = useState('performance');
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshRate, setRefreshRate] = useState(30);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [performanceData, setPerformanceData] = useState({});
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogDetails, setShowLogDetails] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [logFilters, setLogFilters] = useState({
    service: 'all',
    level: 'all',
    search: ''
  });
  const [alertFilters, setAlertFilters] = useState({
    service: 'all',
    level: 'all',
    onlyActive: true
  });
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    slack: false,
    sms: false,
    errorAlerts: true,
    warningAlerts: true,
    infoAlerts: false
  });
  
  const refreshTimerRef = useRef(null);
  const cpuChartRef = useRef(null);
  const memoryChartRef = useRef(null);
  const latencyChartRef = useRef(null);
  const throughputChartRef = useRef(null);
  
  // Initialize auto-refresh timer
  useEffect(() => {
    if (autoRefresh) {
      refreshTimerRef.current = setInterval(() => {
        fetchData();
      }, refreshRate * 1000);
    }
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, refreshRate]);
  
  // Fetch data based on time range
  useEffect(() => {
    fetchData();
  }, [timeRange]);
  
  // Fetch monitoring data
  const fetchData = () => {
    setIsLoading(true);
    
    // In a real implementation, these would be API calls with the timeRange parameter
    setTimeout(() => {
      try {
        // Performance data
        const performanceDataPoints = getDataPointsForTimeRange(timeRange);
        
        setPerformanceData({
          cpu: generatePerformanceData(performanceDataPoints, 30, 80, 'cpu'),
          memory: generatePerformanceData(performanceDataPoints, 25, 70, 'memory'),
          latency: generatePerformanceData(performanceDataPoints, 80, 180, 'latency'),
          throughput: generatePerformanceData(performanceDataPoints, 200, 400, 'throughput'),
          errorRate: generatePerformanceData(performanceDataPoints, 0, 5, 'errorRate'),
          successRate: generatePerformanceData(performanceDataPoints, 90, 100, 'successRate'),
          activeUsers: generatePerformanceData(performanceDataPoints, 10, 50, 'activeUsers'),
          requestCount: generatePerformanceData(performanceDataPoints, 1000, 5000, 'requestCount')
        });
        
        // Services data
        setServices([
          { 
            id: 1, 
            name: 'Deployment Service', 
            status: 'healthy', 
            uptime: '99.98%',
            version: '1.2.3',
            lastRestart: Date.now() - 604800000, // 7 days ago
            instances: 3,
            cpu: 42,
            memory: 38,
            errorRate: 0.2,
            responseTime: 125,
            endpoints: [
              { path: '/api/deployments', status: 'healthy', avgResponseTime: 118 },
              { path: '/api/configurations', status: 'healthy', avgResponseTime: 132 },
              { path: '/api/pipelines', status: 'healthy', avgResponseTime: 145 }
            ]
          },
          { 
            id: 2, 
            name: 'Provider Service', 
            status: 'warning', 
            uptime: '99.85%',
            version: '1.1.7',
            lastRestart: Date.now() - 259200000, // 3 days ago
            instances: 5,
            cpu: 68,
            memory: 72,
            errorRate: 2.8,
            responseTime: 210,
            endpoints: [
              { path: '/api/providers', status: 'healthy', avgResponseTime: 145 },
              { path: '/api/models', status: 'warning', avgResponseTime: 320 },
              { path: '/api/requests', status: 'healthy', avgResponseTime: 165 }
            ],
            warnings: [
              { message: 'Rate limit approaching for OpenAI provider', timestamp: Date.now() - 600000 },
              { message: 'Fallback provider activated', timestamp: Date.now() - 7200000 }
            ]
          },
          { 
            id: 3, 
            name: 'Governance Service', 
            status: 'error', 
            uptime: '98.72%',
            version: '1.0.9',
            lastRestart: Date.now() - 86400000, // 1 day ago
            instances: 2,
            cpu: 56,
            memory: 64,
            errorRate: 5.4,
            responseTime: 178,
            endpoints: [
              { path: '/api/policies', status: 'error', avgResponseTime: 245 },
              { path: '/api/evaluations', status: 'healthy', avgResponseTime: 132 },
              { path: '/api/audits', status: 'warning', avgResponseTime: 198 }
            ],
            errors: [
              { message: 'Failed to apply policy update', timestamp: Date.now() - 1200000 },
              { message: 'Database connection timeout', timestamp: Date.now() - 3600000 }
            ]
          },
          { 
            id: 4, 
            name: 'Workflow Service', 
            status: 'healthy', 
            uptime: '99.95%',
            version: '1.3.1',
            lastRestart: Date.now() - 432000000, // 5 days ago
            instances: 4,
            cpu: 45,
            memory: 52,
            errorRate: 0.5,
            responseTime: 142,
            endpoints: [
              { path: '/api/workflows', status: 'healthy', avgResponseTime: 138 },
              { path: '/api/tasks', status: 'healthy', avgResponseTime: 145 },
              { path: '/api/executions', status: 'healthy', avgResponseTime: 152 }
            ]
          },
          { 
            id: 5, 
            name: 'Collaboration Service', 
            status: 'healthy', 
            uptime: '99.97%',
            version: '1.2.0',
            lastRestart: Date.now() - 518400000, // 6 days ago
            instances: 3,
            cpu: 38,
            memory: 45,
            errorRate: 0.3,
            responseTime: 115,
            endpoints: [
              { path: '/api/teams', status: 'healthy', avgResponseTime: 110 },
              { path: '/api/agents', status: 'healthy', avgResponseTime: 118 },
              { path: '/api/interactions', status: 'healthy', avgResponseTime: 125 }
            ]
          }
        ]);
        
        // Logs
        setLogs(generateLogs(timeRange));
        
        // Alerts
        setAlerts(generateAlerts(timeRange));
        
        setIsLoading(false);
        
        // Add notification for demo purposes
        if (Math.random() > 0.7) {
          addNotification({
            id: Date.now(),
            title: 'Monitoring Update',
            message: 'System data refreshed successfully',
            type: 'info',
            time: new Date().toLocaleTimeString()
          });
        }
      } catch (error) {
        console.error('Error fetching monitoring data:', error);
        
        addNotification({
          id: Date.now(),
          title: 'Monitoring Error',
          message: 'Failed to refresh monitoring data',
          type: 'error',
          time: new Date().toLocaleTimeString()
        });
        
        setIsLoading(false);
      }
    }, 1000);
  };
  
  // Get number of data points based on time range
  const getDataPointsForTimeRange = (range) => {
    switch (range) {
      case '1h':
        return 12; // 5-minute intervals
      case '6h':
        return 24; // 15-minute intervals
      case '24h':
        return 24; // 1-hour intervals
      case '7d':
        return 28; // 6-hour intervals
      case '30d':
        return 30; // 1-day intervals
      default:
        return 24;
    }
  };
  
  // Generate performance data
  const generatePerformanceData = (points, min, max, metric) => {
    const now = Date.now();
    const data = [];
    let lastValue = Math.floor(min + Math.random() * (max - min));
    
    // Calculate time interval based on time range
    let interval;
    switch (timeRange) {
      case '1h':
        interval = 60 * 5 * 1000; // 5 minutes
        break;
      case '6h':
        interval = 60 * 15 * 1000; // 15 minutes
        break;
      case '24h':
        interval = 60 * 60 * 1000; // 1 hour
        break;
      case '7d':
        interval = 6 * 60 * 60 * 1000; // 6 hours
        break;
      case '30d':
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      default:
        interval = 60 * 60 * 1000; // 1 hour
    }
    
    for (let i = points - 1; i >= 0; i--) {
      // Generate a value that's somewhat related to the previous value
      // to create a more realistic looking chart
      const change = Math.floor(Math.random() * (max - min) * 0.2) - (max - min) * 0.1;
      let newValue = lastValue + change;
      
      // Keep within bounds
      newValue = Math.max(min, Math.min(max, newValue));
      
      // Add some spikes for certain metrics
      if ((metric === 'errorRate' || metric === 'latency') && Math.random() > 0.9) {
        newValue = Math.min(max * 1.5, newValue * 2);
      }
      
      data.push({
        timestamp: now - (i * interval),
        value: newValue
      });
      
      lastValue = newValue;
    }
    
    return data;
  };
  
  // Generate logs
  const generateLogs = (timeRange) => {
    const now = Date.now();
    const logs = [];
    const services = ['deployment-service', 'provider-service', 'governance-service', 'workflow-service', 'collaboration-service'];
    const levels = ['info', 'warning', 'error'];
    const levelWeights = [0.7, 0.2, 0.1]; // 70% info, 20% warning, 10% error
    
    // Calculate time range in milliseconds
    let rangeMs;
    switch (timeRange) {
      case '1h':
        rangeMs = 60 * 60 * 1000;
        break;
      case '6h':
        rangeMs = 6 * 60 * 60 * 1000;
        break;
      case '24h':
        rangeMs = 24 * 60 * 60 * 1000;
        break;
      case '7d':
        rangeMs = 7 * 24 * 60 * 60 * 1000;
        break;
      case '30d':
        rangeMs = 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        rangeMs = 24 * 60 * 60 * 1000;
    }
    
    // Generate log messages
    const infoMessages = [
      'Service started successfully',
      'Deployment completed successfully',
      'Workflow execution started',
      'Workflow execution completed',
      'New team formed',
      'Configuration updated',
      'User authenticated',
      'API request processed',
      'Cache refreshed',
      'Scheduled maintenance completed'
    ];
    
    const warningMessages = [
      'Rate limit approaching for provider',
      'High memory usage detected',
      'Slow response time detected',
      'Fallback provider activated',
      'Configuration validation warning',
      'API deprecation notice',
      'Database connection pool near capacity',
      'Cache hit ratio below threshold',
      'Service approaching capacity limits',
      'Authentication attempts threshold reached'
    ];
    
    const errorMessages = [
      'Deployment failed: resource constraints',
      'Failed to apply policy update',
      'Database connection timeout',
      'API request failed',
      'Service initialization error',
      'Authentication failed',
      'Rate limit exceeded',
      'Invalid configuration detected',
      'Workflow execution failed',
      'Service communication error'
    ];
    
    // Generate logs with timestamps spread throughout the time range
    const logCount = timeRange === '1h' ? 20 : 
                     timeRange === '6h' ? 50 : 
                     timeRange === '24h' ? 100 : 
                     timeRange === '7d' ? 200 : 300;
    
    for (let i = 0; i < logCount; i++) {
      // Determine log level based on weights
      const rand = Math.random();
      let level;
      let message;
      
      if (rand < levelWeights[0]) {
        level = levels[0]; // info
        message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
      } else if (rand < levelWeights[0] + levelWeights[1]) {
        level = levels[1]; // warning
        message = warningMessages[Math.floor(Math.random() * warningMessages.length)];
      } else {
        level = levels[2]; // error
        message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      }
      
      // Generate a random timestamp within the time range
      const timestamp = now - Math.floor(Math.random() * rangeMs);
      
      // Select a random service
      const service = services[Math.floor(Math.random() * services.length)];
      
      // Add context details for expanded view
      const context = {
        requestId: `req-${Math.random().toString(36).substring(2, 10)}`,
        userId: `user-${Math.random().toString(36).substring(2, 8)}`,
        sessionId: `sess-${Math.random().toString(36).substring(2, 10)}`,
        component: service.split('-')[0],
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
        path: `/api/${service.split('-')[0]}/${Math.random().toString(36).substring(2, 8)}`,
        duration: Math.floor(Math.random() * 500) + 50,
        statusCode: level === 'error' ? [500, 503, 400, 404][Math.floor(Math.random() * 4)] : 
                    level === 'warning' ? [429, 408, 413][Math.floor(Math.random() * 3)] : 200
      };
      
      logs.push({
        id: i + 1,
        timestamp,
        level,
        service,
        message,
        context
      });
    }
    
    // Sort logs by timestamp (newest first)
    logs.sort((a, b) => b.timestamp - a.timestamp);
    
    return logs;
  };
  
  // Generate alerts
  const generateAlerts = (timeRange) => {
    const now = Date.now();
    const alerts = [];
    const services = ['deployment-service', 'provider-service', 'governance-service', 'workflow-service', 'collaboration-service'];
    
    // Calculate time range in milliseconds
    let rangeMs;
    switch (timeRange) {
      case '1h':
        rangeMs = 60 * 60 * 1000;
        break;
      case '6h':
        rangeMs = 6 * 60 * 60 * 1000;
        break;
      case '24h':
        rangeMs = 24 * 60 * 60 * 1000;
        break;
      case '7d':
        rangeMs = 7 * 24 * 60 * 60 * 1000;
        break;
      case '30d':
        rangeMs = 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        rangeMs = 24 * 60 * 60 * 1000;
    }
    
    // Warning alerts
    const warningAlerts = [
      'Rate limit approaching for OpenAI provider',
      'High memory usage detected',
      'Slow response time detected',
      'Fallback provider activated',
      'Configuration validation warning',
      'API deprecation notice',
      'Database connection pool near capacity',
      'Cache hit ratio below threshold'
    ];
    
    // Error alerts
    const errorAlerts = [
(Content truncated due to size limit. Use line ranges to read in chunks)