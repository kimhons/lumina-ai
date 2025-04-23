package ai.lumina.governance.service;

import ai.lumina.governance.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Core service for ethical AI governance operations
 */
@Service
public class EthicalAIGovernanceService {

    private final GovernancePolicyService policyService;
    private final ContentEvaluationService evaluationService;
    private final GovernanceAuditService auditService;
    private final UserConsentService consentService;
    private final SafetyThresholdService thresholdService;
    private final TransparencyRecordService transparencyService;

    @Autowired
    public EthicalAIGovernanceService(
            GovernancePolicyService policyService,
            ContentEvaluationService evaluationService,
            GovernanceAuditService auditService,
            UserConsentService consentService,
            SafetyThresholdService thresholdService,
            TransparencyRecordService transparencyService) {
        this.policyService = policyService;
        this.evaluationService = evaluationService;
        this.auditService = auditService;
        this.consentService = consentService;
        this.thresholdService = thresholdService;
        this.transparencyService = transparencyService;
    }

    /**
     * Evaluate user input for compliance with governance policies
     *
     * @param content The user input content
     * @param userId The user ID
     * @param requestId The request ID
     * @param region The user's region
     * @return The evaluation result
     */
    @Transactional
    public ContentEvaluation evaluateUserInput(
            String content,
            String userId,
            String requestId,
            GovernancePolicy.Region region) {
        
        // Evaluate content
        ContentEvaluation evaluation = evaluationService.evaluateContent(
                content,
                ContentEvaluation.ContentType.USER_INPUT,
                requestId,
                userId,
                null,
                null);
        
        // Check if user has given consent for data processing
        boolean hasConsent = consentService.hasUserGivenConsent(
                userId, 
                UserConsent.ConsentType.DATA_PROCESSING);
        
        // Apply region-specific policies
        List<GovernancePolicy> policies = policyService.getEnabledPoliciesByRegion(region);
        Set<String> appliedPolicyIds = new HashSet<>();
        
        for (GovernancePolicy policy : policies) {
            if (policy.getType() == GovernancePolicy.PolicyType.PRIVACY && !hasConsent) {
                // If privacy policy requires consent and user hasn't given it
                evaluation.setResult(ContentEvaluation.EvaluationResult.REJECTED);
                evaluation.setEvaluationDetails("Content rejected due to lack of user consent for data processing.");
                evaluation.setRemediationSuggestions("Please obtain user consent before processing this data.");
            }
            
            appliedPolicyIds.add(policy.getId());
        }
        
        // Create audit record
        GovernanceAudit.DecisionOutcome auditOutcome;
        switch (evaluation.getResult()) {
            case APPROVED:
                auditOutcome = GovernanceAudit.DecisionOutcome.APPROVED;
                break;
            case APPROVED_WITH_WARNINGS:
                auditOutcome = GovernanceAudit.DecisionOutcome.APPROVED_WITH_MODIFICATIONS;
                break;
            case REJECTED:
                auditOutcome = GovernanceAudit.DecisionOutcome.REJECTED;
                break;
            default:
                auditOutcome = GovernanceAudit.DecisionOutcome.ERROR;
        }
        
        auditService.createContentEvaluationAudit(
                evaluation.getId(),
                userId,
                "EthicalAIGovernanceService",
                appliedPolicyIds,
                auditOutcome,
                evaluation.getEvaluationDetails(),
                evaluation.getResult() == ContentEvaluation.EvaluationResult.REJECTED);
        
        return evaluation;
    }

    /**
     * Evaluate model output for compliance with governance policies
     *
     * @param content The model output content
     * @param userId The user ID
     * @param requestId The request ID
     * @param modelId The model ID
     * @param providerId The provider ID
     * @param region The user's region
     * @return The evaluation result with any necessary modifications
     */
    @Transactional
    public Map<String, Object> evaluateModelOutput(
            String content,
            String userId,
            String requestId,
            String modelId,
            String providerId,
            GovernancePolicy.Region region) {
        
        // Evaluate content
        ContentEvaluation evaluation = evaluationService.evaluateContent(
                content,
                ContentEvaluation.ContentType.MODEL_OUTPUT,
                requestId,
                userId,
                modelId,
                providerId);
        
        // Check content against safety thresholds
        Map<String, Double> contentScores = new HashMap<>();
        contentScores.put("safety", evaluation.getSafetyScore());
        contentScores.put("privacy", evaluation.getPrivacyScore());
        contentScores.put("transparency", evaluation.getTransparencyScore());
        
        // Add any flags as dimensions
        for (Map.Entry<String, Double> flag : evaluation.getFlags().entrySet()) {
            contentScores.put(flag.getKey(), flag.getValue());
        }
        
        Map<String, SafetyThreshold.ActionType> exceededThresholds = 
                thresholdService.checkContentAgainstThresholds(contentScores, region);
        
        // Apply region-specific policies
        List<GovernancePolicy> policies = policyService.getEnabledPoliciesByRegion(region);
        Set<String> appliedPolicyIds = new HashSet<>();
        
        for (GovernancePolicy policy : policies) {
            appliedPolicyIds.add(policy.getId());
        }
        
        // Determine action based on thresholds and evaluation
        String modifiedContent = content;
        String warningMessage = null;
        boolean contentBlocked = false;
        boolean requiresHumanReview = false;
        
        for (Map.Entry<String, SafetyThreshold.ActionType> entry : exceededThresholds.entrySet()) {
            SafetyThreshold threshold = thresholdService.getThreshold(entry.getKey());
            SafetyThreshold.ActionType actionType = entry.getValue();
            
            switch (actionType) {
                case LOG_ONLY:
                    // No action needed, just logging
                    break;
                    
                case WARN_USER:
                    warningMessage = threshold.getWarningMessage();
                    break;
                    
                case MODIFY_CONTENT:
                    // Simple placeholder for content modification
                    // In a real implementation, this would use more sophisticated techniques
                    modifiedContent = applyContentModification(content, threshold);
                    
                    // Create transparency record for modification
                    transparencyService.createContentModificationRecord(
                            requestId,
                            userId,
                            modelId,
                            providerId,
                            "Content was modified due to policy violations: " + threshold.getName(),
                            appliedPolicyIds);
                    break;
                    
                case BLOCK_REQUEST:
                    contentBlocked = true;
                    
                    // Create transparency record for rejection
                    transparencyService.createContentRejectionRecord(
                            requestId,
                            userId,
                            modelId,
                            providerId,
                            "Content was blocked due to policy violations: " + threshold.getName(),
                            appliedPolicyIds);
                    break;
                    
                case REQUIRE_HUMAN_REVIEW:
                    requiresHumanReview = true;
                    break;
                    
                case ESCALATE:
                    requiresHumanReview = true;
                    break;
            }
        }
        
        // Create model decision transparency record
        if (!contentBlocked) {
            transparencyService.createModelDecisionRecord(
                    requestId,
                    userId,
                    modelId,
                    providerId,
                    "AI model generated content in response to user request",
                    "Model: " + modelId + ", Provider: " + providerId,
                    "User input and model parameters",
                    appliedPolicyIds,
                    "This model may not always provide accurate information",
                    "Confidence level based on internal model metrics",
                    "No external tools were used");
        }
        
        // Create audit record
        GovernanceAudit.DecisionOutcome auditOutcome;
        if (contentBlocked) {
            auditOutcome = GovernanceAudit.DecisionOutcome.REJECTED;
        } else if (!modifiedContent.equals(content)) {
            auditOutcome = GovernanceAudit.DecisionOutcome.APPROVED_WITH_MODIFICATIONS;
        } else if (warningMessage != null) {
            auditOutcome = GovernanceAudit.DecisionOutcome.APPROVED_WITH_MODIFICATIONS;
        } else {
            auditOutcome = GovernanceAudit.DecisionOutcome.APPROVED;
        }
        
        auditService.createContentEvaluationAudit(
                evaluation.getId(),
                userId,
                "EthicalAIGovernanceService",
                appliedPolicyIds,
                auditOutcome,
                evaluation.getEvaluationDetails(),
                requiresHumanReview);
        
        // Prepare result
        Map<String, Object> result = new HashMap<>();
        result.put("evaluation", evaluation);
        result.put("modifiedContent", modifiedContent);
        result.put("warningMessage", warningMessage);
        result.put("contentBlocked", contentBlocked);
        result.put("requiresHumanReview", requiresHumanReview);
        
        return result;
    }

    /**
     * Record user consent
     *
     * @param userId The user ID
     * @param consentType The consent type
     * @param consentGiven Whether consent is given
     * @param dataCategories The data categories
     * @param ipAddress The IP address
     * @param userAgent The user agent
     * @param region The region
     * @param consentVersion The consent version
     * @param consentText The consent text
     * @return The created consent record
     */
    @Transactional
    public UserConsent recordUserConsent(
            String userId,
            UserConsent.ConsentType consentType,
            boolean consentGiven,
            Map<String, Boolean> dataCategories,
            String ipAddress,
            String userAgent,
            GovernancePolicy.Region region,
            String consentVersion,
            String consentText) {
        
        // Calculate expiry (1 year from now)
        LocalDateTime expiryTimestamp = LocalDateTime.now().plusYears(1);
        
        // Record consent
        UserConsent consent = consentService.recordConsent(
                userId,
                consentType,
                consentGiven,
                "User consent recorded via application",
                dataCategories,
                ipAddress,
                userAgent,
                region,
                expiryTimestamp,
                consentVersion,
                consentText);
        
        // Create audit record
        Set<String> policiesApplied = new HashSet<>();
        List<GovernancePolicy> policies = policyService.getPoliciesByType(GovernancePolicy.PolicyType.PRIVACY);
        for (GovernancePolicy policy : policies) {
            policiesApplied.add(policy.getId());
        }
        
        auditService.createPolicyEnforcementAudit(
                consent.getId(),
                GovernanceAudit.ResourceType.USER_DATA,
                userId,
                "EthicalAIGovernanceService",
                "User consent " + (consentGiven ? "given" : "denied") + " for " + consentType,
                policiesApplied,
                "No previous consent record",
                "Consent " + (consentGiven ? "granted" : "denied"),
                consentGiven ? GovernanceAudit.DecisionOutcome.APPROVED : GovernanceAudit.DecisionOutcome.REJECTED,
                "User explicitly " + (consentGiven ? "granted" : "denied") + " consent",
                false);
        
        return consent;
    }

    /**
     * Get pending human reviews
     *
     * @return List of audit records that require human review
     */
    public List<GovernanceAudit> getPendingHumanReviews() {
        return auditService.getAuditsPendingHumanReview();
    }

    /**
     * Complete human review
     *
     * @param auditId The audit ID
     * @param reviewerId The reviewer ID
     * @param reviewNotes The review notes
     * @return The updated audit record
     */
    @Transactional
    public GovernanceAudit completeHumanReview(String auditId, String reviewerId, String reviewNotes) {
        return auditService.completeHumanReview(auditId, reviewerId, reviewNotes);
    }

    /**
     * Get transparency records for user
     *
     * @param userId The user ID
     * @return List of transparency records for the user
     */
    public List<TransparencyRecord> getTransparencyRecordsForUser(String userId) {
        return transparencyService.getRecordsByUserId(userId);
    }

    /**
     * Get unnotified transparency records for user
     *
     * @param userId The user ID
     * @return List of unnotified transparency records for the user
     */
    public List<TransparencyRecord> getUnnotifiedTransparencyRecordsForUser(String userId) {
        return transparencyService.getUnnotifiedRecordsByUserId(userId);
    }

    /**
     * Mark transparency record as notified
     *
     * @param recordId The record ID
     * @return The updated record
     */
    @Transactional
    public TransparencyRecord markTransparencyRecordAsNotified(String recordId) {
        return transparencyService.markAsNotified(recordId);
    }

    /**
     * Apply content modification based on threshold (placeholder implementation)
     *
     * @param content The content to modify
     * @param threshold The threshold that triggered the modification
     * @return The modified content
     */
    private String applyContentModification(String content, SafetyThreshold threshold) {
        // This is a placeholder implementation
        // In a real implementation, this would use more sophisticated techniques
        
        // Simple approach: Add a disclaimer at the beginning
        return "[NOTICE: This content has been modified in accordance with our content policies] " + content;
    }
}
