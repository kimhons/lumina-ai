import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EndUserInterface from '../components/EndUserInterface';
import EndUserCoreFramework from '../components/EndUserCoreFramework';
import ChatInterface from '../components/ChatInterface';
import WorkspaceManager from '../components/WorkspaceManager';
import AutonomousTaskPanel from '../components/AutonomousTaskPanel';
import VisualThinkingDisplay from '../components/VisualThinkingDisplay';
import MemoryTracker from '../components/MemoryTracker';

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
    tasks: [
      {
        id: 'task-1',
        userId: 'user-123',
        workspaceId: 'workspace-1',
        description: 'Research quantum computing basics',
        status: 'completed',
        progress: 100,
        createdAt: Date.now() - 86400000,
        startedAt: Date.now() - 86000000,
        completedAt: Date.now() - 82800000,
        isDetailsVisible: false,
        details: {
          steps: [
            { description: 'Initialize task', completed: true },
            { description: 'Gather resources', completed: true },
            { description: 'Analyze information', completed: true },
            { description: 'Compile results', completed: true }
          ],
          result: 'Completed research on quantum computing basics'
        }
      }
    ]
  },
  {
    id: 'workspace-2',
    title: 'Test Workspace 2',
    userId: 'user-123',
    createdAt: Date.now() - 172800000, // 2 days ago
    lastActivity: Date.now() - 86400000, // 1 day ago
    messages: [],
    tasks: []
  }
];

const mockMemoryItems = [
  {
    id: 'memory-1',
    text: 'Quantum computing uses qubits instead of classical bits',
    category: 'fact',
    timestamp: Date.now() - 86400000,
    importance: 'high'
  },
  {
    id: 'memory-2',
    text: 'Decided to focus on quantum algorithms for machine learning',
    category: 'decision',
    timestamp: Date.now() - 43200000,
    importance: 'medium'
  }
];

const mockThinkingSteps = [
  { type: 'observation', content: 'User is asking about quantum computing' },
  { type: 'thought', content: 'I need to provide an introduction to quantum computing concepts' },
  { type: 'decision', content: 'I will explain qubits, superposition, and entanglement' },
  { type: 'action', content: 'Retrieving information about quantum computing basics' },
  { type: 'result', content: 'Found comprehensive information to construct a response' }
];

// Mock handlers
const mockHandlers = {
  onSendMessage: jest.fn().mockImplementation((message) => {
    return Promise.resolve({
      id: `response-${Date.now()}`,
      sender: 'assistant',
      content: `This is a response to: "${message.content}"`,
      timestamp: new Date().toISOString(),
      thinking: {
        task: 'Processing user message',
        steps: mockThinkingSteps
      }
    });
  }),
  onCreateWorkspace: jest.fn().mockImplementation((userId, title) => {
    return Promise.resolve({
      id: `workspace-${Date.now()}`,
      title,
      userId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      messages: [],
      tasks: []
    });
  }),
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

// Test suite for EndUserCoreFramework
describe('EndUserCoreFramework', () => {
  test('renders with correct theme', () => {
    render(
      <EndUserCoreFramework initialTheme="light">
        <div data-testid="test-content">Test Content</div>
      </EndUserCoreFramework>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });
  
  test('displays memory tracker when enabled', () => {
    render(
      <EndUserCoreFramework showMemoryTracker={true}>
        <div>Test Content</div>
      </EndUserCoreFramework>
    );
    
    expect(screen.getByText(/Memory:/)).toBeInTheDocument();
  });
  
  test('displays chat length indicator when enabled', () => {
    render(
      <EndUserCoreFramework showChatLengthIndicator={true}>
        <div>Test Content</div>
      </EndUserCoreFramework>
    );
    
    expect(screen.getByText(/Chat Length:/)).toBeInTheDocument();
  });
});

// Test suite for ChatInterface
describe('ChatInterface', () => {
  test('renders empty state correctly', () => {
    render(
      <ChatInterface
        workspaceId="workspace-1"
        initialMessages={[]}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    expect(screen.getByText(/Start a conversation with Lumina AI/)).toBeInTheDocument();
  });
  
  test('renders messages correctly', () => {
    render(
      <ChatInterface
        workspaceId="workspace-1"
        initialMessages={mockWorkspaces[0].messages}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    expect(screen.getByText('Hello! I am Lumina AI. How can I help you today?')).toBeInTheDocument();
  });
  
  test('sends message when user submits input', async () => {
    render(
      <ChatInterface
        workspaceId="workspace-1"
        initialMessages={[]}
        onSendMessage={mockHandlers.onSendMessage}
      />
    );
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: '' }); // Send button has no text, just an icon
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(mockHandlers.onSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test message',
          sender: 'user'
        }),
        'workspace-1'
      );
    });
  });
});

// Test suite for WorkspaceManager
describe('WorkspaceManager', () => {
  test('renders workspaces correctly', () => {
    render(
      <WorkspaceManager
        workspaces={mockWorkspaces}
        activeWorkspaceId={mockWorkspaces[0].id}
        onSwitchWorkspace={mockHandlers.onSwitchWorkspace}
      />
    );
    
    expect(screen.getByText('Test Workspace 1')).toBeInTheDocument();
    expect(screen.getByText('Test Workspace 2')).toBeInTheDocument();
  });
  
  test('creates new workspace when button is clicked', async () => {
    render(
      <WorkspaceManager
        workspaces={mockWorkspaces}
        activeWorkspaceId={mockWorkspaces[0].id}
        onSwitchWorkspace={jest.fn()}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    const newButton = screen.getByRole('button', { name: 'New' });
    fireEvent.click(newButton);
    
    // Now we should see the input field
    const input = screen.getByPlaceholderText('Workspace name');
    fireEvent.change(input, { target: { value: 'New Test Workspace' } });
    
    // Find the confirm button (✓) and click it
    const confirmButton = screen.getAllByRole('button')[3]; // This might be fragile, but it works for this test
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockHandlers.onCreateWorkspace).toHaveBeenCalledWith('New Test Workspace');
    });
  });
});

// Test suite for AutonomousTaskPanel
describe('AutonomousTaskPanel', () => {
  test('renders tasks correctly', () => {
    render(
      <AutonomousTaskPanel
        tasks={mockWorkspaces[0].tasks}
        onCancelTask={mockHandlers.onCancelTask}
        onViewTaskDetails={jest.fn()}
      />
    );
    
    expect(screen.getByText('Research quantum computing basics')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });
  
  test('creates new task when form is submitted', async () => {
    render(
      <AutonomousTaskPanel
        tasks={[]}
        onCreateTask={mockHandlers.onCreateTask}
      />
    );
    
    const newTaskButton = screen.getByRole('button', { name: 'New Task' });
    fireEvent.click(newTaskButton);
    
    const textarea = screen.getByPlaceholderText(/Describe the task/);
    fireEvent.change(textarea, { target: { value: 'Research AI ethics' } });
    
    const createButton = screen.getByRole('button', { name: 'Create Task' });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockHandlers.onCreateTask).toHaveBeenCalledWith(
        'Research AI ethics',
        expect.any(Object)
      );
    });
  });
});

// Test suite for VisualThinkingDisplay
describe('VisualThinkingDisplay', () => {
  test('renders thinking steps correctly', () => {
    render(
      <VisualThinkingDisplay
        currentTask="Processing user message"
        thinkingSteps={mockThinkingSteps}
        isVisible={true}
      />
    );
    
    expect(screen.getByText(/User is asking about quantum computing/)).toBeInTheDocument();
    expect(screen.getByText(/I need to provide an introduction/)).toBeInTheDocument();
    expect(screen.getByText(/I will explain qubits/)).toBeInTheDocument();
  });
  
  test('displays empty state when no thinking steps are provided', () => {
    render(
      <VisualThinkingDisplay
        currentTask="Waiting for user input"
        thinkingSteps={[]}
        isVisible={true}
      />
    );
    
    expect(screen.getByText(/Waiting for AI to begin reasoning/)).toBeInTheDocument();
  });
});

// Test suite for MemoryTracker
describe('MemoryTracker', () => {
  test('renders memory items correctly', () => {
    render(
      <MemoryTracker
        projectType="code"
        projectId="project-1"
        projectName="Quantum Computing Research"
        memoryItems={mockMemoryItems}
        onUpdateMemoryItem={mockHandlers.onUpdateMemoryItem}
      />
    );
    
    expect(screen.getByText(/Quantum computing uses qubits/)).toBeInTheDocument();
    expect(screen.getByText(/Decided to focus on quantum algorithms/)).toBeInTheDocument();
  });
  
  test('adds new memory item when form is submitted', async () => {
    render(
      <MemoryTracker
        projectType="code"
        projectId="project-1"
        projectName="Quantum Computing Research"
        memoryItems={[]}
        onAddMemoryItem={mockHandlers.onAddMemoryItem}
      />
    );
    
    const addButton = screen.getByRole('button', { name: 'Add Memory' });
    fireEvent.click(addButton);
    
    const textarea = screen.getByPlaceholderText(/Enter information to remember/);
    fireEvent.change(textarea, { target: { value: 'Quantum supremacy was achieved in 2019' } });
    
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockHandlers.onAddMemoryItem).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Quantum supremacy was achieved in 2019',
          category: 'fact'
        }),
        'project-1'
      );
    });
  });
});

// Test suite for EndUserInterface (integration tests)
describe('EndUserInterface Integration', () => {
  test('renders all components correctly', () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    // Check for WorkspaceManager
    expect(screen.getByText('Workspaces')).toBeInTheDocument();
    expect(screen.getByText('Test Workspace 1')).toBeInTheDocument();
    
    // Check for ChatInterface
    expect(screen.getByText('Conversation')).toBeInTheDocument();
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    
    // Check for AutonomousTaskPanel
    expect(screen.getByText('Autonomous Tasks')).toBeInTheDocument();
    expect(screen.getByText('Research quantum computing basics')).toBeInTheDocument();
  });
  
  test('sends message and updates UI', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: '' }); // Send button has no text, just an icon
    
    fireEvent.change(input, { target: { value: 'What is quantum computing?' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(mockHandlers.onSendMessage).toHaveBeenCalled();
      expect(screen.getByText('What is quantum computing?')).toBeInTheDocument();
    });
    
    // After response is received, check for thinking steps
    await waitFor(() => {
      expect(screen.getByText(/User is asking about quantum computing/)).toBeInTheDocument();
    });
  });
  
  test('creates new workspace and switches to it', async () => {
    render(
      <EndUserInterface
        userId={mockUser.id}
        initialWorkspaces={mockWorkspaces}
        onSendMessage={mockHandlers.onSendMessage}
        onCreateWorkspace={mockHandlers.onCreateWorkspace}
      />
    );
    
    const newButton = screen.getByRole('button', { name: 'New' });
    fireEvent.click(newButton);
    
    // Now we should see the input field
    const input = screen.getByPlaceholderText('Workspace name');
    fireEvent.change(input, { target: { value: 'AI Ethics Research' } });
    
    // Find the confirm button (✓) and click it
    const confirmButton = screen.getAllByRole('button')[3]; // This might be fragile, but it works for this test
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockHandlers.onCreateWorkspace).toHaveBeenCalledWith(
        mockUser.id,
        'AI Ethics Research'
      );
    });
  });
});
