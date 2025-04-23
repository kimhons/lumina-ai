package ai.lumina.governance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Represents a content evaluation result from governance checks
 */
@Entity
@Table(name = "content_evaluation")
public class ContentEvaluation {

    @Id
    private String id;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    
    @Enumerated(EnumType.STRING)
    private EvaluationResult result;
    
    private double safetyScore;
    
    private double privacyScore;
    
    private double transparencyScore;
    
    @ElementCollection
    @CollectionTable(name = "content_evaluation_flags", joinColumns = @JoinColumn(name = "evaluation_id"))
    @MapKeyColumn(name = "flag_type")
    @Column(name = "flag_value")
    private Map<String, Double> flags = new HashMap<>();
    
    @Column(columnDefinition = "TEXT")
    private String evaluationDetails;
    
    @Column(columnDefinition = "TEXT")
    private String remediationSuggestions;
    
    private String requestId;
    
    private String userId;
    
    private String modelId;
    
    private String providerId;
    
    private LocalDateTime createdAt;
    
    /**
     * Types of content that can be evaluated
     */
    public enum ContentType {
        USER_INPUT,
        MODEL_OUTPUT,
        TOOL_INPUT,
        TOOL_OUTPUT,
        SYSTEM_PROMPT,
        METADATA
    }
    
    /**
     * Possible evaluation results
     */
    public enum EvaluationResult {
        APPROVED,
        APPROVED_WITH_WARNINGS,
        REQUIRES_MODIFICATION,
        REJECTED,
        ERROR
    }
    
    // Getters and setters
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public EvaluationResult getResult() {
        return result;
    }

    public void setResult(EvaluationResult result) {
        this.result = result;
    }

    public double getSafetyScore() {
        return safetyScore;
    }

    public void setSafetyScore(double safetyScore) {
        this.safetyScore = safetyScore;
    }

    public double getPrivacyScore() {
        return privacyScore;
    }

    public void setPrivacyScore(double privacyScore) {
        this.privacyScore = privacyScore;
    }

    public double getTransparencyScore() {
        return transparencyScore;
    }

    public void setTransparencyScore(double transparencyScore) {
        this.transparencyScore = transparencyScore;
    }

    public Map<String, Double> getFlags() {
        return flags;
    }

    public void setFlags(Map<String, Double> flags) {
        this.flags = flags;
    }
    
    public void addFlag(String flagType, Double value) {
        if (this.flags == null) {
            this.flags = new HashMap<>();
        }
        this.flags.put(flagType, value);
    }

    public String getEvaluationDetails() {
        return evaluationDetails;
    }

    public void setEvaluationDetails(String evaluationDetails) {
        this.evaluationDetails = evaluationDetails;
    }

    public String getRemediationSuggestions() {
        return remediationSuggestions;
    }

    public void setRemediationSuggestions(String remediationSuggestions) {
        this.remediationSuggestions = remediationSuggestions;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
