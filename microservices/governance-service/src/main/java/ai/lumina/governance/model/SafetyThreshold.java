package ai.lumina.governance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Represents a safety threshold configuration for content evaluation
 */
@Entity
@Table(name = "safety_threshold")
public class SafetyThreshold {

    @Id
    private String id;
    
    private String name;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    private ThresholdCategory category;
    
    @ElementCollection
    @CollectionTable(name = "threshold_scores", joinColumns = @JoinColumn(name = "threshold_id"))
    @MapKeyColumn(name = "dimension")
    @Column(name = "threshold_value")
    private Map<String, Double> thresholdScores = new HashMap<>();
    
    private boolean enabled;
    
    private int priority;
    
    @Enumerated(EnumType.STRING)
    private ActionType actionOnThresholdExceeded;
    
    @Column(columnDefinition = "TEXT")
    private String warningMessage;
    
    @ElementCollection
    @CollectionTable(name = "threshold_applicable_regions", joinColumns = @JoinColumn(name = "threshold_id"))
    @Enumerated(EnumType.STRING)
    private Set<GovernancePolicy.Region> applicableRegions = new HashSet<>();
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private String createdBy;
    
    private String updatedBy;
    
    /**
     * Categories of safety thresholds
     */
    public enum ThresholdCategory {
        HARMFUL_CONTENT,
        PRIVACY_VIOLATION,
        MISINFORMATION,
        BIAS,
        LEGAL_COMPLIANCE,
        SECURITY_RISK,
        TRANSPARENCY
    }
    
    /**
     * Types of actions to take when threshold is exceeded
     */
    public enum ActionType {
        LOG_ONLY,
        WARN_USER,
        MODIFY_CONTENT,
        BLOCK_REQUEST,
        REQUIRE_HUMAN_REVIEW,
        ESCALATE
    }
    
    // Getters and setters
    
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

    public ThresholdCategory getCategory() {
        return category;
    }

    public void setCategory(ThresholdCategory category) {
        this.category = category;
    }

    public Map<String, Double> getThresholdScores() {
        return thresholdScores;
    }

    public void setThresholdScores(Map<String, Double> thresholdScores) {
        this.thresholdScores = thresholdScores;
    }
    
    public void addThresholdScore(String dimension, Double value) {
        if (this.thresholdScores == null) {
            this.thresholdScores = new HashMap<>();
        }
        this.thresholdScores.put(dimension, value);
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public ActionType getActionOnThresholdExceeded() {
        return actionOnThresholdExceeded;
    }

    public void setActionOnThresholdExceeded(ActionType actionOnThresholdExceeded) {
        this.actionOnThresholdExceeded = actionOnThresholdExceeded;
    }

    public String getWarningMessage() {
        return warningMessage;
    }

    public void setWarningMessage(String warningMessage) {
        this.warningMessage = warningMessage;
    }

    public Set<GovernancePolicy.Region> getApplicableRegions() {
        return applicableRegions;
    }

    public void setApplicableRegions(Set<GovernancePolicy.Region> applicableRegions) {
        this.applicableRegions = applicableRegions;
    }
    
    public void addApplicableRegion(GovernancePolicy.Region region) {
        if (this.applicableRegions == null) {
            this.applicableRegions = new HashSet<>();
        }
        this.applicableRegions.add(region);
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
