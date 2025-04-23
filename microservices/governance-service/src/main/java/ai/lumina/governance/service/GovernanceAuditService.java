package ai.lumina.governance.service;

import ai.lumina.governance.model.GovernanceAudit;
import ai.lumina.governance.repository.GovernanceAuditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Service for governance audit operations
 */
@Service
public class GovernanceAuditService {

    private final GovernanceAuditRepository governanceAuditRepository;

    @Autowired
    public GovernanceAuditService(GovernanceAuditRepository governanceAuditRepository) {
        this.governanceAuditRepository = governanceAuditRepository;
    }

    /**
     * Create a new governance audit record
     *
     * @param audit The audit record to create
     * @return The created audit record
     */
    @Transactional
    public GovernanceAudit createAudit(GovernanceAudit audit) {
        if (audit.getId() == null) {
            audit.setId(UUID.randomUUID().toString());
        }
        
        audit.setCreatedAt(LocalDateTime.now());
        
        return governanceAuditRepository.save(audit);
    }

    /**
     * Get an audit record by ID
     *
     * @param id The audit record ID
     * @return The audit record if found
     * @throws RuntimeException if audit record not found
     */
    public GovernanceAudit getAudit(String id) {
        return governanceAuditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Governance audit not found with ID: " + id));
    }

    /**
     * Get an audit record by ID if it exists
     *
     * @param id The audit record ID
     * @return Optional containing the audit record if found
     */
    public Optional<GovernanceAudit> getAuditIfExists(String id) {
        return governanceAuditRepository.findById(id);
    }

    /**
     * Get all audit records
     *
     * @return List of all audit records
     */
    public List<GovernanceAudit> getAllAudits() {
        return governanceAuditRepository.findAll();
    }

    /**
     * Get audit records by audit type
     *
     * @param auditType The audit type
     * @return List of audit records of the specified type
     */
    public List<GovernanceAudit> getAuditsByType(GovernanceAudit.AuditType auditType) {
        return governanceAuditRepository.findByAuditType(auditType);
    }

    /**
     * Get audit records by resource ID
     *
     * @param resourceId The resource ID
     * @return List of audit records for the specified resource
     */
    public List<GovernanceAudit> getAuditsByResourceId(String resourceId) {
        return governanceAuditRepository.findByResourceId(resourceId);
    }

    /**
     * Get audit records by resource type
     *
     * @param resourceType The resource type
     * @return List of audit records for the specified resource type
     */
    public List<GovernanceAudit> getAuditsByResourceType(GovernanceAudit.ResourceType resourceType) {
        return governanceAuditRepository.findByResourceType(resourceType);
    }

    /**
     * Get audit records by user ID
     *
     * @param userId The user ID
     * @return List of audit records for the specified user
     */
    public List<GovernanceAudit> getAuditsByUserId(String userId) {
        return governanceAuditRepository.findByUserId(userId);
    }

    /**
     * Get audit records by action performer
     *
     * @param actionPerformedBy The action performer
     * @return List of audit records performed by the specified entity
     */
    public List<GovernanceAudit> getAuditsByActionPerformer(String actionPerformedBy) {
        return governanceAuditRepository.findByActionPerformedBy(actionPerformedBy);
    }

    /**
     * Get audit records by decision outcome
     *
     * @param decisionOutcome The decision outcome
     * @return List of audit records with the specified decision outcome
     */
    public List<GovernanceAudit> getAuditsByDecisionOutcome(GovernanceAudit.DecisionOutcome decisionOutcome) {
        return governanceAuditRepository.findByDecisionOutcome(decisionOutcome);
    }

    /**
     * Get audit records that require human review
     *
     * @return List of audit records that require human review
     */
    public List<GovernanceAudit> getAuditsRequiringHumanReview() {
        return governanceAuditRepository.findByRequiresHumanReviewTrue();
    }

    /**
     * Get audit records that require human review but are not yet reviewed
     *
     * @return List of audit records that require human review but are not yet reviewed
     */
    public List<GovernanceAudit> getAuditsPendingHumanReview() {
        return governanceAuditRepository.findByRequiresHumanReviewTrueAndHumanReviewCompletedFalse();
    }

    /**
     * Get audit records by human reviewer
     *
     * @param humanReviewerId The human reviewer ID
     * @return List of audit records reviewed by the specified reviewer
     */
    public List<GovernanceAudit> getAuditsByHumanReviewer(String humanReviewerId) {
        return governanceAuditRepository.findByHumanReviewerId(humanReviewerId);
    }

    /**
     * Get audit records created after a specific date
     *
     * @param date The date to filter by
     * @return List of audit records created after the specified date
     */
    public List<GovernanceAudit> getAuditsCreatedAfter(LocalDateTime date) {
        return governanceAuditRepository.findByCreatedAtAfter(date);
    }

    /**
     * Get audit records reviewed after a specific date
     *
     * @param date The date to filter by
     * @return List of audit records reviewed after the specified date
     */
    public List<GovernanceAudit> getAuditsReviewedAfter(LocalDateTime date) {
        return governanceAuditRepository.findByReviewedAtAfter(date);
    }

    /**
     * Get audit records by policy applied
     *
     * @param policyId The policy ID
     * @return List of audit records where the specified policy was applied
     */
    public List<GovernanceAudit> getAuditsByPolicyApplied(String policyId) {
        return governanceAuditRepository.findByPolicyApplied(policyId);
    }

    /**
     * Get recent audit records
     *
     * @param limit The maximum number of audit records to return
     * @return List of recent audit records
     */
    public List<GovernanceAudit> getRecentAudits(int limit) {
        return governanceAuditRepository.findRecentAudits(limit);
    }

    /**
     * Update an audit record
     *
     * @param id The audit record ID
     * @param updatedAudit The updated audit record data
     * @return The updated audit record
     * @throws RuntimeException if audit record not found
     */
    @Transactional
    public GovernanceAudit updateAudit(String id, GovernanceAudit updatedAudit) {
        GovernanceAudit existingAudit = getAudit(id);
        
        // Update fields
        existingAudit.setActionDescription(updatedAudit.getActionDescription());
        existingAudit.setPoliciesApplied(updatedAudit.getPoliciesApplied());
        existingAudit.setPreviousState(updatedAudit.getPreviousState());
        existingAudit.setNewState(updatedAudit.getNewState());
        existingAudit.setDecisionOutcome(updatedAudit.getDecisionOutcome());
        existingAudit.setDecisionRationale(updatedAudit.getDecisionRationale());
        existingAudit.setRequiresHumanReview(updatedAudit.isRequiresHumanReview());
        
        return governanceAuditRepository.save(existingAudit);
    }

    /**
     * Complete human review for an audit record
     *
     * @param id The audit record ID
     * @param humanReviewerId The human reviewer ID
     * @param humanReviewNotes The human review notes
     * @return The updated audit record
     * @throws RuntimeException if audit record not found
     */
    @Transactional
    public GovernanceAudit completeHumanReview(String id, String humanReviewerId, String humanReviewNotes) {
        GovernanceAudit audit = getAudit(id);
        
        if (!audit.isRequiresHumanReview()) {
            throw new RuntimeException("Audit record does not require human review: " + id);
        }
        
        audit.setHumanReviewCompleted(true);
        audit.setHumanReviewerId(humanReviewerId);
        audit.setHumanReviewNotes(humanReviewNotes);
        audit.setReviewedAt(LocalDateTime.now());
        
        return governanceAuditRepository.save(audit);
    }

    /**
     * Add policy applied to audit record
     *
     * @param id The audit record ID
     * @param policyId The policy ID
     * @return The updated audit record
     * @throws RuntimeException if audit record not found
     */
    @Transactional
    public GovernanceAudit addPolicyApplied(String id, String policyId) {
        GovernanceAudit audit = getAudit(id);
        
        audit.addPolicyApplied(policyId);
        
        return governanceAuditRepository.save(audit);
    }

    /**
     * Delete an audit record
     *
     * @param id The audit record ID
     * @throws RuntimeException if audit record not found
     */
    @Transactional
    public void deleteAudit(String id) {
        if (!governanceAuditRepository.existsById(id)) {
            throw new RuntimeException("Governance audit not found with ID: " + id);
        }
        
        governanceAuditRepository.deleteById(id);
    }

    /**
     * Count audit records by decision outcome
     *
     * @param decisionOutcome The decision outcome
     * @return Count of audit records with the specified decision outcome
     */
    public long countAuditsByDecisionOutcome(GovernanceAudit.DecisionOutcome decisionOutcome) {
        return governanceAuditRepository.countByDecisionOutcome(decisionOutcome);
    }

    /**
     * Count audit records that require human review but are not yet reviewed
     *
     * @return Count of audit records that require human review but are not yet reviewed
     */
    public long countAuditsPendingHumanReview() {
        return governanceAuditRepository.countByRequiresHumanReviewTrueAndHumanReviewCompletedFalse();
    }

    /**
     * Create an audit record for content evaluation
     *
     * @param resourceId The content evaluation ID
     * @param userId The user ID
     * @param actionPerformedBy The entity that performed the evaluation
     * @param policiesApplied The policies applied during evaluation
     * @param decisionOutcome The decision outcome
     * @param decisionRationale The decision rationale
     * @param requiresHumanReview Whether human review is required
     * @return The created audit record
     */
    @Transactional
    public GovernanceAudit createContentEvaluationAudit(
            String resourceId,
            String userId,
            String actionPerformedBy,
            Set<String> policiesApplied,
            GovernanceAudit.DecisionOutcome decisionOutcome,
            String decisionRationale,
            boolean requiresHumanReview) {
        
        GovernanceAudit audit = new GovernanceAudit();
        audit.setId(UUID.randomUUID().toString());
        audit.setAuditType(GovernanceAudit.AuditType.CONTENT_EVALUATION);
        audit.setResourceId(resourceId);
        audit.setResourceType(GovernanceAudit.ResourceType.USER_REQUEST);
        audit.setUserId(userId);
        audit.setActionPerformedBy(actionPerformedBy);
        audit.setActionDescription("Content evaluation performed");
        audit.setPoliciesApplied(policiesApplied);
        audit.setDecisionOutcome(decisionOutcome);
        audit.setDecisionRationale(decisionRationale);
        audit.setRequiresHumanReview(requiresHumanReview);
        audit.setHumanReviewCompleted(false);
        audit.setCreatedAt(LocalDateTime.now());
        
        return governanceAuditRepository.save(audit);
    }

    /**
     * Create an audit record for policy enforcement
     *
     * @param resourceId The resource ID
     * @param resourceType The resource type
     * @param userId The user ID
     * @param actionPerformedBy The entity that performed the enforcement
     * @param actionDescription The action description
     * @param policiesApplied The policies applied during enforcement
     * @param previousState The previous state
     * @param newState The new state
     * @param decisionOutcome The decision outcome
     * @param decisionRationale The decision rationale
     * @param requiresHumanReview Whether human review is required
     * @return The created audit record
     */
    @Transactional
    public GovernanceAudit createPolicyEnforcementAudit(
            String resourceId,
            GovernanceAudit.ResourceType resourceType,
            String userId,
            String actionPerformedBy,
            String actionDescription,
            Set<String> policiesApplied,
            String previousState,
            String newState,
            GovernanceAudit.DecisionOutcome decisionOutcome,
            String decisionRationale,
            boolean requiresHumanReview) {
        
        GovernanceAudit audit = new GovernanceAudit();
        audit.setId(UUID.randomUUID().toString());
        audit.setAuditType(GovernanceAudit.AuditType.POLICY_ENFORCEMENT);
        audit.setResourceId(resourceId);
        audit.setResourceType(resourceType);
        audit.setUserId(userId);
        audit.setActionPerformedBy(actionPerformedBy);
        audit.setActionDescription(actionDescription);
        audit.setPoliciesApplied(policiesApplied);
        audit.setPreviousState(previousState);
        audit.setNewState(newState);
        audit.setDecisionOutcome(decisionOutcome);
        audit.setDecisionRationale(decisionRationale);
        audit.setRequiresHumanReview(requiresHumanReview);
        audit.setHumanReviewCompleted(false);
        audit.setCreatedAt(LocalDateTime.now());
        
        return governanceAuditRepository.save(audit);
    }
}
