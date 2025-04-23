import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Tabs, Tab, Button, IconButton, Divider, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Folder as FolderIcon, 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CreateNewFolder as CreateNewFolderIcon,
  FileCopy as FileCopyIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import '../styles/WorkspaceManager.css';

/**
 * Enhanced WorkspaceManager component provides functionality to manage multiple
 * workspaces and projects for organizing conversations and tasks.
 */
const WorkspaceManager = ({
  workspaces = [],
  activeWorkspaceId,
  onSwitchWorkspace,
  onCreateWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace,
  projects = [],
  activeProjectId,
  onSwitchProject,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  conversations = [],
  activeConversationId,
  onSwitchConversation
}) => {
  // State for workspace tabs
  const [value, setValue] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState('');
  
  // State for projects
  const [expandedProjects, setExpandedProjects] = useState({});
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  
  // State for project menu
  const [projectMenuAnchor, setProjectMenuAnchor] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
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
  
  // Toggle project expansion
  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };
  
  // Handle creating a new project
  const handleCreateProject = () => {
    if (isCreatingProject && newProjectName.trim() && onCreateProject) {
      onCreateProject(newProjectName.trim(), activeWorkspaceId);
      setNewProjectName('');
      setIsCreatingProject(false);
    } else {
      setIsCreatingProject(true);
    }
  };
  
  // Handle canceling project creation
  const handleCancelCreateProject = () => {
    setIsCreatingProject(false);
    setNewProjectName('');
  };
  
  // Handle starting project rename
  const handleStartRenameProject = (projectId, projectName) => {
    setEditingProjectId(projectId);
    setEditingProjectName(projectName);
  };
  
  // Handle completing project rename
  const handleCompleteRenameProject = () => {
    if (editingProjectId && editingProjectName.trim() && onRenameProject) {
      onRenameProject(editingProjectId, editingProjectName.trim());
    }
    setEditingProjectId(null);
    setEditingProjectName('');
  };
  
  // Handle canceling project rename
  const handleCancelRenameProject = () => {
    setEditingProjectId(null);
    setEditingProjectName('');
  };
  
  // Handle deleting a project
  const handleDeleteProject = (projectId) => {
    if (onDeleteProject) {
      onDeleteProject(projectId);
    }
  };
  
  // Handle opening project menu
  const handleOpenProjectMenu = (event, projectId) => {
    setProjectMenuAnchor(event.currentTarget);
    setSelectedProjectId(projectId);
  };
  
  // Handle closing project menu
  const handleCloseProjectMenu = () => {
    setProjectMenuAnchor(null);
    setSelectedProjectId(null);
  };
  
  // Handle switching to a conversation
  const handleSwitchConversation = (conversationId) => {
    if (onSwitchConversation) {
      onSwitchConversation(conversationId);
    }
  };
  
  // Get project conversations
  const getProjectConversations = (projectId) => {
    return conversations.filter(conv => conv.projectId === projectId);
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
  
  // Render projects section
  const renderProjects = () => {
    const workspaceProjects = projects.filter(p => p.workspaceId === activeWorkspaceId);
    
    return (
      <div className="projects-section">
        <div className="section-header">
          <Typography variant="subtitle1">Projects</Typography>
          <IconButton size="small" onClick={handleCreateProject}>
            <CreateNewFolderIcon fontSize="small" />
          </IconButton>
        </div>
        
        {isCreatingProject && (
          <div className="project-create-container">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateProject();
                } else if (e.key === 'Escape') {
                  handleCancelCreateProject();
                }
              }}
              autoFocus
            />
            <div className="project-create-actions">
              <IconButton size="small" onClick={handleCreateProject}>
                ✓
              </IconButton>
              <IconButton size="small" onClick={handleCancelCreateProject}>
                ✕
              </IconButton>
            </div>
          </div>
        )}
        
        {workspaceProjects.length === 0 && !isCreatingProject ? (
          <div className="empty-projects">
            <Typography variant="body2" color="textSecondary">
              No projects yet. Create one to organize your conversations.
            </Typography>
          </div>
        ) : (
          <div className="project-list">
            {workspaceProjects.map(project => (
              <div key={project.id} className="project-item">
                <div 
                  className={`project-header ${activeProjectId === project.id ? 'active' : ''}`}
                  onClick={() => toggleProjectExpansion(project.id)}
                >
                  <div className="project-header-content">
                    <FolderIcon fontSize="small" />
                    {editingProjectId === project.id ? (
                      <input
                        type="text"
                        value={editingProjectName}
                        onChange={(e) => setEditingProjectName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCompleteRenameProject();
                          } else if (e.key === 'Escape') {
                            handleCancelRenameProject();
                          }
                          e.stopPropagation();
                        }}
                        autoFocus
                      />
                    ) : (
                      <Typography variant="body2">{project.title}</Typography>
                    )}
                  </div>
                  <div className="project-header-actions">
                    {editingProjectId === project.id ? (
                      <>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteRenameProject();
                          }}
                        >
                          ✓
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelRenameProject();
                          }}
                        >
                          ✕
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProjectMenu(e, project.id);
                          }}
                        >
                          ⋮
                        </IconButton>
                        {expandedProjects[project.id] ? (
                          <ExpandLessIcon fontSize="small" />
                        ) : (
                          <ExpandMoreIcon fontSize="small" />
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {expandedProjects[project.id] && (
                  <div className="project-conversations">
                    {getProjectConversations(project.id).map(conversation => (
                      <div 
                        key={conversation.id} 
                        className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`}
                        onClick={() => handleSwitchConversation(conversation.id)}
                      >
                        <ChatIcon fontSize="small" />
                        <Typography variant="body2">
                          {conversation.title}
                          {conversation.version && ` v${conversation.version}`}
                        </Typography>
                      </div>
                    ))}
                    {getProjectConversations(project.id).length === 0 && (
                      <div className="empty-conversations">
                        <Typography variant="body2" color="textSecondary">
                          No conversations in this project
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render recent conversations section
  const renderRecentConversations = () => {
    // Group conversations by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const todayConversations = conversations.filter(conv => {
      const convDate = new Date(conv.lastActivity || conv.createdAt);
      return convDate >= today && !conv.projectId;
    });
    
    const yesterdayConversations = conversations.filter(conv => {
      const convDate = new Date(conv.lastActivity || conv.createdAt);
      return convDate >= yesterday && convDate < today && !conv.projectId;
    });
    
    const lastWeekConversations = conversations.filter(conv => {
      const convDate = new Date(conv.lastActivity || conv.createdAt);
      return convDate >= lastWeek && convDate < yesterday && !conv.projectId;
    });
    
    return (
      <>
        {todayConversations.length > 0 && (
          <div className="recent-section">
            <Typography variant="subtitle1">Today</Typography>
            <div className="conversation-list">
              {todayConversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`}
                  onClick={() => handleSwitchConversation(conversation.id)}
                >
                  <ChatIcon fontSize="small" />
                  <Typography variant="body2">{conversation.title}</Typography>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {yesterdayConversations.length > 0 && (
          <div className="recent-section">
            <Typography variant="subtitle1">Yesterday</Typography>
            <div className="conversation-list">
              {yesterdayConversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`}
                  onClick={() => handleSwitchConversation(conversation.id)}
                >
                  <ChatIcon fontSize="small" />
                  <Typography variant="body2">{conversation.title}</Typography>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {lastWeekConversations.length > 0 && (
          <div className="recent-section">
            <Typography variant="subtitle1">Previous 7 Days</Typography>
            <div className="conversation-list">
              {lastWeekConversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`}
                  onClick={() => handleSwitchConversation(conversation.id)}
                >
                  <ChatIcon fontSize="small" />
                  <Typography variant="body2">{conversation.title}</Typography>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
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
      
      <div className="workspace-content">
        {renderProjects()}
        <Divider className="section-divider" />
        {renderRecentConversations()}
      </div>
      
      {/* Project Menu */}
      <Menu
        anchorEl={projectMenuAnchor}
        open={Boolean(projectMenuAnchor)}
        onClose={handleCloseProjectMenu}
      >
        <MenuItem onClick={() => {
          if (selectedProjectId) {
            const project = projects.find(p => p.id === selectedProjectId);
            if (project) {
              handleStartRenameProject(selectedProjectId, project.title);
            }
          }
          handleCloseProjectMenu();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedProjectId) {
            handleDeleteProject(selectedProjectId);
          }
          handleCloseProjectMenu();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
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
  onDeleteWorkspace: PropTypes.func,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      workspaceId: PropTypes.string.isRequired,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lastActivity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  activeProjectId: PropTypes.string,
  onSwitchProject: PropTypes.func,
  onCreateProject: PropTypes.func,
  onRenameProject: PropTypes.func,
  onDeleteProject: PropTypes.func,
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      projectId: PropTypes.string,
      version: PropTypes.number,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lastActivity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  activeConversationId: PropTypes.string,
  onSwitchConversation: PropTypes.func
};

export default WorkspaceManager;
