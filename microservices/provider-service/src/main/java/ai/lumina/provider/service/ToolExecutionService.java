package ai.lumina.provider.service;

import ai.lumina.provider.model.ToolExecution;
import ai.lumina.provider.model.Tool;
import ai.lumina.provider.model.ProviderRequest;
import ai.lumina.provider.repository.ToolExecutionRepository;
import ai.lumina.provider.exception.ToolExecutionNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing tool executions
 */
@Service
public class ToolExecutionService {

    private final ToolExecutionRepository toolExecutionRepository;
    private final ToolService toolService;
    private final ProviderRequestService providerRequestService;

    @Autowired
    public ToolExecutionService(
            ToolExecutionRepository toolExecutionRepository,
            ToolService toolService,
            ProviderRequestService providerRequestService) {
        this.toolExecutionRepository = toolExecutionRepository;
        this.toolService = toolService;
        this.providerRequestService = providerRequestService;
    }

    /**
     * Create a new tool execution
     *
     * @param toolExecution The tool execution to create
     * @return The created tool execution
     */
    @Transactional
    public ToolExecution createToolExecution(ToolExecution toolExecution) {
        // Generate ID if not provided
        if (toolExecution.getId() == null || toolExecution.getId().isEmpty()) {
            toolExecution.setId(UUID.randomUUID().toString());
        }
        
        // Verify tool exists
        if (toolExecution.getTool() != null && toolExecution.getTool().getId() != null) {
            Tool tool = toolService.getTool(toolExecution.getTool().getId());
            toolExecution.setTool(tool);
        }
        
        // Verify provider request exists
        if (toolExecution.getProviderRequest() != null && toolExecution.getProviderRequest().getId() != null) {
            ProviderRequest providerRequest = providerRequestService.getProviderRequest(toolExecution.getProviderRequest().getId());
            toolExecution.setProviderRequest(providerRequest);
        }
        
        // Set timestamps and initial status if not set
        if (toolExecution.getCreatedAt() == null) {
            toolExecution.setCreatedAt(LocalDateTime.now());
        }
        
        if (toolExecution.getStatus() == null) {
            toolExecution.setStatus(ToolExecution.ExecutionStatus.PENDING);
        }
        
        return toolExecutionRepository.save(toolExecution);
    }

    /**
     * Get a tool execution by ID
     *
     * @param id The tool execution ID
     * @return The tool execution if found
     * @throws ToolExecutionNotFoundException if tool execution not found
     */
    public ToolExecution getToolExecution(String id) {
        return toolExecutionRepository.findById(id)
                .orElseThrow(() -> new ToolExecutionNotFoundException("Tool execution not found with ID: " + id));
    }

    /**
     * Get a tool execution by ID (optional version)
     *
     * @param id The tool execution ID
     * @return Optional containing the tool execution if found
     */
    public Optional<ToolExecution> findToolExecution(String id) {
        return toolExecutionRepository.findById(id);
    }

    /**
     * Get all tool executions
     *
     * @return List of all tool executions
     */
    public List<ToolExecution> getAllToolExecutions() {
        return toolExecutionRepository.findAll();
    }

    /**
     * Get tool executions by tool ID
     *
     * @param toolId The tool ID
     * @return List of tool executions for the specified tool
     */
    public List<ToolExecution> getToolExecutionsByTool(String toolId) {
        return toolExecutionRepository.findByToolId(toolId);
    }

    /**
     * Get tool executions by provider request ID
     *
     * @param providerRequestId The provider request ID
     * @return List of tool executions for the specified provider request
     */
    public List<ToolExecution> getToolExecutionsByProviderRequest(String providerRequestId) {
        return toolExecutionRepository.findByProviderRequestId(providerRequestId);
    }

    /**
     * Get tool executions by status
     *
     * @param status The execution status
     * @return List of tool executions with the specified status
     */
    public List<ToolExecution> getToolExecutionsByStatus(ToolExecution.ExecutionStatus status) {
        return toolExecutionRepository.findByStatus(status);
    }

    /**
     * Get recent tool executions
     *
     * @param limit The maximum number of executions to return
     * @return List of recent tool executions
     */
    public List<ToolExecution> getRecentToolExecutions(int limit) {
        return toolExecutionRepository.findRecentExecutions(limit);
    }

    /**
     * Update a tool execution
     *
     * @param id The tool execution ID
     * @param toolExecution The updated tool execution data
     * @return The updated tool execution
     * @throws ToolExecutionNotFoundException if tool execution not found
     */
    @Transactional
    public ToolExecution updateToolExecution(String id, ToolExecution toolExecution) {
        ToolExecution existingExecution = getToolExecution(id);
        
        // Update fields
        if (toolExecution.getInputParameters() != null) {
            existingExecution.setInputParameters(toolExecution.getInputParameters());
        }
        if (toolExecution.getOutputResult() != null) {
            existingExecution.setOutputResult(toolExecution.getOutputResult());
        }
        
        if (toolExecution.getStatus() != null) {
            existingExecution.setStatus(toolExecution.getStatus());
        }
        
        if (toolExecution.getErrorMessage() != null) {
            existingExecution.setErrorMessage(toolExecution.getErrorMessage());
        }
        
        existingExecution.setExecutionTimeMs(toolExecution.getExecutionTimeMs());
        
        if (toolExecution.getMetadata() != null && !toolExecution.getMetadata().isEmpty()) {
            existingExecution.setMetadata(toolExecution.getMetadata());
        }
        
        if (toolExecution.getCompletedAt() != null) {
            existingExecution.setCompletedAt(toolExecution.getCompletedAt());
        }
        
        return toolExecutionRepository.save(existingExecution);
    }

    /**
     * Start a tool execution
     *
     * @param id The tool execution ID
     * @return The updated tool execution
     * @throws ToolExecutionNotFoundException if tool execution not found
     */
    @Transactional
    public ToolExecution startToolExecution(String id) {
        ToolExecution execution = getToolExecution(id);
        execution.setStatus(ToolExecution.ExecutionStatus.IN_PROGRESS);
        return toolExecutionRepository.save(execution);
    }

    /**
     * Complete a tool execution with result
     *
     * @param id The tool execution ID
     * @param outputResult The output result
     * @param executionTimeMs The execution time in milliseconds
     * @return The updated tool execution
     * @throws ToolExecutionNotFoundException if tool execution not found
     */
    @Transactional
    public ToolExecution completeToolExecution(String id, String outputResult, int executionTimeMs) {
        ToolExecution execution = getToolExecution(id);
        execution.setOutputResult(outputResult);
        execution.setExecutionTimeMs(executionTimeMs);
        execution.setStatus(ToolExecution.ExecutionStatus.COMPLETED);
        execution.setCompletedAt(LocalDateTime.now());
        return toolExecutionRepository.save(execution);
    }

    /**
     * Fail a tool execution with error
     *
     * @param id The tool execution ID
     * @param errorMessage The error message
     * @return The updated tool execution
     * @throws ToolExecutionNotFoundException if tool execution not found
     */
    @Transactional
    public ToolExecution failToolExecution(String id, String errorMessage) {
        ToolExecution execution = getToolExecution(id);
        execution.setErrorMessage(errorMessage);
        execution.setStatus(ToolExecution.ExecutionStatus.FAILED);
        execution.setCompletedAt(LocalDateTime.now());
        return toolExecutionRepository.save(execution);
    }

    /**
     * Cancel a tool execution
     *
     * @param id The tool execution ID
     * @return The updated tool execution
     * @throws ToolExecutionNotFoundException if tool execution not found
     */
    @Transactional
    public ToolExecution cancelToolExecution(String id) {
        ToolExecution execution = getToolExecution(id);
        execution.setStatus(ToolExecution.ExecutionStatus.CANCELLED);
        execution.setCompletedAt(LocalDateTime.now());
        return toolExecutionRepository.save(execution);
    }

    /**
     * Delete a tool execution
     *
     * @param id The tool execution ID
     * @throws ToolExecutionNotFoundException if tool execution not found
     */
    @Transactional
    public void deleteToolExecution(String id) {
        if (!toolExecutionRepository.existsById(id)) {
            throw new ToolExecutionNotFoundException("Tool execution not found with ID: " + id);
        }
        toolExecutionRepository.deleteById(id);
    }

    /**
     * Find long-running tool executions
     *
     * @param minutes The threshold in minutes
     * @return List of long-running tool executions
     */
    public List<ToolExecution> findLongRunningToolExecutions(int minutes) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutes);
        return toolExecutionRepository.findLongRunningExecutions(cutoffTime);
    }

    /**
     * Calculate average execution time for a tool
     *
     * @param toolId The tool ID
     * @return Average execution time in milliseconds, or null if no completed executions
     */
    public Double calculateAverageExecutionTime(String toolId) {
        return toolExecutionRepository.calculateAverageExecutionTime(toolId);
    }
}
