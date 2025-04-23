import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, CircularProgress, Button, Divider, Tooltip, IconButton, Chip } from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  Stop, 
  Visibility, 
  VisibilityOff, 
  Add as AddIcon,
  AutoAwesome as AutoAwesomeIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Storage as StorageIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  BugReport as BugReportIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Layers as LayersIcon
} from '@mui/icons-material';
import '../styles/AutonomousTaskPanel.css';

/**
 * Enhanced AutonomousTaskPanel component provides advanced task autonomy features
 * for complex task execution, decomposition, and tool integration.
 * Updated with improved testing and export capabilities.
 */
const AutonomousTaskPanel = ({
  tasks = [],
  onCreateTask,
  onCancelTask,
  onPauseTask,
  onResumeTask,
  onViewTaskDetails,
  onDecomposeTask,
  onCloneTask,
  onExportTaskResult,
  onTestTaskOutput,
  onShareTask,
  availableTools = [],
  conversationContext = {},
  suggestedTasks = []
}) => {
  // State for task creation
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskParameters, setTaskParameters] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTools, setSelectedTools] = useState([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  // State for task filtering
  const [filter, setFilter] = useState('active'); // 'active', 'completed', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // State for task suggestions
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // State for testing panel
  const [showTestingPanel, setShowTestingPanel] = useState(false);
  const [testingTaskId, setTestingTaskId] = useState(null);
  
  // State for export panel
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [exportTaskId, setExportTaskId] = useState(null);
  const [exportFormat, setExportFormat] = useState('zip');
  
  // Task templates
  const taskTemplates = [
    { id: 'research', name: 'Research', icon: <SearchIcon />, description: 'Research a topic and provide comprehensive information' },
    { id: 'content', name: 'Content Creation', icon: <DescriptionIcon />, description: 'Create content like articles, blog posts, or reports' },
    { id: 'code', name: 'Code Development', icon: <CodeIcon />, description: 'Write, debug, or optimize code' },
    { id: 'data', name: 'Data Analysis', icon: <StorageIcon />, description: 'Analyze data and generate insights' },
    { id: 'website', name: 'Website Creation', icon: <LayersIcon />, description: 'Design and build responsive websites' },
    { id: 'custom', name: 'Custom Task', icon: <SettingsIcon />, description: 'Define a custom task with specific parameters' }
  ];
  
  // Export formats
  const exportFormats = [
    { id: 'zip', name: 'ZIP Archive', description: 'Complete package with all files' },
    { id: 'github', name: 'GitHub Repository', description: 'Push to a new or existing repository' },
    { id: 'docker', name: 'Docker Container', description: 'Containerized application ready to deploy' },
    { id: 'pdf', name: 'PDF Document', description: 'Formatted document with content and code' },
    { id: 'markdown', name: 'Markdown Files', description: 'Documentation and content in markdown format' }
  ];
  
  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Apply status filter
    if (filter === 'active' && !['pending', 'running', 'paused'].includes(task.status)) return false;
    if (filter === 'completed' && !['completed', 'cancelled', 'failed'].includes(task.status)) return false;
    
    // Apply search filter if search is active
    if (isSearching && searchQuery) {
      const query = searchQuery.toLowerCase();
      return task.description.toLowerCase().includes(query) || 
             (task.details?.result?.toLowerCase().includes(query)) ||
             (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)));
    }
    
    return true;
  });
  
  // Handle creating a new task
  const handleCreateTask = () => {
    if (isCreatingTask && taskDescription.trim() && onCreateTask) {
      // Prepare task parameters based on template and selected tools
      const params = {
        ...taskParameters,
        template: selectedTemplate,
        tools: selectedTools,
        isAdvanced: isAdvancedMode
      };
      
      onCreateTask(taskDescription.trim(), params);
      
      // Reset form
      setTaskDescription('');
      setTaskParameters({});
      setSelectedTemplate(null);
      setSelectedTools([]);
      setIsAdvancedMode(false);
      setIsCreatingTask(false);
    } else {
      setIsCreatingTask(true);
    }
  };
  
  // Handle canceling task creation
  const handleCancelCreate = () => {
    setIsCreatingTask(false);
    setTaskDescription('');
    setTaskParameters({});
    setSelectedTemplate(null);
    setSelectedTools([]);
    setIsAdvancedMode(false);
  };
  
  // Handle task action (cancel, pause, resume)
  const handleTaskAction = (taskId, action) => {
    if (action === 'cancel' && onCancelTask) {
      onCancelTask(taskId);
    } else if (action === 'pause' && onPauseTask) {
      onPauseTask(taskId);
    } else if (action === 'resume' && onResumeTask) {
      onResumeTask(taskId);
    } else if (action === 'view' && onViewTaskDetails) {
      onViewTaskDetails(taskId);
    } else if (action === 'decompose' && onDecomposeTask) {
      onDecomposeTask(taskId);
    } else if (action === 'clone' && onCloneTask) {
      onCloneTask(taskId);
    } else if (action === 'export') {
      setExportTaskId(taskId);
      setShowExportPanel(true);
    } else if (action === 'test') {
      setTestingTaskId(taskId);
      setShowTestingPanel(true);
    } else if (action === 'share' && onShareTask) {
      onShareTask(taskId);
    }
  };
  
  // Handle selecting a task template
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    
    // Set default parameters based on template
    switch (templateId) {
      case 'research':
        setTaskParameters({
          depth: 'comprehensive',
          sources: 'multiple',
          format: 'structured'
        });
        // Pre-select appropriate tools for research
        setSelectedTools(['web_search', 'document_analysis']);
        break;
      case 'content':
        setTaskParameters({
          style: 'informative',
          length: 'medium',
          audience: 'general'
        });
        // Pre-select appropriate tools for content creation
        setSelectedTools(['text_generation', 'image_search']);
        break;
      case 'code':
        setTaskParameters({
          language: 'python',
          purpose: 'utility',
          includeTests: true
        });
        // Pre-select appropriate tools for code development
        setSelectedTools(['code_generation', 'code_execution', 'testing_environment']);
        break;
      case 'data':
        setTaskParameters({
          dataType: 'tabular',
          analysisType: 'exploratory',
          visualization: true
        });
        // Pre-select appropriate tools for data analysis
        setSelectedTools(['data_processing', 'chart_generation']);
        break;
      case 'website':
        setTaskParameters({
          framework: 'react',
          responsive: true,
          includeBackend: false
        });
        // Pre-select appropriate tools for website creation
        setSelectedTools(['code_generation', 'preview_environment', 'export_system']);
        break;
      default:
        setTaskParameters({});
        setSelectedTools([]);
    }
  };
  
  // Handle toggling a tool selection
  const handleToggleTool = (toolId) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId) 
        : [...prev, toolId]
    );
  };
  
  // Handle accepting a suggested task
  const handleAcceptSuggestion = (suggestion) => {
    if (onCreateTask) {
      onCreateTask(suggestion.description, suggestion.parameters || {});
    }
  };
  
  // Handle dismissing a suggested task
  const handleDismissSuggestion = (suggestionId) => {
    // In a real implementation, this would call a backend service
    // For now, we'll just hide it from the UI
    setShowSuggestions(false);
  };
  
  // Handle exporting a task result
  const handleExportTask = () => {
    if (onExportTaskResult && exportTaskId) {
      onExportTaskResult(exportTaskId, { format: exportFormat });
      setShowExportPanel(false);
      setExportTaskId(null);
    }
  };
  
  // Handle testing a task output
  const handleTestTask = () => {
    if (onTestTaskOutput && testingTaskId) {
      onTestTaskOutput(testingTaskId);
      // Keep the panel open for testing
    }
  };
  
  // Get status icon based on task status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <CircularProgress size={16} />;
      case 'running':
        return <CircularProgress size={16} />;
      case 'paused':
        return <Pause fontSize="small" />;
      case 'completed':
        return <span className="status-icon completed">✓</span>;
      case 'cancelled':
        return <span className="status-icon cancelled">✕</span>;
      case 'failed':
        return <span className="status-icon failed">!</span>;
      default:
        return null;
    }
  };
  
  // Render task creation form
  const renderTaskCreationForm = () => {
    return (
      <div className="task-creation-form">
        <Typography variant="subtitle2">Create New Task</Typography>
        
        {!selectedTemplate ? (
          <div className="template-selection">
            <Typography variant="caption" color="textSecondary">
              Select a task template:
            </Typography>
            <div className="template-grid">
              {taskTemplates.map(template => (
                <div 
                  key={template.id}
                  className="template-item"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="template-icon">
                    {template.icon}
                  </div>
                  <Typography variant="body2">{template.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {template.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="selected-template">
              <Chip 
                label={taskTemplates.find(t => t.id === selectedTemplate)?.name || 'Custom Task'} 
                onDelete={() => setSelectedTemplate(null)}
                color="primary"
                size="small"
              />
            </div>
            
            <textarea
              placeholder="Describe the task you want Lumina AI to perform autonomously..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={3}
            />
            
            {isAdvancedMode && (
              <div className="advanced-options">
                <Typography variant="caption" fontWeight="bold">
                  Available Tools:
                </Typography>
                <div className="tools-selection">
                  {availableTools.map(tool => (
                    <Chip
                      key={tool.id}
                      label={tool.name}
                      size="small"
                      icon={tool.icon}
                      onClick={() => handleToggleTool(tool.id)}
                      color={selectedTools.includes(tool.id) ? "primary" : "default"}
                      className="tool-chip"
                    />
                  ))}
                </div>
                
                <Typography variant="caption" fontWeight="bold">
                  Task Parameters:
                </Typography>
                <div className="parameters-form">
                  {selectedTemplate === 'research' && (
                    <>
                      <div className="parameter-field">
                        <label>Research Depth:</label>
                        <select
                          value={taskParameters.depth || 'comprehensive'}
                          onChange={(e) => setTaskParameters({...taskParameters, depth: e.target.value})}
                        >
                          <option value="brief">Brief overview</option>
                          <option value="standard">Standard depth</option>
                          <option value="comprehensive">Comprehensive</option>
                          <option value="expert">Expert level</option>
                        </select>
                      </div>
                      <div className="parameter-field">
                        <label>Sources:</label>
                        <select
                          value={taskParameters.sources || 'multiple'}
                          onChange={(e) => setTaskParameters({...taskParameters, sources: e.target.value})}
                        >
                          <option value="quick">Quick search</option>
                          <option value="multiple">Multiple sources</option>
                          <option value="academic">Academic sources</option>
                          <option value="comprehensive">Comprehensive research</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  {selectedTemplate === 'content' && (
                    <>
                      <div className="parameter-field">
                        <label>Content Style:</label>
                        <select
                          value={taskParameters.style || 'informative'}
                          onChange={(e) => setTaskParameters({...taskParameters, style: e.target.value})}
                        >
                          <option value="informative">Informative</option>
                          <option value="persuasive">Persuasive</option>
                          <option value="entertaining">Entertaining</option>
                          <option value="technical">Technical</option>
                        </select>
                      </div>
                      <div className="parameter-field">
                        <label>Length:</label>
                        <select
                          value={taskParameters.length || 'medium'}
                          onChange={(e) => setTaskParameters({...taskParameters, length: e.target.value})}
                        >
                          <option value="short">Short (500 words)</option>
                          <option value="medium">Medium (1000 words)</option>
                          <option value="long">Long (2000+ words)</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  {selectedTemplate === 'code' && (
                    <>
                      <div className="parameter-field">
                        <label>Language:</label>
                        <select
                          value={taskParameters.language || 'python'}
                          onChange={(e) => setTaskParameters({...taskParameters, language: e.target.value})}
                        >
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                          <option value="csharp">C#</option>
                          <option value="cpp">C++</option>
                        </select>
                      </div>
                      <div className="parameter-field">
                        <label>Include Tests:</label>
                        <input
                          type="checkbox"
                          checked={taskParameters.includeTests || false}
                          onChange={(e) => setTaskParameters({...taskParameters, includeTests: e.target.checked})}
                        />
                      </div>
                      <div className="parameter-field">
                        <label>Testing Environment:</label>
                        <input
                          type="checkbox"
                          checked={taskParameters.testingEnvironment || false}
                          onChange={(e) => setTaskParameters({...taskParameters, testingEnvironment: e.target.checked})}
                        />
                      </div>
                    </>
                  )}
                  
                  {selectedTemplate === 'website' && (
                    <>
                      <div className="parameter-field">
                        <label>Framework:</label>
                        <select
                          value={taskParameters.framework || 'react'}
                          onChange={(e) => setTaskParameters({...taskParameters, framework: e.target.value})}
                        >
                          <option value="react">React</option>
                          <option value="vue">Vue</option>
                          <option value="angular">Angular</option>
                          <option value="vanilla">Vanilla JS</option>
                        </select>
                      </div>
                      <div className="parameter-field">
                        <label>Responsive Design:</label>
                        <input
                          type="checkbox"
                          checked={taskParameters.responsive || true}
                          onChange={(e) => setTaskParameters({...taskParameters, responsive: e.target.checked})}
                        />
                      </div>
                      <div className="parameter-field">
                        <label>Include Backend:</label>
                        <input
                          type="checkbox"
                          checked={taskParameters.includeBackend || false}
                          onChange={(e) => setTaskParameters({...taskParameters, includeBackend: e.target.checked})}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="advanced-mode-toggle">
              <button
                className={`toggle-button ${isAdvancedMode ? 'active' : ''}`}
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
              >
                {isAdvancedMode ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
            </div>
            
            <div className="task-form-actions">
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleCreateTask}
                disabled={!taskDescription.trim()}
              >
                Create Task
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCancelCreate}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };
  
  // Render task suggestions
  const renderTaskSuggestions = () => {
    if (!showSuggestions || suggestedTasks.length === 0) return null;
    
    return (
      <div className="task-suggestions">
        <div className="suggestions-header">
          <Typography variant="subtitle2">
            <AutoAwesomeIcon fontSize="small" /> Suggested Tasks
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => setShowSuggestions(false)}
          >
            <VisibilityOff fontSize="small" />
          </IconButton>
        </div>
        
        <div className="suggestion-list">
          {suggestedTasks.map(suggestion => (
            <div key={suggestion.id} className="suggestion-item">
              <div className="suggestion-content">
                <Typography variant="body2">{suggestion.description}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Based on your conversation context
                </Typography>
              </div>
              <div className="suggestion-actions">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleAcceptSuggestion(suggestion)}
                >
                  Accept
                </Button>
                <IconButton
                  size="small"
                  onClick={() => handleDismissSuggestion(suggestion.id)}
                >
                  <VisibilityOff fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render task list
  const renderTaskList = () => {
    if (filteredTasks.length === 0) {
      return (
        <div className="empty-tasks">
          <Typography variant="body2" color="textSecondary">
            No tasks found. Create a new task to get started.
          </Typography>
        </div>
      );
    }
    
    return (
      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-item">
            <div className="task-header">
              <div className="task-status">
                {getStatusIcon(task.status)}
                <Typography variant="caption">
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Typography>
              </div>
              <Typography variant="body2" className="task-description">
                {task.description}
              </Typography>
            </div>
            
            {task.progress !== undefined && (
              <div className="task-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <Typography variant="caption">
                  {task.progress}% complete
                </Typography>
              </div>
            )}
            
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="subtasks">
                <Typography variant="caption" fontWeight="bold">
                  Subtasks:
                </Typography>
                <div className="subtask-list">
                  {task.subtasks.map((subtask, index) => (
                    <div key={index} className="subtask-item">
                      <div className="subtask-status">
                        {getStatusIcon(subtask.status)}
                      </div>
                      <Typography variant="caption">
                        {subtask.description}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="task-actions">
              {task.status === 'running' && (
                <Tooltip title="Pause">
                  <IconButton
                    size="small"
                    onClick={() => handleTaskAction(task.id, 'pause')}
                  >
                    <Pause fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              {task.status === 'paused' && (
                <Tooltip title="Resume">
                  <IconButton
                    size="small"
                    onClick={() => handleTaskAction(task.id, 'resume')}
                  >
                    <PlayArrow fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              {['running', 'paused'].includes(task.status) && (
                <Tooltip title="Cancel">
                  <IconButton
                    size="small"
                    onClick={() => handleTaskAction(task.id, 'cancel')}
                  >
                    <Stop fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => handleTaskAction(task.id, 'view')}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              
              {task.status === 'completed' && (
                <>
                  <Tooltip title="Test Output">
                    <IconButton
                      size="small"
                      onClick={() => handleTaskAction(task.id, 'test')}
                    >
                      <BugReportIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Export Result">
                    <IconButton
                      size="small"
                      onClick={() => handleTaskAction(task.id, 'export')}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Share">
                    <IconButton
                      size="small"
                      onClick={() => handleTaskAction(task.id, 'share')}
                    >
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              
              {['pending', 'running'].includes(task.status) && (
                <Tooltip title="Decompose Task">
                  <IconButton
                    size="small"
                    onClick={() => handleTaskAction(task.id, 'decompose')}
                  >
                    <LayersIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Clone Task">
                <IconButton
                  size="small"
                  onClick={() => handleTaskAction(task.id, 'clone')}
                >
                  <FileCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render export panel
  const renderExportPanel = () => {
    if (!showExportPanel) return null;
    
    const task = tasks.find(t => t.id === exportTaskId);
    if (!task) return null;
    
    return (
      <div className="export-panel">
        <div className="panel-header">
          <Typography variant="subtitle2">Export Task Result</Typography>
          <IconButton
            size="small"
            onClick={() => {
              setShowExportPanel(false);
              setExportTaskId(null);
            }}
          >
            ✕
          </IconButton>
        </div>
        
        <div className="panel-content">
          <Typography variant="body2">
            Task: {task.description}
          </Typography>
          
          <div className="export-format-selection">
            <Typography variant="caption" fontWeight="bold">
              Select Export Format:
            </Typography>
            
            <div className="format-options">
              {exportFormats.map(format => (
                <div 
                  key={format.id}
                  className={`format-option ${exportFormat === format.id ? 'selected' : ''}`}
                  onClick={() => setExportFormat(format.id)}
                >
                  <Typography variant="body2">{format.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {format.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
          
          <div className="panel-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={handleExportTask}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowExportPanel(false);
                setExportTaskId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render testing panel
  const renderTestingPanel = () => {
    if (!showTestingPanel) return null;
    
    const task = tasks.find(t => t.id === testingTaskId);
    if (!task) return null;
    
    return (
      <div className="testing-panel">
        <div className="panel-header">
          <Typography variant="subtitle2">Test Task Output</Typography>
          <IconButton
            size="small"
            onClick={() => {
              setShowTestingPanel(false);
              setTestingTaskId(null);
            }}
          >
            ✕
          </IconButton>
        </div>
        
        <div className="panel-content">
          <Typography variant="body2">
            Task: {task.description}
          </Typography>
          
          <div className="testing-options">
            <Typography variant="caption" fontWeight="bold">
              Testing Options:
            </Typography>
            
            <div className="testing-checkboxes">
              <div className="testing-checkbox">
                <input type="checkbox" id="run-tests" defaultChecked />
                <label htmlFor="run-tests">Run automated tests</label>
              </div>
              <div className="testing-checkbox">
                <input type="checkbox" id="validate-output" defaultChecked />
                <label htmlFor="validate-output">Validate output format</label>
              </div>
              <div className="testing-checkbox">
                <input type="checkbox" id="performance-check" />
                <label htmlFor="performance-check">Check performance</label>
              </div>
            </div>
          </div>
          
          <div className="panel-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={handleTestTask}
            >
              Start Testing
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowTestingPanel(false);
                setTestingTaskId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="autonomous-task-panel">
      <Paper className="task-panel-container" elevation={3}>
        <div className="panel-header">
          <Typography variant="h6">Autonomous Tasks</Typography>
          <div className="header-actions">
            <div className="filter-controls">
              <div 
                className={`filter-option ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </div>
              <div 
                className={`filter-option ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </div>
              <div 
                className={`filter-option ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </div>
            </div>
            
            <div className="search-control">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setIsSearching(false)}
              />
              <SearchIcon fontSize="small" />
            </div>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateTask}
              disabled={isCreatingTask}
              size="small"
            >
              New Task
            </Button>
          </div>
        </div>
        
        <Divider />
        
        <div className="panel-content">
          {isCreatingTask ? (
            renderTaskCreationForm()
          ) : (
            <>
              {renderTaskSuggestions()}
              {renderTaskList()}
            </>
          )}
        </div>
      </Paper>
      
      {/* Export Panel */}
      {renderExportPanel()}
      
      {/* Testing Panel */}
      {renderTestingPanel()}
    </div>
  );
};

AutonomousTaskPanel.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['pending', 'running', 'paused', 'completed', 'cancelled', 'failed']).isRequired,
      progress: PropTypes.number,
      subtasks: PropTypes.array,
      details: PropTypes.object,
      tags: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  onCreateTask: PropTypes.func,
  onCancelTask: PropTypes.func,
  onPauseTask: PropTypes.func,
  onResumeTask: PropTypes.func,
  onViewTaskDetails: PropTypes.func,
  onDecomposeTask: PropTypes.func,
  onCloneTask: PropTypes.func,
  onExportTaskResult: PropTypes.func,
  onTestTaskOutput: PropTypes.func,
  onShareTask: PropTypes.func,
  availableTools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  ),
  conversationContext: PropTypes.object,
  suggestedTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      parameters: PropTypes.object
    })
  )
};

export default AutonomousTaskPanel;
