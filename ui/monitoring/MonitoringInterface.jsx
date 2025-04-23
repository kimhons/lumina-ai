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
      'Deployment failed: resource constraints',
      'Failed to apply policy update',
      'Database connection timeout',
      'API request failed with 5xx error',
      'Service initialization error',
      'Authentication service unavailable',
      'Rate limit exceeded for critical API',
      'Invalid configuration detected in production'
    ];
    
    // Generate a mix of warning and error alerts
    const alertCount = timeRange === '1h' ? 3 : 
                       timeRange === '6h' ? 8 : 
                       timeRange === '24h' ? 15 : 
                       timeRange === '7d' ? 25 : 40;
    
    for (let i = 0; i < alertCount; i++) {
      const isError = Math.random() < 0.4; // 40% chance of error
      const level = isError ? 'error' : 'warning';
      const messages = isError ? errorAlerts : warningAlerts;
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      // Generate a random timestamp within the time range
      const timestamp = now - Math.floor(Math.random() * rangeMs);
      
      // Select a random service
      const service = services[Math.floor(Math.random() * services.length)];
      
      // Determine if acknowledged (older alerts more likely to be acknowledged)
      const ageRatio = (now - timestamp) / rangeMs;
      const acknowledged = Math.random() < ageRatio * 0.8;
      
      // Add details for expanded view
      const details = {
        alertId: `alert-${Math.random().toString(36).substring(2, 10)}`,
        source: service,
        component: service.split('-')[0],
        metric: isError ? 
          ['error_rate', 'availability', 'response_time', 'resource_utilization'][Math.floor(Math.random() * 4)] : 
          ['memory_usage', 'cpu_usage', 'response_time', 'rate_limit'][Math.floor(Math.random() * 4)],
        threshold: isError ? 
          ['> 5%', '< 99.9%', '> 500ms', '> 90%'][Math.floor(Math.random() * 4)] : 
          ['> 80%', '> 70%', '> 300ms', '> 80%'][Math.floor(Math.random() * 4)],
        currentValue: isError ? 
          ['7.2%', '99.7%', '620ms', '95%'][Math.floor(Math.random() * 4)] : 
          ['85%', '78%', '350ms', '85%'][Math.floor(Math.random() * 4)],
        duration: Math.floor(Math.random() * 30) + 5 + ' minutes',
        affectedUsers: isError ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 20) + 5,
        recommendedAction: isError ? 
          ['Restart service', 'Scale up resources', 'Check database connections', 'Review configuration'][Math.floor(Math.random() * 4)] : 
          ['Monitor closely', 'Consider scaling', 'Optimize queries', 'Review rate limits'][Math.floor(Math.random() * 4)]
      };
      
      alerts.push({
        id: i + 1,
        timestamp,
        level,
        service,
        message,
        acknowledged,
        details,
        acknowledgedAt: acknowledged ? timestamp + Math.floor(Math.random() * 3600000) : null,
        acknowledgedBy: acknowledged ? 'admin@lumina.ai' : null
      });
    }
    
    // Sort alerts by timestamp (newest first)
    alerts.sort((a, b) => b.timestamp - a.timestamp);
    
    return alerts;
  };
  
  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  };
  
  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) {
      return 'just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} min ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} hr ago`;
    } else {
      return `${Math.floor(diff / 86400000)} days ago`;
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    addNotification({
      id: Date.now(),
      title: 'Refreshing Data',
      message: 'Fetching latest monitoring data...',
      type: 'info',
      time: new Date().toLocaleTimeString()
    });
    
    fetchData();
  };
  
  // Handle log filter change
  const handleLogFilterChange = (field, value) => {
    setLogFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle alert filter change
  const handleAlertFilterChange = (field, value) => {
    setAlertFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle log selection
  const handleLogSelect = (log) => {
    setSelectedLog(log);
    setShowLogDetails(true);
  };
  
  // Handle alert selection
  const handleAlertSelect = (alert) => {
    setSelectedAlert(alert);
    setShowAlertDetails(true);
  };
  
  // Handle service selection
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowServiceDetails(true);
  };
  
  // Handle alert acknowledgement
  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          acknowledged: true,
          acknowledgedAt: Date.now(),
          acknowledgedBy: 'current.user@lumina.ai'
        };
      }
      return alert;
    }));
    
    addNotification({
      id: Date.now(),
      title: 'Alert Acknowledged',
      message: 'Alert has been acknowledged successfully',
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // Close details modal if the acknowledged alert is the selected one
    if (selectedAlert && selectedAlert.id === alertId) {
      setShowAlertDetails(false);
    }
  };
  
  // Handle acknowledge all alerts
  const handleAcknowledgeAllAlerts = () => {
    setAlerts(prev => prev.map(alert => {
      if (!alert.acknowledged) {
        return {
          ...alert,
          acknowledged: true,
          acknowledgedAt: Date.now(),
          acknowledgedBy: 'current.user@lumina.ai'
        };
      }
      return alert;
    }));
    
    addNotification({
      id: Date.now(),
      title: 'All Alerts Acknowledged',
      message: 'All active alerts have been acknowledged',
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Handle notification settings save
  const handleSaveNotificationSettings = () => {
    addNotification({
      id: Date.now(),
      title: 'Settings Saved',
      message: 'Notification preferences have been updated',
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    setShowNotificationSettings(false);
  };
  
  // Filter logs based on current filters
  const filteredLogs = logs.filter(log => {
    // Service filter
    if (logFilters.service !== 'all' && log.service !== logFilters.service) {
      return false;
    }
    
    // Level filter
    if (logFilters.level !== 'all' && log.level !== logFilters.level) {
      return false;
    }
    
    // Search filter
    if (logFilters.search && !log.message.toLowerCase().includes(logFilters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Filter alerts based on current filters
  const filteredAlerts = alerts.filter(alert => {
    // Service filter
    if (alertFilters.service !== 'all' && alert.service !== alertFilters.service) {
      return false;
    }
    
    // Level filter
    if (alertFilters.level !== 'all' && alert.level !== alertFilters.level) {
      return false;
    }
    
    // Active only filter
    if (alertFilters.onlyActive && alert.acknowledged) {
      return false;
    }
    
    return true;
  });
  
  // Render loading state
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading monitoring data...</p>
    </div>
  );
  
  // Render performance metrics tab
  const renderPerformanceTab = () => {
    if (isLoading) {
      return renderLoading();
    }
    
    return (
      <div className="performance-tab">
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>CPU Utilization</h3>
            <div className="metric-chart" ref={cpuChartRef}>
              <div className="chart-placeholder">
                <div className="chart-line">
                  {performanceData.cpu && performanceData.cpu.map((point, index) => (
                    <div 
                      key={index} 
                      className="chart-point" 
                      style={{ 
                        left: `${(index / (performanceData.cpu.length - 1)) * 100}%`,
                        bottom: `${point.value}%`
                      }}
                      title={`${formatTime(point.timestamp)}: ${point.value}%`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-value">
                {performanceData.cpu && performanceData.cpu[performanceData.cpu.length - 1].value}%
              </div>
              <div className="metric-trend">
                {performanceData.cpu && 
                  (performanceData.cpu[performanceData.cpu.length - 1].value > performanceData.cpu[performanceData.cpu.length - 2].value ? 
                    <span className="trend-up">↑</span> : 
                    <span className="trend-down">↓</span>)
                }
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Memory Usage</h3>
            <div className="metric-chart" ref={memoryChartRef}>
              <div className="chart-placeholder">
                <div className="chart-line">
                  {performanceData.memory && performanceData.memory.map((point, index) => (
                    <div 
                      key={index} 
                      className="chart-point" 
                      style={{ 
                        left: `${(index / (performanceData.memory.length - 1)) * 100}%`,
                        bottom: `${point.value}%`
                      }}
                      title={`${formatTime(point.timestamp)}: ${point.value}%`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-value">
                {performanceData.memory && performanceData.memory[performanceData.memory.length - 1].value}%
              </div>
              <div className="metric-trend">
                {performanceData.memory && 
                  (performanceData.memory[performanceData.memory.length - 1].value > performanceData.memory[performanceData.memory.length - 2].value ? 
                    <span className="trend-up">↑</span> : 
                    <span className="trend-down">↓</span>)
                }
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>API Latency</h3>
            <div className="metric-chart" ref={latencyChartRef}>
              <div className="chart-placeholder">
                <div className="chart-line">
                  {performanceData.latency && performanceData.latency.map((point, index) => (
                    <div 
                      key={index} 
                      className="chart-point" 
                      style={{ 
                        left: `${(index / (performanceData.latency.length - 1)) * 100}%`,
                        bottom: `${(point.value / 200) * 100}%`
                      }}
                      title={`${formatTime(point.timestamp)}: ${point.value} ms`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-value">
                {performanceData.latency && performanceData.latency[performanceData.latency.length - 1].value} ms
              </div>
              <div className="metric-trend">
                {performanceData.latency && 
                  (performanceData.latency[performanceData.latency.length - 1].value > performanceData.latency[performanceData.latency.length - 2].value ? 
                    <span className="trend-up bad">↑</span> : 
                    <span className="trend-down good">↓</span>)
                }
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Request Throughput</h3>
            <div className="metric-chart" ref={throughputChartRef}>
              <div className="chart-placeholder">
                <div className="chart-line">
                  {performanceData.throughput && performanceData.throughput.map((point, index) => (
                    <div 
                      key={index} 
                      className="chart-point" 
                      style={{ 
                        left: `${(index / (performanceData.throughput.length - 1)) * 100}%`,
                        bottom: `${(point.value / 400) * 100}%`
                      }}
                      title={`${formatTime(point.timestamp)}: ${point.value} req/min`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-value">
                {performanceData.throughput && performanceData.throughput[performanceData.throughput.length - 1].value} req/min
              </div>
              <div className="metric-trend">
                {performanceData.throughput && 
                  (performanceData.throughput[performanceData.throughput.length - 1].value > performanceData.throughput[performanceData.throughput.length - 2].value ? 
                    <span className="trend-up good">↑</span> : 
                    <span className="trend-down bad">↓</span>)
                }
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Error Rate</h3>
            <div className="metric-chart">
              <div className="chart-placeholder">
                <div className="chart-line">
                  {performanceData.errorRate && performanceData.errorRate.map((point, index) => (
                    <div 
                      key={index} 
                      className="chart-point" 
                      style={{ 
                        left: `${(index / (performanceData.errorRate.length - 1)) * 100}%`,
                        bottom: `${(point.value / 5) * 100}%`
                      }}
                      title={`${formatTime(point.timestamp)}: ${point.value}%`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-value">
                {performanceData.errorRate && performanceData.errorRate[performanceData.errorRate.length - 1].value}%
              </div>
              <div className="metric-trend">
                {performanceData.errorRate && 
                  (performanceData.errorRate[performanceData.errorRate.length - 1].value > performanceData.errorRate[performanceData.errorRate.length - 2].value ? 
                    <span className="trend-up bad">↑</span> : 
                    <span className="trend-down good">↓</span>)
                }
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Success Rate</h3>
            <div className="metric-chart">
              <div className="chart-placeholder">
                <div className="chart-line">
                  {performanceData.successRate && performanceData.successRate.map((point, index) => (
                    <div 
                      key={index} 
                      className="chart-point" 
                      style={{ 
                        left: `${(index / (performanceData.successRate.length - 1)) * 100}%`,
                        bottom: `${((point.value - 90) / 10) * 100}%`
                      }}
                      title={`${formatTime(point.timestamp)}: ${point.value}%`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-value">
                {performanceData.successRate && performanceData.successRate[performanceData.successRate.length - 1].value}%
              </div>
              <div className="metric-trend">
                {performanceData.successRate && 
                  (performanceData.successRate[performanceData.successRate.length - 1].value > performanceData.successRate[performanceData.successRate.length - 2].value ? 
                    <span className="trend-up good">↑</span> : 
                    <span className="trend-down bad">↓</span>)
                }
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Active Users</h3>
            <div className="metric-chart">
              <div className="chart-placeholder">
                <div className="chart-line">
                  {performanceData.activeUsers && performanceData.activeUsers.map((point, index) => (
                    <div 
                      key={index} 
                      className="chart-point" 
                      style={{ 
                        left: `${(index / (performanceData.activeUsers.length - 1)) * 100}%`,
                        bottom: `${(point.value / 50) * 100}%`
                      }}
                      title={`${formatTime(point.timestamp)}: ${point.value} users`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-value">
                {performanceData.activeUsers && performanceData.activeUsers[performanceData.activeUsers.length - 1].value}
              </div>
              <div className="metric-trend">
                {performanceData.activeUsers && 
                  (performanceData.activeUsers[performanceData.activeUsers.length - 1].value > performanceData.activeUsers[performanceData.activeUsers.length - 2].value ? 
                    <span className="trend-up good">↑</span> : 
                    <span className="trend-down">↓</span>)
                }
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Total Requests</h3>
            <div className="metric-chart">
              <div className="chart-placeholder">
                <div className="chart-line">
                  {performanceData.requestCount && performanceData.requestCount.map((point, index) => (
                    <div 
                      key={index} 
                      className="chart-point" 
                      style={{ 
                        left: `${(index / (performanceData.requestCount.length - 1)) * 100}%`,
                        bottom: `${(point.value / 5000) * 100}%`
                      }}
                      title={`${formatTime(point.timestamp)}: ${point.value} requests`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-value">
                {performanceData.requestCount && performanceData.requestCount[performanceData.requestCount.length - 1].value}
              </div>
              <div className="metric-trend">
                {performanceData.requestCount && 
                  (performanceData.requestCount[performanceData.requestCount.length - 1].value > performanceData.requestCount[performanceData.requestCount.length - 2].value ? 
                    <span className="trend-up good">↑</span> : 
                    <span className="trend-down">↓</span>)
                }
              </div>
            </div>
          </div>
        </div>
        
        <div className="service-health">
          <div className="section-header">
            <h3>Service Health</h3>
            <button 
              className="action-btn"
              onClick={() => {
                addNotification({
                  id: Date.now(),
                  title: 'Health Check',
                  message: 'Running health check on all services...',
                  type: 'info',
                  time: new Date().toLocaleTimeString()
                });
                
                setTimeout(() => {
                  addNotification({
                    id: Date.now(),
                    title: 'Health Check Complete',
                    message: 'Health check completed. 3 services healthy, 1 warning, 1 error.',
                    type: 'success',
                    time: new Date().toLocaleTimeString()
                  });
                }, 2000);
              }}
            >
              Run Health Check
            </button>
          </div>
          
          <div className="service-grid">
            {services.map(service => (
              <div 
                key={service.id} 
                className={`service-card status-${service.status}`}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="service-header">
                  <h4>{service.name}</h4>
                  <div className={`health-indicator ${service.status}`}></div>
                </div>
                <div className="service-metrics">
                  <div className="service-metric">
                    <span className="metric-label">CPU</span>
                    <span className="metric-value">{service.cpu}%</span>
                  </div>
                  <div className="service-metric">
                    <span className="metric-label">Memory</span>
                    <span className="metric-value">{service.memory}%</span>
                  </div>
                  <div className="service-metric">
                    <span className="metric-label">Response</span>
                    <span className="metric-value">{service.responseTime}ms</span>
                  </div>
                  <div className="service-metric">
                    <span className="metric-label">Error Rate</span>
                    <span className="metric-value">{service.errorRate}%</span>
                  </div>
                </div>
                <div className="service-footer">
                  <span className="service-uptime">Uptime: {service.uptime}</span>
                  <span className="service-version">v{service.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render logs tab
  const renderLogsTab = () => {
    if (isLoading) {
      return renderLoading();
    }
    
    return (
      <div className="logs-tab">
        <div className="logs-filter">
          <div className="filter-group">
            <label htmlFor="log-service-filter">Service:</label>
            <select 
              id="log-service-filter"
              className="filter-select"
              value={logFilters.service}
              onChange={(e) => handleLogFilterChange('service', e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="deployment-service">Deployment Service</option>
              <option value="provider-service">Provider Service</option>
              <option value="governance-service">Governance Service</option>
              <option value="workflow-service">Workflow Service</option>
              <option value="collaboration-service">Collaboration Service</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="log-level-filter">Level:</label>
            <select 
              id="log-level-filter"
              className="filter-select"
              value={logFilters.level}
              onChange={(e) => handleLogFilterChange('level', e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div className="filter-group search-group">
            <label htmlFor="log-search">Search:</label>
            <input 
              id="log-search"
              type="text" 
              className="search-input"
              placeholder="Filter by message..."
              value={logFilters.search}
              onChange={(e) => handleLogFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        
        <div className="logs-table-container">
          <table className="logs-table">
            <thead>
              <tr>
                <th className="time-column">Time</th>
                <th className="level-column">Level</th>
                <th className="service-column">Service</th>
                <th className="message-column">Message</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr 
                    key={log.id} 
                    className={`log-level-${log.level}`}
                    onClick={() => handleLogSelect(log)}
                  >
                    <td className="time-column">{formatRelativeTime(log.timestamp)}</td>
                    <td className="level-column">
                      <span className={`log-level ${log.level}`}>{log.level}</span>
                    </td>
                    <td className="service-column">{log.service}</td>
                    <td className="message-column">{log.message}</td>
                    <td className="actions-column">
                      <button 
                        className="view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogSelect(log);
                        }}
                        aria-label="View log details"
                      >
                        <span aria-hidden="true">👁️</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-data-row">
                  <td colSpan="5">No logs match the current filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="logs-pagination">
          <button className="pagination-btn" disabled>Previous</button>
          <span className="pagination-info">Showing 1-{Math.min(filteredLogs.length, 50)} of {filteredLogs.length}</span>
          <button className="pagination-btn" disabled={filteredLogs.length <= 50}>Next</button>
        </div>
        
        {showLogDetails && selectedLog && (
          <div className="modal-overlay">
            <div className="modal-container log-details-modal" role="dialog" aria-labelledby="log-details-title">
              <div className="modal-header">
                <h3 id="log-details-title">Log Details</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowLogDetails(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="log-details">
                  <div className="log-detail-item">
                    <span className="detail-label">Timestamp:</span>
                    <span className="detail-value">{formatTime(selectedLog.timestamp)}</span>
                  </div>
                  <div className="log-detail-item">
                    <span className="detail-label">Level:</span>
                    <span className={`detail-value log-level ${selectedLog.level}`}>{selectedLog.level}</span>
                  </div>
                  <div className="log-detail-item">
                    <span className="detail-label">Service:</span>
                    <span className="detail-value">{selectedLog.service}</span>
                  </div>
                  <div className="log-detail-item">
                    <span className="detail-label">Message:</span>
                    <span className="detail-value">{selectedLog.message}</span>
                  </div>
                  
                  <h4>Context</h4>
                  <div className="log-context">
                    <div className="log-detail-item">
                      <span className="detail-label">Request ID:</span>
                      <span className="detail-value">{selectedLog.context.requestId}</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">User ID:</span>
                      <span className="detail-value">{selectedLog.context.userId}</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">Session ID:</span>
                      <span className="detail-value">{selectedLog.context.sessionId}</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">Component:</span>
                      <span className="detail-value">{selectedLog.context.component}</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">Method:</span>
                      <span className="detail-value">{selectedLog.context.method}</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">Path:</span>
                      <span className="detail-value">{selectedLog.context.path}</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{selectedLog.context.duration}ms</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">Status Code:</span>
                      <span className="detail-value">{selectedLog.context.statusCode}</span>
                    </div>
                  </div>
                  
                  <h4>Related Logs</h4>
                  <div className="related-logs">
                    {logs
                      .filter(log => 
                        log.id !== selectedLog.id && 
                        (log.context.requestId === selectedLog.context.requestId || 
                         log.context.sessionId === selectedLog.context.sessionId)
                      )
                      .slice(0, 3)
                      .map(log => (
                        <div key={log.id} className={`related-log log-level-${log.level}`}>
                          <span className="related-log-time">{formatRelativeTime(log.timestamp)}</span>
                          <span className={`related-log-level ${log.level}`}>{log.level}</span>
                          <span className="related-log-message">{log.message}</span>
                        </div>
                      ))}
                    
                    {logs.filter(log => 
                      log.id !== selectedLog.id && 
                      (log.context.requestId === selectedLog.context.requestId || 
                       log.context.sessionId === selectedLog.context.sessionId)
                    ).length === 0 && (
                      <p className="no-related-logs">No related logs found</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowLogDetails(false)}
                >
                  Close
                </button>
                <button 
                  className="primary-btn"
                  onClick={() => {
                    // In a real implementation, this would download the log details
                    addNotification({
                      id: Date.now(),
                      title: 'Log Exported',
                      message: 'Log details have been exported to JSON',
                      type: 'success',
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                >
                  Export Log
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render alerts tab
  const renderAlertsTab = () => {
    if (isLoading) {
      return renderLoading();
    }
    
    const activeAlerts = alerts.filter(alert => !alert.acknowledged);
    
    return (
      <div className="alerts-tab">
        <div className="alerts-header">
          <h3>Active Alerts ({activeAlerts.length})</h3>
          <div className="alerts-actions">
            <button 
              className="action-btn"
              onClick={handleAcknowledgeAllAlerts}
              disabled={activeAlerts.length === 0}
            >
              Acknowledge All
            </button>
            <button 
              className="action-btn"
              onClick={() => setShowNotificationSettings(true)}
            >
              Configure Notifications
            </button>
          </div>
        </div>
        
        <div className="alerts-filter">
          <div className="filter-group">
            <label htmlFor="alert-service-filter">Service:</label>
            <select 
              id="alert-service-filter"
              className="filter-select"
              value={alertFilters.service}
              onChange={(e) => handleAlertFilterChange('service', e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="deployment-service">Deployment Service</option>
              <option value="provider-service">Provider Service</option>
              <option value="governance-service">Governance Service</option>
              <option value="workflow-service">Workflow Service</option>
              <option value="collaboration-service">Collaboration Service</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="alert-level-filter">Level:</label>
            <select 
              id="alert-level-filter"
              className="filter-select"
              value={alertFilters.level}
              onChange={(e) => handleAlertFilterChange('level', e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div className="filter-group checkbox-group">
            <input 
              type="checkbox" 
              id="active-only" 
              checked={alertFilters.onlyActive}
              onChange={(e) => handleAlertFilterChange('onlyActive', e.target.checked)}
            />
            <label htmlFor="active-only">Active only</label>
          </div>
        </div>
        
        <div className="alerts-list">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`alert-card alert-level-${alert.level} ${alert.acknowledged ? 'acknowledged' : ''}`}
                onClick={() => handleAlertSelect(alert)}
              >
                <div className="alert-header">
                  <span className={`alert-level ${alert.level}`}>{alert.level}</span>
                  <span className="alert-time">{formatRelativeTime(alert.timestamp)}</span>
                </div>
                <div className="alert-service">{alert.service}</div>
                <div className="alert-message">{alert.message}</div>
                <div className="alert-actions">
                  {!alert.acknowledged && (
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcknowledgeAlert(alert.id);
                      }}
                    >
                      Acknowledge
                    </button>
                  )}
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAlertSelect(alert);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-alerts">
              {alertFilters.onlyActive ? 
                'No active alerts match the current filters' : 
                'No alerts match the current filters'}
            </div>
          )}
        </div>
        
        {showAlertDetails && selectedAlert && (
          <div className="modal-overlay">
            <div className="modal-container alert-details-modal" role="dialog" aria-labelledby="alert-details-title">
              <div className="modal-header">
                <h3 id="alert-details-title">Alert Details</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowAlertDetails(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="alert-details">
                  <div className="alert-detail-item">
                    <span className="detail-label">Alert ID:</span>
                    <span className="detail-value">{selectedAlert.details.alertId}</span>
                  </div>
                  <div className="alert-detail-item">
                    <span className="detail-label">Timestamp:</span>
                    <span className="detail-value">{formatTime(selectedAlert.timestamp)}</span>
                  </div>
                  <div className="alert-detail-item">
                    <span className="detail-label">Level:</span>
                    <span className={`detail-value alert-level ${selectedAlert.level}`}>{selectedAlert.level}</span>
                  </div>
                  <div className="alert-detail-item">
                    <span className="detail-label">Service:</span>
                    <span className="detail-value">{selectedAlert.service}</span>
                  </div>
                  <div className="alert-detail-item">
                    <span className="detail-label">Message:</span>
                    <span className="detail-value">{selectedAlert.message}</span>
                  </div>
                  <div className="alert-detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      {selectedAlert.acknowledged ? 
                        `Acknowledged by ${selectedAlert.acknowledgedBy} at ${formatTime(selectedAlert.acknowledgedAt)}` : 
                        'Active'}
                    </span>
                  </div>
                  
                  <h4>Alert Details</h4>
                  <div className="alert-detail-grid">
                    <div className="alert-detail-item">
                      <span className="detail-label">Source:</span>
                      <span className="detail-value">{selectedAlert.details.source}</span>
                    </div>
                    <div className="alert-detail-item">
                      <span className="detail-label">Component:</span>
                      <span className="detail-value">{selectedAlert.details.component}</span>
                    </div>
                    <div className="alert-detail-item">
                      <span className="detail-label">Metric:</span>
                      <span className="detail-value">{selectedAlert.details.metric}</span>
                    </div>
                    <div className="alert-detail-item">
                      <span className="detail-label">Threshold:</span>
                      <span className="detail-value">{selectedAlert.details.threshold}</span>
                    </div>
                    <div className="alert-detail-item">
                      <span className="detail-label">Current Value:</span>
                      <span className="detail-value">{selectedAlert.details.currentValue}</span>
                    </div>
                    <div className="alert-detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{selectedAlert.details.duration}</span>
                    </div>
                    <div className="alert-detail-item">
                      <span className="detail-label">Affected Users:</span>
                      <span className="detail-value">{selectedAlert.details.affectedUsers}</span>
                    </div>
                  </div>
                  
                  <div className="alert-recommendation">
                    <h4>Recommended Action</h4>
                    <p>{selectedAlert.details.recommendedAction}</p>
                  </div>
                  
                  <h4>Related Alerts</h4>
                  <div className="related-alerts">
                    {alerts
                      .filter(alert => 
                        alert.id !== selectedAlert.id && 
                        alert.service === selectedAlert.service &&
                        Math.abs(alert.timestamp - selectedAlert.timestamp) < 3600000 // Within 1 hour
                      )
                      .slice(0, 3)
                      .map(alert => (
                        <div 
                          key={alert.id} 
                          className={`related-alert alert-level-${alert.level}`}
                          onClick={() => {
                            setSelectedAlert(alert);
                          }}
                        >
                          <span className="related-alert-time">{formatRelativeTime(alert.timestamp)}</span>
                          <span className={`related-alert-level ${alert.level}`}>{alert.level}</span>
                          <span className="related-alert-message">{alert.message}</span>
                        </div>
                      ))}
                    
                    {alerts.filter(alert => 
                      alert.id !== selectedAlert.id && 
                      alert.service === selectedAlert.service &&
                      Math.abs(alert.timestamp - selectedAlert.timestamp) < 3600000
                    ).length === 0 && (
                      <p className="no-related-alerts">No related alerts found</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {!selectedAlert.acknowledged && (
                  <button 
                    className="primary-btn" 
                    onClick={() => {
                      handleAcknowledgeAlert(selectedAlert.id);
                      setShowAlertDetails(false);
                    }}
                  >
                    Acknowledge
                  </button>
                )}
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowAlertDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showNotificationSettings && (
          <div className="modal-overlay">
            <div className="modal-container notification-settings-modal" role="dialog" aria-labelledby="notification-settings-title">
              <div className="modal-header">
                <h3 id="notification-settings-title">Notification Settings</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowNotificationSettings(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="notification-settings">
                  <h4>Notification Channels</h4>
                  <div className="settings-group">
                    <div className="setting-item">
                      <div className="setting-label">
                        <label htmlFor="email-notifications">Email Notifications</label>
                      </div>
                      <div className="setting-control">
                        <div className="toggle-switch">
                          <input 
                            type="checkbox" 
                            id="email-notifications" 
                            checked={notificationSettings.email}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              email: e.target.checked
                            }))}
                          />
                          <label htmlFor="email-notifications"></label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="setting-item">
                      <div className="setting-label">
                        <label htmlFor="slack-notifications">Slack Notifications</label>
                      </div>
                      <div className="setting-control">
                        <div className="toggle-switch">
                          <input 
                            type="checkbox" 
                            id="slack-notifications" 
                            checked={notificationSettings.slack}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              slack: e.target.checked
                            }))}
                          />
                          <label htmlFor="slack-notifications"></label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="setting-item">
                      <div className="setting-label">
                        <label htmlFor="sms-notifications">SMS Notifications</label>
                      </div>
                      <div className="setting-control">
                        <div className="toggle-switch">
                          <input 
                            type="checkbox" 
                            id="sms-notifications" 
                            checked={notificationSettings.sms}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              sms: e.target.checked
                            }))}
                          />
                          <label htmlFor="sms-notifications"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4>Alert Levels</h4>
                  <div className="settings-group">
                    <div className="setting-item">
                      <div className="setting-label">
                        <label htmlFor="error-alerts">Error Alerts</label>
                      </div>
                      <div className="setting-control">
                        <div className="toggle-switch">
                          <input 
                            type="checkbox" 
                            id="error-alerts" 
                            checked={notificationSettings.errorAlerts}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              errorAlerts: e.target.checked
                            }))}
                          />
                          <label htmlFor="error-alerts"></label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="setting-item">
                      <div className="setting-label">
                        <label htmlFor="warning-alerts">Warning Alerts</label>
                      </div>
                      <div className="setting-control">
                        <div className="toggle-switch">
                          <input 
                            type="checkbox" 
                            id="warning-alerts" 
                            checked={notificationSettings.warningAlerts}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              warningAlerts: e.target.checked
                            }))}
                          />
                          <label htmlFor="warning-alerts"></label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="setting-item">
                      <div className="setting-label">
                        <label htmlFor="info-alerts">Info Alerts</label>
                      </div>
                      <div className="setting-control">
                        <div className="toggle-switch">
                          <input 
                            type="checkbox" 
                            id="info-alerts" 
                            checked={notificationSettings.infoAlerts}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              infoAlerts: e.target.checked
                            }))}
                          />
                          <label htmlFor="info-alerts"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4>Notification Schedule</h4>
                  <div className="settings-group">
                    <div className="setting-item">
                      <div className="setting-label">
                        <label htmlFor="notification-schedule">Schedule Type</label>
                      </div>
                      <div className="setting-control">
                        <select 
                          id="notification-schedule" 
                          className="settings-select"
                          defaultValue="always"
                        >
                          <option value="always">Always (24/7)</option>
                          <option value="business">Business Hours</option>
                          <option value="custom">Custom Schedule</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowNotificationSettings(false)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  onClick={handleSaveNotificationSettings}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showServiceDetails && selectedService && (
          <div className="modal-overlay">
            <div className="modal-container service-details-modal" role="dialog" aria-labelledby="service-details-title">
              <div className="modal-header">
                <h3 id="service-details-title">{selectedService.name} Details</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowServiceDetails(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="service-details">
                  <div className="service-status-header">
                    <div className={`service-status status-${selectedService.status}`}>
                      <div className={`status-indicator ${selectedService.status}`}></div>
                      <span className="status-text">{selectedService.status}</span>
                    </div>
                    <div className="service-meta">
                      <span className="service-version">Version: {selectedService.version}</span>
                      <span className="service-uptime">Uptime: {selectedService.uptime}</span>
                    </div>
                  </div>
                  
                  <div className="service-metrics-grid">
                    <div className="service-metric-card">
                      <h4>CPU Usage</h4>
                      <div className="metric-gauge">
                        <div 
                          className={`gauge-fill ${selectedService.cpu > 80 ? 'critical' : selectedService.cpu > 60 ? 'warning' : 'normal'}`}
                          style={{ width: `${selectedService.cpu}%` }}
                        ></div>
                      </div>
                      <div className="metric-value">{selectedService.cpu}%</div>
                    </div>
                    
                    <div className="service-metric-card">
                      <h4>Memory Usage</h4>
                      <div className="metric-gauge">
                        <div 
                          className={`gauge-fill ${selectedService.memory > 80 ? 'critical' : selectedService.memory > 60 ? 'warning' : 'normal'}`}
                          style={{ width: `${selectedService.memory}%` }}
                        ></div>
                      </div>
                      <div className="metric-value">{selectedService.memory}%</div>
                    </div>
                    
                    <div className="service-metric-card">
                      <h4>Error Rate</h4>
                      <div className="metric-gauge">
                        <div 
                          className={`gauge-fill ${selectedService.errorRate > 5 ? 'critical' : selectedService.errorRate > 2 ? 'warning' : 'normal'}`}
                          style={{ width: `${selectedService.errorRate * 10}%` }}
                        ></div>
                      </div>
                      <div className="metric-value">{selectedService.errorRate}%</div>
                    </div>
                    
                    <div className="service-metric-card">
                      <h4>Response Time</h4>
                      <div className="metric-gauge">
                        <div 
                          className={`gauge-fill ${selectedService.responseTime > 200 ? 'critical' : selectedService.responseTime > 150 ? 'warning' : 'normal'}`}
                          style={{ width: `${(selectedService.responseTime / 300) * 100}%` }}
                        ></div>
                      </div>
                      <div className="metric-value">{selectedService.responseTime}ms</div>
                    </div>
                  </div>
                  
                  <div className="service-details-section">
                    <h4>Service Information</h4>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Instances:</span>
                        <span className="detail-value">{selectedService.instances}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Restart:</span>
                        <span className="detail-value">{formatRelativeTime(selectedService.lastRestart)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="service-details-section">
                    <h4>Endpoints</h4>
                    <div className="endpoints-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Path</th>
                            <th>Status</th>
                            <th>Response Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedService.endpoints.map((endpoint, index) => (
                            <tr key={index}>
                              <td>{endpoint.path}</td>
                              <td>
                                <span className={`endpoint-status status-${endpoint.status}`}>
                                  {endpoint.status}
                                </span>
                              </td>
                              <td>{endpoint.avgResponseTime}ms</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {selectedService.status === 'warning' && selectedService.warnings && (
                    <div className="service-details-section">
                      <h4>Warnings</h4>
                      <div className="warnings-list">
                        {selectedService.warnings.map((warning, index) => (
                          <div key={index} className="warning-item">
                            <span className="warning-time">{formatRelativeTime(warning.timestamp)}</span>
                            <span className="warning-message">{warning.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedService.status === 'error' && selectedService.errors && (
                    <div className="service-details-section">
                      <h4>Errors</h4>
                      <div className="errors-list">
                        {selectedService.errors.map((error, index) => (
                          <div key={index} className="error-item">
                            <span className="error-time">{formatRelativeTime(error.timestamp)}</span>
                            <span className="error-message">{error.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="action-btn"
                  onClick={() => {
                    addNotification({
                      id: Date.now(),
                      title: 'Service Logs',
                      message: `Viewing logs for ${selectedService.name}`,
                      type: 'info',
                      time: new Date().toLocaleTimeString()
                    });
                    
                    setActiveTab('logs');
                    handleLogFilterChange('service', selectedService.name.toLowerCase().replace(' ', '-'));
                    setShowServiceDetails(false);
                  }}
                >
                  View Logs
                </button>
                <button 
                  className="action-btn"
                  onClick={() => {
                    addNotification({
                      id: Date.now(),
                      title: 'Health Check',
                      message: `Running health check on ${selectedService.name}...`,
                      type: 'info',
                      time: new Date().toLocaleTimeString()
                    });
                    
                    setTimeout(() => {
                      addNotification({
                        id: Date.now(),
                        title: 'Health Check Complete',
                        message: `Health check completed for ${selectedService.name}. Status: ${selectedService.status}`,
                        type: 'success',
                        time: new Date().toLocaleTimeString()
                      });
                    }, 2000);
                  }}
                >
                  Run Health Check
                </button>
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowServiceDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <CoreUIFramework 
      appTitle="Lumina AI Monitoring" 
      contentWidth="wide"
    >
      <div className="monitoring-container">
        <div className="page-header">
          <h1 className="page-title">System Monitoring</h1>
          <div className="monitoring-actions">
            <div className="refresh-controls">
              <div className="auto-refresh-toggle">
                <input 
                  type="checkbox" 
                  id="auto-refresh" 
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <label htmlFor="auto-refresh">Auto-refresh</label>
              </div>
              
              {autoRefresh && (
                <select 
                  className="refresh-rate-select"
                  value={refreshRate}
                  onChange={(e) => setRefreshRate(parseInt(e.target.value))}
                  aria-label="Refresh rate"
                >
                  <option value="10">10s</option>
                  <option value="30">30s</option>
                  <option value="60">1m</option>
                  <option value="300">5m</option>
                </select>
              )}
              
              <button 
                className="refresh-btn"
                onClick={handleRefresh}
                aria-label="Refresh data"
              >
                <span aria-hidden="true">↻</span>
                {!isMobile && <span>Refresh</span>}
              </button>
            </div>
          </div>
        </div>
        
        <div className="monitoring-controls">
          <div className="tabs" role="tablist">
            <button 
              className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
              role="tab"
              aria-selected={activeTab === 'performance'}
              aria-controls="performance-panel"
              id="performance-tab"
            >
              Performance
            </button>
            <button 
              className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
              role="tab"
              aria-selected={activeTab === 'logs'}
              aria-controls="logs-panel"
              id="logs-tab"
            >
              Logs
            </button>
            <button 
              className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
              role="tab"
              aria-selected={activeTab === 'alerts'}
              aria-controls="alerts-panel"
              id="alerts-tab"
              data-badge={alerts.filter(a => !a.acknowledged).length || null}
            >
              Alerts
            </button>
          </div>
          
          <div className="time-range">
            <label htmlFor="time-range-select">Time Range:</label>
            <select 
              id="time-range-select"
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
        
        <div 
          className="monitoring-content"
          role="tabpanel"
          id={`${activeTab}-panel`}
          aria-labelledby={`${activeTab}-tab`}
        >
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'logs' && renderLogsTab()}
          {activeTab === 'alerts' && renderAlertsTab()}
        </div>
      </div>
    </CoreUIFramework>
  );
};

MonitoringInterface.propTypes = {
  userId: PropTypes.string
};

export default MonitoringInterface;
