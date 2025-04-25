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
    
    setS
(Content truncated due to size limit. Use line ranges to read in chunks)