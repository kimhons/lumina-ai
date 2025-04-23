package ai.lumina.deployment.controller;

import ai.lumina.deployment.model.Configuration;
import ai.lumina.deployment.service.ConfigurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for configuration operations
 */
@RestController
@RequestMapping("/api/configurations")
public class ConfigurationController {

    private final ConfigurationService configurationService;

    @Autowired
    public ConfigurationController(ConfigurationService configurationService) {
        this.configurationService = configurationService;
    }

    /**
     * Create a new configuration
     *
     * @param configuration The configuration to create
     * @return The created configuration
     */
    @PostMapping
    public ResponseEntity<Configuration> createConfiguration(@RequestBody Configuration configuration) {
        Configuration createdConfiguration = configurationService.createConfiguration(configuration);
        return new ResponseEntity<>(createdConfiguration, HttpStatus.CREATED);
    }

    /**
     * Get a configuration by ID
     *
     * @param id The configuration ID
     * @return The configuration if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Configuration> getConfiguration(@PathVariable String id) {
        return configurationService.getConfiguration(id)
                .map(configuration -> new ResponseEntity<>(configuration, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get all configurations
     *
     * @return List of all configurations
     */
    @GetMapping
    public ResponseEntity<List<Configuration>> getAllConfigurations() {
        List<Configuration> configurations = configurationService.getAllConfigurations();
        return new ResponseEntity<>(configurations, HttpStatus.OK);
    }

    /**
     * Get configurations by environment
     *
     * @param environment The deployment environment
     * @return List of configurations for the specified environment
     */
    @GetMapping("/environment/{environment}")
    public ResponseEntity<List<Configuration>> getConfigurationsByEnvironment(@PathVariable String environment) {
        List<Configuration> configurations = configurationService.getConfigurationsByEnvironment(environment);
        return new ResponseEntity<>(configurations, HttpStatus.OK);
    }

    /**
     * Get the latest version of a configuration by name and environment
     *
     * @param name The configuration name
     * @param environment The deployment environment
     * @return The latest version of the configuration if found
     */
    @GetMapping("/latest")
    public ResponseEntity<Configuration> getLatestConfiguration(
            @RequestParam String name,
            @RequestParam String environment) {
        
        return configurationService.getLatestConfiguration(name, environment)
                .map(configuration -> new ResponseEntity<>(configuration, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get a specific version of a configuration
     *
     * @param name The configuration name
     * @param environment The deployment environment
     * @param version The configuration version
     * @return The specified configuration version if found
     */
    @GetMapping("/version")
    public ResponseEntity<Configuration> getConfigurationVersion(
            @RequestParam String name,
            @RequestParam String environment,
            @RequestParam String version) {
        
        return configurationService.getConfigurationVersion(name, environment, version)
                .map(configuration -> new ResponseEntity<>(configuration, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update a configuration
     *
     * @param id The configuration ID
     * @param configuration The updated configuration data
     * @return The updated configuration if found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Configuration> updateConfiguration(
            @PathVariable String id,
            @RequestBody Configuration configuration) {
        
        return configurationService.updateConfiguration(id, configuration)
                .map(updatedConfiguration -> new ResponseEntity<>(updatedConfiguration, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update configuration data
     *
     * @param id The configuration ID
     * @param data The updated configuration data
     * @return The updated configuration if found
     */
    @PatchMapping("/{id}/data")
    public ResponseEntity<Configuration> updateConfigurationData(
            @PathVariable String id,
            @RequestBody Map<String, Object> data) {
        
        return configurationService.updateConfigurationData(id, data)
                .map(updatedConfiguration -> new ResponseEntity<>(updatedConfiguration, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update configuration secrets
     *
     * @param id The configuration ID
     * @param secrets The updated configuration secrets
     * @return The updated configuration if found
     */
    @PatchMapping("/{id}/secrets")
    public ResponseEntity<Configuration> updateConfigurationSecrets(
            @PathVariable String id,
            @RequestBody Map<String, String> secrets) {
        
        return configurationService.updateConfigurationSecrets(id, secrets)
                .map(updatedConfiguration -> new ResponseEntity<>(updatedConfiguration, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
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
    @PostMapping("/version")
    public ResponseEntity<Configuration> createNewVersion(
            @RequestParam String name,
            @RequestParam String environment,
            @RequestBody(required = false) Map<String, Object> data,
            @RequestBody(required = false) Map<String, String> secrets) {
        
        return configurationService.createNewVersion(name, environment, data, secrets)
                .map(newVersion -> new ResponseEntity<>(newVersion, HttpStatus.CREATED))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete a configuration
     *
     * @param id The configuration ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConfiguration(@PathVariable String id) {
        configurationService.deleteConfiguration(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Delete configurations by name and environment
     *
     * @param name The configuration name
     * @param environment The deployment environment
     * @return No content if successful
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteConfigurationsByNameAndEnvironment(
            @RequestParam String name,
            @RequestParam String environment) {
        
        configurationService.deleteConfigurationsByNameAndEnvironment(name, environment);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Get configuration statistics
     *
     * @return Configuration statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getConfigurationStats() {
        long devCount = configurationService.countByEnvironment("DEV");
        long stagingCount = configurationService.countByEnvironment("STAGING");
        long prodCount = configurationService.countByEnvironment("PROD");
        
        Map<String, Object> stats = Map.of(
            "environment", Map.of(
                "DEV", devCount,
                "STAGING", stagingCount,
                "PROD", prodCount
            ),
            "total", devCount + stagingCount + prodCount
        );
        
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}
