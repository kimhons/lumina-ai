package ai.lumina.deployment.service;

import ai.lumina.deployment.model.Infrastructure;
import ai.lumina.deployment.repository.InfrastructureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing infrastructure resources
 */
@Service
public class InfrastructureService {

    private final InfrastructureRepository infrastructureRepository;

    @Autowired
    public InfrastructureService(InfrastructureRepository infrastructureRepository) {
        this.infrastructureRepository = infrastructureRepository;
    }

    /**
     * Create a new infrastructure resource
     *
     * @param infrastructure The infrastructure to create
     * @return The created infrastructure
     */
    @Transactional
    public Infrastructure createInfrastructure(Infrastructure infrastructure) {
        // Generate ID if not provided
        if (infrastructure.getId() == null || infrastructure.getId().isEmpty()) {
            infrastructure.setId(UUID.randomUUID().toString());
        }
        
        // Set initial status if not provided
        if (infrastructure.getStatus() == null || infrastructure.getStatus().isEmpty()) {
            infrastructure.setStatus("PROVISIONING");
        }
        
        // Set timestamps
        infrastructure.setCreatedAt(LocalDateTime.now());
        infrastructure.setUpdatedAt(LocalDateTime.now());
        
        return infrastructureRepository.save(infrastructure);
    }

    /**
     * Get an infrastructure resource by ID
     *
     * @param id The infrastructure ID
     * @return The infrastructure if found
     */
    public Optional<Infrastructure> getInfrastructure(String id) {
        return infrastructureRepository.findById(id);
    }

    /**
     * Get all infrastructure resources
     *
     * @return List of all infrastructure resources
     */
    public List<Infrastructure> getAllInfrastructure() {
        return infrastructureRepository.findAll();
    }

    /**
     * Get infrastructure resources by environment
     *
     * @param environment The deployment environment
     * @return List of infrastructure resources for the specified environment
     */
    public List<Infrastructure> getInfrastructureByEnvironment(String environment) {
        return infrastructureRepository.findByEnvironment(environment);
    }

    /**
     * Get infrastructure resources by type
     *
     * @param type The infrastructure type
     * @return List of infrastructure resources of the specified type
     */
    public List<Infrastructure> getInfrastructureByType(String type) {
        return infrastructureRepository.findByType(type);
    }

    /**
     * Get infrastructure resources by status
     *
     * @param status The infrastructure status
     * @return List of infrastructure resources with the specified status
     */
    public List<Infrastructure> getInfrastructureByStatus(String status) {
        return infrastructureRepository.findByStatus(status);
    }

    /**
     * Get infrastructure resources by environment and type
     *
     * @param environment The deployment environment
     * @param type The infrastructure type
     * @return List of infrastructure resources for the specified environment and type
     */
    public List<Infrastructure> getInfrastructureByEnvironmentAndType(String environment, String type) {
        return infrastructureRepository.findByEnvironmentAndType(environment, type);
    }

    /**
     * Update an infrastructure resource
     *
     * @param id The infrastructure ID
     * @param infrastructure The updated infrastructure data
     * @return The updated infrastructure if found
     */
    @Transactional
    public Optional<Infrastructure> updateInfrastructure(String id, Infrastructure infrastructure) {
        return infrastructureRepository.findById(id)
                .map(existingInfrastructure -> {
                    // Update fields
                    if (infrastructure.getName() != null) {
                        existingInfrastructure.setName(infrastructure.getName());
                    }
                    if (infrastructure.getType() != null) {
                        existingInfrastructure.setType(infrastructure.getType());
                    }
                    if (infrastructure.getEnvironment() != null) {
                        existingInfrastructure.setEnvironment(infrastructure.getEnvironment());
                    }
                    if (infrastructure.getStatus() != null) {
                        existingInfrastructure.setStatus(infrastructure.getStatus());
                    }
                    if (infrastructure.getResources() != null) {
                        existingInfrastructure.setResources(infrastructure.getResources());
                    }
                    
                    // Update timestamp
                    existingInfrastructure.setUpdatedAt(LocalDateTime.now());
                    
                    return infrastructureRepository.save(existingInfrastructure);
                });
    }

    /**
     * Update infrastructure status
     *
     * @param id The infrastructure ID
     * @param status The new status
     * @return The updated infrastructure if found
     */
    @Transactional
    public Optional<Infrastructure> updateInfrastructureStatus(String id, String status) {
        return infrastructureRepository.findById(id)
                .map(existingInfrastructure -> {
                    existingInfrastructure.setStatus(status);
                    existingInfrastructure.setUpdatedAt(LocalDateTime.now());
                    return infrastructureRepository.save(existingInfrastructure);
                });
    }

    /**
     * Delete an infrastructure resource
     *
     * @param id The infrastructure ID
     */
    @Transactional
    public void deleteInfrastructure(String id) {
        infrastructureRepository.deleteById(id);
    }

    /**
     * Count infrastructure resources by environment
     *
     * @param environment The deployment environment
     * @return Count of infrastructure resources for the specified environment
     */
    public long countByEnvironment(String environment) {
        return infrastructureRepository.countByEnvironment(environment);
    }

    /**
     * Count infrastructure resources by type
     *
     * @param type The infrastructure type
     * @return Count of infrastructure resources of the specified type
     */
    public long countByType(String type) {
        return infrastructureRepository.countByType(type);
    }

    /**
     * Count infrastructure resources by status
     *
     * @param status The infrastructure status
     * @return Count of infrastructure resources with the specified status
     */
    public long countByStatus(String status) {
        return infrastructureRepository.countByStatus(status);
    }
}
