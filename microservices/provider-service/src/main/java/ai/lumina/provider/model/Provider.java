package ai.lumina.provider.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.Table;
import javax.persistence.Enumerated;
import javax.persistence.EnumType;
import javax.persistence.ElementCollection;
import javax.persistence.CollectionTable;
import javax.persistence.JoinColumn;
import javax.persistence.MapKeyColumn;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Represents an AI provider integration in the system
 */
@Entity
@Table(name = "provider")
public class Provider {

    @Id
    private String id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProviderType type;
    
    @Column(nullable = false)
    private String baseUrl;
    
    @Column(name = "auth_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AuthType authType;
    
    @Column(name = "api_key")
    private String apiKey;
    
    @ElementCollection
    @CollectionTable(name = "provider_capabilities", joinColumns = @JoinColumn(name = "provider_id"))
    @Column(name = "capability")
    @Enumerated(EnumType.STRING)
    private Set<Capability> capabilities = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "provider_config", joinColumns = @JoinColumn(name = "provider_id"))
    @MapKeyColumn(name = "config_key")
    @Column(name = "config_value")
    private Map<String, String> config = new HashMap<>();
    
    @Column(nullable = false)
    private boolean enabled = true;
    
    @Column(name = "priority_weight")
    private int priorityWeight = 100;
    
    @Column(name = "rate_limit")
    private int rateLimit;
    
    @Column(name = "cost_per_token")
    private double costPerToken;
    
    @Column(name = "max_tokens")
    private Integer maxTokens;

    @Column(name = "supports_streaming")
    private boolean supportsStreaming;

    @Column(name = "supports_functions")
    private boolean supportsFunctions;

    @Column(name = "supports_vision")
    private boolean supportsVision;

    @Column(name = "supports_embeddings")
    private boolean supportsEmbeddings;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Provider types supported by the system
     */
    public enum ProviderType {
        OPENAI,
        ANTHROPIC,
        GOOGLE_AI,
        HUGGING_FACE,
        COHERE,
        CUSTOM
    }
    
    /**
     * Authentication types supported by the system
     */
    public enum AuthType {
        API_KEY,
        OAUTH,
        BASIC,
        CUSTOM,
        NONE
    }
    
    /**
     * Capabilities that providers can support
     */
    public enum Capability {
        TEXT_GENERATION,
        CHAT_COMPLETION,
        EMBEDDING,
        IMAGE_GENERATION,
        IMAGE_UNDERSTANDING,
        AUDIO_TRANSCRIPTION,
        AUDIO_GENERATION,
        CODE_GENERATION,
        CODE_UNDERSTANDING,
        FUNCTION_CALLING,
        TOOL_USE,
        REASONING,
        PLANNING,
        MULTI_STEP_EXECUTION
    }
    
    // Constructors
    
    public Provider() {
    }
    
    public Provider(String id, String name, ProviderType type, String baseUrl, AuthType authType) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.baseUrl = baseUrl;
        this.authType = authType;
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
    
    public ProviderType getType() {
        return type;
    }
    
    public void setType(ProviderType type) {
        this.type = type;
    }
    
    public String getBaseUrl() {
        return baseUrl;
    }
    
    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    public AuthType getAuthType() {
        return authType;
    }
    
    public void setAuthType(AuthType authType) {
        this.authType = authType;
    }
    
    public String getApiKey() {
        return apiKey;
    }
    
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    
    public Set<Capability> getCapabilities() {
        return capabilities;
    }
    
    public void setCapabilities(Set<Capability> capabilities) {
        this.capabilities = capabilities;
    }
    
    public void addCapability(Capability capability) {
        this.capabilities.add(capability);
    }
    
    public Map<String, String> getConfig() {
        return config;
    }
    
    public void setConfig(Map<String, String> config) {
        this.config = config;
    }
    
    public void addConfig(String key, String value) {
        this.config.put(key, value);
    }
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    public int getPriorityWeight() {
        return priorityWeight;
    }
    
    public void setPriorityWeight(int priorityWeight) {
        this.priorityWeight = priorityWeight;
    }
    
    public int getRateLimit() {
        return rateLimit;
    }
    
    public void setRateLimit(int rateLimit) {
        this.rateLimit = rateLimit;
    }
    
    public double getCostPerToken() {
        return costPerToken;
    }
    
    public void setCostPerToken(double costPerToken) {
        this.costPerToken = costPerToken;
    }
    
    public Integer getMaxTokens() {
        return maxTokens;
    }
    
    public void setMaxTokens(Integer maxTokens) {
        this.maxTokens = maxTokens;
    }
    
    public boolean isSupportsStreaming() {
        return supportsStreaming;
    }
    
    public void setSupportsStreaming(boolean supportsStreaming) {
        this.supportsStreaming = supportsStreaming;
    }
    
    public boolean isSupportsFunctions() {
        return supportsFunctions;
    }
    
    public void setSupportsFunctions(boolean supportsFunctions) {
        this.supportsFunctions = supportsFunctions;
    }
    
    public boolean isSupportsVision() {
        return supportsVision;
    }
    
    public void setSupportsVision(boolean supportsVision) {
        this.supportsVision = supportsVision;
    }
    
    public boolean isSupportsEmbeddings() {
        return supportsEmbeddings;
    }
    
    public void setSupportsEmbeddings(boolean supportsEmbeddings) {
        this.supportsEmbeddings = supportsEmbeddings;
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
