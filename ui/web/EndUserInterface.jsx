import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EndUserCoreFramework from './EndUserCoreFramework';
import WorkspaceManager from './WorkspaceManager';
import ChatInterface from './ChatInterface';
import AutonomousTaskPanel from './AutonomousTaskPanel';
import VisualThinkingDisplay from './VisualThinkingDisplay';
import '../styles/EndUserInterface.css';

/**
 * EndUserInterface is the main component that integrates all end-user
 * interface components into a cohesive experience.
 */
const EndUserInterface = ({
  userId,
  initialTheme = 'system',
  initialWorkspaces = [],
  onSendMessage,
  onCreateWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace,
  onCreateTask,
  onCancelTask,
  onPauseTask,
  onResumeTask,
  onSaveChat
}) => {
  // State for workspaces
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    initialWorkspaces.length > 0 ? initialWorkspaces[0].id : null
  );
  
  // State for messages in current workspace
  const [messages, setMessages] = useState([]);
  
  // State for tasks in current workspace
  const [tasks, setTasks] = useState([]);
  
  // State for visual thinking
  const [currentTask, setCurrentTask] = useState(null);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [showVisualThinking, setShowVisualThinking] = useState(true);
  
  // State for chat length monitoring
  const [chatLength, setChatLength] = useState(0);
  
  // Load messages and tasks when active workspace changes
  useEffect(() => {
    if (activeWorkspaceId) {
      // In a real implementation, this would fetch from a service
      // For now, we'll use the workspace data directly
      const workspace = workspaces.find(w => w.id === activeWorkspaceId);
      if (workspace) {
        setMessages(workspace.messages || []);
        setTasks(workspace.tasks || []);
      }
    } else {
      setMessages([]);
      setTasks([]);
    }
  }, [activeWorkspaceId, workspaces]);
  
  // Handle switching workspace
  const handleSwitchWorkspace = (workspaceId) => {
    setActiveWorkspaceId(workspaceId);
  };
  
  // Handle creating a new workspace
  const handleCreateWorkspace = async (title) => {
    try {
      if (onCreateWorkspace) {
        const newWorkspace = await onCreateWorkspace(userId, title);
        setWorkspaces(prev => [...prev, newWorkspace]);
        setActiveWorkspaceId(newWorkspace.id);
      } else {
        // Mock implementation for demo
        const newWorkspace = {
          id: `workspace-${Date.now()}`,
          title,
          userId,
          createdAt: Date.now(),
          lastActivity: Date.now(),
          messages: [],
          tasks: []
        };
        setWorkspaces(prev => [...prev, newWorkspace]);
        setActiveWorkspaceId(newWorkspace.id);
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };
  
  // Handle renaming a workspace
  const handleRenameWorkspace = async (workspaceId, title) => {
    try {
      if (onRenameWorkspace) {
        const updatedWorkspace = await onRenameWorkspace(workspaceId, title);
        setWorkspaces(prev => 
          prev.map(w => w.id === workspaceId ? { ...w, title } : w)
        );
      } else {
        // Mock implementation for demo
        setWorkspaces(prev => 
          prev.map(w => w.id === workspaceId ? { ...w, title } : w)
        );
      }
    } catch (error) {
      console.error('Failed to rename workspace:', error);
    }
  };
  
  // Handle deleting a workspace
  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      if (onDeleteWorkspace) {
        await onDeleteWorkspace(workspaceId);
      }
      
      setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
      
      // Switch to another workspace if the active one was deleted
      if (activeWorkspaceId === workspaceId) {
        const remainingWorkspaces = workspaces.filter(w => w.id !== workspaceId);
        setActiveWorkspaceId(remainingWorkspaces.length > 0 ? remainingWorkspaces[0].id : null);
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (!activeWorkspaceId) return null;
    
    try {
      // Add message to local state immediately for UI responsiveness
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      
      // Update workspace with new message
      setWorkspaces(prev => 
        prev.map(w => w.id === activeWorkspaceId ? 
          { ...w, messages: updatedMessages, lastActivity: Date.now() } : w
        )
      );
      
      // Process message through provided callback
      if (onSendMessage) {
        const response = await onSendMessage(message, activeWorkspaceId);
        
        // Simulate thinking steps for visual thinking display
        if (response && response.thinking) {
          setCurrentTask(response.thinking.task || 'Processing message');
          setThinkingSteps(response.thinking.steps || []);
        }
        
        return response;
      }
      
      // Mock implementation for demo
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock thinking steps
      const mockThinkingSteps = [
        { type: 'observation', content: 'User is asking about ' + message.content.substring(0, 30) + '...' },
        { type: 'thought', content: 'I need to understand the user\'s intent' },
        { type: 'decision', content: 'This appears to be a question about information' },
        { type: 'action', content: 'Searching knowledge base for relevant information' },
        { type: 'result', content: 'Found relevant information to construct a response' }
      ];
      
      // Update thinking display
      setCurrentTask('Processing: ' + message.content.substring(0, 30) + '...');
      setThinkingSteps([]);
      
      // Simulate thinking steps appearing over time
      for (let step of mockThinkingSteps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setThinkingSteps(prev => [...prev, step]);
      }
      
      // Mock response
      return {
        id: `msg-${Date.now()}-response`,
        sender: 'assistant',
        content: `This is a mock response to: "${message.content}"`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  };
  
  // Handle creating a task
  const handleCreateTask = async (description, parameters = {}) => {
    if (!activeWorkspaceId) return;
    
    try {
      if (onCreateTask) {
        const newTask = await onCreateTask(userId, activeWorkspaceId, description, parameters);
        setTasks(prev => [...prev, newTask]);
        
        // Update workspace with new task
        setWorkspaces(prev => 
          prev.map(w => w.id === activeWorkspaceId ? 
            { ...w, tasks: [...(w.tasks || []), newTask], lastActivity: Date.now() } : w
          )
        );
      } else {
        // Mock implementation for demo
        const newTask = {
          id: `task-${Date.now()}`,
          userId,
          workspaceId: activeWorkspaceId,
          description,
          parameters,
          status: 'pending',
          progress: 0,
          createdAt: Date.now(),
          isDetailsVisible: false,
          details: {
            steps: [
              { description: 'Initialize task', completed: true },
              { description: 'Analyze requirements', completed: false },
              { description: 'Execute actions', completed: false },
              { description: 'Compile results', completed: false }
            ]
          }
        };
        
        setTasks(prev => [...prev, newTask]);
        
        // Update workspace with new task
        setWorkspaces(prev => 
          prev.map(w => w.id === activeWorkspaceId ? 
            { ...w, tasks: [...(w.tasks || []), newTask], lastActivity: Date.now() } : w
          )
        );
        
        // Simulate task progress
        simulateTaskProgress(newTask.id);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };
  
  // Simulate task progress for demo purposes
  const simulateTaskProgress = async (taskId) => {
    const progressSteps = [10, 25, 40, 60, 75, 90, 100];
    const statusUpdates = ['pending', 'running', 'running', 'running', 'running', 'running', 'completed'];
    
    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTasks(prev => 
        prev.map(t => t.id === taskId ? 
          { 
            ...t, 
            status: statusUpdates[i], 
            progress: progressSteps[i],
            startedAt: i === 1 ? Date.now() : t.startedAt,
            completedAt: i === progressSteps.length - 1 ? Date.now() : t.completedAt,
            details: {
              ...t.details,
              steps: t.details.steps.map((step, stepIndex) => ({
                ...step,
                completed: stepIndex < i
              }))
            }
          } : t
        )
      );
      
      // Update workspace tasks
      setWorkspaces(prev => 
        prev.map(w => w.id === activeWorkspaceId ? 
          { 
            ...w, 
            tasks: w.tasks.map(t => t.id === taskId ? 
              { 
                ...t, 
                status: statusUpdates[i], 
                progress: progressSteps[i],
                startedAt: i === 1 ? Date.now() : t.startedAt,
                completedAt: i === progressSteps.length - 1 ? Date.now() : t.completedAt,
                details: {
                  ...t.details,
                  steps: t.details.steps.map((step, stepIndex) => ({
                    ...step,
                    completed: stepIndex < i
                  }))
                }
              } : t
            ),
            lastActivity: Date.now()
          } : w
        )
      );
    }
  };
  
  // Handle task actions
  const handleTaskAction = (taskId, action) => {
    if (action === 'cancel' && onCancelTask) {
      onCancelTask(taskId);
    } else if (action === 'pause' && onPauseTask) {
      onPauseTask(taskId);
    } else if (action === 'resume' && onResumeTask) {
      onResumeTask(taskId);
    } else if (action === 'view') {
      // Toggle task details visibility
      setTasks(prev => 
        prev.map(t => t.id === taskId ? 
          { ...t, isDetailsVisible: !t.isDetailsVisible } : t
        )
      );
      
      // Update workspace tasks
      setWorkspaces(prev => 
        prev.map(w => w.id === activeWorkspaceId ? 
          { 
            ...w, 
            tasks: w.tasks.map(t => t.id === taskId ? 
              { ...t, isDetailsVisible: !t.isDetailsVisible } : t
            )
          } : w
        )
      );
    }
  };
  
  // Handle saving chat
  const handleSaveChat = () => {
    if (!activeWorkspaceId) return;
    
    try {
      if (onSaveChat) {
        onSaveChat(messages, activeWorkspaceId);
      } else {
        // Mock implementation for demo
        console.log('Saving chat for workspace:', activeWorkspaceId);
        // In a real implementation, this would save to a backend service
        alert('Chat saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };
  
  // Handle updating chat length
  const handleUpdateChatLength = (length) => {
    setChatLength(length);
  };
  
  // Toggle visual thinking display
  const handleToggleVisualThinking = () => {
    setShowVisualThinking(prev => !prev);
  };
  
  return (
    <EndUserCoreFramework
      initialTheme={initialTheme}
      showMemoryTracker={true}
      showChatLengthIndicator={true}
    >
      <div className="enduser-interface">
        <WorkspaceManager
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSwitchWorkspace={handleSwitchWorkspace}
          onCreateWorkspace={handleCreateWorkspace}
          onRenameWorkspace={handleRenameWorkspace}
          onDeleteWorkspace={handleDeleteWorkspace}
        />
        
        {activeWorkspaceId ? (
          <div className="workspace-content">
            <div className="main-content">
              <ChatInterface
                workspaceId={activeWorkspaceId}
                initialMessages={messages}
                onSendMessage={handleSendMessage}
                onSaveChat={handleSaveChat}
                onUpdateChatLength={handleUpdateChatLength}
                showAgentActivity={true}
              />
            </div>
            
            <div className="side-content">
              <AutonomousTaskPanel
                tasks={tasks}
                onCreateTask={handleCreateTask}
                onCancelTask={(taskId) => handleTaskAction(taskId, 'cancel')}
                onPauseTask={(taskId) => handleTaskAction(taskId, 'pause')}
                onResumeTask={(taskId) => handleTaskAction(taskId, 'resume')}
                onViewTaskDetails={(taskId) => handleTaskAction(taskId, 'view')}
              />
              
              {showVisualThinking && (
                <VisualThinkingDisplay
                  currentTask={currentTask}
                  thinkingSteps={thinkingSteps}
                  isVisible={true}
                  onToggleVisibility={handleToggleVisualThinking}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="empty-workspace">
            <div className="empty-workspace-content">
              <h2>Welcome to Lumina AI</h2>
              <p>Create a new workspace to get started</p>
              <button 
                className="create-workspace-button"
                onClick={() => handleCreateWorkspace('New Workspace')}
              >
                Create Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </EndUserCoreFramework>
  );
};

EndUserInterface.propTypes = {
  userId: PropTypes.string.isRequired,
  initialTheme: PropTypes.oneOf(['light', 'dark', 'system']),
  initialWorkspaces: PropTypes.array,
  onSendMessage: PropTypes.func,
  onCreateWorkspace: PropTypes.func,
  onRenameWorkspace: PropTypes.func,
  onDeleteWorkspace: PropTypes.func,
  onCreateTask: PropTypes.func,
  onCancelTask: PropTypes.func,
  onPauseTask: PropTypes.func,
  onResumeTask: PropTypes.func,
  onSaveChat: PropTypes.func
};

export default EndUserInterface;
