package ai.lumina.workflow.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.model.WorkflowInstance.WorkflowStatus;
import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.StepExecution.StepStatus;
import ai.lumina.workflow.repository.WorkflowInstanceRepository;
import ai.lumina.workflow.repository.StepExecutionRepository;

/**
 * Service for monitoring workflow execution and providing analytics.
 */
@Service
public class WorkflowMonitoringService {

    @Autowired
    private WorkflowInstanceRepository workflowInstanceRepository;
    
    @Autowired
    private StepExecutionRepository stepExecutionRepository;
    
    /**
     * Gets all workflow instances with pagination.
     * 
     * @param pageable Pagination information
     * @return Page of workflow instances
     */
    public Page<WorkflowInstance> getAllWorkflowInstances(Pageable pageable) {
        return workflowInstanceRepository.findAll(pageable);
    }
    
    /**
     * Gets workflow instances by status with pagination.
     * 
     * @param status The status to filter by
     * @param pageable Pagination information
     * @return Page of workflow instances
     */
    public Page<WorkflowInstance> getWorkflowInstancesByStatus(WorkflowStatus status, Pageable pageable) {
        return workflowInstanceRepository.findByStatus(status, pageable);
    }
    
    /**
     * Gets workflow instances created by a specific user with pagination.
     * 
     * @param userId The user ID
     * @param pageable Pagination information
     * @return Page of workflow instances
     */
    public Page<WorkflowInstance> getWorkflowInstancesByUser(String userId, Pageable pageable) {
        return workflowInstanceRepository.findByCreatedBy(userId, pageable);
    }
    
    /**
     * Gets workflow instances for a specific workflow definition with pagination.
     * 
     * @param definitionId The workflow definition ID
     * @param pageable Pagination information
     * @return Page of workflow instances
     */
    public Page<WorkflowInstance> getWorkflowInstancesByDefinition(String definitionId, Pageable pageable) {
        return workflowInstanceRepository.findByWorkflowDefinitionId(definitionId, pageable);
    }
    
    /**
     * Gets workflow instances that have been running for longer than a specified duration.
     * 
     * @param minutes The duration in minutes
     * @return List of long-running workflow instances
     */
    public List<WorkflowInstance> getLongRunningWorkflows(int minutes) {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(minutes);
        return workflowInstanceRepository.findByStatusAndStartedAtBefore(WorkflowStatus.RUNNING, threshold);
    }
    
    /**
     * Gets workflow instances that have failed.
     * 
     * @return List of failed workflow instances
     */
    public List<WorkflowInstance> getFailedWorkflows() {
        return workflowInstanceRepository.findByStatus(WorkflowStatus.FAILED);
    }
    
    /**
     * Gets workflow instances that have been completed within a time range.
     * 
     * @param start The start time
     * @param end The end time
     * @return List of completed workflow instances
     */
    public List<WorkflowInstance> getCompletedWorkflowsInTimeRange(LocalDateTime start, LocalDateTime end) {
        return workflowInstanceRepository.findByStatusAndCompletedAtBetween(WorkflowStatus.COMPLETED, start, end);
    }
    
    /**
     * Gets step executions that have failed.
     * 
     * @return List of failed step executions
     */
    public List<StepExecution> getFailedStepExecutions() {
        return stepExecutionRepository.findByStatus(StepStatus.FAILED);
    }
    
    /**
     * Gets step executions that have timed out.
     * 
     * @return List of timed out step executions
     */
    public List<StepExecution> getTimedOutStepExecutions() {
        return stepExecutionRepository.findByStatus(StepStatus.TIMEOUT);
    }
    
    /**
     * Gets workflow execution statistics.
     * 
     * @return Map of statistics
     */
    public Map<String, Object> getWorkflowStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Count workflows by status
        for (WorkflowStatus status : WorkflowStatus.values()) {
            long count = workflowInstanceRepository.countByStatus(status);
            statistics.put("count_" + status.name().toLowerCase(), count);
        }
        
        // Count total workflows
        long totalCount = workflowInstanceRepository.count();
        statistics.put("count_total", totalCount);
        
        // Calculate average completion time for completed workflows
        List<WorkflowInstance> completedWorkflows = workflowInstanceRepository.findByStatus(WorkflowStatus.COMPLETED);
        if (!completedWorkflows.isEmpty()) {
            double avgCompletionTimeMinutes = completedWorkflows.stream()
                    .filter(w -> w.getStartedAt() != null && w.getCompletedAt() != null)
                    .mapToDouble(w -> {
                        long startMillis = w.getStartedAt().toEpochSecond(java.time.ZoneOffset.UTC);
                        long endMillis = w.getCompletedAt().toEpochSecond(java.time.ZoneOffset.UTC);
                        return (endMillis - startMillis) / 60.0;
                    })
                    .average()
                    .orElse(0);
            
            statistics.put("avg_completion_time_minutes", avgCompletionTimeMinutes);
        }
        
        // Count step executions by status
        for (StepStatus status : StepStatus.values()) {
            long count = stepExecutionRepository.countByStatus(status);
            statistics.put("step_count_" + status.name().toLowerCase(), count);
        }
        
        return statistics;
    }
    
    /**
     * Gets workflow execution statistics for a specific workflow definition.
     * 
     * @param definitionId The workflow definition ID
     * @return Map of statistics
     */
    public Map<String, Object> getWorkflowStatisticsByDefinition(String definitionId) {
        Map<String, Object> statistics = new HashMap<>();
        
        List<WorkflowInstance> instances = workflowInstanceRepository.findByWorkflowDefinitionId(definitionId);
        
        // Count workflows by status
        for (WorkflowStatus status : WorkflowStatus.values()) {
            long count = instances.stream()
                    .filter(w -> w.getStatus() == status)
                    .count();
            statistics.put("count_" + status.name().toLowerCase(), count);
        }
        
        // Count total workflows
        statistics.put("count_total", instances.size());
        
        // Calculate average completion time for completed workflows
        List<WorkflowInstance> completedWorkflows = instances.stream()
                .filter(w -> w.getStatus() == WorkflowStatus.COMPLETED)
                .collect(Collectors.toList());
        
        if (!completedWorkflows.isEmpty()) {
            double avgCompletionTimeMinutes = completedWorkflows.stream()
                    .filter(w -> w.getStartedAt() != null && w.getCompletedAt() != null)
                    .mapToDouble(w -> {
                        long startMillis = w.getStartedAt().toEpochSecond(java.time.ZoneOffset.UTC);
                        long endMillis = w.getCompletedAt().toEpochSecond(java.time.ZoneOffset.UTC);
                        return (endMillis - startMillis) / 60.0;
                    })
                    .average()
                    .orElse(0);
            
            statistics.put("avg_completion_time_minutes", avgCompletionTimeMinutes);
        }
        
        return statistics;
    }
    
    /**
     * Gets step execution statistics for a specific workflow instance.
     * 
     * @param instanceId The workflow instance ID
     * @return Map of statistics
     */
    public Map<String, Object> getStepStatisticsByWorkflowInstance(String instanceId) {
        Map<String, Object> statistics = new HashMap<>();
        
        List<StepExecution> stepExecutions = stepExecutionRepository.findByWorkflowInstanceId(instanceId);
        
        // Count steps by status
        for (StepStatus status : StepStatus.values()) {
            long count = stepExecutions.stream()
                    .filter(s -> s.getStatus() == status)
                    .count();
            statistics.put("count_" + status.name().toLowerCase(), count);
        }
        
        // Count total steps
        statistics.put("count_total", stepExecutions.size());
        
        // Calculate average execution time for completed steps
        List<StepExecution> completedSteps = stepExecutions.stream()
                .filter(s -> s.getStatus() == StepStatus.COMPLETED)
                .collect(Collectors.toList());
        
        if (!completedSteps.isEmpty()) {
            double avgExecutionTimeSeconds = completedSteps.stream()
                    .filter(s -> s.getStartedAt() != null && s.getCompletedAt() != null)
                    .mapToDouble(s -> {
                        long startMillis = s.getStartedAt().toEpochSecond(java.time.ZoneOffset.UTC);
                        long endMillis = s.getCompletedAt().toEpochSecond(java.time.ZoneOffset.UTC);
                        return endMillis - startMillis;
                    })
                    .average()
                    .orElse(0);
            
            statistics.put("avg_execution_time_seconds", avgExecutionTimeSeconds);
        }
        
        return statistics;
    }
    
    /**
     * Detects and reports stalled workflows.
     * 
     * @param minutes The threshold in minutes
     * @return List of stalled workflow instances
     */
    public List<WorkflowInstance> detectStalledWorkflows(int minutes) {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(minutes);
        return workflowInstanceRepository.findByStatusAndUpdatedAtBefore(WorkflowStatus.RUNNING, threshold);
    }
    
    /**
     * Detects and reports stalled step executions.
     * 
     * @param minutes The threshold in minutes
     * @return List of stalled step executions
     */
    public List<StepExecution> detectStalledStepExecutions(int minutes) {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(minutes);
        return stepExecutionRepository.findByStatusAndUpdatedAtBefore(StepStatus.RUNNING, threshold);
    }
}
