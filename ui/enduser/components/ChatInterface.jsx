import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, TextField, Button, IconButton, CircularProgress, Tooltip, Drawer, Divider } from '@mui/material';
import { 
  Send as SendIcon, 
  Save as SaveIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  TravelExplore as DeepResearchIcon,
  Psychology as VisualThinkingIcon,
  Memory as MemoryIcon,
  Terminal as OperatorIcon,
  Download as ExportIcon,
  Science as TestingIcon
} from '@mui/icons-material';
import AgentActivityPanel from '../../shared/AgentActivityPanel';
import '../styles/ChatInterface.css';

/**
 * ChatInterface component provides the main conversational interface
 * for end-users to interact with Lumina AI with enhanced features
 * including Projects, Operator Window, Testing Environment, and Export System.
 */
const ChatInterface = ({
  workspaceId,
  initialMessages = [],
  onSendMessage,
  onSaveChat,
  onUpdateChatLength,
  showAgentActivity = true,
  projectData = null
}) => {
  // State for messages
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for agent activity
  const [agentActions, setAgentActions] = useState([]);
  
  // State for enhanced features
  const [showMemoryTracker, setShowMemoryTracker] = useState(false);
  const [showVisualThinking, setShowVisualThinking] = useState(false);
  const [showOperatorWindow, setShowOperatorWindow] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showTestingEnvironment, setShowTestingEnvironment] = useState(false);
  
  // Context window usage
  const [contextUsage, setContextUsage] = useState(0);
  
  // Reference for message container to auto-scroll
  const messageContainerRef = useRef(null);
  
  // Update chat length whenever messages change
  useEffect(() => {
    if (onUpdateChatLength) {
      // Calculate total length of all messages
      const totalLength = messages.reduce((total, msg) => {
        return total + (msg.content ? msg.content.length : 0);
      }, 0);
      
      onUpdateChatLength(totalLength);
      
      // Update context usage (0-100%)
      // Assuming 8000 tokens is the maximum context window
      const estimatedTokens = totalLength / 4; // Rough estimate: 4 chars per token
      const usagePercentage = Math.min(Math.round((estimatedTokens / 8000) * 100), 100);
      setContextUsage(usagePercentage);
    }
  }, [messages, onUpdateChatLength]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Process message through provided callback
      if (onSendMessage) {
        const response = await onSendMessage(userMessage, workspaceId);
        
        // Add assistant response to chat
        if (response) {
          setMessages(prev => [...prev, {
            id: response.id || `msg-${Date.now()}-response`,
            sender: 'assistant',
            content: response.content,
            timestamp: response.timestamp || new Date().toISOString(),
            metadata: response.metadata
          }]);
          
          // Update agent actions if provided
          if (response.agentActions) {
            setAgentActions(response.agentActions);
          }
        }
      }
    } catch (error) {
      // Add error message
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-error`,
        sender: 'system',
        content: `Error: ${error.message || 'Failed to process message'}`,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle input key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle saving the chat
  const handleSaveChat = () => {
    if (onSaveChat) {
      onSaveChat(messages, workspaceId);
    }
  };
  
  // Toggle feature panels
  const toggleMemoryTracker = () => setShowMemoryTracker(!showMemoryTracker);
  const toggleVisualThinking = () => setShowVisualThinking(!showVisualThinking);
  const toggleOperatorWindow = () => setShowOperatorWindow(!showOperatorWindow);
  const toggleExportPanel = () => setShowExportPanel(!showExportPanel);
  const toggleTestingEnvironment = () => setShowTestingEnvironment(!showTestingEnvironment);
  
  // Render a single message
  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    
    return (
      <div 
        key={message.id} 
        className={`chat-message ${isUser ? 'user-message' : isSystem ? 'system-message' : 'assistant-message'} ${message.isError ? 'error-message' : ''}`}
      >
        <div className="message-avatar">
          {isUser ? '👤' : isSystem ? '🔔' : '🤖'}
        </div>
        <div className="message-content">
          <div className="message-text">
            {message.content}
          </div>
          <div className="message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };
  
  // Get context usage color based on percentage
  const getContextUsageColor = () => {
    if (contextUsage < 50) return 'var(--color-success)';
    if (contextUsage < 80) return 'var(--color-warning)';
    return 'var(--color-error)';
  };
  
  // Render welcome screen with suggestion cards
  const renderWelcomeScreen = () => (
    <div className="welcome-screen">
      <Typography variant="h4" className="welcome-title">Lumina AI</Typography>
      <Typography variant="subtitle1" className="welcome-subtitle">
        Advanced AI assistant with memory tracking and visual thinking
      </Typography>
      
      <div className="suggestion-cards">
        <div className="suggestion-card" onClick={() => setInputValue("Write a detailed book outline with chapters and key plot points")}>
          <div className="card-icon">
            <Typography variant="h6">📝</Typography>
          </div>
          <div className="card-content">
            <Typography variant="h6">Write a detailed book outline</Typography>
            <Typography variant="body2">Create a chapter-by-chapter outline with key plot points</Typography>
          </div>
        </div>
        
        <div className="suggestion-card" onClick={() => setInputValue("Build a responsive website for a coffee shop with HTML, CSS, and JavaScript")}>
          <div className="card-icon">
            <Typography variant="h6">💻</Typography>
          </div>
          <div className="card-content">
            <Typography variant="h6">Build a responsive website</Typography>
            <Typography variant="body2">Generate HTML, CSS, and JavaScript with testing capabilities</Typography>
          </div>
        </div>
        
        <div className="suggestion-card" onClick={() => setInputValue("Analyze this sales data and create visualizations to show trends")}>
          <div className="card-icon">
            <Typography variant="h6">📊</Typography>
          </div>
          <div className="card-content">
            <Typography variant="h6">Analyze data and create visualizations</Typography>
            <Typography variant="body2">Process data and generate interactive charts</Typography>
          </div>
        </div>
        
        <div className="suggestion-card" onClick={() => setInputValue("Help me solve this complex problem with step-by-step reasoning")}>
          <div className="card-icon">
            <Typography variant="h6">🧠</Typography>
          </div>
          <div className="card-content">
            <Typography variant="h6">Solve a complex problem</Typography>
            <Typography variant="body2">Break down difficult problems with visual thinking</Typography>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render operator window
  const renderOperatorWindow = () => (
    <div className="operator-window">
      <div className="operator-header">
        <Typography variant="h6">Operator View</Typography>
        <IconButton size="small" onClick={toggleOperatorWindow}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="operator-content">
        {agentActions.map((action, index) => (
          <div key={index} className={`operator-entry ${action.type}`}>
            <div className="entry-timestamp">{new Date(action.timestamp).toLocaleTimeString()}</div>
            <div className="entry-content">{action.content}</div>
          </div>
        ))}
        {isProcessing && (
          <div className="operator-entry system">
            <div className="entry-timestamp">{new Date().toLocaleTimeString()}</div>
            <div className="entry-content">Processing user request...</div>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="chat-interface">
      <div className="chat-main">
        <Paper className="chat-container" elevation={3}>
          <div className="chat-header">
            <Typography variant="h6">{projectData?.title || "Conversation"}</Typography>
            <div className="header-actions">
              <Tooltip title="Memory Tracker">
                <IconButton 
                  size="small" 
                  onClick={toggleMemoryTracker}
                  color={showMemoryTracker ? "primary" : "default"}
                >
                  <MemoryIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Visual Thinking">
                <IconButton 
                  size="small" 
                  onClick={toggleVisualThinking}
                  color={showVisualThinking ? "primary" : "default"}
                >
                  <VisualThinkingIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Operator View">
                <IconButton 
                  size="small" 
                  onClick={toggleOperatorWindow}
                  color={showOperatorWindow ? "primary" : "default"}
                >
                  <OperatorIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Export">
                <IconButton 
                  size="small" 
                  onClick={toggleExportPanel}
                  color={showExportPanel ? "primary" : "default"}
                >
                  <ExportIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Testing Environment">
                <IconButton 
                  size="small" 
                  onClick={toggleTestingEnvironment}
                  color={showTestingEnvironment ? "primary" : "default"}
                >
                  <TestingIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Save Conversation">
                <IconButton
                  size="small"
                  onClick={handleSaveChat}
                  disabled={messages.length === 0}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          
          <div className="message-container" ref={messageContainerRef}>
            {messages.length === 0 ? (
              renderWelcomeScreen()
            ) : (
              messages.map(renderMessage)
            )}
            
            {isProcessing && (
              <div className="processing-indicator">
                <CircularProgress size={20} />
                <Typography variant="body2" color="textSecondary">
                  Processing...
                </Typography>
              </div>
            )}
          </div>
          
          <div className="input-container">
            <div className="context-indicator">
              <div className="context-bar">
                <div 
                  className="context-fill" 
                  style={{ 
                    width: `${contextUsage}%`,
                    backgroundColor: getContextUsageColor()
                  }}
                />
              </div>
              <Typography variant="caption" className="context-text">
                {contextUsage}% of context window used
              </Typography>
            </div>
            
            <div className="input-wrapper">
              <TextField
                className="message-input"
                placeholder="Ask anything..."
                multiline
                maxRows={4}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing}
                fullWidth
                variant="outlined"
                size="small"
              />
              
              <div className="input-buttons">
                <Tooltip title="Search">
                  <IconButton size="small" className="input-action">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Deep Research">
                  <IconButton size="small" className="input-action">
                    <DeepResearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Send">
                  <IconButton
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </Paper>
      </div>
      
      {showAgentActivity && (
        <div className="chat-sidebar">
          <AgentActivityPanel
            agentStatus={isProcessing ? 'working' : 'idle'}
            agentActions={agentActions}
            isUserControlling={false}
          />
        </div>
      )}
      
      {/* Memory Tracker Panel */}
      <Drawer
        anchor="right"
        open={showMemoryTracker}
        onClose={toggleMemoryTracker}
        className="feature-panel memory-panel"
      >
        <div className="panel-content">
          <div className="panel-header">
            <Typography variant="h6">Memory Tracker</Typography>
            <IconButton size="small" onClick={toggleMemoryTracker}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
          <Divider />
          <div className="memory-search">
            <TextField
              placeholder="Search memories..."
              size="small"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
              }}
            />
          </div>
          <div className="memory-items">
            {/* Memory items would be dynamically generated */}
            <div className="empty-state">
              <Typography variant="body2" color="textSecondary">
                Memories will appear here as you chat
              </Typography>
            </div>
          </div>
        </div>
      </Drawer>
      
      {/* Visual Thinking Panel */}
      <Drawer
        anchor="right"
        open={showVisualThinking}
        onClose={toggleVisualThinking}
        className="feature-panel thinking-panel"
      >
        <div className="panel-content">
          <div className="panel-header">
            <Typography variant="h6">Visual Thinking</Typography>
            <IconButton size="small" onClick={toggleVisualThinking}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
          <Divider />
          <div className="thinking-steps">
            {/* Thinking steps would be dynamically generated */}
            <div className="empty-state">
              <Typography variant="body2" color="textSecondary">
                AI reasoning steps will appear here during processing
              </Typography>
            </div>
          </div>
        </div>
      </Drawer>
      
      {/* Operator Window (Modal) */}
      {showOperatorWindow && renderOperatorWindow()}
      
      {/* Export Panel */}
      <Drawer
        anchor="right"
        open={showExportPanel}
        onClose={toggleExportPanel}
        className="feature-panel export-panel"
      >
        <div className="panel-content">
          <div className="panel-header">
            <Typography variant="h6">Export Options</Typography>
            <IconButton size="small" onClick={toggleExportPanel}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
          <Divider />
          <div className="export-options">
            <Typography variant="subtitle2">Export Format</Typography>
            <div className="export-format-options">
              {/* Export options would be dynamically generated */}
              <div className="empty-state">
                <Typography variant="body2" color="textSecondary">
                  Select content to export first
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      
      {/* Testing Environment (Full Screen) */}
      <Drawer
        anchor="bottom"
        open={showTestingEnvironment}
        onClose={toggleTestingEnvironment}
        className="feature-panel testing-panel"
        PaperProps={{ style: { height: '90vh' } }}
      >
        <div className="panel-content testing-environment">
          <div className="panel-header">
            <Typography variant="h6">Testing Environment</Typography>
            <IconButton size="small" onClick={toggleTestingEnvironment}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
          <Divider />
          <div className="testing-content">
            <Typography variant="body2" color="textSecondary">
              Testing environment will be initialized when code is generated
            </Typography>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

ChatInterface.propTypes = {
  workspaceId: PropTypes.string.isRequired,
  initialMessages: PropTypes.array,
  onSendMessage: PropTypes.func,
  onSaveChat: PropTypes.func,
  onUpdateChatLength: PropTypes.func,
  showAgentActivity: PropTypes.bool,
  projectData: PropTypes.object
};

export default ChatInterface;
