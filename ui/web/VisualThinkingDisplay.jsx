import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Divider } from '@mui/material';
import '../styles/VisualThinkingDisplay.css';

/**
 * VisualThinkingDisplay component visualizes the AI's reasoning process
 * in real-time, showing how it approaches tasks and solves problems.
 */
const VisualThinkingDisplay = ({
  currentTask,
  thinkingSteps = [],
  isVisible = true,
  onToggleVisibility
}) => {
  // State for animation control
  const [animatedSteps, setAnimatedSteps] = useState([]);
  
  // Animate thinking steps appearing one by one
  useEffect(() => {
    if (!isVisible) return;
    
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
  }, [thinkingSteps, isVisible, animatedSteps.length]);
  
  if (!isVisible) return null;
  
  return (
    <Paper className="visual-thinking-display" elevation={3}>
      <div className="thinking-header">
        <Typography variant="subtitle1">AI Reasoning Process</Typography>
        {currentTask && (
          <Typography variant="body2" color="textSecondary">
            Task: {currentTask}
          </Typography>
        )}
      </div>
      
      <Divider />
      
      <div className="thinking-steps-container">
        {animatedSteps.length === 0 ? (
          <div className="empty-thinking">
            <Typography variant="body2" color="textSecondary">
              Waiting for AI to begin reasoning...
            </Typography>
          </div>
        ) : (
          <div className="thinking-steps">
            {animatedSteps.map((step, index) => (
              <div key={index} className="thinking-step">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <Typography variant="body2">
                    {step.type === 'observation' && <span className="step-type observation">Observation:</span>}
                    {step.type === 'thought' && <span className="step-type thought">Thought:</span>}
                    {step.type === 'decision' && <span className="step-type decision">Decision:</span>}
                    {step.type === 'action' && <span className="step-type action">Action:</span>}
                    {step.type === 'result' && <span className="step-type result">Result:</span>}
                    {' '}{step.content}
                  </Typography>
                  
                  {step.details && (
                    <div className="step-details">
                      <pre>{step.details}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {animatedSteps.length > 0 && animatedSteps.length < thinkingSteps.length && (
        <div className="thinking-progress">
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
      type: PropTypes.oneOf(['observation', 'thought', 'decision', 'action', 'result']).isRequired,
      content: PropTypes.string.isRequired,
      details: PropTypes.string
    })
  ),
  isVisible: PropTypes.bool,
  onToggleVisibility: PropTypes.func
};

export default VisualThinkingDisplay;
