package ai.lumina.governance.repository;

import ai.lumina.governance.model.UserConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for UserConsent entity operations
 */
@Repository
public interface UserConsentRepository extends JpaRepository<UserConsent, String> {

    /**
     * Find consents by user ID
     * 
     * @param userId The user ID
     * @return List of consents for the specified user
     */
    List<UserConsent> findByUserId(String userId);
    
    /**
     * Find consents by consent type
     * 
     * @param consentType The consent type
     * @return List of consents of the specified type
     */
    List<UserConsent> findByConsentType(UserConsent.ConsentType consentType);
    
    /**
     * Find consents by consent status
     * 
     * @param consentGiven The consent status
     * @return List of consents with the specified status
     */
    List<UserConsent> findByConsentGiven(boolean consentGiven);
    
    /**
     * Find consents by region
     * 
     * @param region The region
     * @return List of consents for the specified region
     */
    List<UserConsent> findByRegion(ai.lumina.governance.model.GovernancePolicy.Region region);
    
    /**
     * Find consents created after a specific date
     * 
     * @param date The date to filter by
     * @return List of consents created after the specified date
     */
    List<UserConsent> findByConsentTimestampAfter(LocalDateTime date);
    
    /**
     * Find consents that expire before a specific date
     * 
     * @param date The date to filter by
     * @return List of consents that expire before the specified date
     */
    List<UserConsent> findByExpiryTimestampBefore(LocalDateTime date);
    
    /**
     * Find consents that have been revoked
     * 
     * @return List of revoked consents
     */
    List<UserConsent> findByRevokedTimestampNotNull();
    
    /**
     * Find consents by version
     * 
     * @param consentVersion The consent version
     * @return List of consents with the specified version
     */
    List<UserConsent> findByConsentVersion(String consentVersion);
    
    /**
     * Find latest consent by user ID and consent type
     * 
     * @param userId The user ID
     * @param consentType The consent type
     * @return Optional containing the latest consent if found
     */
    @Query("SELECT c FROM UserConsent c WHERE c.userId = :userId AND c.consentType = :consentType ORDER BY c.consentTimestamp DESC")
    List<UserConsent> findByUserIdAndConsentTypeOrderByConsentTimestampDesc(
            @Param("userId") String userId, 
            @Param("consentType") UserConsent.ConsentType consentType);
    
    /**
     * Find latest consent by user ID and consent type
     * 
     * @param userId The user ID
     * @param consentType The consent type
     * @return Optional containing the latest consent if found
     */
    default Optional<UserConsent> findLatestConsentByUserIdAndType(String userId, UserConsent.ConsentType consentType) {
        List<UserConsent> consents = findByUserIdAndConsentTypeOrderByConsentTimestampDesc(userId, consentType);
        return consents.isEmpty() ? Optional.empty() : Optional.of(consents.get(0));
    }
    
    /**
     * Find consents by data category
     * 
     * @param category The data category
     * @return List of consents with the specified data category
     */
    @Query("SELECT c FROM UserConsent c WHERE KEY(c.dataCategories) = :category")
    List<UserConsent> findByDataCategory(@Param("category") String category);
    
    /**
     * Find consents by data category and permission
     * 
     * @param category The data category
     * @param isAllowed The permission status
     * @return List of consents with the specified data category and permission
     */
    @Query("SELECT c FROM UserConsent c WHERE KEY(c.dataCategories) = :category AND VALUE(c.dataCategories) = :isAllowed")
    List<UserConsent> findByDataCategoryAndPermission(
            @Param("category") String category, 
            @Param("isAllowed") boolean isAllowed);
    
    /**
     * Count consents by type and status
     * 
     * @param consentType The consent type
     * @param consentGiven The consent status
     * @return Count of consents with the specified type and status
     */
    long countByConsentTypeAndConsentGiven(UserConsent.ConsentType consentType, boolean consentGiven);
    
    /**
     * Find recent consents limited by count
     * 
     * @param limit The maximum number of consents to return
     * @return List of recent consents
     */
    @Query(value = "SELECT * FROM user_consent ORDER BY consent_timestamp DESC LIMIT :limit", nativeQuery = true)
    List<UserConsent> findRecentConsents(@Param("limit") int limit);
}
