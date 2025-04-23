package ai.lumina.deployment.repository;

import ai.lumina.deployment.model.Infrastructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Infrastructure entity operations
 */
@Repository
public interface InfrastructureRepository extends JpaRepository<Infrastructure, String> {

    /**
     * Find infrastructure by environment
     * 
     * @param environment The deployment environment (DEV, STAGING, PROD)
     * @return List of infrastructure for the specified environment
     */
    List<Infrastructure> findByEnvironment(String environment);
    
    /**
     * Find infrastructure by type
     * 
     * @param type The infrastructure type (KUBERNETES, VM, SERVERLESS)
     * @return List of infrastructure of the specified type
     */
    List<Infrastructure> findByType(String type);
    
    /**
     * Find infrastructure by status
     * 
     * @param status The infrastructure status
     * @return List of infrastructure with the specified status
     */
    List<Infrastructure> findByStatus(String status);
    
    /**
     * Find infrastructure by environment and type
     * 
     * @param environment The deployment environment
     * @param type The infrastructure type
     * @return List of infrastructure for the specified environment and type
     */
    List<Infrastructure> findByEnvironmentAndType(String environment, String type);
    
    /**
     * Find infrastructure by environment and status
     * 
     * @param environment The deployment environment
     * @param status The infrastructure status
     * @return List of infrastructure for the specified environment and status
     */
    List<Infrastructure> findByEnvironmentAndStatus(String environment, String status);
    
    /**
     * Find infrastructure containing a specific resource type
     * 
     * @param resourceType The type of resource
     * @return List of infrastructure containing the specified resource type
     */
    @Query("SELECT i FROM Infrastructure i JOIN i.resources r WHERE r.type = :resourceType")
    List<Infrastructure> findByResourceType(@Param("resourceType") String resourceType);
    
    /**
     * Find infrastructure containing a resource with a specific status
     * 
     * @param resourceStatus The status of the resource
     * @return List of infrastructure containing a resource with the specified status
     */
    @Query("SELECT i FROM Infrastructure i JOIN i.resources r WHERE r.status = :resourceStatus")
    List<Infrastructure> findByResourceStatus(@Param("resourceStatus") String resourceStatus);
    
    /**
     * Count infrastructure by environment
     * 
     * @param environment The deployment environment
     * @return Count of infrastructure for the specified environment
     */
    long countByEnvironment(String environment);
    
    /**
     * Count infrastructure by type
     * 
     * @param type The infrastructure type
     * @return Count of infrastructure of the specified type
     */
    long countByType(String type);
    
    /**
     * Count infrastructure by status
     * 
     * @param status The infrastructure status
     * @return Count of infrastructure with the specified status
     */
    long countByStatus(String status);
}
