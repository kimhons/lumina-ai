package ai.lumina.provider.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.Table;
import javax.persistence.Enumerated;
import javax.persistence.EnumType;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.ElementCollection;
import javax.persistence.CollectionTable;
import javax.persistence.MapKeyColumn;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Represents a tool execution performed by an AI model
 */
@Entity
@Table(name = "tool_execution")
public class ToolExecution {

    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "tool_id", nullable = false)
    private Tool tool;
    
    @ManyToOne
    @JoinColumn(name = "provider_request_id", nullable = false)
    private ProviderRequest providerRequest;
    
    @Column(name = "input_parameters", columnDefinition = "TEXT")
    private String inputParameters;
    
    @Column(name = "output_result", columnDefinition = "TEXT")
    private String outputResult;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ExecutionStatus status;
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "execution_time_ms")
    private int executionTimeMs;
    
    @ElementCollection
    @CollectionTable(name = "tool_execution_metadata", joinColumns = @JoinColumn(name = "execution_id"))
    @MapKeyColumn(name = "metadata_key")
    @Column(name = "metadata_value")
    private Map<String, String> metadata = new HashMap<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    /**
     * Tool execution status values
     */
    public enum ExecutionStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        FAILED,
        CANCELLED
    }
    
    // Constructors
    
    public ToolExecution() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.status = ExecutionStatus.PENDING;
    }
    
    public ToolExecution(Tool tool, ProviderRequest providerRequest) {
        this();
        this.tool = tool;
        this.providerRequest = providerRequest;
    }
    
    // Getters and Setters
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public Tool getTool() {
        return tool;
    }
    
    public void setTool(Tool tool) {
        this.tool = tool;
    }
    
    public ProviderRequest getProviderRequest() {
        return providerRequest;
    }
    
    public void setProviderRequest(ProviderRequest providerRequest) {
        this.providerRequest = providerRequest;
    }
    
    public String getInputParameters() {
        return inputParameters;
    }
    
    public void setInputParameters(String inputParameters) {
        this.inputParameters = inputParameters;
    }
    
    public String getOutputResult() {
        return outputResult;
    }
    
    public void setOutputResult(String outputResult) {
        this.outputResult = outputResult;
    }
    
    public ExecutionStatus getStatus() {
        return status;
    }
    
    public void setStatus(ExecutionStatus status) {
        this.status = status;
        if (status == ExecutionStatus.COMPLETED || status == ExecutionStatus.FAILED) {
            this.completedAt = LocalDateTime.now();
        }
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public int getExecutionTimeMs() {
        return executionTimeMs;
    }
    
    public void setExecutionTimeMs(int executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }
    
    public Map<String, String> getMetadata() {
        return metadata;
    }
    
    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }
    
    public void addMetadata(String key, String value) {
        this.metadata.put(key, value);
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
