import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Tabs, Tab, Button, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import '../styles/WorkspaceManager.css';

/**
 * WorkspaceManager component provides functionality to manage multiple
 * workspaces for organizing conversations and tasks.
 */
const WorkspaceManager = ({
  workspaces = [],
  activeWorkspaceId,
  onSwitchWorkspace,
  onCreateWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace
}) => {
  // State for workspace tabs
  const [value, setValue] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState('');
  
  // Update selected tab when active workspace changes
  useEffect(() => {
    if (activeWorkspaceId && workspaces.length > 0) {
      const index = workspaces.findIndex(w => w.id === activeWorkspaceId);
      if (index !== -1) {
        setValue(index);
      }
    }
  }, [activeWorkspaceId, workspaces]);
  
  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (workspaces[newValue] && onSwitchWorkspace) {
      onSwitchWorkspace(workspaces[newValue].id);
    }
  };
  
  // Handle creating a new workspace
  const handleCreateWorkspace = () => {
    if (isCreating && newWorkspaceName.trim() && onCreateWorkspace) {
      onCreateWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
      setIsCreating(false);
    } else {
      setIsCreating(true);
    }
  };
  
  // Handle canceling workspace creation
  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewWorkspaceName('');
  };
  
  // Handle starting workspace rename
  const handleStartRename = (workspaceId, workspaceName) => {
    setEditingWorkspaceId(workspaceId);
    setEditingWorkspaceName(workspaceName);
  };
  
  // Handle completing workspace rename
  const handleCompleteRename = () => {
    if (editingWorkspaceId && editingWorkspaceName.trim() && onRenameWorkspace) {
      onRenameWorkspace(editingWorkspaceId, editingWorkspaceName.trim());
    }
    setEditingWorkspaceId(null);
    setEditingWorkspaceName('');
  };
  
  // Handle canceling workspace rename
  const handleCancelRename = () => {
    setEditingWorkspaceId(null);
    setEditingWorkspaceName('');
  };
  
  // Handle deleting a workspace
  const handleDeleteWorkspace = (workspaceId) => {
    if (onDeleteWorkspace) {
      onDeleteWorkspace(workspaceId);
    }
  };
  
  // Render workspace tabs
  const renderWorkspaceTabs = () => {
    return (
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        className="workspace-tabs"
      >
        {workspaces.map((workspace) => (
          <Tab
            key={workspace.id}
            label={
              editingWorkspaceId === workspace.id ? (
                <div className="workspace-edit-container">
                  <input
                    type="text"
                    value={editingWorkspaceName}
                    onChange={(e) => setEditingWorkspaceName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCompleteRename();
                      } else if (e.key === 'Escape') {
                        handleCancelRename();
                      }
                    }}
                    autoFocus
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteRename();
                    }}
                  >
                    ✓
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelRename();
                    }}
                  >
                    ✕
                  </IconButton>
                </div>
              ) : (
                <div className="workspace-tab-content">
                  <span>{workspace.title}</span>
                  <div className="workspace-tab-actions">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartRename(workspace.id, workspace.title);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkspace(workspace.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              )
            }
          />
        ))}
        
        {isCreating && (
          <Tab
            label={
              <div className="workspace-edit-container">
                <input
                  type="text"
                  placeholder="Workspace name"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateWorkspace();
                    } else if (e.key === 'Escape') {
                      handleCancelCreate();
                    }
                  }}
                  autoFocus
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateWorkspace();
                  }}
                >
                  ✓
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelCreate();
                  }}
                >
                  ✕
                </IconButton>
              </div>
            }
          />
        )}
      </Tabs>
    );
  };
  
  return (
    <div className="workspace-manager">
      <Paper className="workspace-header" elevation={1}>
        <div className="workspace-title">
          <Typography variant="h6">Workspaces</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleCreateWorkspace}
            disabled={isCreating}
            size="small"
          >
            New
          </Button>
        </div>
        {renderWorkspaceTabs()}
      </Paper>
    </div>
  );
};

WorkspaceManager.propTypes = {
  workspaces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lastActivity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  activeWorkspaceId: PropTypes.string,
  onSwitchWorkspace: PropTypes.func,
  onCreateWorkspace: PropTypes.func,
  onRenameWorkspace: PropTypes.func,
  onDeleteWorkspace: PropTypes.func
};

export default WorkspaceManager;
