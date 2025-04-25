# Lumina AI End-User Interface Module
## Installation and Usage Guide

This document provides comprehensive instructions for installing, configuring, and using the Lumina AI End-User Interface Module. This module extends the enterprise management capabilities of Lumina AI with a powerful end-user interface similar to Manus AI but with enhanced features for long-term project memory tracking and chat length monitoring.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Component Documentation](#component-documentation)
5. [Usage Guide](#usage-guide)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)

## Overview

The Lumina AI End-User Interface Module provides a conversational interface for end-users to interact with the Lumina AI system. It includes the following key features:

- **Multi-workspace Management**: Organize different projects in separate workspaces
- **Chat Interface**: Natural language interaction with Lumina AI
- **Autonomous Task Panel**: Create and monitor tasks that Lumina AI can perform autonomously
- **Visual Thinking Display**: See the AI's reasoning process in real-time
- **Memory Tracking**: Specialized tracking for long-term projects like software development and book writing
- **Chat Length Monitoring**: Proactive notifications when approaching context limits

This module integrates seamlessly with the existing Lumina AI enterprise management system while providing a dedicated interface for end-users.

## Installation

### Prerequisites

- Node.js 16.x or higher
- React 18.x
- Material UI 5.x
- Existing Lumina AI installation

### Installation Steps

1. Clone the repository or copy the module files to your Lumina AI installation:

```bash
# If using git
git clone https://github.com/your-org/lumina-ai.git
cd lumina-ai

# Copy the end-user module files
cp -r /path/to/enduser-module/ui/enduser ./ui/
```

2. Install dependencies:

```bash
npm install
```

3. Add the EndUserInterface component to your application's routing:

```jsx
// In your App.jsx or routing configuration
import EndUserInterface from './ui/enduser/components/EndUserInterface';

// Add to your routes
<Route path="/enduser" element={
  <EndUserInterface 
    userId={currentUser.id}
    initialWorkspaces={userWorkspaces}
    onSendMessage={handleSendMessage}
    onCreateWorkspace={handleCreateWorkspace}
    onRenameWorkspace={handleRenameWorkspace}
    onDeleteWorkspace={handleDeleteWorkspace}
    onCreateTask={handleCreateTask}
    onCancelTask={handleCancelTask}
    onPauseTask={handlePauseTask}
    onResumeTask={handleResumeTask}
    onSaveChat={handleSaveChat}
  />
} />
```

4. Update your backend services to support the new end-user functionality:

```java
// In your Spring Boot application
@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {
    @Autowired
    private WorkspaceService workspaceService;
    
    @PostMapping
    public Workspace createWorkspace(@RequestBody WorkspaceRequest request) {
        return workspaceService.createWorkspace(request.getUserId(), request.getTitle());
    }
    
    // Add other endpoints for workspace management
}
```

## Configuration

The End-User Interface Module can be configured through props passed to the `EndUserInterface` component:

```jsx
<EndUserInterface
  // Required props
  userId="user-123"
  
  // Optional configuration
  initialTheme="system" // 'light', 'dark', or 'system'
  initialWorkspaces={[]} // Pre-loaded workspaces
  
  // Event handlers
  onSendMessage={handleSendMessage}
  onCreateWorkspace={handleCreateWorkspace}
  // ... other handlers
/>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `userId` | string | (required) | Unique identifier for the current user |
| `initialTheme` | string | 'system' | Initial theme setting ('light', 'dark', or 'system') |
| `initialWorkspaces` | array | [] | Pre-loaded workspaces for the user |
| `onSendMessage` | function | null | Handler for sending messages to the AI |
| `onCreateWorkspace` | function | null | Handler for creating new workspaces |
| `onRenameWorkspace` | function | null | Handler for renaming workspaces |
| `onDeleteWorkspace` | function | null | Handler for deleting workspaces |
| `onCreateTask` | function | null | Handler for creating autonomous tasks |
| `onCancelTask` | function | null | Handler for canceling tasks |
| `onPauseTask` | function | null | Handler for pausing tasks |
| `onResumeTask` | function | null | Handler for resuming tasks |
| `onSaveChat` | function | null | Handler for saving chat content |

## Component Documentation

### EndUserCoreFramework

The `EndUserCoreFramework` component provides the foundation for the end-user interface, including theme management, layout, and global features like chat length monitoring and memory tracking.

```jsx
import EndUserCoreFramework from './ui/enduser/components/EndUserCoreFramework';

<EndUserCoreFramework
  initialTheme="light"
  showMemoryTracker={true}
  showChatLengthIndicator={true}
>
  {/* Your content here */}
</EndUserCoreFramework>
```

### ChatInterface

The `ChatInterface` component provides the conversational interface for interacting with Lumina AI.

```jsx
import ChatInterface from './ui/enduser/components/ChatInterface';

<ChatInterface
  workspaceId="workspace-123"
  initialMessages={messages}
  onSendMessage={handleSendMessage}
  onSaveChat={handleSaveChat}
  onUpdateChatLength={handleUpdateChatLength}
  showAgentActivity={true}
/>
```

### WorkspaceManager

The `WorkspaceManager` component allows users to create, switch between, and manage workspaces.

```jsx
import WorkspaceManager from './ui/enduser/components/WorkspaceManager';

<WorkspaceManager
  workspaces={workspaces}
  activeWorkspaceId={activeWorkspaceId}
  onSwitchWorkspace={handleSwitchWorkspace}
  onCreateWorkspace={handleCreateWorkspace}
  onRenameWorkspace={handleRenameWorkspace}
  onDeleteWorkspace={handleDeleteWorkspace}
/>
```

### AutonomousTaskPanel

The `AutonomousTaskPanel` component allows users to create and monitor autonomous tasks.

```jsx
import AutonomousTaskPanel from './ui/enduser/components/AutonomousTaskPanel';

<AutonomousTaskPanel
  tasks={tasks}
  onCreateTask={handleCreateTask}
  onCancelTask={handleCancelTask}
  onPauseTask={handlePauseTask}
  onResumeTask={handleResumeTask}
  onViewTaskDetails={handleViewTaskDetails}
/>
```

### VisualThinkingDisplay

The `VisualThinkingDisplay` component shows the AI's reasoning process in real-time.

```jsx
import VisualThinkingDisplay from './ui/enduser/components/VisualThinkingDisplay';

<VisualThinkingDisplay
  currentTask="Processing user query"
  thinkingSteps={thinkingSteps}
  isVisible={true}
  onToggleVisibility={handleToggleVisibility}
/>
```

### MemoryTracker

The `MemoryTracker` component provides specialized tracking for long-term projects.

```jsx
import MemoryTracker from './ui/enduser/components/MemoryTracker';

<MemoryTracker
  projectType="book" // 'general', 'code', or 'book'
  projectId="project-123"
  projectName="My Book Project"
  memoryItems={memoryItems}
  onAddMemoryItem={handleAddMemoryItem}
  onRemoveMemoryItem={handleRemoveMemoryItem}
  onUpdateMemoryItem={handleUpdateMemoryItem}
/>
```

## Usage Guide

### Getting Started

1. Navigate to the end-user interface at `/enduser`
2. Create a new workspace or select an existing one
3. Start a conversation with Lumina AI by typing in the chat interface
4. Use the side panels to manage tasks, view AI reasoning, and track memory for long-term projects

### Creating and Managing Workspaces

Workspaces allow you to organize different projects or conversations:

1. Click the "New" button in the workspace manager
2. Enter a name for your workspace
3. Click the checkmark to create the workspace
4. Switch between workspaces by clicking on their tabs
5. Rename or delete workspaces using the options menu (three dots)

### Chatting with Lumina AI

The chat interface allows natural language interaction with Lumina AI:

1. Type your message in the input field
2. Press Enter or click the send button
3. View Lumina AI's response in the chat
4. Use the "Save" button to save the conversation when needed

### Creating Autonomous Tasks

Autonomous tasks allow Lumina AI to perform complex operations independently:

1. Click "New Task" in the Autonomous Tasks panel
2. Describe the task you want Lumina AI to perform
3. Click "Create Task" to start the task
4. Monitor the task's progress in the tasks list
5. View details, pause, resume, or cancel tasks as needed

### Using the Memory Tracker

The Memory Tracker helps maintain context for long-term projects:

1. Click "Add Memory" in the Memory Tracker panel
2. Enter the information you want to remember
3. Select a category (Fact, Decision, Context, or Reference)
4. Click "Save" to add the memory item
5. View, update importance, or remove memory items as needed

### Monitoring Chat Length

The interface automatically monitors chat length and provides notifications:

1. Watch the chat length indicator in the status bar
2. Receive warnings when approaching the context limit
3. Save your chat when prompted to avoid losing context
4. Start a new conversation if needed

## Advanced Features

### Visual Thinking

The Visual Thinking Display shows how Lumina AI approaches problems:

1. Send a complex query to Lumina AI
2. Watch as the AI's reasoning process is displayed step by step
3. See observations, thoughts, decisions, actions, and results
4. Use this information to better understand how Lumina AI works

### Project-Specific Memory Tracking

Memory tracking adapts to different project types:

1. **Book Writing**: Track characters, plot points, settings, and themes
2. **Software Development**: Track architecture decisions, requirements, and implementation details
3. **General Projects**: Track facts, decisions, context, and references

### Collaborative Features

Multiple users can work together in the same workspace:

1. Share workspace IDs with collaborators
2. See real-time updates as others interact with Lumina AI
3. View shared memory items and task progress
4. Maintain a consistent context across team members

## Troubleshooting

### Common Issues

#### Chat Interface Not Loading

**Problem**: The chat interface appears blank or doesn't load.

**Solution**:
1. Check your browser console for errors
2. Verify that all dependencies are installed
3. Ensure the backend services are running
4. Clear browser cache and reload

#### Messages Not Sending

**Problem**: Messages appear to send but no response is received.

**Solution**:
1. Check network connectivity
2. Verify backend service status
3. Check authentication status
4. Ensure the workspace ID is valid

#### Memory Items Not Saving

**Problem**: Memory items don't save or disappear after refresh.

**Solution**:
1. Check backend storage service
2. Verify database connectivity
3. Check for validation errors in the console
4. Ensure the project ID is valid

### Getting Help

If you encounter issues not covered in this guide:

1. Check the Lumina AI documentation
2. Review the console logs for errors
3. Contact support at support@lumina-ai.com
4. File an issue on the GitHub repository

## API Reference

### Backend API Endpoints

The End-User Interface Module requires the following backend API endpoints:

#### Workspace Management

- `POST /api/workspaces` - Create a new workspace
- `GET /api/workspaces` - Get all workspaces for a user
- `GET /api/workspaces/{id}` - Get a specific workspace
- `PUT /api/workspaces/{id}` - Update a workspace
- `DELETE /api/workspaces/{id}` - Delete a workspace

#### Messages

- `POST /api/workspaces/{id}/messages` - Send a message
- `GET /api/workspaces/{id}/messages` - Get all messages in a workspace

#### Tasks

- `POST /api/workspaces/{id}/tasks` - Create a task
- `GET /api/workspaces/{id}/tasks` - Get all tasks in a workspace
- `PUT /api/workspaces/{id}/tasks/{taskId}` - Update a task
- `DELETE /api/workspaces/{id}/tasks/{taskId}` - Delete a task

#### Memory Items

- `POST /api/workspaces/{id}/memory` - Add a memory item
- `GET /api/workspaces/{id}/memory` - Get all memory items in a workspace
- `PUT /api/workspaces/{id}/memory/{itemId}` - Update a memory item
- `DELETE /api/workspaces/{id}/memory/{itemId}` - Delete a memory item

### Data Models

#### Workspace

```typescript
interface Workspace {
  id: string;
  title: string;
  userId: string;
  createdAt: number;
  lastActivity: number;
  messages: Message[];
  tasks: Task[];
  memoryItems: MemoryItem[];
  projectType?: 'general' | 'code' | 'book';
}
```

#### Message

```typescript
interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thinking?: {
    task: string;
    steps: ThinkingStep[];
  };
}
```

#### Task

```typescript
interface Task {
  id: string;
  userId: string;
  workspaceId: string;
  description: string;
  parameters: Record<string, any>;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'cancelled' | 'failed';
  progress: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  isDetailsVisible: boolean;
  details: {
    steps: { description: string; completed: boolean }[];
    result?: string;
  };
}
```

#### MemoryItem

```typescript
interface MemoryItem {
  id: string;
  text: string;
  category: 'fact' | 'decision' | 'context' | 'reference';
  timestamp: number;
  importance: 'low' | 'medium' | 'high';
}
```

#### ThinkingStep

```typescript
interface ThinkingStep {
  type: 'observation' | 'thought' | 'decision' | 'action' | 'result';
  content: string;
  details?: string;
}
```
