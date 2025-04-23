package ai.lumina.governance.service;

import ai.lumina.governance.model.GovernancePolicy;
import ai.lumina.governance.repository.GovernancePolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Service for governance policy operations
 */
@Service
public class GovernancePolicyService {

    private final GovernancePolicyRepository governancePolicyRepository;

    @Autowired
    public GovernancePolicyService(GovernancePolicyRepository governancePolicyRepository) {
        this.governancePolicyRepository = governancePolicyRepository;
    }

    /**
     * Create a new governance policy
     *
     * @param policy The policy to create
     * @return The created policy
     */
    @Transactional
    public GovernancePolicy createPolicy(GovernancePolicy policy) {
        if (policy.getId() == null) {
            policy.setId(UUID.randomUUID().toString());
        }
        
        LocalDateTime now = LocalDateTime.now();
        policy.setCreatedAt(now);
        policy.setUpdatedAt(now);
        
        return governancePolicyRepository.save(policy);
    }

    /**
     * Get a policy by ID
     *
     * @param id The policy ID
     * @return The policy if found
     * @throws RuntimeException if policy not found
     */
    public GovernancePolicy getPolicy(String id) {
        return governancePolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with ID: " + id));
    }

    /**
     * Get a policy by ID if it exists
     *
     * @param id The policy ID
     * @return Optional containing the policy if found
     */
    public Optional<GovernancePolicy> getPolicyIfExists(String id) {
        return governancePolicyRepository.findById(id);
    }

    /**
     * Get all policies
     *
     * @return List of all policies
     */
    public List<GovernancePolicy> getAllPolicies() {
        return governancePolicyRepository.findAll();
    }

    /**
     * Get policies by type
     *
     * @param type The policy type
     * @return List of policies of the specified type
     */
    public List<GovernancePolicy> getPoliciesByType(GovernancePolicy.PolicyType type) {
        return governancePolicyRepository.findByType(type);
    }

    /**
     * Get policies by scope
     *
     * @param scope The policy scope
     * @return List of policies with the specified scope
     */
    public List<GovernancePolicy> getPoliciesByScope(GovernancePolicy.PolicyScope scope) {
        return governancePolicyRepository.findByScope(scope);
    }

    /**
     * Get enabled policies
     *
     * @return List of enabled policies
     */
    public List<GovernancePolicy> getEnabledPolicies() {
        return governancePolicyRepository.findByEnabledTrue();
    }

    /**
     * Get enabled policies by type
     *
     * @param type The policy type
     * @return List of enabled policies of the specified type
     */
    public List<GovernancePolicy> getEnabledPoliciesByType(GovernancePolicy.PolicyType type) {
        return governancePolicyRepository.findByTypeAndEnabledTrue(type);
    }

    /**
     * Get enabled policies by scope
     *
     * @param scope The policy scope
     * @return List of enabled policies with the specified scope
     */
    public List<GovernancePolicy> getEnabledPoliciesByScope(GovernancePolicy.PolicyScope scope) {
        return governancePolicyRepository.findByScopeAndEnabledTrue(scope);
    }

    /**
     * Get policies by applicable region
     *
     * @param region The region
     * @return List of policies applicable to the specified region
     */
    public List<GovernancePolicy> getPoliciesByRegion(GovernancePolicy.Region region) {
        return governancePolicyRepository.findByApplicableRegion(region);
    }

    /**
     * Get enabled policies by applicable region
     *
     * @param region The region
     * @return List of enabled policies applicable to the specified region
     */
    public List<GovernancePolicy> getEnabledPoliciesByRegion(GovernancePolicy.Region region) {
        return governancePolicyRepository.findByApplicableRegionAndEnabledTrue(region);
    }

    /**
     * Get policies by type and scope
     *
     * @param type The policy type
     * @param scope The policy scope
     * @return List of policies with the specified type and scope
     */
    public List<GovernancePolicy> getPoliciesByTypeAndScope(
            GovernancePolicy.PolicyType type, 
            GovernancePolicy.PolicyScope scope) {
        return governancePolicyRepository.findByTypeAndScope(type, scope);
    }

    /**
     * Get enabled policies by type and scope
     *
     * @param type The policy type
     * @param scope The policy scope
     * @return List of enabled policies with the specified type and scope
     */
    public List<GovernancePolicy> getEnabledPoliciesByTypeAndScope(
            GovernancePolicy.PolicyType type, 
            GovernancePolicy.PolicyScope scope) {
        return governancePolicyRepository.findByTypeAndScopeAndEnabledTrue(type, scope);
    }

    /**
     * Get policies by type and applicable region
     *
     * @param type The policy type
     * @param region The region
     * @return List of policies with the specified type applicable to the specified region
     */
    public List<GovernancePolicy> getPoliciesByTypeAndRegion(
            GovernancePolicy.PolicyType type, 
            GovernancePolicy.Region region) {
        return governancePolicyRepository.findByTypeAndApplicableRegion(type, region);
    }

    /**
     * Get enabled policies by type and applicable region
     *
     * @param type The policy type
     * @param region The region
     * @return List of enabled policies with the specified type applicable to the specified region
     */
    public List<GovernancePolicy> getEnabledPoliciesByTypeAndRegion(
            GovernancePolicy.PolicyType type, 
            GovernancePolicy.Region region) {
        return governancePolicyRepository.findByTypeAndApplicableRegionAndEnabledTrue(type, region);
    }

    /**
     * Get policies ordered by priority (highest first)
     *
     * @return List of policies ordered by priority
     */
    public List<GovernancePolicy> getPoliciesOrderedByPriority() {
        return governancePolicyRepository.findAllByOrderByPriorityDesc();
    }

    /**
     * Get enabled policies ordered by priority (highest first)
     *
     * @return List of enabled policies ordered by priority
     */
    public List<GovernancePolicy> getEnabledPoliciesOrderedByPriority() {
        return governancePolicyRepository.findByEnabledTrueOrderByPriorityDesc();
    }

    /**
     * Update a policy
     *
     * @param id The policy ID
     * @param updatedPolicy The updated policy data
     * @return The updated policy
     * @throws RuntimeException if policy not found
     */
    @Transactional
    public GovernancePolicy updatePolicy(String id, GovernancePolicy updatedPolicy) {
        GovernancePolicy existingPolicy = getPolicy(id);
        
        // Update fields
        existingPolicy.setName(updatedPolicy.getName());
        existingPolicy.setDescription(updatedPolicy.getDescription());
        existingPolicy.setType(updatedPolicy.getType());
        existingPolicy.setScope(updatedPolicy.getScope());
        existingPolicy.setApplicableRegions(updatedPolicy.getApplicableRegions());
        existingPolicy.setEnabled(updatedPolicy.isEnabled());
        existingPolicy.setPriority(updatedPolicy.getPriority());
        existingPolicy.setPolicyDefinition(updatedPolicy.getPolicyDefinition());
        existingPolicy.setEnforcementRules(updatedPolicy.getEnforcementRules());
        existingPolicy.setUpdatedAt(LocalDateTime.now());
        existingPolicy.setUpdatedBy(updatedPolicy.getUpdatedBy());
        
        return governancePolicyRepository.save(existingPolicy);
    }

    /**
     * Update policy status
     *
     * @param id The policy ID
     * @param enabled The new status
     * @param updatedBy The user making the update
     * @return The updated policy
     * @throws RuntimeException if policy not found
     */
    @Transactional
    public GovernancePolicy updatePolicyStatus(String id, boolean enabled, String updatedBy) {
        GovernancePolicy policy = getPolicy(id);
        
        policy.setEnabled(enabled);
        policy.setUpdatedAt(LocalDateTime.now());
        policy.setUpdatedBy(updatedBy);
        
        return governancePolicyRepository.save(policy);
    }

    /**
     * Update policy priority
     *
     * @param id The policy ID
     * @param priority The new priority
     * @param updatedBy The user making the update
     * @return The updated policy
     * @throws RuntimeException if policy not found
     */
    @Transactional
    public GovernancePolicy updatePolicyPriority(String id, int priority, String updatedBy) {
        GovernancePolicy policy = getPolicy(id);
        
        policy.setPriority(priority);
        policy.setUpdatedAt(LocalDateTime.now());
        policy.setUpdatedBy(updatedBy);
        
        return governancePolicyRepository.save(policy);
    }

    /**
     * Add applicable region to policy
     *
     * @param id The policy ID
     * @param region The region to add
     * @param updatedBy The user making the update
     * @return The updated policy
     * @throws RuntimeException if policy not found
     */
    @Transactional
    public GovernancePolicy addApplicableRegion(String id, GovernancePolicy.Region region, String updatedBy) {
        GovernancePolicy policy = getPolicy(id);
        
        policy.addApplicableRegion(region);
        policy.setUpdatedAt(LocalDateTime.now());
        policy.setUpdatedBy(updatedBy);
        
        return governancePolicyRepository.save(policy);
    }

    /**
     * Remove applicable region from policy
     *
     * @param id The policy ID
     * @param region The region to remove
     * @param updatedBy The user making the update
     * @return The updated policy
     * @throws RuntimeException if policy not found
     */
    @Transactional
    public GovernancePolicy removeApplicableRegion(String id, GovernancePolicy.Region region, String updatedBy) {
        GovernancePolicy policy = getPolicy(id);
        
        Set<GovernancePolicy.Region> regions = policy.getApplicableRegions();
        regions.remove(region);
        policy.setApplicableRegions(regions);
        policy.setUpdatedAt(LocalDateTime.now());
        policy.setUpdatedBy(updatedBy);
        
        return governancePolicyRepository.save(policy);
    }

    /**
     * Delete a policy
     *
     * @param id The policy ID
     * @throws RuntimeException if policy not found
     */
    @Transactional
    public void deletePolicy(String id) {
        if (!governancePolicyRepository.existsById(id)) {
            throw new RuntimeException("Policy not found with ID: " + id);
        }
        
        governancePolicyRepository.deleteById(id);
    }

    /**
     * Search policies by name
     *
     * @param name The name to search for
     * @return List of policies with names containing the specified string
     */
    public List<GovernancePolicy> searchPoliciesByName(String name) {
        return governancePolicyRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Get policies by creator
     *
     * @param createdBy The creator
     * @return List of policies created by the specified user
     */
    public List<GovernancePolicy> getPoliciesByCreator(String createdBy) {
        return governancePolicyRepository.findByCreatedBy(createdBy);
    }
}
