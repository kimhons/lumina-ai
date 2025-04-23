package ai.lumina.provider.service;

import ai.lumina.provider.model.Provider;
import ai.lumina.provider.model.Model;
import ai.lumina.provider.model.ProviderRequest;
import ai.lumina.provider.repository.ProviderRequestRepository;
import ai.lumina.provider.exception.ProviderRequestNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing provider requests
 */
@Service
public class ProviderRequestService {

    private final ProviderRequestRepository providerRequestRepository;
    private final ProviderService providerService;
    private final ModelService modelService;

    @Autowired
    public ProviderRequestService(
            ProviderRequestRepository providerRequestRepository,
            ProviderService providerService,
            ModelService modelService) {
        this.providerRequestRepository = providerRequestRepository;
        this.providerService = providerService;
        this.modelService = modelService;
    }

    /**
     * Create a new provider request
     *
     * @param providerRequest The provider request to create
     * @return The created provider request
     */
    @Transactional
    public ProviderRequest createProviderRequest(ProviderRequest providerRequest) {
        // Generate ID if not provided
        if (providerRequest.getId() == null || providerRequest.getId().isEmpty()) {
            providerRequest.setId(UUID.randomUUID().toString());
        }
        
        // Verify provider exists
        if (providerRequest.getProvider() != null && providerRequest.getProvider().getId() != null) {
            Provider provider = providerService.getProvider(providerRequest.getProvider().getId());
            providerRequest.setProvider(provider);
        }
        
        // Verify model exists
        if (providerRequest.getModel() != null && providerRequest.getModel().getId() != null) {
            Model model = modelService.getModel(providerRequest.getModel().getId());
            providerRequest.setModel(model);
        }
        
        // Set timestamps and initial status if not set
        if (providerRequest.getCreatedAt() == null) {
            providerRequest.setCreatedAt(LocalDateTime.now());
        }
        
        if (providerRequest.getStatus() == null) {
            providerRequest.setStatus(ProviderRequest.RequestStatus.PENDING);
        }
        
        return providerRequestRepository.save(providerRequest);
    }

    /**
     * Get a provider request by ID
     *
     * @param id The provider request ID
     * @return The provider request if found
     * @throws ProviderRequestNotFoundException if provider request not found
     */
    public ProviderRequest getProviderRequest(String id) {
        return providerRequestRepository.findById(id)
                .orElseThrow(() -> new ProviderRequestNotFoundException("Provider request not found with ID: " + id));
    }

    /**
     * Get a provider request by ID (optional version)
     *
     * @param id The provider request ID
     * @return Optional containing the provider request if found
     */
    public Optional<ProviderRequest> findProviderRequest(String id) {
        return providerRequestRepository.findById(id);
    }

    /**
     * Get all provider requests
     *
     * @return List of all provider requests
     */
    public List<ProviderRequest> getAllProviderRequests() {
        return providerRequestRepository.findAll();
    }

    /**
     * Get provider requests by provider ID
     *
     * @param providerId The provider ID
     * @return List of provider requests for the specified provider
     */
    public List<ProviderRequest> getProviderRequestsByProvider(String providerId) {
        return providerRequestRepository.findByProviderId(providerId);
    }

    /**
     * Get provider requests by model ID
     *
     * @param modelId The model ID
     * @return List of provider requests for the specified model
     */
    public List<ProviderRequest> getProviderRequestsByModel(String modelId) {
        return providerRequestRepository.findByModelId(modelId);
    }

    /**
     * Get provider requests by type
     *
     * @param type The request type
     * @return List of provider requests of the specified type
     */
    public List<ProviderRequest> getProviderRequestsByType(ProviderRequest.RequestType type) {
        return providerRequestRepository.findByType(type);
    }

    /**
     * Get provider requests by status
     *
     * @param status The request status
     * @return List of provider requests with the specified status
     */
    public List<ProviderRequest> getProviderRequestsByStatus(ProviderRequest.RequestStatus status) {
        return providerRequestRepository.findByStatus(status);
    }

    /**
     * Get provider requests by user ID
     *
     * @param userId The user ID
     * @return List of provider requests for the specified user
     */
    public List<ProviderRequest> getProviderRequestsByUser(String userId) {
        return providerRequestRepository.findByUserId(userId);
    }

    /**
     * Get provider requests by session ID
     *
     * @param sessionId The session ID
     * @return List of provider requests for the specified session
     */
    public List<ProviderRequest> getProviderRequestsBySession(String sessionId) {
        return providerRequestRepository.findBySessionId(sessionId);
    }

    /**
     * Get provider requests by task ID
     *
     * @param taskId The task ID
     * @return List of provider requests for the specified task
     */
    public List<ProviderRequest> getProviderRequestsByTask(String taskId) {
        return providerRequestRepository.findByTaskId(taskId);
    }

    /**
     * Get recent provider requests
     *
     * @param limit The maximum number of requests to return
     * @return List of recent provider requests
     */
    public List<ProviderRequest> getRecentProviderRequests(int limit) {
        return providerRequestRepository.findRecentRequests(limit);
    }

    /**
     * Update a provider request
     *
     * @param id The provider request ID
     * @param providerRequest The updated provider request data
     * @return The updated provider request
     * @throws ProviderRequestNotFoundException if provider request not found
     */
    @Transactional
    public ProviderRequest updateProviderRequest(String id, ProviderRequest providerRequest) {
        ProviderRequest existingRequest = getProviderRequest(id);
        
        // Update fields
        if (providerRequest.getRequestContent() != null) {
            existingRequest.setRequestContent(providerRequest.getRequestContent());
        }
        if (providerRequest.getResponseContent() != null) {
            existingRequest.setResponseContent(providerRequest.getResponseContent());
        }
        
        existingRequest.setInputTokens(providerRequest.getInputTokens());
        existingRequest.setOutputTokens(providerRequest.getOutputTokens());
        existingRequest.setTotalCost(providerRequest.getTotalCost());
        existingRequest.setLatencyMs(providerRequest.getLatencyMs());
        
        if (providerRequest.getStatus() != null) {
            existingRequest.setStatus(providerRequest.getStatus());
        }
        
        if (providerRequest.getErrorMessage() != null) {
            existingRequest.setErrorMessage(providerRequest.getErrorMessage());
        }
        
        if (providerRequest.getParameters() != null && !providerRequest.getParameters().isEmpty()) {
            existingRequest.setParameters(providerRequest.getParameters());
        }
        
        if (providerRequest.getCompletedAt() != null) {
            existingRequest.setCompletedAt(providerRequest.getCompletedAt());
        }
        
        return providerRequestRepository.save(existingRequest);
    }

    /**
     * Update provider request status
     *
     * @param id The provider request ID
     * @param status The new status
     * @return The updated provider request
     * @throws ProviderRequestNotFoundException if provider request not found
     */
    @Transactional
    public ProviderRequest updateProviderRequestStatus(String id, ProviderRequest.RequestStatus status) {
        ProviderRequest request = getProviderRequest(id);
        request.setStatus(status);
        
        if (status == ProviderRequest.RequestStatus.COMPLETED || 
            status == ProviderRequest.RequestStatus.FAILED ||
            status == ProviderRequest.RequestStatus.CANCELLED) {
            request.setCompletedAt(LocalDateTime.now());
        }
        
        return providerRequestRepository.save(request);
    }

    /**
     * Complete a provider request with response
     *
     * @param id The provider request ID
     * @param responseContent The response content
     * @param outputTokens The number of output tokens
     * @param latencyMs The latency in milliseconds
     * @return The updated provider request
     * @throws ProviderRequestNotFoundException if provider request not found
     */
    @Transactional
    public ProviderRequest completeProviderRequest(
            String id, 
            String responseContent, 
            int outputTokens, 
            int latencyMs) {
        
        ProviderRequest request = getProviderRequest(id);
        request.setResponseContent(responseContent);
        request.setOutputTokens(outputTokens);
        request.setLatencyMs(latencyMs);
        request.setStatus(ProviderRequest.RequestStatus.COMPLETED);
        request.setCompletedAt(LocalDateTime.now());
        
        // Calculate cost
        if (request.getModel() != null) {
            request.setTotalCost(request.calculateCost());
        }
        
        return providerRequestRepository.save(request);
    }

    /**
     * Fail a provider request with error
     *
     * @param id The provider request ID
     * @param errorMessage The error message
     * @return The updated provider request
     * @throws ProviderRequestNotFoundException if provider request not found
     */
    @Transactional
    public ProviderRequest failProviderRequest(String id, String errorMessage) {
        ProviderRequest request = getProviderRequest(id);
        request.setErrorMessage(errorMessage);
        request.setStatus(ProviderRequest.RequestStatus.FAILED);
        request.setCompletedAt(LocalDateTime.now());
        return providerRequestRepository.save(request);
    }

    /**
     * Delete a provider request
     *
     * @param id The provider request ID
     * @throws ProviderRequestNotFoundException if provider request not found
     */
    @Transactional
    public void deleteProviderRequest(String id) {
        if (!providerRequestRepository.existsById(id)) {
            throw new ProviderRequestNotFoundException("Provider request not found with ID: " + id);
        }
        providerRequestRepository.deleteById(id);
    }

    /**
     * Calculate total cost for a time period
     *
     * @param startDate The start date
     * @param endDate The end date
     * @return Total cost for the specified time period
     */
    public double calculateTotalCostForPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return providerRequestRepository.calculateTotalCostForPeriod(startDate, endDate);
    }

    /**
     * Find long-running requests
     *
     * @param minutes The threshold in minutes
     * @return List of long-running requests
     */
    public List<ProviderRequest> findLongRunningRequests(int minutes) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutes);
        return providerRequestRepository.findLongRunningRequests(cutoffTime);
    }
}
