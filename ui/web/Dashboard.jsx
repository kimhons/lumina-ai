import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CoreUIFramework, { useUI } from '../core/CoreUIFramework';
import { useIsMobile, useIsTablet, useResponsiveValue } from '../core/hooks/useMediaQuery';
import './styles/Dashboard.css';

/**
 * Enhanced Dashboard Interface for Lumina AI
 * Provides an overview of the system status, key metrics, and quick access to main features
 * with improved accessibility, responsiveness, and visual design
 */
const Dashboard = ({ userId }) => {
  const { addNotification, theme, highContrast } = useUI();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Dashboard state
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    status: 'loading',
    components: []
  });
  const [metrics, setMetrics] = useState({
    activeAgents: 0,
    runningWorkflows: 0,
    completedTasks: 0,
    pendingDeployments: 0,
    providerUsage: 0,
    systemUptime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [metricsHistory, setMetricsHistory] = useState({});
  
  // Responsive layout configuration
  const gridColumns = useResponsiveValue({
    base: 1,
    sm: 2,
    lg: 4
  });
  
  // Simulate fetching data
  useEffect(() => {
    setIsLoading(true);
    
    // In a real implementation, these would be API calls
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set system status
        setSystemStatus({
          status: 'healthy',
          components: [
            { name: 'Deployment Service', status: 'healthy', uptime: '99.9%', load: 42 },
            { name: 'Provider Service', status: 'warning', uptime: '99.8%', load: 78 },
            { name: 'Governance Service', status: 'healthy', uptime: '99.7%', load: 35 },
            { name: 'Workflow Service', status: 'healthy', uptime: '99.9%', load: 56 },
            { name: 'Collaboration Service', status: 'healthy', uptime: '99.6%', load: 61 }
          ]
        });
        
        // Set metrics
        setMetrics({
          activeAgents: 12,
          runningWorkflows: 5,
          completedTasks: 128,
          pendingDeployments: 2,
          providerUsage: 67,
          systemUptime: 99.8
        });
        
        // Set metrics history for charts
        setMetricsHistory({
          activeAgents: [8, 10, 9, 11, 12, 10, 12],
          runningWorkflows: [3, 4, 6, 5, 4, 3, 5],
          completedTasks: [98, 105, 112, 118, 122, 125, 128],
          providerUsage: [58, 62, 65, 70, 68, 65, 67]
        });
        
        // Set recent activity
        setRecentActivity([
          { id: 1, type: 'deployment', title: 'Production Deployment Completed', timestamp: Date.now() - 1800000, details: 'Deployment ID: DEP-2025-04-23-001' },
          { id: 2, type: 'workflow', title: 'Data Analysis Workflow Completed', timestamp: Date.now() - 3600000, details: 'Workflow: Financial Data Processing' },
          { id: 3, type: 'agent', title: 'New Agent Team Formed', timestamp: Date.now() - 7200000, details: 'Team: Content Creation Specialists' },
          { id: 4, type: 'governance', title: 'Policy Update Applied', timestamp: Date.now() - 14400000, details: 'Policy: Content Safety Standards v2.1' },
          { id: 5, type: 'integration', title: 'New API Connector Added', timestamp: Date.now() - 28800000, details: 'Connector: Salesforce CRM' },
          { id: 6, type: 'alert', title: 'Provider Rate Limit Warning', timestamp: Date.now() - 43200000, details: 'Provider: OpenAI GPT-4' },
          { id: 7, type: 'workflow', title: 'Code Generation Workflow Started', timestamp: Date.now() - 57600000, details: 'Workflow: Backend API Development' },
          { id: 8, type: 'deployment', title: 'Staging Deployment Completed', timestamp: Date.now() - 86400000, details: 'Deployment ID: DEP-2025-04-22-003' }
        ]);
        
        // Add notification for demo purposes
        addNotification({
          id: Date.now(),
          title: 'Dashboard Updated',
          message: 'System metrics and status have been refreshed',
          type: 'info',
          time: formatTime(Date.now())
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // Add error notification
        addNotification({
          id: Date.now(),
          title: 'Dashboard Error',
          message: 'Failed to load dashboard data. Please try again.',
          type: 'error',
          time: formatTime(Date.now())
        });
        
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [addNotification, timeRange]);
  
  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  };
  
  // Format time ago
  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + ' years ago';
    if (interval === 1) return '1 year ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + ' months ago';
    if (interval === 1) return '1 month ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + ' days ago';
    if (interval === 1) return '1 day ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + ' hours ago';
    if (interval === 1) return '1 hour ago';
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + ' minutes ago';
    if (interval === 1) return '1 minute ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };
  
  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'healthy':
        return 'status-healthy';
      case 'warning':
        return 'status-warning';
      case 'error':
        return 'status-error';
      default:
        return 'status-loading';
    }
  };
  
  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'deployment':
        return '🚀';
      case 'workflow':
        return '🔄';
      case 'agent':
        return '🤖';
      case 'governance':
        return '⚖️';
      case 'integration':
        return '🔌';
      case 'alert':
        return '⚠️';
      default:
        return '📝';
    }
  };
  
  // Render loading state
  const renderLoading = () => (
    <div className="dashboard-loading">
      <div className="loading-spinner"></div>
      <p>Loading dashboard data...</p>
    </div>
  );
  
  // Render system status section
  const renderSystemStatus = () => (
    <div className="dashboard-card status-card" aria-labelledby="status-heading">
      <div className="card-header">
        <h2 id="status-heading">System Status</h2>
        <div className="card-actions">
          <button className="refresh-btn" aria-label="Refresh system status">
            ↻
          </button>
        </div>
      </div>
      
      <div className="system-status-overview">
        <div className={`system-status-indicator ${getStatusColorClass(systemStatus.status)}`}>
          <span className="status-icon"></span>
          <span className="status-text">{systemStatus.status}</span>
        </div>
        <div className="system-uptime">
          <span className="uptime-label">System Uptime:</span>
          <span className="uptime-value">{metrics.systemUptime}%</span>
        </div>
      </div>
      
      <div className="component-status-list">
        {systemStatus.components.map((component, index) => (
          <div key={index} className="component-status-item">
            <div className="component-info">
              <h3 className="component-name">{component.name}</h3>
              <div className="component-details">
                <span className="component-uptime">Uptime: {component.uptime}</span>
                <span className="component-load">Load: {component.load}%</span>
              </div>
            </div>
            <div className={`component-status-indicator ${getStatusColorClass(component.status)}`}>
              <span className="status-icon" aria-hidden="true"></span>
              <span className="sr-only">{component.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Render key metrics section
  const renderKeyMetrics = () => (
    <div className="dashboard-card metrics-card" aria-labelledby="metrics-heading">
      <div className="card-header">
        <h2 id="metrics-heading">Key Metrics</h2>
        <div className="card-actions">
          <select 
            className="time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            aria-label="Select time range"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>
      
      <div className="metrics-grid" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
        <div className="metric-item">
          <div className="metric-header">
            <h3 className="metric-title">Active Agents</h3>
            <span className="metric-icon">🤖</span>
          </div>
          <div className="metric-value">{metrics.activeAgents}</div>
          <div className="metric-chart">
            {metricsHistory.activeAgents && (
              <div className="mini-chart">
                {metricsHistory.activeAgents.map((value, index) => (
                  <div 
                    key={index} 
                    className="chart-bar"
                    style={{ 
                      height: `${(value / Math.max(...metricsHistory.activeAgents)) * 100}%`,
                      width: `${100 / metricsHistory.activeAgents.length}%`,
                      left: `${(index / metricsHistory.activeAgents.length) * 100}%`
                    }}
                    aria-hidden="true"
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-header">
            <h3 className="metric-title">Running Workflows</h3>
            <span className="metric-icon">🔄</span>
          </div>
          <div className="metric-value">{metrics.runningWorkflows}</div>
          <div className="metric-chart">
            {metricsHistory.runningWorkflows && (
              <div className="mini-chart">
                {metricsHistory.runningWorkflows.map((value, index) => (
                  <div 
                    key={index} 
                    className="chart-bar"
                    style={{ 
                      height: `${(value / Math.max(...metricsHistory.runningWorkflows)) * 100}%`,
                      width: `${100 / metricsHistory.runningWorkflows.length}%`,
                      left: `${(index / metricsHistory.runningWorkflows.length) * 100}%`
                    }}
                    aria-hidden="true"
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-header">
            <h3 className="metric-title">Completed Tasks</h3>
            <span className="metric-icon">✓</span>
          </div>
          <div className="metric-value">{metrics.completedTasks}</div>
          <div className="metric-chart">
            {metricsHistory.completedTasks && (
              <div className="mini-chart">
                {metricsHistory.completedTasks.map((value, index) => (
                  <div 
                    key={index} 
                    className="chart-bar"
                    style={{ 
                      height: `${(value / Math.max(...metricsHistory.completedTasks)) * 100}%`,
                      width: `${100 / metricsHistory.completedTasks.length}%`,
                      left: `${(index / metricsHistory.completedTasks.length) * 100}%`
                    }}
                    aria-hidden="true"
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-header">
            <h3 className="metric-title">Provider Usage</h3>
            <span className="metric-icon">🔌</span>
          </div>
          <div className="metric-value">{metrics.providerUsage}%</div>
          <div className="metric-chart">
            {metricsHistory.providerUsage && (
              <div className="mini-chart">
                {metricsHistory.providerUsage.map((value, index) => (
                  <div 
                    key={index} 
                    className="chart-bar"
                    style={{ 
                      height: `${(value / 100) * 100}%`,
                      width: `${100 / metricsHistory.providerUsage.length}%`,
                      left: `${(index / metricsHistory.providerUsage.length) * 100}%`
                    }}
                    aria-hidden="true"
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="metrics-footer">
        <button className="view-details-btn">View Detailed Analytics</button>
      </div>
    </div>
  );
  
  // Render quick actions section
  const renderQuickActions = () => (
    <div className="dashboard-card actions-card" aria-labelledby="actions-heading">
      <div className="card-header">
        <h2 id="actions-heading">Quick Actions</h2>
      </div>
      
      <div className="action-buttons" style={{ gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr' }}>
        <button className="action-button">
          <span className="action-icon" aria-hidden="true">🚀</span>
          <span className="action-label">New Deployment</span>
        </button>
        <button className="action-button">
          <span className="action-icon" aria-hidden="true">🤖</span>
          <span className="action-label">Create Agent Team</span>
        </button>
        <button className="action-button">
          <span className="action-icon" aria-hidden="true">🔄</span>
          <span className="action-label">Start Workflow</span>
        </button>
        <button className="action-button">
          <span className="action-icon" aria-hidden="true">🔌</span>
          <span className="action-label">Add Provider</span>
        </button>
        {!isMobile && (
          <>
            <button className="action-button">
              <span className="action-icon" aria-hidden="true">⚖️</span>
              <span className="action-label">Update Policies</span>
            </button>
            <button className="action-button">
              <span className="action-icon" aria-hidden="true">📊</span>
              <span className="action-label">View Reports</span>
            </button>
            <button className="action-button">
              <span className="action-icon" aria-hidden="true">🔍</span>
              <span className="action-label">Audit Logs</span>
            </button>
            <button className="action-button">
              <span className="action-icon" aria-hidden="true">⚙️</span>
              <span className="action-label">System Settings</span>
            </button>
          </>
        )}
  
(Content truncated due to size limit. Use line ranges to read in chunks)