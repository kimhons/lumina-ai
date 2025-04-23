package ai.lumina.provider.controller;

import ai.lumina.provider.model.Provider;
import ai.lumina.provider.model.ProviderRequest;
import ai.lumina.provider.model.Tool;
import ai.lumina.provider.model.ToolExecution;
import ai.lumina.provider.model.Model;
import ai.lumina.provider.service.ProviderIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

/**
 * REST controller for provider integration operations
 */
@RestController
@RequestMapping("/api/integration")
public class ProviderIntegrationController {

    private final ProviderIntegrationService providerIntegrationService;

    @Autowired
    public ProviderIntegrationController(ProviderIntegrationService providerIntegrationService) {
        this.providerIntegrationService = providerIntegrationService;
    }

    /**
     * Send a request to the best available provider
     *
     * @param requestData The request data
     * @return The provider request with response
     */
    @PostMapping("/request")
    public ResponseEntity<ProviderRequest> sendRequest(@RequestBody Map<String, Object> requestData) {
        String requestContent = (String) requestData.get("requestContent");
        String requestTypeStr = (String) requestData.get("requestType");
        String modelTypeStr = (String) requestData.get("modelType");
        Integer minContextWindow = (Integer) requestData.get("minContextWindow");
        String userId = (String) requestData.get("userId");
        String sessionId = (String) requestData.get("sessionId");
        String taskId = (String) requestData.get("taskId");
        @SuppressWarnings("unchecked")
        Map<String, Object> parameters = (Map<String, Object>) requestData.get("parameters");
        
        if (requestContent == null || requestTypeStr == null || modelTypeStr == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ProviderRequest.RequestType requestType;
        Model.ModelType modelType;
        
        try {
            requestType = ProviderRequest.RequestType.valueOf(requestTypeStr);
            modelType = Model.ModelType.valueOf(modelTypeStr);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        if (minContextWindow == null) {
            minContextWindow = 0;
        }
        
        if (parameters == null) {
            parameters = Map.of();
        }
        
        ProviderRequest response = providerIntegrationService.sendRequest(
                requestContent, requestType, modelType, minContextWindow, 
                userId, sessionId, taskId, parameters);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Send a request asynchronously
     *
     * @param requestData The request data
     * @return Accepted response
     */
    @PostMapping("/request/async")
    public ResponseEntity<Void> sendRequestAsync(@RequestBody Map<String, Object> requestData) {
        String requestContent = (String) requestData.get("requestContent");
        String requestTypeStr = (String) requestData.get("requestType");
        String modelTypeStr = (String) requestData.get("modelType");
        Integer minContextWindow = (Integer) requestData.get("minContextWindow");
        String userId = (String) requestData.get("userId");
        String sessionId = (String) requestData.get("sessionId");
        String taskId = (String) requestData.get("taskId");
        @SuppressWarnings("unchecked")
        Map<String, Object> parameters = (Map<String, Object>) requestData.get("parameters");
        
        if (requestContent == null || requestTypeStr == null || modelTypeStr == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ProviderRequest.RequestType requestType;
        Model.ModelType modelType;
        
        try {
            requestType = ProviderRequest.RequestType.valueOf(requestTypeStr);
            modelType = Model.ModelType.valueOf(modelTypeStr);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        if (minContextWindow == null) {
            minContextWindow = 0;
        }
        
        if (parameters == null) {
            parameters = Map.of();
        }
        
        providerIntegrationService.sendRequestAsync(
                requestContent, requestType, modelType, minContextWindow, 
                userId, sessionId, taskId, parameters);
        
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    /**
     * Execute a tool
     *
     * @param executionData The execution data
     * @return The tool execution with result
     */
    @PostMapping("/tool/execute")
    public ResponseEntity<ToolExecution> executeTool(@RequestBody Map<String, Object> executionData) {
        String providerRequestId = (String) executionData.get("providerRequestId");
        String toolId = (String) executionData.get("toolId");
        @SuppressWarnings("unchecked")
        Map<String, Object> inputParameters = (Map<String, Object>) executionData.get("inputParameters");
        
        if (providerRequestId == null || toolId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        if (inputParameters == null) {
            inputParameters = Map.of();
        }
        
        ToolExecution execution = providerIntegrationService.executeTool(
                providerRequestId, toolId, inputParameters);
        
        return new ResponseEntity<>(execution, HttpStatus.OK);
    }

    /**
     * Execute a tool asynchronously
     *
     * @param executionData The execution data
     * @return Accepted response
     */
    @PostMapping("/tool/execute/async")
    public ResponseEntity<Void> executeToolAsync(@RequestBody Map<String, Object> executionData) {
        String providerRequestId = (String) executionData.get("providerRequestId");
        String toolId = (String) executionData.get("toolId");
        @SuppressWarnings("unchecked")
        Map<String, Object> inputParameters = (Map<String, Object>) executionData.get("inputParameters");
        
        if (providerRequestId == null || toolId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        if (inputParameters == null) {
            inputParameters = Map.of();
        }
        
        providerIntegrationService.executeToolAsync(
                providerRequestId, toolId, inputParameters);
        
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    /**
     * Get available provider capabilities
     *
     * @return Map of provider IDs to their capabilities
     */
    @GetMapping("/providers/capabilities")
    public ResponseEntity<Map<String, Set<Provider.Capability>>> getAvailableProviderCapabilities() {
        Map<String, Set<Provider.Capability>> capabilities = 
                providerIntegrationService.getAvailableProviderCapabilities();
        return new ResponseEntity<>(capabilities, HttpStatus.OK);
    }

    /**
     * Get available model details
     *
     * @return Map of model IDs to their details
     */
    @GetMapping("/models/details")
    public ResponseEntity<Map<String, Map<String, Object>>> getAvailableModelDetails() {
        Map<String, Map<String, Object>> modelDetails = 
                providerIntegrationService.getAvailableModelDetails();
        return new ResponseEntity<>(modelDetails, HttpStatus.OK);
    }

    /**
     * Get available tool details
     *
     * @return Map of tool IDs to their details
     */
    @GetMapping("/tools/details")
    public ResponseEntity<Map<String, Map<String, Object>>> getAvailableToolDetails() {
        Map<String, Map<String, Object>> toolDetails = 
                providerIntegrationService.getAvailableToolDetails();
        return new ResponseEntity<>(toolDetails, HttpStatus.OK);
    }
}
