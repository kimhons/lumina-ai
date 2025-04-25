import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Memory as MemoryIcon, Book as BookIcon, Code as CodeIcon } from '@mui/icons-material';
import '../styles/MemoryTracker.css';

/**
 * MemoryTracker component provides specialized tracking for long-term projects
 * like software development and book writing to maintain context and coherence.
 */
const MemoryTracker = ({
  projectType = 'general', // 'general', 'code', 'book'
  projectId,
  projectName,
  memoryItems = [],
  onAddMemoryItem,
  onRemoveMemoryItem,
  onUpdateMemoryItem
}) => {
  // State for memory items
  const [items, setItems] = useState(memoryItems);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('fact');
  
  // Update items when memoryItems prop changes
  useEffect(() => {
    setItems(memoryItems);
  }, [memoryItems]);
  
  // Get icon based on project type
  const getProjectIcon = () => {
    switch (projectType) {
      case 'code':
        return <CodeIcon />;
      case 'book':
        return <BookIcon />;
      default:
        return <MemoryIcon />;
    }
  };
  
  // Get icon based on memory item category
  const getItemIcon = (category) => {
    switch (category) {
      case 'fact':
        return <span className="memory-icon fact">F</span>;
      case 'decision':
        return <span className="memory-icon decision">D</span>;
      case 'context':
        return <span className="memory-icon context">C</span>;
      case 'reference':
        return <span className="memory-icon reference">R</span>;
      default:
        return <span className="memory-icon">•</span>;
    }
  };
  
  // Handle adding a new memory item
  const handleAddItem = () => {
    if (isAddingItem && newItemText.trim()) {
      const newItem = {
        id: `memory-${Date.now()}`,
        text: newItemText.trim(),
        category: newItemCategory,
        timestamp: Date.now(),
        importance: 'medium'
      };
      
      if (onAddMemoryItem) {
        onAddMemoryItem(newItem, projectId);
      }
      
      setItems(prev => [...prev, newItem]);
      setNewItemText('');
      setIsAddingItem(false);
    } else {
      setIsAddingItem(true);
    }
  };
  
  // Handle removing a memory item
  const handleRemoveItem = (itemId) => {
    if (onRemoveMemoryItem) {
      onRemoveMemoryItem(itemId, projectId);
    }
    
    setItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  // Handle toggling item expansion
  const handleToggleExpand = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };
  
  // Handle updating item importance
  const handleUpdateImportance = (itemId, importance) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, importance } : item
    );
    
    if (onUpdateMemoryItem) {
      const updatedItem = updatedItems.find(item => item.id === itemId);
      onUpdateMemoryItem(updatedItem, projectId);
    }
    
    setItems(updatedItems);
  };
  
  // Render memory item form
  const renderAddItemForm = () => {
    return (
      <div className="memory-item-form">
        <div className="memory-form-header">
          <Typography variant="subtitle2">Add Memory Item</Typography>
        </div>
        <textarea
          placeholder="Enter information to remember for this project..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          rows={3}
        />
        <div className="memory-form-controls">
          <div className="memory-category-selector">
            <label>Category:</label>
            <select 
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
            >
              <option value="fact">Fact</option>
              <option value="decision">Decision</option>
              <option value="context">Context</option>
              <option value="reference">Reference</option>
            </select>
          </div>
          <div className="memory-form-actions">
            <button 
              className="memory-save-button"
              onClick={handleAddItem}
              disabled={!newItemText.trim()}
            >
              Save
            </button>
            <button 
              className="memory-cancel-button"
              onClick={() => {
                setIsAddingItem(false);
                setNewItemText('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render a single memory item
  const renderMemoryItem = (item) => {
    const isExpanded = expandedItemId === item.id;
    
    return (
      <div 
        key={item.id} 
        className={`memory-item ${item.category} ${item.importance}`}
        onClick={() => handleToggleExpand(item.id)}
      >
        <div className="memory-item-header">
          <div className="memory-item-icon">
            {getItemIcon(item.category)}
          </div>
          <div className="memory-item-text">
            <Typography variant="body2">
              {isExpanded ? item.text : item.text.length > 100 ? `${item.text.substring(0, 100)}...` : item.text}
            </Typography>
          </div>
        </div>
        
        {isExpanded && (
          <div className="memory-item-details">
            <div className="memory-item-metadata">
              <Typography variant="caption" color="textSecondary">
                Added: {new Date(item.timestamp).toLocaleString()}
              </Typography>
              <div className="memory-importance-selector">
                <Typography variant="caption" color="textSecondary">
                  Importance:
                </Typography>
                <div className="importance-buttons">
                  <button 
                    className={`importance-button low ${item.importance === 'low' ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateImportance(item.id, 'low');
                    }}
                  >
                    Low
                  </button>
                  <button 
                    className={`importance-button medium ${item.importance === 'medium' ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateImportance(item.id, 'medium');
                    }}
                  >
                    Medium
                  </button>
                  <button 
                    className={`importance-button high ${item.importance === 'high' ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateImportance(item.id, 'high');
                    }}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
            <button 
              className="memory-remove-button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveItem(item.id);
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Paper className="memory-tracker" elevation={3}>
      <div className="memory-tracker-header">
        <div className="memory-project-info">
          <div className="memory-project-icon">
            {getProjectIcon()}
          </div>
          <Typography variant="h6">
            {projectName || `${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Memory`}
          </Typography>
        </div>
        <button 
          className="memory-add-button"
          onClick={handleAddItem}
          disabled={isAddingItem}
        >
          Add Memory
        </button>
      </div>
      
      {isAddingItem && renderAddItemForm()}
      
      <Divider />
      
      <div className="memory-items-container">
        {items.length === 0 ? (
          <div className="empty-memory">
            <Typography variant="body2" color="textSecondary">
              No memory items yet. Add important information to remember for this project.
            </Typography>
          </div>
        ) : (
          <div className="memory-items-list">
            {items.map(renderMemoryItem)}
          </div>
        )}
      </div>
    </Paper>
  );
};

MemoryTracker.propTypes = {
  projectType: PropTypes.oneOf(['general', 'code', 'book']),
  projectId: PropTypes.string,
  projectName: PropTypes.string,
  memoryItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      category: PropTypes.oneOf(['fact', 'decision', 'context', 'reference']).isRequired,
      timestamp: PropTypes.number.isRequired,
      importance: PropTypes.oneOf(['low', 'medium', 'high']).isRequired
    })
  ),
  onAddMemoryItem: PropTypes.func,
  onRemoveMemoryItem: PropTypes.func,
  onUpdateMemoryItem: PropTypes.func
};

export default MemoryTracker;
