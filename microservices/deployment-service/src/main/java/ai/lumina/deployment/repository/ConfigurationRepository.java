package ai.lumina.deployment.repository;

import ai.lumina.deployment.model.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Configuration entity operations
 */
@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, String> {

    /**
     * Find configurations by environment
     * 
     * @param environment The deployment environment (DEV, STAGING, PROD)
     * @return List of configurations for the specified environment
     */
    List<Configuration> findByEnvironment(String environment);
    
    /**
     * Find the latest version of a configuration by name and environment
     * 
     * @param name The configuration name
     * @param environment The deployment environment
     * @return The latest version of the configuration
     */
    @Query("SELECT c FROM Configuration c WHERE c.name = :name AND c.environment = :environment ORDER BY c.version DESC")
    Optional<Configuration> findLatestByNameAndEnvironment(@Param("name") String name, @Param("environment") String environment);
    
    /**
     * Find a specific version of a configuration
     * 
     * @param name The configuration name
     * @param environment The deployment environment
     * @param version The configuration version
     * @return The specified configuration version
     */
    Optional<Configuration> findByNameAndEnvironmentAndVersion(String name, String environment, String version);
    
    /**
     * Find configurations created by a specific user
     * 
     * @param createdBy The user who created the configuration
     * @return List of configurations created by the specified user
     */
    List<Configuration> findByCreatedBy(String createdBy);
    
    /**
     * Find configurations containing a specific key
     * 
     * @param key The configuration key to search for
     * @return List of configurations containing the specified key
     */
    @Query("SELECT c FROM Configuration c WHERE KEY(c.data) = :key")
    List<Configuration> findByDataKey(@Param("key") String key);
    
    /**
     * Count configurations by environment
     * 
     * @param environment The deployment environment
     * @return Count of configurations for the specified environment
     */
    long countByEnvironment(String environment);
    
    /**
     * Delete configurations by name and environment
     * 
     * @param name The configuration name
     * @param environment The deployment environment
     * @return Number of configurations deleted
     */
    long deleteByNameAndEnvironment(String name, String environment);
}
