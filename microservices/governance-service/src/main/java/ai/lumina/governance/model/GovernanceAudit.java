package ai.lumina.governance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Represents a governance audit record for tracking and accountability
 */
@Entity
@Table(name = "governance_audit")
public class GovernanceAudit {

    @Id
    private String id;
    
    @Enumerated(EnumType.STRING)
    private AuditType auditType;
    
    private String resourceId;
    
    @Enumerated(EnumType.STRING)
    private ResourceType resourceType;
    
    private String userId;
    
    private String actionPerformedBy;
    
    @Column(columnDefinition = "TEXT")
    private String actionDescription;
    
    @ElementCollection
    @CollectionTable(name = "audit_policies_applied", joinColumns = @JoinColumn(name = "audit_id"))
    private Set<String> policiesApplied = new HashSet<>();
    
    @Column(columnDefinition = "TEXT")
    private String previousState;
    
    @Column(columnDefinition = "TEXT")
    private String newState;
    
    @Enumerated(EnumType.STRING)
    private DecisionOutcome decisionOutcome;
    
    @Column(columnDefinition = "TEXT")
    private String decisionRationale;
    
    private boolean requiresHumanReview;
    
    private boolean humanReviewCompleted;
    
    private String humanReviewerId;
    
    @Column(columnDefinition = "TEXT")
    private String humanReviewNotes;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime reviewedAt;
    
    /**
     * Types of audit records
     */
    public enum AuditType {
        CONTENT_EVALUATION,
        POLICY_ENFORCEMENT,
        POLICY_CHANGE,
        USER_CONSENT,
        DATA_ACCESS,
        TOOL_USAGE,
        SYSTEM_CHANGE,
        HUMAN_REVIEW
    }
    
    /**
     * Types of resources that can be audited
     */
    public enum ResourceType {
        USER_REQUEST,
        MODEL_RESPONSE,
        POLICY,
        USER_DATA,
        SYSTEM_CONFIG,
        TOOL_EXECUTION,
        PROVIDER
    }
    
    /**
     * Possible decision outcomes
     */
    public enum DecisionOutcome {
        APPROVED,
        APPROVED_WITH_MODIFICATIONS,
        REJECTED,
        ESCALATED,
        ERROR
    }
    
    // Getters and setters
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public AuditType getAuditType() {
        return auditType;
    }

    public void setAuditType(AuditType auditType) {
        this.auditType = auditType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(ResourceType resourceType) {
        this.resourceType = resourceType;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getActionPerformedBy() {
        return actionPerformedBy;
    }

    public void setActionPerformedBy(String actionPerformedBy) {
        this.actionPerformedBy = actionPerformedBy;
    }

    public String getActionDescription() {
        return actionDescription;
    }

    public void setActionDescription(String actionDescription) {
        this.actionDescription = actionDescription;
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

    public String getPreviousState() {
        return previousState;
    }

    public void setPreviousState(String previousState) {
        this.previousState = previousState;
    }

    public String getNewState() {
        return newState;
    }

    public void setNewState(String newState) {
        this.newState = newState;
    }

    public DecisionOutcome getDecisionOutcome() {
        return decisionOutcome;
    }

    public void setDecisionOutcome(DecisionOutcome decisionOutcome) {
        this.decisionOutcome = decisionOutcome;
    }

    public String getDecisionRationale() {
        return decisionRationale;
    }

    public void setDecisionRationale(String decisionRationale) {
        this.decisionRationale = decisionRationale;
    }

    public boolean isRequiresHumanReview() {
        return requiresHumanReview;
    }

    public void setRequiresHumanReview(boolean requiresHumanReview) {
        this.requiresHumanReview = requiresHumanReview;
    }

    public boolean isHumanReviewCompleted() {
        return humanReviewCompleted;
    }

    public void setHumanReviewCompleted(boolean humanReviewCompleted) {
        this.humanReviewCompleted = humanReviewCompleted;
    }

    public String getHumanReviewerId() {
        return humanReviewerId;
    }

    public void setHumanReviewerId(String humanReviewerId) {
        this.humanReviewerId = humanReviewerId;
    }

    public String getHumanReviewNotes() {
        return humanReviewNotes;
    }

    public void setHumanReviewNotes(String humanReviewNotes) {
        this.humanReviewNotes = humanReviewNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
