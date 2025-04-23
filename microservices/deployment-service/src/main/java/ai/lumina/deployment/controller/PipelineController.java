package ai.lumina.deployment.controller;

import ai.lumina.deployment.model.Pipeline;
import ai.lumina.deployment.service.PipelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for pipeline operations
 */
@RestController
@RequestMapping("/api/pipelines")
public class PipelineController {

    private final PipelineService pipelineService;

    @Autowired
    public PipelineController(PipelineService pipelineService) {
        this.pipelineService = pipelineService;
    }

    /**
     * Create a new pipeline
     *
     * @param pipeline The pipeline to create
     * @return The created pipeline
     */
    @PostMapping
    public ResponseEntity<Pipeline> createPipeline(@RequestBody Pipeline pipeline) {
        Pipeline createdPipeline = pipelineService.createPipeline(pipeline);
        return new ResponseEntity<>(createdPipeline, HttpStatus.CREATED);
    }

    /**
     * Get a pipeline by ID
     *
     * @param id The pipeline ID
     * @return The pipeline if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pipeline> getPipeline(@PathVariable String id) {
        return pipelineService.getPipeline(id)
                .map(pipeline -> new ResponseEntity<>(pipeline, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get all pipelines
     *
     * @return List of all pipelines
     */
    @GetMapping
    public ResponseEntity<List<Pipeline>> getAllPipelines() {
        List<Pipeline> pipelines = pipelineService.getAllPipelines();
        return new ResponseEntity<>(pipelines, HttpStatus.OK);
    }

    /**
     * Get pipelines by deployment ID
     *
     * @param deploymentId The deployment ID
     * @return List of pipelines for the specified deployment
     */
    @GetMapping("/deployment/{deploymentId}")
    public ResponseEntity<List<Pipeline>> getPipelinesByDeploymentId(@PathVariable String deploymentId) {
        List<Pipeline> pipelines = pipelineService.getPipelinesByDeploymentId(deploymentId);
        return new ResponseEntity<>(pipelines, HttpStatus.OK);
    }

    /**
     * Get pipelines by status
     *
     * @param status The pipeline status
     * @return List of pipelines with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Pipeline>> getPipelinesByStatus(@PathVariable String status) {
        List<Pipeline> pipelines = pipelineService.getPipelinesByStatus(status);
        return new ResponseEntity<>(pipelines, HttpStatus.OK);
    }

    /**
     * Get recent pipelines
     *
     * @param limit The maximum number of pipelines to return
     * @return List of recent pipelines
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Pipeline>> getRecentPipelines(@RequestParam(defaultValue = "10") int limit) {
        List<Pipeline> pipelines = pipelineService.getRecentPipelines(limit);
        return new ResponseEntity<>(pipelines, HttpStatus.OK);
    }

    /**
     * Start a pipeline
     *
     * @param id The pipeline ID
     * @return The updated pipeline if found
     */
    @PostMapping("/{id}/start")
    public ResponseEntity<Pipeline> startPipeline(@PathVariable String id) {
        return pipelineService.startPipeline(id)
                .map(pipeline -> new ResponseEntity<>(pipeline, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Complete a pipeline
     *
     * @param id The pipeline ID
     * @return The updated pipeline if found
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<Pipeline> completePipeline(@PathVariable String id) {
        return pipelineService.completePipeline(id)
                .map(pipeline -> new ResponseEntity<>(pipeline, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Fail a pipeline
     *
     * @param id The pipeline ID
     * @return The updated pipeline if found
     */
    @PostMapping("/{id}/fail")
    public ResponseEntity<Pipeline> failPipeline(@PathVariable String id) {
        return pipelineService.failPipeline(id)
                .map(pipeline -> new ResponseEntity<>(pipeline, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Cancel a pipeline
     *
     * @param id The pipeline ID
     * @return The updated pipeline if found
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Pipeline> cancelPipeline(@PathVariable String id) {
        return pipelineService.cancelPipeline(id)
                .map(pipeline -> new ResponseEntity<>(pipeline, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update pipeline stage status
     *
     * @param pipelineId The pipeline ID
     * @param stageId The stage ID
     * @param statusUpdate The status update
     * @return The updated pipeline if found
     */
    @PatchMapping("/{pipelineId}/stages/{stageId}/status")
    public ResponseEntity<Pipeline> updateStageStatus(
            @PathVariable String pipelineId,
            @PathVariable String stageId,
            @RequestBody Map<String, String> statusUpdate) {
        
        String status = statusUpdate.get("status");
        if (status == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        return pipelineService.updateStageStatus(pipelineId, stageId, status)
                .map(pipeline -> new ResponseEntity<>(pipeline, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update pipeline step status
     *
     * @param pipelineId The pipeline ID
     * @param stageId The stage ID
     * @param stepId The step ID
     * @param statusUpdate The status update
     * @return The updated pipeline if found
     */
    @PatchMapping("/{pipelineId}/stages/{stageId}/steps/{stepId}/status")
    public ResponseEntity<Pipeline> updateStepStatus(
            @PathVariable String pipelineId,
            @PathVariable String stageId,
            @PathVariable String stepId,
            @RequestBody Map<String, String> statusUpdate) {
        
        String status = statusUpdate.get("status");
        if (status == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        return pipelineService.updateStepStatus(pipelineId, stageId, stepId, status)
                .map(pipeline -> new ResponseEntity<>(pipeline, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update step logs
     *
     * @param pipelineId The pipeline ID
     * @param stageId The stage ID
     * @param stepId The step ID
     * @param logsUpdate The logs update
     * @return The updated pipeline if found
     */
    @PatchMapping("/{pipelineId}/stages/{stageId}/steps/{stepId}/logs")
    public ResponseEntity<Pipeline> updateStepLogs(
            @PathVariable String pipelineId,
            @PathVariable String stageId,
            @PathVariable String stepId,
            @RequestBody Map<String, String> logsUpdate) {
        
        String logs = logsUpdate.get("logs");
        if (logs == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        return pipelineService.updateStepLogs(pipelineId, stageId, stepId, logs)
                .map(pipeline -> new ResponseEntity<>(pipeline, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Find long-running pipelines
     *
     * @param minutes The threshold in minutes
     * @return List of long-running pipelines
     */
    @GetMapping("/long-running")
    public ResponseEntity<List<Pipeline>> findLongRunningPipelines(@RequestParam(defaultValue = "60") int minutes) {
        List<Pipeline> pipelines = pipelineService.findLongRunningPipelines(minutes);
        return new ResponseEntity<>(pipelines, HttpStatus.OK);
    }

    /**
     * Delete a pipeline
     *
     * @param id The pipeline ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePipeline(@PathVariable String id) {
        pipelineService.deletePipeline(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Get pipeline statistics
     *
     * @return Pipeline statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPipelineStats() {
        long pendingCount = pipelineService.countByStatus("PENDING");
        long inProgressCount = pipelineService.countByStatus("IN_PROGRESS");
        long completedCount = pipelineService.countByStatus("COMPLETED");
        long failedCount = pipelineService.countByStatus("FAILED");
        long cancelledCount = pipelineService.countByStatus("CANCELLED");
        
        Map<String, Object> stats = Map.of(
            "status", Map.of(
                "PENDING", pendingCount,
                "IN_PROGRESS", inProgressCount,
                "COMPLETED", completedCount,
                "FAILED", failedCount,
                "CANCELLED", cancelledCount
            ),
            "total", pendingCount + inProgressCount + completedCount + failedCount + cancelledCount
        );
        
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}
