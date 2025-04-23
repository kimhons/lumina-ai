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

/**
 * Represents an AI model offered by a provider
 */
@Entity
@Table(name = "model")
public class Model {

    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ModelType type;
    
    @Column(name = "model_version")
    private String version;
    
    @Column(name = "context_window")
    private int contextWindow;
    
    @Column(name = "max_tokens_output")
    private int maxTokensOutput;
    
    @Column(name = "input_cost_per_1k_tokens")
    private double inputCostPer1kTokens;
    
    @Column(name = "output_cost_per_1k_tokens")
    private double outputCostPer1kTokens;
    
    @Column(name = "average_latency_ms")
    private int averageLatencyMs;
    
    @ElementCollection
    @CollectionTable(name = "model_parameters", joinColumns = @JoinColumn(name = "model_id"))
    @MapKeyColumn(name = "param_key")
    @Column(name = "param_value")
    private Map<String, String> defaultParameters = new HashMap<>();
    
    @Column(nullable = false)
    private boolean enabled = true;
    
    @Column(name = "quality_score")
    private double qualityScore;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Model types supported by the system
     */
    public enum ModelType {
        TEXT,
        CHAT,
        EMBEDDING,
        IMAGE,
        AUDIO,
        MULTIMODAL,
        CODE,
        SPECIALIZED
    }
    
    // Constructors
    
    public Model() {
    }
    
    public Model(String id, String name, Provider provider, ModelType type) {
        this.id = id;
        this.name = name;
        this.provider = provider;
        this.type = type;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Provider getProvider() {
        return provider;
    }
    
    public void setProvider(Provider provider) {
        this.provider = provider;
    }
    
    public ModelType getType() {
        return type;
    }
    
    public void setType(ModelType type) {
        this.type = type;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public int getContextWindow() {
        return contextWindow;
    }
    
    public void setContextWindow(int contextWindow) {
        this.contextWindow = contextWindow;
    }
    
    public int getMaxTokensOutput() {
        return maxTokensOutput;
    }
    
    public void setMaxTokensOutput(int maxTokensOutput) {
        this.maxTokensOutput = maxTokensOutput;
    }
    
    public double getInputCostPer1kTokens() {
        return inputCostPer1kTokens;
    }
    
    public void setInputCostPer1kTokens(double inputCostPer1kTokens) {
        this.inputCostPer1kTokens = inputCostPer1kTokens;
    }
    
    public double getOutputCostPer1kTokens() {
        return outputCostPer1kTokens;
    }
    
    public void setOutputCostPer1kTokens(double outputCostPer1kTokens) {
        this.outputCostPer1kTokens = outputCostPer1kTokens;
    }
    
    public int getAverageLatencyMs() {
        return averageLatencyMs;
    }
    
    public void setAverageLatencyMs(int averageLatencyMs) {
        this.averageLatencyMs = averageLatencyMs;
    }
    
    public Map<String, String> getDefaultParameters() {
        return defaultParameters;
    }
    
    public void setDefaultParameters(Map<String, String> defaultParameters) {
        this.defaultParameters = defaultParameters;
    }
    
    public void addDefaultParameter(String key, String value) {
        this.defaultParameters.put(key, value);
    }
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    public double getQualityScore() {
        return qualityScore;
    }
    
    public void setQualityScore(double qualityScore) {
        this.qualityScore = qualityScore;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
