import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CoreUIFramework, { useUI } from '../core/CoreUIFramework';
import { useIsMobile, useIsTablet } from '../core/hooks/useMediaQuery';
import './styles/ConfigurationInterface.css';

/**
 * Enhanced Configuration Interface for Lumina AI
 * Provides a unified interface for configuring all aspects of the system
 * with improved accessibility, responsiveness, and visual design
 */
const ConfigurationInterface = ({ userId }) => {
  const { addNotification, theme, reducedMotion } = useUI();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const [activeTab, setActiveTab] = useState('deployment');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState(null);
  
  // Configuration sections
  const configSections = {
    deployment: {
      title: 'Deployment Configuration',
      description: 'Configure deployment settings for Lumina AI components across different environments',
      icon: '🚀'
    },
    providers: {
      title: 'Provider Integration',
      description: 'Configure AI provider settings, credentials, and selection strategies',
      icon: '🔌'
    },
    governance: {
      title: 'Ethical AI Governance',
      description: 'Configure governance policies, compliance settings, and safety thresholds',
      icon: '⚖️'
    },
    security: {
      title: 'Security Settings',
      description: 'Configure authentication, authorization, and data protection settings',
      icon: '🔒'
    }
  };
  
  // Handle tab change with unsaved changes check
  const handleTabChange = (tab) => {
    if (hasChanges) {
      setPendingTabChange(tab);
      setShowUnsavedChangesModal(true);
    } else {
      setActiveTab(tab);
    }
  };
  
  // Confirm tab change and discard changes
  const confirmTabChange = () => {
    setHasChanges(false);
    setActiveTab(pendingTabChange);
    setShowUnsavedChangesModal(false);
  };
  
  // Cancel tab change
  const cancelTabChange = () => {
    setPendingTabChange(null);
    setShowUnsavedChangesModal(false);
  };
  
  // Notify about saved changes
  const notifySaved = (section) => {
    addNotification({
      id: Date.now(),
      title: 'Configuration Saved',
      message: `${configSections[section].title} has been updated successfully.`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    setHasChanges(false);
  };
  
  // Render the active configuration section
  const renderConfigSection = () => {
    if (isLoading) {
      return (
        <div className="config-loading">
          <div className="loading-spinner"></div>
          <p>Loading configuration...</p>
        </div>
      );
    }
    
    switch(activeTab) {
      case 'deployment':
        return <DeploymentConfig onSave={() => notifySaved('deployment')} onChanges={setHasChanges} />;
      case 'providers':
        return <ProviderConfig onSave={() => notifySaved('providers')} onChanges={setHasChanges} />;
      case 'governance':
        return <GovernanceConfig onSave={() => notifySaved('governance')} onChanges={setHasChanges} />;
      case 'security':
        return <SecurityConfig onSave={() => notifySaved('security')} onChanges={setHasChanges} />;
      default:
        return <DeploymentConfig onSave={() => notifySaved('deployment')} onChanges={setHasChanges} />;
    }
  };
  
  // Render unsaved changes modal
  const renderUnsavedChangesModal = () => {
    if (!showUnsavedChangesModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container" role="dialog" aria-labelledby="unsaved-changes-title">
          <div className="modal-header">
            <h3 id="unsaved-changes-title">Unsaved Changes</h3>
            <button className="modal-close-btn" onClick={cancelTabChange} aria-label="Close dialog">×</button>
          </div>
          <div className="modal-content">
            <p>You have unsaved changes. Do you want to discard them and continue?</p>
          </div>
          <div className="modal-footer">
            <button className="secondary-btn" onClick={cancelTabChange}>Cancel</button>
            <button className="danger-btn" onClick={confirmTabChange}>Discard Changes</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <CoreUIFramework 
      appTitle="Lumina AI Configuration" 
      contentWidth="wide"
    >
      <div className="config-container">
        <div className="config-header">
          <h1 className="config-title">System Configuration</h1>
          <div className="config-actions">
            <button 
              className="help-btn" 
              aria-label="Configuration help"
              onClick={() => window.open('/help/configuration', '_blank')}
            >
              <span aria-hidden="true">❓</span>
              {!isMobile && <span>Help</span>}
            </button>
          </div>
        </div>
        
        {/* Configuration Tabs */}
        <div className="config-tabs-container">
          <div className="config-tabs" role="tablist">
            {Object.keys(configSections).map(key => (
              <button 
                key={key}
                id={`tab-${key}`}
                className={`config-tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => handleTabChange(key)}
                role="tab"
                aria-selected={activeTab === key}
                aria-controls={`panel-${key}`}
              >
                <span className="tab-icon" aria-hidden="true">{configSections[key].icon}</span>
                <span className="tab-text">{configSections[key].title}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Active Section Description */}
        <div className="section-description">
          <h2>{configSections[activeTab].title}</h2>
          <p>{configSections[activeTab].description}</p>
        </div>
        
        {/* Configuration Content */}
        <div 
          id={`panel-${activeTab}`}
          className="config-content"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {renderConfigSection()}
        </div>
        
        {renderUnsavedChangesModal()}
      </div>
    </CoreUIFramework>
  );
};

// Deployment Configuration Component
const DeploymentConfig = ({ onSave, onChanges }) => {
  const { addNotification } = useUI();
  const [environments, setEnvironments] = useState([
    { id: 1, name: 'Development', status: 'active', components: 5, lastDeployed: '2025-04-22T14:30:00Z' },
    { id: 2, name: 'Staging', status: 'active', components: 5, lastDeployed: '2025-04-21T10:15:00Z' },
    { id: 3, name: 'Production', status: 'active', components: 5, lastDeployed: '2025-04-20T08:45:00Z' }
  ]);
  const [pipelineConfig, setPipelineConfig] = useState({
    cicdIntegration: 'github',
    deploymentStrategy: 'blue-green',
    autoScaling: true,
    rollbackEnabled: true,
    healthCheckEnabled: true
  });
  const [showAddEnvironmentModal, setShowAddEnvironmentModal] = useState(false);
  const [newEnvironment, setNewEnvironment] = useState({ name: '', components: 5 });
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [showEnvironmentDetails, setShowEnvironmentDetails] = useState(false);
  
  // Notify parent component about changes
  useEffect(() => {
    onChanges(true);
  }, [environments, pipelineConfig, onChanges]);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Handle pipeline config change
  const handlePipelineConfigChange = (field, value) => {
    setPipelineConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle add environment
  const handleAddEnvironment = () => {
    if (!newEnvironment.name.trim()) {
      addNotification({
        id: Date.now(),
        title: 'Validation Error',
        message: 'Environment name is required',
        type: 'error',
        time: new Date().toLocaleTimeString()
      });
      return;
    }
    
    const newId = Math.max(...environments.map(env => env.id), 0) + 1;
    const environment = {
      id: newId,
      name: newEnvironment.name,
      status: 'inactive',
      components: newEnvironment.components,
      lastDeployed: null
    };
    
    setEnvironments(prev => [...prev, environment]);
    setNewEnvironment({ name: '', components: 5 });
    setShowAddEnvironmentModal(false);
    
    addNotification({
      id: Date.now(),
      title: 'Environment Added',
      message: `${environment.name} environment has been added`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Handle environment selection
  const handleEnvironmentSelect = (environment) => {
    setSelectedEnvironment(environment);
    setShowEnvironmentDetails(true);
  };
  
  // Handle save
  const handleSave = () => {
    // In a real implementation, this would save to the backend
    onSave();
    
    addNotification({
      id: Date.now(),
      title: 'Deployment Configuration Saved',
      message: 'Your deployment configuration has been updated',
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Render environment details modal
  const renderEnvironmentDetailsModal = () => {
    if (!showEnvironmentDetails || !selectedEnvironment) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container environment-details-modal" role="dialog" aria-labelledby="environment-details-title">
          <div className="modal-header">
            <h3 id="environment-details-title">{selectedEnvironment.name} Environment</h3>
            <button className="modal-close-btn" onClick={() => setShowEnvironmentDetails(false)} aria-label="Close dialog">×</button>
          </div>
          <div className="modal-content">
            <div className="environment-details-grid">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`detail-value status-${selectedEnvironment.status}`}>{selectedEnvironment.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Components</span>
                <span className="detail-value">{selectedEnvironment.components}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Deployed</span>
                <span className="detail-value">{selectedEnvironment.lastDeployed ? formatDate(selectedEnvironment.lastDeployed) : 'Never'}</span>
              </div>
            </div>
            
            <div className="environment-components">
              <h4>Deployed Components</h4>
              <ul className="component-list">
                <li className="component-item">
                  <span className="component-name">Deployment Service</span>
                  <span className="component-version">v1.2.3</span>
                  <span className="component-status status-active">Active</span>
                </li>
                <li className="component-item">
                  <span className="component-name">Provider Service</span>
                  <span className="component-version">v1.1.5</span>
                  <span className="component-status status-active">Active</span>
                </li>
                <li className="component-item">
                  <span className="component-name">Governance Service</span>
                  <span className="component-version">v1.0.8</span>
                  <span className="component-status status-active">Active</span>
                </li>
                <li className="component-item">
                  <span className="component-name">Workflow Service</span>
                  <span className="component-version">v1.3.1</span>
                  <span className="component-status status-active">Active</span>
                </li>
                <li className="component-item">
                  <span className="component-name">Collaboration Service</span>
                  <span className="component-version">v1.2.0</span>
                  <span className="component-status status-active">Active</span>
                </li>
              </ul>
            </div>
            
            <div className="environment-config-form">
              <h4>Environment Configuration</h4>
              <div className="form-group">
                <label htmlFor="env-name">Environment Name</label>
                <input 
                  type="text" 
                  id="env-name" 
                  className="form-control" 
                  value={selectedEnvironment.name}
                  onChange={(e) => setSelectedEnvironment(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="env-status">Status</label>
                <select 
                  id="env-status" 
                  className="form-control"
                  value={selectedEnvironment.status}
                  onChange={(e) => setSelectedEnvironment(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="env-components">Components</label>
                <input 
                  type="number" 
                  id="env-components" 
                  className="form-control" 
                  value={selectedEnvironment.components}
                  onChange={(e) => setSelectedEnvironment(prev => ({ ...prev, components: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="secondary-btn" onClick={() => setShowEnvironmentDetails(false)}>Cancel</button>
            <button className="primary-btn" onClick={() => {
              setEnvironments(prev => prev.map(env => env.id === selectedEnvironment.id ? selectedEnvironment : env));
              setShowEnvironmentDetails(false);
              addNotification({
                id: Date.now(),
                title: 'Environment Updated',
                message: `${selectedEnvironment.name} environment has been updated`,
                type: 'success',
                time: new Date().toLocaleTimeString()
              });
            }}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render add environment modal
  const renderAddEnvironmentModal = () => {
    if (!showAddEnvironmentModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container" role="dialog" aria-labelledby="add-environment-title">
          <div className="modal-header">
            <h3 id="add-environment-title">Add New Environment</h3>
            <button className="modal-close-btn" onClick={() => setShowAddEnvironmentModal(false)} aria-label="Close dialog">×</button>
          </div>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="new-env-name">Environment Name</label>
              <input 
                type="text" 
                id="new-env-name" 
                className="form-control" 
                value={newEnvironment.name}
                onChange={(e) => setNewEnvironment(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., QA, Testing, Demo"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="new-env-components">Number of Components</label>
              <input 
                type="number" 
                id="new-env-components" 
                className="form-control" 
                value={newEnvironment.components}
                onChange={(e) => setNewEnvironment(prev => ({ ...prev, components: parseInt(e.target.value) || 0 }))}
                min="1"
                max="10"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="secondary-btn" onClick={() => setShowAddEnvironmentModal(false)}>Cancel</button>
            <button className="primary-btn" onClick={handleAddEnvironment}>Add Environment</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="deployment-config">
      <div className="config-section">
        <div className="section-header">
          <h3>Environments</h3>
          <button 
            className="add-btn"
            onClick={() => setShowAddEnvironmentModal(true)}
            aria-label="Add new environment"
          >
            <span aria-hidden="true">+</span> Add Environment
          </button>
        </div>
        
        <div className="environment-list">
          {environments.map(env => (
            <div key={env.id} className="environment-card">
              <div className="env-header">
                <h4>{env.name}</h4>
                <span className={`env-status status-${env.status}`}>{env.status}</span>
              </div>
              <div className="env-details">
                <p>Components: {env.components}</p>
                <p>Last Deployed: {env.lastDeployed ? formatDate(env.lastDeployed) : 'Never'}</p>
                <div className="env-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleEnvironmentSelect(env)}
                    aria-label={`Configure ${env.name} environment`}
                  >
                    Configure
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => {
                      addNotification({
                        id: Date.now(),
                        title: 'Deployment Started',
                        message: `Deployment to ${env.name} environment has been initiated`,
                        type: 'info',
                        time: new Date().toLocaleTimeString()
                      });
                    }}
                    aria-label={`Deploy to ${env.name} environment`}
                  >
                    Deploy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="config-section">
        <h3>Pipeline Configuration</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cicd-integration">CI/CD Integration</label>
            <select 
              id="cicd-integration" 
              className="form-control"
              value={pipelineConfig.cicdIntegration}
              onChange={(e) => handlePipelineConfigChange('cicdIntegration', e.target.value)}
            >
              <option value="github">GitHub Actions</option>
              <option value="jenkins">Jenkins</option>
              <option value="gitlab">GitLab CI</option>
              <option value="azure">Azure DevOps</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="deployment-strategy">Deployment Strategy</label>
            <select 
              id="deployment-strategy" 
              className="form-control"
              value={pipelineConfig.deploymentStrategy}
              onChange={(e) => handlePipelineConfigChange('deploymentStrategy', e.target.value)}
            >
              <option value="blue-green">Blue/Green Deployment</option>
              <option value="canary">Canary Deployment</option>
              <option value="rolling">Rolling Deployment</option>
            </select>
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="auto-scaling">Auto-scaling</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="auto-scaling" 
                checked={pipelineConfig.autoScaling}
                onChange={(e) => handlePipelineConfigChange('autoScaling', e.target.checked)}
              />
              <label htmlFor="auto-scaling"></label>
            </div>
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="rollback-enabled">Automatic Rollback</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="rollback-enabled" 
                checked={pipelineConfig.rollbackEnabled}
                onChange={(e) => handlePipelineConfigChange('rollbackEnabled', e.target.checked)}
              />
              <label htmlFor="rollback-enabled"></label>
            </div>
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="health-check-enabled">Health Checks</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="health-check-enabled" 
                checked={pipelineConfig.healthCheckEnabled}
                onChange={(e) => handlePipelineConfigChange('healthCheckEnabled', e.target.checked)}
              />
              <label htmlFor="health-check-enabled"></label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="config-actions-footer">
        <button className="secondary-btn" onClick={() => onChanges(false)}>Reset</button>
        <button className="primary-btn" onClick={handleSave}>Save Pipeline Configuration</button>
      </div>
      
      {renderAddEnvironmentModal()}
      {renderEnvironmentDetailsModal()}
    </div>
  );
};

// Provider Configuration Component
const ProviderConfig = ({ onSave, onChanges }) => {
  const { addNotification } = useUI();
  const [providers, setProviders] = useState([
    { 
      id: 1, 
      name: 'OpenAI', 
      status: 'connected', 
      models: 8,
      apiKey: '••••••••••••••••••••••••••',
      usage: 78,
      costThisMonth: 1245.67
    },
    { 
      id: 2, 
      name: 'Anthropic', 
      status: 'connected', 
      models: 4,
      apiKey: '••••••••••••••••••••••••••',
      usage: 45,
      costThisMonth: 876.54
    },
    { 
      id: 3, 
      name: 'Google AI', 
      status: 'disconnected', 
      models: 0,
      apiKey: '',
      usage: 0,
      costThisMonth: 0
    }
  ]);
  const [providerStrategy, setProviderStrategy] = useState({
    defaultProvider: 'openai',
    selectionStrategy: 'balanced',
    fallbackEnabled: true,
    costLimit: 5000,
    rateLimitingEnabled: true
  });
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', apiKey: '' });
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProviderDetails, setShowProviderDetails] = useState(false);
  
  // Notify parent component about changes
  useEffect(() => {
    onChanges(true);
  }, [providers, providerStrategy, onChanges]);
  
  // Handle provider strategy change
  const handleStrategyChange = (field, value) => {
    setProviderStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle add provider
  const handleAddProvider = () => {
    if (!newProvider.name.trim() || !newProvider.apiKey.trim()) {
      addNotification({
        id: Date.now(),
        title: 'Validation Error',
        message: 'Provider name and API key are required',
        type: 'error',
        time: new Date().toLocaleTimeString()
      });
      return;
    }
    
    const newId = Math.max(...providers.map(p => p.id), 0) + 1;
    const provider = {
      id: newId,
      name: newProvider.name,
      status: 'connected',
      models: 0,
      apiKey: newProvider.apiKey,
      usage: 0,
      costThisMonth: 0
    };
    
    setProviders(prev => [...prev, provider]);
    setNewProvider({ name: '', apiKey: '' });
    setShowAddProviderModal(false);
    
    addNotification({
      id: Date.now(),
      title: 'Provider Added',
      message: `${provider.name} provider has been added`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Handle provider selection
  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setShowProviderDetails(true);
  };
  
  // Handle connect/disconnect provider
  const handleProviderStatusChange = (providerId, newStatus) => {
    setProviders(prev => prev.map(p => {
      if (p.id === providerId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
    
    const provider = providers.find(p => p.id === providerId);
    
    addNotification({
      id: Date.now(),
      title: newStatus === 'connected' ? 'Provider Connected' : 'Provider Disconnected',
      message: `${provider.name} provider has been ${newStatus === 'connected' ? 'connected' : 'disconnected'}`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Handle save
  const handleSave = () => {
    // In a real implementation, this would save to the backend
    onSave();
    
    addNotification({
      id: Date.now(),
      title: 'Provider Configuration Saved',
      message: 'Your provider configuration has been updated',
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Render provider details modal
  const renderProviderDetailsModal = () => {
    if (!showProviderDetails || !selectedProvider) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container provider-details-modal" role="dialog" aria-labelledby="provider-details-title">
          <div className="modal-header">
            <h3 id="provider-details-title">{selectedProvider.name} Provider</h3>
            <button className="modal-close-btn" onClick={() => setShowProviderDetails(false)} aria-label="Close dialog">×</button>
          </div>
          <div className="modal-content">
            <div className="provider-details-grid">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`detail-value status-${selectedProvider.status}`}>{selectedProvider.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Models</span>
                <span className="detail-value">{selectedProvider.models}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Usage</span>
                <span className="detail-value">{selectedProvider.usage}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cost This Month</span>
                <span className="detail-value">${selectedProvider.costThisMonth.toFixed(2)}</span>
              </div>
            </div>
            
            {selectedProvider.status === 'connected' && (
              <div className="provider-models">
                <h4>Available Models</h4>
                <ul className="model-list">
                  {selectedProvider.name === 'OpenAI' && (
                    <>
                      <li className="model-item">
                        <span className="model-name">GPT-4o</span>
                        <span className="model-type">Chat</span>
                        <span className="model-status status-active">Active</span>
                      </li>
                      <li className="model-item">
                        <span className="model-name">GPT-4-turbo</span>
                        <span className="model-type">Chat</span>
                        <span className="model-status status-active">Active</span>
                      </li>
                      <li className="model-item">
                        <span className="model-name">GPT-3.5-turbo</span>
                        <span className="model-type">Chat</span>
                        <span className="model-status status-active">Active</span>
                      </li>
                    </>
                  )}
                  {selectedProvider.name === 'Anthropic' && (
                    <>
                      <li className="model-item">
                        <span className="model-name">Claude 3 Opus</span>
                        <span className="model-type">Chat</span>
                        <span className="model-status status-active">Active</span>
                      </li>
                      <li className="model-item">
                        <span className="model-name">Claude 3 Sonnet</span>
                        <span className="model-type">Chat</span>
                        <span className="model-status status-active">Active</span>
                      </li>
                      <li className="model-item">
                        <span className="model-name">Claude 3 Haiku</span>
                        <span className="model-type">Chat</span>
                        <span className="model-status status-active">Active</span>
                      </li>
                    </>
                  )}
                  {selectedProvider.name !== 'OpenAI' && selectedProvider.name !== 'Anthropic' && (
                    <li className="no-models">No models available</li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="provider-config-form">
              <h4>Provider Configuration</h4>
              <div className="form-group">
                <label htmlFor="provider-name">Provider Name</label>
                <input 
                  type="text" 
                  id="provider-name" 
                  className="form-control" 
                  value={selectedProvider.name}
                  onChange={(e) => setSelectedProvider(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="api-key">API Key</label>
                <div className="input-with-action">
                  <input 
                    type="password" 
                    id="api-key" 
                    className="form-control" 
                    value={selectedProvider.apiKey}
                    onChange={(e) => setSelectedProvider(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                  <button className="input-action-btn" aria-label="Show API key">👁️</button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="cost-limit">Monthly Cost Limit ($)</label>
                <input 
                  type="number" 
                  id="cost-limit" 
                  className="form-control" 
                  value={selectedProvider.costLimit || 5000}
                  onChange={(e) => setSelectedProvider(prev => ({ ...prev, costLimit: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="secondary-btn" onClick={() => setShowProviderDetails(false)}>Cancel</button>
            <button className="primary-btn" onClick={() => {
              setProviders(prev => prev.map(p => p.id === selectedProvider.id ? selectedProvider : p));
              setShowProviderDetails(false);
              addNotification({
                id: Date.now(),
                title: 'Provider Updated',
                message: `${selectedProvider.name} provider has been updated`,
                type: 'success',
                time: new Date().toLocaleTimeString()
              });
            }}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render add provider modal
  const renderAddProviderModal = () => {
    if (!showAddProviderModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container" role="dialog" aria-labelledby="add-provider-title">
          <div className="modal-header">
            <h3 id="add-provider-title">Add New Provider</h3>
            <button className="modal-close-btn" onClick={() => setShowAddProviderModal(false)} aria-label="Close dialog">×</button>
          </div>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="new-provider-name">Provider Name</label>
              <input 
                type="text" 
                id="new-provider-name" 
                className="form-control" 
                value={newProvider.name}
                onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Cohere, Mistral AI"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="new-api-key">API Key</label>
              <input 
                type="password" 
                id="new-api-key" 
                className="form-control" 
                value={newProvider.apiKey}
                onChange={(e) => setNewProvider(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter API key"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="secondary-btn" onClick={() => setShowAddProviderModal(false)}>Cancel</button>
            <button className="primary-btn" onClick={handleAddProvider}>Add Provider</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="provider-config">
      <div className="config-section">
        <div className="section-header">
          <h3>AI Providers</h3>
          <button 
            className="add-btn"
            onClick={() => setShowAddProviderModal(true)}
            aria-label="Add new provider"
          >
            <span aria-hidden="true">+</span> Add Provider
          </button>
        </div>
        
        <div className="provider-list">
          {providers.map(provider => (
            <div key={provider.id} className="provider-card">
              <div className="provider-header">
                <h4>{provider.name}</h4>
                <span className={`provider-status status-${provider.status}`}>
                  {provider.status}
                </span>
              </div>
              <div className="provider-details">
                <div className="provider-info">
                  <p>Available Models: {provider.models}</p>
                  {provider.status === 'connected' && (
                    <>
                      <p>Usage: {provider.usage}%</p>
                      <p>Cost: ${provider.costThisMonth.toFixed(2)}</p>
                    </>
                  )}
                </div>
                <div className="provider-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleProviderSelect(provider)}
                    aria-label={`Configure ${provider.name} provider`}
                  >
                    Configure
                  </button>
                  {provider.status === 'connected' ? (
                    <button 
                      className="action-btn danger"
                      onClick={() => handleProviderStatusChange(provider.id, 'disconnected')}
                      aria-label={`Disconnect ${provider.name} provider`}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button 
                      className="action-btn success"
                      onClick={() => handleProviderStatusChange(provider.id, 'connected')}
                      aria-label={`Connect ${provider.name} provider`}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="config-section">
        <h3>Provider Selection Strategy</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="default-provider">Default Provider</label>
            <select 
              id="default-provider" 
              className="form-control"
              value={providerStrategy.defaultProvider}
              onChange={(e) => handleStrategyChange('defaultProvider', e.target.value)}
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google AI</option>
              {providers.filter(p => 
                p.name !== 'OpenAI' && 
                p.name !== 'Anthropic' && 
                p.name !== 'Google AI' &&
                p.status === 'connected'
              ).map(p => (
                <option key={p.id} value={p.name.toLowerCase().replace(/\s+/g, '-')}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="selection-strategy">Selection Strategy</label>
            <select 
              id="selection-strategy" 
              className="form-control"
              value={providerStrategy.selectionStrategy}
              onChange={(e) => handleStrategyChange('selectionStrategy', e.target.value)}
            >
              <option value="cost">Cost Optimization</option>
              <option value="performance">Performance Priority</option>
              <option value="balanced">Balanced</option>
              <option value="reliability">Reliability First</option>
            </select>
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="fallback-enabled">Fallback Enabled</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="fallback-enabled" 
                checked={providerStrategy.fallbackEnabled}
                onChange={(e) => handleStrategyChange('fallbackEnabled', e.target.checked)}
              />
              <label htmlFor="fallback-enabled"></label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cost-limit">Monthly Cost Limit ($)</label>
            <input 
              type="number" 
              id="cost-limit" 
              className="form-control"
              value={providerStrategy.costLimit}
              onChange={(e) => handleStrategyChange('costLimit', parseFloat(e.target.value) || 0)}
              min="0"
              step="100"
            />
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="rate-limiting">Rate Limiting</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="rate-limiting" 
                checked={providerStrategy.rateLimitingEnabled}
                onChange={(e) => handleStrategyChange('rateLimitingEnabled', e.target.checked)}
              />
              <label htmlFor="rate-limiting"></label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="config-actions-footer">
        <button className="secondary-btn" onClick={() => onChanges(false)}>Reset</button>
        <button className="primary-btn" onClick={handleSave}>Save Provider Strategy</button>
      </div>
      
      {renderAddProviderModal()}
      {renderProviderDetailsModal()}
    </div>
  );
};

// Governance Configuration Component
const GovernanceConfig = ({ onSave, onChanges }) => {
  const { addNotification } = useUI();
  const [policies, setPolicies] = useState([
    { id: 1, name: 'Content Safety', status: 'active', region: 'Global', lastUpdated: '2025-04-15T10:30:00Z' },
    { id: 2, name: 'Data Privacy', status: 'active', region: 'EU', lastUpdated: '2025-04-10T14:45:00Z' },
    { id: 3, name: 'Transparency', status: 'active', region: 'Global', lastUpdated: '2025-04-05T09:15:00Z' }
  ]);
  const [complianceSettings, setComplianceSettings] = useState({
    contentEvaluationThreshold: 'standard',
    auditLogging: true,
    humanReview: 'critical',
    dataRetention: 90,
    anonymizationEnabled: true
  });
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ name: '', region: 'Global' });
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  
  // Notify parent component about changes
  useEffect(() => {
    onChanges(true);
  }, [policies, complianceSettings, onChanges]);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Handle compliance settings change
  const handleComplianceSettingsChange = (field, value) => {
    setComplianceSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle add policy
  const handleAddPolicy = () => {
    if (!newPolicy.name.trim()) {
      addNotification({
        id: Date.now(),
        title: 'Validation Error',
        message: 'Policy name is required',
        type: 'error',
        time: new Date().toLocaleTimeString()
      });
      return;
    }
    
    const newId = Math.max(...policies.map(p => p.id), 0) + 1;
    const policy = {
      id: newId,
      name: newPolicy.name,
      status: 'active',
      region: newPolicy.region,
      lastUpdated: new Date().toISOString()
    };
    
    setPolicies(prev => [...prev, policy]);
    setNewPolicy({ name: '', region: 'Global' });
    setShowAddPolicyModal(false);
    
    addNotification({
      id: Date.now(),
      title: 'Policy Added',
      message: `${policy.name} policy has been added`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Handle policy selection
  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyDetails(true);
  };
  
  // Handle policy status change
  const handlePolicyStatusChange = (policyId, newStatus) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        return { ...p, status: newStatus, lastUpdated: new Date().toISOString() };
      }
      return p;
    }));
    
    const policy = policies.find(p => p.id === policyId);
    
    addNotification({
      id: Date.now(),
      title: newStatus === 'active' ? 'Policy Enabled' : 'Policy Disabled',
      message: `${policy.name} policy has been ${newStatus === 'active' ? 'enabled' : 'disabled'}`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Handle save
  const handleSave = () => {
    // In a real implementation, this would save to the backend
    onSave();
    
    addNotification({
      id: Date.now(),
      title: 'Governance Configuration Saved',
      message: 'Your governance configuration has been updated',
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Render policy details modal
  const renderPolicyDetailsModal = () => {
    if (!showPolicyDetails || !selectedPolicy) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container policy-details-modal" role="dialog" aria-labelledby="policy-details-title">
          <div className="modal-header">
            <h3 id="policy-details-title">{selectedPolicy.name} Policy</h3>
            <button className="modal-close-btn" onClick={() => setShowPolicyDetails(false)} aria-label="Close dialog">×</button>
          </div>
          <div className="modal-content">
            <div className="policy-details-grid">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`detail-value status-${selectedPolicy.status}`}>{selectedPolicy.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Region</span>
                <span className="detail-value">{selectedPolicy.region}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">{formatDate(selectedPolicy.lastUpdated)}</span>
              </div>
            </div>
            
            <div className="policy-config-form">
              <h4>Policy Configuration</h4>
              <div className="form-group">
                <label htmlFor="policy-name">Policy Name</label>
                <input 
                  type="text" 
                  id="policy-name" 
                  className="form-control" 
                  value={selectedPolicy.name}
                  onChange={(e) => setSelectedPolicy(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="policy-region">Region</label>
                <select 
                  id="policy-region" 
                  className="form-control"
                  value={selectedPolicy.region}
                  onChange={(e) => setSelectedPolicy(prev => ({ ...prev, region: e.target.value }))}
                >
                  <option value="Global">Global</option>
                  <option value="US">United States</option>
                  <option value="EU">European Union</option>
                  <option value="APAC">Asia Pacific</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="policy-status">Status</label>
                <select 
                  id="policy-status" 
                  className="form-control"
                  value={selectedPolicy.status}
                  onChange={(e) => setSelectedPolicy(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {selectedPolicy.name === 'Content Safety' && (
                <div className="policy-specific-settings">
                  <h4>Content Safety Settings</h4>
                  <div className="form-group">
                    <label htmlFor="safety-threshold">Safety Threshold</label>
                    <select 
                      id="safety-threshold" 
                      className="form-control"
                      defaultValue="medium"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="form-group toggle-group">
                    <label htmlFor="content-filtering">Content Filtering</label>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="content-filtering" 
                        defaultChecked={true}
                      />
                      <label htmlFor="content-filtering"></label>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedPolicy.name === 'Data Privacy' && (
                <div className="policy-specific-settings">
                  <h4>Data Privacy Settings</h4>
                  <div className="form-group">
                    <label htmlFor="data-retention">Data Retention (days)</label>
                    <input 
                      type="number" 
                      id="data-retention" 
                      className="form-control" 
                      defaultValue={90}
                      min="1"
                      max="365"
                    />
                  </div>
                  <div className="form-group toggle-group">
                    <label htmlFor="data-anonymization">Data Anonymization</label>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="data-anonymization" 
                        defaultChecked={true}
                      />
                      <label htmlFor="data-anonymization"></label>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedPolicy.name === 'Transparency' && (
                <div className="policy-specific-settings">
                  <h4>Transparency Settings</h4>
                  <div className="form-group toggle-group">
                    <label htmlFor="model-attribution">Model Attribution</label>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="model-attribution" 
                        defaultChecked={true}
                      />
                      <label htmlFor="model-attribution"></label>
                    </div>
                  </div>
                  <div className="form-group toggle-group">
                    <label htmlFor="confidence-scores">Confidence Scores</label>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="confidence-scores" 
                        defaultChecked={true}
                      />
                      <label htmlFor="confidence-scores"></label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button className="secondary-btn" onClick={() => setShowPolicyDetails(false)}>Cancel</button>
            <button className="primary-btn" onClick={() => {
              setPolicies(prev => prev.map(p => p.id === selectedPolicy.id ? { ...selectedPolicy, lastUpdated: new Date().toISOString() } : p));
              setShowPolicyDetails(false);
              addNotification({
                id: Date.now(),
                title: 'Policy Updated',
                message: `${selectedPolicy.name} policy has been updated`,
                type: 'success',
                time: new Date().toLocaleTimeString()
              });
            }}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render add policy modal
  const renderAddPolicyModal = () => {
    if (!showAddPolicyModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container" role="dialog" aria-labelledby="add-policy-title">
          <div className="modal-header">
            <h3 id="add-policy-title">Add New Policy</h3>
            <button className="modal-close-btn" onClick={() => setShowAddPolicyModal(false)} aria-label="Close dialog">×</button>
          </div>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="new-policy-name">Policy Name</label>
              <input 
                type="text" 
                id="new-policy-name" 
                className="form-control" 
                value={newPolicy.name}
                onChange={(e) => setNewPolicy(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., GDPR Compliance, HIPAA Compliance"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="new-policy-region">Region</label>
              <select 
                id="new-policy-region" 
                className="form-control"
                value={newPolicy.region}
                onChange={(e) => setNewPolicy(prev => ({ ...prev, region: e.target.value }))}
              >
                <option value="Global">Global</option>
                <option value="US">United States</option>
                <option value="EU">European Union</option>
                <option value="APAC">Asia Pacific</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="secondary-btn" onClick={() => setShowAddPolicyModal(false)}>Cancel</button>
            <button className="primary-btn" onClick={handleAddPolicy}>Add Policy</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="governance-config">
      <div className="config-section">
        <div className="section-header">
          <h3>Governance Policies</h3>
          <button 
            className="add-btn"
            onClick={() => setShowAddPolicyModal(true)}
            aria-label="Add new policy"
          >
            <span aria-hidden="true">+</span> Add Policy
          </button>
        </div>
        
        <div className="policy-list">
          {policies.map(policy => (
            <div key={policy.id} className="policy-card">
              <div className="policy-header">
                <h4>{policy.name}</h4>
                <span className={`policy-status status-${policy.status}`}>
                  {policy.status}
                </span>
              </div>
              <div className="policy-details">
                <div className="policy-info">
                  <p>Region: {policy.region}</p>
                  <p>Last Updated: {formatDate(policy.lastUpdated)}</p>
                </div>
                <div className="policy-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handlePolicySelect(policy)}
                    aria-label={`Edit ${policy.name} policy`}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handlePolicyStatusChange(policy.id, policy.status === 'active' ? 'inactive' : 'active')}
                    aria-label={policy.status === 'active' ? `Disable ${policy.name} policy` : `Enable ${policy.name} policy`}
                  >
                    {policy.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="config-section">
        <h3>Compliance Settings</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="content-evaluation">Content Evaluation Threshold</label>
            <select 
              id="content-evaluation" 
              className="form-control"
              value={complianceSettings.contentEvaluationThreshold}
              onChange={(e) => handleComplianceSettingsChange('contentEvaluationThreshold', e.target.value)}
            >
              <option value="strict">Strict</option>
              <option value="standard">Standard</option>
              <option value="permissive">Permissive</option>
            </select>
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="audit-logging">Audit Logging</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="audit-logging" 
                checked={complianceSettings.auditLogging}
                onChange={(e) => handleComplianceSettingsChange('auditLogging', e.target.checked)}
              />
              <label htmlFor="audit-logging"></label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="human-review">Human Review Required</label>
            <select 
              id="human-review" 
              className="form-control"
              value={complianceSettings.humanReview}
              onChange={(e) => handleComplianceSettingsChange('humanReview', e.target.value)}
            >
              <option value="critical">For Critical Operations Only</option>
              <option value="all">For All Operations</option>
              <option value="none">None</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="data-retention">Data Retention Period (days)</label>
            <input 
              type="number" 
              id="data-retention" 
              className="form-control"
              value={complianceSettings.dataRetention}
              onChange={(e) => handleComplianceSettingsChange('dataRetention', parseInt(e.target.value) || 0)}
              min="1"
              max="365"
            />
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="anonymization">Data Anonymization</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="anonymization" 
                checked={complianceSettings.anonymizationEnabled}
                onChange={(e) => handleComplianceSettingsChange('anonymizationEnabled', e.target.checked)}
              />
              <label htmlFor="anonymization"></label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="config-actions-footer">
        <button className="secondary-btn" onClick={() => onChanges(false)}>Reset</button>
        <button className="primary-btn" onClick={handleSave}>Save Compliance Settings</button>
      </div>
      
      {renderAddPolicyModal()}
      {renderPolicyDetailsModal()}
    </div>
  );
};

// Security Configuration Component
const SecurityConfig = ({ onSave, onChanges }) => {
  const { addNotification } = useUI();
  const [securitySettings, setSecuritySettings] = useState({
    authMethod: 'oauth',
    mfaEnabled: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    ipRestriction: false,
    encryptionLevel: 'high'
  });
  
  // Notify parent component about changes
  useEffect(() => {
    onChanges(true);
  }, [securitySettings, onChanges]);
  
  // Handle security settings change
  const handleSecuritySettingsChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle save
  const handleSave = () => {
    // In a real implementation, this would save to the backend
    onSave();
    
    addNotification({
      id: Date.now(),
      title: 'Security Configuration Saved',
      message: 'Your security configuration has been updated',
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  return (
    <div className="security-config">
      <div className="config-section">
        <h3>Authentication Settings</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="auth-method">Authentication Method</label>
            <select 
              id="auth-method" 
              className="form-control"
              value={securitySettings.authMethod}
              onChange={(e) => handleSecuritySettingsChange('authMethod', e.target.value)}
            >
              <option value="oauth">OAuth 2.0</option>
              <option value="saml">SAML</option>
              <option value="jwt">JWT</option>
              <option value="basic">Basic Auth</option>
            </select>
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="mfa-enabled">Multi-Factor Authentication</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="mfa-enabled" 
                checked={securitySettings.mfaEnabled}
                onChange={(e) => handleSecuritySettingsChange('mfaEnabled', e.target.checked)}
              />
              <label htmlFor="mfa-enabled"></label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="session-timeout">Session Timeout (minutes)</label>
            <input 
              type="number" 
              id="session-timeout" 
              className="form-control"
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecuritySettingsChange('sessionTimeout', parseInt(e.target.value) || 0)}
              min="5"
              max="240"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password-policy">Password Policy</label>
            <select 
              id="password-policy" 
              className="form-control"
              value={securitySettings.passwordPolicy}
              onChange={(e) => handleSecuritySettingsChange('passwordPolicy', e.target.value)}
            >
              <option value="basic">Basic</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="config-section">
        <h3>Access Control</h3>
        <div className="form-grid">
          <div className="form-group toggle-group">
            <label htmlFor="ip-restriction">IP Restriction</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="ip-restriction" 
                checked={securitySettings.ipRestriction}
                onChange={(e) => handleSecuritySettingsChange('ipRestriction', e.target.checked)}
              />
              <label htmlFor="ip-restriction"></label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="encryption-level">Encryption Level</label>
            <select 
              id="encryption-level" 
              className="form-control"
              value={securitySettings.encryptionLevel}
              onChange={(e) => handleSecuritySettingsChange('encryptionLevel', e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="high">High</option>
              <option value="military">Military Grade</option>
            </select>
          </div>
        </div>
        
        {securitySettings.ipRestriction && (
          <div className="ip-whitelist">
            <h4>IP Whitelist</h4>
            <div className="ip-list">
              <div className="ip-item">
                <span className="ip-address">192.168.1.0/24</span>
                <button className="remove-btn" aria-label="Remove IP address">×</button>
              </div>
              <div className="ip-item">
                <span className="ip-address">10.0.0.0/8</span>
                <button className="remove-btn" aria-label="Remove IP address">×</button>
              </div>
            </div>
            <div className="add-ip-form">
              <input type="text" className="form-control" placeholder="Enter IP address or CIDR" />
              <button className="add-btn">Add</button>
            </div>
          </div>
        )}
      </div>
      
      <div className="config-section">
        <h3>API Security</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="api-rate-limit">API Rate Limit (requests per minute)</label>
            <input 
              type="number" 
              id="api-rate-limit" 
              className="form-control"
              defaultValue={100}
              min="10"
              max="1000"
              step="10"
            />
          </div>
          
          <div className="form-group toggle-group">
            <label htmlFor="api-key-rotation">Automatic API Key Rotation</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="api-key-rotation" 
                defaultChecked={true}
              />
              <label htmlFor="api-key-rotation"></label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="api-key-expiry">API Key Expiry (days)</label>
            <input 
              type="number" 
              id="api-key-expiry" 
              className="form-control"
              defaultValue={90}
              min="1"
              max="365"
            />
          </div>
        </div>
      </div>
      
      <div className="config-actions-footer">
        <button className="secondary-btn" onClick={() => onChanges(false)}>Reset</button>
        <button className="primary-btn" onClick={handleSave}>Save Security Settings</button>
      </div>
    </div>
  );
};

ConfigurationInterface.propTypes = {
  userId: PropTypes.string
};

DeploymentConfig.propTypes = {
  onSave: PropTypes.func.isRequired,
  onChanges: PropTypes.func.isRequired
};

ProviderConfig.propTypes = {
  onSave: PropTypes.func.isRequired,
  onChanges: PropTypes.func.isRequired
};

GovernanceConfig.propTypes = {
  onSave: PropTypes.func.isRequired,
  onChanges: PropTypes.func.isRequired
};

SecurityConfig.propTypes = {
  onSave: PropTypes.func.isRequired,
  onChanges: PropTypes.func.isRequired
};

export default ConfigurationInterface;
