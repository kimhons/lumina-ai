package ai.lumina.provider.repository;

import ai.lumina.provider.model.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Tool entity operations
 */
@Repository
public interface ToolRepository extends JpaRepository<Tool, String> {

    /**
     * Find tools by type
     * 
     * @param type The tool type
     * @return List of tools of the specified type
     */
    List<Tool> findByType(Tool.ToolType type);
    
    /**
     * Find enabled tools
     * 
     * @return List of enabled tools
     */
    List<Tool> findByEnabledTrue();
    
    /**
     * Find enabled tools by type
     * 
     * @param type The tool type
     * @return List of enabled tools of the specified type
     */
    List<Tool> findByTypeAndEnabledTrue(Tool.ToolType type);
    
    /**
     * Find tools that support a specific provider
     * 
     * @param providerId The provider ID
     * @return List of tools that support the specified provider
     */
    @Query("SELECT t FROM Tool t WHERE :providerId MEMBER OF t.supportedProviders")
    List<Tool> findBySupportedProvider(@Param("providerId") String providerId);
    
    /**
     * Find enabled tools that support a specific provider
     * 
     * @param providerId The provider ID
     * @return List of enabled tools that support the specified provider
     */
    @Query("SELECT t FROM Tool t WHERE :providerId MEMBER OF t.supportedProviders AND t.enabled = true")
    List<Tool> findBySupportedProviderAndEnabledTrue(@Param("providerId") String providerId);
    
    /**
     * Find tools by name containing the specified string (case insensitive)
     * 
     * @param name The name to search for
     * @return List of tools with names containing the specified string
     */
    List<Tool> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find tools by implementation class
     * 
     * @param implementationClass The implementation class
     * @return List of tools with the specified implementation class
     */
    List<Tool> findByImplementationClass(String implementationClass);
}
