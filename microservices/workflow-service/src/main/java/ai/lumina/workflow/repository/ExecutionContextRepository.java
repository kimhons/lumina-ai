package ai.lumina.workflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import ai.lumina.workflow.model.ExecutionContext;

/**
 * Repository interface for ExecutionContext entities.
 */
@Repository
public interface ExecutionContextRepository extends MongoRepository<ExecutionContext, String> {
    
    /**
     * Find execution context by workflow instance ID.
     * 
     * @param workflowInstanceId The workflow instance ID to search for
     * @return The execution context for the workflow instance
     */
    Optional<ExecutionContext> findByWorkflowInstanceId(String workflowInstanceId);
    
    /**
     * Find execution contexts by metadata key and value.
     * 
     * @param key The metadata key
     * @param value The metadata value
     * @return List of matching execution contexts
     */
    @Query("{ 'metadata.?0': ?1 }")
    List<ExecutionContext> findByMetadata(String key, Object value);
    
    /**
     * Find execution contexts by data key and value.
     * 
     * @param key The data key
     * @param value The data value
     * @return List of matching execution contexts
     */
    @Query("{ 'data.?0': ?1 }")
    List<ExecutionContext> findByData(String key, Object value);
    
    /**
     * Find the latest version of an execution context by workflow instance ID.
     * 
     * @param workflowInstanceId The workflow instance ID to search for
     * @return The latest version of the execution context
     */
    @Query(value = "{ 'workflowInstanceId': ?0 }", sort = "{ 'version': -1 }")
    Optional<ExecutionContext> findLatestByWorkflowInstanceId(String workflowInstanceId);
    
    /**
     * Delete execution contexts by workflow instance ID.
     * 
     * @param workflowInstanceId The workflow instance ID to delete
     */
    void deleteByWorkflowInstanceId(String workflowInstanceId);
}
