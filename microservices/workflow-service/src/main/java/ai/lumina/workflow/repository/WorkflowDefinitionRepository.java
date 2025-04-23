package ai.lumina.workflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import ai.lumina.workflow.model.WorkflowDefinition;

/**
 * Repository interface for WorkflowDefinition entities.
 */
@Repository
public interface WorkflowDefinitionRepository extends MongoRepository<WorkflowDefinition, String> {
    
    /**
     * Find workflow definitions by name.
     * 
     * @param name The name to search for
     * @return List of matching workflow definitions
     */
    List<WorkflowDefinition> findByName(String name);
    
    /**
     * Find active workflow definitions.
     * 
     * @return List of active workflow definitions
     */
    List<WorkflowDefinition> findByIsActiveTrue();
    
    /**
     * Find workflow templates.
     * 
     * @return List of workflow templates
     */
    List<WorkflowDefinition> findByIsTemplateTrue();
    
    /**
     * Find workflow definitions by created user.
     * 
     * @param createdBy The user who created the workflow
     * @return List of matching workflow definitions
     */
    List<WorkflowDefinition> findByCreatedBy(String createdBy);
    
    /**
     * Find workflow definitions by version.
     * 
     * @param version The version to search for
     * @return List of matching workflow definitions
     */
    List<WorkflowDefinition> findByVersion(String version);
    
    /**
     * Find the latest version of a workflow definition by name.
     * 
     * @param name The name to search for
     * @return The latest version of the workflow definition
     */
    @Query(value = "{ 'name': ?0 }", sort = "{ 'createdAt': -1 }")
    Optional<WorkflowDefinition> findLatestByName(String name);
    
    /**
     * Find workflow definitions containing a specific step ID.
     * 
     * @param stepId The step ID to search for
     * @return List of workflow definitions containing the step
     */
    @Query("{ 'steps.id': ?0 }")
    List<WorkflowDefinition> findByStepId(String stepId);
    
    /**
     * Find workflow definitions by metadata key and value.
     * 
     * @param key The metadata key
     * @param value The metadata value
     * @return List of matching workflow definitions
     */
    @Query("{ 'metadata.?0': ?1 }")
    List<WorkflowDefinition> findByMetadata(String key, Object value);
}
