package ai.lumina.workflow.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ai.lumina.collaboration.model.Agent;
import ai.lumina.collaboration.model.Team;
import ai.lumina.collaboration.service.AdvancedTeamFormationService;
import ai.lumina.collaboration.service.NegotiationService;
import ai.lumina.collaboration.service.SharedContextService;
import ai.lumina.workflow.model.ExecutionContext;
import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.repository.ExecutionContextRepository;
import ai.lumina.workflow.repository.StepExecutionRepository;

/**
 * Service for integrating the Workflow Orchestration Engine with the
 * Advanced Multi-Agent Collaboration System.
 */
@Service
public class CollaborationIntegrationService {

    @Autowired
    private AdvancedTeamFormationService teamFormationService;
    
    @Autowired
    private NegotiationService negotiationService;
    
    @Autowired
    private SharedContextService sharedContextService;
    
    @Autowired
    private StepExecutionRepository stepExecutionRepository;
    
    @Autowired
    private ExecutionContextRepository executionContextRepository;
    
    /**
     * Assigns a step execution to the most suitable agent.
     * 
     * @param stepExecution The step execution to assign
     * @return The updated step execution
     */
    public StepExecution assignStepToAgent(StepExecution stepExecution) {
        // Get the required agent role from the step execution
        String requiredRole = stepExecution.getAssignedAgentRole();
        
        // Use the team formation service to find the most suitable agent
        Agent agent = teamFormationService.findMostSuitableAgent(requiredRole, 
                createCapabilityRequirements(stepExecution));
        
        // Assign the step to the agent
        stepExecution.assign(agent.getId(), agent.getRole());
        
        return stepExecutionRepository.save(stepExecution);
    }
    
    /**
     * Creates a team for a workflow instance.
     * 
     * @param workflowInstance The workflow instance
     * @param requiredRoles The roles required for the team
     * @return The created team
     */
    public Team createTeamForWorkflow(WorkflowInstance workflowInstance, String[] requiredRoles) {
        // Create a team name based on the workflow instance
        String teamName = "Workflow-" + workflowInstance.getName() + "-Team";
        
        // Use the team formation service to create a team with the required roles
        return teamFormationService.createTeam(teamName, requiredRoles, 
                createTeamMetadata(workflowInstance));
    }
    
    /**
     * Synchronizes workflow execution context with shared context.
     * 
     * @param workflowInstanceId The workflow instance ID
     * @param teamId The team ID
     * @return The synchronized execution context
     */
    public ExecutionContext synchronizeContext(String workflowInstanceId, String teamId) {
        // Get the execution context
        Optional<ExecutionContext> contextOpt = executionContextRepository.findByWorkflowInstanceId(workflowInstanceId);
        ExecutionContext executionContext = contextOpt.orElseGet(() -> new ExecutionContext(workflowInstanceId));
        
        // Get the shared context
        ai.lumina.collaboration.model.SharedContext sharedContext = sharedContextService.getSharedContext(teamId);
        
        // Synchronize the contexts
        Map<String, Object> sharedData = sharedContext.getData();
        for (Map.Entry<String, Object> entry : sharedData.entrySet()) {
            executionContext.put(entry.getKey(), entry.getValue());
        }
        
        // Update the shared context with execution context data
        Map<String, Object> executionData = executionContext.getData();
        sharedContextService.updateSharedContext(teamId, executionData);
        
        return executionContextRepository.save(executionContext);
    }
    
    /**
     * Negotiates resource allocation for a workflow step.
     * 
     * @param stepExecution The step execution
     * @param teamId The team ID
     * @return True if negotiation was successful, false otherwise
     */
    public boolean negotiateResourcesForStep(StepExecution stepExecution, String teamId) {
        // Create resource requirements
        Map<String, Object> resourceRequirements = createResourceRequirements(stepExecution);
        
        // Use the negotiation service to negotiate resources
        return negotiationService.negotiateResources(teamId, stepExecution.getId(), resourceRequirements);
    }
    
    /**
     * Notifies agents about workflow events.
     * 
     * @param workflowInstance The workflow instance
     * @param eventType The event type
     * @param eventData The event data
     */
    public void notifyAgents(WorkflowInstance workflowInstance, String eventType, Map<String, Object> eventData) {
        // Create notification data
        Map<String, Object> notificationData = new HashMap<>();
        notificationData.put("workflowInstanceId", workflowInstance.getId());
        notificationData.put("workflowName", workflowInstance.getName());
        notificationData.put("eventType", eventType);
        notificationData.put("eventTime", java.time.LocalDateTime.now());
        notificationData.put("eventData", eventData);
        
        // Use the shared context service to broadcast the notification
        sharedContextService.broadcastNotification(notificationData);
    }
    
    /**
     * Creates capability requirements for a step execution.
     * 
     * @param stepExecution The step execution
     * @return Map of capability requirements
     */
    private Map<String, Object> createCapabilityRequirements(StepExecution stepExecution) {
        Map<String, Object> requirements = new HashMap<>();
        
        // Add basic requirements
        requirements.put("stepId", stepExecution.getStepId());
        requirements.put("stepName", stepExecution.getStepName());
        
        // Add any specific requirements from step metadata
        if (stepExecution.getMetadata() != null) {
            if (stepExecution.getMetadata().containsKey("requiredCapabilities")) {
                requirements.put("capabilities", stepExecution.getMetadata().get("requiredCapabilities"));
            }
            
            if (stepExecution.getMetadata().containsKey("priority")) {
                requirements.put("priority", stepExecution.getMetadata().get("priority"));
            }
        }
        
        return requirements;
    }
    
    /**
     * Creates team metadata for a workflow instance.
     * 
     * @param workflowInstance The workflow instance
     * @return Map of team metadata
     */
    private Map<String, Object> createTeamMetadata(WorkflowInstance workflowInstance) {
        Map<String, Object> metadata = new HashMap<>();
        
        metadata.put("workflowInstanceId", workflowInstance.getId());
        metadata.put("workflowDefinitionId", workflowInstance.getWorkflowDefinitionId());
        metadata.put("workflowName", workflowInstance.getName());
        metadata.put("createdBy", workflowInstance.getCreatedBy());
        metadata.put("priority", workflowInstance.getPriority());
        
        return metadata;
    }
    
    /**
     * Creates resource requirements for a step execution.
     * 
     * @param stepExecution The step execution
     * @return Map of resource requirements
     */
    private Map<String, Object> createResourceRequirements(StepExecution stepExecution) {
        Map<String, Object> requirements = new HashMap<>();
        
        // Add basic requirements
        requirements.put("stepId", stepExecution.getStepId());
        requirements.put("stepName", stepExecution.getStepName());
        requirements.put("agentId", stepExecution.getAssignedAgentId());
        requirements.put("agentRole", stepExecution.getAssignedAgentRole());
        
        // Add time requirements
        requirements.put("estimatedDuration", stepExecution.getTimeoutSeconds());
        
        // Add any specific requirements from step metadata
        if (stepExecution.getMetadata() != null) {
            if (stepExecution.getMetadata().containsKey("requiredResources")) {
                requirements.put("resources", stepExecution.getMetadata().get("requiredResources"));
            }
            
            if (stepExecution.getMetadata().containsKey("priority")) {
                requirements.put("priority", stepExecution.getMetadata().get("priority"));
            }
        }
        
        return requirements;
    }
}
