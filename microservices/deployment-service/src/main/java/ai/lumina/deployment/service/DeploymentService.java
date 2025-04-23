package ai.lumina.deployment.service;

import ai.lumina.deployment.model.Deployment;
import ai.lumina.deployment.model.DeploymentComponent;
import ai.lumina.deployment.repository.DeploymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing deployments
 */
@Service
public class DeploymentService {

    private final DeploymentRepository deploymentRepository;

    @Autowired
    public DeploymentService(DeploymentRepository deploymentRepository) {
        this.deploymentRepository = deploymentRepository;
    }

    /**
     * Create a new deployment
     *
     * @param deployment The deployment to create
     * @return The created deployment
     */
    @Transactional
    public Deployment createDeployment(Deployment deployment) {
        // Generate ID if not provided
        if (deployment.getId() == null || deployment.getId().isEmpty()) {
            deployment.setId(UUID.randomUUID().toString());
        }
        
        // Set creation timestamp
        deployment.setCreatedAt(LocalDateTime.now());
        
        // Set initial status if not provided
        if (deployment.getStatus() == null || deployment.getStatus().isEmpty()) {
            deployment.setStatus("PENDING");
        }
        
        return deploymentRepository.save(deployment);
    }

    /**
     * Get a deployment by ID
     *
     * @param id The deployment ID
     * @return The deployment if found
     */
    public Optional<Deployment> getDeployment(String id) {
        return deploymentRepository.findById(id);
    }

    /**
     * Get all deployments
     *
     * @return List of all deployments
     */
    public List<Deployment> getAllDeployments() {
        return deploymentRepository.findAll();
    }

    /**
     * Get deployments by environment
     *
     * @param environment The deployment environment
     * @return List of deployments for the specified environment
     */
    public List<Deployment> getDeploymentsByEnvironment(String environment) {
        return deploymentRepository.findByEnvironment(environment);
    }

    /**
     * Get deployments by status
     *
     * @param status The deployment status
     * @return List of deployments with the specified status
     */
    public List<Deployment> getDeploymentsByStatus(String status) {
        return deploymentRepository.findByStatus(status);
    }

    /**
     * Get recent deployments
     *
     * @param limit The maximum number of deployments to return
     * @return List of recent deployments
     */
    public List<Deployment> getRecentDeployments(int limit) {
        return deploymentRepository.findRecentDeployments(limit);
    }

    /**
     * Update a deployment
     *
     * @param id The deployment ID
     * @param deployment The updated deployment data
     * @return The updated deployment if found
     */
    @Transactional
    public Optional<Deployment> updateDeployment(String id, Deployment deployment) {
        return deploymentRepository.findById(id)
                .map(existingDeployment -> {
                    // Update fields
                    if (deployment.getName() != null) {
                        existingDeployment.setName(deployment.getName());
                    }
                    if (deployment.getDescription() != null) {
                        existingDeployment.setDescription(deployment.getDescription());
                    }
                    if (deployment.getStatus() != null) {
                        existingDeployment.setStatus(deployment.getStatus());
                    }
                    if (deployment.getEnvironment() != null) {
                        existingDeployment.setEnvironment(deployment.getEnvironment());
                    }
                    if (deployment.getStrategy() != null) {
                        existingDeployment.setStrategy(deployment.getStrategy());
                    }
                    if (deployment.getComponents() != null) {
                        existingDeployment.setComponents(deployment.getComponents());
                    }
                    if (deployment.getMetadata() != null) {
                        existingDeployment.setMetadata(deployment.getMetadata());
                    }
                    
                    // Update timestamps based on status
                    if ("IN_PROGRESS".equals(deployment.getStatus()) && existingDeployment.getStartedAt() == null) {
                        existingDeployment.setStartedAt(LocalDateTime.now());
                    }
                    if (("COMPLETED".equals(deployment.getStatus()) || "FAILED".equals(deployment.getStatus()) || 
                         "CANCELLED".equals(deployment.getStatus())) && existingDeployment.getCompletedAt() == null) {
                        existingDeployment.setCompletedAt(LocalDateTime.now());
                    }
                    
                    return deploymentRepository.save(existingDeployment);
                });
    }

    /**
     * Update deployment status
     *
     * @param id The deployment ID
     * @param status The new status
     * @return The updated deployment if found
     */
    @Transactional
    public Optional<Deployment> updateDeploymentStatus(String id, String status) {
        return deploymentRepository.findById(id)
                .map(existingDeployment -> {
                    existingDeployment.setStatus(status);
                    
                    // Update timestamps based on status
                    if ("IN_PROGRESS".equals(status) && existingDeployment.getStartedAt() == null) {
                        existingDeployment.setStartedAt(LocalDateTime.now());
                    }
                    if (("COMPLETED".equals(status) || "FAILED".equals(status) || 
                         "CANCELLED".equals(status)) && existingDeployment.getCompletedAt() == null) {
                        existingDeployment.setCompletedAt(LocalDateTime.now());
                    }
                    
                    return deploymentRepository.save(existingDeployment);
                });
    }

    /**
     * Update component status
     *
     * @param deploymentId The deployment ID
     * @param componentId The component ID
     * @param status The new status
     * @return The updated deployment if found
     */
    @Transactional
    public Optional<Deployment> updateComponentStatus(String deploymentId, String componentId, String status) {
        return deploymentRepository.findById(deploymentId)
                .map(deployment -> {
                    deployment.getComponents().stream()
                            .filter(component -> componentId.equals(component.getId()))
                            .findFirst()
                            .ifPresent(component -> component.setStatus(status));
                    
                    return deploymentRepository.save(deployment);
                });
    }

    /**
     * Add a component to a deployment
     *
     * @param deploymentId The deployment ID
     * @param component The component to add
     * @return The updated deployment if found
     */
    @Transactional
    public Optional<Deployment> addComponent(String deploymentId, DeploymentComponent component) {
        return deploymentRepository.findById(deploymentId)
                .map(deployment -> {
                    // Generate ID if not provided
                    if (component.getId() == null || component.getId().isEmpty()) {
                        component.setId(UUID.randomUUID().toString());
                    }
                    
                    // Set initial status if not provided
                    if (component.getStatus() == null || component.getStatus().isEmpty()) {
                        component.setStatus("PENDING");
                    }
                    
                    deployment.getComponents().add(component);
                    return deploymentRepository.save(deployment);
                });
    }

    /**
     * Delete a deployment
     *
     * @param id The deployment ID
     */
    @Transactional
    public void deleteDeployment(String id) {
        deploymentRepository.deleteById(id);
    }

    /**
     * Count deployments by environment
     *
     * @param environment The deployment environment
     * @return Count of deployments for the specified environment
     */
    public long countByEnvironment(String environment) {
        return deploymentRepository.countByEnvironment(environment);
    }

    /**
     * Count deployments by status
     *
     * @param status The deployment status
     * @return Count of deployments with the specified status
     */
    public long countByStatus(String status) {
        return deploymentRepository.countByStatus(status);
    }
}
