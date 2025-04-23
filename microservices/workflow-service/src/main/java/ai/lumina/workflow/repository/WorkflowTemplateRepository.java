package ai.lumina.workflow.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import ai.lumina.workflow.model.WorkflowTemplate;

/**
 * Repository interface for WorkflowTemplate entities.
 */
@Repository
public interface WorkflowTemplateRepository extends MongoRepository<WorkflowTemplate, String> {
    
    /**
     * Find workflow templates by name.
     * 
     * @param name The name to search for
     * @return List of matching workflow templates
     */
    List<WorkflowTemplate> findByName(String name);
    
    /**
     * Find public workflow templates.
     * 
     * @return List of public workflow templates
     */
    List<WorkflowTemplate> findByIsPublicTrue();
    
    /**
     * Find workflow templates by category.
     * 
     * @param category The category to search for
     * @return List of matching workflow templates
     */
    List<WorkflowTemplate> findByCategory(String category);
    
    /**
     * Find workflow templates by created user.
     * 
     * @param createdBy The user who created the template
     * @return List of matching workflow templates
     */
    List<WorkflowTemplate> findByCreatedBy(String createdBy);
    
    /**
     * Find workflow templates by version.
     * 
     * @param version The version to search for
     * @return List of matching workflow templates
     */
    List<WorkflowTemplate> findByVersion(int version);
    
    /**
     * Find the latest version of a workflow template by name.
     * 
     * @param name The name to search for
     * @return The latest version of the workflow template
     */
    @Query(value = "{ 'name': ?0 }", sort = "{ 'version': -1 }")
    WorkflowTemplate findLatestByName(String name);
    
    /**
     * Find workflow templates by metadata key and value.
     * 
     * @param key The metadata key
     * @param value The metadata value
     * @return List of matching workflow templates
     */
    @Query("{ 'metadata.?0': ?1 }")
    List<WorkflowTemplate> findByMetadata(String key, Object value);
}
