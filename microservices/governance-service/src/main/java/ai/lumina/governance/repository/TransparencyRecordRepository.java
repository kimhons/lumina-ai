package ai.lumina.governance.repository;

import ai.lumina.governance.model.TransparencyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for TransparencyRecord entity operations
 */
@Repository
public interface TransparencyRecordRepository extends JpaRepository<TransparencyRecord, String> {

    /**
     * Find transparency records by record type
     * 
     * @param recordType The record type
     * @return List of transparency records of the specified type
     */
    List<TransparencyRecord> findByRecordType(TransparencyRecord.RecordType recordType);
    
    /**
     * Find transparency records by request ID
     * 
     * @param requestId The request ID
     * @return List of transparency records for the specified request
     */
    List<TransparencyRecord> findByRequestId(String requestId);
    
    /**
     * Find transparency records by user ID
     * 
     * @param userId The user ID
     * @return List of transparency records for the specified user
     */
    List<TransparencyRecord> findByUserId(String userId);
    
    /**
     * Find transparency records by model ID
     * 
     * @param modelId The model ID
     * @return List of transparency records for the specified model
     */
    List<TransparencyRecord> findByModelId(String modelId);
    
    /**
     * Find transparency records by provider ID
     * 
     * @param providerId The provider ID
     * @return List of transparency records for the specified provider
     */
    List<TransparencyRecord> findByProviderId(String providerId);
    
    /**
     * Find transparency records by notification status
     * 
     * @param userNotified The notification status
     * @return List of transparency records with the specified notification status
     */
    List<TransparencyRecord> findByUserNotified(boolean userNotified);
    
    /**
     * Find transparency records created after a specific date
     * 
     * @param date The date to filter by
     * @return List of transparency records created after the specified date
     */
    List<TransparencyRecord> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find transparency records by policy applied
     * 
     * @param policyId The policy ID
     * @return List of transparency records where the specified policy was applied
     */
    @Query("SELECT t FROM TransparencyRecord t WHERE :policyId MEMBER OF t.policiesApplied")
    List<TransparencyRecord> findByPolicyApplied(@Param("policyId") String policyId);
    
    /**
     * Find recent transparency records limited by count
     * 
     * @param limit The maximum number of records to return
     * @return List of recent transparency records
     */
    @Query(value = "SELECT * FROM transparency_record ORDER BY created_at DESC LIMIT :limit", nativeQuery = true)
    List<TransparencyRecord> findRecentRecords(@Param("limit") int limit);
    
    /**
     * Find transparency records by record type and user notified status
     * 
     * @param recordType The record type
     * @param userNotified The user notified status
     * @return List of transparency records with the specified type and notification status
     */
    List<TransparencyRecord> findByRecordTypeAndUserNotified(
            TransparencyRecord.RecordType recordType, 
            boolean userNotified);
    
    /**
     * Count transparency records by record type
     * 
     * @param recordType The record type
     * @return Count of transparency records with the specified type
     */
    long countByRecordType(TransparencyRecord.RecordType recordType);
    
    /**
     * Find transparency records containing specific tools
     * 
     * @param toolName The tool name to search for
     * @return List of transparency records mentioning the specified tool
     */
    @Query("SELECT t FROM TransparencyRecord t WHERE t.toolsUsed LIKE %:toolName%")
    List<TransparencyRecord> findByToolsUsedContaining(@Param("toolName") String toolName);
    
    /**
     * Find transparency records by user ID and record type
     * 
     * @param userId The user ID
     * @param recordType The record type
     * @return List of transparency records for the specified user and type
     */
    List<TransparencyRecord> findByUserIdAndRecordType(
            String userId, 
            TransparencyRecord.RecordType recordType);
    
    /**
     * Find transparency records by user ID that are not notified
     * 
     * @param userId The user ID
     * @return List of transparency records for the specified user that are not notified
     */
    List<TransparencyRecord> findByUserIdAndUserNotifiedFalse(String userId);
}
