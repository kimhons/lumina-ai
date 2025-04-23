import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Divider, Tooltip, CircularProgress, IconButton } from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  BubbleChart as BubbleChartIcon,
  Timeline as TimelineIcon,
  List as ListIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import '../styles/VisualThinkingDisplay.css';

/**
 * Enhanced VisualThinkingDisplay component visualizes the AI's reasoning process
 * in real-time with interactive features, branching visualization, and detailed explanations.
 */
const VisualThinkingDisplay = ({
  currentTask,
  thinkingSteps = [],
  isVisible = true,
  onToggleVisibility,
  onSaveThinking,
  onInterveneThinKing,
  onRequestAlternativePath,
  reasoningType = 'standard' // 'standard', 'research', 'coding', 'creative'
}) => {
  // State for animation control
  const [animatedSteps, setAnimatedSteps] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);
  const [expandedStepIndex, setExpandedStepIndex] = useState(null);
  const [visualizationMode, setVisualizationMode] = useState('list'); // 'list', 'tree', 'timeline'
  const [alternativePaths, setAlternativePaths] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  
  // Ref for auto-scrolling
  const stepsContainerRef = useRef(null);
  
  // Animate thinking steps appearing one by one
  useEffect(() => {
    if (!isVisible || isPaused) return;
    
    const animateSteps = async () => {
      // Reset animation if thinking steps change completely
      if (thinkingSteps.length < animatedSteps.length) {
        setAnimatedSteps([]);
      }
      
      // Animate new steps
      for (let i = animatedSteps.length; i < thinkingSteps.length; i++) {
        setAnimatedSteps(prev => [...prev, thinkingSteps[i]]);
        // Add delay between steps for animation effect
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    };
    
    animateSteps();
  }, [thinkingSteps, isVisible, isPaused, animatedSteps.length]);
  
  // Auto-scroll to the latest step
  useEffect(() => {
    if (stepsContainerRef.current && animatedSteps.length > 0 && !selectedStepIndex) {
      stepsContainerRef.current.scrollTop = stepsContainerRef.current.scrollHeight;
    }
  }, [animatedSteps.length, selectedStepIndex]);
  
  // Handle toggling pause/play
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Handle saving thinking process
  const handleSaveThinking = () => {
    if (onSaveThinking) {
      onSaveThinking(thinkingSteps, currentTask);
    } else {
      // Mock implementation for demo
      const thinkingData = {
        task: currentTask,
        steps: thinkingSteps,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(thinkingData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `thinking-process-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  // Handle selecting a step
  const handleSelectStep = (index) => {
    setSelectedStepIndex(index === selectedStepIndex ? null : index);
  };
  
  // Handle expanding a step
  const handleExpandStep = (index) => {
    setExpandedStepIndex(index === expandedStepIndex ? null : index);
  };
  
  // Handle requesting alternative reasoning path
  const handleRequestAlternativePath = (stepIndex) => {
    if (onRequestAlternativePath) {
      onRequestAlternativePath(stepIndex, thinkingSteps[stepIndex]);
    } else {
      // Mock implementation for demo
      // Simulate processing delay
      setTimeout(() => {
        const alternativeStep = {
          ...thinkingSteps[stepIndex],
          content: `Alternative approach: ${thinkingSteps[stepIndex].content}`,
          isAlternative: true
        };
        
        setAlternativePaths(prev => ({
          ...prev,
          [stepIndex]: [...(prev[stepIndex] || []), alternativeStep]
        }));
      }, 1000);
    }
  };
  
  // Handle intervening in thinking process
  const handleIntervene = (stepIndex, intervention) => {
    if (onInterveneThinKing) {
      onInterveneThinKing(stepIndex, intervention);
    } else {
      // Mock implementation for demo
      console.log(`Intervention at step ${stepIndex}: ${intervention}`);
      alert(`Intervention submitted: ${intervention}`);
    }
  };
  
  // Handle changing visualization mode
  const handleChangeVisualizationMode = (mode) => {
    setVisualizationMode(mode);
  };
  
  // Get color based on reasoning type
  const getReasoningTypeColor = () => {
    switch (reasoningType) {
      case 'research':
        return '#4a90e2';
      case 'coding':
        return '#50e3c2';
      case 'creative':
        return '#e59f3c';
      default:
        return '#7b68ee';
    }
  };
  
  // Render help tooltip
  const renderHelpTooltip = () => {
    return (
      <div className="thinking-help-tooltip">
        <Typography variant="subtitle2">Visual Thinking Display</Typography>
        <Typography variant="body2">
          This panel shows you how Lumina AI approaches your tasks and solves problems in real-time.
        </Typography>
        <ul>
          <li>Click on any step to select it</li>
          <li>Double-click to see detailed explanations</li>
          <li>Use the "Alternative" button to see different approaches</li>
          <li>Use the visualization modes to see different views</li>
          <li>Pause/play to control the animation speed</li>
          <li>Save to export the thinking process</li>
        </ul>
      </div>
    );
  };
  
  // Render step type badge
  const renderStepTypeBadge = (type) => {
    let label, className;
    
    switch (type) {
      case 'observation':
        label = 'Observation';
        className = 'observation';
        break;
      case 'thought':
        label = 'Thought';
        className = 'thought';
        break;
      case 'decision':
        label = 'Decision';
        className = 'decision';
        break;
      case 'action':
        label = 'Action';
        className = 'action';
        break;
      case 'result':
        label = 'Result';
        className = 'result';
        break;
      case 'error':
        label = 'Error';
        className = 'error';
        break;
      case 'correction':
        label = 'Correction';
        className = 'correction';
        break;
      default:
        label = type.charAt(0).toUpperCase() + type.slice(1);
        className = 'default';
    }
    
    return <span className={`step-type ${className}`}>{label}</span>;
  };
  
  // Render a single thinking step
  const renderThinkingStep = (step, index) => {
    const isSelected = selectedStepIndex === index;
    const isExpanded = expandedStepIndex === index;
    const hasAlternatives = alternativePaths[index] && alternativePaths[index].length > 0;
    
    return (
      <div 
        key={`step-${index}`} 
        className={`thinking-step ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
        onClick={() => handleSelectStep(index)}
        onDoubleClick={() => handleExpandStep(index)}
      >
        <div className="step-number">{index + 1}</div>
        <div className="step-content">
          <div className="step-header">
            {renderStepTypeBadge(step.type)}
            <Typography variant="body2">
              {step.content}
            </Typography>
          </div>
          
          {(isExpanded || isSelected) && step.explanation && (
            <div className="step-explanation">
              <Typography variant="caption" color="textSecondary">
                <strong>Explanation:</strong> {step.explanation}
              </Typography>
            </div>
          )}
          
          {isExpanded && step.details && (
            <div className="step-details">
              <pre>{step.details}</pre>
            </div>
          )}
          
          {isSelected && (
            <div className="step-actions">
              <button
                className="step-action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRequestAlternativePath(index);
                }}
              >
                Alternative
              </button>
              <button
                className="step-action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  const intervention = prompt('Enter your intervention or guidance:');
                  if (intervention) {
                    handleIntervene(index, intervention);
                  }
                }}
              >
                Intervene
              </button>
            </div>
          )}
          
          {hasAlternatives && (
            <div className="step-alternatives">
              <Typography variant="caption" fontWeight="bold">
                Alternative Approaches:
              </Typography>
              {alternativePaths[index].map((altStep, altIndex) => (
                <div key={`alt-${index}-${altIndex}`} className="alternative-step">
                  <Typography variant="caption">
                    {altStep.content}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render tree visualization
  const renderTreeVisualization = () => {
    return (
      <div className="thinking-tree-visualization">
        <div className="tree-placeholder">
          <Typography variant="body2" color="textSecondary">
            Tree visualization would display thinking steps with branching paths showing alternative reasoning approaches.
          </Typography>
        </div>
      </div>
    );
  };
  
  // Render timeline visualization
  const renderTimelineVisualization = () => {
    return (
      <div className="thinking-timeline-visualization">
        <div className="timeline-placeholder">
          <Typography variant="body2" color="textSecondary">
            Timeline visualization would display thinking steps in a horizontal timeline with timestamps and dependencies.
          </Typography>
        </div>
      </div>
    );
  };
  
  if (!isVisible) return null;
  
  return (
    <Paper 
      className="visual-thinking-display enhanced" 
      elevation={3}
      style={{ borderTop: `3px solid ${getReasoningTypeColor()}` }}
    >
      <div className="thinking-header">
        <div className="thinking-title">
          <Typography variant="subtitle1">AI Reasoning Process</Typography>
          <div className="reasoning-type-badge" style={{ backgroundColor: getReasoningTypeColor() }}>
            {reasoningType.charAt(0).toUpperCase() + reasoningType.slice(1)}
          </div>
        </div>
        
        <div className="thinking-controls">
          <Tooltip title="Help">
            <IconButton 
              size="small"
              onClick={() => setShowHelp(!showHelp)}
            >
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isPaused ? "Resume" : "Pause"}>
            <IconButton 
              size="small"
              onClick={handleTogglePause}
            >
              {isPaused ? <PlayIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Save Thinking Process">
            <IconButton 
              size="small"
              onClick={handleSaveThinking}
              disabled={animatedSteps.length === 0}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Hide">
            <IconButton 
              size="small"
              onClick={onToggleVisibility}
            >
              <VisibilityOffIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      
      {showHelp && renderHelpTooltip()}
      
      {currentTask && (
        <div className="thinking-task">
          <Typography variant="body2" fontWeight="bold">
            Task: {currentTask}
          </Typography>
        </div>
      )}
      
      <div className="visualization-mode-selector">
        <Tooltip title="List View">
          <IconButton 
            size="small"
            onClick={() => handleChangeVisualizationMode('list')}
            color={visualizationMode === 'list' ? 'primary' : 'default'}
          >
            <ListIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Tree View">
          <IconButton 
            size="small"
            onClick={() => handleChangeVisualizationMode('tree')}
            color={visualizationMode === 'tree' ? 'primary' : 'default'}
          >
            <BubbleChartIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Timeline View">
          <IconButton 
            size="small"
            onClick={() => handleChangeVisualizationMode('timeline')}
            color={visualizationMode === 'timeline' ? 'primary' : 'default'}
          >
            <TimelineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      
      <Divider />
      
      <div className="thinking-steps-container" ref={stepsContainerRef}>
        {animatedSteps.length === 0 ? (
          <div className="empty-thinking">
            <Typography variant="body2" color="textSecondary">
              Waiting for AI to begin reasoning...
            </Typography>
          </div>
        ) : (
          <>
            {visualizationMode === 'list' && (
              <div className="thinking-steps">
                {animatedSteps.map(renderThinkingStep)}
              </div>
            )}
            
            {visualizationMode === 'tree' && renderTreeVisualization()}
            
            {visualizationMode === 'timeline' && renderTimelineVisualization()}
          </>
        )}
      </div>
      
      {animatedSteps.length > 0 && animatedSteps.length < thinkingSteps.length && (
        <div className="thinking-progress">
          <CircularProgress size={16} />
          <Typography variant="caption">
            Thinking... {animatedSteps.length} of {thinkingSteps.length} steps
          </Typography>
        </div>
      )}
    </Paper>
  );
};

VisualThinkingDisplay.propTypes = {
  currentTask: PropTypes.string,
  thinkingSteps: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([
        'observation', 
        'thought', 
        'decision', 
        'action', 
        'result', 
        'error', 
        'correction'
      ]).isRequired,
      content: PropTypes.string.isRequired,
      details: PropTypes.string,
      explanation: PropTypes.string,
      timestamp: PropTypes.number
    })
  ),
  isVisible: PropTypes.bool,
  onToggleVisibility: PropTypes.func,
  onSaveThinking: PropTypes.func,
  onInterveneThinKing: PropTypes.func,
  onRequestAlternativePath: PropTypes.func,
  reasoningType: PropTypes.oneOf(['standard', 'research', 'coding', 'creative'])
};

export default VisualThinkingDisplay;
