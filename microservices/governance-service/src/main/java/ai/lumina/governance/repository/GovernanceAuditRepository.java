package ai.lumina.governance.repository;

import ai.lumina.governance.model.GovernanceAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for GovernanceAudit entity operations
 */
@Repository
public interface GovernanceAuditRepository extends JpaRepository<GovernanceAudit, String> {

    /**
     * Find audits by audit type
     * 
     * @param auditType The audit type
     * @return List of audits of the specified type
     */
    List<GovernanceAudit> findByAuditType(GovernanceAudit.AuditType auditType);
    
    /**
     * Find audits by resource ID
     * 
     * @param resourceId The resource ID
     * @return List of audits for the specified resource
     */
    List<GovernanceAudit> findByResourceId(String resourceId);
    
    /**
     * Find audits by resource type
     * 
     * @param resourceType The resource type
     * @return List of audits for the specified resource type
     */
    List<GovernanceAudit> findByResourceType(GovernanceAudit.ResourceType resourceType);
    
    /**
     * Find audits by user ID
     * 
     * @param userId The user ID
     * @return List of audits for the specified user
     */
    List<GovernanceAudit> findByUserId(String userId);
    
    /**
     * Find audits by action performer
     * 
     * @param actionPerformedBy The action performer
     * @return List of audits performed by the specified entity
     */
    List<GovernanceAudit> findByActionPerformedBy(String actionPerformedBy);
    
    /**
     * Find audits by decision outcome
     * 
     * @param decisionOutcome The decision outcome
     * @return List of audits with the specified decision outcome
     */
    List<GovernanceAudit> findByDecisionOutcome(GovernanceAudit.DecisionOutcome decisionOutcome);
    
    /**
     * Find audits that require human review
     * 
     * @return List of audits that require human review
     */
    List<GovernanceAudit> findByRequiresHumanReviewTrue();
    
    /**
     * Find audits that require human review but are not yet reviewed
     * 
     * @return List of audits that require human review but are not yet reviewed
     */
    List<GovernanceAudit> findByRequiresHumanReviewTrueAndHumanReviewCompletedFalse();
    
    /**
     * Find audits by human reviewer
     * 
     * @param humanReviewerId The human reviewer ID
     * @return List of audits reviewed by the specified reviewer
     */
    List<GovernanceAudit> findByHumanReviewerId(String humanReviewerId);
    
    /**
     * Find audits created after a specific date
     * 
     * @param date The date to filter by
     * @return List of audits created after the specified date
     */
    List<GovernanceAudit> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find audits reviewed after a specific date
     * 
     * @param date The date to filter by
     * @return List of audits reviewed after the specified date
     */
    List<GovernanceAudit> findByReviewedAtAfter(LocalDateTime date);
    
    /**
     * Find audits by policy applied
     * 
     * @param policyId The policy ID
     * @return List of audits where the specified policy was applied
     */
    @Query("SELECT a FROM GovernanceAudit a WHERE :policyId MEMBER OF a.policiesApplied")
    List<GovernanceAudit> findByPolicyApplied(@Param("policyId") String policyId);
    
    /**
     * Find recent audits limited by count
     * 
     * @param limit The maximum number of audits to return
     * @return List of recent audits
     */
    @Query(value = "SELECT * FROM governance_audit ORDER BY created_at DESC LIMIT :limit", nativeQuery = true)
    List<GovernanceAudit> findRecentAudits(@Param("limit") int limit);
    
    /**
     * Find audits by resource type and decision outcome
     * 
     * @param resourceType The resource type
     * @param decisionOutcome The decision outcome
     * @return List of audits with the specified resource type and decision outcome
     */
    List<GovernanceAudit> findByResourceTypeAndDecisionOutcome(
            GovernanceAudit.ResourceType resourceType, 
            GovernanceAudit.DecisionOutcome decisionOutcome);
    
    /**
     * Count audits by decision outcome
     * 
     * @param decisionOutcome The decision outcome
     * @return Count of audits with the specified decision outcome
     */
    long countByDecisionOutcome(GovernanceAudit.DecisionOutcome decisionOutcome);
    
    /**
     * Count audits that require human review but are not yet reviewed
     * 
     * @return Count of audits that require human review but are not yet reviewed
     */
    long countByRequiresHumanReviewTrueAndHumanReviewCompletedFalse();
}
