package ai.lumina.provider.controller;

import ai.lumina.provider.model.Provider;
import ai.lumina.provider.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * REST controller for provider operations
 */
@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;

    @Autowired
    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    /**
     * Create a new provider
     *
     * @param provider The provider to create
     * @return The created provider
     */
    @PostMapping
    public ResponseEntity<Provider> createProvider(@RequestBody Provider provider) {
        Provider createdProvider = providerService.createProvider(provider);
        return new ResponseEntity<>(createdProvider, HttpStatus.CREATED);
    }

    /**
     * Get a provider by ID
     *
     * @param id The provider ID
     * @return The provider if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProvider(@PathVariable String id) {
        Provider provider = providerService.getProvider(id);
        return new ResponseEntity<>(provider, HttpStatus.OK);
    }

    /**
     * Get all providers
     *
     * @return List of all providers
     */
    @GetMapping
    public ResponseEntity<List<Provider>> getAllProviders() {
        List<Provider> providers = providerService.getAllProviders();
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    /**
     * Get providers by type
     *
     * @param type The provider type
     * @return List of providers of the specified type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Provider>> getProvidersByType(@PathVariable Provider.ProviderType type) {
        List<Provider> providers = providerService.getProvidersByType(type);
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    /**
     * Get enabled providers
     *
     * @return List of enabled providers
     */
    @GetMapping("/enabled")
    public ResponseEntity<List<Provider>> getEnabledProviders() {
        List<Provider> providers = providerService.getEnabledProviders();
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    /**
     * Get providers by capability
     *
     * @param capability The capability
     * @return List of providers with the specified capability
     */
    @GetMapping("/capability/{capability}")
    public ResponseEntity<List<Provider>> getProvidersByCapability(
            @PathVariable Provider.Capability capability) {
        List<Provider> providers = providerService.getProvidersByCapability(capability);
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    /**
     * Get providers by multiple capabilities (must have all)
     *
     * @param capabilities The set of capabilities
     * @return List of providers with all the specified capabilities
     */
    @PostMapping("/capabilities")
    public ResponseEntity<List<Provider>> getProvidersByCapabilitiesAll(
            @RequestBody Set<Provider.Capability> capabilities) {
        List<Provider> providers = providerService.getProvidersByCapabilitiesAll(capabilities);
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    /**
     * Get providers ordered by priority
     *
     * @return List of providers ordered by priority
     */
    @GetMapping("/priority")
    public ResponseEntity<List<Provider>> getProvidersOrderedByPriority() {
        List<Provider> providers = providerService.getProvidersOrderedByPriority();
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    /**
     * Update a provider
     *
     * @param id The provider ID
     * @param provider The updated provider data
     * @return The updated provider
     */
    @PutMapping("/{id}")
    public ResponseEntity<Provider> updateProvider(
            @PathVariable String id,
            @RequestBody Provider provider) {
        Provider updatedProvider = providerService.updateProvider(id, provider);
        return new ResponseEntity<>(updatedProvider, HttpStatus.OK);
    }

    /**
     * Update provider status
     *
     * @param id The provider ID
     * @param statusUpdate The status update
     * @return The updated provider
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Provider> updateProviderStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        Boolean enabled = statusUpdate.get("enabled");
        if (enabled == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Provider updatedProvider = providerService.updateProviderStatus(id, enabled);
        return new ResponseEntity<>(updatedProvider, HttpStatus.OK);
    }

    /**
     * Update provider priority
     *
     * @param id The provider ID
     * @param priorityUpdate The priority update
     * @return The updated provider
     */
    @PatchMapping("/{id}/priority")
    public ResponseEntity<Provider> updateProviderPriority(
            @PathVariable String id,
            @RequestBody Map<String, Integer> priorityUpdate) {
        Integer priorityWeight = priorityUpdate.get("priorityWeight");
        if (priorityWeight == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Provider updatedProvider = providerService.updateProviderPriority(id, priorityWeight);
        return new ResponseEntity<>(updatedProvider, HttpStatus.OK);
    }

    /**
     * Update provider API key
     *
     * @param id The provider ID
     * @param apiKeyUpdate The API key update
     * @return The updated provider
     */
    @PatchMapping("/{id}/apiKey")
    public ResponseEntity<Provider> updateProviderApiKey(
            @PathVariable String id,
            @RequestBody Map<String, String> apiKeyUpdate) {
        String apiKey = apiKeyUpdate.get("apiKey");
        if (apiKey == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Provider updatedProvider = providerService.updateProviderApiKey(id, apiKey);
        return new ResponseEntity<>(updatedProvider, HttpStatus.OK);
    }

    /**
     * Delete a provider
     *
     * @param id The provider ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable String id) {
        providerService.deleteProvider(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Find the best provider for a capability
     *
     * @param capability The capability
     * @return The best provider for the specified capability
     */
    @GetMapping("/best/capability/{capability}")
    public ResponseEntity<Provider> findBestProviderForCapability(
            @PathVariable Provider.Capability capability) {
        return providerService.findBestProviderForCapability(capability)
                .map(provider -> new ResponseEntity<>(provider, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Find the best provider for multiple capabilities
     *
     * @param capabilities The set of capabilities
     * @return The best provider for the specified capabilities
     */
    @PostMapping("/best/capabilities")
    public ResponseEntity<Provider> findBestProviderForCapabilities(
            @RequestBody Set<Provider.Capability> capabilities) {
        return providerService.findBestProviderForCapabilities(capabilities)
                .map(provider -> new ResponseEntity<>(provider, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**
     * Get providers supporting streaming
     *
     * @return List of providers supporting streaming
     */
    @GetMapping("/streaming")
    public ResponseEntity<List<Provider>> getProvidersSupportingStreaming() {
        List<Provider> providers = providerService.getProvidersSupportingStreaming();
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    /**
     * Get providers supporting functions
     *
     * @return List of providers supporting functions
     */
    @GetMapping("/functions")
    public ResponseEntity<List<Provider>> getProvidersSupportingFunctions() {
        List<Provider> providers = providerService.getProvidersSupportingFunctions();
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }

    /**
     * Get providers supporting vision
     *
     * @return List of providers supporting vision
     */
    @GetMapping("/vision")
    public ResponseEntity<List<Provider>> getProvidersSupportingVision() {
        List<Provider> providers = providerService.getProvidersSupportingVision();
        return new ResponseEntity<>(providers, HttpStatus.OK);
    }
}
