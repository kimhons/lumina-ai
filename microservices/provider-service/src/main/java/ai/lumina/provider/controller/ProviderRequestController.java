package ai.lumina.provider.controller;

import ai.lumina.provider.model.ProviderRequest;
import ai.lumina.provider.service.ProviderRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * REST controller for provider request operations
 */
@RestController
@RequestMapping("/api/requests")
public class ProviderRequestController {

    private final ProviderRequestService providerRequestService;

    @Autowired
    public ProviderRequestController(ProviderRequestService providerRequestService) {
        this.providerRequestService = providerRequestService;
    }

    /**
     * Create a new provider request
     *
     * @param providerRequest The provider request to create
     * @return The created provider request
     */
    @PostMapping
    public ResponseEntity<ProviderRequest> createProviderRequest(@RequestBody ProviderRequest providerRequest) {
        ProviderRequest createdRequest = providerRequestService.createProviderRequest(providerRequest);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    /**
     * Get a provider request by ID
     *
     * @param id The provider request ID
     * @return The provider request if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProviderRequest> getProviderRequest(@PathVariable String id) {
        ProviderRequest providerRequest = providerRequestService.getProviderRequest(id);
        return new ResponseEntity<>(providerRequest, HttpStatus.OK);
    }

    /**
     * Get all provider requests
     *
     * @return List of all provider requests
     */
    @GetMapping
    public ResponseEntity<List<ProviderRequest>> getAllProviderRequests() {
        List<ProviderRequest> requests = providerRequestService.getAllProviderRequests();
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Get provider requests by provider
     *
     * @param providerId The provider ID
     * @return List of provider requests for the specified provider
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProviderRequest>> getProviderRequestsByProvider(@PathVariable String providerId) {
        List<ProviderRequest> requests = providerRequestService.getProviderRequestsByProvider(providerId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Get provider requests by model
     *
     * @param modelId The model ID
     * @return List of provider requests for the specified model
     */
    @GetMapping("/model/{modelId}")
    public ResponseEntity<List<ProviderRequest>> getProviderRequestsByModel(@PathVariable String modelId) {
        List<ProviderRequest> requests = providerRequestService.getProviderRequestsByModel(modelId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Get provider requests by type
     *
     * @param type The request type
     * @return List of provider requests of the specified type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ProviderRequest>> getProviderRequestsByType(
            @PathVariable ProviderRequest.RequestType type) {
        List<ProviderRequest> requests = providerRequestService.getProviderRequestsByType(type);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Get provider requests by status
     *
     * @param status The request status
     * @return List of provider requests with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProviderRequest>> getProviderRequestsByStatus(
            @PathVariable ProviderRequest.RequestStatus status) {
        List<ProviderRequest> requests = providerRequestService.getProviderRequestsByStatus(status);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Get provider requests by user
     *
     * @param userId The user ID
     * @return List of provider requests for the specified user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProviderRequest>> getProviderRequestsByUser(@PathVariable String userId) {
        List<ProviderRequest> requests = providerRequestService.getProviderRequestsByUser(userId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Get provider requests by session
     *
     * @param sessionId The session ID
     * @return List of provider requests for the specified session
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ProviderRequest>> getProviderRequestsBySession(@PathVariable String sessionId) {
        List<ProviderRequest> requests = providerRequestService.getProviderRequestsBySession(sessionId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Get provider requests by task
     *
     * @param taskId The task ID
     * @return List of provider requests for the specified task
     */
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<ProviderRequest>> getProviderRequestsByTask(@PathVariable String taskId) {
        List<ProviderRequest> requests = providerRequestService.getProviderRequestsByTask(taskId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Get recent provider requests
     *
     * @param limit The maximum number of requests to return
     * @return List of recent provider requests
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ProviderRequest>> getRecentProviderRequests(
            @RequestParam(defaultValue = "10") int limit) {
        List<ProviderRequest> requests = providerRequestService.getRecentProviderRequests(limit);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    /**
     * Update a provider request
     *
     * @param id The provider request ID
     * @param providerRequest The updated provider request data
     * @return The updated provider request
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProviderRequest> updateProviderRequest(
            @PathVariable String id,
            @RequestBody ProviderRequest providerRequest) {
        ProviderRequest updatedRequest = providerRequestService.updateProviderRequest(id, providerRequest);
        return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
    }

    /**
     * Update provider request status
     *
     * @param id The provider request ID
     * @param statusUpdate The status update
     * @return The updated provider request
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ProviderRequest> updateProviderRequestStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ProviderRequest.RequestStatus requestStatus;
        try {
            requestStatus = ProviderRequest.RequestStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ProviderRequest updatedRequest = providerRequestService.updateProviderRequestStatus(id, requestStatus);
        return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
    }

    /**
     * Complete a provider request with response
     *
     * @param id The provider request ID
     * @param completionData The completion data
     * @return The updated provider request
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<ProviderRequest> completeProviderRequest(
            @PathVariable String id,
            @RequestBody Map<String, Object> completionData) {
        String responseContent = (String) completionData.get("responseContent");
        Integer outputTokens = (Integer) completionData.get("outputTokens");
        Integer latencyMs = (Integer) completionData.get("latencyMs");
        
        if (responseContent == null || outputTokens == null || latencyMs == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ProviderRequest completedRequest = providerRequestService.completeProviderRequest(
                id, responseContent, outputTokens, latencyMs);
        return new ResponseEntity<>(completedRequest, HttpStatus.OK);
    }

    /**
     * Fail a provider request with error
     *
     * @param id The provider request ID
     * @param errorData The error data
     * @return The updated provider request
     */
    @PostMapping("/{id}/fail")
    public ResponseEntity<ProviderRequest> failProviderRequest(
            @PathVariable String id,
            @RequestBody Map<String, String> errorData) {
        String errorMessage = errorData.get("errorMessage");
        if (errorMessage == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ProviderRequest failedRequest = providerRequestService.failProviderRequest(id, errorMessage);
        return new ResponseEntity<>(failedRequest, HttpStatus.OK);
    }

    /**
     * Delete a provider request
     *
     * @param id The provider request ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProviderRequest(@PathVariable String id) {
        providerRequestService.deleteProviderRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Calculate total cost for a time period
     *
     * @param startDate The start date
     * @param endDate The end date
     * @return Total cost for the specified time period
     */
    @GetMapping("/cost")
    public ResponseEntity<Map<String, Double>> calculateTotalCostForPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        double totalCost = providerRequestService.calculateTotalCostForPeriod(startDate, endDate);
        return new ResponseEntity<>(Map.of("totalCost", totalCost), HttpStatus.OK);
    }

    /**
     * Find long-running requests
     *
     * @param minutes The threshold in minutes
     * @return List of long-running requests
     */
    @GetMapping("/long-running")
    public ResponseEntity<List<ProviderRequest>> findLongRunningRequests(
            @RequestParam(defaultValue = "5") int minutes) {
        List<ProviderRequest> requests = providerRequestService.findLongRunningRequests(minutes);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
}
