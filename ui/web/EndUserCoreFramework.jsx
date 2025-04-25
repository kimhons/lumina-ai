import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CoreUIFramework from '../../core/CoreUIFramework';
import { useMediaQuery } from '../../core/hooks/useMediaQuery';
import '../styles/EndUserCoreFramework.css';

/**
 * EndUserCoreFramework extends the CoreUIFramework to provide
 * specialized layout and functionality for end-users.
 */
const EndUserCoreFramework = ({ 
  children, 
  initialTheme = 'system',
  requireAuth = true,
  showMemoryTracker = true,
  showChatLengthIndicator = true,
  ...props 
}) => {
  // State for memory tracking
  const [memoryUsage, setMemoryUsage] = useState({
    current: 0,
    max: 100000,
    critical: false
  });
  
  // State for chat length monitoring
  const [chatLength, setChatLength] = useState({
    current: 0,
    max: 4000,
    warning: false
  });
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  // Update memory usage periodically
  useEffect(() => {
    const updateMemoryUsage = () => {
      // In a real implementation, this would fetch from a service
      // For now, we'll simulate increasing memory usage
      setMemoryUsage(prev => {
        const newUsage = Math.min(prev.current + Math.random() * 5, prev.max);
        return {
          current: newUsage,
          max: prev.max,
          critical: newUsage > prev.max * 0.9
        };
      });
    };
    
    const interval = setInterval(updateMemoryUsage, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Update chat length when new messages are added
  const updateChatLength = (newLength) => {
    setChatLength({
      current: newLength,
      max: chatLength.max,
      warning: newLength > chatLength.max * 0.8
    });
  };
  
  // Custom footer content for end-user interface
  const endUserFooterContent = (
    <div className="enduser-footer-content">
      <div className="enduser-footer-left">
        <span>© 2025 Lumina AI</span>
        <span>Version 1.0.0</span>
      </div>
      
      {showMemoryTracker && (
        <div className={`memory-tracker ${memoryUsage.critical ? 'critical' : ''}`}>
          <span>Memory: </span>
          <div className="memory-bar">
            <div 
              className="memory-fill" 
              style={{ width: `${(memoryUsage.current / memoryUsage.max) * 100}%` }}
            ></div>
          </div>
          <span>{Math.round(memoryUsage.current / 1000)}K / {memoryUsage.max / 1000}K</span>
        </div>
      )}
      
      {showChatLengthIndicator && (
        <div className={`chat-length-indicator ${chatLength.warning ? 'warning' : ''}`}>
          <span>Chat Length: </span>
          <div className="length-bar">
            <div 
              className="length-fill" 
              style={{ width: `${(chatLength.current / chatLength.max) * 100}%` }}
            ></div>
          </div>
          <span>{chatLength.current} / {chatLength.max}</span>
        </div>
      )}
    </div>
  );
  
  return (
    <CoreUIFramework
      layout="centered"
      contentWidth="wide"
      appTitle="Lumina AI Assistant"
      initialTheme={initialTheme}
      requireAuth={requireAuth}
      showFooter={true}
      footerContent={endUserFooterContent}
      {...props}
    >
      <div className="enduser-container">
        {children}
      </div>
    </CoreUIFramework>
  );
};

EndUserCoreFramework.propTypes = {
  children: PropTypes.node.isRequired,
  initialTheme: PropTypes.oneOf(['light', 'dark', 'system']),
  requireAuth: PropTypes.bool,
  showMemoryTracker: PropTypes.bool,
  showChatLengthIndicator: PropTypes.bool
};

export default EndUserCoreFramework;
