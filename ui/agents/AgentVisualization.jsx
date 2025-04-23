import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CoreUIFramework, { useUI } from '../core/CoreUIFramework';
import { useIsMobile, useIsTablet, useResponsiveValue } from '../core/hooks/useMediaQuery';
import './styles/AgentVisualization.css';

/**
 * Enhanced Agent Visualization Interface for Lumina AI
 * Provides visualization and management of multi-agent collaboration system
 * with improved interactivity, accessibility, and responsive design
 */
const AgentVisualization = ({ userId }) => {
  const { addNotification, theme, reducedMotion } = useUI();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const [activeView, setActiveView] = useState('teams');
  const [visualizationMode, setVisualizationMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showEditAgentModal, setShowEditAgentModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', members: [] });
  const [newAgent, setNewAgent] = useState({ name: '', type: 'information', skills: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [agentInteractions, setAgentInteractions] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState({});
  
  const networkCanvasRef = useRef(null);
  
  // Simulate fetching data
  useEffect(() => {
    setIsLoading(true);
    
    // In a real implementation, these would be API calls
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const agentsData = [
          { 
            id: 1, 
            name: 'Research Agent', 
            type: 'information', 
            status: 'active', 
            skills: ['web search', 'data analysis', 'summarization'],
            description: 'Specializes in gathering and analyzing information from various sources',
            createdAt: '2025-03-15T10:30:00Z',
            lastActive: '2025-04-22T14:25:00Z',
            completedTasks: 87,
            successRate: 94
          },
          { 
            id: 2, 
            name: 'Writing Agent', 
            type: 'content', 
            status: 'active', 
            skills: ['content creation', 'editing', 'formatting'],
            description: 'Creates high-quality written content based on provided information',
            createdAt: '2025-03-15T11:45:00Z',
            lastActive: '2025-04-22T16:10:00Z',
            completedTasks: 65,
            successRate: 92
          },
          { 
            id: 3, 
            name: 'Code Agent', 
            type: 'development', 
            status: 'active', 
            skills: ['code generation', 'debugging', 'optimization'],
            description: 'Writes and optimizes code in various programming languages',
            createdAt: '2025-03-16T09:15:00Z',
            lastActive: '2025-04-22T15:30:00Z',
            completedTasks: 52,
            successRate: 88
          },
          { 
            id: 4, 
            name: 'Data Agent', 
            type: 'analysis', 
            status: 'active', 
            skills: ['data processing', 'visualization', 'statistics'],
            description: 'Processes and visualizes complex datasets for insights',
            createdAt: '2025-03-16T14:20:00Z',
            lastActive: '2025-04-22T13:45:00Z',
            completedTasks: 43,
            successRate: 96
          },
          { 
            id: 5, 
            name: 'Planning Agent', 
            type: 'coordination', 
            status: 'active', 
            skills: ['task planning', 'resource allocation', 'scheduling'],
            description: 'Coordinates tasks and resources across multiple agents',
            createdAt: '2025-03-17T08:30:00Z',
            lastActive: '2025-04-22T17:05:00Z',
            completedTasks: 38,
            successRate: 91
          },
          { 
            id: 6, 
            name: 'UI Design Agent', 
            type: 'design', 
            status: 'inactive', 
            skills: ['interface design', 'prototyping', 'user experience'],
            description: 'Creates user interface designs and prototypes',
            createdAt: '2025-03-18T11:10:00Z',
            lastActive: '2025-04-20T09:30:00Z',
            completedTasks: 24,
            successRate: 89
          },
          { 
            id: 7, 
            name: 'Testing Agent', 
            type: 'quality', 
            status: 'active', 
            skills: ['test automation', 'bug detection', 'quality assurance'],
            description: 'Tests applications and identifies potential issues',
            createdAt: '2025-03-19T13:45:00Z',
            lastActive: '2025-04-22T12:15:00Z',
            completedTasks: 31,
            successRate: 95
          }
        ];
        
        const teamsData = [
          { 
            id: 1, 
            name: 'Content Creation Team', 
            status: 'active', 
            members: [1, 2, 5],
            tasks: 24,
            completedTasks: 18,
            description: 'Focused on creating high-quality content based on research',
            createdAt: '2025-03-20T09:00:00Z',
            lastActive: '2025-04-22T16:30:00Z'
          },
          { 
            id: 2, 
            name: 'Development Team', 
            status: 'active', 
            members: [3, 4, 7],
            tasks: 32,
            completedTasks: 26,
            description: 'Develops and tests software applications',
            createdAt: '2025-03-21T10:15:00Z',
            lastActive: '2025-04-22T15:45:00Z'
          },
          { 
            id: 3, 
            name: 'Research Team', 
            status: 'idle', 
            members: [1, 4],
            tasks: 15,
            completedTasks: 15,
            description: 'Gathers and analyzes information for various projects',
            createdAt: '2025-03-22T14:30:00Z',
            lastActive: '2025-04-21T11:20:00Z'
          },
          { 
            id: 4, 
            name: 'Design Team', 
            status: 'inactive', 
            members: [2, 6],
            tasks: 12,
            completedTasks: 8,
            description: 'Creates visual designs and user interfaces',
            createdAt: '2025-03-23T11:45:00Z',
            lastActive: '2025-04-20T10:30:00Z'
          }
        ];
        
        const interactionsData = [
          { source: 1, target: 2, strength: 0.8, count: 42 },
          { source: 1, target: 5, strength: 0.6, count: 28 },
          { source: 2, target: 5, strength: 0.7, count: 35 },
          { source: 3, target: 4, strength: 0.9, count: 56 },
          { source: 3, target: 7, strength: 0.8, count: 44 },
          { source: 4, target: 7, strength: 0.7, count: 38 },
          { source: 1, target: 4, strength: 0.5, count: 22 },
          { source: 2, target: 6, strength: 0.4, count: 18 }
        ];
        
        const performanceData = {
          1: { efficiency: 92, collaboration: 88, taskCompletion: 94 },
          2: { efficiency: 88, collaboration: 90, taskCompletion: 86 },
          3: { efficiency: 95, collaboration: 82, taskCompletion: 92 },
          4: { efficiency: 78, collaboration: 72, taskCompletion: 84 }
        };
        
        setAgents(agentsData);
        setTeams(teamsData);
        setAgentInteractions(interactionsData);
        setTeamPerformance(performanceData);
        
        // Add notification for demo purposes
        addNotification({
          id: Date.now(),
          title: 'Agents Loaded',
          message: `${agentsData.length} agents and ${teamsData.length} teams loaded successfully`,
          type: 'info',
          time: new Date().toLocaleTimeString()
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching agent data:', error);
        
        // Add error notification
        addNotification({
          id: Date.now(),
          title: 'Loading Error',
          message: 'Failed to load agent data. Please try again.',
          type: 'error',
          time: new Date().toLocaleTimeString()
        });
        
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [addNotification]);
  
  // Initialize network visualization when data is loaded
  useEffect(() => {
    if (!isLoading && visualizationMode === 'network' && networkCanvasRef.current && agents.length > 0) {
      initializeNetworkVisualization();
    }
  }, [isLoading, visualizationMode, agents, agentInteractions]);
  
  // Initialize network visualization
  const initializeNetworkVisualization = () => {
    const canvas = networkCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up agent positions (simplified for this example)
    const agentPositions = {};
    const radius = Math.min(width, height) * 0.4;
    const centerX = width / 2;
    const centerY = height / 2;
    
    agents.forEach((agent, index) => {
      const angle = (index / agents.length) * Math.PI * 2;
      agentPositions[agent.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        agent: agent
      };
    });
    
    // Draw connections
    ctx.lineWidth = 2;
    agentInteractions.forEach(interaction => {
      const source = agentPositions[interaction.source];
      const target = agentPositions[interaction.target];
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(13, 110, 253, ${interaction.strength})`;
        ctx.stroke();
        
        // Draw interaction strength indicator
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.fillStyle = '#0d6efd';
        ctx.beginPath();
        ctx.arc(midX, midY, 4 + interaction.strength * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Draw agent nodes
    Object.values(agentPositions).forEach(pos => {
      // Draw circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      
      // Set color based on agent type
      let fillColor;
      switch (pos.agent.type) {
        case 'information':
          fillColor = '#0d6efd'; // blue
          break;
        case 'content':
          fillColor = '#6f42c1'; // purple
          break;
        case 'development':
          fillColor = '#20c997'; // teal
          break;
        case 'analysis':
          fillColor = '#fd7e14'; // orange
          break;
        case 'coordination':
          fillColor = '#0dcaf0'; // cyan
          break;
        case 'design':
          fillColor = '#d63384'; // pink
          break;
        case 'quality':
          fillColor = '#198754'; // green
          break;
        default:
          fillColor = '#6c757d'; // gray
      }
      
      ctx.fillStyle = pos.agent.status === 'active' ? fillColor : '#adb5bd';
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw agent initial
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pos.agent.name.charAt(0), pos.x, pos.y);
      
      // Draw agent name below
      ctx.fillStyle = '#212529';
      ctx.font = '12px sans-serif';
      ctx.fillText(pos.agent.name, pos.x, pos.y + 35);
    });
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get agent details by ID
  const getAgentById = (id) => {
    return agents.find(agent => agent.id === id);
  };
  
  // Calculate team progress
  const calculateProgress = (team) => {
    if (!team.tasks) return 0;
    return Math.round((team.completedTasks / team.tasks) * 100);
  };
  
  // Handle team selection
  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setSelectedAgent(null);
  };
  
  // Handle agent selection
  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setSelectedTeam(null);
  };
  
  // Handle create team
  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) {
      addNotification({
        id: Date.now(),
        title: 'Validation Error',
        message: 'Team name is required',
        type: 'error',
        time: new Date().toLocaleTimeString()
      });
      return;
    }
    
    const newId = Math.max(...teams.map(team => team.id), 0) + 1;
    const team = {
      id: newId,
      name: newTeam.name,
      status: 'active',
      members: newTeam.members,
      tasks: 0,
      completedTasks: 0,
      description: 'Newly created team',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    setTeams(prev => [...prev, team]);
    setNewTeam({ name: '', members: [] });
    setShowCreateTeamModal(false);
    
    addNotification({
      id: Date.now(),
      title: 'Team Created',
      message: `${team.name} team has been created`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // Select the newly created team
    setSelectedTeam(team);
  };
  
  // Handle create agent
  const handleCreateAgent = () => {
    if (!newAgent.name.trim()) {
      addNotification({
        id: Date.now(),
        title: 'Validation Error',
        message: 'Agent name is required',
        type: 'error',
        time: new Date().toLocaleTimeString()
      });
      return;
    }
    
    const newId = Math.max(...agents.map(agent => agent.id), 0) + 1;
    const agent = {
      id: newId,
      name: newAgent.name,
      type: newAgent.type,
      status: 'active',
      skills: newAgent.skills,
      description: 'Newly created agent',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      completedTasks: 0,
      successRate: 100
    };
    
    setAgents(prev => [...prev, agent]);
    setNewAgent({ name: '', type: 'information', skills: [] });
    setShowCreateAgentModal(false);
    
    addNotification({
      id: Date.now(),
      title: 'Agent Created',
      message: `${agent.name} agent has been created`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // Select the newly created agent
    setSelectedAgent(agent);
  };
  
  // Handle edit team
  const handleEditTeam = () => {
    if (!selectedTeam) return;
    
    setTeams(prev => prev.map(team => {
      if (team.id === selectedTeam.id) {
        return { ...selectedTeam, lastActive: new Date().toISOString() };
      }
      return team;
    }));
    
    setShowEditTeamModal(false);
    
    addNotification({
      id: Date.now(),
      title: 'Team Updated',
      message: `${selectedTeam.name} team has been updated`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Handle edit agent
  const handleEditAgent = () => {
    if (!selectedAgent) return;
    
    setAgents(prev => prev.map(agent => {
      if (agent.id === selectedAgent.id) {
        return { ...selectedAgent, lastActive: new Date().toISOString() };
      }
      return agent;
    }));
    
    setShowEditAgentModal(false);
    
    addNotification({
      id: Date.now(),
      title: 'Agent Updated',
      message: `${selectedAgent.name} agent has been updated`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
  };
  
  // Handle agent status change
  const handleAgentStatusChange = (agentId, newStatus) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return { ...agent, status: newStatus, lastActive: new Date().toISOString() };
      }
      return agent;
    }));
    
    const agent = agents.find(a => a.id === agentId);
    
    addNotification({
      id: Date.now(),
      title: newStatus === 'active' ? 'Agent Activated' : 'Agent Deactivated',
      message: `${agent.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // Update selected agent if it's the one being changed
    if (selectedAgent && selectedAgent.id === agentId) {
      setSelectedAgent({ ...selectedAgent, status: newStatus });
    }
  };
  
  // Handle team status change
  const handleTeamStatusChange = (teamId, newStatus) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return { ...team, status: newStatus, lastActive: new Date().toISOString() };
      }
      return team;
    }));
    
    const team = teams.find(t => t.id === teamId);
    
    addNotification({
      id: Date.now(),
      title: newStatus === 'active' ? 'Team Activated' : 'Team Deactivated',
      message: `${team.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // Update selected team if it's the one being changed
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam({ ...selectedTeam, status: newStatus });
    }
  };
  
  // Handle add agent to team
  const handleAddAgentToTeam = (teamId, agentId) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId && !team.members.includes(agentId)) {
        return { 
          ...team, 
          members: [...team.members, agentId],
          lastActive: new Date().toISOString()
        };
      }
      return team;
    }));
    
    const team = teams.find(t => t.id === teamId);
    const agent = agents.find(a => a.id === agentId);
    
    addNotification({
      id: Date.now(),
      title: 'Agent Added to Team',
      message: `${agent.name} has been added to ${team.name}`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // Update selected team if it's the one being changed
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam(prev => ({
        ...prev,
        members: [...prev.members, agentId]
      }));
    }
  };
  
  // Handle remove agent from team
  const handleRemoveAgentFromTeam = (teamId, agentId) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return { 
          ...team, 
          members: team.members.filter(id => id !== agentId),
          lastActive: new Date().toISOString()
        };
      }
      return team;
    }));
    
    const team = teams.find(t => t.id === teamId);
    const agent = agents.find(a => a.id === agentId);
    
    addNotification({
      id: Date.now(),
      title: 'Agent Removed from Team',
      message: `${agent.name} has been removed from ${team.name}`,
      type: 'success',
      time: new Date().toLocaleTimeString()
    });
    
    // Update selected team if it's the one being changed
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam(prev => ({
        ...prev,
        members: prev.members.filter(id => id !== agentId)
      }));
    }
  };
  
  // Filter teams based on search and filters
  const filteredTeams = teams.filter(team => {
    // Search filter
    if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && team.status !== filterStatus) {
      return false;
    }
    
    return true;
  });
  
  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    // Search filter
    if (searchQuery && !agent.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && agent.status !== filterStatus) {
      return false;
    }
    
    // Type filter
    if (filterType !== 'all' && agent.type !== filterType) {
      return false;
    }
    
    return true;
  });
  
  // Get agent type display name
  const getAgentTypeDisplay = (type) => {
    switch (type) {
      case 'information':
        return 'Information';
      case 'content':
        return 'Content Creation';
      case 'development':
        return 'Development';
      case 'analysis':
        return 'Data Analysis';
      case 'coordination':
        return 'Coordination';
      case 'design':
        return 'Design';
      case 'quality':
        return 'Quality Assurance';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Get agent type icon
  const getAgentTypeIcon = (type) => {
    switch (type) {
      case 'information':
        return '🔍';
      case 'content':
        return '📝';
      case 'development':
        return '💻';
      case 'analysis':
        return '📊';
      case 'coordination':
        return '🔄';
      case 'design':
        return '🎨';
      case 'quality':
        return '✅';
      default:
        return '🤖';
    }
  };
  
  // Render loading state
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading agent data...</p>
    </div>
  );
  
  // Render teams view
  const renderTeamsView = () => {
    return (
      <div className="teams-view">
        <div className="teams-list">
          {filteredTeams.map(team => (
            <div 
              key={team.id} 
              className={`team-card ${selectedTeam && selectedTeam.id === team.id ? 'selected' : ''} status-${team.status}`}
              onClick={() => handleTeamSelect(team)}
            >
              <div className="team-header">
                <h3>{team.name}</h3>
                <span className={`team-status status-${team.status}`}>{team.status}</span>
              </div>
              <div className="team-details">
                <p>Members: {team.members.length}</p>
                <p>Tasks: {team.completedTasks}/{team.tasks}</p>
                <div className="progress-bar" role="progressbar" aria-valuenow={calculateProgress(team)} aria-valuemin="0" aria-valuemax="100">
                  <div 
                    className="progress" 
                    style={{ width: `${calculateProgress(team)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          <div 
            className="team-card add-new"
            onClick={() => setShowCreateTeamModal(true)}
            role="button"
            aria-label="Create new team"
            tabIndex={0}
          >
            <div className="add-new-content">
              <span className="add-icon" aria-hidden="true">+</span>
              <span>Create New Team</span>
            </div>
          </div>
        </div>
        
        {selectedTeam && (
          <div className="team-detail-panel">
            <div className="detail-panel-header">
              <h2>{selectedTeam.name}</h2>
              <div className="detail-panel-actions">
                <button 
                  className="action-btn"
                  onClick={() => setShowEditTeamModal(true)}
                  aria-label="Edit team"
                >
                  <span aria-hidden="true">✏️</span>
                  {!isMobile && <span>Edit</span>}
                </button>
                {selectedTeam.status === 'active' ? (
                  <button 
                    className="action-btn warning"
                    onClick={() => handleTeamStatusChange(selectedTeam.id, 'inactive')}
                    aria-label="Deactivate team"
                  >
                    <span aria-hidden="true">⏸️</span>
                    {!isMobile && <span>Deactivate</span>}
                  </button>
                ) : (
                  <button 
                    className="action-btn success"
                    onClick={() => handleTeamStatusChange(selectedTeam.id, 'active')}
                    aria-label="Activate team"
                  >
                    <span aria-hidden="true">▶️</span>
                    {!isMobile && <span>Activate</span>}
                  </button>
                )}
              </div>
            </div>
            
            <div className="team-stats">
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className={`stat-value status-${selectedTeam.status}`}>{selectedTeam.status}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{calculateProgress(selectedTeam)}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Members</span>
                <span className="stat-value">{selectedTeam.members.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Created</span>
                <span className="stat-value">{formatDate(selectedTeam.createdAt)}</span>
              </div>
            </div>
            
            <div className="team-description">
              <h3>Description</h3>
              <p>{selectedTeam.description || 'No description available.'}</p>
            </div>
            
            {teamPerformance[selectedTeam.id] && (
              <div className="team-performance">
                <h3>Performance Metrics</h3>
                <div className="performance-metrics">
                  <div className="metric-item">
                    <div className="metric-header">
                      <span className="metric-label">Efficiency</span>
                      <span className="metric-value">{teamPerformance[selectedTeam.id].efficiency}%</span>
                    </div>
                    <div className="metric-bar">
                      <div 
                        className="metric-progress" 
                        style={{ width: `${teamPerformance[selectedTeam.id].efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-header">
                      <span className="metric-label">Collaboration</span>
                      <span className="metric-value">{teamPerformance[selectedTeam.id].collaboration}%</span>
                    </div>
                    <div className="metric-bar">
                      <div 
                        className="metric-progress" 
                        style={{ width: `${teamPerformance[selectedTeam.id].collaboration}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-header">
                      <span className="metric-label">Task Completion</span>
                      <span className="metric-value">{teamPerformance[selectedTeam.id].taskCompletion}%</span>
                    </div>
                    <div className="metric-bar">
                      <div 
                        className="metric-progress" 
                        style={{ width: `${teamPerformance[selectedTeam.id].taskCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="team-members-section">
              <div className="section-header">
                <h3>Team Members</h3>
                <button 
                  className="add-btn"
                  onClick={() => {
                    // Show modal to add agents to team
                    addNotification({
                      id: Date.now(),
                      title: 'Add Agent',
                      message: 'Select an agent from the Agents view to add to this team',
                      type: 'info',
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                  aria-label="Add agent to team"
                >
                  <span aria-hidden="true">+</span> Add Agent
                </button>
              </div>
              
              <div className="team-members">
                {selectedTeam.members.length > 0 ? (
                  selectedTeam.members.map(memberId => {
                    const agent = getAgentById(memberId);
                    return agent ? (
                      <div 
                        key={agent.id} 
                        className={`agent-card ${agent.status !== 'active' ? 'inactive' : ''}`}
                      >
                        <div className="agent-card-header">
                          <div 
                            className="agent-icon" 
                            data-type={agent.type}
                            aria-hidden="true"
                          >
                            {getAgentTypeIcon(agent.type)}
                          </div>
                          <div className="agent-info">
                            <h4>{agent.name}</h4>
                            <p className="agent-type">{getAgentTypeDisplay(agent.type)}</p>
                          </div>
                          <button 
                            className="remove-agent-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAgentFromTeam(selectedTeam.id, agent.id);
                            }}
                            aria-label={`Remove ${agent.name} from team`}
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </div>
                        <div className="agent-card-footer">
                          <button 
                            className="view-agent-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAgentSelect(agent);
                            }}
                            aria-label={`View ${agent.name} details`}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })
                ) : (
                  <div className="no-members">
                    <p>No agents assigned to this team</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="team-actions">
              <button 
                className="action-btn"
                onClick={() => {
                  addNotification({
                    id: Date.now(),
                    title: 'Manage Tasks',
                    message: 'Task management feature will be available in the next update',
                    type: 'info',
                    time: new Date().toLocaleTimeString()
                  });
                }}
              >
                Manage Tasks
              </button>
              <button 
                className="action-btn"
                onClick={() => {
                  addNotification({
                    id: Date.now(),
                    title: 'View History',
                    message: 'Team history feature will be available in the next update',
                    type: 'info',
                    time: new Date().toLocaleTimeString()
                  });
                }}
              >
                View History
              </button>
              <button 
                className="action-btn danger"
                onClick={() => {
                  // Confirm before disbanding
                  if (window.confirm(`Are you sure you want to disband the ${selectedTeam.name} team?`)) {
                    setTeams(prev => prev.filter(t => t.id !== selectedTeam.id));
                    
                    addNotification({
                      id: Date.now(),
                      title: 'Team Disbanded',
                      message: `${selectedTeam.name} team has been disbanded`,
                      type: 'success',
                      time: new Date().toLocaleTimeString()
                    });
                    
                    setSelectedTeam(null);
                  }
                }}
              >
                Disband Team
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render agents view
  const renderAgentsView = () => {
    return (
      <div className="agents-view">
        <div className="agents-list">
          {filteredAgents.map(agent => (
            <div 
              key={agent.id} 
              className={`agent-list-item ${selectedAgent && selectedAgent.id === agent.id ? 'selected' : ''} status-${agent.status}`}
              onClick={() => handleAgentSelect(agent)}
            >
              <div 
                className="agent-icon" 
                data-type={agent.type}
                aria-hidden="true"
              >
                {getAgentTypeIcon(agent.type)}
              </div>
              <div className="agent-list-info">
                <h3>{agent.name}</h3>
                <p className="agent-type">{getAgentTypeDisplay(agent.type)}</p>
                <span className={`agent-status status-${agent.status}`}>{agent.status}</span>
              </div>
            </div>
          ))}
          <div 
            className="agent-list-item add-new"
            onClick={() => setShowCreateAgentModal(true)}
            role="button"
            aria-label="Create new agent"
            tabIndex={0}
          >
            <div className="add-new-content">
              <span className="add-icon" aria-hidden="true">+</span>
              <span>Create New Agent</span>
            </div>
          </div>
        </div>
        
        {selectedAgent && (
          <div className="agent-detail-panel">
            <div className="detail-panel-header">
              <h2>{selectedAgent.name}</h2>
              <div className="detail-panel-actions">
                <button 
                  className="action-btn"
                  onClick={() => setShowEditAgentModal(true)}
                  aria-label="Edit agent"
                >
                  <span aria-hidden="true">✏️</span>
                  {!isMobile && <span>Edit</span>}
                </button>
                {selectedAgent.status === 'active' ? (
                  <button 
                    className="action-btn warning"
                    onClick={() => handleAgentStatusChange(selectedAgent.id, 'inactive')}
                    aria-label="Deactivate agent"
                  >
                    <span aria-hidden="true">⏸️</span>
                    {!isMobile && <span>Deactivate</span>}
                  </button>
                ) : (
                  <button 
                    className="action-btn success"
                    onClick={() => handleAgentStatusChange(selectedAgent.id, 'active')}
                    aria-label="Activate agent"
                  >
                    <span aria-hidden="true">▶️</span>
                    {!isMobile && <span>Activate</span>}
                  </button>
                )}
              </div>
            </div>
            
            <div className="agent-stats">
              <div className="stat-item">
                <span className="stat-label">Type</span>
                <span className="stat-value">{getAgentTypeDisplay(selectedAgent.type)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className={`stat-value status-${selectedAgent.status}`}>{selectedAgent.status}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tasks Completed</span>
                <span className="stat-value">{selectedAgent.completedTasks}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Success Rate</span>
                <span className="stat-value">{selectedAgent.successRate}%</span>
              </div>
            </div>
            
            <div className="agent-description">
              <h3>Description</h3>
              <p>{selectedAgent.description || 'No description available.'}</p>
            </div>
            
            <div className="agent-skills-section">
              <h3>Skills</h3>
              <div className="agent-skills">
                {selectedAgent.skills.length > 0 ? (
                  selectedAgent.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  <p className="no-skills">No skills defined</p>
                )}
              </div>
            </div>
            
            <div className="agent-teams-section">
              <div className="section-header">
                <h3>Teams</h3>
                <div className="team-selector">
                  <select 
                    className="team-select"
                    onChange={(e) => {
                      if (e.target.value) {
                        const teamId = parseInt(e.target.value);
                        handleAddAgentToTeam(teamId, selectedAgent.id);
                      }
                    }}
                    value=""
                    aria-label="Add to team"
                  >
                    <option value="">Add to team...</option>
                    {teams
                      .filter(team => !team.members.includes(selectedAgent.id))
                      .map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              
              <div className="agent-teams">
                {teams
                  .filter(team => team.members.includes(selectedAgent.id))
                  .map(team => (
                    <div key={team.id} className={`team-tag status-${team.status}`}>
                      <span className="team-name" onClick={() => handleTeamSelect(team)}>{team.name}</span>
                      <button 
                        className="remove-from-team-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAgentFromTeam(team.id, selectedAgent.id);
                        }}
                        aria-label={`Remove from ${team.name}`}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  ))
                }
                {teams.filter(team => team.members.includes(selectedAgent.id)).length === 0 && (
                  <p className="no-teams">Not assigned to any teams</p>
                )}
              </div>
            </div>
            
            <div className="agent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-timeline">
                <div className="timeline-item">
                  <div className="timeline-icon" aria-hidden="true">✓</div>
                  <div className="timeline-content">
                    <h4>Task Completed</h4>
                    <p>Data analysis for quarterly report</p>
                    <span className="timeline-time">{formatDate(selectedAgent.lastActive)}</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon" aria-hidden="true">🔄</div>
                  <div className="timeline-content">
                    <h4>Collaboration</h4>
                    <p>Worked with Writing Agent on documentation</p>
                    <span className="timeline-time">{formatDate(new Date(new Date(selectedAgent.lastActive).getTime() - 3600000).toISOString())}</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon" aria-hidden="true">🚀</div>
                  <div className="timeline-content">
                    <h4>Task Started</h4>
                    <p>Initiated data processing workflow</p>
                    <span className="timeline-time">{formatDate(new Date(new Date(selectedAgent.lastActive).getTime() - 7200000).toISOString())}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="agent-actions">
              <button 
                className="action-btn"
                onClick={() => {
                  addNotification({
                    id: Date.now(),
                    title: 'View History',
                    message: 'Agent history feature will be available in the next update',
                    type: 'info',
                    time: new Date().toLocaleTimeString()
                  });
                }}
              >
                View Full History
              </button>
              <button 
                className="action-btn"
                onClick={() => {
                  addNotification({
                    id: Date.now(),
                    title: 'Performance Analysis',
                    message: 'Performance analysis feature will be available in the next update',
                    type: 'info',
                    time: new Date().toLocaleTimeString()
                  });
                }}
              >
                Performance Analysis
              </button>
              <button 
                className="action-btn danger"
                onClick={() => {
                  // Confirm before deleting
                  if (window.confirm(`Are you sure you want to delete the ${selectedAgent.name} agent?`)) {
                    // Remove agent from all teams first
                    setTeams(prev => prev.map(team => ({
                      ...team,
                      members: team.members.filter(id => id !== selectedAgent.id)
                    })));
                    
                    // Then remove the agent
                    setAgents(prev => prev.filter(a => a.id !== selectedAgent.id));
                    
                    addNotification({
                      id: Date.now(),
                      title: 'Agent Deleted',
                      message: `${selectedAgent.name} agent has been deleted`,
                      type: 'success',
                      time: new Date().toLocaleTimeString()
                    });
                    
                    setSelectedAgent(null);
                  }
                }}
              >
                Delete Agent
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render network visualization view
  const renderNetworkView = () => {
    return (
      <div className="network-view">
        <div className="network-canvas-container">
          <canvas 
            ref={networkCanvasRef} 
            width={800} 
            height={600}
            className="network-canvas"
          ></canvas>
        </div>
        <div className="network-legend">
          <h3>Agent Types</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#0d6efd' }}></div>
              <span>Information</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#6f42c1' }}></div>
              <span>Content</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#20c997' }}></div>
              <span>Development</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#fd7e14' }}></div>
              <span>Analysis</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#0dcaf0' }}></div>
              <span>Coordination</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#d63384' }}></div>
              <span>Design</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#198754' }}></div>
              <span>Quality</span>
            </div>
          </div>
          <p className="network-info">
            Line thickness represents interaction strength between agents.
            Inactive agents are shown in gray.
          </p>
        </div>
      </div>
    );
  };
  
  // Render create team modal
  const renderCreateTeamModal = () => {
    if (!showCreateTeamModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container" role="dialog" aria-labelledby="create-team-title">
          <div className="modal-header">
            <h3 id="create-team-title">Create New Team</h3>
            <button 
              className="modal-close-btn" 
              onClick={() => setShowCreateTeamModal(false)}
              aria-label="Close dialog"
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="team-name">Team Name</label>
              <input 
                type="text" 
                id="team-name" 
                className="form-control" 
                value={newTeam.name}
                onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter team name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="team-members">Initial Members</label>
              <div className="checkbox-group">
                {agents
                  .filter(agent => agent.status === 'active')
                  .map(agent => (
                    <div key={agent.id} className="checkbox-item">
                      <input 
                        type="checkbox" 
                        id={`agent-${agent.id}`} 
                        checked={newTeam.members.includes(agent.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTeam(prev => ({ ...prev, members: [...prev.members, agent.id] }));
                          } else {
                            setNewTeam(prev => ({ ...prev, members: prev.members.filter(id => id !== agent.id) }));
                          }
                        }}
                      />
                      <label htmlFor={`agent-${agent.id}`}>{agent.name}</label>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="secondary-btn" 
              onClick={() => setShowCreateTeamModal(false)}
            >
              Cancel
            </button>
            <button 
              className="primary-btn" 
              onClick={handleCreateTeam}
            >
              Create Team
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render create agent modal
  const renderCreateAgentModal = () => {
    if (!showCreateAgentModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container" role="dialog" aria-labelledby="create-agent-title">
          <div className="modal-header">
            <h3 id="create-agent-title">Create New Agent</h3>
            <button 
              className="modal-close-btn" 
              onClick={() => setShowCreateAgentModal(false)}
              aria-label="Close dialog"
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="agent-name">Agent Name</label>
              <input 
                type="text" 
                id="agent-name" 
                className="form-control" 
                value={newAgent.name}
                onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter agent name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="agent-type">Agent Type</label>
              <select 
                id="agent-type" 
                className="form-control"
                value={newAgent.type}
                onChange={(e) => setNewAgent(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="information">Information</option>
                <option value="content">Content Creation</option>
                <option value="development">Development</option>
                <option value="analysis">Data Analysis</option>
                <option value="coordination">Coordination</option>
                <option value="design">Design</option>
                <option value="quality">Quality Assurance</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="agent-skills">Skills (comma separated)</label>
              <input 
                type="text" 
                id="agent-skills" 
                className="form-control" 
                value={newAgent.skills.join(', ')}
                onChange={(e) => setNewAgent(prev => ({ 
                  ...prev, 
                  skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                }))}
                placeholder="e.g., web search, data analysis, summarization"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="secondary-btn" 
              onClick={() => setShowCreateAgentModal(false)}
            >
              Cancel
            </button>
            <button 
              className="primary-btn" 
              onClick={handleCreateAgent}
            >
              Create Agent
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render edit team modal
  const renderEditTeamModal = () => {
    if (!showEditTeamModal || !selectedTeam) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container" role="dialog" aria-labelledby="edit-team-title">
          <div className="modal-header">
            <h3 id="edit-team-title">Edit Team</h3>
            <button 
              className="modal-close-btn" 
              onClick={() => setShowEditTeamModal(false)}
              aria-label="Close dialog"
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="edit-team-name">Team Name</label>
              <input 
                type="text" 
                id="edit-team-name" 
                className="form-control" 
                value={selectedTeam.name}
                onChange={(e) => setSelectedTeam(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-team-description">Description</label>
              <textarea 
                id="edit-team-description" 
                className="form-control" 
                value={selectedTeam.description}
                onChange={(e) => setSelectedTeam(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-team-status">Status</label>
              <select 
                id="edit-team-status" 
                className="form-control"
                value={selectedTeam.status}
                onChange={(e) => setSelectedTeam(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="idle">Idle</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="secondary-btn" 
              onClick={() => setShowEditTeamModal(false)}
            >
              Cancel
            </button>
            <button 
              className="primary-btn" 
              onClick={handleEditTeam}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render edit agent modal
  const renderEditAgentModal = () => {
    if (!showEditAgentModal || !selectedAgent) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container" role="dialog" aria-labelledby="edit-agent-title">
          <div className="modal-header">
            <h3 id="edit-agent-title">Edit Agent</h3>
            <button 
              className="modal-close-btn" 
              onClick={() => setShowEditAgentModal(false)}
              aria-label="Close dialog"
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="edit-agent-name">Agent Name</label>
              <input 
                type="text" 
                id="edit-agent-name" 
                className="form-control" 
                value={selectedAgent.name}
                onChange={(e) => setSelectedAgent(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-agent-description">Description</label>
              <textarea 
                id="edit-agent-description" 
                className="form-control" 
                value={selectedAgent.description}
                onChange={(e) => setSelectedAgent(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-agent-type">Agent Type</label>
              <select 
                id="edit-agent-type" 
                className="form-control"
                value={selectedAgent.type}
                onChange={(e) => setSelectedAgent(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="information">Information</option>
                <option value="content">Content Creation</option>
                <option value="development">Development</option>
                <option value="analysis">Data Analysis</option>
                <option value="coordination">Coordination</option>
                <option value="design">Design</option>
                <option value="quality">Quality Assurance</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-agent-skills">Skills (comma separated)</label>
              <input 
                type="text" 
                id="edit-agent-skills" 
                className="form-control" 
                value={selectedAgent.skills.join(', ')}
                onChange={(e) => setSelectedAgent(prev => ({ 
                  ...prev, 
                  skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                }))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-agent-status">Status</label>
              <select 
                id="edit-agent-status" 
                className="form-control"
                value={selectedAgent.status}
                onChange={(e) => setSelectedAgent(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="secondary-btn" 
              onClick={() => setShowEditAgentModal(false)}
            >
              Cancel
            </button>
            <button 
              className="primary-btn" 
              onClick={handleEditAgent}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <CoreUIFramework 
      appTitle="Lumina AI Agent Visualization" 
      contentWidth="wide"
    >
      <div className="agent-visualization-container">
        <div className="page-header">
          <h1 className="page-title">Multi-Agent Collaboration System</h1>
          <div className="page-actions">
            <button 
              className="help-btn"
              onClick={() => {
                addNotification({
                  id: Date.now(),
                  title: 'Help',
                  message: 'Agent visualization help documentation will be available soon',
                  type: 'info',
                  time: new Date().toLocaleTimeString()
                });
              }}
              aria-label="Help"
            >
              <span aria-hidden="true">❓</span>
              {!isMobile && <span>Help</span>}
            </button>
          </div>
        </div>
        
        <div className="control-panel">
          <div className="view-selector" role="tablist">
            <button 
              className={`view-btn ${activeView === 'teams' ? 'active' : ''}`}
              onClick={() => setActiveView('teams')}
              role="tab"
              aria-selected={activeView === 'teams'}
              aria-controls="teams-panel"
              id="teams-tab"
            >
              Teams View
            </button>
            <button 
              className={`view-btn ${activeView === 'agents' ? 'active' : ''}`}
              onClick={() => setActiveView('agents')}
              role="tab"
              aria-selected={activeView === 'agents'}
              aria-controls="agents-panel"
              id="agents-tab"
            >
              Agents View
            </button>
            <button 
              className={`view-btn ${activeView === 'network' ? 'active' : ''}`}
              onClick={() => setActiveView('network')}
              role="tab"
              aria-selected={activeView === 'network'}
              aria-controls="network-panel"
              id="network-tab"
            >
              Network View
            </button>
          </div>
          
          <div className="filters">
            <div className="search-filter">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search agents or teams"
              />
            </div>
            
            <div className="status-filter">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="idle">Idle</option>
              </select>
            </div>
            
            {activeView === 'agents' && (
              <div className="type-filter">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  aria-label="Filter by agent type"
                >
                  <option value="all">All Types</option>
                  <option value="information">Information</option>
                  <option value="content">Content</option>
                  <option value="development">Development</option>
                  <option value="analysis">Analysis</option>
                  <option value="coordination">Coordination</option>
                  <option value="design">Design</option>
                  <option value="quality">Quality</option>
                </select>
              </div>
            )}
            
            {activeView === 'network' && (
              <div className="visualization-mode-selector">
                <select 
                  value={visualizationMode}
                  onChange={(e) => setVisualizationMode(e.target.value)}
                  aria-label="Visualization mode"
                >
                  <option value="network">Network</option>
                  <option value="hierarchy">Hierarchy</option>
                  <option value="force">Force-Directed</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        <div 
          className="visualization-content"
          role="tabpanel"
          id={`${activeView}-panel`}
          aria-labelledby={`${activeView}-tab`}
        >
          {isLoading ? (
            renderLoading()
          ) : (
            <>
              {activeView === 'teams' && renderTeamsView()}
              {activeView === 'agents' && renderAgentsView()}
              {activeView === 'network' && renderNetworkView()}
            </>
          )}
        </div>
        
        {renderCreateTeamModal()}
        {renderCreateAgentModal()}
        {renderEditTeamModal()}
        {renderEditAgentModal()}
      </div>
    </CoreUIFramework>
  );
};

AgentVisualization.propTypes = {
  userId: PropTypes.string
};

export default AgentVisualization;
