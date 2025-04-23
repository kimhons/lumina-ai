package ai.lumina.governance.repository;

import ai.lumina.governance.model.ContentEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for ContentEvaluation entity operations
 */
@Repository
public interface ContentEvaluationRepository extends JpaRepository<ContentEvaluation, String> {

    /**
     * Find evaluations by content type
     * 
     * @param contentType The content type
     * @return List of evaluations for the specified content type
     */
    List<ContentEvaluation> findByContentType(ContentEvaluation.ContentType contentType);
    
    /**
     * Find evaluations by result
     * 
     * @param result The evaluation result
     * @return List of evaluations with the specified result
     */
    List<ContentEvaluation> findByResult(ContentEvaluation.EvaluationResult result);
    
    /**
     * Find evaluations by request ID
     * 
     * @param requestId The request ID
     * @return List of evaluations for the specified request
     */
    List<ContentEvaluation> findByRequestId(String requestId);
    
    /**
     * Find evaluations by user ID
     * 
     * @param userId The user ID
     * @return List of evaluations for the specified user
     */
    List<ContentEvaluation> findByUserId(String userId);
    
    /**
     * Find evaluations by model ID
     * 
     * @param modelId The model ID
     * @return List of evaluations for the specified model
     */
    List<ContentEvaluation> findByModelId(String modelId);
    
    /**
     * Find evaluations by provider ID
     * 
     * @param providerId The provider ID
     * @return List of evaluations for the specified provider
     */
    List<ContentEvaluation> findByProviderId(String providerId);
    
    /**
     * Find evaluations created after a specific date
     * 
     * @param date The date to filter by
     * @return List of evaluations created after the specified date
     */
    List<ContentEvaluation> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find evaluations with safety score below threshold
     * 
     * @param threshold The safety score threshold
     * @return List of evaluations with safety score below the specified threshold
     */
    List<ContentEvaluation> findBySafetyScoreLessThan(double threshold);
    
    /**
     * Find evaluations with privacy score below threshold
     * 
     * @param threshold The privacy score threshold
     * @return List of evaluations with privacy score below the specified threshold
     */
    List<ContentEvaluation> findByPrivacyScoreLessThan(double threshold);
    
    /**
     * Find evaluations with transparency score below threshold
     * 
     * @param threshold The transparency score threshold
     * @return List of evaluations with transparency score below the specified threshold
     */
    List<ContentEvaluation> findByTransparencyScoreLessThan(double threshold);
    
    /**
     * Find evaluations with specific flag
     * 
     * @param flagType The flag type
     * @return List of evaluations with the specified flag
     */
    @Query("SELECT e FROM ContentEvaluation e WHERE KEY(e.flags) = :flagType")
    List<ContentEvaluation> findByFlagType(@Param("flagType") String flagType);
    
    /**
     * Find evaluations with flag value above threshold
     * 
     * @param flagType The flag type
     * @param threshold The threshold value
     * @return List of evaluations with the specified flag value above the threshold
     */
    @Query("SELECT e FROM ContentEvaluation e WHERE KEY(e.flags) = :flagType AND VALUE(e.flags) > :threshold")
    List<ContentEvaluation> findByFlagValueGreaterThan(
            @Param("flagType") String flagType, 
            @Param("threshold") double threshold);
    
    /**
     * Find recent evaluations limited by count
     * 
     * @param limit The maximum number of evaluations to return
     * @return List of recent evaluations
     */
    @Query(value = "SELECT * FROM content_evaluation ORDER BY created_at DESC LIMIT :limit", nativeQuery = true)
    List<ContentEvaluation> findRecentEvaluations(@Param("limit") int limit);
    
    /**
     * Find evaluations by content type and result
     * 
     * @param contentType The content type
     * @param result The evaluation result
     * @return List of evaluations with the specified content type and result
     */
    List<ContentEvaluation> findByContentTypeAndResult(
            ContentEvaluation.ContentType contentType, 
            ContentEvaluation.EvaluationResult result);
    
    /**
     * Count evaluations by result
     * 
     * @param result The evaluation result
     * @return Count of evaluations with the specified result
     */
    long countByResult(ContentEvaluation.EvaluationResult result);
    
    /**
     * Calculate average safety score for a specific model
     * 
     * @param modelId The model ID
     * @return Average safety score
     */
    @Query("SELECT AVG(e.safetyScore) FROM ContentEvaluation e WHERE e.modelId = :modelId")
    Double calculateAverageSafetyScore(@Param("modelId") String modelId);
    
    /**
     * Calculate average privacy score for a specific model
     * 
     * @param modelId The model ID
     * @return Average privacy score
     */
    @Query("SELECT AVG(e.privacyScore) FROM ContentEvaluation e WHERE e.modelId = :modelId")
    Double calculateAveragePrivacyScore(@Param("modelId") String modelId);
    
    /**
     * Calculate average transparency score for a specific model
     * 
     * @param modelId The model ID
     * @return Average transparency score
     */
    @Query("SELECT AVG(e.transparencyScore) FROM ContentEvaluation e WHERE e.modelId = :modelId")
    Double calculateAverageTransparencyScore(@Param("modelId") String modelId);
}
