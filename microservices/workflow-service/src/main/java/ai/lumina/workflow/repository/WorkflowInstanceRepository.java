package ai.lumina.workflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.model.WorkflowInstance.WorkflowStatus;

/**
 * Repository interface for WorkflowInstance entities.
 */
@Repository
public interface WorkflowInstanceRepository extends MongoRepository<WorkflowInstance, String> {
    
    /**
     * Find workflow instances by workflow definition ID.
     * 
     * @param workflowDefinitionId The workflow definition ID to search for
     * @return List of matching workflow instances
     */
    List<WorkflowInstance> findByWorkflowDefinitionId(String workflowDefinitionId);
    
    /**
     * Find workflow instances by status.
     * 
     * @param status The status to search for
     * @return List of matching workflow instances
     */
    List<WorkflowInstance> findByStatus(WorkflowStatus status);
    
    /**
     * Find workflow instances by created user.
     * 
     * @param createdBy The user who created the workflow instance
     * @return List of matching workflow instances
     */
    List<WorkflowInstance> findByCreatedBy(String createdBy);
    
    /**
     * Find workflow instances by current step ID.
     * 
     * @param currentStepId The current step ID to search for
     * @return List of matching workflow instances
     */
    List<WorkflowInstance> findByCurrentStepId(String currentStepId);
    
    /**
     * Find workflow instances by name.
     * 
     * @param name The name to search for
     * @return List of matching workflow instances
     */
    List<WorkflowInstance> findByName(String name);
    
    /**
     * Find workflow instances by priority.
     * 
     * @param priority The priority to search for
     * @return List of matching workflow instances
     */
    List<WorkflowInstance> findByPriority(int priority);
    
    /**
     * Find workflow instances by status and priority, ordered by priority.
     * 
     * @param status The status to search for
     * @return List of matching workflow instances
     */
    @Query(value = "{ 'status': ?0 }", sort = "{ 'priority': -1 }")
    List<WorkflowInstance> findByStatusOrderByPriorityDesc(WorkflowStatus status);
    
    /**
     * Find workflow instances by metadata key and value.
     * 
     * @param key The metadata key
     * @param value The metadata value
     * @return List of matching workflow instances
     */
    @Query("{ 'metadata.?0': ?1 }")
    List<WorkflowInstance> findByMetadata(String key, Object value);
    
    /**
     * Find workflow instances by context key and value.
     * 
     * @param key The context key
     * @param value The context value
     * @return List of matching workflow instances
     */
    @Query("{ 'context.?0': ?1 }")
    List<WorkflowInstance> findByContext(String key, Object value);
    
    /**
     * Find running workflow instances that have been updated before a certain time.
     * 
     * @param updatedAt The time threshold
     * @return List of matching workflow instances
     */
    @Query("{ 'status': 'RUNNING', 'updatedAt': { $lt: ?0 } }")
    List<WorkflowInstance> findStaleRunningInstances(String updatedAt);
}
