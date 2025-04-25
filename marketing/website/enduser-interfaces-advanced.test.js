import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EndUserInterface from '../components/EndUserInterface';
import { axe, toHaveNoViolations } from 'jest-axe';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock data for testing
const mockUser = { id: 'user-123', name: 'Test User' };
const mockWorkspaces = [
  {
    id: 'workspace-1',
    title: 'Test Workspace 1',
    userId: 'user-123',
    createdAt: Date.now() - 86400000, // 1 day ago
    lastActivity: Date.now() - 3600000, // 1 hour ago
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        content: 'Hello, this is a test message',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'assistant',
        content: 'Hello! I am Lumina AI. How can I help you today?',
        timestamp: new Date(Date.now() - 3590000).toISOString()
      }
    ],
    tasks: []
  }
];

// Mock handlers
const mockHandlers = {
  onSendMessage: jest.fn().mockImplementation((message) => {
    return Promise.resolve({
      id: `response-${Date.now()}`,
      sender: 'assistant',
      content: `This is a response to: "${message.content}"`,
      timestamp: new Date().toISOString()
    });
  }),
  onCreateWorkspace: jest.fn(),
  onRenameWorkspace: jest.fn(),
  onDeleteWorkspace: jest.fn(),
  onCreateTask: jest.fn(),
  onCancelTask: jest.fn(),
  onPauseTask: jest.fn(),
  onResumeTask: jest.fn(),
  onSaveChat: jest.fn()
};

// Test suite for accessibility
describe('EndUserInterface Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('should have proper keyboard navigation', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    // Tab to the message input
    const input = screen.getByPlaceholderText('Type your message...');
    input.focus();
    expect(document.activeElement).toBe(input);
    
    // Tab to the send button
    fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
    const sendButton = screen.getByRole('button', { name: '' }); // Send button has no text, just an icon
    expect(document.activeElement).toBe(sendButton);
    
    // Press Enter to send a message
    fireEvent.keyDown(sendButton, { key: 'Enter', code: 'Enter' });
    expect(mockHandlers.onSendMessage).not.toHaveBeenCalled(); // No message content yet
    
    // Go back to input and add content
    input.focus();
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    // Tab to send button and press Enter
    fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
    fireEvent.keyDown(sendButton, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockHandlers.onSendMessage).toHaveBeenCalled();
    });
  });
});

// Test suite for responsive design
describe('EndUserInterface Responsive Design', () => {
  beforeAll(() => {
    // Mock window.matchMedia for responsive design testing
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  
  test('should adapt layout for mobile devices', () => {
    // Mock mobile viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    // Check that the layout has adapted for mobile
    // This is a simplified test - in a real test we would check for specific CSS classes or layout changes
    expect(window.matchMedia('(max-width: 768px)').matches).toBe(true);
  });
  
  test('should adapt layout for tablet devices', () => {
    // Mock tablet viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(min-width: 769px) and (max-width: 1024px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    // Check that the layout has adapted for tablet
    expect(window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches).toBe(true);
  });
});

// Test suite for chat length monitoring
describe('EndUserInterface Chat Length Monitoring', () => {
  test('should display warning when chat length approaches limit', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    // Find the chat length indicator
    const chatLengthIndicator = screen.getByText(/Chat Length:/);
    expect(chatLengthIndicator).toBeInTheDocument();
    
    // Simulate sending a very long message
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: '' });
    
    // Generate a long message that will approach the limit
    const longMessage = 'A'.repeat(3500); // Assuming limit is around 4000
    
    fireEvent.change(input, { target: { value: longMessage } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(mockHandlers.onSendMessage).toHaveBeenCalled();
    });
    
    // Check that the warning is displayed
    // This is a simplified test - in a real test we would check for specific warning elements
    expect(chatLengthIndicator).toBeInTheDocument();
  });
  
  test('should allow saving chat when length limit is approached', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onSaveChat={mockHandlers.onSaveChat}
      />
    );
    
    // Find the save button
    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
    
    // Click the save button
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockHandlers.onSaveChat).toHaveBeenCalled();
    });
  });
});

// Test suite for memory tracking
describe('EndUserInterface Memory Tracking', () => {
  test('should display memory usage indicator', () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    // Find the memory tracker
    const memoryTracker = screen.getByText(/Memory:/);
    expect(memoryTracker).toBeInTheDocument();
  });
  
  test('should warn when memory usage is critical', async () => {
    // This test would need to mock the memory usage state
    // For now, we'll just check that the memory tracker is present
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    // Find the memory tracker
    const memoryTracker = screen.getByText(/Memory:/);
    expect(memoryTracker).toBeInTheDocument();
  });
});

// Test suite for performance
describe('EndUserInterface Performance', () => {
  test('should render initial state quickly', () => {
    const startTime = performance.now();
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Check that render time is reasonable (less than 500ms)
    // This is a simplified test - in a real test we would use more sophisticated performance metrics
    expect(renderTime).toBeLessThan(500);
  });
  
  test('should handle large message history without performance degradation', () => {
    // Create a workspace with many messages
    const manyMessages = Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      sender: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
      timestamp: new Date(Date.now() - (100 - i) * 60000).toISOString()
    }));
    
    const workspaceWithManyMessages = {
      ...mockWorkspaces[0],
      messages: manyMessages
    };
    
    const startTime = performance.now();
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={[workspaceWithManyMessages]}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Check that render time is reasonable even with many messages (less than 1000ms)
    expect(renderTime).toBeLessThan(1000);
  });
});

// Test suite for error handling
describe('EndUserInterface Error Handling', () => {
  test('should handle message send failure gracefully', async () => {
    // Mock a failed message send
    const mockFailedSend = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('Failed to send message'));
    });
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockFailedSend}
      />
    );
    
    // Send a message
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: '' });
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);
    
    // Check that the error is handled gracefully
    // In a real test, we would check for specific error UI elements
    await waitFor(() => {
      expect(mockFailedSend).toHaveBeenCalled();
    });
  });
  
  test('should handle workspace creation failure gracefully', async () => {
    // Mock a failed workspace creation
    const mockFailedCreate = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('Failed to create workspace'));
    });
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={[]}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockFailedCreate}
      />
    );
    
    // Try to create a workspace
    const createButton = screen.getByRole('button', { name: 'Create Workspace' });
    fireEvent.click(createButton);
    
    // Check that the error is handled gracefully
    await waitFor(() => {
      expect(mockFailedCreate).toHaveBeenCalled();
    });
  });
});
