package ai.lumina.workflow.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ai.lumina.workflow.model.ExecutionContext;
import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.service.WorkflowExecutionEngine;

/**
 * REST controller for workflow execution operations.
 */
@RestController
@RequestMapping("/api/workflow/execution")
public class WorkflowExecutionController {

    @Autowired
    private WorkflowExecutionEngine workflowExecutionEngine;
    
    /**
     * Starts a new workflow instance.
     * 
     * @param request The start workflow request
     * @return The created workflow instance
     */
    @PostMapping("/start")
    public ResponseEntity<WorkflowInstance> startWorkflow(@RequestBody StartWorkflowRequest request) {
        WorkflowInstance instance = workflowExecutionEngine.startWorkflow(
                request.getWorkflowDefinitionId(),
                request.getName(),
                request.getUserId(),
                request.getInitialContext());
        
        return ResponseEntity.ok(instance);
    }
    
    /**
     * Gets a workflow instance by ID.
     * 
     * @param id The workflow instance ID
     * @return The workflow instance
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkflowInstance> getWorkflowInstance(@PathVariable String id) {
        Optional<WorkflowInstance> instanceOpt = workflowExecutionEngine.getWorkflowInstance(id);
        
        return instanceOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Gets all step executions for a workflow instance.
     * 
     * @param id The workflow instance ID
     * @return List of step executions
     */
    @GetMapping("/{id}/steps")
    public ResponseEntity<List<StepExecution>> getStepExecutions(@PathVariable String id) {
        List<StepExecution> stepExecutions = workflowExecutionEngine.getStepExecutions(id);
        
        return ResponseEntity.ok(stepExecutions);
    }
    
    /**
     * Gets the execution context for a workflow instance.
     * 
     * @param id The workflow instance ID
     * @return The execution context
     */
    @GetMapping("/{id}/context")
    public ResponseEntity<ExecutionContext> getExecutionContext(@PathVariable String id) {
        Optional<ExecutionContext> contextOpt = workflowExecutionEngine.getExecutionContext(id);
        
        return contextOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Updates the execution context for a workflow instance.
     * 
     * @param id The workflow instance ID
     * @param updates The updates to apply to the context
     * @return The updated execution context
     */
    @PutMapping("/{id}/context")
    public ResponseEntity<ExecutionContext> updateExecutionContext(
            @PathVariable String id, 
            @RequestBody Map<String, Object> updates) {
        ExecutionContext context = workflowExecutionEngine.updateExecutionContext(id, updates);
        
        return ResponseEntity.ok(context);
    }
    
    /**
     * Pauses a workflow instance.
     * 
     * @param id The workflow instance ID
     * @return The paused workflow instance
     */
    @PostMapping("/{id}/pause")
    public ResponseEntity<WorkflowInstance> pauseWorkflow(@PathVariable String id) {
        try {
            WorkflowInstance instance = workflowExecutionEngine.pauseWorkflow(id);
            return ResponseEntity.ok(instance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
    
    /**
     * Resumes a workflow instance.
     * 
     * @param id The workflow instance ID
     * @return The resumed workflow instance
     */
    @PostMapping("/{id}/resume")
    public ResponseEntity<WorkflowInstance> resumeWorkflow(@PathVariable String id) {
        try {
            WorkflowInstance instance = workflowExecutionEngine.resumeWorkflow(id);
            return ResponseEntity.ok(instance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
    
    /**
     * Cancels a workflow instance.
     * 
     * @param id The workflow instance ID
     * @return The cancelled workflow instance
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<WorkflowInstance> cancelWorkflow(@PathVariable String id) {
        try {
            WorkflowInstance instance = workflowExecutionEngine.cancelWorkflow(id);
            return ResponseEntity.ok(instance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
    
    /**
     * Request object for starting a workflow.
     */
    public static class StartWorkflowRequest {
        private String workflowDefinitionId;
        private String name;
        private String userId;
        private Map<String, Object> initialContext = new HashMap<>();
        
        // Getters and setters
        
        public String getWorkflowDefinitionId() {
            return workflowDefinitionId;
        }
        
        public void setWorkflowDefinitionId(String workflowDefinitionId) {
            this.workflowDefinitionId = workflowDefinitionId;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getUserId() {
            return userId;
        }
        
        public void setUserId(String userId) {
            this.userId = userId;
        }
        
        public Map<String, Object> getInitialContext() {
            return initialContext;
        }
        
        public void setInitialContext(Map<String, Object> initialContext) {
            this.initialContext = initialContext;
        }
    }
}
