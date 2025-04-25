// Test script for Lumina AI UI interfaces
// This script tests all interfaces for functionality, responsiveness, and accessibility

// Import required testing libraries
const { test, expect } = require('@testing-library/react');
const { axe } = require('jest-axe');
const { render, screen, fireEvent } = require('@testing-library/react');
const { act } = require('react-dom/test-utils');
const userEvent = require('@testing-library/user-event').default;

// Import components to test
const CoreUIFramework = require('../core/CoreUIFramework').default;
const Dashboard = require('../dashboard/Dashboard').default;
const ConfigurationInterface = require('../config/ConfigurationInterface').default;
const AgentVisualization = require('../agents/AgentVisualization').default;
const MonitoringInterface = require('../monitoring/MonitoringInterface').default;
const IntegrationInterface = require('../integration/IntegrationInterface').default;
const Navigation = require('../core/Navigation').default;

// Mock data for testing
const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@lumina.ai',
  role: 'admin'
};

// Mock theme context
jest.mock('../core/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    toggleTheme: jest.fn()
  })
}));

// Mock notification context
jest.mock('../core/NotificationContext', () => ({
  useNotifications: () => ({
    notifications: [],
    addNotification: jest.fn(),
    removeNotification: jest.fn(),
    clearNotifications: jest.fn()
  })
}));

// Test Core UI Framework
describe('CoreUIFramework', () => {
  test('renders without crashing', () => {
    render(<CoreUIFramework appTitle="Test App" contentWidth="standard">
      <div>Test Content</div>
    </CoreUIFramework>);
    
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('applies different content widths', () => {
    const { rerender } = render(
      <CoreUIFramework appTitle="Test App" contentWidth="narrow">
        <div>Test Content</div>
      </CoreUIFramework>
    );
    
    let mainContent = screen.getByText('Test Content').closest('.main-content');
    expect(mainContent).toHaveClass('narrow');
    
    rerender(
      <CoreUIFramework appTitle="Test App" contentWidth="wide">
        <div>Test Content</div>
      </CoreUIFramework>
    );
    
    mainContent = screen.getByText('Test Content').closest('.main-content');
    expect(mainContent).toHaveClass('wide');
  });
  
  test('passes accessibility audit', async () => {
    const { container } = render(
      <CoreUIFramework appTitle="Test App" contentWidth="standard">
        <div>Test Content</div>
      </CoreUIFramework>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Test Navigation
describe('Navigation', () => {
  test('renders all navigation items', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Integration')).toBeInTheDocument();
  });
  
  test('highlights active navigation item', () => {
    render(<Navigation activePath="/dashboard" />);
    
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('active');
  });
  
  test('collapses on mobile view', () => {
    // Mock window.innerWidth for mobile view
    global.innerWidth = 480;
    global.dispatchEvent(new Event('resize'));
    
    render(<Navigation />);
    
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    expect(menuButton).toBeInTheDocument();
    
    // Test menu toggle
    fireEvent.click(menuButton);
    const navMenu = screen.getByRole('navigation');
    expect(navMenu).toHaveClass('expanded');
    
    // Reset window size
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });
  
  test('passes accessibility audit', async () => {
    const { container } = render(<Navigation />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Test Dashboard
describe('Dashboard', () => {
  test('renders all dashboard sections', () => {
    render(<Dashboard userId={mockUser.id} />);
    
    expect(screen.getByText('System Overview')).toBeInTheDocument();
    expect(screen.getByText('Active Deployments')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
  });
  
  test('displays loading state initially', () => {
    render(<Dashboard userId={mockUser.id} />);
    
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
    
    // Simulate data loading completion
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
  });
  
  test('refreshes data when refresh button is clicked', () => {
    render(<Dashboard userId={mockUser.id} />);
    
    // Simulate data loading completion
    act(() => {
      jest.runAllTimers();
    });
    
    const refreshButton = screen.getByLabelText('Refresh dashboard');
    fireEvent.click(refreshButton);
    
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });
  
  test('adapts layout for different screen sizes', () => {
    // Mock window.innerWidth for mobile view
    global.innerWidth = 480;
    global.dispatchEvent(new Event('resize'));
    
    const { container } = render(<Dashboard userId={mockUser.id} />);
    
    // Check if grid layout changes for mobile
    const dashboardGrid = container.querySelector('.dashboard-grid');
    expect(dashboardGrid).toHaveStyle('grid-template-columns: 1fr');
    
    // Reset window size
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
    
    // Re-render for desktop view
    const { container: desktopContainer } = render(<Dashboard userId={mockUser.id} />);
    const desktopGrid = desktopContainer.querySelector('.dashboard-grid');
    expect(desktopGrid).not.toHaveStyle('grid-template-columns: 1fr');
  });
  
  test('passes accessibility audit', async () => {
    const { container } = render(<Dashboard userId={mockUser.id} />);
    
    // Wait for data loading
    act(() => {
      jest.runAllTimers();
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Test Configuration Interface
describe('ConfigurationInterface', () => {
  test('renders all configuration sections', () => {
    render(<ConfigurationInterface userId={mockUser.id} />);
    
    expect(screen.getByText('Deployment Settings')).toBeInTheDocument();
    expect(screen.getByText('Provider Integration')).toBeInTheDocument();
    expect(screen.getByText('Governance Policies')).toBeInTheDocument();
    expect(screen.getByText('System Configuration')).toBeInTheDocument();
  });
  
  test('switches between configuration tabs', () => {
    render(<ConfigurationInterface userId={mockUser.id} />);
    
    // Default tab should be Deployment Settings
    expect(screen.getByText('Deployment Environment')).toBeInTheDocument();
    
    // Switch to Provider Integration tab
    fireEvent.click(screen.getByText('Provider Integration'));
    expect(screen.getByText('AI Provider Settings')).toBeInTheDocument();
    
    // Switch to Governance Policies tab
    fireEvent.click(screen.getByText('Governance Policies'));
    expect(screen.getByText('Content Safety')).toBeInTheDocument();
  });
  
  test('form validation works correctly', async () => {
    render(<ConfigurationInterface userId={mockUser.id} />);
    
    // Find a required input field
    const nameInput = screen.getByLabelText('Environment Name *');
    
    // Clear the input and try to submit
    userEvent.clear(nameInput);
    fireEvent.click(screen.getByText('Save Configuration'));
    
    // Validation error should appear
    expect(screen.getByText('Environment name is required')).toBeInTheDocument();
    
    // Fill the input and try again
    userEvent.type(nameInput, 'Production');
    fireEvent.click(screen.getByText('Save Configuration'));
    
    // Error should disappear
    expect(screen.queryByText('Environment name is required')).not.toBeInTheDocument();
  });
  
  test('passes accessibility audit', async () => {
    const { container } = render(<ConfigurationInterface userId={mockUser.id} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Test Agent Visualization Interface
describe('AgentVisualization', () => {
  test('renders agent network visualization', () => {
    render(<AgentVisualization userId={mockUser.id} />);
    
    expect(screen.getByText('Agent Network')).toBeInTheDocument();
    expect(screen.getByText('Agent Details')).toBeInTheDocument();
    expect(screen.getByText('Team Configuration')).toBeInTheDocument();
  });
  
  test('displays agent details when agent is selected', () => {
    render(<AgentVisualization userId={mockUser.id} />);
    
    // Wait for agents to load
    act(() => {
      jest.runAllTimers();
    });
    
    // Find and click on an agent node
    const agentNode = screen.getByTestId('agent-node-1');
    fireEvent.click(agentNode);
    
    // Agent details should be displayed
    expect(screen.getByText('Agent Details: Research Agent')).toBeInTheDocument();
  });
  
  test('allows creating new agent teams', () => {
    render(<AgentVisualization userId={mockUser.id} />);
    
    // Click on create team button
    fireEvent.click(screen.getByText('Create Team'));
    
    // Team creation modal should appear
    expect(screen.getByText('Create New Agent Team')).toBeInTheDocument();
    
    // Fill team name
    userEvent.type(screen.getByLabelText('Team Name'), 'Research Team');
    
    // Submit form
    fireEvent.click(screen.getByText('Create'));
    
    // Success message should appear
    expect(screen.getByText('Team created successfully')).toBeInTheDocument();
  });
  
  test('visualization is responsive', () => {
    // Mock window.innerWidth for mobile view
    global.innerWidth = 480;
    global.dispatchEvent(new Event('resize'));
    
    const { container } = render(<AgentVisualization userId={mockUser.id} />);
    
    // Check if visualization adapts for mobile
    const visualizationContainer = container.querySelector('.visualization-container');
    expect(visualizationContainer).toHaveClass('mobile-view');
    
    // Reset window size
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });
  
  test('passes accessibility audit', async () => {
    const { container } = render(<AgentVisualization userId={mockUser.id} />);
    
    // Wait for visualization to render
    act(() => {
      jest.runAllTimers();
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Test Monitoring Interface
describe('MonitoringInterface', () => {
  test('renders all monitoring sections', () => {
    render(<MonitoringInterface userId={mockUser.id} />);
    
    expect(screen.getByText('System Metrics')).toBeInTheDocument();
    expect(screen.getByText('Logs')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('Health Status')).toBeInTheDocument();
  });
  
  test('displays real-time metrics', () => {
    render(<MonitoringInterface userId={mockUser.id} />);
    
    // Wait for metrics to load
    act(() => {
      jest.runAllTimers();
    });
    
    // Check if metrics are displayed
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('API Requests')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
  });
  
  test('log filtering works correctly', () => {
    render(<MonitoringInterface userId={mockUser.id} />);
    
    // Wait for logs to load
    act(() => {
      jest.runAllTimers();
    });
    
    // Switch to Logs tab
    fireEvent.click(screen.getByText('Logs'));
    
    // Filter logs by error level
    fireEvent.change(screen.getByLabelText('Log Level'), { target: { value: 'error' } });
    
    // Only error logs should be displayed
    const logEntries = screen.getAllByTestId('log-entry');
    logEntries.forEach(entry => {
      expect(entry).toHaveClass('log-level-error');
    });
  });
  
  test('alert management works correctly', () => {
    render(<MonitoringInterface userId={mockUser.id} />);
    
    // Switch to Alerts tab
    fireEvent.click(screen.getByText('Alerts'));
    
    // Wait for alerts to load
    act(() => {
      jest.runAllTimers();
    });
    
    // Acknowledge an alert
    const acknowledgeButton = screen.getAllByText('Acknowledge')[0];
    fireEvent.click(acknowledgeButton);
    
    // Alert should be marked as acknowledged
    expect(screen.getByText('Alert acknowledged')).toBeInTheDocument();
  });
  
  test('passes accessibility audit', async () => {
    const { container } = render(<MonitoringInterface userId={mockUser.id} />);
    
    // Wait for data to load
    act(() => {
      jest.runAllTimers();
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Test Integration Interface
describe('IntegrationInterface', () => {
  test('renders all integration tabs', () => {
    render(<IntegrationInterface userId={mockUser.id} />);
    
    expect(screen.getByText('External Connections')).toBeInTheDocument();
    expect(screen.getByText('Data Mapping')).toBeInTheDocument();
    expect(screen.getByText('Integration Tests')).toBeInTheDocument();
    expect(screen.getByText('API Keys')).toBeInTheDocument();
    expect(screen.getByText('Webhooks')).toBeInTheDocument();
  });
  
  test('connection management works correctly', () => {
    render(<IntegrationInterface userId={mockUser.id} />);
    
    // Wait for connections to load
    act(() => {
      jest.runAllTimers();
    });
    
    // Add new connection
    fireEvent.click(screen.getByText('Add New Connection'));
    
    // Connection form should appear
    expect(screen.getByText('Add New Connection')).toBeInTheDocument();
    
    // Fill connection form
    userEvent.type(screen.getByLabelText('Connection Name'), 'Test Connection');
    userEvent.selectOptions(screen.getByLabelText('Connection Type'), ['crm']);
    userEvent.type(screen.getByLabelText('Service URL'), 'https://test-crm.example.com');
    
    // Submit form
    fireEvent.click(screen.getByText('Add Connection'));
    
    // Success message should appear
    expect(screen.getByText('Connection Added')).toBeInTheDocument();
  });
  
  test('API key management works correctly', () => {
    render(<IntegrationInterface userId={mockUser.id} />);
    
    // Switch to API Keys tab
    fireEvent.click(screen.getByText('API Keys'));
    
    // Wait for API keys to load
    act(() => {
      jest.runAllTimers();
    });
    
    // Generate new API key
    fireEvent.click(screen.getByText('Generate New API Key'));
    
    // API key form should appear
    expect(screen.getByText('Generate New API Key')).toBeInTheDocument();
    
    // Fill API key form
    userEvent.type(screen.getByLabelText('API Key Name'), 'Test API Key');
    
    // Submit form
    fireEvent.click(screen.getByText('Generate API Key'));
    
    // Success message should appear
    expect(screen.getByText('API Key Generated')).toBeInTheDocument();
  });
  
  test('data mapping interface works correctly', () => {
    render(<IntegrationInterface user
(Content truncated due to size limit. Use line ranges to read in chunks)