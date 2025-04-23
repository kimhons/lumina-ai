package ai.lumina.workflow.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ai.lumina.collaboration.model.Team;
import ai.lumina.workflow.model.ExecutionContext;
import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.repository.StepExecutionRepository;
import ai.lumina.workflow.repository.WorkflowInstanceRepository;
import ai.lumina.workflow.service.CollaborationIntegrationService;

/**
 * REST controller for collaboration integration operations.
 */
@RestController
@RequestMapping("/api/workflow/collaboration")
public class CollaborationIntegrationController {

    @Autowired
    private CollaborationIntegrationService collaborationIntegrationService;
    
    @Autowired
    private WorkflowInstanceRepository workflowInstanceRepository;
    
    @Autowired
    private StepExecutionRepository stepExecutionRepository;
    
    /**
     * Assigns a step execution to the most suitable agent.
     * 
     * @param stepExecutionId The step execution ID
     * @return The updated step execution
     */
    @PostMapping("/assign-step/{stepExecutionId}")
    public ResponseEntity<StepExecution> assignStepToAgent(@PathVariable String stepExecutionId) {
        StepExecution stepExecution = stepExecutionRepository.findById(stepExecutionId)
                .orElseThrow(() -> new IllegalArgumentException("Step execution not found: " + stepExecutionId));
        
        StepExecution updatedStepExecution = collaborationIntegrationService.assignStepToAgent(stepExecution);
        return ResponseEntity.ok(updatedStepExecution);
    }
    
    /**
     * Creates a team for a workflow instance.
     * 
     * @param workflowInstanceId The workflow instance ID
     * @param request The team creation request
     * @return The created team
     */
    @PostMapping("/create-team/{workflowInstanceId}")
    public ResponseEntity<Team> createTeamForWorkflow(
            @PathVariable String workflowInstanceId,
            @RequestBody CreateTeamRequest request) {
        WorkflowInstance workflowInstance = workflowInstanceRepository.findById(workflowInstanceId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow instance not found: " + workflowInstanceId));
        
        Team team = collaborationIntegrationService.createTeamForWorkflow(workflowInstance, request.getRequiredRoles());
        return ResponseEntity.ok(team);
    }
    
    /**
     * Synchronizes workflow execution context with shared context.
     * 
     * @param workflowInstanceId The workflow instance ID
     * @param teamId The team ID
     * @return The synchronized execution context
     */
    @PostMapping("/sync-context/{workflowInstanceId}/{teamId}")
    public ResponseEntity<ExecutionContext> synchronizeContext(
            @PathVariable String workflowInstanceId,
            @PathVariable String teamId) {
        ExecutionContext context = collaborationIntegrationService.synchronizeContext(workflowInstanceId, teamId);
        return ResponseEntity.ok(context);
    }
    
    /**
     * Negotiates resource allocation for a workflow step.
     * 
     * @param stepExecutionId The step execution ID
     * @param teamId The team ID
     * @return Result of the negotiation
     */
    @PostMapping("/negotiate-resources/{stepExecutionId}/{teamId}")
    public ResponseEntity<Map<String, Boolean>> negotiateResourcesForStep(
            @PathVariable String stepExecutionId,
            @PathVariable String teamId) {
        StepExecution stepExecution = stepExecutionRepository.findById(stepExecutionId)
                .orElseThrow(() -> new IllegalArgumentException("Step execution not found: " + stepExecutionId));
        
        boolean success = collaborationIntegrationService.negotiateResourcesForStep(stepExecution, teamId);
        
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", success);
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Notifies agents about workflow events.
     * 
     * @param workflowInstanceId The workflow instance ID
     * @param request The notification request
     * @return Result of the notification
     */
    @PostMapping("/notify-agents/{workflowInstanceId}")
    public ResponseEntity<Map<String, Boolean>> notifyAgents(
            @PathVariable String workflowInstanceId,
            @RequestBody NotificationRequest request) {
        WorkflowInstance workflowInstance = workflowInstanceRepository.findById(workflowInstanceId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow instance not found: " + workflowInstanceId));
        
        collaborationIntegrationService.notifyAgents(workflowInstance, request.getEventType(), request.getEventData());
        
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Request object for creating a team.
     */
    public static class CreateTeamRequest {
        private String[] requiredRoles;
        
        public String[] getRequiredRoles() {
            return requiredRoles;
        }
        
        public void setRequiredRoles(String[] requiredRoles) {
            this.requiredRoles = requiredRoles;
        }
    }
    
    /**
     * Request object for notifying agents.
     */
    public static class NotificationRequest {
        private String eventType;
        private Map<String, Object> eventData = new HashMap<>();
        
        public String getEventType() {
            return eventType;
        }
        
        public void setEventType(String eventType) {
            this.eventType = eventType;
        }
        
        public Map<String, Object> getEventData() {
            return eventData;
        }
        
        public void setEventData(Map<String, Object> eventData) {
            this.eventData = eventData;
        }
    }
}
