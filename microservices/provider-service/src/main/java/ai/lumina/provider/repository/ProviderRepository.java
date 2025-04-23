package ai.lumina.provider.repository;

import ai.lumina.provider.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

/**
 * Repository interface for Provider entity operations
 */
@Repository
public interface ProviderRepository extends JpaRepository<Provider, String> {

    /**
     * Find providers by type
     * 
     * @param type The provider type
     * @return List of providers of the specified type
     */
    List<Provider> findByType(Provider.ProviderType type);
    
    /**
     * Find enabled providers
     * 
     * @return List of enabled providers
     */
    List<Provider> findByEnabledTrue();
    
    /**
     * Find enabled providers by type
     * 
     * @param type The provider type
     * @return List of enabled providers of the specified type
     */
    List<Provider> findByTypeAndEnabledTrue(Provider.ProviderType type);
    
    /**
     * Find providers by capability
     * 
     * @param capability The capability
     * @return List of providers with the specified capability
     */
    @Query("SELECT p FROM Provider p JOIN p.capabilities c WHERE c = :capability")
    List<Provider> findByCapability(@Param("capability") Provider.Capability capability);
    
    /**
     * Find enabled providers by capability
     * 
     * @param capability The capability
     * @return List of enabled providers with the specified capability
     */
    @Query("SELECT p FROM Provider p JOIN p.capabilities c WHERE c = :capability AND p.enabled = true")
    List<Provider> findByCapabilityAndEnabledTrue(@Param("capability") Provider.Capability capability);
    
    /**
     * Find providers by multiple capabilities (must have all)
     * 
     * @param capabilities The set of capabilities
     * @return List of providers with all the specified capabilities
     */
    @Query("SELECT p FROM Provider p WHERE p.capabilities @> :capabilities")
    List<Provider> findByCapabilitiesAll(@Param("capabilities") Set<Provider.Capability> capabilities);
    
    /**
     * Find enabled providers by multiple capabilities (must have all)
     * 
     * @param capabilities The set of capabilities
     * @return List of enabled providers with all the specified capabilities
     */
    @Query("SELECT p FROM Provider p WHERE p.capabilities @> :capabilities AND p.enabled = true")
    List<Provider> findByCapabilitiesAllAndEnabledTrue(@Param("capabilities") Set<Provider.Capability> capabilities);
    
    /**
     * Find providers ordered by priority weight (highest first)
     * 
     * @return List of providers ordered by priority weight
     */
    List<Provider> findAllByOrderByPriorityWeightDesc();
    
    /**
     * Find enabled providers ordered by priority weight (highest first)
     * 
     * @return List of enabled providers ordered by priority weight
     */
    List<Provider> findByEnabledTrueOrderByPriorityWeightDesc();
}
