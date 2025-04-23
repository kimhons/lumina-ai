package ai.lumina.governance.service;

import ai.lumina.governance.model.ContentEvaluation;
import ai.lumina.governance.repository.ContentEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for content evaluation operations
 */
@Service
public class ContentEvaluationService {

    private final ContentEvaluationRepository contentEvaluationRepository;

    @Autowired
    public ContentEvaluationService(ContentEvaluationRepository contentEvaluationRepository) {
        this.contentEvaluationRepository = contentEvaluationRepository;
    }

    /**
     * Create a new content evaluation
     *
     * @param evaluation The evaluation to create
     * @return The created evaluation
     */
    @Transactional
    public ContentEvaluation createEvaluation(ContentEvaluation evaluation) {
        if (evaluation.getId() == null) {
            evaluation.setId(UUID.randomUUID().toString());
        }
        
        evaluation.setCreatedAt(LocalDateTime.now());
        
        return contentEvaluationRepository.save(evaluation);
    }

    /**
     * Get an evaluation by ID
     *
     * @param id The evaluation ID
     * @return The evaluation if found
     * @throws RuntimeException if evaluation not found
     */
    public ContentEvaluation getEvaluation(String id) {
        return contentEvaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content evaluation not found with ID: " + id));
    }

    /**
     * Get an evaluation by ID if it exists
     *
     * @param id The evaluation ID
     * @return Optional containing the evaluation if found
     */
    public Optional<ContentEvaluation> getEvaluationIfExists(String id) {
        return contentEvaluationRepository.findById(id);
    }

    /**
     * Get all evaluations
     *
     * @return List of all evaluations
     */
    public List<ContentEvaluation> getAllEvaluations() {
        return contentEvaluationRepository.findAll();
    }

    /**
     * Get evaluations by content type
     *
     * @param contentType The content type
     * @return List of evaluations for the specified content type
     */
    public List<ContentEvaluation> getEvaluationsByContentType(ContentEvaluation.ContentType contentType) {
        return contentEvaluationRepository.findByContentType(contentType);
    }

    /**
     * Get evaluations by result
     *
     * @param result The evaluation result
     * @return List of evaluations with the specified result
     */
    public List<ContentEvaluation> getEvaluationsByResult(ContentEvaluation.EvaluationResult result) {
        return contentEvaluationRepository.findByResult(result);
    }

    /**
     * Get evaluations by request ID
     *
     * @param requestId The request ID
     * @return List of evaluations for the specified request
     */
    public List<ContentEvaluation> getEvaluationsByRequestId(String requestId) {
        return contentEvaluationRepository.findByRequestId(requestId);
    }

    /**
     * Get evaluations by user ID
     *
     * @param userId The user ID
     * @return List of evaluations for the specified user
     */
    public List<ContentEvaluation> getEvaluationsByUserId(String userId) {
        return contentEvaluationRepository.findByUserId(userId);
    }

    /**
     * Get evaluations by model ID
     *
     * @param modelId The model ID
     * @return List of evaluations for the specified model
     */
    public List<ContentEvaluation> getEvaluationsByModelId(String modelId) {
        return contentEvaluationRepository.findByModelId(modelId);
    }

    /**
     * Get evaluations by provider ID
     *
     * @param providerId The provider ID
     * @return List of evaluations for the specified provider
     */
    public List<ContentEvaluation> getEvaluationsByProviderId(String providerId) {
        return contentEvaluationRepository.findByProviderId(providerId);
    }

    /**
     * Get evaluations created after a specific date
     *
     * @param date The date to filter by
     * @return List of evaluations created after the specified date
     */
    public List<ContentEvaluation> getEvaluationsCreatedAfter(LocalDateTime date) {
        return contentEvaluationRepository.findByCreatedAtAfter(date);
    }

    /**
     * Get evaluations with safety score below threshold
     *
     * @param threshold The safety score threshold
     * @return List of evaluations with safety score below the specified threshold
     */
    public List<ContentEvaluation> getEvaluationsWithSafetyScoreBelow(double threshold) {
        return contentEvaluationRepository.findBySafetyScoreLessThan(threshold);
    }

    /**
     * Get evaluations with privacy score below threshold
     *
     * @param threshold The privacy score threshold
     * @return List of evaluations with privacy score below the specified threshold
     */
    public List<ContentEvaluation> getEvaluationsWithPrivacyScoreBelow(double threshold) {
        return contentEvaluationRepository.findByPrivacyScoreLessThan(threshold);
    }

    /**
     * Get evaluations with transparency score below threshold
     *
     * @param threshold The transparency score threshold
     * @return List of evaluations with transparency score below the specified threshold
     */
    public List<ContentEvaluation> getEvaluationsWithTransparencyScoreBelow(double threshold) {
        return contentEvaluationRepository.findByTransparencyScoreLessThan(threshold);
    }

    /**
     * Get evaluations with specific flag
     *
     * @param flagType The flag type
     * @return List of evaluations with the specified flag
     */
    public List<ContentEvaluation> getEvaluationsByFlagType(String flagType) {
        return contentEvaluationRepository.findByFlagType(flagType);
    }

    /**
     * Get evaluations with flag value above threshold
     *
     * @param flagType The flag type
     * @param threshold The threshold value
     * @return List of evaluations with the specified flag value above the threshold
     */
    public List<ContentEvaluation> getEvaluationsByFlagValueAbove(String flagType, double threshold) {
        return contentEvaluationRepository.findByFlagValueGreaterThan(flagType, threshold);
    }

    /**
     * Get recent evaluations
     *
     * @param limit The maximum number of evaluations to return
     * @return List of recent evaluations
     */
    public List<ContentEvaluation> getRecentEvaluations(int limit) {
        return contentEvaluationRepository.findRecentEvaluations(limit);
    }

    /**
     * Update an evaluation
     *
     * @param id The evaluation ID
     * @param updatedEvaluation The updated evaluation data
     * @return The updated evaluation
     * @throws RuntimeException if evaluation not found
     */
    @Transactional
    public ContentEvaluation updateEvaluation(String id, ContentEvaluation updatedEvaluation) {
        ContentEvaluation existingEvaluation = getEvaluation(id);
        
        // Update fields
        existingEvaluation.setContent(updatedEvaluation.getContent());
        existingEvaluation.setContentType(updatedEvaluation.getContentType());
        existingEvaluation.setResult(updatedEvaluation.getResult());
        existingEvaluation.setSafetyScore(updatedEvaluation.getSafetyScore());
        existingEvaluation.setPrivacyScore(updatedEvaluation.getPrivacyScore());
        existingEvaluation.setTransparencyScore(updatedEvaluation.getTransparencyScore());
        existingEvaluation.setFlags(updatedEvaluation.getFlags());
        existingEvaluation.setEvaluationDetails(updatedEvaluation.getEvaluationDetails());
        existingEvaluation.setRemediationSuggestions(updatedEvaluation.getRemediationSuggestions());
        
        return contentEvaluationRepository.save(existingEvaluation);
    }

    /**
     * Update evaluation result
     *
     * @param id The evaluation ID
     * @param result The new result
     * @return The updated evaluation
     * @throws RuntimeException if evaluation not found
     */
    @Transactional
    public ContentEvaluation updateEvaluationResult(String id, ContentEvaluation.EvaluationResult result) {
        ContentEvaluation evaluation = getEvaluation(id);
        
        evaluation.setResult(result);
        
        return contentEvaluationRepository.save(evaluation);
    }

    /**
     * Add flag to evaluation
     *
     * @param id The evaluation ID
     * @param flagType The flag type
     * @param value The flag value
     * @return The updated evaluation
     * @throws RuntimeException if evaluation not found
     */
    @Transactional
    public ContentEvaluation addFlag(String id, String flagType, Double value) {
        ContentEvaluation evaluation = getEvaluation(id);
        
        evaluation.addFlag(flagType, value);
        
        return contentEvaluationRepository.save(evaluation);
    }

    /**
     * Delete an evaluation
     *
     * @param id The evaluation ID
     * @throws RuntimeException if evaluation not found
     */
    @Transactional
    public void deleteEvaluation(String id) {
        if (!contentEvaluationRepository.existsById(id)) {
            throw new RuntimeException("Content evaluation not found with ID: " + id);
        }
        
        contentEvaluationRepository.deleteById(id);
    }

    /**
     * Count evaluations by result
     *
     * @param result The evaluation result
     * @return Count of evaluations with the specified result
     */
    public long countEvaluationsByResult(ContentEvaluation.EvaluationResult result) {
        return contentEvaluationRepository.countByResult(result);
    }

    /**
     * Calculate average safety score for a model
     *
     * @param modelId The model ID
     * @return Average safety score, or null if no evaluations exist
     */
    public Double calculateAverageSafetyScore(String modelId) {
        return contentEvaluationRepository.calculateAverageSafetyScore(modelId);
    }

    /**
     * Calculate average privacy score for a model
     *
     * @param modelId The model ID
     * @return Average privacy score, or null if no evaluations exist
     */
    public Double calculateAveragePrivacyScore(String modelId) {
        return contentEvaluationRepository.calculateAveragePrivacyScore(modelId);
    }

    /**
     * Calculate average transparency score for a model
     *
     * @param modelId The model ID
     * @return Average transparency score, or null if no evaluations exist
     */
    public Double calculateAverageTransparencyScore(String modelId) {
        return contentEvaluationRepository.calculateAverageTransparencyScore(modelId);
    }

    /**
     * Evaluate content based on safety, privacy, and transparency criteria
     *
     * @param content The content to evaluate
     * @param contentType The content type
     * @param requestId The request ID
     * @param userId The user ID
     * @param modelId The model ID
     * @param providerId The provider ID
     * @return The evaluation result
     */
    @Transactional
    public ContentEvaluation evaluateContent(
            String content,
            ContentEvaluation.ContentType contentType,
            String requestId,
            String userId,
            String modelId,
            String providerId) {
        
        ContentEvaluation evaluation = new ContentEvaluation();
        evaluation.setId(UUID.randomUUID().toString());
        evaluation.setContent(content);
        evaluation.setContentType(contentType);
        evaluation.setRequestId(requestId);
        evaluation.setUserId(userId);
        evaluation.setModelId(modelId);
        evaluation.setProviderId(providerId);
        evaluation.setCreatedAt(LocalDateTime.now());
        
        // Perform evaluation (placeholder implementation)
        // In a real implementation, this would use more sophisticated analysis
        performContentEvaluation(evaluation);
        
        return contentEvaluationRepository.save(evaluation);
    }
    
    /**
     * Perform content evaluation (placeholder implementation)
     * In a real implementation, this would use more sophisticated analysis
     *
     * @param evaluation The evaluation to perform
     */
    private void performContentEvaluation(ContentEvaluation evaluation) {
        // This is a placeholder implementation
        // In a real implementation, this would use AI models, rule engines, etc.
        
        // Simple safety check (placeholder)
        double safetyScore = calculateSafetyScore(evaluation.getContent());
        evaluation.setSafetyScore(safetyScore);
        
        // Simple privacy check (placeholder)
        double privacyScore = calculatePrivacyScore(evaluation.getContent());
        evaluation.setPrivacyScore(privacyScore);
        
        // Simple transparency check (placeholder)
        double transparencyScore = calculateTransparencyScore(evaluation.getContent());
        evaluation.setTransparencyScore(transparencyScore);
        
        // Set flags based on content analysis
        if (safetyScore < 0.7) {
            evaluation.addFlag("SAFETY_CONCERN", 1.0 - safetyScore);
        }
        
        if (privacyScore < 0.7) {
            evaluation.addFlag("PRIVACY_CONCERN", 1.0 - privacyScore);
        }
        
        if (transparencyScore < 0.7) {
            evaluation.addFlag("TRANSPARENCY_CONCERN", 1.0 - transparencyScore);
        }
        
        // Determine overall result
        if (safetyScore < 0.3 || privacyScore < 0.3 || transparencyScore < 0.3) {
            evaluation.setResult(ContentEvaluation.EvaluationResult.REJECTED);
            evaluation.setEvaluationDetails("Content rejected due to significant concerns.");
            evaluation.setRemediationSuggestions("Please review and address the flagged issues.");
        } else if (safetyScore < 0.7 || privacyScore < 0.7 || transparencyScore < 0.7) {
            evaluation.setResult(ContentEvaluation.EvaluationResult.APPROVED_WITH_WARNINGS);
            evaluation.setEvaluationDetails("Content approved with warnings.");
            evaluation.setRemediationSuggestions("Consider addressing the flagged issues in future interactions.");
        } else {
            evaluation.setResult(ContentEvaluation.EvaluationResult.APPROVED);
            evaluation.setEvaluationDetails("Content approved without concerns.");
            evaluation.setRemediationSuggestions("");
        }
    }
    
    /**
     * Calculate safety score (placeholder implementation)
     *
     * @param content The content to analyze
     * @return Safety score between 0 and 1
     */
    private double calculateSafetyScore(String content) {
        // This is a placeholder implementation
        // In a real implementation, this would use more sophisticated analysis
        
        // Simple check for potentially harmful content
        String contentLower = content.toLowerCase();
        double score = 1.0;
        
        // Check for potentially harmful keywords (very simplified example)
        String[] harmfulTerms = {"harm", "kill", "attack", "weapon", "bomb", "hack", "exploit"};
        for (String term : harmfulTerms) {
            if (contentLower.contains(term)) {
                score -= 0.2;
            }
        }
        
        return Math.max(0.0, score);
    }
    
    /**
     * Calculate privacy score (placeholder implementation)
     *
     * @param content The content to analyze
     * @return Privacy score between 0 and 1
     */
    private double calculatePrivacyScore(String content) {
        // This is a placeholder implementation
        // In a real implementation, this would use more sophisticated analysis
        
        // Simple check for potential PII
        String contentLower = content.toLowerCase();
        double score = 1.0;
        
        // Check for potential PII (very simplified example)
        String[] piiTerms = {"password", "ssn", "social security", "credit card", "address", "phone number", "email"};
        for (String term : piiTerms) {
            if (contentLower.contains(term)) {
                score -= 0.2;
            }
        }
        
        return Math.max(0.0, score);
    }
    
    /**
     * Calculate transparency score (placeholder implementation)
     *
     * @param content The content to analyze
     * @return Transparency score between 0 and 1
     */
    private double calculateTransparencyScore(String content) {
        // This is a placeholder implementation
        // In a real implementation, this would use more sophisticated analysis
        
        // Simple check for transparency
        double score = 0.8; // Start with a reasonable baseline
        
        // Adjust based on content length (very simplified example)
        // Assuming longer responses tend to be more detailed and transparent
        if (content.length() > 500) {
            score += 0.1;
        } else if (content.length() < 100) {
            score -= 0.1;
        }
        
        // Check for explanation indicators (very simplified example)
        String contentLower = content.toLowerCase();
        String[] explanationTerms = {"because", "therefore", "as a result", "explanation", "reason", "due to"};
        for (String term : explanationTerms) {
            if (contentLower.contains(term)) {
                score += 0.05;
            }
        }
        
        return Math.min(1.0, Math.max(0.0, score));
    }
}
