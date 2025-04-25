import React from 'react';
import PropTypes from 'prop-types';
import { useUI } from '../CoreUIFramework';
import './styles/Navigation.css';

/**
 * Enhanced Navigation component for the Lumina AI application.
 * Provides sidebar navigation with collapsible sections, improved accessibility,
 * and responsive design.
 */
const Navigation = ({ isOpen }) => {
  const { isMobile, reducedMotion } = useUI();
  
  // Navigation sections data
  const navSections = [
    {
      id: 'core',
      title: 'Core',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard', active: true },
        { id: 'agents', label: 'Agents', icon: '🤖', href: '/agents' },
        { id: 'workflows', label: 'Workflows', icon: '🔄', href: '/workflows' }
      ]
    },
    {
      id: 'config',
      title: 'Configuration',
      items: [
        { id: 'deployment', label: 'Deployment', icon: '🚀', href: '/config/deployment' },
        { id: 'providers', label: 'Providers', icon: '🔌', href: '/config/providers' },
        { id: 'governance', label: 'Governance', icon: '⚖️', href: '/config/governance' }
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      items: [
        { id: 'performance', label: 'Performance', icon: '📈', href: '/monitoring/performance' },
        { id: 'logs', label: 'Logs', icon: '📝', href: '/monitoring/logs' },
        { id: 'alerts', label: 'Alerts', icon: '🔔', href: '/monitoring/alerts' }
      ]
    },
    {
      id: 'integration',
      title: 'Integration',
      items: [
        { id: 'connectors', label: 'Connectors', icon: '🔗', href: '/integration/connectors' },
        { id: 'apis', label: 'APIs', icon: '📡', href: '/integration/apis' },
        { id: 'webhooks', label: 'Webhooks', icon: '🪝', href: '/integration/webhooks' }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      items: [
        { id: 'profile', label: 'Profile', icon: '👤', href: '/settings/profile' },
        { id: 'team', label: 'Team', icon: '👥', href: '/settings/team' },
        { id: 'security', label: 'Security', icon: '🔒', href: '/settings/security' }
      ]
    }
  ];
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = React.useState(
    navSections.reduce((acc, section) => {
      acc[section.id] = true; // All sections expanded by default
      return acc;
    }, {})
  );
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Get current path to determine active item
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  };
  
  // Check if a nav item is active
  const isActive = (href) => {
    const currentPath = getCurrentPath();
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };
  
  return (
    <nav 
      className={`app-navigation ${isOpen ? 'open' : 'closed'}`}
      aria-hidden={isMobile && !isOpen}
      style={{
        transition: reducedMotion ? 'none' : 'transform 0.25s ease-in-out'
      }}
    >
      <div className="nav-scroll-container">
        {navSections.map(section => (
          <div key={section.id} className="nav-section">
            <button 
              className="nav-section-title"
              onClick={() => toggleSection(section.id)}
              aria-expanded={expandedSections[section.id]}
              aria-controls={`nav-items-${section.id}`}
            >
              <span>{section.title}</span>
              <span className={`section-toggle ${expandedSections[section.id] ? 'expanded' : 'collapsed'}`}>
                {expandedSections[section.id] ? '▾' : '▸'}
              </span>
            </button>
            <ul 
              id={`nav-items-${section.id}`}
              className={`nav-items ${expandedSections[section.id] ? 'expanded' : 'collapsed'}`}
              style={{
                height: expandedSections[section.id] ? 'auto' : '0',
                overflow: 'hidden',
                transition: reducedMotion ? 'none' : 'height 0.25s ease-in-out'
              }}
            >
              {section.items.map(item => {
                const active = isActive(item.href);
                return (
                  <li key={item.id} className={`nav-item ${active ? 'active' : ''}`}>
                    <a 
                      href={item.href} 
                      className="nav-link"
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                      <span className="nav-text">{item.label}</span>
                      {active && <span className="sr-only">(current)</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="nav-footer">
        <div className="nav-footer-content">
          <a href="/help" className="nav-footer-link">
            <span className="nav-icon">❓</span>
            <span className="nav-text">Help & Support</span>
          </a>
          <a href="/feedback" className="nav-footer-link">
            <span className="nav-icon">💬</span>
            <span className="nav-text">Send Feedback</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default Navigation;
