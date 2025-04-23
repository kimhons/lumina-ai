package ai.lumina.governance.service;

import ai.lumina.governance.model.SafetyThreshold;
import ai.lumina.governance.model.GovernancePolicy;
import ai.lumina.governance.repository.SafetyThresholdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Service for safety threshold operations
 */
@Service
public class SafetyThresholdService {

    private final SafetyThresholdRepository safetyThresholdRepository;

    @Autowired
    public SafetyThresholdService(SafetyThresholdRepository safetyThresholdRepository) {
        this.safetyThresholdRepository = safetyThresholdRepository;
    }

    /**
     * Create a new safety threshold
     *
     * @param threshold The threshold to create
     * @return The created threshold
     */
    @Transactional
    public SafetyThreshold createThreshold(SafetyThreshold threshold) {
        if (threshold.getId() == null) {
            threshold.setId(UUID.randomUUID().toString());
        }
        
        LocalDateTime now = LocalDateTime.now();
        threshold.setCreatedAt(now);
        threshold.setUpdatedAt(now);
        
        return safetyThresholdRepository.save(threshold);
    }

    /**
     * Get a threshold by ID
     *
     * @param id The threshold ID
     * @return The threshold if found
     * @throws RuntimeException if threshold not found
     */
    public SafetyThreshold getThreshold(String id) {
        return safetyThresholdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Safety threshold not found with ID: " + id));
    }

    /**
     * Get a threshold by ID if it exists
     *
     * @param id The threshold ID
     * @return Optional containing the threshold if found
     */
    public Optional<SafetyThreshold> getThresholdIfExists(String id) {
        return safetyThresholdRepository.findById(id);
    }

    /**
     * Get all thresholds
     *
     * @return List of all thresholds
     */
    public List<SafetyThreshold> getAllThresholds() {
        return safetyThresholdRepository.findAll();
    }

    /**
     * Get thresholds by category
     *
     * @param category The threshold category
     * @return List of thresholds of the specified category
     */
    public List<SafetyThreshold> getThresholdsByCategory(SafetyThreshold.ThresholdCategory category) {
        return safetyThresholdRepository.findByCategory(category);
    }

    /**
     * Get enabled thresholds
     *
     * @return List of enabled thresholds
     */
    public List<SafetyThreshold> getEnabledThresholds() {
        return safetyThresholdRepository.findByEnabledTrue();
    }

    /**
     * Get enabled thresholds by category
     *
     * @param category The threshold category
     * @return List of enabled thresholds of the specified category
     */
    public List<SafetyThreshold> getEnabledThresholdsByCategory(SafetyThreshold.ThresholdCategory category) {
        return safetyThresholdRepository.findByCategoryAndEnabledTrue(category);
    }

    /**
     * Get thresholds by action type
     *
     * @param actionType The action type
     * @return List of thresholds with the specified action type
     */
    public List<SafetyThreshold> getThresholdsByActionType(SafetyThreshold.ActionType actionType) {
        return safetyThresholdRepository.findByActionOnThresholdExceeded(actionType);
    }

    /**
     * Get enabled thresholds by action type
     *
     * @param actionType The action type
     * @return List of enabled thresholds with the specified action type
     */
    public List<SafetyThreshold> getEnabledThresholdsByActionType(SafetyThreshold.ActionType actionType) {
        return safetyThresholdRepository.findByActionOnThresholdExceededAndEnabledTrue(actionType);
    }

    /**
     * Get thresholds by applicable region
     *
     * @param region The region
     * @return List of thresholds applicable to the specified region
     */
    public List<SafetyThreshold> getThresholdsByRegion(GovernancePolicy.Region region) {
        return safetyThresholdRepository.findByApplicableRegion(region);
    }

    /**
     * Get enabled thresholds by applicable region
     *
     * @param region The region
     * @return List of enabled thresholds applicable to the specified region
     */
    public List<SafetyThreshold> getEnabledThresholdsByRegion(GovernancePolicy.Region region) {
        return safetyThresholdRepository.findByApplicableRegionAndEnabledTrue(region);
    }

    /**
     * Get thresholds by dimension
     *
     * @param dimension The dimension
     * @return List of thresholds with the specified dimension
     */
    public List<SafetyThreshold> getThresholdsByDimension(String dimension) {
        return safetyThresholdRepository.findByDimension(dimension);
    }

    /**
     * Get thresholds by dimension with value above threshold
     *
     * @param dimension The dimension
     * @param value The threshold value
     * @return List of thresholds with the specified dimension and value above threshold
     */
    public List<SafetyThreshold> getThresholdsByDimensionAndValueAbove(String dimension, double value) {
        return safetyThresholdRepository.findByDimensionAndValueGreaterThan(dimension, value);
    }

    /**
     * Get thresholds ordered by priority (highest first)
     *
     * @return List of thresholds ordered by priority
     */
    public List<SafetyThreshold> getThresholdsOrderedByPriority() {
        return safetyThresholdRepository.findAllByOrderByPriorityDesc();
    }

    /**
     * Get enabled thresholds ordered by priority (highest first)
     *
     * @return List of enabled thresholds ordered by priority
     */
    public List<SafetyThreshold> getEnabledThresholdsOrderedByPriority() {
        return safetyThresholdRepository.findByEnabledTrueOrderByPriorityDesc();
    }

    /**
     * Update a threshold
     *
     * @param id The threshold ID
     * @param updatedThreshold The updated threshold data
     * @return The updated threshold
     * @throws RuntimeException if threshold not found
     */
    @Transactional
    public SafetyThreshold updateThreshold(String id, SafetyThreshold updatedThreshold) {
        SafetyThreshold existingThreshold = getThreshold(id);
        
        // Update fields
        existingThreshold.setName(updatedThreshold.getName());
        existingThreshold.setDescription(updatedThreshold.getDescription());
        existingThreshold.setCategory(updatedThreshold.getCategory());
        existingThreshold.setThresholdScores(updatedThreshold.getThresholdScores());
        existingThreshold.setEnabled(updatedThreshold.isEnabled());
        existingThreshold.setPriority(updatedThreshold.getPriority());
        existingThreshold.setActionOnThresholdExceeded(updatedThreshold.getActionOnThresholdExceeded());
        existingThreshold.setWarningMessage(updatedThreshold.getWarningMessage());
        existingThreshold.setApplicableRegions(updatedThreshold.getApplicableRegions());
        existingThreshold.setUpdatedAt(LocalDateTime.now());
        existingThreshold.setUpdatedBy(updatedThreshold.getUpdatedBy());
        
        return safetyThresholdRepository.save(existingThreshold);
    }

    /**
     * Update threshold status
     *
     * @param id The threshold ID
     * @param enabled The new status
     * @param updatedBy The user making the update
     * @return The updated threshold
     * @throws RuntimeException if threshold not found
     */
    @Transactional
    public SafetyThreshold updateThresholdStatus(String id, boolean enabled, String updatedBy) {
        SafetyThreshold threshold = getThreshold(id);
        
        threshold.setEnabled(enabled);
        threshold.setUpdatedAt(LocalDateTime.now());
        threshold.setUpdatedBy(updatedBy);
        
        return safetyThresholdRepository.save(threshold);
    }

    /**
     * Update threshold priority
     *
     * @param id The threshold ID
     * @param priority The new priority
     * @param updatedBy The user making the update
     * @return The updated threshold
     * @throws RuntimeException if threshold not found
     */
    @Transactional
    public SafetyThreshold updateThresholdPriority(String id, int priority, String updatedBy) {
        SafetyThreshold threshold = getThreshold(id);
        
        threshold.setPriority(priority);
        threshold.setUpdatedAt(LocalDateTime.now());
        threshold.setUpdatedBy(updatedBy);
        
        return safetyThresholdRepository.save(threshold);
    }

    /**
     * Update threshold action type
     *
     * @param id The threshold ID
     * @param actionType The new action type
     * @param updatedBy The user making the update
     * @return The updated threshold
     * @throws RuntimeException if threshold not found
     */
    @Transactional
    public SafetyThreshold updateThresholdActionType(
            String id, 
            SafetyThreshold.ActionType actionType, 
            String updatedBy) {
        
        SafetyThreshold threshold = getThreshold(id);
        
        threshold.setActionOnThresholdExceeded(actionType);
        threshold.setUpdatedAt(LocalDateTime.now());
        threshold.setUpdatedBy(updatedBy);
        
        return safetyThresholdRepository.save(threshold);
    }

    /**
     * Add threshold score
     *
     * @param id The threshold ID
     * @param dimension The dimension
     * @param value The threshold value
     * @param updatedBy The user making the update
     * @return The updated threshold
     * @throws RuntimeException if threshold not found
     */
    @Transactional
    public SafetyThreshold addThresholdScore(String id, String dimension, Double value, String updatedBy) {
        SafetyThreshold threshold = getThreshold(id);
        
        threshold.addThresholdScore(dimension, value);
        threshold.setUpdatedAt(LocalDateTime.now());
        threshold.setUpdatedBy(updatedBy);
        
        return safetyThresholdRepository.save(threshold);
    }

    /**
     * Add applicable region to threshold
     *
     * @param id The threshold ID
     * @param region The region to add
     * @param updatedBy The user making the update
     * @return The updated threshold
     * @throws RuntimeException if threshold not found
     */
    @Transactional
    public SafetyThreshold addApplicableRegion(String id, GovernancePolicy.Region region, String updatedBy) {
        SafetyThreshold threshold = getThreshold(id);
        
        threshold.addApplicableRegion(region);
        threshold.setUpdatedAt(LocalDateTime.now());
        threshold.setUpdatedBy(updatedBy);
        
        return safetyThresholdRepository.save(threshold);
    }

    /**
     * Delete a threshold
     *
     * @param id The threshold ID
     * @throws RuntimeException if threshold not found
     */
    @Transactional
    public void deleteThreshold(String id) {
        if (!safetyThresholdRepository.existsById(id)) {
            throw new RuntimeException("Safety threshold not found with ID: " + id);
        }
        
        safetyThresholdRepository.deleteById(id);
    }

    /**
     * Search thresholds by name
     *
     * @param name The name to search for
     * @return List of thresholds with names containing the specified string
     */
    public List<SafetyThreshold> searchThresholdsByName(String name) {
        return safetyThresholdRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Check if content exceeds any safety thresholds
     *
     * @param contentScores Map of dimension to score values
     * @param region The region to check thresholds for
     * @return Map of threshold IDs to their action types for thresholds that were exceeded
     */
    public Map<String, SafetyThreshold.ActionType> checkContentAgainstThresholds(
            Map<String, Double> contentScores, 
            GovernancePolicy.Region region) {
        
        List<SafetyThreshold> thresholds = getEnabledThresholdsByRegion(region);
        Map<String, SafetyThreshold.ActionType> exceededThresholds = new java.util.HashMap<>();
        
        for (SafetyThreshold threshold : thresholds) {
            Map<String, Double> thresholdScores = threshold.getThresholdScores();
            
            for (Map.Entry<String, Double> entry : thresholdScores.entrySet()) {
                String dimension = entry.getKey();
                Double thresholdValue = entry.getValue();
                
                if (contentScores.containsKey(dimension)) {
                    Double contentScore = contentScores.get(dimension);
                    
                    // If content score exceeds threshold value
                    if (contentScore > thresholdValue) {
                        exceededThresholds.put(threshold.getId(), threshold.getActionOnThresholdExceeded());
                        break; // Move to next threshold once one dimension exceeds
                    }
                }
            }
        }
        
        return exceededThresholds;
    }
}
