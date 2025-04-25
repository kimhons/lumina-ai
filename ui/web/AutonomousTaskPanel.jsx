import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, CircularProgress, Button, Divider } from '@mui/material';
import { PlayArrow, Pause, Stop, Visibility, VisibilityOff } from '@mui/icons-material';
import '../styles/AutonomousTaskPanel.css';

/**
 * AutonomousTaskPanel component provides an interface for managing
 * autonomous tasks that can be executed by Lumina AI.
 */
const AutonomousTaskPanel = ({
  tasks = [],
  onCreateTask,
  onCancelTask,
  onPauseTask,
  onResumeTask,
  onViewTaskDetails
}) => {
  // State for task creation
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskParameters, setTaskParameters] = useState({});
  
  // State for task filtering
  const [filter, setFilter] = useState('active'); // 'active', 'completed', 'all'
  
  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'running', 'paused'].includes(task.status);
    if (filter === 'completed') return ['completed', 'cancelled', 'failed'].includes(task.status);
    return true;
  });
  
  // Handle creating a new task
  const handleCreateTask = () => {
    if (isCreatingTask && taskDescription.trim() && onCreateTask) {
      onCreateTask(taskDescription.trim(), taskParameters);
      setTaskDescription('');
      setTaskParameters({});
      setIsCreatingTask(false);
    } else {
      setIsCreatingTask(true);
    }
  };
  
  // Handle canceling task creation
  const handleCancelCreate = () => {
    setIsCreatingTask(false);
    setTaskDescription('');
    setTaskParameters({});
  };
  
  // Handle task action (cancel, pause, resume)
  const handleTaskAction = (taskId, action) => {
    if (action === 'cancel' && onCancelTask) {
      onCancelTask(taskId);
    } else if (action === 'pause' && onPauseTask) {
      onPauseTask(taskId);
    } else if (action === 'resume' && onResumeTask) {
      onResumeTask(taskId);
    } else if (action === 'view' && onViewTaskDetails) {
      onViewTaskDetails(taskId);
    }
  };
  
  // Get status icon based on task status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <CircularProgress size={16} />;
      case 'running':
        return <CircularProgress size={16} />;
      case 'paused':
        return <Pause fontSize="small" />;
      case 'completed':
        return <span className="status-icon completed">✓</span>;
      case 'cancelled':
        return <span className="status-icon cancelled">✕</span>;
      case 'failed':
        return <span className="status-icon failed">!</span>;
      default:
        return null;
    }
  };
  
  // Render task creation form
  const renderTaskCreationForm = () => {
    return (
      <div className="task-creation-form">
        <Typography variant="subtitle2">Create New Task</Typography>
        <textarea
          placeholder="Describe the task you want Lumina AI to perform autonomously..."
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          rows={3}
        />
        <div className="task-form-actions">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleCreateTask}
            disabled={!taskDescription.trim()}
          >
            Create Task
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCancelCreate}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };
  
  // Render a single task item
  const renderTaskItem = (task) => {
    const isActive = ['pending', 'running', 'paused'].includes(task.status);
    
    return (
      <div key={task.id} className={`task-item ${task.status}`}>
        <div className="task-header">
          <div className="task-status">
            {getStatusIcon(task.status)}
            <Typography variant="caption">{task.status.toUpperCase()}</Typography>
          </div>
          <div className="task-actions">
            {task.status === 'running' && (
              <Button
                size="small"
                startIcon={<Pause />}
                onClick={() => handleTaskAction(task.id, 'pause')}
              >
                Pause
              </Button>
            )}
            {task.status === 'paused' && (
              <Button
                size="small"
                startIcon={<PlayArrow />}
                onClick={() => handleTaskAction(task.id, 'resume')}
              >
                Resume
              </Button>
            )}
            {isActive && (
              <Button
                size="small"
                startIcon={<Stop />}
                onClick={() => handleTaskAction(task.id, 'cancel')}
              >
                Cancel
              </Button>
            )}
            <Button
              size="small"
              startIcon={task.isDetailsVisible ? <VisibilityOff /> : <Visibility />}
              onClick={() => handleTaskAction(task.id, 'view')}
            >
              {task.isDetailsVisible ? 'Hide' : 'View'}
            </Button>
          </div>
        </div>
        
        <div className="task-description">
          <Typography variant="body2">{task.description}</Typography>
        </div>
        
        {task.progress !== undefined && (
          <div className="task-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
            <Typography variant="caption">{task.progress}%</Typography>
          </div>
        )}
        
        {task.isDetailsVisible && task.details && (
          <div className="task-details">
            <Divider />
            <Typography variant="caption" color="textSecondary">
              Created: {new Date(task.createdAt).toLocaleString()}
            </Typography>
            {task.startedAt && (
              <Typography variant="caption" color="textSecondary">
                Started: {new Date(task.startedAt).toLocaleString()}
              </Typography>
            )}
            {task.completedAt && (
              <Typography variant="caption" color="textSecondary">
                Completed: {new Date(task.completedAt).toLocaleString()}
              </Typography>
            )}
            {task.details.steps && (
              <div className="task-steps">
                <Typography variant="caption" fontWeight="bold">Steps:</Typography>
                <ul>
                  {task.details.steps.map((step, index) => (
                    <li key={index}>
                      <Typography variant="caption">
                        {step.completed ? '✓' : '○'} {step.description}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {task.details.result && (
              <div className="task-result">
                <Typography variant="caption" fontWeight="bold">Result:</Typography>
                <Typography variant="caption">{task.details.result}</Typography>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Paper className="autonomous-task-panel" elevation={3}>
      <div className="task-panel-header">
        <Typography variant="h6">Autonomous Tasks</Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCreateTask}
          disabled={isCreatingTask}
        >
          New Task
        </Button>
      </div>
      
      {isCreatingTask && renderTaskCreationForm()}
      
      <div className="task-filter">
        <Button
          size="small"
          variant={filter === 'active' ? 'contained' : 'text'}
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          size="small"
          variant={filter === 'completed' ? 'contained' : 'text'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
        <Button
          size="small"
          variant={filter === 'all' ? 'contained' : 'text'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>
      
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-tasks">
            <Typography variant="body2" color="textSecondary">
              No {filter} tasks found
            </Typography>
          </div>
        ) : (
          filteredTasks.map(renderTaskItem)
        )}
      </div>
    </Paper>
  );
};

AutonomousTaskPanel.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      progress: PropTypes.number,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      startedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      completedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      isDetailsVisible: PropTypes.bool,
      details: PropTypes.object
    })
  ),
  onCreateTask: PropTypes.func,
  onCancelTask: PropTypes.func,
  onPauseTask: PropTypes.func,
  onResumeTask: PropTypes.func,
  onViewTaskDetails: PropTypes.func
};

export default AutonomousTaskPanel;
