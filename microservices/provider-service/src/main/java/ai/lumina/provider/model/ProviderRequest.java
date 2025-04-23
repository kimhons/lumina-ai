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
 * Represents a request made to an AI provider
 */
@Entity
@Table(name = "provider_request")
public class ProviderRequest {

    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;
    
    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestType type;
    
    @Column(name = "request_content", columnDefinition = "TEXT")
    private String requestContent;
    
    @Column(name = "response_content", columnDefinition = "TEXT")
    private String responseContent;
    
    @Column(name = "input_tokens")
    private int inputTokens;
    
    @Column(name = "output_tokens")
    private int outputTokens;
    
    @Column(name = "total_cost")
    private double totalCost;
    
    @Column(name = "latency_ms")
    private int latencyMs;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status;
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @ElementCollection
    @CollectionTable(name = "request_parameters", joinColumns = @JoinColumn(name = "request_id"))
    @MapKeyColumn(name = "param_key")
    @Column(name = "param_value")
    private Map<String, String> parameters = new HashMap<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "session_id")
    private String sessionId;
    
    @Column(name = "task_id")
    private String taskId;
    
    /**
     * Request types supported by the system
     */
    public enum RequestType {
        TEXT_GENERATION,
        CHAT_COMPLETION,
        EMBEDDING,
        IMAGE_GENERATION,
        IMAGE_UNDERSTANDING,
        AUDIO_TRANSCRIPTION,
        AUDIO_GENERATION,
        FUNCTION_CALLING,
        TOOL_USE
    }
    
    /**
     * Request status values
     */
    public enum RequestStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        FAILED,
        CANCELLED
    }
    
    // Constructors
    
    public ProviderRequest() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
    }
    
    public ProviderRequest(Provider provider, Model model, RequestType type) {
        this();
        this.provider = provider;
        this.model = model;
        this.type = type;
    }
    
    // Getters and Setters
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public Provider getProvider() {
        return provider;
    }
    
    public void setProvider(Provider provider) {
        this.provider = provider;
    }
    
    public Model getModel() {
        return model;
    }
    
    public void setModel(Model model) {
        this.model = model;
    }
    
    public RequestType getType() {
        return type;
    }
    
    public void setType(RequestType type) {
        this.type = type;
    }
    
    public String getRequestContent() {
        return requestContent;
    }
    
    public void setRequestContent(String requestContent) {
        this.requestContent = requestContent;
    }
    
    public String getResponseContent() {
        return responseContent;
    }
    
    public void setResponseContent(String responseContent) {
        this.responseContent = responseContent;
    }
    
    public int getInputTokens() {
        return inputTokens;
    }
    
    public void setInputTokens(int inputTokens) {
        this.inputTokens = inputTokens;
    }
    
    public int getOutputTokens() {
        return outputTokens;
    }
    
    public void setOutputTokens(int outputTokens) {
        this.outputTokens = outputTokens;
    }
    
    public double getTotalCost() {
        return totalCost;
    }
    
    public void setTotalCost(double totalCost) {
        this.totalCost = totalCost;
    }
    
    public int getLatencyMs() {
        return latencyMs;
    }
    
    public void setLatencyMs(int latencyMs) {
        this.latencyMs = latencyMs;
    }
    
    public RequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(RequestStatus status) {
        this.status = status;
        if (status == RequestStatus.COMPLETED || status == RequestStatus.FAILED) {
            this.completedAt = LocalDateTime.now();
        }
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public Map<String, String> getParameters() {
        return parameters;
    }
    
    public void setParameters(Map<String, String> parameters) {
        this.parameters = parameters;
    }
    
    public void addParameter(String key, String value) {
        this.parameters.put(key, value);
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
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getTaskId() {
        return taskId;
    }
    
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }
    
    /**
     * Calculate the total cost of this request
     * 
     * @return The calculated cost
     */
    public double calculateCost() {
        if (model == null || inputTokens == 0) {
            return 0;
        }
        
        double inputCost = (inputTokens / 1000.0) * model.getInputCostPer1kTokens();
        double outputCost = (outputTokens / 1000.0) * model.getOutputCostPer1kTokens();
        
        return inputCost + outputCost;
    }
}
