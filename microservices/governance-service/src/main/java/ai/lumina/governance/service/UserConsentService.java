package ai.lumina.governance.service;

import ai.lumina.governance.model.UserConsent;
import ai.lumina.governance.model.GovernancePolicy;
import ai.lumina.governance.repository.UserConsentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for user consent operations
 */
@Service
public class UserConsentService {

    private final UserConsentRepository userConsentRepository;

    @Autowired
    public UserConsentService(UserConsentRepository userConsentRepository) {
        this.userConsentRepository = userConsentRepository;
    }

    /**
     * Create a new user consent record
     *
     * @param consent The consent record to create
     * @return The created consent record
     */
    @Transactional
    public UserConsent createConsent(UserConsent consent) {
        if (consent.getId() == null) {
            consent.setId(UUID.randomUUID().toString());
        }
        
        consent.setConsentTimestamp(LocalDateTime.now());
        
        return userConsentRepository.save(consent);
    }

    /**
     * Get a consent record by ID
     *
     * @param id The consent record ID
     * @return The consent record if found
     * @throws RuntimeException if consent record not found
     */
    public UserConsent getConsent(String id) {
        return userConsentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User consent not found with ID: " + id));
    }

    /**
     * Get a consent record by ID if it exists
     *
     * @param id The consent record ID
     * @return Optional containing the consent record if found
     */
    public Optional<UserConsent> getConsentIfExists(String id) {
        return userConsentRepository.findById(id);
    }

    /**
     * Get all consent records
     *
     * @return List of all consent records
     */
    public List<UserConsent> getAllConsents() {
        return userConsentRepository.findAll();
    }

    /**
     * Get consent records by user ID
     *
     * @param userId The user ID
     * @return List of consent records for the specified user
     */
    public List<UserConsent> getConsentsByUserId(String userId) {
        return userConsentRepository.findByUserId(userId);
    }

    /**
     * Get consent records by consent type
     *
     * @param consentType The consent type
     * @return List of consent records of the specified type
     */
    public List<UserConsent> getConsentsByType(UserConsent.ConsentType consentType) {
        return userConsentRepository.findByConsentType(consentType);
    }

    /**
     * Get consent records by consent status
     *
     * @param consentGiven The consent status
     * @return List of consent records with the specified status
     */
    public List<UserConsent> getConsentsByStatus(boolean consentGiven) {
        return userConsentRepository.findByConsentGiven(consentGiven);
    }

    /**
     * Get consent records by region
     *
     * @param region The region
     * @return List of consent records for the specified region
     */
    public List<UserConsent> getConsentsByRegion(GovernancePolicy.Region region) {
        return userConsentRepository.findByRegion(region);
    }

    /**
     * Get latest consent record by user ID and consent type
     *
     * @param userId The user ID
     * @param consentType The consent type
     * @return Optional containing the latest consent record if found
     */
    public Optional<UserConsent> getLatestConsentByUserIdAndType(String userId, UserConsent.ConsentType consentType) {
        return userConsentRepository.findLatestConsentByUserIdAndType(userId, consentType);
    }

    /**
     * Check if user has given consent for a specific type
     *
     * @param userId The user ID
     * @param consentType The consent type
     * @return true if user has given consent, false otherwise
     */
    public boolean hasUserGivenConsent(String userId, UserConsent.ConsentType consentType) {
        Optional<UserConsent> latestConsent = getLatestConsentByUserIdAndType(userId, consentType);
        
        return latestConsent.isPresent() && 
               latestConsent.get().isConsentGiven() && 
               (latestConsent.get().getExpiryTimestamp() == null || 
                latestConsent.get().getExpiryTimestamp().isAfter(LocalDateTime.now())) &&
               latestConsent.get().getRevokedTimestamp() == null;
    }

    /**
     * Check if user has given consent for a specific data category
     *
     * @param userId The user ID
     * @param consentType The consent type
     * @param dataCategory The data category
     * @return true if user has given consent for the data category, false otherwise
     */
    public boolean hasUserGivenConsentForDataCategory(
            String userId, 
            UserConsent.ConsentType consentType, 
            String dataCategory) {
        
        Optional<UserConsent> latestConsent = getLatestConsentByUserIdAndType(userId, consentType);
        
        if (latestConsent.isPresent() && 
            latestConsent.get().isConsentGiven() && 
            (latestConsent.get().getExpiryTimestamp() == null || 
             latestConsent.get().getExpiryTimestamp().isAfter(LocalDateTime.now())) &&
            latestConsent.get().getRevokedTimestamp() == null) {
            
            Map<String, Boolean> dataCategories = latestConsent.get().getDataCategories();
            return dataCategories.containsKey(dataCategory) && dataCategories.get(dataCategory);
        }
        
        return false;
    }

    /**
     * Update a consent record
     *
     * @param id The consent record ID
     * @param updatedConsent The updated consent record data
     * @return The updated consent record
     * @throws RuntimeException if consent record not found
     */
    @Transactional
    public UserConsent updateConsent(String id, UserConsent updatedConsent) {
        UserConsent existingConsent = getConsent(id);
        
        // Update fields
        existingConsent.setConsentGiven(updatedConsent.isConsentGiven());
        existingConsent.setConsentDetails(updatedConsent.getConsentDetails());
        existingConsent.setDataCategories(updatedConsent.getDataCategories());
        existingConsent.setExpiryTimestamp(updatedConsent.getExpiryTimestamp());
        
        return userConsentRepository.save(existingConsent);
    }

    /**
     * Revoke a consent record
     *
     * @param id The consent record ID
     * @return The updated consent record
     * @throws RuntimeException if consent record not found
     */
    @Transactional
    public UserConsent revokeConsent(String id) {
        UserConsent consent = getConsent(id);
        
        consent.setConsentGiven(false);
        consent.setRevokedTimestamp(LocalDateTime.now());
        
        return userConsentRepository.save(consent);
    }

    /**
     * Add data category to consent record
     *
     * @param id The consent record ID
     * @param category The data category
     * @param isAllowed Whether the category is allowed
     * @return The updated consent record
     * @throws RuntimeException if consent record not found
     */
    @Transactional
    public UserConsent addDataCategory(String id, String category, boolean isAllowed) {
        UserConsent consent = getConsent(id);
        
        consent.addDataCategory(category, isAllowed);
        
        return userConsentRepository.save(consent);
    }

    /**
     * Delete a consent record
     *
     * @param id The consent record ID
     * @throws RuntimeException if consent record not found
     */
    @Transactional
    public void deleteConsent(String id) {
        if (!userConsentRepository.existsById(id)) {
            throw new RuntimeException("User consent not found with ID: " + id);
        }
        
        userConsentRepository.deleteById(id);
    }

    /**
     * Count consent records by type and status
     *
     * @param consentType The consent type
     * @param consentGiven The consent status
     * @return Count of consent records with the specified type and status
     */
    public long countConsentsByTypeAndStatus(UserConsent.ConsentType consentType, boolean consentGiven) {
        return userConsentRepository.countByConsentTypeAndConsentGiven(consentType, consentGiven);
    }

    /**
     * Get recent consent records
     *
     * @param limit The maximum number of consent records to return
     * @return List of recent consent records
     */
    public List<UserConsent> getRecentConsents(int limit) {
        return userConsentRepository.findRecentConsents(limit);
    }

    /**
     * Record user consent
     *
     * @param userId The user ID
     * @param consentType The consent type
     * @param consentGiven Whether consent is given
     * @param consentDetails The consent details
     * @param dataCategories The data categories
     * @param ipAddress The IP address
     * @param userAgent The user agent
     * @param region The region
     * @param expiryTimestamp The expiry timestamp
     * @param consentVersion The consent version
     * @param consentText The consent text
     * @return The created consent record
     */
    @Transactional
    public UserConsent recordConsent(
            String userId,
            UserConsent.ConsentType consentType,
            boolean consentGiven,
            String consentDetails,
            Map<String, Boolean> dataCategories,
            String ipAddress,
            String userAgent,
            GovernancePolicy.Region region,
            LocalDateTime expiryTimestamp,
            String consentVersion,
            String consentText) {
        
        UserConsent consent = new UserConsent();
        consent.setId(UUID.randomUUID().toString());
        consent.setUserId(userId);
        consent.setConsentType(consentType);
        consent.setConsentGiven(consentGiven);
        consent.setConsentDetails(consentDetails);
        consent.setDataCategories(dataCategories);
        consent.setIpAddress(ipAddress);
        consent.setUserAgent(userAgent);
        consent.setRegion(region);
        consent.setConsentTimestamp(LocalDateTime.now());
        consent.setExpiryTimestamp(expiryTimestamp);
        consent.setConsentVersion(consentVersion);
        consent.setConsentText(consentText);
        
        return userConsentRepository.save(consent);
    }
}
