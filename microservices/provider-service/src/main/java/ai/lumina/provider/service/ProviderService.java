package ai.lumina.provider.service;

import ai.lumina.provider.model.Provider;
import ai.lumina.provider.repository.ProviderRepository;
import ai.lumina.provider.exception.ProviderNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Service for managing AI providers
 */
@Service
public class ProviderService {

    private final ProviderRepository providerRepository;

    @Autowired
    public ProviderService(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    /**
     * Create a new provider
     *
     * @param provider The provider to create
     * @return The created provider
     */
    @Transactional
    public Provider createProvider(Provider provider) {
        // Generate ID if not provided
        if (provider.getId() == null || provider.getId().isEmpty()) {
            provider.setId(UUID.randomUUID().toString());
        }
        
        // Set timestamps
        provider.setCreatedAt(LocalDateTime.now());
        provider.setUpdatedAt(LocalDateTime.now());
        
        return providerRepository.save(provider);
    }

    /**
     * Get a provider by ID
     *
     * @param id The provider ID
     * @return The provider if found
     * @throws ProviderNotFoundException if provider not found
     */
    public Provider getProvider(String id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new ProviderNotFoundException("Provider not found with ID: " + id));
    }

    /**
     * Get a provider by ID (optional version)
     *
     * @param id The provider ID
     * @return Optional containing the provider if found
     */
    public Optional<Provider> findProvider(String id) {
        return providerRepository.findById(id);
    }

    /**
     * Get all providers
     *
     * @return List of all providers
     */
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    /**
     * Get providers by type
     *
     * @param type The provider type
     * @return List of providers of the specified type
     */
    public List<Provider> getProvidersByType(Provider.ProviderType type) {
        return providerRepository.findByType(type);
    }

    /**
     * Get enabled providers
     *
     * @return List of enabled providers
     */
    public List<Provider> getEnabledProviders() {
        return providerRepository.findByEnabledTrue();
    }

    /**
     * Get enabled providers by type
     *
     * @param type The provider type
     * @return List of enabled providers of the specified type
     */
    public List<Provider> getEnabledProvidersByType(Provider.ProviderType type) {
        return providerRepository.findByTypeAndEnabledTrue(type);
    }

    /**
     * Get providers by capability
     *
     * @param capability The capability
     * @return List of providers with the specified capability
     */
    public List<Provider> getProvidersByCapability(Provider.Capability capability) {
        return providerRepository.findByCapability(capability);
    }

    /**
     * Get enabled providers by capability
     *
     * @param capability The capability
     * @return List of enabled providers with the specified capability
     */
    public List<Provider> getEnabledProvidersByCapability(Provider.Capability capability) {
        return providerRepository.findByCapabilityAndEnabledTrue(capability);
    }

    /**
     * Get providers by multiple capabilities (must have all)
     *
     * @param capabilities The set of capabilities
     * @return List of providers with all the specified capabilities
     */
    public List<Provider> getProvidersByCapabilitiesAll(Set<Provider.Capability> capabilities) {
        return providerRepository.findByCapabilitiesAll(capabilities);
    }

    /**
     * Get enabled providers by multiple capabilities (must have all)
     *
     * @param capabilities The set of capabilities
     * @return List of enabled providers with all the specified capabilities
     */
    public List<Provider> getEnabledProvidersByCapabilitiesAll(Set<Provider.Capability> capabilities) {
        return providerRepository.findByCapabilitiesAllAndEnabledTrue(capabilities);
    }

    /**
     * Get providers ordered by priority weight (highest first)
     *
     * @return List of providers ordered by priority weight
     */
    public List<Provider> getProvidersOrderedByPriority() {
        return providerRepository.findAllByOrderByPriorityWeightDesc();
    }

    /**
     * Get enabled providers ordered by priority weight (highest first)
     *
     * @return List of enabled providers ordered by priority weight
     */
    public List<Provider> getEnabledProvidersOrderedByPriority() {
        return providerRepository.findByEnabledTrueOrderByPriorityWeightDesc();
    }

    /**
     * Update a provider
     *
     * @param id The provider ID
     * @param provider The updated provider data
     * @return The updated provider
     * @throws ProviderNotFoundException if provider not found
     */
    @Transactional
    public Provider updateProvider(String id, Provider provider) {
        Provider existingProvider = getProvider(id);
        
        // Update fields
        if (provider.getName() != null) {
            existingProvider.setName(provider.getName());
        }
        if (provider.getDescription() != null) {
            existingProvider.setDescription(provider.getDescription());
        }
        if (provider.getType() != null) {
            existingProvider.setType(provider.getType());
        }
        if (provider.getBaseUrl() != null) {
            existingProvider.setBaseUrl(provider.getBaseUrl());
        }
        if (provider.getAuthType() != null) {
            existingProvider.setAuthType(provider.getAuthType());
        }
        if (provider.getApiKey() != null) {
            existingProvider.setApiKey(provider.getApiKey());
        }
        if (provider.getCapabilities() != null && !provider.getCapabilities().isEmpty()) {
            existingProvider.setCapabilities(provider.getCapabilities());
        }
        if (provider.getConfig() != null && !provider.getConfig().isEmpty()) {
            existingProvider.setConfig(provider.getConfig());
        }
        
        existingProvider.setEnabled(provider.isEnabled());
        existingProvider.setPriorityWeight(provider.getPriorityWeight());
        existingProvider.setRateLimit(provider.getRateLimit());
        existingProvider.setCostPerToken(provider.getCostPerToken());
        
        // Update timestamp
        existingProvider.setUpdatedAt(LocalDateTime.now());
        
        return providerRepository.save(existingProvider);
    }

    /**
     * Update provider status (enabled/disabled)
     *
     * @param id The provider ID
     * @param enabled The enabled status
     * @return The updated provider
     * @throws ProviderNotFoundException if provider not found
     */
    @Transactional
    public Provider updateProviderStatus(String id, boolean enabled) {
        Provider provider = getProvider(id);
        provider.setEnabled(enabled);
        provider.setUpdatedAt(LocalDateTime.now());
        return providerRepository.save(provider);
    }

    /**
     * Update provider priority weight
     *
     * @param id The provider ID
     * @param priorityWeight The priority weight
     * @return The updated provider
     * @throws ProviderNotFoundException if provider not found
     */
    @Transactional
    public Provider updateProviderPriority(String id, int priorityWeight) {
        Provider provider = getProvider(id);
        provider.setPriorityWeight(priorityWeight);
        provider.setUpdatedAt(LocalDateTime.now());
        return providerRepository.save(provider);
    }

    /**
     * Update provider API key
     *
     * @param id The provider ID
     * @param apiKey The API key
     * @return The updated provider
     * @throws ProviderNotFoundException if provider not found
     */
    @Transactional
    public Provider updateProviderApiKey(String id, String apiKey) {
        Provider provider = getProvider(id);
        provider.setApiKey(apiKey);
        provider.setUpdatedAt(LocalDateTime.now());
        return providerRepository.save(provider);
    }

    /**
     * Delete a provider
     *
     * @param id The provider ID
     * @throws ProviderNotFoundException if provider not found
     */
    @Transactional
    public void deleteProvider(String id) {
        if (!providerRepository.existsById(id)) {
            throw new ProviderNotFoundException("Provider not found with ID: " + id);
        }
        providerRepository.deleteById(id);
    }

    /**
     * Find the best provider for a specific capability
     *
     * @param capability The capability
     * @return The best provider for the specified capability
     */
    public Optional<Provider> findBestProviderForCapability(Provider.Capability capability) {
        List<Provider> providers = providerRepository.findByCapabilityAndEnabledTrue(capability);
        return providers.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getPriorityWeight(), p1.getPriorityWeight()))
                .findFirst();
    }

    /**
     * Find the best provider for multiple capabilities
     *
     * @param capabilities The set of capabilities
     * @return The best provider for the specified capabilities
     */
    public Optional<Provider> findBestProviderForCapabilities(Set<Provider.Capability> capabilities) {
        List<Provider> providers = providerRepository.findByCapabilitiesAllAndEnabledTrue(capabilities);
        return providers.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getPriorityWeight(), p1.getPriorityWeight()))
                .findFirst();
    }
}
