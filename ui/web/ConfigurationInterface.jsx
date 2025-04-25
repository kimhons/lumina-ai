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
(Content truncated due to size limit. Use line ranges to read in chunks)