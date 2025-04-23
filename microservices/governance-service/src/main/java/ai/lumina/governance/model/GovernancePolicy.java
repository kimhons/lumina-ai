package ai.lumina.governance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Represents a governance policy that defines ethical guidelines and constraints
 */
@Entity
@Table(name = "governance_policy")
public class GovernancePolicy {

    @Id
    private String id;
    
    private String name;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    private PolicyType type;
    
    @Enumerated(EnumType.STRING)
    private PolicyScope scope;
    
    @ElementCollection
    @CollectionTable(name = "policy_regions", joinColumns = @JoinColumn(name = "policy_id"))
    @Enumerated(EnumType.STRING)
    private Set<Region> applicableRegions = new HashSet<>();
    
    private boolean enabled;
    
    private int priority;
    
    @Column(columnDefinition = "TEXT")
    private String policyDefinition;
    
    @Column(columnDefinition = "TEXT")
    private String enforcementRules;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private String createdBy;
    
    private String updatedBy;
    
    /**
     * Policy types representing different ethical considerations
     */
    public enum PolicyType {
        TRANSPARENCY,
        PRIVACY,
        SAFETY,
        FAIRNESS,
        ACCOUNTABILITY,
        HUMAN_OVERSIGHT,
        DATA_GOVERNANCE,
        COMPLIANCE
    }
    
    /**
     * Policy scope defining where the policy applies
     */
    public enum PolicyScope {
        GLOBAL,
        PROVIDER,
        MODEL,
        USER,
        REQUEST,
        RESPONSE,
        TOOL
    }
    
    /**
     * Regions for regulatory compliance
     */
    public enum Region {
        US,
        EU,
        UK,
        CANADA,
        AUSTRALIA,
        JAPAN,
        CHINA,
        GLOBAL
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

    public PolicyType getType() {
        return type;
    }

    public void setType(PolicyType type) {
        this.type = type;
    }

    public PolicyScope getScope() {
        return scope;
    }

    public void setScope(PolicyScope scope) {
        this.scope = scope;
    }

    public Set<Region> getApplicableRegions() {
        return applicableRegions;
    }

    public void setApplicableRegions(Set<Region> applicableRegions) {
        this.applicableRegions = applicableRegions;
    }
    
    public void addApplicableRegion(Region region) {
        if (this.applicableRegions == null) {
            this.applicableRegions = new HashSet<>();
        }
        this.applicableRegions.add(region);
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

    public String getPolicyDefinition() {
        return policyDefinition;
    }

    public void setPolicyDefinition(String policyDefinition) {
        this.policyDefinition = policyDefinition;
    }

    public String getEnforcementRules() {
        return enforcementRules;
    }

    public void setEnforcementRules(String enforcementRules) {
        this.enforcementRules = enforcementRules;
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
