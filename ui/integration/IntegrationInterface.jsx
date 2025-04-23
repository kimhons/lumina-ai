import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CoreUIFramework, { useUI } from '../core/CoreUIFramework';
import { useIsMobile, useIsTablet } from '../core/hooks/useMediaQuery';
import './styles/IntegrationInterface.css';

/**
 * Enhanced Integration Interface for Lumina AI
 * Provides comprehensive tools for connecting Lumina AI with external systems and services
 * with improved interactivity, accessibility, and responsive design
 */
const IntegrationInterface = ({ userId }) => {
  const { addNotification, theme } = useUI();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [dataMappers, setDataMappers] = useState([]);
  const [integrationTests, setIntegrationTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showAddConnectionModal, setShowAddConnectionModal] = useState(false);
  const [showEditConnectionModal, setShowEditConnectionModal] = useState(false);
  const [showAddApiKeyModal, setShowAddApiKeyModal] = useState(false);
  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false);
  const [showAddDataMapperModal, setShowAddDataMapperModal] = useState(false);
  const [showTestResultsModal, setShowTestResultsModal] = useState(false);
  
  // Selected item states
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [selectedDataMapper, setSelectedDataMapper] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  
  // Form states
  const [connectionForm, setConnectionForm] = useState({
    name: '',
    type: 'crm',
    url: '',
    authType: 'oauth',
    credentials: {},
    syncFrequency: '1h'
  });
  
  const [apiKeyForm, setApiKeyForm] = useState({
    name: '',
    permissions: ['read'],
    expiresIn: '90d'
  });
  
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [],
    secret: ''
  });
  
  const [dataMapperForm, setDataMapperForm] = useState({
    name: '',
    sourceSystem: '',
    targetSystem: '',
    mappings: []
  });
  
  const [testForm, setTestForm] = useState({
    name: '',
    connection: '',
    testType: 'connectivity',
    parameters: {}
  });
  
  // Filter states
  const [connectionFilters, setConnectionFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });
  
  const [apiKeyFilters, setApiKeyFilters] = useState({
    search: ''
  });
  
  const [webhookFilters, setWebhookFilters] = useState({
    status: 'all',
    search: ''
  });
  
  const [dataMapperFilters, setDataMapperFilters] = useState({
    sourceSystem: 'all',
    targetSystem: 'all',
    search: ''
  });
  
  const [testFilters, setTestFilters] = useState({
    status: 'all',
    connection: 'all',
    search: ''
  });
  
  // Refs for modals
  const connectionFormRef = useRef(null);
  const apiKeyFormRef = useRef(null);
  const webhookFormRef = useRef(null);
  const dataMapperFormRef = useRef(null);
  const testFormRef = useRef(null);
  
  // Simulate fetching data
  useEffect(() => {
    setIsLoading(true);
    
    // In a real implementation, these would be API calls
    setTimeout(() => {
      // Connections
      setConnections([
        { 
          id: 1, 
          name: 'Salesforce CRM', 
          type: 'crm', 
          status: 'connected', 
          lastSync: Date.now() - 3600000,
          syncFrequency: '1h',
          url: 'https://login.salesforce.com',
          authType: 'oauth',
          credentials: {
            clientId: 'sf_client_123',
            scopes: ['read', 'write', 'api']
          },
          syncStats: {
            totalRecords: 15243,
            lastSyncDuration: 145,
            successRate: 99.8,
            errorCount: 3
          },
          mappedEntities: [
            { name: 'Contact', count: 5280 },
            { name: 'Account', count: 842 },
            { name: 'Opportunity', count: 1653 }
          ]
        },
        { 
          id: 2, 
          name: 'Microsoft Teams', 
          type: 'communication', 
          status: 'connected', 
          lastSync: Date.now() - 7200000,
          syncFrequency: '6h',
          url: 'https://graph.microsoft.com',
          authType: 'oauth',
          credentials: {
            clientId: 'ms_client_456',
            scopes: ['Team.ReadWrite.All', 'User.Read.All']
          },
          syncStats: {
            totalRecords: 3421,
            lastSyncDuration: 78,
            successRate: 100,
            errorCount: 0
          },
          mappedEntities: [
            { name: 'Team', count: 24 },
            { name: 'Channel', count: 156 },
            { name: 'User', count: 348 }
          ]
        },
        { 
          id: 3, 
          name: 'Jira', 
          type: 'project', 
          status: 'error', 
          lastSync: Date.now() - 86400000,
          syncFrequency: '1h',
          url: 'https://your-domain.atlassian.net',
          authType: 'apikey',
          credentials: {
            apiKey: 'jira_key_789'
          },
          syncStats: {
            totalRecords: 8765,
            lastSyncDuration: 210,
            successRate: 82.3,
            errorCount: 154
          },
          mappedEntities: [
            { name: 'Project', count: 18 },
            { name: 'Issue', count: 2453 },
            { name: 'Sprint', count: 86 }
          ],
          errors: [
            { message: 'API rate limit exceeded', timestamp: Date.now() - 86400000 },
            { message: 'Authentication failed', timestamp: Date.now() - 90000000 }
          ]
        },
        { 
          id: 4, 
          name: 'Slack', 
          type: 'communication', 
          status: 'connected', 
          lastSync: Date.now() - 1800000,
          syncFrequency: '15m',
          url: 'https://slack.com/api',
          authType: 'oauth',
          credentials: {
            clientId: 'slack_client_101',
            scopes: ['channels:read', 'chat:write', 'users:read']
          },
          syncStats: {
            totalRecords: 12543,
            lastSyncDuration: 65,
            successRate: 99.9,
            errorCount: 1
          },
          mappedEntities: [
            { name: 'Channel', count: 42 },
            { name: 'User', count: 287 },
            { name: 'Message', count: 12214 }
          ]
        },
        { 
          id: 5, 
          name: 'Google Workspace', 
          type: 'productivity', 
          status: 'connected', 
          lastSync: Date.now() - 10800000,
          syncFrequency: '1h',
          url: 'https://www.googleapis.com',
          authType: 'oauth',
          credentials: {
            clientId: 'google_client_202',
            scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/calendar']
          },
          syncStats: {
            totalRecords: 7865,
            lastSyncDuration: 112,
            successRate: 99.5,
            errorCount: 4
          },
          mappedEntities: [
            { name: 'Document', count: 1243 },
            { name: 'Calendar', count: 15 },
            { name: 'User', count: 178 }
          ]
        }
      ]);
      
      // API Keys
      setApiKeys([
        { 
          id: 1, 
          name: 'Production API Key', 
          prefix: 'lmn_prod_', 
          created: Date.now() - 7776000000, // 90 days ago
          lastUsed: Date.now() - 86400000,
          permissions: ['read', 'write'],
          expiresAt: Date.now() + 7776000000, // 90 days from now
          createdBy: 'admin@lumina.ai',
          usageStats: {
            totalRequests: 15243,
            last24h: 342,
            last7d: 2156,
            last30d: 8765
          }
        },
        { 
          id: 2, 
          name: 'Development API Key', 
          prefix: 'lmn_dev_', 
          created: Date.now() - 2592000000, // 30 days ago
          lastUsed: Date.now() - 3600000,
          permissions: ['read', 'write', 'admin'],
          expiresAt: Date.now() + 2592000000, // 30 days from now
          createdBy: 'developer@lumina.ai',
          usageStats: {
            totalRequests: 8765,
            last24h: 543,
            last7d: 3421,
            last30d: 8765
          }
        },
        { 
          id: 3, 
          name: 'Analytics API Key', 
          prefix: 'lmn_analytics_', 
          created: Date.now() - 1209600000, // 14 days ago
          lastUsed: Date.now() - 43200000,
          permissions: ['read'],
          expiresAt: Date.now() + 7776000000, // 90 days from now
          createdBy: 'analyst@lumina.ai',
          usageStats: {
            totalRequests: 4321,
            last24h: 123,
            last7d: 876,
            last30d: 3421
          }
        }
      ]);
      
      // Webhooks
      setWebhooks([
        { 
          id: 1, 
          name: 'Deployment Notifications', 
          url: 'https://example.com/webhooks/deployments', 
          events: ['deployment.success', 'deployment.failure'],
          status: 'active',
          lastTriggered: Date.now() - 86400000,
          secret: 'whsec_deployment123',
          createdAt: Date.now() - 2592000000, // 30 days ago
          deliveryStats: {
            totalDeliveries: 156,
            successRate: 98.7,
            failureCount: 2,
            averageResponseTime: 245
          }
        },
        { 
          id: 2, 
          name: 'Team Formation Events', 
          url: 'https://example.com/webhooks/teams', 
          events: ['team.created', 'team.updated', 'team.deleted'],
          status: 'active',
          lastTriggered: Date.now() - 172800000,
          secret: 'whsec_teams456',
          createdAt: Date.now() - 1209600000, // 14 days ago
          deliveryStats: {
            totalDeliveries: 87,
            successRate: 100,
            failureCount: 0,
            averageResponseTime: 178
          }
        },
        { 
          id: 3, 
          name: 'Governance Alerts', 
          url: 'https://example.com/webhooks/governance', 
          events: ['governance.policy.violation', 'governance.content.flagged'],
          status: 'inactive',
          lastTriggered: null,
          secret: 'whsec_governance789',
          createdAt: Date.now() - 604800000, // 7 days ago
          deliveryStats: {
            totalDeliveries: 0,
            successRate: 0,
            failureCount: 0,
            averageResponseTime: 0
          }
        }
      ]);
      
      // Data Mappers
      setDataMappers([
        {
          id: 1,
          name: 'Salesforce to Lumina Contacts',
          sourceSystem: 'Salesforce CRM',
          targetSystem: 'Lumina AI',
          status: 'active',
          lastRun: Date.now() - 3600000,
          mappings: [
            { source: 'Contact.FirstName', target: 'User.firstName' },
            { source: 'Contact.LastName', target: 'User.lastName' },
            { source: 'Contact.Email', target: 'User.email' },
            { source: 'Contact.Phone', target: 'User.phone' },
            { source: 'Contact.Title', target: 'User.jobTitle' }
          ],
          transformations: [
            { field: 'User.fullName', expression: 'concat(User.firstName, " ", User.lastName)' }
          ],
          stats: {
            recordsProcessed: 5280,
            successRate: 99.8,
            errorCount: 11,
            averageProcessingTime: 0.12
          }
        },
        {
          id: 2,
          name: 'Jira Issues to Lumina Tasks',
          sourceSystem: 'Jira',
          targetSystem: 'Lumina AI',
          status: 'active',
          lastRun: Date.now() - 7200000,
          mappings: [
            { source: 'Issue.Summary', target: 'Task.title' },
            { source: 'Issue.Description', target: 'Task.description' },
            { source: 'Issue.Priority', target: 'Task.priority' },
            { source: 'Issue.Assignee', target: 'Task.assignee' },
            { source: 'Issue.DueDate', target: 'Task.dueDate' }
          ],
          transformations: [
            { field: 'Task.status', expression: 'mapStatus(Issue.Status)' }
          ],
          stats: {
            recordsProcessed: 2453,
            successRate: 97.5,
            errorCount: 62,
            averageProcessingTime: 0.18
          }
        },
        {
          id: 3,
          name: 'Google Calendar to Lumina Events',
          sourceSystem: 'Google Workspace',
          targetSystem: 'Lumina AI',
          status: 'inactive',
          lastRun: Date.now() - 259200000,
          mappings: [
            { source: 'Event.Summary', target: 'CalendarEvent.title' },
            { source: 'Event.Description', target: 'CalendarEvent.description' },
            { source: 'Event.Start', target: 'CalendarEvent.startTime' },
            { source: 'Event.End', target: 'CalendarEvent.endTime' },
            { source: 'Event.Attendees', target: 'CalendarEvent.participants' }
          ],
          transformations: [
            { field: 'CalendarEvent.duration', expression: 'timeDiff(CalendarEvent.endTime, CalendarEvent.startTime)' }
          ],
          stats: {
            recordsProcessed: 843,
            successRate: 100,
            errorCount: 0,
            averageProcessingTime: 0.09
          }
        }
      ]);
      
      // Integration Tests
      setIntegrationTests([
        {
          id: 1,
          name: 'Salesforce Authentication Test',
          connection: 'Salesforce CRM',
          testType: 'authentication',
          status: 'passed',
          lastRun: Date.now() - 3600000,
          duration: 1.2,
          results: {
            success: true,
            message: 'Successfully authenticated with Salesforce API',
            responseTime: 245,
            details: {
              tokenType: 'Bearer',
              expiresIn: 3600,
              scope: 'api read write'
            }
          },
          schedule: 'daily'
        },
        {
          id: 2,
          name: 'Jira API Connectivity Test',
          connection: 'Jira',
          testType: 'connectivity',
          status: 'failed',
          lastRun: Date.now() - 86400000,
          duration: 3.5,
          results: {
            success: false,
            message: 'Failed to connect to Jira API: Authentication failed',
            responseTime: 3500,
            details: {
              errorCode: 401,
              errorMessage: 'Invalid API token'
            }
          },
          schedule: 'hourly'
        },
        {
          id: 3,
          name: 'Slack Message Posting Test',
          connection: 'Slack',
          testType: 'functionality',
          status: 'passed',
          lastRun: Date.now() - 7200000,
          duration: 0.8,
          results: {
            success: true,
            message: 'Successfully posted test message to #general channel',
            responseTime: 178,
            details: {
              channelId: 'C01234ABCDE',
              messageTs: '1619712345.123456',
              messageUrl: 'https://slack.com/archives/C01234ABCDE/p1619712345123456'
            }
          },
          schedule: 'hourly'
        },
        {
          id: 4,
          name: 'Google Drive File Access Test',
          connection: 'Google Workspace',
          testType: 'functionality',
          status: 'passed',
          lastRun: Date.now() - 10800000,
          duration: 1.5,
          results: {
            success: true,
            message: 'Successfully accessed and read test file from Google Drive',
            responseTime: 312,
            details: {
              fileId: '1aBcDeFgHiJkLmNoPqRsTuVwXyZ',
              fileName: 'test-document.docx',
              fileSize: '25KB'
            }
          },
          schedule: 'daily'
        },
        {
          id: 5,
          name: 'Microsoft Teams Channel Creation Test',
          connection: 'Microsoft Teams',
          testType: 'functionality',
          status: 'warning',
          lastRun: Date.now() - 14400000,
          duration: 2.3,
          results: {
            success: true,
            message: 'Created test channel but with unexpected delay',
            responseTime: 2300,
            details: {
              teamId: '19:aabbccdd_1234567890@thread.tacv2',
              channelId: '19:zzyyxxww_0987654321@thread.tacv2',
              warning: 'Response time exceeded threshold of 2000ms'
            }
          },
          schedule: 'daily'
        }
      ]);
      
      setIsLoading(false);
      
      // Add notification for demo purposes
      addNotification({
        id: Date.now(),
        title: 'Integration Data Loaded',
        message: 'Integration data has been refreshed successfully',
        type: 'info',
        time: new Date().toLocaleTimeString()
      });
    }, 1000);
  }, [addNotification]);
  
  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  };
  
  // Format time ago
  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    
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
  
  // Handle connection form change
  const handleConnectionFormChange = (e) => {
    const { name, value } = e.target;
    setConnectionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle API key form change
  const handleApiKeyFormChange = (e) => {
    const { name, value } = e.target;
    setApiKeyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle webhook form change
  const handleWebhookFormChange = (e) => {
    const { name, value } = e.target;
    setWebhookForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle data mapper form change
  const handleDataMapperFormChange = (e) => {
    const { name, value } = e.target;
    setDataMapperForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle test form change
  const handleTestFormChange = (e) => {
    const { name, value } = e.target;
    setTestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle connection filter change
  const handleConnectionFilterChange = (field, value) => {
    setConnectionFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle API key filter change
  const handleApiKeyFilterChange = (field, value) => {
    setApiKeyFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle webhook filter change
  const handleWebhookFilterChange = (field, value) => {
    setWebhookFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle data mapper filter change
  const handleDataMapperFilterChange = (field, value) => {
    setDataMapperFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle test filter change
  const handleTestFilterChange = (field, value) => {
    setTestFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle add connection
  const handleAddConnection = (e) => {
    e.preventDefault();
    
    addNotification({
      id: Date.now(),
      title: 'Connection Added',
      message: `New connection "${connectionForm.name}" has been added successfully`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // In a real implementation, this would be an API call
    const newConnection = {
      id: connections.length + 1,
      name: connectionForm.name,
      type: connectionForm.type,
      status: 'connected',
      lastSync: null,
      syncFrequency: connectionForm.syncFrequency,
      url: connectionForm.url,
      authType: connectionForm.authType,
      credentials: connectionForm.credentials,
      syncStats: {
        totalRecords: 0,
        lastSyncDuration: 0,
        successRate: 0,
        errorCount: 0
      },
      mappedEntities: []
    };
    
    setConnections(prev => [...prev, newConnection]);
    setConnectionForm({
      name: '',
      type: 'crm',
      url: '',
      authType: 'oauth',
      credentials: {},
      syncFrequency: '1h'
    });
    
    setShowAddConnectionModal(false);
  };
  
  // Handle add API key
  const handleAddApiKey = (e) => {
    e.preventDefault();
    
    addNotification({
      id: Date.now(),
      title: 'API Key Generated',
      message: `New API key "${apiKeyForm.name}" has been generated successfully`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // In a real implementation, this would be an API call
    const newApiKey = {
      id: apiKeys.length + 1,
      name: apiKeyForm.name,
      prefix: `lmn_${apiKeyForm.name.toLowerCase().replace(/\s+/g, '_')}_`,
      created: Date.now(),
      lastUsed: null,
      permissions: apiKeyForm.permissions,
      expiresAt: Date.now() + (apiKeyForm.expiresIn === '90d' ? 7776000000 : 
                              apiKeyForm.expiresIn === '30d' ? 2592000000 : 
                              apiKeyForm.expiresIn === '1y' ? 31536000000 : 7776000000),
      createdBy: 'current.user@lumina.ai',
      usageStats: {
        totalRequests: 0,
        last24h: 0,
        last7d: 0,
        last30d: 0
      }
    };
    
    setApiKeys(prev => [...prev, newApiKey]);
    setApiKeyForm({
      name: '',
      permissions: ['read'],
      expiresIn: '90d'
    });
    
    setShowAddApiKeyModal(false);
  };
  
  // Handle add webhook
  const handleAddWebhook = (e) => {
    e.preventDefault();
    
    addNotification({
      id: Date.now(),
      title: 'Webhook Created',
      message: `New webhook "${webhookForm.name}" has been created successfully`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // In a real implementation, this would be an API call
    const newWebhook = {
      id: webhooks.length + 1,
      name: webhookForm.name,
      url: webhookForm.url,
      events: webhookForm.events,
      status: 'active',
      lastTriggered: null,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: Date.now(),
      deliveryStats: {
        totalDeliveries: 0,
        successRate: 0,
        failureCount: 0,
        averageResponseTime: 0
      }
    };
    
    setWebhooks(prev => [...prev, newWebhook]);
    setWebhookForm({
      name: '',
      url: '',
      events: [],
      secret: ''
    });
    
    setShowAddWebhookModal(false);
  };
  
  // Handle add data mapper
  const handleAddDataMapper = (e) => {
    e.preventDefault();
    
    addNotification({
      id: Date.now(),
      title: 'Data Mapper Created',
      message: `New data mapper "${dataMapperForm.name}" has been created successfully`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // In a real implementation, this would be an API call
    const newDataMapper = {
      id: dataMappers.length + 1,
      name: dataMapperForm.name,
      sourceSystem: dataMapperForm.sourceSystem,
      targetSystem: dataMapperForm.targetSystem,
      status: 'active',
      lastRun: null,
      mappings: dataMapperForm.mappings,
      transformations: [],
      stats: {
        recordsProcessed: 0,
        successRate: 0,
        errorCount: 0,
        averageProcessingTime: 0
      }
    };
    
    setDataMappers(prev => [...prev, newDataMapper]);
    setDataMapperForm({
      name: '',
      sourceSystem: '',
      targetSystem: '',
      mappings: []
    });
    
    setShowAddDataMapperModal(false);
  };
  
  // Handle run test
  const handleRunTest = (test) => {
    addNotification({
      id: Date.now(),
      title: 'Test Started',
      message: `Running integration test "${test.name}"...`,
      type: 'info',
      time: new Date().toLocaleTimeString()
    });
    
    // In a real implementation, this would be an API call
    setTimeout(() => {
      const success = Math.random() > 0.3;
      
      setIntegrationTests(prev => prev.map(t => {
        if (t.id === test.id) {
          return {
            ...t,
            status: success ? 'passed' : 'failed',
            lastRun: Date.now(),
            duration: Math.random() * 3 + 0.5,
            results: {
              success,
              message: success ? 
                `Successfully completed test "${test.name}"` : 
                `Test "${test.name}" failed: Connection refused`,
              responseTime: Math.floor(Math.random() * 500 + 100),
              details: success ? 
                { statusCode: 200, responseBody: '{"status":"success"}' } : 
                { errorCode: 503, errorMessage: 'Service unavailable' }
            }
          };
        }
        return t;
      }));
      
      addNotification({
        id: Date.now(),
        title: success ? 'Test Passed' : 'Test Failed',
        message: success ? 
          `Integration test "${test.name}" completed successfully` : 
          `Integration test "${test.name}" failed. Check results for details.`,
        type: success ? 'success' : 'error',
        time: new Date().toLocaleTimeString()
      });
      
      setSelectedTest(test);
      setShowTestResultsModal(true);
    }, 2000);
  };
  
  // Handle sync connection
  const handleSyncConnection = (connection) => {
    addNotification({
      id: Date.now(),
      title: 'Sync Started',
      message: `Syncing data with "${connection.name}"...`,
      type: 'info',
      time: new Date().toLocaleTimeString()
    });
    
    // In a real implementation, this would be an API call
    setTimeout(() => {
      const success = Math.random() > 0.2;
      
      setConnections(prev => prev.map(c => {
        if (c.id === connection.id) {
          return {
            ...c,
            lastSync: Date.now(),
            status: success ? 'connected' : 'error',
            syncStats: {
              ...c.syncStats,
              lastSyncDuration: Math.floor(Math.random() * 200 + 50),
              successRate: success ? 99.5 : 82.3,
              errorCount: success ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 50 + 20)
            }
          };
        }
        return c;
      }));
      
      addNotification({
        id: Date.now(),
        title: success ? 'Sync Completed' : 'Sync Failed',
        message: success ? 
          `Successfully synced data with "${connection.name}"` : 
          `Failed to sync data with "${connection.name}". Check connection details.`,
        type: success ? 'success' : 'error',
        time: new Date().toLocaleTimeString()
      });
    }, 3000);
  };
  
  // Filter connections based on current filters
  const filteredConnections = connections.filter(connection => {
    // Type filter
    if (connectionFilters.type !== 'all' && connection.type !== connectionFilters.type) {
      return false;
    }
    
    // Status filter
    if (connectionFilters.status !== 'all' && connection.status !== connectionFilters.status) {
      return false;
    }
    
    // Search filter
    if (connectionFilters.search && !connection.name.toLowerCase().includes(connectionFilters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Filter API keys based on current filters
  const filteredApiKeys = apiKeys.filter(key => {
    // Search filter
    if (apiKeyFilters.search && !key.name.toLowerCase().includes(apiKeyFilters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Filter webhooks based on current filters
  const filteredWebhooks = webhooks.filter(webhook => {
    // Status filter
    if (webhookFilters.status !== 'all' && webhook.status !== webhookFilters.status) {
      return false;
    }
    
    // Search filter
    if (webhookFilters.search && !webhook.name.toLowerCase().includes(webhookFilters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Filter data mappers based on current filters
  const filteredDataMappers = dataMappers.filter(mapper => {
    // Source system filter
    if (dataMapperFilters.sourceSystem !== 'all' && mapper.sourceSystem !== dataMapperFilters.sourceSystem) {
      return false;
    }
    
    // Target system filter
    if (dataMapperFilters.targetSystem !== 'all' && mapper.targetSystem !== dataMapperFilters.targetSystem) {
      return false;
    }
    
    // Search filter
    if (dataMapperFilters.search && !mapper.name.toLowerCase().includes(dataMapperFilters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Filter integration tests based on current filters
  const filteredTests = integrationTests.filter(test => {
    // Status filter
    if (testFilters.status !== 'all' && test.status !== testFilters.status) {
      return false;
    }
    
    // Connection filter
    if (testFilters.connection !== 'all' && test.connection !== testFilters.connection) {
      return false;
    }
    
    // Search filter
    if (testFilters.search && !test.name.toLowerCase().includes(testFilters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Render loading state
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading integration data...</p>
    </div>
  );
  
  // Render connections tab
  const renderConnectionsTab = () => {
    if (isLoading) {
      return renderLoading();
    }
    
    return (
      <div className="connections-tab">
        <div className="tab-header">
          <h3>External System Connections</h3>
          <button 
            className="primary-btn"
            onClick={() => setShowAddConnectionModal(true)}
          >
            Add New Connection
          </button>
        </div>
        
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="connection-type-filter">Type:</label>
            <select 
              id="connection-type-filter"
              className="filter-select"
              value={connectionFilters.type}
              onChange={(e) => handleConnectionFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="crm">CRM</option>
              <option value="communication">Communication</option>
              <option value="project">Project Management</option>
              <option value="productivity">Productivity</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="connection-status-filter">Status:</label>
            <select 
              id="connection-status-filter"
              className="filter-select"
              value={connectionFilters.status}
              onChange={(e) => handleConnectionFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="connected">Connected</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div className="filter-group search-group">
            <label htmlFor="connection-search">Search:</label>
            <input 
              id="connection-search"
              type="text" 
              className="search-input"
              placeholder="Search connections..."
              value={connectionFilters.search}
              onChange={(e) => handleConnectionFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        
        <div className="connections-grid">
          {filteredConnections.length > 0 ? (
            filteredConnections.map(connection => (
              <div 
                key={connection.id} 
                className={`connection-card status-${connection.status}`}
                onClick={() => {
                  setSelectedConnection(connection);
                  setShowEditConnectionModal(true);
                }}
              >
                <div className="connection-header">
                  <div className="connection-icon" data-type={connection.type}>
                    {connection.type.charAt(0).toUpperCase()}
                  </div>
                  <div className="connection-title">
                    <h4>{connection.name}</h4>
                    <span className="connection-type">{connection.type}</span>
                  </div>
                  <div className={`connection-status ${connection.status}`}>
                    {connection.status}
                  </div>
                </div>
                
                <div className="connection-details">
                  <div className="detail-item">
                    <span className="detail-label">Last Sync:</span>
                    <span className="detail-value">{connection.lastSync ? timeAgo(connection.lastSync) : 'Never'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Sync Frequency:</span>
                    <span className="detail-value">{connection.syncFrequency}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Success Rate:</span>
                    <span className="detail-value">{connection.syncStats.successRate}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Records:</span>
                    <span className="detail-value">{connection.syncStats.totalRecords.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="connection-actions">
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConnection(connection);
                      setShowEditConnectionModal(true);
                    }}
                  >
                    Configure
                  </button>
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSyncConnection(connection);
                    }}
                  >
                    Sync Now
                  </button>
                  <button 
                    className="action-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      addNotification({
                        id: Date.now(),
                        title: 'Connection Removed',
                        message: `Connection "${connection.name}" has been removed`,
                        type: 'info',
                        time: new Date().toLocaleTimeString()
                      });
                      
                      setConnections(prev => prev.filter(c => c.id !== connection.id));
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              No connections match the current filters
            </div>
          )}
          
          <div 
            className="connection-card add-new"
            onClick={() => setShowAddConnectionModal(true)}
          >
            <div className="add-new-content">
              <span className="add-icon">+</span>
              <span>Add New Connection</span>
            </div>
          </div>
        </div>
        
        {showAddConnectionModal && (
          <div className="modal-overlay">
            <div className="modal-container" role="dialog" aria-labelledby="add-connection-title">
              <div className="modal-header">
                <h3 id="add-connection-title">Add New Connection</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowAddConnectionModal(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <form ref={connectionFormRef} onSubmit={handleAddConnection}>
                  <div className="form-group">
                    <label htmlFor="connection-name">Connection Name</label>
                    <input 
                      type="text" 
                      id="connection-name" 
                      name="name"
                      value={connectionForm.name}
                      onChange={handleConnectionFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="connection-type">Connection Type</label>
                    <select 
                      id="connection-type" 
                      name="type"
                      value={connectionForm.type}
                      onChange={handleConnectionFormChange}
                      required
                    >
                      <option value="crm">CRM</option>
                      <option value="communication">Communication</option>
                      <option value="project">Project Management</option>
                      <option value="productivity">Productivity</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="connection-url">Service URL</label>
                    <input 
                      type="url" 
                      id="connection-url" 
                      name="url"
                      value={connectionForm.url}
                      onChange={handleConnectionFormChange}
                      placeholder="https://api.example.com"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="connection-auth-type">Authentication Type</label>
                    <select 
                      id="connection-auth-type" 
                      name="authType"
                      value={connectionForm.authType}
                      onChange={handleConnectionFormChange}
                      required
                    >
                      <option value="oauth">OAuth 2.0</option>
                      <option value="apikey">API Key</option>
                      <option value="basic">Basic Auth</option>
                    </select>
                  </div>
                  
                  {connectionForm.authType === 'oauth' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="connection-client-id">Client ID</label>
                        <input 
                          type="text" 
                          id="connection-client-id" 
                          name="clientId"
                          value={connectionForm.credentials.clientId || ''}
                          onChange={(e) => setConnectionForm(prev => ({
                            ...prev,
                            credentials: {
                              ...prev.credentials,
                              clientId: e.target.value
                            }
                          }))}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="connection-client-secret">Client Secret</label>
                        <input 
                          type="password" 
                          id="connection-client-secret" 
                          name="clientSecret"
                          value={connectionForm.credentials.clientSecret || ''}
                          onChange={(e) => setConnectionForm(prev => ({
                            ...prev,
                            credentials: {
                              ...prev.credentials,
                              clientSecret: e.target.value
                            }
                          }))}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  {connectionForm.authType === 'apikey' && (
                    <div className="form-group">
                      <label htmlFor="connection-api-key">API Key</label>
                      <input 
                        type="password" 
                        id="connection-api-key" 
                        name="apiKey"
                        value={connectionForm.credentials.apiKey || ''}
                        onChange={(e) => setConnectionForm(prev => ({
                          ...prev,
                          credentials: {
                            ...prev.credentials,
                            apiKey: e.target.value
                          }
                        }))}
                        required
                      />
                    </div>
                  )}
                  
                  {connectionForm.authType === 'basic' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="connection-username">Username</label>
                        <input 
                          type="text" 
                          id="connection-username" 
                          name="username"
                          value={connectionForm.credentials.username || ''}
                          onChange={(e) => setConnectionForm(prev => ({
                            ...prev,
                            credentials: {
                              ...prev.credentials,
                              username: e.target.value
                            }
                          }))}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="connection-password">Password</label>
                        <input 
                          type="password" 
                          id="connection-password" 
                          name="password"
                          value={connectionForm.credentials.password || ''}
                          onChange={(e) => setConnectionForm(prev => ({
                            ...prev,
                            credentials: {
                              ...prev.credentials,
                              password: e.target.value
                            }
                          }))}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="connection-sync-frequency">Sync Frequency</label>
                    <select 
                      id="connection-sync-frequency" 
                      name="syncFrequency"
                      value={connectionForm.syncFrequency}
                      onChange={handleConnectionFormChange}
                      required
                    >
                      <option value="15m">Every 15 minutes</option>
                      <option value="30m">Every 30 minutes</option>
                      <option value="1h">Every hour</option>
                      <option value="6h">Every 6 hours</option>
                      <option value="12h">Every 12 hours</option>
                      <option value="24h">Every 24 hours</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowAddConnectionModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  onClick={() => connectionFormRef.current.requestSubmit()}
                >
                  Add Connection
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showEditConnectionModal && selectedConnection && (
          <div className="modal-overlay">
            <div className="modal-container connection-details-modal" role="dialog" aria-labelledby="connection-details-title">
              <div className="modal-header">
                <h3 id="connection-details-title">{selectedConnection.name} Details</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowEditConnectionModal(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="connection-status-header">
                  <div className={`connection-status-badge ${selectedConnection.status}`}>
                    {selectedConnection.status}
                  </div>
                  <div className="connection-meta">
                    <span className="connection-type-badge">{selectedConnection.type}</span>
                    <span className="connection-sync-info">
                      Last sync: {selectedConnection.lastSync ? timeAgo(selectedConnection.lastSync) : 'Never'}
                    </span>
                  </div>
                </div>
                
                <div className="tabs connection-detail-tabs">
                  <button className="tab-btn active">Overview</button>
                  <button className="tab-btn">Configuration</button>
                  <button className="tab-btn">Sync History</button>
                  <button className="tab-btn">Mapped Entities</button>
                </div>
                
                <div className="connection-detail-content">
                  <div className="connection-stats-grid">
                    <div className="stat-card">
                      <h4>Total Records</h4>
                      <div className="stat-value">{selectedConnection.syncStats.totalRecords.toLocaleString()}</div>
                    </div>
                    
                    <div className="stat-card">
                      <h4>Success Rate</h4>
                      <div className="stat-value">{selectedConnection.syncStats.successRate}%</div>
                    </div>
                    
                    <div className="stat-card">
                      <h4>Last Sync Duration</h4>
                      <div className="stat-value">{selectedConnection.syncStats.lastSyncDuration}s</div>
                    </div>
                    
                    <div className="stat-card">
                      <h4>Error Count</h4>
                      <div className="stat-value">{selectedConnection.syncStats.errorCount}</div>
                    </div>
                  </div>
                  
                  <div className="connection-detail-section">
                    <h4>Connection Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Service URL:</span>
                        <span className="detail-value">{selectedConnection.url}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Auth Type:</span>
                        <span className="detail-value">{selectedConnection.authType}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Sync Frequency:</span>
                        <span className="detail-value">{selectedConnection.syncFrequency}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="connection-detail-section">
                    <h4>Mapped Entities</h4>
                    <div className="entity-list">
                      {selectedConnection.mappedEntities.map((entity, index) => (
                        <div key={index} className="entity-item">
                          <span className="entity-name">{entity.name}</span>
                          <span className="entity-count">{entity.count.toLocaleString()} records</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedConnection.status === 'error' && selectedConnection.errors && (
                    <div className="connection-detail-section">
                      <h4>Recent Errors</h4>
                      <div className="error-list">
                        {selectedConnection.errors.map((error, index) => (
                          <div key={index} className="error-item">
                            <span className="error-time">{timeAgo(error.timestamp)}</span>
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
                    handleSyncConnection(selectedConnection);
                    setShowEditConnectionModal(false);
                  }}
                >
                  Sync Now
                </button>
                <button 
                  className="action-btn"
                  onClick={() => {
                    // In a real implementation, this would navigate to the data mapper
                    addNotification({
                      id: Date.now(),
                      title: 'Data Mapper',
                      message: 'Opening data mapper for this connection',
                      type: 'info',
                      time: new Date().toLocaleTimeString()
                    });
                    setActiveTab('datamappers');
                    setShowEditConnectionModal(false);
                  }}
                >
                  Configure Mappings
                </button>
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowEditConnectionModal(false)}
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
  
  // Render API keys tab
  const renderApiKeysTab = () => {
    if (isLoading) {
      return renderLoading();
    }
    
    return (
      <div className="api-keys-tab">
        <div className="tab-header">
          <h3>API Keys</h3>
          <button 
            className="primary-btn"
            onClick={() => setShowAddApiKeyModal(true)}
          >
            Generate New API Key
          </button>
        </div>
        
        <div className="filter-bar">
          <div className="filter-group search-group">
            <label htmlFor="api-key-search">Search:</label>
            <input 
              id="api-key-search"
              type="text" 
              className="search-input"
              placeholder="Search API keys..."
              value={apiKeyFilters.search}
              onChange={(e) => handleApiKeyFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        
        <div className="api-keys-table-container">
          <table className="api-keys-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key Prefix</th>
                <th>Created</th>
                <th>Last Used</th>
                <th>Permissions</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApiKeys.length > 0 ? (
                filteredApiKeys.map(key => (
                  <tr key={key.id}>
                    <td>{key.name}</td>
                    <td><code>{key.prefix}***************</code></td>
                    <td>{formatTime(key.created)}</td>
                    <td>{key.lastUsed ? timeAgo(key.lastUsed) : 'Never'}</td>
                    <td>
                      {key.permissions.map((perm, index) => (
                        <span key={index} className="permission-tag">{perm}</span>
                      ))}
                    </td>
                    <td>{formatTime(key.expiresAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-btn small"
                          onClick={() => {
                            setSelectedApiKey(key);
                            // In a real implementation, this would open an edit modal
                            addNotification({
                              id: Date.now(),
                              title: 'View API Key Details',
                              message: `Viewing details for API key "${key.name}"`,
                              type: 'info',
                              time: new Date().toLocaleTimeString()
                            });
                          }}
                        >
                          View
                        </button>
                        <button 
                          className="action-btn small danger"
                          onClick={() => {
                            addNotification({
                              id: Date.now(),
                              title: 'API Key Revoked',
                              message: `API key "${key.name}" has been revoked`,
                              type: 'info',
                              time: new Date().toLocaleTimeString()
                            });
                            
                            setApiKeys(prev => prev.filter(k => k.id !== key.id));
                          }}
                        >
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-data-row">
                  <td colSpan="7">No API keys match the current filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="api-usage-section">
          <h3>API Usage</h3>
          <div className="api-usage-grid">
            <div className="usage-card">
              <h4>Total Requests</h4>
              <div className="usage-value">
                {apiKeys.reduce((total, key) => total + key.usageStats.totalRequests, 0).toLocaleString()}
              </div>
            </div>
            
            <div className="usage-card">
              <h4>Last 24 Hours</h4>
              <div className="usage-value">
                {apiKeys.reduce((total, key) => total + key.usageStats.last24h, 0).toLocaleString()}
              </div>
            </div>
            
            <div className="usage-card">
              <h4>Last 7 Days</h4>
              <div className="usage-value">
                {apiKeys.reduce((total, key) => total + key.usageStats.last7d, 0).toLocaleString()}
              </div>
            </div>
            
            <div className="usage-card">
              <h4>Last 30 Days</h4>
              <div className="usage-value">
                {apiKeys.reduce((total, key) => total + key.usageStats.last30d, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="api-documentation">
          <h3>API Documentation</h3>
          <p>
            Use the Lumina AI API to integrate with your custom applications and services.
            Our RESTful API provides access to all Lumina AI capabilities.
          </p>
          <div className="doc-links">
            <a href="#" className="doc-link">API Reference</a>
            <a href="#" className="doc-link">Authentication Guide</a>
            <a href="#" className="doc-link">Code Examples</a>
            <a href="#" className="doc-link">Rate Limits</a>
          </div>
        </div>
        
        {showAddApiKeyModal && (
          <div className="modal-overlay">
            <div className="modal-container" role="dialog" aria-labelledby="add-api-key-title">
              <div className="modal-header">
                <h3 id="add-api-key-title">Generate New API Key</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowAddApiKeyModal(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <form ref={apiKeyFormRef} onSubmit={handleAddApiKey}>
                  <div className="form-group">
                    <label htmlFor="api-key-name">API Key Name</label>
                    <input 
                      type="text" 
                      id="api-key-name" 
                      name="name"
                      value={apiKeyForm.name}
                      onChange={handleApiKeyFormChange}
                      placeholder="e.g., Production API Key"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Permissions</label>
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="perm-read" 
                          checked={apiKeyForm.permissions.includes('read')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApiKeyForm(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, 'read']
                              }));
                            } else {
                              setApiKeyForm(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== 'read')
                              }));
                            }
                          }}
                        />
                        <label htmlFor="perm-read">Read</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="perm-write" 
                          checked={apiKeyForm.permissions.includes('write')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApiKeyForm(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, 'write']
                              }));
                            } else {
                              setApiKeyForm(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== 'write')
                              }));
                            }
                          }}
                        />
                        <label htmlFor="perm-write">Write</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="perm-admin" 
                          checked={apiKeyForm.permissions.includes('admin')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApiKeyForm(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, 'admin']
                              }));
                            } else {
                              setApiKeyForm(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== 'admin')
                              }));
                            }
                          }}
                        />
                        <label htmlFor="perm-admin">Admin</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="api-key-expires">Expires In</label>
                    <select 
                      id="api-key-expires" 
                      name="expiresIn"
                      value={apiKeyForm.expiresIn}
                      onChange={handleApiKeyFormChange}
                    >
                      <option value="30d">30 Days</option>
                      <option value="90d">90 Days</option>
                      <option value="1y">1 Year</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowAddApiKeyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  onClick={() => apiKeyFormRef.current.requestSubmit()}
                >
                  Generate API Key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render webhooks tab
  const renderWebhooksTab = () => {
    if (isLoading) {
      return renderLoading();
    }
    
    return (
      <div className="webhooks-tab">
        <div className="tab-header">
          <h3>Webhooks</h3>
          <button 
            className="primary-btn"
            onClick={() => setShowAddWebhookModal(true)}
          >
            Create New Webhook
          </button>
        </div>
        
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="webhook-status-filter">Status:</label>
            <select 
              id="webhook-status-filter"
              className="filter-select"
              value={webhookFilters.status}
              onChange={(e) => handleWebhookFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="filter-group search-group">
            <label htmlFor="webhook-search">Search:</label>
            <input 
              id="webhook-search"
              type="text" 
              className="search-input"
              placeholder="Search webhooks..."
              value={webhookFilters.search}
              onChange={(e) => handleWebhookFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        
        <div className="webhooks-grid">
          {filteredWebhooks.length > 0 ? (
            filteredWebhooks.map(webhook => (
              <div key={webhook.id} className="webhook-card">
                <div className="webhook-header">
                  <h4>{webhook.name}</h4>
                  <div className={`webhook-status ${webhook.status}`}>
                    {webhook.status}
                  </div>
                </div>
                
                <div className="webhook-url">
                  <code>{webhook.url}</code>
                </div>
                
                <div className="webhook-events">
                  <h5>Events:</h5>
                  <div className="events-list">
                    {webhook.events.map((event, index) => (
                      <span key={index} className="event-tag">{event}</span>
                    ))}
                  </div>
                </div>
                
                <div className="webhook-details">
                  <div className="detail-item">
                    <span className="detail-label">Last Triggered:</span>
                    <span className="detail-value">{webhook.lastTriggered ? timeAgo(webhook.lastTriggered) : 'Never'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Success Rate:</span>
                    <span className="detail-value">{webhook.deliveryStats.successRate}%</span>
                  </div>
                </div>
                
                <div className="webhook-actions">
                  <button 
                    className="action-btn"
                    onClick={() => {
                      setSelectedWebhook(webhook);
                      // In a real implementation, this would open an edit modal
                      addNotification({
                        id: Date.now(),
                        title: 'Edit Webhook',
                        message: `Editing webhook "${webhook.name}"`,
                        type: 'info',
                        time: new Date().toLocaleTimeString()
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => {
                      addNotification({
                        id: Date.now(),
                        title: 'Testing Webhook',
                        message: `Sending test event to webhook "${webhook.name}"...`,
                        type: 'info',
                        time: new Date().toLocaleTimeString()
                      });
                      
                      setTimeout(() => {
                        const success = Math.random() > 0.2;
                        
                        addNotification({
                          id: Date.now(),
                          title: success ? 'Webhook Test Successful' : 'Webhook Test Failed',
                          message: success ? 
                            `Successfully delivered test event to "${webhook.name}"` : 
                            `Failed to deliver test event to "${webhook.name}". Check URL and try again.`,
                          type: success ? 'success' : 'error',
                          time: new Date().toLocaleTimeString()
                        });
                      }, 1500);
                    }}
                  >
                    Test
                  </button>
                  <button 
                    className="action-btn danger"
                    onClick={() => {
                      addNotification({
                        id: Date.now(),
                        title: 'Webhook Deleted',
                        message: `Webhook "${webhook.name}" has been deleted`,
                        type: 'info',
                        time: new Date().toLocaleTimeString()
                      });
                      
                      setWebhooks(prev => prev.filter(w => w.id !== webhook.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              No webhooks match the current filters
            </div>
          )}
          
          <div 
            className="webhook-card add-new"
            onClick={() => setShowAddWebhookModal(true)}
          >
            <div className="add-new-content">
              <span className="add-icon">+</span>
              <span>Create New Webhook</span>
            </div>
          </div>
        </div>
        
        <div className="webhook-documentation">
          <h3>Webhook Documentation</h3>
          <p>
            Webhooks allow you to receive real-time notifications when specific events occur in Lumina AI.
            Configure webhooks to integrate with your existing systems and automate workflows.
          </p>
          <div className="doc-links">
            <a href="#" className="doc-link">Webhook Guide</a>
            <a href="#" className="doc-link">Event Types</a>
            <a href="#" className="doc-link">Security Best Practices</a>
          </div>
        </div>
        
        {showAddWebhookModal && (
          <div className="modal-overlay">
            <div className="modal-container" role="dialog" aria-labelledby="add-webhook-title">
              <div className="modal-header">
                <h3 id="add-webhook-title">Create New Webhook</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowAddWebhookModal(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <form ref={webhookFormRef} onSubmit={handleAddWebhook}>
                  <div className="form-group">
                    <label htmlFor="webhook-name">Webhook Name</label>
                    <input 
                      type="text" 
                      id="webhook-name" 
                      name="name"
                      value={webhookForm.name}
                      onChange={handleWebhookFormChange}
                      placeholder="e.g., Deployment Notifications"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="webhook-url">Endpoint URL</label>
                    <input 
                      type="url" 
                      id="webhook-url" 
                      name="url"
                      value={webhookForm.url}
                      onChange={handleWebhookFormChange}
                      placeholder="https://example.com/webhooks/lumina"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Events</label>
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="event-deployment-success" 
                          checked={webhookForm.events.includes('deployment.success')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWebhookForm(prev => ({
                                ...prev,
                                events: [...prev.events, 'deployment.success']
                              }));
                            } else {
                              setWebhookForm(prev => ({
                                ...prev,
                                events: prev.events.filter(ev => ev !== 'deployment.success')
                              }));
                            }
                          }}
                        />
                        <label htmlFor="event-deployment-success">deployment.success</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="event-deployment-failure" 
                          checked={webhookForm.events.includes('deployment.failure')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWebhookForm(prev => ({
                                ...prev,
                                events: [...prev.events, 'deployment.failure']
                              }));
                            } else {
                              setWebhookForm(prev => ({
                                ...prev,
                                events: prev.events.filter(ev => ev !== 'deployment.failure')
                              }));
                            }
                          }}
                        />
                        <label htmlFor="event-deployment-failure">deployment.failure</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="event-team-created" 
                          checked={webhookForm.events.includes('team.created')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWebhookForm(prev => ({
                                ...prev,
                                events: [...prev.events, 'team.created']
                              }));
                            } else {
                              setWebhookForm(prev => ({
                                ...prev,
                                events: prev.events.filter(ev => ev !== 'team.created')
                              }));
                            }
                          }}
                        />
                        <label htmlFor="event-team-created">team.created</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="event-governance-violation" 
                          checked={webhookForm.events.includes('governance.policy.violation')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWebhookForm(prev => ({
                                ...prev,
                                events: [...prev.events, 'governance.policy.violation']
                              }));
                            } else {
                              setWebhookForm(prev => ({
                                ...prev,
                                events: prev.events.filter(ev => ev !== 'governance.policy.violation')
                              }));
                            }
                          }}
                        />
                        <label htmlFor="event-governance-violation">governance.policy.violation</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="webhook-secret">Webhook Secret (Optional)</label>
                    <input 
                      type="password" 
                      id="webhook-secret" 
                      name="secret"
                      value={webhookForm.secret}
                      onChange={handleWebhookFormChange}
                      placeholder="Used to verify webhook payloads"
                    />
                    <div className="form-help">
                      We'll use this secret to sign webhook payloads so you can verify they came from Lumina AI.
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowAddWebhookModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  onClick={() => webhookFormRef.current.requestSubmit()}
                >
                  Create Webhook
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render data mappers tab
  const renderDataMappersTab = () => {
    if (isLoading) {
      return renderLoading();
    }
    
    return (
      <div className="data-mappers-tab">
        <div className="tab-header">
          <h3>Data Mappers</h3>
          <button 
            className="primary-btn"
            onClick={() => setShowAddDataMapperModal(true)}
          >
            Create New Mapping
          </button>
        </div>
        
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="mapper-source-filter">Source System:</label>
            <select 
              id="mapper-source-filter"
              className="filter-select"
              value={dataMapperFilters.sourceSystem}
              onChange={(e) => handleDataMapperFilterChange('sourceSystem', e.target.value)}
            >
              <option value="all">All Sources</option>
              {connections.map(conn => (
                <option key={conn.id} value={conn.name}>{conn.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="mapper-target-filter">Target System:</label>
            <select 
              id="mapper-target-filter"
              className="filter-select"
              value={dataMapperFilters.targetSystem}
              onChange={(e) => handleDataMapperFilterChange('targetSystem', e.target.value)}
            >
              <option value="all">All Targets</option>
              <option value="Lumina AI">Lumina AI</option>
              {connections.map(conn => (
                <option key={conn.id} value={conn.name}>{conn.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group search-group">
            <label htmlFor="mapper-search">Search:</label>
            <input 
              id="mapper-search"
              type="text" 
              className="search-input"
              placeholder="Search data mappers..."
              value={dataMapperFilters.search}
              onChange={(e) => handleDataMapperFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        
        <div className="data-mappers-grid">
          {filteredDataMappers.length > 0 ? (
            filteredDataMappers.map(mapper => (
              <div key={mapper.id} className="data-mapper-card">
                <div className="data-mapper-header">
                  <h4>{mapper.name}</h4>
                  <div className={`data-mapper-status ${mapper.status}`}>
                    {mapper.status}
                  </div>
                </div>
                
                <div className="data-mapper-systems">
                  <div className="system-item">
                    <span className="system-label">Source:</span>
                    <span className="system-value">{mapper.sourceSystem}</span>
                  </div>
                  <div className="system-arrow">→</div>
                  <div className="system-item">
                    <span className="system-label">Target:</span>
                    <span className="system-value">{mapper.targetSystem}</span>
                  </div>
                </div>
                
                <div className="data-mapper-stats">
                  <div className="stat-item">
                    <span className="stat-value">{mapper.mappings.length}</span>
                    <span className="stat-label">Field Mappings</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{mapper.transformations ? mapper.transformations.length : 0}</span>
                    <span className="stat-label">Transformations</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{mapper.stats.recordsProcessed.toLocaleString()}</span>
                    <span className="stat-label">Records</span>
                  </div>
                </div>
                
                <div className="data-mapper-details">
                  <div className="detail-item">
                    <span className="detail-label">Last Run:</span>
                    <span className="detail-value">{mapper.lastRun ? timeAgo(mapper.lastRun) : 'Never'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Success Rate:</span>
                    <span className="detail-value">{mapper.stats.successRate}%</span>
                  </div>
                </div>
                
                <div className="data-mapper-actions">
                  <button 
                    className="action-btn"
                    onClick={() => {
                      setSelectedDataMapper(mapper);
                      // In a real implementation, this would open the mapper editor
                      addNotification({
                        id: Date.now(),
                        title: 'Edit Data Mapper',
                        message: `Opening mapper editor for "${mapper.name}"`,
                        type: 'info',
                        time: new Date().toLocaleTimeString()
                      });
                    }}
                  >
                    Edit Mappings
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => {
                      addNotification({
                        id: Date.now(),
                        title: 'Running Mapper',
                        message: `Running data mapper "${mapper.name}"...`,
                        type: 'info',
                        time: new Date().toLocaleTimeString()
                      });
                      
                      setTimeout(() => {
                        const success = Math.random() > 0.1;
                        
                        setDataMappers(prev => prev.map(m => {
                          if (m.id === mapper.id) {
                            return {
                              ...m,
                              lastRun: Date.now(),
                              stats: {
                                ...m.stats,
                                recordsProcessed: m.stats.recordsProcessed + Math.floor(Math.random() * 100),
                                successRate: success ? 99.5 : 85.3,
                                errorCount: success ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 20 + 10)
                              }
                            };
                          }
                          return m;
                        }));
                        
                        addNotification({
                          id: Date.now(),
                          title: success ? 'Mapper Completed' : 'Mapper Completed with Errors',
                          message: success ? 
                            `Data mapper "${mapper.name}" completed successfully` : 
                            `Data mapper "${mapper.name}" completed with some errors. Check logs for details.`,
                          type: success ? 'success' : 'warning',
                          time: new Date().toLocaleTimeString()
                        });
                      }, 2000);
                    }}
                  >
                    Run Now
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => {
                      setDataMappers(prev => prev.map(m => {
                        if (m.id === mapper.id) {
                          return {
                            ...m,
                            status: m.status === 'active' ? 'inactive' : 'active'
                          };
                        }
                        return m;
                      }));
                      
                      addNotification({
                        id: Date.now(),
                        title: mapper.status === 'active' ? 'Mapper Deactivated' : 'Mapper Activated',
                        message: mapper.status === 'active' ? 
                          `Data mapper "${mapper.name}" has been deactivated` : 
                          `Data mapper "${mapper.name}" has been activated`,
                        type: 'info',
                        time: new Date().toLocaleTimeString()
                      });
                    }}
                  >
                    {mapper.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              No data mappers match the current filters
            </div>
          )}
          
          <div 
            className="data-mapper-card add-new"
            onClick={() => setShowAddDataMapperModal(true)}
          >
            <div className="add-new-content">
              <span className="add-icon">+</span>
              <span>Create New Mapping</span>
            </div>
          </div>
        </div>
        
        {showAddDataMapperModal && (
          <div className="modal-overlay">
            <div className="modal-container" role="dialog" aria-labelledby="add-mapper-title">
              <div className="modal-header">
                <h3 id="add-mapper-title">Create New Data Mapper</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowAddDataMapperModal(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <form ref={dataMapperFormRef} onSubmit={handleAddDataMapper}>
                  <div className="form-group">
                    <label htmlFor="mapper-name">Mapper Name</label>
                    <input 
                      type="text" 
                      id="mapper-name" 
                      name="name"
                      value={dataMapperForm.name}
                      onChange={handleDataMapperFormChange}
                      placeholder="e.g., Salesforce to Lumina Contacts"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="mapper-source">Source System</label>
                    <select 
                      id="mapper-source" 
                      name="sourceSystem"
                      value={dataMapperForm.sourceSystem}
                      onChange={handleDataMapperFormChange}
                      required
                    >
                      <option value="">Select Source System</option>
                      {connections.map(conn => (
                        <option key={conn.id} value={conn.name}>{conn.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="mapper-target">Target System</label>
                    <select 
                      id="mapper-target" 
                      name="targetSystem"
                      value={dataMapperForm.targetSystem}
                      onChange={handleDataMapperFormChange}
                      required
                    >
                      <option value="">Select Target System</option>
                      <option value="Lumina AI">Lumina AI</option>
                      {connections.map(conn => (
                        <option key={conn.id} value={conn.name}>{conn.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-note">
                    After creating the mapper, you'll be able to define field mappings and transformations in the mapper editor.
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowAddDataMapperModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  onClick={() => dataMapperFormRef.current.requestSubmit()}
                >
                  Create Mapper
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render integration tests tab
  const renderTestsTab = () => {
    if (isLoading) {
      return renderLoading();
    }
    
    return (
      <div className="tests-tab">
        <div className="tab-header">
          <h3>Integration Tests</h3>
          <button className="primary-btn">Create New Test</button>
        </div>
        
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="test-status-filter">Status:</label>
            <select 
              id="test-status-filter"
              className="filter-select"
              value={testFilters.status}
              onChange={(e) => handleTestFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="test-connection-filter">Connection:</label>
            <select 
              id="test-connection-filter"
              className="filter-select"
              value={testFilters.connection}
              onChange={(e) => handleTestFilterChange('connection', e.target.value)}
            >
              <option value="all">All Connections</option>
              {connections.map(conn => (
                <option key={conn.id} value={conn.name}>{conn.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group search-group">
            <label htmlFor="test-search">Search:</label>
            <input 
              id="test-search"
              type="text" 
              className="search-input"
              placeholder="Search tests..."
              value={testFilters.search}
              onChange={(e) => handleTestFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        
        <div className="tests-table-container">
          <table className="tests-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Connection</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Run</th>
                <th>Duration</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.length > 0 ? (
                filteredTests.map(test => (
                  <tr key={test.id} className={`test-status-${test.status}`}>
                    <td>{test.name}</td>
                    <td>{test.connection}</td>
                    <td>{test.testType}</td>
                    <td>
                      <span className={`test-status ${test.status}`}>
                        {test.status}
                      </span>
                    </td>
                    <td>{timeAgo(test.lastRun)}</td>
                    <td>{test.duration}s</td>
                    <td>{test.schedule}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-btn small"
                          onClick={() => {
                            setSelectedTest(test);
                            setShowTestResultsModal(true);
                          }}
                        >
                          Results
                        </button>
                        <button 
                          className="action-btn small"
                          onClick={() => handleRunTest(test)}
                        >
                          Run
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-data-row">
                  <td colSpan="8">No tests match the current filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="test-summary">
          <div className="test-summary-grid">
            <div className="summary-card">
              <h4>Total Tests</h4>
              <div className="summary-value">{integrationTests.length}</div>
            </div>
            
            <div className="summary-card">
              <h4>Passed</h4>
              <div className="summary-value success">
                {integrationTests.filter(t => t.status === 'passed').length}
              </div>
            </div>
            
            <div className="summary-card">
              <h4>Failed</h4>
              <div className="summary-value danger">
                {integrationTests.filter(t => t.status === 'failed').length}
              </div>
            </div>
            
            <div className="summary-card">
              <h4>Warnings</h4>
              <div className="summary-value warning">
                {integrationTests.filter(t => t.status === 'warning').length}
              </div>
            </div>
          </div>
        </div>
        
        {showTestResultsModal && selectedTest && (
          <div className="modal-overlay">
            <div className="modal-container test-results-modal" role="dialog" aria-labelledby="test-results-title">
              <div className="modal-header">
                <h3 id="test-results-title">Test Results: {selectedTest.name}</h3>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setShowTestResultsModal(false)}
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="test-result-header">
                  <div className={`test-result-status ${selectedTest.status}`}>
                    {selectedTest.status}
                  </div>
                  <div className="test-result-meta">
                    <span>Run at: {formatTime(selectedTest.lastRun)}</span>
                    <span>Duration: {selectedTest.duration}s</span>
                  </div>
                </div>
                
                <div className="test-result-message">
                  <h4>Result</h4>
                  <p>{selectedTest.results.message}</p>
                </div>
                
                <div className="test-result-details">
                  <h4>Details</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Connection:</span>
                      <span className="detail-value">{selectedTest.connection}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Test Type:</span>
                      <span className="detail-value">{selectedTest.testType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Response Time:</span>
                      <span className="detail-value">{selectedTest.results.responseTime}ms</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Success:</span>
                      <span className="detail-value">{selectedTest.results.success ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="test-result-data">
                  <h4>Response Data</h4>
                  <pre className="response-data">
                    {JSON.stringify(selectedTest.results.details, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="action-btn"
                  onClick={() => handleRunTest(selectedTest)}
                >
                  Run Again
                </button>
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowTestResultsModal(false)}
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
      appTitle="Lumina AI Integration" 
      contentWidth="wide"
    >
      <div className="integration-container">
        <div className="page-header">
          <h1 className="page-title">Integration & Connectivity</h1>
          <div className="page-actions">
            <button 
              className="action-btn"
              onClick={() => {
                addNotification({
                  id: Date.now(),
                  title: 'Refreshing Data',
                  message: 'Refreshing integration data...',
                  type: 'info',
                  time: new Date().toLocaleTimeString()
                });
                
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  addNotification({
                    id: Date.now(),
                    title: 'Data Refreshed',
                    message: 'Integration data has been refreshed',
                    type: 'success',
                    time: new Date().toLocaleTimeString()
                  });
                }, 1000);
              }}
            >
              <span aria-hidden="true">↻</span>
              {!isMobile && <span>Refresh</span>}
            </button>
          </div>
        </div>
        
        <div className="integration-tabs" role="tablist">
          <button 
            className={`tab-btn ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('connections')}
            role="tab"
            aria-selected={activeTab === 'connections'}
            aria-controls="connections-panel"
            id="connections-tab"
          >
            External Connections
          </button>
          <button 
            className={`tab-btn ${activeTab === 'datamappers' ? 'active' : ''}`}
            onClick={() => setActiveTab('datamappers')}
            role="tab"
            aria-selected={activeTab === 'datamappers'}
            aria-controls="datamappers-panel"
            id="datamappers-tab"
          >
            Data Mapping
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
            role="tab"
            aria-selected={activeTab === 'tests'}
            aria-controls="tests-panel"
            id="tests-tab"
          >
            Integration Tests
          </button>
          <button 
            className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
            role="tab"
            aria-selected={activeTab === 'api'}
            aria-controls="api-panel"
            id="api-tab"
          >
            API Keys
          </button>
          <button 
            className={`tab-btn ${activeTab === 'webhooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('webhooks')}
            role="tab"
            aria-selected={activeTab === 'webhooks'}
            aria-controls="webhooks-panel"
            id="webhooks-tab"
          >
            Webhooks
          </button>
        </div>
        
        <div 
          className="integration-content"
          role="tabpanel"
          id={`${activeTab}-panel`}
          aria-labelledby={`${activeTab}-tab`}
        >
          {activeTab === 'connections' && renderConnectionsTab()}
          {activeTab === 'datamappers' && renderDataMappersTab()}
          {activeTab === 'tests' && renderTestsTab()}
          {activeTab === 'api' && renderApiKeysTab()}
          {activeTab === 'webhooks' && renderWebhooksTab()}
        </div>
      </div>
    </CoreUIFramework>
  );
};

IntegrationInterface.propTypes = {
  userId: PropTypes.string
};

export default IntegrationInterface;
