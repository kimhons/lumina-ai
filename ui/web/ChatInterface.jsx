import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import { Send as SendIcon, Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AgentActivityPanel from '../../shared/AgentActivityPanel';
import '../styles/ChatInterface.css';

/**
 * ChatInterface component provides the main conversational interface
 * for end-users to interact with Lumina AI.
 */
const ChatInterface = ({
  workspaceId,
  initialMessages = [],
  onSendMessage,
  onSaveChat,
  onUpdateChatLength,
  showAgentActivity = true
}) => {
  // State for messages
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for agent activity
  const [agentActions, setAgentActions] = useState([]);
  
  // Reference for message container to auto-scroll
  const messageContainerRef = React.useRef(null);
  
  // Update chat length whenever messages change
  useEffect(() => {
    if (onUpdateChatLength) {
      // Calculate total length of all messages
      const totalLength = messages.reduce((total, msg) => {
        return total + (msg.content ? msg.content.length : 0);
      }, 0);
      
      onUpdateChatLength(totalLength);
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
  
  return (
    <div className="chat-interface">
      <div className="chat-main">
        <Paper className="chat-container" elevation={3}>
          <div className="chat-header">
            <Typography variant="h6">Conversation</Typography>
            <Button
              startIcon={<SaveIcon />}
              onClick={handleSaveChat}
              disabled={messages.length === 0}
              size="small"
            >
              Save
            </Button>
          </div>
          
          <div className="message-container" ref={messageContainerRef}>
            {messages.length === 0 ? (
              <div className="empty-chat">
                <Typography variant="body1" color="textSecondary">
                  Start a conversation with Lumina AI
                </Typography>
              </div>
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
            <TextField
              className="message-input"
              placeholder="Type your message..."
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
            <IconButton
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              color="primary"
            >
              <SendIcon />
            </IconButton>
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
    </div>
  );
};

ChatInterface.propTypes = {
  workspaceId: PropTypes.string.isRequired,
  initialMessages: PropTypes.array,
  onSendMessage: PropTypes.func,
  onSaveChat: PropTypes.func,
  onUpdateChatLength: PropTypes.func,
  showAgentActivity: PropTypes.bool
};

export default ChatInterface;
