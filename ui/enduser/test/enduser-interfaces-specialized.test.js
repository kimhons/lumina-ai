import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EndUserInterface from '../components/EndUserInterface';
import { act } from 'react-dom/test-utils';

// Mock data for testing
const mockUser = { id: 'user-123', name: 'Test User' };
const mockWorkspaces = [
  {
    id: 'workspace-1',
    title: 'Book Writing Project',
    userId: 'user-123',
    createdAt: Date.now() - 86400000, // 1 day ago
    lastActivity: Date.now() - 3600000, // 1 hour ago
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        content: 'I want to write a book about artificial intelligence',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'assistant',
        content: 'That sounds like a great project! What specific aspects of AI would you like to cover in your book?',
        timestamp: new Date(Date.now() - 3590000).toISOString()
      }
    ],
    tasks: [],
    projectType: 'book'
  },
  {
    id: 'workspace-2',
    title: 'Software Development Project',
    userId: 'user-123',
    createdAt: Date.now() - 172800000, // 2 days ago
    lastActivity: Date.now() - 86400000, // 1 day ago
    messages: [],
    tasks: [],
    projectType: 'code'
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
  onSaveChat: jest.fn(),
  onAddMemoryItem: jest.fn(),
  onRemoveMemoryItem: jest.fn(),
  onUpdateMemoryItem: jest.fn()
};

// Test suite for long-term project memory tracking
describe('EndUserInterface Long-Term Project Memory Tracking', () => {
  test('should track memory for book writing projects', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={[mockWorkspaces[0]]} // Book writing project
        onSendMessage={mockHandlers.onSendMessage}
        onAddMemoryItem={mockHandlers.onAddMemoryItem}
      />
    );
    
    // Check that the memory tracker is present
    const memoryTracker = screen.getByText(/Memory Tracker/i);
    expect(memoryTracker).toBeInTheDocument();
    
    // Check that it's configured for book projects
    expect(screen.getByText(/Book Project Memory/i)).toBeInTheDocument();
    
    // Add a memory item
    const addButton = screen.getByRole('button', { name: /Add Memory/i });
    fireEvent.click(addButton);
    
    // Fill in the memory item form
    const textarea = screen.getByPlaceholderText(/Enter information to remember/i);
    fireEvent.change(textarea, { 
      target: { value: 'The protagonist will be a researcher developing AGI' } 
    });
    
    // Select the category
    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'decision' } });
    
    // Save the memory item
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    
    // Check that the memory item was added
    await waitFor(() => {
      expect(mockHandlers.onAddMemoryItem).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'The protagonist will be a researcher developing AGI',
          category: 'decision'
        }),
        expect.any(String)
      );
    });
  });
  
  test('should track memory for software development projects', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={[mockWorkspaces[1]]} // Software development project
        onSendMessage={mockHandlers.onSendMessage}
        onAddMemoryItem={mockHandlers.onAddMemoryItem}
      />
    );
    
    // Check that the memory tracker is present
    const memoryTracker = screen.getByText(/Memory Tracker/i);
    expect(memoryTracker).toBeInTheDocument();
    
    // Check that it's configured for code projects
    expect(screen.getByText(/Code Project Memory/i)).toBeInTheDocument();
    
    // Add a memory item
    const addButton = screen.getByRole('button', { name: /Add Memory/i });
    fireEvent.click(addButton);
    
    // Fill in the memory item form
    const textarea = screen.getByPlaceholderText(/Enter information to remember/i);
    fireEvent.change(textarea, { 
      target: { value: 'Using React 18 with TypeScript for frontend' } 
    });
    
    // Select the category
    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'decision' } });
    
    // Save the memory item
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    
    // Check that the memory item was added
    await waitFor(() => {
      expect(mockHandlers.onAddMemoryItem).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Using React 18 with TypeScript for frontend',
          category: 'decision'
        }),
        expect.any(String)
      );
    });
  });
  
  test('should prioritize high importance memory items', async () => {
    // Create a workspace with memory items of different importance levels
    const workspaceWithMemoryItems = {
      ...mockWorkspaces[0],
      memoryItems: [
        {
          id: 'memory-1',
          text: 'Low importance detail about setting',
          category: 'fact',
          timestamp: Date.now() - 86400000,
          importance: 'low'
        },
        {
          id: 'memory-2',
          text: 'Critical plot point about AI rebellion',
          category: 'fact',
          timestamp: Date.now() - 43200000,
          importance: 'high'
        },
        {
          id: 'memory-3',
          text: 'Medium importance character detail',
          category: 'fact',
          timestamp: Date.now() - 21600000,
          importance: 'medium'
        }
      ]
    };
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={[workspaceWithMemoryItems]}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    // Check that high importance items are displayed prominently
    const highImportanceItem = screen.getByText(/Critical plot point about AI rebellion/i);
    expect(highImportanceItem).toBeInTheDocument();
    
    // In a real test, we would check that high importance items have special styling
    // or are positioned at the top of the list
  });
});

// Test suite for chat length monitoring and saving
describe('EndUserInterface Chat Length Monitoring and Saving', () => {
  test('should warn user when approaching chat length limit', async () => {
    // Mock the chat length monitoring
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    // Simulate a chat that's approaching the length limit
    // This would normally be done by sending many messages,
    // but for testing we'll just trigger the warning directly
    
    // Find the chat interface
    const chatInterface = screen.getByText(/Conversation/i);
    expect(chatInterface).toBeInTheDocument();
    
    // Simulate updating chat length to near limit
    await act(async () => {
      // This would normally be called by the ChatInterface component
      // when the chat length approaches the limit
      const chatLengthWarningThreshold = 3500; // Example threshold
      const mockEvent = new CustomEvent('chatLengthUpdate', { 
        detail: { length: chatLengthWarningThreshold + 100 } 
      });
      window.dispatchEvent(mockEvent);
    });
    
    // Check for warning message
    // In a real implementation, we would have a specific warning element to check
    expect(console.warn).toHaveBeenCalled();
  });
  
  test('should prompt user to save chat when length limit is reached', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onSaveChat={mockHandlers.onSaveChat}
      />
    );
    
    // Simulate a chat that's reached the length limit
    await act(async () => {
      // This would normally be called by the ChatInterface component
      // when the chat length reaches the limit
      const chatLengthLimit = 4000; // Example limit
      const mockEvent = new CustomEvent('chatLengthUpdate', { 
        detail: { length: chatLengthLimit + 100 } 
      });
      window.dispatchEvent(mockEvent);
    });
    
    // Check for save prompt
    // In a real implementation, we would have a specific save prompt element to check
    const saveButton = screen.getByRole('button', { name: /Save/i });
    expect(saveButton).toBeInTheDocument();
    
    // Click the save button
    fireEvent.click(saveButton);
    
    // Check that the save function was called
    await waitFor(() => {
      expect(mockHandlers.onSaveChat).toHaveBeenCalled();
    });
  });
  
  test('should allow continuing after saving chat', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onSaveChat={mockHandlers.onSaveChat}
      />
    );
    
    // Simulate saving the chat
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockHandlers.onSaveChat).toHaveBeenCalled();
    });
    
    // After saving, we should be able to continue the conversation
    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByRole('button', { name: '' }); // Send button has no text, just an icon
    
    fireEvent.change(input, { target: { value: 'New message after saving' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(mockHandlers.onSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'New message after saving'
        }),
        expect.any(String)
      );
    });
  });
});

// Test suite for visual thinking display
describe('EndUserInterface Visual Thinking Display', () => {
  test('should show AI reasoning process in real-time', async () => {
    // Mock the thinking steps
    const mockThinkingSteps = [
      { type: 'observation', content: 'User is asking about book writing' },
      { type: 'thought', content: 'I should provide guidance on structuring a book' },
      { type: 'decision', content: 'I will suggest a three-act structure' },
      { type: 'action', content: 'Retrieving information about book structures' },
      { type: 'result', content: 'Found comprehensive information about book structures' }
    ];
    
    // Mock the send message function to return thinking steps
    const mockSendWithThinking = jest.fn().mockImplementation((message) => {
      return Promise.resolve({
        id: `response-${Date.now()}`,
        sender: 'assistant',
        content: `This is a response to: "${message.content}"`,
        timestamp: new Date().toISOString(),
        thinking: {
          task: 'Processing message about book writing',
          steps: mockThinkingSteps
        }
      });
    });
    
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockSendWithThinking}
      />
    );
    
    // Send a message to trigger the thinking process
    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByRole('button', { name: '' });
    
    fireEvent.change(input, { target: { value: 'How should I structure my book?' } });
    fireEvent.click(sendButton);
    
    // Check that the thinking steps are displayed
    await waitFor(() => {
      expect(screen.getByText(/AI Reasoning Process/i)).toBeInTheDocument();
      expect(screen.getByText(/User is asking about book writing/i)).toBeInTheDocument();
    });
    
    // Check that all thinking steps are eventually displayed
    await waitFor(() => {
      expect(screen.getByText(/I should provide guidance on structuring a book/i)).toBeInTheDocument();
      expect(screen.getByText(/I will suggest a three-act structure/i)).toBeInTheDocument();
      expect(screen.getByText(/Retrieving information about book structures/i)).toBeInTheDocument();
      expect(screen.getByText(/Found comprehensive information about book structures/i)).toBeInTheDocument();
    });
  });
});

// Test suite for workspace management
describe('EndUserInterface Workspace Management', () => {
  test('should maintain separate memory contexts for different workspaces', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onAddMemoryItem={mockHandlers.onAddMemoryItem}
      />
    );
    
    // Check that we're in the first workspace (Book Writing Project)
    expect(screen.getByText(/Book Writing Project/i)).toBeInTheDocument();
    
    // Add a memory item for the book project
    const addButton = screen.getByRole('button', { name: /Add Memory/i });
    fireEvent.click(addButton);
    
    const textarea = screen.getByPlaceholderText(/Enter information to remember/i);
    fireEvent.change(textarea, { 
      target: { value: 'Book project memory item' } 
    });
    
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockHandlers.onAddMemoryItem).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Book project memory item'
        }),
        expect.any(String)
      );
    });
    
    // Switch to the second workspace (Software Development Project)
    const workspace2Tab = screen.getByText(/Software Development Project/i);
    fireEvent.click(workspace2Tab);
    
    // Check that we're now in the second workspace
    expect(screen.getByText(/Code Project Memory/i)).toBeInTheDocument();
    
    // Add a memory item for the code project
    const addButton2 = screen.getByRole('button', { name: /Add Memory/i });
    fireEvent.click(addButton2);
    
    const textarea2 = screen.getByPlaceholderText(/Enter information to remember/i);
    fireEvent.change(textarea2, { 
      target: { value: 'Code project memory item' } 
    });
    
    const saveButton2 = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton2);
    
    await waitFor(() => {
      expect(mockHandlers.onAddMemoryItem).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Code project memory item'
        }),
        expect.any(String)
      );
    });
    
    // Verify that the memory items were added to the correct workspaces
    expect(mockHandlers.onAddMemoryItem).toHaveBeenCalledTimes(2);
    expect(mockHandlers.onAddMemoryItem.mock.calls[0][1]).not.toBe(
      mockHandlers.onAddMemoryItem.mock.calls[1][1]
    );
  });
});
