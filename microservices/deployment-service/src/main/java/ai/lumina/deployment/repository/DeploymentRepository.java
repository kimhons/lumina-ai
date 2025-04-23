package ai.lumina.deployment.repository;

import ai.lumina.deployment.model.Deployment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Deployment entity operations
 */
@Repository
public interface DeploymentRepository extends JpaRepository<Deployment, String> {

    /**
     * Find deployments by environment
     * 
     * @param environment The deployment environment (DEV, STAGING, PROD)
     * @return List of deployments for the specified environment
     */
    List<Deployment> findByEnvironment(String environment);
    
    /**
     * Find deployments by status
     * 
     * @param status The deployment status
     * @return List of deployments with the specified status
     */
    List<Deployment> findByStatus(String status);
    
    /**
     * Find deployments by environment and status
     * 
     * @param environment The deployment environment
     * @param status The deployment status
     * @return List of deployments for the specified environment and status
     */
    List<Deployment> findByEnvironmentAndStatus(String environment, String status);
    
    /**
     * Find deployments created after a specific date
     * 
     * @param date The date to filter by
     * @return List of deployments created after the specified date
     */
    List<Deployment> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find deployments by creator
     * 
     * @param createdBy The user who created the deployment
     * @return List of deployments created by the specified user
     */
    List<Deployment> findByCreatedBy(String createdBy);
    
    /**
     * Find deployments that contain a specific component
     * 
     * @param componentName The name of the component
     * @return List of deployments containing the specified component
     */
    @Query("SELECT d FROM Deployment d JOIN d.components c WHERE c.name = :componentName")
    List<Deployment> findByComponentName(@Param("componentName") String componentName);
    
    /**
     * Find deployments using a specific strategy
     * 
     * @param strategy The deployment strategy
     * @return List of deployments using the specified strategy
     */
    List<Deployment> findByStrategy(String strategy);
    
    /**
     * Find recent deployments limited by count
     * 
     * @param limit The maximum number of deployments to return
     * @return List of recent deployments
     */
    @Query(value = "SELECT * FROM deployment ORDER BY created_at DESC LIMIT :limit", nativeQuery = true)
    List<Deployment> findRecentDeployments(@Param("limit") int limit);
    
    /**
     * Count deployments by environment
     * 
     * @param environment The deployment environment
     * @return Count of deployments for the specified environment
     */
    long countByEnvironment(String environment);
    
    /**
     * Count deployments by status
     * 
     * @param status The deployment status
     * @return Count of deployments with the specified status
     */
    long countByStatus(String status);
}
