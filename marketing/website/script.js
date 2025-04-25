// Lumina AI Enhanced Chat Interface Demo Script

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('messages');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const toolButtons = document.querySelectorAll('.tool-button');
    const acceptTaskButton = document.getElementById('accept-task');
    const modifyTaskButton = document.getElementById('modify-task');
    const dismissTaskButton = document.getElementById('dismiss-task');
    
    // Add event listener for send button
    sendButton.addEventListener('click', sendMessage);
    
    // Add event listener for Enter key in message input
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Add event listeners for suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            messageInput.value = chip.textContent;
            messageInput.focus();
        });
    });
    
    // Add event listeners for tool buttons
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Show a tooltip or notification about the tool
            const toolName = button.getAttribute('title');
            showNotification(`${toolName} feature activated`);
        });
    });
    
    // Add event listeners for task buttons
    if (acceptTaskButton) {
        acceptTaskButton.addEventListener('click', function() {
            // Hide the task suggestion
            const taskSuggestion = document.querySelector('.task-suggestion');
            if (taskSuggestion) {
                taskSuggestion.style.display = 'none';
            }
            
            // Show the task status
            const taskStatus = document.querySelector('.task-status');
            if (taskStatus) {
                taskStatus.style.display = 'block';
            }
            
            showNotification('Task accepted and started');
        });
    }
    
    if (modifyTaskButton) {
        modifyTaskButton.addEventListener('click', function() {
            showNotification('Task modification dialog would appear here');
        });
    }
    
    if (dismissTaskButton) {
        dismissTaskButton.addEventListener('click', function() {
            // Hide the task suggestion
            const taskSuggestion = document.querySelector('.task-suggestion');
            if (taskSuggestion) {
                taskSuggestion.style.display = 'none';
            }
            
            showNotification('Task suggestion dismissed');
        });
    }
    
    // Function to send a message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (!messageText) return;
        
        // Create a new user message element
        const messageGroup = document.querySelector('.message-group');
        const newMessage = createUserMessage(messageText);
        messageGroup.appendChild(newMessage);
        
        // Clear the input
        messageInput.value = '';
        
        // Scroll to the bottom of the messages container
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate assistant response after a short delay
        setTimeout(() => {
            simulateTypingIndicator();
            
            // After another delay, show the assistant's response
            setTimeout(() => {
                removeTypingIndicator();
                const assistantResponse = createAssistantMessage(getAssistantResponse(messageText));
                messageGroup.appendChild(assistantResponse);
                
                // Update the context indicator
                updateContextIndicator(75); // Increase by 10%
                
                // Scroll to the bottom again
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Update agent activity
                updateAgentActivity('Analyzing user request');
            }, 2000);
        }, 500);
    }
    
    // Function to create a user message element
    function createUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        return messageDiv;
    }
    
    // Function to create an assistant message element
    function createAssistantMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        return messageDiv;
    }
    
    // Function to simulate typing indicator
    function simulateTypingIndicator() {
        const messageGroup = document.querySelector('.message-group');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        messageGroup.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to update context indicator
    function updateContextIndicator(percentage) {
        const contextFill = document.querySelector('.context-fill');
        const contextText = document.querySelector('.context-text');
        
        if (contextFill && contextText) {
            contextFill.style.width = `${percentage}%`;
            contextText.textContent = `Context: ${percentage}%`;
            
            // Change color based on percentage
            if (percentage > 80) {
                contextFill.style.backgroundColor = '#f44336'; // Red
            } else if (percentage > 60) {
                contextFill.style.backgroundColor = '#ff9800'; // Orange
            } else {
                contextFill.style.backgroundColor = '#7b68ee'; // Purple
            }
        }
    }
    
    // Function to update agent activity
    function updateAgentActivity(activity) {
        const activityList = document.querySelector('.activity-list');
        
        if (activityList) {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const now = new Date();
            
            activityItem.innerHTML = `
                <span class="material-icons">psychology</span>
                <div class="activity-details">
                    <p>${activity}</p>
                    <span class="activity-time">Just now</span>
                </div>
            `;
            
            // Add to the beginning of the list
            activityList.insertBefore(activityItem, activityList.firstChild);
            
            // Update previous timestamps
            const previousItems = activityList.querySelectorAll('.activity-item:not(:first-child)');
            previousItems.forEach((item, index) => {
                const timeSpan = item.querySelector('.activity-time');
                if (timeSpan) {
                    if (index === 0) {
                        timeSpan.textContent = '1m ago';
                    } else if (index === 1) {
                        timeSpan.textContent = '3m ago';
                    } else {
                        timeSpan.textContent = `${(index + 1) * 2}m ago`;
                    }
                }
            });
            
            // Remove items if there are too many
            if (activityList.children.length > 5) {
                activityList.removeChild(activityList.lastChild);
            }
        }
    }
    
    // Function to show a notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Add visible class after a small delay to trigger animation
        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);
        
        // Remove notification after a delay
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Function to get a simulated assistant response
    function getAssistantResponse(userMessage) {
        // Simple response logic based on user message content
        const userMessageLower = userMessage.toLowerCase();
        
        if (userMessageLower.includes('hello') || userMessageLower.includes('hi')) {
            return 'Hello! How can I assist you today with Lumina AI?';
        } else if (userMessageLower.includes('thank')) {
            return "You're welcome! Is there anything else you'd like help with?";
        } else if (userMessageLower.includes('feature') || userMessageLower.includes('capability')) {
            return `
                Lumina AI has several advanced features:
                <br><br>
                1. <strong>Memory Tracking</strong> - I remember important information from our conversations
                <br>
                2. <strong>Visual Thinking</strong> - You can see my reasoning process in real-time
                <br>
                3. <strong>Autonomous Tasks</strong> - I can work on complex tasks independently
                <br>
                4. <strong>Workspace Management</strong> - Organize different projects with separate memory contexts
                <br><br>
                Would you like me to explain any of these features in more detail?
            `;
        } else if (userMessageLower.includes('memory') || userMessageLower.includes('remember')) {
            return `
                My memory tracking system allows me to:
                <br><br>
                - Automatically extract important information from our conversations
                <br>
                - Categorize memories as facts, decisions, context, or references
                <br>
                - Prioritize information based on relevance and importance
                <br>
                - Search across all memories semantically
                <br>
                - Maintain separate memory contexts for different workspaces
                <br><br>
                I've already stored several memories from our conversation that you can see in the Memory Tracker panel.
            `;
        } else if (userMessageLower.includes('task') || userMessageLower.includes('autonomous')) {
            return `
                My autonomous task capabilities allow me to:
                <br><br>
                - Break down complex tasks into manageable subtasks
                <br>
                - Work on tasks in the background while we continue conversing
                <br>
                - Use specialized tools for different types of tasks
                <br>
                - Provide regular progress updates
                <br>
                - Deliver comprehensive results when completed
                <br><br>
                Would you like me to suggest a task based on our conversation?
            `;
        } else {
            return `I understand you're interested in "${userMessage}". How would you like me to help with this? I can provide information, create content, analyze data, or work on this as an autonomous task.`;
        }
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .notification.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 8px 0;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #aaa;
            animation: typing-dot 1.4s infinite ease-in-out both;
        }
        
        .typing-dots span:nth-child(1) {
            animation-delay: -0.32s;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: -0.16s;
        }
        
        @keyframes typing-dot {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    
    document.head.appendChild(style);
    
    // Initialize the demo
    function initDemo() {
        // Set initial context indicator
        updateContextIndicator(65);
        
        // Focus on the message input
        messageInput.focus();
    }
    
    // Start the demo
    initDemo();
});
