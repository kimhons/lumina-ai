import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, ListItemIcon, Tooltip, CircularProgress } from '@mui/material';
import { Memory as MemoryIcon, Book as BookIcon, Code as CodeIcon, Search as SearchIcon, Star as StarIcon } from '@mui/icons-material';
import '../styles/MemoryTracker.css';

/**
 * Enhanced MemoryTracker component provides advanced memory tracking for long-term projects
 * with automatic memory extraction, semantic search, and cross-workspace references.
 */
const MemoryTracker = ({
  projectType = 'general', // 'general', 'code', 'book', 'research', 'data'
  projectId,
  projectName,
  memoryItems = [],
  onAddMemoryItem,
  onRemoveMemoryItem,
  onUpdateMemoryItem,
  onSearchMemory,
  conversationContext = {},
  relatedWorkspaces = []
}) => {
  // State for memory items
  const [items, setItems] = useState(memoryItems);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('fact');
  
  // State for memory search
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  // State for automatic memory extraction
  const [extractedMemories, setExtractedMemories] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  
  // State for memory visualization
  const [visualizationMode, setVisualizationMode] = useState('list'); // 'list', 'graph', 'timeline'
  
  // State for memory filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [importanceFilter, setImportanceFilter] = useState('all');
  
  // Update items when memoryItems prop changes
  useEffect(() => {
    setItems(memoryItems);
  }, [memoryItems]);
  
  // Extract memories from conversation context when it changes
  useEffect(() => {
    if (Object.keys(conversationContext).length > 0) {
      extractMemoriesFromContext(conversationContext);
    }
  }, [conversationContext]);
  
  // Extract memories from conversation context
  const extractMemoriesFromContext = async (context) => {
    if (!context.messages || context.messages.length === 0) return;
    
    setIsExtracting(true);
    
    try {
      // In a real implementation, this would call a backend service
      // For now, we'll simulate memory extraction
      
      // Get the last 5 messages or fewer if there are less
      const recentMessages = context.messages.slice(-5);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract potential memories based on message content
      const extracted = recentMessages
        .filter(msg => msg.sender === 'user' && msg.content.length > 30)
        .map(msg => {
          // Simulate extracting key information
          const content = msg.content;
          let category = 'fact';
          
          if (content.includes('decided') || content.includes('decision')) {
            category = 'decision';
          } else if (content.includes('context') || content.includes('background')) {
            category = 'context';
          } else if (content.includes('reference') || content.includes('link')) {
            category = 'reference';
          }
          
          return {
            id: `extracted-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            text: content.length > 100 ? content.substring(0, 100) + '...' : content,
            category,
            timestamp: Date.now(),
            importance: 'medium',
            isExtracted: true,
            confidence: Math.random() * 0.5 + 0.5 // Random confidence between 0.5 and 1.0
          };
        })
        .filter(item => item.confidence > 0.7); // Only keep high confidence extractions
      
      if (extracted.length > 0) {
        setExtractedMemories(extracted);
      }
    } catch (error) {
      console.error('Failed to extract memories:', error);
    } finally {
      setIsExtracting(false);
    }
  };
  
  // Handle adding an extracted memory
  const handleAddExtractedMemory = (extractedItem) => {
    if (onAddMemoryItem) {
      // Remove the isExtracted and confidence properties
      const { isExtracted, confidence, ...memoryItem } = extractedItem;
      onAddMemoryItem(memoryItem, projectId);
    }
    
    setItems(prev => [...prev, extractedItem]);
    
    // Remove from extracted memories
    setExtractedMemories(prev => prev.filter(item => item.id !== extractedItem.id));
  };
  
  // Handle dismissing an extracted memory
  const handleDismissExtractedMemory = (extractedItemId) => {
    setExtractedMemories(prev => prev.filter(item => item.id !== extractedItemId));
  };
  
  // Get icon based on project type
  const getProjectIcon = () => {
    switch (projectType) {
      case 'code':
        return <CodeIcon />;
      case 'book':
        return <BookIcon />;
      case 'research':
        return <SearchIcon />;
      case 'data':
        return <StarIcon />;
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
      case 'insight':
        return <span className="memory-icon insight">I</span>;
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
  
  // Handle searching memory items
  const handleSearchMemory = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoadingSearch(true);
    
    try {
      if (onSearchMemory) {
        const results = await onSearchMemory(searchQuery, projectId);
        setSearchResults(results);
      } else {
        // Mock implementation for demo
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simple search implementation
        const results = items.filter(item => 
          item.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Also search in related workspaces if available
        const relatedResults = relatedWorkspaces.flatMap(workspace => 
          (workspace.memoryItems || [])
            .filter(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(item => ({
              ...item,
              workspaceId: workspace.id,
              workspaceName: workspace.title
            }))
        );
        
        setSearchResults([...results, ...relatedResults]);
      }
    } catch (error) {
      console.error('Failed to search memory:', error);
    } finally {
      setIsLoadingSearch(false);
    }
  };
  
  // Handle toggling search mode
  const handleToggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  
  // Handle changing visualization mode
  const handleChangeVisualizationMode = (mode) => {
    setVisualizationMode(mode);
  };
  
  // Filter items based on category and importance filters
  const filteredItems = items.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (importanceFilter !== 'all' && item.importance !== importanceFilter) return false;
    return true;
  });
  
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
              <option value="insight">Insight</option>
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
  
  // Render search form
  const renderSearchForm = () => {
    return (
      <div className="memory-search-form">
        <div className="memory-search-input">
          <input
            type="text"
            placeholder="Search memory items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchMemory();
              }
            }}
          />
          <button
            className="memory-search-button"
            onClick={handleSearchMemory}
            disabled={!searchQuery.trim() || isLoadingSearch}
          >
            {isLoadingSearch ? <CircularProgress size={16} /> : 'Search'}
          </button>
        </div>
        
        <div className="memory-search-scope">
          <label>
            <input
              type="checkbox"
              defaultChecked={true}
              disabled={true}
            />
            Current workspace
          </label>
          <label>
            <input
              type="checkbox"
              defaultChecked={true}
            />
            Related workspaces ({relatedWorkspaces.length})
          </label>
        </div>
      </div>
    );
  };
  
  // Render search results
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="empty-search-results">
          <Typography variant="body2" color="textSecondary">
            No results found for "{searchQuery}"
          </Typography>
        </div>
      );
    }
    
    return (
      <div className="memory-search-results">
        <Typography variant="subtitle2">
          {searchResults.length} results for "{searchQuery}"
        </Typography>
        <div className="search-results-list">
          {searchResults.map(result => (
            <div key={result.id} className="search-result-item">
              <div className="result-header">
                <div className="result-icon">
                  {getItemIcon(result.category)}
                </div>
                <div className="result-text">
                  <Typography variant="body2">
                    {result.text}
                  </Typography>
                </div>
              </div>
              {result.workspaceName && (
                <div className="result-workspace">
                  <Typography variant="caption" color="textSecondary">
                    From: {result.workspaceName}
                  </Typography>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render extracted memories
  const renderExtractedMemories = () => {
    if (extractedMemories.length === 0) return null;
    
    return (
      <div className="extracted-memories">
        <Typography variant="subtitle2">
          Suggested Memory Items
        </Typography>
        <div className="extracted-memories-list">
          {extractedMemories.map(item => (
            <div key={item.id} className="extracted-memory-item">
              <div className="extracted-memory-content">
                <div className="extracted-memory-icon">
                  {getItemIcon(item.category)}
                </div>
                <div className="extracted-memory-text">
                  <Typography variant="body2">
                    {item.text}
                  </Typography>
                </div>
              </div>
              <div className="extracted-memory-actions">
                <Tooltip title="Add to memory">
                  <button
                    className="extracted-memory-add"
                    onClick={() => handleAddExtractedMemory(item)}
                  >
                    Add
                  </button>
                </Tooltip>
                <Tooltip title="Dismiss">
                  <button
                    className="extracted-memory-dismiss"
                    onClick={() => handleDismissExtractedMemory(item.id)}
                  >
                    ✕
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render memory filters
  const renderMemoryFilters = () => {
    return (
      <div className="memory-filters">
        <div className="category-filter">
          <label>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="fact">Facts</option>
            <option value="decision">Decisions</option>
            <option value="context">Context</option>
            <option value="reference">References</option>
            <option value="insight">Insights</option>
          </select>
        </div>
        <div className="importance-filter">
          <label>Importance:</label>
          <select
            value={importanceFilter}
            onChange={(e) => setImportanceFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    );
  };
  
  // Render visualization mode selector
  const renderVisualizationModeSelector = () => {
    return (
      <div className="visualization-mode-selector">
        <button
          className={`mode-button ${visualizationMode === 'list' ? 'active' : ''}`}
          onClick={() => handleChangeVisualizationMode('list')}
        >
          List
        </button>
        <button
          className={`mode-button ${visualizationMode === 'graph' ? 'active' : ''}`}
          onClick={() => handleChangeVisualizationMode('graph')}
        >
          Graph
        </button>
        <button
          className={`mode-button ${visualizationMode === 'timeline' ? 'active' : ''}`}
          onClick={() => handleChangeVisualizationMode('timeline')}
        >
          Timeline
        </button>
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
  
  // Render memory items based on visualization mode
  const renderMemoryItems = () => {
    if (filteredItems.length === 0) {
      return (
        <div className="empty-memory">
          <Typography variant="body2" color="textSecondary">
            No memory items match the current filters. Add important information to remember for this project.
          </Typography>
        </div>
      );
    }
    
    if (visualizationMode === 'list') {
      return (
        <div className="memory-items-list">
          {filteredItems.map(renderMemoryItem)}
        </div>
      );
    } else if (visualizationMode === 'graph') {
      return (
        <div className="memory-items-graph">
          <div className="graph-placeholder">
            <Typography variant="body2" color="textSecondary">
              Graph visualization would be displayed here, showing relationships between memory items.
            </Typography>
          </div>
        </div>
      );
    } else if (visualizationMode === 'timeline') {
      return (
        <div className="memory-items-timeline">
          <div className="timeline-placeholder">
            <Typography variant="body2" color="textSecondary">
              Timeline visualization would be displayed here, showing memory items in chronological order.
            </Typography>
          </div>
        </div>
      );
    }
  };
  
  return (
    <Paper className="memory-tracker enhanced" elevation={3}>
      <div className="memory-tracker-header">
        <div className="memory-project-info">
          <div className="memory-project-icon">
            {getProjectIcon()}
          </div>
          <Typography variant="h6">
            {projectName || `${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Memory`}
          </Typography>
        </div>
        <div className="memory-header-actions">
          <button 
            className={`memory-search-toggle ${isSearching ? 'active' : ''}`}
            onClick={handleToggleSearch}
            title={isSearching ? 'Close search' : 'Search memory'}
          >
            <SearchIcon fontSize="small" />
          </button>
          <button 
            className="memory-add-button"
            onClick={handleAddItem}
            disabled={isAddingItem}
          >
            Add Memory
          </button>
        </div>
      </div>
      
      {isSearching && (
        <div className="memory-search-section">
          {renderSearchForm()}
          {searchResults.length > 0 && renderSearchResults()}
        </div>
      )}
      
      {isAddingItem && renderAddItemForm()}
      
      {extractedMemories.length > 0 && renderExtractedMemories()}
      
      <Divider />
      
      <div className="memory-controls">
        {renderMemoryFilters()}
        {renderVisualizationModeSelector()}
      </div>
      
      <div className="memory-items-container">
        {isExtracting ? (
          <div className="memory-loading">
            <CircularProgress size={24} />
            <Typography variant="body2" color="textSecondary">
              Analyzing conversation for important information...
            </Typography>
          </div>
        ) : (
          renderMemoryItems()
        )}
      </div>
      
      {relatedWorkspaces.length > 0 && (
        <div className="related-workspaces">
          <Typography variant="subtitle2">Related Workspaces</Typography>
          <div className="related-workspaces-list">
            {relatedWorkspaces.map(workspace => (
              <div key={workspace.id} className="related-workspace-item">
                <Typography variant="body2">
                  {workspace.title} ({workspace.memoryItems?.length || 0} memories)
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
};

MemoryTracker.propTypes = {
  projectType: PropTypes.oneOf(['general', 'code', 'book', 'research', 'data']),
  projectId: PropTypes.string,
  projectName: PropTypes.string,
  memoryItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      category: PropTypes.oneOf(['fact', 'decision', 'context', 'reference', 'insight']).isRequired,
      timestamp: PropTypes.number.isRequired,
      importance: PropTypes.oneOf(['low', 'medium', 'high']).isRequired
    })
  ),
  onAddMemoryItem: PropTypes.func,
  onRemoveMemoryItem: PropTypes.func,
  onUpdateMemoryItem: PropTypes.func,
  onSearchMemory: PropTypes.func,
  conversationContext: PropTypes.object,
  relatedWorkspaces: PropTypes.array
};

export default MemoryTracker;
