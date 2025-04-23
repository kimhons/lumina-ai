package ai.lumina.provider.controller;

import ai.lumina.provider.model.ToolExecution;
import ai.lumina.provider.service.ToolExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for tool execution operations
 */
@RestController
@RequestMapping("/api/tool-executions")
public class ToolExecutionController {

    private final ToolExecutionService toolExecutionService;

    @Autowired
    public ToolExecutionController(ToolExecutionService toolExecutionService) {
        this.toolExecutionService = toolExecutionService;
    }

    /**
     * Create a new tool execution
     *
     * @param toolExecution The tool execution to create
     * @return The created tool execution
     */
    @PostMapping
    public ResponseEntity<ToolExecution> createToolExecution(@RequestBody ToolExecution toolExecution) {
        ToolExecution createdExecution = toolExecutionService.createToolExecution(toolExecution);
        return new ResponseEntity<>(createdExecution, HttpStatus.CREATED);
    }

    /**
     * Get a tool execution by ID
     *
     * @param id The tool execution ID
     * @return The tool execution if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ToolExecution> getToolExecution(@PathVariable String id) {
        ToolExecution toolExecution = toolExecutionService.getToolExecution(id);
        return new ResponseEntity<>(toolExecution, HttpStatus.OK);
    }

    /**
     * Get all tool executions
     *
     * @return List of all tool executions
     */
    @GetMapping
    public ResponseEntity<List<ToolExecution>> getAllToolExecutions() {
        List<ToolExecution> executions = toolExecutionService.getAllToolExecutions();
        return new ResponseEntity<>(executions, HttpStatus.OK);
    }

    /**
     * Get tool executions by tool
     *
     * @param toolId The tool ID
     * @return List of tool executions for the specified tool
     */
    @GetMapping("/tool/{toolId}")
    public ResponseEntity<List<ToolExecution>> getToolExecutionsByTool(@PathVariable String toolId) {
        List<ToolExecution> executions = toolExecutionService.getToolExecutionsByTool(toolId);
        return new ResponseEntity<>(executions, HttpStatus.OK);
    }

    /**
     * Get tool executions by provider request
     *
     * @param providerRequestId The provider request ID
     * @return List of tool executions for the specified provider request
     */
    @GetMapping("/request/{providerRequestId}")
    public ResponseEntity<List<ToolExecution>> getToolExecutionsByProviderRequest(
            @PathVariable String providerRequestId) {
        List<ToolExecution> executions = toolExecutionService.getToolExecutionsByProviderRequest(providerRequestId);
        return new ResponseEntity<>(executions, HttpStatus.OK);
    }

    /**
     * Get tool executions by status
     *
     * @param status The execution status
     * @return List of tool executions with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ToolExecution>> getToolExecutionsByStatus(
            @PathVariable ToolExecution.ExecutionStatus status) {
        List<ToolExecution> executions = toolExecutionService.getToolExecutionsByStatus(status);
        return new ResponseEntity<>(executions, HttpStatus.OK);
    }

    /**
     * Get recent tool executions
     *
     * @param limit The maximum number of executions to return
     * @return List of recent tool executions
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ToolExecution>> getRecentToolExecutions(
            @RequestParam(defaultValue = "10") int limit) {
        List<ToolExecution> executions = toolExecutionService.getRecentToolExecutions(limit);
        return new ResponseEntity<>(executions, HttpStatus.OK);
    }

    /**
     * Update a tool execution
     *
     * @param id The tool execution ID
     * @param toolExecution The updated tool execution data
     * @return The updated tool execution
     */
    @PutMapping("/{id}")
    public ResponseEntity<ToolExecution> updateToolExecution(
            @PathVariable String id,
            @RequestBody ToolExecution toolExecution) {
        ToolExecution updatedExecution = toolExecutionService.updateToolExecution(id, toolExecution);
        return new ResponseEntity<>(updatedExecution, HttpStatus.OK);
    }

    /**
     * Start a tool execution
     *
     * @param id The tool execution ID
     * @return The updated tool execution
     */
    @PostMapping("/{id}/start")
    public ResponseEntity<ToolExecution> startToolExecution(@PathVariable String id) {
        ToolExecution updatedExecution = toolExecutionService.startToolExecution(id);
        return new ResponseEntity<>(updatedExecution, HttpStatus.OK);
    }

    /**
     * Complete a tool execution with result
     *
     * @param id The tool execution ID
     * @param completionData The completion data
     * @return The updated tool execution
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<ToolExecution> completeToolExecution(
            @PathVariable String id,
            @RequestBody Map<String, Object> completionData) {
        String outputResult = (String) completionData.get("outputResult");
        Integer executionTimeMs = (Integer) completionData.get("executionTimeMs");
        
        if (outputResult == null || executionTimeMs == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ToolExecution completedExecution = toolExecutionService.completeToolExecution(
                id, outputResult, executionTimeMs);
        return new ResponseEntity<>(completedExecution, HttpStatus.OK);
    }

    /**
     * Fail a tool execution with error
     *
     * @param id The tool execution ID
     * @param errorData The error data
     * @return The updated tool execution
     */
    @PostMapping("/{id}/fail")
    public ResponseEntity<ToolExecution> failToolExecution(
            @PathVariable String id,
            @RequestBody Map<String, String> errorData) {
        String errorMessage = errorData.get("errorMessage");
        if (errorMessage == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ToolExecution failedExecution = toolExecutionService.failToolExecution(id, errorMessage);
        return new ResponseEntity<>(failedExecution, HttpStatus.OK);
    }

    /**
     * Cancel a tool execution
     *
     * @param id The tool execution ID
     * @return The updated tool execution
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ToolExecution> cancelToolExecution(@PathVariable String id) {
        ToolExecution cancelledExecution = toolExecutionService.cancelToolExecution(id);
        return new ResponseEntity<>(cancelledExecution, HttpStatus.OK);
    }

    /**
     * Delete a tool execution
     *
     * @param id The tool execution ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToolExecution(@PathVariable String id) {
        toolExecutionService.deleteToolExecution(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Find long-running tool executions
     *
     * @param minutes The threshold in minutes
     * @return List of long-running tool executions
     */
    @GetMapping("/long-running")
    public ResponseEntity<List<ToolExecution>> findLongRunningToolExecutions(
            @RequestParam(defaultValue = "5") int minutes) {
        List<ToolExecution> executions = toolExecutionService.findLongRunningToolExecutions(minutes);
        return new ResponseEntity<>(executions, HttpStatus.OK);
    }

    /**
     * Calculate average execution time for a tool
     *
     * @param toolId The tool ID
     * @return Average execution time in milliseconds
     */
    @GetMapping("/tool/{toolId}/average-time")
    public ResponseEntity<Map<String, Double>> calculateAverageExecutionTime(@PathVariable String toolId) {
        Double averageTime = toolExecutionService.calculateAverageExecutionTime(toolId);
        if (averageTime == null) {
            return new ResponseEntity<>(Map.of("averageExecutionTimeMs", 0.0), HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("averageExecutionTimeMs", averageTime), HttpStatus.OK);
    }
}
