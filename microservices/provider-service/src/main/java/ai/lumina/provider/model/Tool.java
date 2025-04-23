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
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Represents a tool that can be used by AI models
 */
@Entity
@Table(name = "tool")
public class Tool {

    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ToolType type;
    
    @Column(name = "api_schema", columnDefinition = "TEXT")
    private String apiSchema;
    
    @Column(name = "implementation_class")
    private String implementationClass;
    
    @Column(name = "endpoint_url")
    private String endpointUrl;
    
    @ElementCollection
    @CollectionTable(name = "tool_supported_providers", joinColumns = @JoinColumn(name = "tool_id"))
    @Column(name = "provider_id")
    private Set<String> supportedProviders = new HashSet<>();
    
    @Column(nullable = false)
    private boolean enabled = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Tool types supported by the system
     */
    public enum ToolType {
        WEB_SEARCH,
        WEB_BROWSE,
        FILE_OPERATION,
        DATABASE_QUERY,
        API_CALL,
        CODE_EXECUTION,
        CALCULATOR,
        CALENDAR,
        EMAIL,
        CUSTOM
    }
    
    // Constructors
    
    public Tool() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Tool(String name, String description, ToolType type) {
        this();
        this.name = name;
        this.description = description;
        this.type = type;
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
    
    public ToolType getType() {
        return type;
    }
    
    public void setType(ToolType type) {
        this.type = type;
    }
    
    public String getApiSchema() {
        return apiSchema;
    }
    
    public void setApiSchema(String apiSchema) {
        this.apiSchema = apiSchema;
    }
    
    public String getImplementationClass() {
        return implementationClass;
    }
    
    public void setImplementationClass(String implementationClass) {
        this.implementationClass = implementationClass;
    }
    
    public String getEndpointUrl() {
        return endpointUrl;
    }
    
    public void setEndpointUrl(String endpointUrl) {
        this.endpointUrl = endpointUrl;
    }
    
    public Set<String> getSupportedProviders() {
        return supportedProviders;
    }
    
    public void setSupportedProviders(Set<String> supportedProviders) {
        this.supportedProviders = supportedProviders;
    }
    
    public void addSupportedProvider(String providerId) {
        this.supportedProviders.add(providerId);
    }
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
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
