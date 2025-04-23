package ai.lumina.workflow.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.StepExecution.StepStatus;

/**
 * Repository interface for StepExecution entities.
 */
@Repository
public interface StepExecutionRepository extends MongoRepository<StepExecution, String> {
    
    /**
     * Find step executions by workflow instance ID.
     * 
     * @param workflowInstanceId The workflow instance ID to search for
     * @return List of matching step executions
     */
    List<StepExecution> findByWorkflowInstanceId(String workflowInstanceId);
    
    /**
     * Find step executions by step ID.
     * 
     * @param stepId The step ID to search for
     * @return List of matching step executions
     */
    List<StepExecution> findByStepId(String stepId);
    
    /**
     * Find step executions by status.
     * 
     * @param status The status to search for
     * @return List of matching step executions
     */
    List<StepExecution> findByStatus(StepStatus status);
    
    /**
     * Find step executions by assigned agent ID.
     * 
     * @param assignedAgentId The assigned agent ID to search for
     * @return List of matching step executions
     */
    List<StepExecution> findByAssignedAgentId(String assignedAgentId);
    
    /**
     * Find step executions by assigned agent role.
     * 
     * @param assignedAgentRole The assigned agent role to search for
     * @return List of matching step executions
     */
    List<StepExecution> findByAssignedAgentRole(String assignedAgentRole);
    
    /**
     * Find step executions by workflow instance ID and status.
     * 
     * @param workflowInstanceId The workflow instance ID to search for
     * @param status The status to search for
     * @return List of matching step executions
     */
    List<StepExecution> findByWorkflowInstanceIdAndStatus(String workflowInstanceId, StepStatus status);
    
    /**
     * Find step executions by workflow instance ID, ordered by creation time.
     * 
     * @param workflowInstanceId The workflow instance ID to search for
     * @return List of matching step executions
     */
    @Query(value = "{ 'workflowInstanceId': ?0 }", sort = "{ 'createdAt': 1 }")
    List<StepExecution> findByWorkflowInstanceIdOrderByCreatedAt(String workflowInstanceId);
    
    /**
     * Find step executions by metadata key and value.
     * 
     * @param key The metadata key
     * @param value The metadata value
     * @return List of matching step executions
     */
    @Query("{ 'metadata.?0': ?1 }")
    List<StepExecution> findByMetadata(String key, Object value);
    
    /**
     * Find running step executions that have been updated before a certain time.
     * 
     * @param updatedAt The time threshold
     * @return List of matching step executions
     */
    @Query("{ 'status': 'RUNNING', 'updatedAt': { $lt: ?0 } }")
    List<StepExecution> findStaleRunningSteps(String updatedAt);
    
    /**
     * Count step executions by workflow instance ID and status.
     * 
     * @param workflowInstanceId The workflow instance ID to search for
     * @param status The status to search for
     * @return The count of matching step executions
     */
    long countByWorkflowInstanceIdAndStatus(String workflowInstanceId, StepStatus status);
}
