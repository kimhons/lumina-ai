package ai.lumina.governance.service;

import ai.lumina.governance.model.TransparencyRecord;
import ai.lumina.governance.repository.TransparencyRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Service for transparency record operations
 */
@Service
public class TransparencyRecordService {

    private final TransparencyRecordRepository transparencyRecordRepository;

    @Autowired
    public TransparencyRecordService(TransparencyRecordRepository transparencyRecordRepository) {
        this.transparencyRecordRepository = transparencyRecordRepository;
    }

    /**
     * Create a new transparency record
     *
     * @param record The record to create
     * @return The created record
     */
    @Transactional
    public TransparencyRecord createRecord(TransparencyRecord record) {
        if (record.getId() == null) {
            record.setId(UUID.randomUUID().toString());
        }
        
        record.setCreatedAt(LocalDateTime.now());
        
        return transparencyRecordRepository.save(record);
    }

    /**
     * Get a record by ID
     *
     * @param id The record ID
     * @return The record if found
     * @throws RuntimeException if record not found
     */
    public TransparencyRecord getRecord(String id) {
        return transparencyRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transparency record not found with ID: " + id));
    }

    /**
     * Get a record by ID if it exists
     *
     * @param id The record ID
     * @return Optional containing the record if found
     */
    public Optional<TransparencyRecord> getRecordIfExists(String id) {
        return transparencyRecordRepository.findById(id);
    }

    /**
     * Get all records
     *
     * @return List of all records
     */
    public List<TransparencyRecord> getAllRecords() {
        return transparencyRecordRepository.findAll();
    }

    /**
     * Get records by record type
     *
     * @param recordType The record type
     * @return List of records of the specified type
     */
    public List<TransparencyRecord> getRecordsByType(TransparencyRecord.RecordType recordType) {
        return transparencyRecordRepository.findByRecordType(recordType);
    }

    /**
     * Get records by request ID
     *
     * @param requestId The request ID
     * @return List of records for the specified request
     */
    public List<TransparencyRecord> getRecordsByRequestId(String requestId) {
        return transparencyRecordRepository.findByRequestId(requestId);
    }

    /**
     * Get records by user ID
     *
     * @param userId The user ID
     * @return List of records for the specified user
     */
    public List<TransparencyRecord> getRecordsByUserId(String userId) {
        return transparencyRecordRepository.findByUserId(userId);
    }

    /**
     * Get records by model ID
     *
     * @param modelId The model ID
     * @return List of records for the specified model
     */
    public List<TransparencyRecord> getRecordsByModelId(String modelId) {
        return transparencyRecordRepository.findByModelId(modelId);
    }

    /**
     * Get records by provider ID
     *
     * @param providerId The provider ID
     * @return List of records for the specified provider
     */
    public List<TransparencyRecord> getRecordsByProviderId(String providerId) {
        return transparencyRecordRepository.findByProviderId(providerId);
    }

    /**
     * Get records by notification status
     *
     * @param userNotified The notification status
     * @return List of records with the specified notification status
     */
    public List<TransparencyRecord> getRecordsByNotificationStatus(boolean userNotified) {
        return transparencyRecordRepository.findByUserNotified(userNotified);
    }

    /**
     * Get records created after a specific date
     *
     * @param date The date to filter by
     * @return List of records created after the specified date
     */
    public List<TransparencyRecord> getRecordsCreatedAfter(LocalDateTime date) {
        return transparencyRecordRepository.findByCreatedAtAfter(date);
    }

    /**
     * Get records by policy applied
     *
     * @param policyId The policy ID
     * @return List of records where the specified policy was applied
     */
    public List<TransparencyRecord> getRecordsByPolicyApplied(String policyId) {
        return transparencyRecordRepository.findByPolicyApplied(policyId);
    }

    /**
     * Get recent records
     *
     * @param limit The maximum number of records to return
     * @return List of recent records
     */
    public List<TransparencyRecord> getRecentRecords(int limit) {
        return transparencyRecordRepository.findRecentRecords(limit);
    }

    /**
     * Get records by record type and user notified status
     *
     * @param recordType The record type
     * @param userNotified The user notified status
     * @return List of records with the specified type and notification status
     */
    public List<TransparencyRecord> getRecordsByTypeAndNotificationStatus(
            TransparencyRecord.RecordType recordType, 
            boolean userNotified) {
        return transparencyRecordRepository.findByRecordTypeAndUserNotified(recordType, userNotified);
    }

    /**
     * Get records containing specific tools
     *
     * @param toolName The tool name to search for
     * @return List of records mentioning the specified tool
     */
    public List<TransparencyRecord> getRecordsByToolUsed(String toolName) {
        return transparencyRecordRepository.findByToolsUsedContaining(toolName);
    }

    /**
     * Get records by user ID and record type
     *
     * @param userId The user ID
     * @param recordType The record type
     * @return List of records for the specified user and type
     */
    public List<TransparencyRecord> getRecordsByUserIdAndType(
            String userId, 
            TransparencyRecord.RecordType recordType) {
        return transparencyRecordRepository.findByUserIdAndRecordType(userId, recordType);
    }

    /**
     * Get records by user ID that are not notified
     *
     * @param userId The user ID
     * @return List of records for the specified user that are not notified
     */
    public List<TransparencyRecord> getUnnotifiedRecordsByUserId(String userId) {
        return transparencyRecordRepository.findByUserIdAndUserNotifiedFalse(userId);
    }

    /**
     * Update a record
     *
     * @param id The record ID
     * @param updatedRecord The updated record data
     * @return The updated record
     * @throws RuntimeException if record not found
     */
    @Transactional
    public TransparencyRecord updateRecord(String id, TransparencyRecord updatedRecord) {
        TransparencyRecord existingRecord = getRecord(id);
        
        // Update fields
        existingRecord.setExplanation(updatedRecord.getExplanation());
        existingRecord.setModelDetails(updatedRecord.getModelDetails());
        existingRecord.setDataSourcesUsed(updatedRecord.getDataSourcesUsed());
        existingRecord.setPoliciesApplied(updatedRecord.getPoliciesApplied());
        existingRecord.setLimitationsDisclosure(updatedRecord.getLimitationsDisclosure());
        existingRecord.setConfidenceInformation(updatedRecord.getConfidenceInformation());
        existingRecord.setUserNotified(updatedRecord.isUserNotified());
        existingRecord.setToolsUsed(updatedRecord.getToolsUsed());
        
        return transparencyRecordRepository.save(existingRecord);
    }

    /**
     * Mark record as notified
     *
     * @param id The record ID
     * @return The updated record
     * @throws RuntimeException if record not found
     */
    @Transactional
    public TransparencyRecord markAsNotified(String id) {
        TransparencyRecord record = getRecord(id);
        
        record.setUserNotified(true);
        
        return transparencyRecordRepository.save(record);
    }

    /**
     * Add policy applied to record
     *
     * @param id The record ID
     * @param policyId The policy ID
     * @return The updated record
     * @throws RuntimeException if record not found
     */
    @Transactional
    public TransparencyRecord addPolicyApplied(String id, String policyId) {
        TransparencyRecord record = getRecord(id);
        
        record.addPolicyApplied(policyId);
        
        return transparencyRecordRepository.save(record);
    }

    /**
     * Delete a record
     *
     * @param id The record ID
     * @throws RuntimeException if record not found
     */
    @Transactional
    public void deleteRecord(String id) {
        if (!transparencyRecordRepository.existsById(id)) {
            throw new RuntimeException("Transparency record not found with ID: " + id);
        }
        
        transparencyRecordRepository.deleteById(id);
    }

    /**
     * Count records by record type
     *
     * @param recordType The record type
     * @return Count of records with the specified type
     */
    public long countRecordsByType(TransparencyRecord.RecordType recordType) {
        return transparencyRecordRepository.countByRecordType(recordType);
    }

    /**
     * Create a model decision transparency record
     *
     * @param requestId The request ID
     * @param userId The user ID
     * @param modelId The model ID
     * @param providerId The provider ID
     * @param explanation The explanation
     * @param modelDetails The model details
     * @param dataSourcesUsed The data sources used
     * @param policiesApplied The policies applied
     * @param limitationsDisclosure The limitations disclosure
     * @param confidenceInformation The confidence information
     * @param toolsUsed The tools used
     * @return The created record
     */
    @Transactional
    public TransparencyRecord createModelDecisionRecord(
            String requestId,
            String userId,
            String modelId,
            String providerId,
            String explanation,
            String modelDetails,
            String dataSourcesUsed,
            Set<String> policiesApplied,
            String limitationsDisclosure,
            String confidenceInformation,
            String toolsUsed) {
        
        TransparencyRecord record = new TransparencyRecord();
        record.setId(UUID.randomUUID().toString());
        record.setRequestId(requestId);
        record.setUserId(userId);
        record.setRecordType(TransparencyRecord.RecordType.MODEL_DECISION);
        record.setExplanation(explanation);
        record.setModelDetails(modelDetails);
        record.setDataSourcesUsed(dataSourcesUsed);
        record.setPoliciesApplied(policiesApplied);
        record.setLimitationsDisclosure(limitationsDisclosure);
        record.setConfidenceInformation(confidenceInformation);
        record.setUserNotified(false);
        record.setCreatedAt(LocalDateTime.now());
        record.setModelId(modelId);
        record.setProviderId(providerId);
        record.setToolsUsed(toolsUsed);
        
        return transparencyRecordRepository.save(record);
    }

    /**
     * Create a content modification transparency record
     *
     * @param requestId The request ID
     * @param userId The user ID
     * @param modelId The model ID
     * @param providerId The provider ID
     * @param explanation The explanation
     * @param policiesApplied The policies applied
     * @return The created record
     */
    @Transactional
    public TransparencyRecord createContentModificationRecord(
            String requestId,
            String userId,
            String modelId,
            String providerId,
            String explanation,
            Set<String> policiesApplied) {
        
        TransparencyRecord record = new TransparencyRecord();
        record.setId(UUID.randomUUID().toString());
        record.setRequestId(requestId);
        record.setUserId(userId);
        record.setRecordType(TransparencyRecord.RecordType.CONTENT_MODIFICATION);
        record.setExplanation(explanation);
        record.setPoliciesApplied(policiesApplied);
        record.setUserNotified(false);
        record.setCreatedAt(LocalDateTime.now());
        record.setModelId(modelId);
        record.setProviderId(providerId);
        
        return transparencyRecordRepository.save(record);
    }

    /**
     * Create a content rejection transparency record
     *
     * @param requestId The request ID
     * @param userId The user ID
     * @param modelId The model ID
     * @param providerId The provider ID
     * @param explanation The explanation
     * @param policiesApplied The policies applied
     * @return The created record
     */
    @Transactional
    public TransparencyRecord createContentRejectionRecord(
            String requestId,
            String userId,
            String modelId,
            String providerId,
            String explanation,
            Set<String> policiesApplied) {
        
        TransparencyRecord record = new TransparencyRecord();
        record.setId(UUID.randomUUID().toString());
        record.setRequestId(requestId);
        record.setUserId(userId);
        record.setRecordType(TransparencyRecord.RecordType.CONTENT_REJECTION);
        record.setExplanation(explanation);
        record.setPoliciesApplied(policiesApplied);
        record.setUserNotified(false);
        record.setCreatedAt(LocalDateTime.now());
        record.setModelId(modelId);
        record.setProviderId(providerId);
        
        return transparencyRecordRepository.save(record);
    }
}
