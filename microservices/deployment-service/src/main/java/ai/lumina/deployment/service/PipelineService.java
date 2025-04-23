package ai.lumina.deployment.service;

import ai.lumina.deployment.model.Pipeline;
import ai.lumina.deployment.model.PipelineStage;
import ai.lumina.deployment.model.PipelineStep;
import ai.lumina.deployment.repository.PipelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing deployment pipelines
 */
@Service
public class PipelineService {

    private final PipelineRepository pipelineRepository;

    @Autowired
    public PipelineService(PipelineRepository pipelineRepository) {
        this.pipelineRepository = pipelineRepository;
    }

    /**
     * Create a new pipeline
     *
     * @param pipeline The pipeline to create
     * @return The created pipeline
     */
    @Transactional
    public Pipeline createPipeline(Pipeline pipeline) {
        // Generate ID if not provided
        if (pipeline.getId() == null || pipeline.getId().isEmpty()) {
            pipeline.setId(UUID.randomUUID().toString());
        }
        
        // Set initial status if not provided
        if (pipeline.getStatus() == null || pipeline.getStatus().isEmpty()) {
            pipeline.setStatus("PENDING");
        }
        
        // Generate IDs for stages and steps if not provided
        if (pipeline.getStages() != null) {
            for (PipelineStage stage : pipeline.getStages()) {
                if (stage.getId() == null || stage.getId().isEmpty()) {
                    stage.setId(UUID.randomUUID().toString());
                }
                
                if (stage.getStatus() == null || stage.getStatus().isEmpty()) {
                    stage.setStatus("PENDING");
                }
                
                if (stage.getSteps() != null) {
                    for (PipelineStep step : stage.getSteps()) {
                        if (step.getId() == null || step.getId().isEmpty()) {
                            step.setId(UUID.randomUUID().toString());
                        }
                        
                        if (step.getStatus() == null || step.getStatus().isEmpty()) {
                            step.setStatus("PENDING");
                        }
                    }
                }
            }
        }
        
        return pipelineRepository.save(pipeline);
    }

    /**
     * Get a pipeline by ID
     *
     * @param id The pipeline ID
     * @return The pipeline if found
     */
    public Optional<Pipeline> getPipeline(String id) {
        return pipelineRepository.findById(id);
    }

    /**
     * Get all pipelines
     *
     * @return List of all pipelines
     */
    public List<Pipeline> getAllPipelines() {
        return pipelineRepository.findAll();
    }

    /**
     * Get pipelines by deployment ID
     *
     * @param deploymentId The deployment ID
     * @return List of pipelines for the specified deployment
     */
    public List<Pipeline> getPipelinesByDeploymentId(String deploymentId) {
        return pipelineRepository.findByDeploymentId(deploymentId);
    }

    /**
     * Get pipelines by status
     *
     * @param status The pipeline status
     * @return List of pipelines with the specified status
     */
    public List<Pipeline> getPipelinesByStatus(String status) {
        return pipelineRepository.findByStatus(status);
    }

    /**
     * Get recent pipelines
     *
     * @param limit The maximum number of pipelines to return
     * @return List of recent pipelines
     */
    public List<Pipeline> getRecentPipelines(int limit) {
        return pipelineRepository.findRecentPipelines(limit);
    }

    /**
     * Start a pipeline
     *
     * @param id The pipeline ID
     * @return The updated pipeline if found
     */
    @Transactional
    public Optional<Pipeline> startPipeline(String id) {
        return pipelineRepository.findById(id)
                .map(pipeline -> {
                    pipeline.setStatus("IN_PROGRESS");
                    pipeline.setStartedAt(LocalDateTime.now());
                    return pipelineRepository.save(pipeline);
                });
    }

    /**
     * Complete a pipeline
     *
     * @param id The pipeline ID
     * @return The updated pipeline if found
     */
    @Transactional
    public Optional<Pipeline> completePipeline(String id) {
        return pipelineRepository.findById(id)
                .map(pipeline -> {
                    pipeline.setStatus("COMPLETED");
                    pipeline.setCompletedAt(LocalDateTime.now());
                    return pipelineRepository.save(pipeline);
                });
    }

    /**
     * Fail a pipeline
     *
     * @param id The pipeline ID
     * @return The updated pipeline if found
     */
    @Transactional
    public Optional<Pipeline> failPipeline(String id) {
        return pipelineRepository.findById(id)
                .map(pipeline -> {
                    pipeline.setStatus("FAILED");
                    pipeline.setCompletedAt(LocalDateTime.now());
                    return pipelineRepository.save(pipeline);
                });
    }

    /**
     * Cancel a pipeline
     *
     * @param id The pipeline ID
     * @return The updated pipeline if found
     */
    @Transactional
    public Optional<Pipeline> cancelPipeline(String id) {
        return pipelineRepository.findById(id)
                .map(pipeline -> {
                    pipeline.setStatus("CANCELLED");
                    pipeline.setCompletedAt(LocalDateTime.now());
                    return pipelineRepository.save(pipeline);
                });
    }

    /**
     * Update pipeline stage status
     *
     * @param pipelineId The pipeline ID
     * @param stageId The stage ID
     * @param status The new status
     * @return The updated pipeline if found
     */
    @Transactional
    public Optional<Pipeline> updateStageStatus(String pipelineId, String stageId, String status) {
        return pipelineRepository.findById(pipelineId)
                .map(pipeline -> {
                    pipeline.getStages().stream()
                            .filter(stage -> stageId.equals(stage.getId()))
                            .findFirst()
                            .ifPresent(stage -> {
                                stage.setStatus(status);
                                
                                // Update timestamps based on status
                                if ("IN_PROGRESS".equals(status) && stage.getStartedAt() == null) {
                                    stage.setStartedAt(LocalDateTime.now());
                                }
                                if (("COMPLETED".equals(status) || "FAILED".equals(status) || 
                                     "CANCELLED".equals(status)) && stage.getCompletedAt() == null) {
                                    stage.setCompletedAt(LocalDateTime.now());
                                }
                            });
                    
                    return pipelineRepository.save(pipeline);
                });
    }

    /**
     * Update pipeline step status
     *
     * @param pipelineId The pipeline ID
     * @param stageId The stage ID
     * @param stepId The step ID
     * @param status The new status
     * @return The updated pipeline if found
     */
    @Transactional
    public Optional<Pipeline> updateStepStatus(String pipelineId, String stageId, String stepId, String status) {
        return pipelineRepository.findById(pipelineId)
                .map(pipeline -> {
                    pipeline.getStages().stream()
                            .filter(stage -> stageId.equals(stage.getId()))
                            .findFirst()
                            .ifPresent(stage -> {
                                stage.getSteps().stream()
                                        .filter(step -> stepId.equals(step.getId()))
                                        .findFirst()
                                        .ifPresent(step -> {
                                            step.setStatus(status);
                                            
                                            // Update timestamps based on status
                                            if ("IN_PROGRESS".equals(status) && step.getStartedAt() == null) {
                                                step.setStartedAt(LocalDateTime.now());
                                            }
                                            if (("COMPLETED".equals(status) || "FAILED".equals(status) || 
                                                 "CANCELLED".equals(status)) && step.getCompletedAt() == null) {
                                                step.setCompletedAt(LocalDateTime.now());
                                            }
                                        });
                            });
                    
                    return pipelineRepository.save(pipeline);
                });
    }

    /**
     * Update step logs
     *
     * @param pipelineId The pipeline ID
     * @param stageId The stage ID
     * @param stepId The step ID
     * @param logs The logs to append
     * @return The updated pipeline if found
     */
    @Transactional
    public Optional<Pipeline> updateStepLogs(String pipelineId, String stageId, String stepId, String logs) {
        return pipelineRepository.findById(pipelineId)
                .map(pipeline -> {
                    pipeline.getStages().stream()
                            .filter(stage -> stageId.equals(stage.getId()))
                            .findFirst()
                            .ifPresent(stage -> {
                                stage.getSteps().stream()
                                        .filter(step -> stepId.equals(step.getId()))
                                        .findFirst()
                                        .ifPresent(step -> {
                                            String currentLogs = step.getLogs();
                                            if (currentLogs == null) {
                                                step.setLogs(logs);
                                            } else {
                                                step.setLogs(currentLogs + "\n" + logs);
                                            }
                                        });
                            });
                    
                    return pipelineRepository.save(pipeline);
                });
    }

    /**
     * Find long-running pipelines
     *
     * @param minutes The threshold in minutes
     * @return List of long-running pipelines
     */
    public List<Pipeline> findLongRunningPipelines(int minutes) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutes);
        return pipelineRepository.findLongRunningPipelines(cutoffTime);
    }

    /**
     * Delete a pipeline
     *
     * @param id The pipeline ID
     */
    @Transactional
    public void deletePipeline(String id) {
        pipelineRepository.deleteById(id);
    }

    /**
     * Count pipelines by status
     *
     * @param status The pipeline status
     * @return Count of pipelines with the specified status
     */
    public long countByStatus(String status) {
        return pipelineRepository.countByStatus(status);
    }
}
