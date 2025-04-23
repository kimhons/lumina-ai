package ai.lumina.deployment.service;

import ai.lumina.deployment.model.Configuration;
import ai.lumina.deployment.repository.ConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing configurations
 */
@Service
public class ConfigurationService {

    private final ConfigurationRepository configurationRepository;

    @Autowired
    public ConfigurationService(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
    }

    /**
     * Create a new configuration
     *
     * @param configuration The configuration to create
     * @return The created configuration
     */
    @Transactional
    public Configuration createConfiguration(Configuration configuration) {
        // Generate ID if not provided
        if (configuration.getId() == null || configuration.getId().isEmpty()) {
            configuration.setId(UUID.randomUUID().toString());
        }
        
        // Set creation timestamp
        configuration.setCreatedAt(LocalDateTime.now());
        configuration.setUpdatedAt(LocalDateTime.now());
        
        // Set version if not provided
        if (configuration.getVersion() == null || configuration.getVersion().isEmpty()) {
            configuration.setVersion("1.0.0");
        }
        
        return configurationRepository.save(configuration);
    }

    /**
     * Get a configuration by ID
     *
     * @param id The configuration ID
     * @return The configuration if found
     */
    public Optional<Configuration> getConfiguration(String id) {
        return configurationRepository.findById(id);
    }

    /**
     * Get all configurations
     *
     * @return List of all configurations
     */
    public List<Configuration> getAllConfigurations() {
        return configurationRepository.findAll();
    }

    /**
     * Get configurations by environment
     *
     * @param environment The deployment environment
     * @return List of configurations for the specified environment
     */
    public List<Configuration> getConfigurationsByEnvironment(String environment) {
        return configurationRepository.findByEnvironment(environment);
    }

    /**
     * Get the latest version of a configuration by name and environment
     *
     * @param name The configuration name
     * @param environment The deployment environment
     * @return The latest version of the configuration if found
     */
    public Optional<Configuration> getLatestConfiguration(String name, String environment) {
        return configurationRepository.findLatestByNameAndEnvironment(name, environment);
    }

    /**
     * Get a specific version of a configuration
     *
     * @param name The configuration name
     * @param environment The deployment environment
     * @param version The configuration version
     * @return The specified configuration version if found
     */
    public Optional<Configuration> getConfigurationVersion(String name, String environment, String version) {
        return configurationRepository.findByNameAndEnvironmentAndVersion(name, environment, version);
    }

    /**
     * Update a configuration
     *
     * @param id The configuration ID
     * @param configuration The updated configuration data
     * @return The updated configuration if found
     */
    @Transactional
    public Optional<Configuration> updateConfiguration(String id, Configuration configuration) {
        return configurationRepository.findById(id)
                .map(existingConfiguration -> {
                    // Update fields
                    if (configuration.getName() != null) {
                        existingConfiguration.setName(configuration.getName());
                    }
                    if (configuration.getEnvironment() != null) {
                        existingConfiguration.setEnvironment(configuration.getEnvironment());
                    }
                    if (configuration.getVersion() != null) {
                        existingConfiguration.setVersion(configuration.getVersion());
                    }
                    if (configuration.getData() != null) {
                        existingConfiguration.setData(configuration.getData());
                    }
                    if (configuration.getSecrets() != null) {
                        existingConfiguration.setSecrets(configuration.getSecrets());
                    }
                    
                    // Update timestamp
                    existingConfiguration.setUpdatedAt(LocalDateTime.now());
                    
                    return configurationRepository.save(existingConfiguration);
                });
    }

    /**
     * Update configuration data
     *
     * @param id The configuration ID
     * @param data The updated configuration data
     * @return The updated configuration if found
     */
    @Transactional
    public Optional<Configuration> updateConfigurationData(String id, Map<String, Object> data) {
        return configurationRepository.findById(id)
                .map(existingConfiguration -> {
                    existingConfiguration.setData(data);
                    existingConfiguration.setUpdatedAt(LocalDateTime.now());
                    return configurationRepository.save(existingConfiguration);
                });
    }

    /**
     * Update configuration secrets
     *
     * @param id The configuration ID
     * @param secrets The updated configuration secrets
     * @return The updated configuration if found
     */
    @Transactional
    public Optional<Configuration> updateConfigurationSecrets(String id, Map<String, String> secrets) {
        return configurationRepository.findById(id)
                .map(existingConfiguration -> {
                    existingConfiguration.setSecrets(secrets);
                    existingConfiguration.setUpdatedAt(LocalDateTime.now());
                    return configurationRepository.save(existingConfiguration);
                });
    }

    /**
     * Create a new version of a configuration
     *
     * @param name The configuration name
     * @param environment The deployment environment
     * @param data The configuration data
     * @param secrets The configuration secrets
     * @return The new configuration version
     */
    @Transactional
    public Optional<Configuration> createNewVersion(String name, String environment, Map<String, Object> data, Map<String, String> secrets) {
        return configurationRepository.findLatestByNameAndEnvironment(name, environment)
                .map(latestConfig -> {
                    // Create new version
                    Configuration newVersion = new Configuration();
                    newVersion.setId(UUID.randomUUID().toString());
                    newVersion.setName(name);
                    newVersion.setEnvironment(environment);
                    
                    // Increment version
                    String[] versionParts = latestConfig.getVersion().split("\\.");
                    int patch = Integer.parseInt(versionParts[2]) + 1;
                    newVersion.setVersion(versionParts[0] + "." + versionParts[1] + "." + patch);
                    
                    newVersion.setData(data != null ? data : latestConfig.getData());
                    newVersion.setSecrets(secrets != null ? secrets : latestConfig.getSecrets());
                    newVersion.setCreatedBy(latestConfig.getCreatedBy());
                    newVersion.setCreatedAt(LocalDateTime.now());
                    newVersion.setUpdatedAt(LocalDateTime.now());
                    
                    return configurationRepository.save(newVersion);
                });
    }

    /**
     * Delete a configuration
     *
     * @param id The configuration ID
     */
    @Transactional
    public void deleteConfiguration(String id) {
        configurationRepository.deleteById(id);
    }

    /**
     * Delete configurations by name and environment
     *
     * @param name The configuration name
     * @param environment The deployment environment
     * @return Number of configurations deleted
     */
    @Transactional
    public long deleteConfigurationsByNameAndEnvironment(String name, String environment) {
        return configurationRepository.deleteByNameAndEnvironment(name, environment);
    }

    /**
     * Count configurations by environment
     *
     * @param environment The deployment environment
     * @return Count of configurations for the specified environment
     */
    public long countByEnvironment(String environment) {
        return configurationRepository.countByEnvironment(environment);
    }
}
