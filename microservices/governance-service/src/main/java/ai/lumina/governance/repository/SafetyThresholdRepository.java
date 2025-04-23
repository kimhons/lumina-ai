package ai.lumina.governance.repository;

import ai.lumina.governance.model.SafetyThreshold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for SafetyThreshold entity operations
 */
@Repository
public interface SafetyThresholdRepository extends JpaRepository<SafetyThreshold, String> {

    /**
     * Find thresholds by category
     * 
     * @param category The threshold category
     * @return List of thresholds of the specified category
     */
    List<SafetyThreshold> findByCategory(SafetyThreshold.ThresholdCategory category);
    
    /**
     * Find enabled thresholds
     * 
     * @return List of enabled thresholds
     */
    List<SafetyThreshold> findByEnabledTrue();
    
    /**
     * Find enabled thresholds by category
     * 
     * @param category The threshold category
     * @return List of enabled thresholds of the specified category
     */
    List<SafetyThreshold> findByCategoryAndEnabledTrue(SafetyThreshold.ThresholdCategory category);
    
    /**
     * Find thresholds by action type
     * 
     * @param actionType The action type
     * @return List of thresholds with the specified action type
     */
    List<SafetyThreshold> findByActionOnThresholdExceeded(SafetyThreshold.ActionType actionType);
    
    /**
     * Find enabled thresholds by action type
     * 
     * @param actionType The action type
     * @return List of enabled thresholds with the specified action type
     */
    List<SafetyThreshold> findByActionOnThresholdExceededAndEnabledTrue(SafetyThreshold.ActionType actionType);
    
    /**
     * Find thresholds by applicable region
     * 
     * @param region The region
     * @return List of thresholds applicable to the specified region
     */
    @Query("SELECT t FROM SafetyThreshold t WHERE :region MEMBER OF t.applicableRegions")
    List<SafetyThreshold> findByApplicableRegion(@Param("region") ai.lumina.governance.model.GovernancePolicy.Region region);
    
    /**
     * Find enabled thresholds by applicable region
     * 
     * @param region The region
     * @return List of enabled thresholds applicable to the specified region
     */
    @Query("SELECT t FROM SafetyThreshold t WHERE :region MEMBER OF t.applicableRegions AND t.enabled = true")
    List<SafetyThreshold> findByApplicableRegionAndEnabledTrue(@Param("region") ai.lumina.governance.model.GovernancePolicy.Region region);
    
    /**
     * Find thresholds by dimension
     * 
     * @param dimension The dimension
     * @return List of thresholds with the specified dimension
     */
    @Query("SELECT t FROM SafetyThreshold t WHERE KEY(t.thresholdScores) = :dimension")
    List<SafetyThreshold> findByDimension(@Param("dimension") String dimension);
    
    /**
     * Find thresholds by dimension with value above threshold
     * 
     * @param dimension The dimension
     * @param value The threshold value
     * @return List of thresholds with the specified dimension and value above threshold
     */
    @Query("SELECT t FROM SafetyThreshold t WHERE KEY(t.thresholdScores) = :dimension AND VALUE(t.thresholdScores) > :value")
    List<SafetyThreshold> findByDimensionAndValueGreaterThan(
            @Param("dimension") String dimension, 
            @Param("value") double value);
    
    /**
     * Find thresholds ordered by priority (highest first)
     * 
     * @return List of thresholds ordered by priority
     */
    List<SafetyThreshold> findAllByOrderByPriorityDesc();
    
    /**
     * Find enabled thresholds ordered by priority (highest first)
     * 
     * @return List of enabled thresholds ordered by priority
     */
    List<SafetyThreshold> findByEnabledTrueOrderByPriorityDesc();
    
    /**
     * Find thresholds by name containing the specified string (case insensitive)
     * 
     * @param name The name to search for
     * @return List of thresholds with names containing the specified string
     */
    List<SafetyThreshold> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find thresholds by creator
     * 
     * @param createdBy The creator
     * @return List of thresholds created by the specified user
     */
    List<SafetyThreshold> findByCreatedBy(String createdBy);
    
    /**
     * Find thresholds by category and applicable region
     * 
     * @param category The threshold category
     * @param region The region
     * @return List of thresholds with the specified category applicable to the specified region
     */
    @Query("SELECT t FROM SafetyThreshold t WHERE t.category = :category AND :region MEMBER OF t.applicableRegions")
    List<SafetyThreshold> findByCategoryAndApplicableRegion(
            @Param("category") SafetyThreshold.ThresholdCategory category, 
            @Param("region") ai.lumina.governance.model.GovernancePolicy.Region region);
}
