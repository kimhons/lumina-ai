package ai.lumina.governance.repository;

import ai.lumina.governance.model.GovernancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

/**
 * Repository interface for GovernancePolicy entity operations
 */
@Repository
public interface GovernancePolicyRepository extends JpaRepository<GovernancePolicy, String> {

    /**
     * Find policies by type
     * 
     * @param type The policy type
     * @return List of policies of the specified type
     */
    List<GovernancePolicy> findByType(GovernancePolicy.PolicyType type);
    
    /**
     * Find policies by scope
     * 
     * @param scope The policy scope
     * @return List of policies with the specified scope
     */
    List<GovernancePolicy> findByScope(GovernancePolicy.PolicyScope scope);
    
    /**
     * Find enabled policies
     * 
     * @return List of enabled policies
     */
    List<GovernancePolicy> findByEnabledTrue();
    
    /**
     * Find enabled policies by type
     * 
     * @param type The policy type
     * @return List of enabled policies of the specified type
     */
    List<GovernancePolicy> findByTypeAndEnabledTrue(GovernancePolicy.PolicyType type);
    
    /**
     * Find enabled policies by scope
     * 
     * @param scope The policy scope
     * @return List of enabled policies with the specified scope
     */
    List<GovernancePolicy> findByScopeAndEnabledTrue(GovernancePolicy.PolicyScope scope);
    
    /**
     * Find policies by applicable region
     * 
     * @param region The region
     * @return List of policies applicable to the specified region
     */
    @Query("SELECT p FROM GovernancePolicy p WHERE :region MEMBER OF p.applicableRegions")
    List<GovernancePolicy> findByApplicableRegion(@Param("region") GovernancePolicy.Region region);
    
    /**
     * Find enabled policies by applicable region
     * 
     * @param region The region
     * @return List of enabled policies applicable to the specified region
     */
    @Query("SELECT p FROM GovernancePolicy p WHERE :region MEMBER OF p.applicableRegions AND p.enabled = true")
    List<GovernancePolicy> findByApplicableRegionAndEnabledTrue(@Param("region") GovernancePolicy.Region region);
    
    /**
     * Find policies by type and scope
     * 
     * @param type The policy type
     * @param scope The policy scope
     * @return List of policies with the specified type and scope
     */
    List<GovernancePolicy> findByTypeAndScope(GovernancePolicy.PolicyType type, GovernancePolicy.PolicyScope scope);
    
    /**
     * Find enabled policies by type and scope
     * 
     * @param type The policy type
     * @param scope The policy scope
     * @return List of enabled policies with the specified type and scope
     */
    List<GovernancePolicy> findByTypeAndScopeAndEnabledTrue(GovernancePolicy.PolicyType type, GovernancePolicy.PolicyScope scope);
    
    /**
     * Find policies by type and applicable region
     * 
     * @param type The policy type
     * @param region The region
     * @return List of policies with the specified type applicable to the specified region
     */
    @Query("SELECT p FROM GovernancePolicy p WHERE p.type = :type AND :region MEMBER OF p.applicableRegions")
    List<GovernancePolicy> findByTypeAndApplicableRegion(
            @Param("type") GovernancePolicy.PolicyType type, 
            @Param("region") GovernancePolicy.Region region);
    
    /**
     * Find enabled policies by type and applicable region
     * 
     * @param type The policy type
     * @param region The region
     * @return List of enabled policies with the specified type applicable to the specified region
     */
    @Query("SELECT p FROM GovernancePolicy p WHERE p.type = :type AND :region MEMBER OF p.applicableRegions AND p.enabled = true")
    List<GovernancePolicy> findByTypeAndApplicableRegionAndEnabledTrue(
            @Param("type") GovernancePolicy.PolicyType type, 
            @Param("region") GovernancePolicy.Region region);
    
    /**
     * Find policies ordered by priority (highest first)
     * 
     * @return List of policies ordered by priority
     */
    List<GovernancePolicy> findAllByOrderByPriorityDesc();
    
    /**
     * Find enabled policies ordered by priority (highest first)
     * 
     * @return List of enabled policies ordered by priority
     */
    List<GovernancePolicy> findByEnabledTrueOrderByPriorityDesc();
    
    /**
     * Find policies by name containing the specified string (case insensitive)
     * 
     * @param name The name to search for
     * @return List of policies with names containing the specified string
     */
    List<GovernancePolicy> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find policies by creator
     * 
     * @param createdBy The creator
     * @return List of policies created by the specified user
     */
    List<GovernancePolicy> findByCreatedBy(String createdBy);
}
