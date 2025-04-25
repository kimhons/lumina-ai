import React, { useState, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, systemTheme } from './themes';
import { GlobalStyles } from './globalStyles';
import Navigation from './Navigation';
import AuthProvider from './AuthProvider';
import { useMediaQuery } from './hooks/useMediaQuery';
import './styles/CoreUIFramework.css';

// Create UI context for sharing UI state across components
const UIContext = createContext();

/**
 * Custom hook to access UI context
 */
export const useUI = () => useContext(UIContext);

/**
 * CoreUIFramework serves as the foundation for all Lumina AI interfaces.
 * It provides common layout, theming, authentication, responsive design, and accessibility features.
 */
const CoreUIFramework = ({ 
  children, 
  initialTheme = 'system',
  requireAuth = true,
  appTitle = 'Lumina AI',
  layout = 'default',
  contentWidth = 'standard',
  showFooter = true,
  footerContent = null
}) => {
  // Theme state management
  const [theme, setTheme] = useState(initialTheme);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  // Accessibility settings
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Check for system preference for reduced motion
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Initialize accessibility settings based on system preferences
  useEffect(() => {
    setReducedMotion(prefersReducedMotion);
  }, [prefersReducedMotion]);
  
  // Close sidebar automatically on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  // Get current theme object based on theme name
  const getCurrentTheme = () => {
    if (theme === 'system') {
      return prefersDarkMode ? darkTheme : lightTheme;
    }
    return theme === 'light' ? lightTheme : theme === 'dark' ? darkTheme : systemTheme;
  };
  
  // Toggle theme between light, dark, and system
  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };
  
  // Add a notification
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };
  
  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Change font size
  const changeFontSize = (size) => {
    setFontSize(size);
  };
  
  // Toggle high contrast mode
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };
  
  // Toggle reduced motion
  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };
  
  // Context value for UI state
  const uiContextValue = {
    theme,
    setTheme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    isMobile,
    isTablet,
    isDesktop,
    fontSize,
    changeFontSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    notifications,
    addNotification,
    removeNotification,
    notificationsOpen,
    toggleNotifications
  };
  
  // Get content width class
  const getContentWidthClass = () => {
    switch (contentWidth) {
      case 'narrow':
        return 'content-narrow';
      case 'wide':
        return 'content-wide';
      case 'full':
        return 'content-full';
      default:
        return 'content-standard';
    }
  };
  
  // Get layout class
  const getLayoutClass = () => {
    switch (layout) {
      case 'centered':
        return 'layout-centered';
      case 'minimal':
        return 'layout-minimal';
      case 'dashboard':
        return 'layout-dashboard';
      default:
        return 'layout-default';
    }
  };
  
  // Render user menu
  const renderUserMenu = () => {
    if (!userMenuOpen) return null;
    
    return (
      <div className="user-menu">
        <div className="user-menu-header">
          <span className="user-avatar">👤</span>
          <div className="user-info">
            <div className="user-name">User Name</div>
            <div className="user-email">user@example.com</div>
          </div>
        </div>
        <ul className="user-menu-items">
          <li className="user-menu-item">
            <a href="/settings/profile">Profile Settings</a>
          </li>
          <li className="user-menu-item">
            <a href="/settings/preferences">UI Preferences</a>
          </li>
          <li className="user-menu-item">
            <a href="/settings/accessibility">Accessibility</a>
          </li>
          <li className="user-menu-item">
            <a href="/logout">Sign Out</a>
          </li>
        </ul>
      </div>
    );
  };
  
  // Render notifications panel
  const renderNotifications = () => {
    if (!notificationsOpen) return null;
    
    return (
      <div className="notifications-panel">
        <div className="notifications-header">
          <h3>Notifications</h3>
          <button className="clear-all-btn">Clear All</button>
        </div>
        {notifications.length === 0 ? (
          <div className="no-notifications">No notifications</div>
        ) : (
          <ul className="notifications-list">
            {notifications.map(notification => (
              <li key={notification.id} className={`notification-item ${notification.type}`}>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
                <button 
                  className="notification-dismiss" 
                  onClick={() => removeNotification(notification.id)}
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  // Render accessibility controls
  const renderAccessibilityControls = () => {
    return (
      <div className="accessibility-controls">
        <div className="font-size-controls">
          <button 
            className={`font-size-btn ${fontSize === 'small' ? 'active' : ''}`}
            onClick={() => changeFontSize('small')}
            aria-label="Small font size"
          >
            A-
          </button>
          <button 
            className={`font-size-btn ${fontSize === 'medium' ? 'active' : ''}`}
            onClick={() => changeFontSize('medium')}
            aria-label="Medium font size"
          >
            A
          </button>
          <button 
            className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}
            onClick={() => changeFontSize('large')}
            aria-label="Large font size"
          >
            A+
          </button>
        </div>
        <button 
          className={`contrast-toggle ${highContrast ? 'active' : ''}`}
          onClick={toggleHighContrast}
          aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
        >
          High Contrast
        </button>
        <button 
          className={`motion-toggle ${reducedMotion ? 'active' : ''}`}
          onClick={toggleReducedMotion}
          aria-label={reducedMotion ? 'Enable animations' : 'Reduce animations'}
        >
          {reducedMotion ? 'Enable Animations' : 'Reduce Animations'}
        </button>
      </div>
    );
  };
  
  return (
    <AuthProvider requireAuth={requireAuth}>
      <UIContext.Provider value={uiContextValue}>
        <ThemeProvider theme={{
          ...getCurrentTheme(),
          highContrast,
          fontSize,
          reducedMotion
        }}>
          <GlobalStyles />
          <div 
            className={`lumina-app ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} 
                        ${getLayoutClass()} ${getContentWidthClass()} 
                        font-${fontSize} ${highContrast ? 'high-contrast' : ''} 
                        ${reducedMotion ? 'reduced-motion' : ''}`}
          >
            {layout !== 'minimal' && (
              <header className="app-header">
                <div className="header-left">
                  <button 
                    className="sidebar-toggle" 
                    onClick={toggleSidebar}
                    aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                  >
                    ☰
                  </button>
                  <h1 className="app-title">{appTitle}</h1>
                </div>
                <div className="header-right">
                  <div className="accessibility-toggle">
                    <button 
                      className="a11y-toggle-btn"
                      aria-label="Accessibility options"
                      onClick={() => document.getElementById('a11y-controls').classList.toggle('open')}
                    >
                      ♿
                    </button>
                    <div id="a11y-controls" className="a11y-controls">
                      {renderAccessibilityControls()}
                    </div>
                  </div>
                  <button 
                    className="notifications-toggle" 
                    onClick={toggleNotifications}
                    aria-label="Notifications"
                  >
                    🔔
                    {notifications.length > 0 && (
                      <span className="notification-badge">{notifications.length}</span>
                    )}
                  </button>
                  <button 
                    className="theme-toggle" 
                    onClick={toggleTheme}
                    aria-label={`Current theme: ${theme}. Click to change.`}
                  >
                    {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '🌓'}
                  </button>
                  <div className="user-controls">
                    <span className="user-name">User Name</span>
                    <button 
                      className="user-menu-button" 
                      onClick={toggleUserMenu}
                      aria-label="User menu"
                      aria-expanded={userMenuOpen}
                    >
                      ▾
                    </button>
                    {renderUserMenu()}
                  </div>
                </div>
              </header>
            )}
            
            {renderNotifications()}
            
            <div className="app-body">
              {layout !== 'minimal' && <Navigation isOpen={sidebarOpen} />}
              <main className="content-area">
                {children}
              </main>
            </div>
            
            {showFooter && (
              <footer className="app-footer">
                <div className="footer-content">
                  {footerContent ? (
                    footerContent
                  ) : (
                    <>
                      <span>© 2025 Lumina AI</span>
                      <span>Version 1.0.0</span>
                    </>
                  )}
                </div>
              </footer>
            )}
          </div>
        </ThemeProvider>
      </UIContext.Provider>
    </AuthProvider>
  );
};

CoreUIFramework.propTypes = {
  children: PropTypes.node.isRequired,
  initialTheme: PropTypes.oneOf(['light', 'dark', 'system']),
  requireAuth: PropTypes.bool,
  appTitle: PropTypes.string,
  layout: PropTypes.oneOf(['default', 'centered', 'minimal', 'dashboard']),
  contentWidth: PropTypes.oneOf(['standard', 'narrow', 'wide', 'full']),
  showFooter: PropTypes.bool,
  footerContent: PropTypes.node
};

export default CoreUIFramework;
