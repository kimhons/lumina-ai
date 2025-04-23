package ai.lumina.provider.repository;

import ai.lumina.provider.model.ToolExecution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for ToolExecution entity operations
 */
@Repository
public interface ToolExecutionRepository extends JpaRepository<ToolExecution, String> {

    /**
     * Find tool executions by tool ID
     * 
     * @param toolId The tool ID
     * @return List of tool executions for the specified tool
     */
    List<ToolExecution> findByToolId(String toolId);
    
    /**
     * Find tool executions by provider request ID
     * 
     * @param providerRequestId The provider request ID
     * @return List of tool executions for the specified provider request
     */
    List<ToolExecution> findByProviderRequestId(String providerRequestId);
    
    /**
     * Find tool executions by status
     * 
     * @param status The execution status
     * @return List of tool executions with the specified status
     */
    List<ToolExecution> findByStatus(ToolExecution.ExecutionStatus status);
    
    /**
     * Find tool executions created after a specific date
     * 
     * @param date The date to filter by
     * @return List of tool executions created after the specified date
     */
    List<ToolExecution> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find tool executions completed after a specific date
     * 
     * @param date The date to filter by
     * @return List of tool executions completed after the specified date
     */
    List<ToolExecution> findByCompletedAtAfter(LocalDateTime date);
    
    /**
     * Find recent tool executions limited by count
     * 
     * @param limit The maximum number of executions to return
     * @return List of recent tool executions
     */
    @Query(value = "SELECT * FROM tool_execution ORDER BY created_at DESC LIMIT :limit", nativeQuery = true)
    List<ToolExecution> findRecentExecutions(@Param("limit") int limit);
    
    /**
     * Find tool executions with execution time greater than specified value
     * 
     * @param executionTimeMs The minimum execution time in milliseconds
     * @return List of tool executions with execution time greater than specified value
     */
    List<ToolExecution> findByExecutionTimeMsGreaterThan(int executionTimeMs);
    
    /**
     * Find tool executions that have been running for longer than a specified duration (in minutes)
     * 
     * @param cutoffTime The cutoff time
     * @return List of long-running tool executions
     */
    @Query("SELECT e FROM ToolExecution e WHERE e.status = 'IN_PROGRESS' AND e.createdAt < :cutoffTime")
    List<ToolExecution> findLongRunningExecutions(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    /**
     * Count tool executions by tool ID
     * 
     * @param toolId The tool ID
     * @return Count of tool executions for the specified tool
     */
    long countByToolId(String toolId);
    
    /**
     * Count tool executions by status
     * 
     * @param status The execution status
     * @return Count of tool executions with the specified status
     */
    long countByStatus(ToolExecution.ExecutionStatus status);
    
    /**
     * Calculate average execution time for a specific tool
     * 
     * @param toolId The tool ID
     * @return Average execution time in milliseconds
     */
    @Query("SELECT AVG(e.executionTimeMs) FROM ToolExecution e WHERE e.tool.id = :toolId AND e.status = 'COMPLETED'")
    Double calculateAverageExecutionTime(@Param("toolId") String toolId);
    
    /**
     * Find failed tool executions with specific error message pattern
     * 
     * @param errorPattern The error message pattern
     * @return List of failed tool executions with matching error message
     */
    @Query("SELECT e FROM ToolExecution e WHERE e.status = 'FAILED' AND e.errorMessage LIKE %:errorPattern%")
    List<ToolExecution> findFailedExecutionsByErrorPattern(@Param("errorPattern") String errorPattern);
}
