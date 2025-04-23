package ai.lumina.governance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Represents a transparency record for explainability and user understanding
 */
@Entity
@Table(name = "transparency_record")
public class TransparencyRecord {

    @Id
    private String id;
    
    private String requestId;
    
    private String userId;
    
    @Enumerated(EnumType.STRING)
    private RecordType recordType;
    
    @Column(columnDefinition = "TEXT")
    private String explanation;
    
    @Column(columnDefinition = "TEXT")
    private String modelDetails;
    
    @Column(columnDefinition = "TEXT")
    private String dataSourcesUsed;
    
    @ElementCollection
    @CollectionTable(name = "transparency_policies_applied", joinColumns = @JoinColumn(name = "record_id"))
    private Set<String> policiesApplied = new HashSet<>();
    
    @Column(columnDefinition = "TEXT")
    private String limitationsDisclosure;
    
    @Column(columnDefinition = "TEXT")
    private String confidenceInformation;
    
    private boolean userNotified;
    
    private LocalDateTime createdAt;
    
    private String modelId;
    
    private String providerId;
    
    @Column(columnDefinition = "TEXT")
    private String toolsUsed;
    
    /**
     * Types of transparency records
     */
    public enum RecordType {
        MODEL_DECISION,
        CONTENT_MODIFICATION,
        CONTENT_REJECTION,
        DATA_USAGE,
        TOOL_SELECTION,
        PROVIDER_SELECTION,
        HUMAN_INTERVENTION
    }
    
    // Getters and setters
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public RecordType getRecordType() {
        return recordType;
    }

    public void setRecordType(RecordType recordType) {
        this.recordType = recordType;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getModelDetails() {
        return modelDetails;
    }

    public void setModelDetails(String modelDetails) {
        this.modelDetails = modelDetails;
    }

    public String getDataSourcesUsed() {
        return dataSourcesUsed;
    }

    public void setDataSourcesUsed(String dataSourcesUsed) {
        this.dataSourcesUsed = dataSourcesUsed;
    }

    public Set<String> getPoliciesApplied() {
        return policiesApplied;
    }

    public void setPoliciesApplied(Set<String> policiesApplied) {
        this.policiesApplied = policiesApplied;
    }
    
    public void addPolicyApplied(String policyId) {
        if (this.policiesApplied == null) {
            this.policiesApplied = new HashSet<>();
        }
        this.policiesApplied.add(policyId);
    }

    public String getLimitationsDisclosure() {
        return limitationsDisclosure;
    }

    public void setLimitationsDisclosure(String limitationsDisclosure) {
        this.limitationsDisclosure = limitationsDisclosure;
    }

    public String getConfidenceInformation() {
        return confidenceInformation;
    }

    public void setConfidenceInformation(String confidenceInformation) {
        this.confidenceInformation = confidenceInformation;
    }

    public boolean isUserNotified() {
        return userNotified;
    }

    public void setUserNotified(boolean userNotified) {
        this.userNotified = userNotified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getModelId() {
        return modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getToolsUsed() {
        return toolsUsed;
    }

    public void setToolsUsed(String toolsUsed) {
        this.toolsUsed = toolsUsed;
    }
}
