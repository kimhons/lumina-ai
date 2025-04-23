package ai.lumina.deployment.repository;

import ai.lumina.deployment.model.Pipeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Pipeline entity operations
 */
@Repository
public interface PipelineRepository extends JpaRepository<Pipeline, String> {

    /**
     * Find pipelines by deployment ID
     * 
     * @param deploymentId The ID of the deployment
     * @return List of pipelines for the specified deployment
     */
    List<Pipeline> findByDeploymentId(String deploymentId);
    
    /**
     * Find pipelines by status
     * 
     * @param status The pipeline status
     * @return List of pipelines with the specified status
     */
    List<Pipeline> findByStatus(String status);
    
    /**
     * Find pipelines by deployment ID and status
     * 
     * @param deploymentId The ID of the deployment
     * @param status The pipeline status
     * @return List of pipelines for the specified deployment and status
     */
    List<Pipeline> findByDeploymentIdAndStatus(String deploymentId, String status);
    
    /**
     * Find pipelines started after a specific date
     * 
     * @param date The date to filter by
     * @return List of pipelines started after the specified date
     */
    List<Pipeline> findByStartedAtAfter(LocalDateTime date);
    
    /**
     * Find pipelines completed after a specific date
     * 
     * @param date The date to filter by
     * @return List of pipelines completed after the specified date
     */
    List<Pipeline> findByCompletedAtAfter(LocalDateTime date);
    
    /**
     * Find recent pipelines limited by count
     * 
     * @param limit The maximum number of pipelines to return
     * @return List of recent pipelines
     */
    @Query(value = "SELECT * FROM pipeline ORDER BY started_at DESC LIMIT :limit", nativeQuery = true)
    List<Pipeline> findRecentPipelines(@Param("limit") int limit);
    
    /**
     * Find pipelines that contain a specific stage name
     * 
     * @param stageName The name of the stage
     * @return List of pipelines containing the specified stage
     */
    @Query("SELECT p FROM Pipeline p JOIN p.stages s WHERE s.name = :stageName")
    List<Pipeline> findByStageNameContaining(@Param("stageName") String stageName);
    
    /**
     * Find pipelines that have a stage with a specific status
     * 
     * @param stageStatus The status of the stage
     * @return List of pipelines with a stage having the specified status
     */
    @Query("SELECT p FROM Pipeline p JOIN p.stages s WHERE s.status = :stageStatus")
    List<Pipeline> findByStageStatus(@Param("stageStatus") String stageStatus);
    
    /**
     * Count pipelines by status
     * 
     * @param status The pipeline status
     * @return Count of pipelines with the specified status
     */
    long countByStatus(String status);
    
    /**
     * Find pipelines that have been running for longer than a specified duration (in minutes)
     * 
     * @param minutes The duration in minutes
     * @return List of long-running pipelines
     */
    @Query("SELECT p FROM Pipeline p WHERE p.status = 'IN_PROGRESS' AND p.startedAt < :cutoffTime")
    List<Pipeline> findLongRunningPipelines(@Param("cutoffTime") LocalDateTime cutoffTime);
}
