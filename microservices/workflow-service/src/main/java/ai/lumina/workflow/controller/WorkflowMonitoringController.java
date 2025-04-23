package ai.lumina.workflow.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.model.WorkflowInstance.WorkflowStatus;
import ai.lumina.workflow.service.WorkflowMonitoringService;

/**
 * REST controller for workflow monitoring operations.
 */
@RestController
@RequestMapping("/api/workflow/monitoring")
public class WorkflowMonitoringController {

    @Autowired
    private WorkflowMonitoringService workflowMonitoringService;
    
    /**
     * Gets all workflow instances with pagination.
     * 
     * @param pageable Pagination information
     * @return Page of workflow instances
     */
    @GetMapping("/instances")
    public ResponseEntity<Page<WorkflowInstance>> getAllWorkflowInstances(Pageable pageable) {
        Page<WorkflowInstance> instances = workflowMonitoringService.getAllWorkflowInstances(pageable);
        return ResponseEntity.ok(instances);
    }
    
    /**
     * Gets workflow instances by status with pagination.
     * 
     * @param status The status to filter by
     * @param pageable Pagination information
     * @return Page of workflow instances
     */
    @GetMapping("/instances/status/{status}")
    public ResponseEntity<Page<WorkflowInstance>> getWorkflowInstancesByStatus(
            @PathVariable WorkflowStatus status, Pageable pageable) {
        Page<WorkflowInstance> instances = workflowMonitoringService.getWorkflowInstancesByStatus(status, pageable);
        return ResponseEntity.ok(instances);
    }
    
    /**
     * Gets workflow instances created by a specific user with pagination.
     * 
     * @param userId The user ID
     * @param pageable Pagination information
     * @return Page of workflow instances
     */
    @GetMapping("/instances/user/{userId}")
    public ResponseEntity<Page<WorkflowInstance>> getWorkflowInstancesByUser(
            @PathVariable String userId, Pageable pageable) {
        Page<WorkflowInstance> instances = workflowMonitoringService.getWorkflowInstancesByUser(userId, pageable);
        return ResponseEntity.ok(instances);
    }
    
    /**
     * Gets workflow instances for a specific workflow definition with pagination.
     * 
     * @param definitionId The workflow definition ID
     * @param pageable Pagination information
     * @return Page of workflow instances
     */
    @GetMapping("/instances/definition/{definitionId}")
    public ResponseEntity<Page<WorkflowInstance>> getWorkflowInstancesByDefinition(
            @PathVariable String definitionId, Pageable pageable) {
        Page<WorkflowInstance> instances = workflowMonitoringService.getWorkflowInstancesByDefinition(definitionId, pageable);
        return ResponseEntity.ok(instances);
    }
    
    /**
     * Gets workflow instances that have been running for longer than a specified duration.
     * 
     * @param minutes The duration in minutes
     * @return List of long-running workflow instances
     */
    @GetMapping("/instances/long-running")
    public ResponseEntity<List<WorkflowInstance>> getLongRunningWorkflows(
            @RequestParam(defaultValue = "60") int minutes) {
        List<WorkflowInstance> instances = workflowMonitoringService.getLongRunningWorkflows(minutes);
        return ResponseEntity.ok(instances);
    }
    
    /**
     * Gets workflow instances that have failed.
     * 
     * @return List of failed workflow instances
     */
    @GetMapping("/instances/failed")
    public ResponseEntity<List<WorkflowInstance>> getFailedWorkflows() {
        List<WorkflowInstance> instances = workflowMonitoringService.getFailedWorkflows();
        return ResponseEntity.ok(instances);
    }
    
    /**
     * Gets workflow instances that have been completed within a time range.
     * 
     * @param start The start time
     * @param end The end time
     * @return List of completed workflow instances
     */
    @GetMapping("/instances/completed")
    public ResponseEntity<List<WorkflowInstance>> getCompletedWorkflowsInTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<WorkflowInstance> instances = workflowMonitoringService.getCompletedWorkflowsInTimeRange(start, end);
        return ResponseEntity.ok(instances);
    }
    
    /**
     * Gets step executions that have failed.
     * 
     * @return List of failed step executions
     */
    @GetMapping("/steps/failed")
    public ResponseEntity<List<StepExecution>> getFailedStepExecutions() {
        List<StepExecution> stepExecutions = workflowMonitoringService.getFailedStepExecutions();
        return ResponseEntity.ok(stepExecutions);
    }
    
    /**
     * Gets step executions that have timed out.
     * 
     * @return List of timed out step executions
     */
    @GetMapping("/steps/timed-out")
    public ResponseEntity<List<StepExecution>> getTimedOutStepExecutions() {
        List<StepExecution> stepExecutions = workflowMonitoringService.getTimedOutStepExecutions();
        return ResponseEntity.ok(stepExecutions);
    }
    
    /**
     * Gets workflow execution statistics.
     * 
     * @return Map of statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getWorkflowStatistics() {
        Map<String, Object> statistics = workflowMonitoringService.getWorkflowStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Gets workflow execution statistics for a specific workflow definition.
     * 
     * @param definitionId The workflow definition ID
     * @return Map of statistics
     */
    @GetMapping("/statistics/definition/{definitionId}")
    public ResponseEntity<Map<String, Object>> getWorkflowStatisticsByDefinition(
            @PathVariable String definitionId) {
        Map<String, Object> statistics = workflowMonitoringService.getWorkflowStatisticsByDefinition(definitionId);
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Gets step execution statistics for a specific workflow instance.
     * 
     * @param instanceId The workflow instance ID
     * @return Map of statistics
     */
    @GetMapping("/statistics/instance/{instanceId}/steps")
    public ResponseEntity<Map<String, Object>> getStepStatisticsByWorkflowInstance(
            @PathVariable String instanceId) {
        Map<String, Object> statistics = workflowMonitoringService.getStepStatisticsByWorkflowInstance(instanceId);
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Detects and reports stalled workflows.
     * 
     * @param minutes The threshold in minutes
     * @return List of stalled workflow instances
     */
    @GetMapping("/stalled-workflows")
    public ResponseEntity<List<WorkflowInstance>> detectStalledWorkflows(
            @RequestParam(defaultValue = "30") int minutes) {
        List<WorkflowInstance> instances = workflowMonitoringService.detectStalledWorkflows(minutes);
        return ResponseEntity.ok(instances);
    }
    
    /**
     * Detects and reports stalled step executions.
     * 
     * @param minutes The threshold in minutes
     * @return List of stalled step executions
     */
    @GetMapping("/stalled-steps")
    public ResponseEntity<List<StepExecution>> detectStalledStepExecutions(
            @RequestParam(defaultValue = "15") int minutes) {
        List<StepExecution> stepExecutions = workflowMonitoringService.detectStalledStepExecutions(minutes);
        return ResponseEntity.ok(stepExecutions);
    }
}
