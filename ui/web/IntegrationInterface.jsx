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
  
(Content truncated due to size limit. Use line ranges to read in chunks)