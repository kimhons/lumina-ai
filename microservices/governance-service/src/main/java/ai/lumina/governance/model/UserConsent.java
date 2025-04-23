package ai.lumina.governance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Represents user consent records for privacy compliance
 */
@Entity
@Table(name = "user_consent")
public class UserConsent {

    @Id
    private String id;
    
    private String userId;
    
    @Enumerated(EnumType.STRING)
    private ConsentType consentType;
    
    private boolean consentGiven;
    
    @Column(columnDefinition = "TEXT")
    private String consentDetails;
    
    @ElementCollection
    @CollectionTable(name = "consent_data_categories", joinColumns = @JoinColumn(name = "consent_id"))
    @MapKeyColumn(name = "category")
    @Column(name = "is_allowed")
    private Map<String, Boolean> dataCategories = new HashMap<>();
    
    private String ipAddress;
    
    private String userAgent;
    
    @Enumerated(EnumType.STRING)
    private GovernancePolicy.Region region;
    
    private LocalDateTime consentTimestamp;
    
    private LocalDateTime expiryTimestamp;
    
    private LocalDateTime revokedTimestamp;
    
    private String consentVersion;
    
    @Column(columnDefinition = "TEXT")
    private String consentText;
    
    /**
     * Types of user consent
     */
    public enum ConsentType {
        DATA_COLLECTION,
        DATA_PROCESSING,
        DATA_SHARING,
        MARKETING,
        COOKIES,
        TERMS_OF_SERVICE,
        PRIVACY_POLICY,
        SPECIAL_CATEGORY_DATA
    }
    
    // Getters and setters
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public ConsentType getConsentType() {
        return consentType;
    }

    public void setConsentType(ConsentType consentType) {
        this.consentType = consentType;
    }

    public boolean isConsentGiven() {
        return consentGiven;
    }

    public void setConsentGiven(boolean consentGiven) {
        this.consentGiven = consentGiven;
    }

    public String getConsentDetails() {
        return consentDetails;
    }

    public void setConsentDetails(String consentDetails) {
        this.consentDetails = consentDetails;
    }

    public Map<String, Boolean> getDataCategories() {
        return dataCategories;
    }

    public void setDataCategories(Map<String, Boolean> dataCategories) {
        this.dataCategories = dataCategories;
    }
    
    public void addDataCategory(String category, Boolean isAllowed) {
        if (this.dataCategories == null) {
            this.dataCategories = new HashMap<>();
        }
        this.dataCategories.put(category, isAllowed);
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public GovernancePolicy.Region getRegion() {
        return region;
    }

    public void setRegion(GovernancePolicy.Region region) {
        this.region = region;
    }

    public LocalDateTime getConsentTimestamp() {
        return consentTimestamp;
    }

    public void setConsentTimestamp(LocalDateTime consentTimestamp) {
        this.consentTimestamp = consentTimestamp;
    }

    public LocalDateTime getExpiryTimestamp() {
        return expiryTimestamp;
    }

    public void setExpiryTimestamp(LocalDateTime expiryTimestamp) {
        this.expiryTimestamp = expiryTimestamp;
    }

    public LocalDateTime getRevokedTimestamp() {
        return revokedTimestamp;
    }

    public void setRevokedTimestamp(LocalDateTime revokedTimestamp) {
        this.revokedTimestamp = revokedTimestamp;
    }

    public String getConsentVersion() {
        return consentVersion;
    }

    public void setConsentVersion(String consentVersion) {
        this.consentVersion = consentVersion;
    }

    public String getConsentText() {
        return consentText;
    }

    public void setConsentText(String consentText) {
        this.consentText = consentText;
    }
}
