package ai.lumina.provider.repository;

import ai.lumina.provider.model.ProviderRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for ProviderRequest entity operations
 */
@Repository
public interface ProviderRequestRepository extends JpaRepository<ProviderRequest, String> {

    /**
     * Find requests by provider ID
     * 
     * @param providerId The provider ID
     * @return List of requests for the specified provider
     */
    List<ProviderRequest> findByProviderId(String providerId);
    
    /**
     * Find requests by model ID
     * 
     * @param modelId The model ID
     * @return List of requests for the specified model
     */
    List<ProviderRequest> findByModelId(String modelId);
    
    /**
     * Find requests by type
     * 
     * @param type The request type
     * @return List of requests of the specified type
     */
    List<ProviderRequest> findByType(ProviderRequest.RequestType type);
    
    /**
     * Find requests by status
     * 
     * @param status The request status
     * @return List of requests with the specified status
     */
    List<ProviderRequest> findByStatus(ProviderRequest.RequestStatus status);
    
    /**
     * Find requests by user ID
     * 
     * @param userId The user ID
     * @return List of requests for the specified user
     */
    List<ProviderRequest> findByUserId(String userId);
    
    /**
     * Find requests by session ID
     * 
     * @param sessionId The session ID
     * @return List of requests for the specified session
     */
    List<ProviderRequest> findBySessionId(String sessionId);
    
    /**
     * Find requests by task ID
     * 
     * @param taskId The task ID
     * @return List of requests for the specified task
     */
    List<ProviderRequest> findByTaskId(String taskId);
    
    /**
     * Find requests created after a specific date
     * 
     * @param date The date to filter by
     * @return List of requests created after the specified date
     */
    List<ProviderRequest> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find requests completed after a specific date
     * 
     * @param date The date to filter by
     * @return List of requests completed after the specified date
     */
    List<ProviderRequest> findByCompletedAtAfter(LocalDateTime date);
    
    /**
     * Find recent requests limited by count
     * 
     * @param limit The maximum number of requests to return
     * @return List of recent requests
     */
    @Query(value = "SELECT * FROM provider_request ORDER BY created_at DESC LIMIT :limit", nativeQuery = true)
    List<ProviderRequest> findRecentRequests(@Param("limit") int limit);
    
    /**
     * Find requests with latency greater than specified value
     * 
     * @param latencyMs The minimum latency in milliseconds
     * @return List of requests with latency greater than specified value
     */
    List<ProviderRequest> findByLatencyMsGreaterThan(int latencyMs);
    
    /**
     * Find requests with total cost greater than specified value
     * 
     * @param cost The minimum cost
     * @return List of requests with total cost greater than specified value
     */
    List<ProviderRequest> findByTotalCostGreaterThan(double cost);
    
    /**
     * Find requests that have been running for longer than a specified duration (in minutes)
     * 
     * @param cutoffTime The cutoff time
     * @return List of long-running requests
     */
    @Query("SELECT r FROM ProviderRequest r WHERE r.status = 'IN_PROGRESS' AND r.createdAt < :cutoffTime")
    List<ProviderRequest> findLongRunningRequests(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    /**
     * Count requests by provider ID
     * 
     * @param providerId The provider ID
     * @return Count of requests for the specified provider
     */
    long countByProviderId(String providerId);
    
    /**
     * Count requests by model ID
     * 
     * @param modelId The model ID
     * @return Count of requests for the specified model
     */
    long countByModelId(String modelId);
    
    /**
     * Count requests by status
     * 
     * @param status The request status
     * @return Count of requests with the specified status
     */
    long countByStatus(ProviderRequest.RequestStatus status);
    
    /**
     * Calculate total cost of requests for a specific time period
     * 
     * @param startDate The start date
     * @param endDate The end date
     * @return Total cost of requests for the specified time period
     */
    @Query("SELECT SUM(r.totalCost) FROM ProviderRequest r WHERE r.createdAt BETWEEN :startDate AND :endDate")
    double calculateTotalCostForPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
