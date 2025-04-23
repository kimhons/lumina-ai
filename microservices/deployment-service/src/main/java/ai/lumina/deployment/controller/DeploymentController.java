package ai.lumina.deployment.controller;

import ai.lumina.deployment.model.Deployment;
import ai.lumina.deployment.model.DeploymentComponent;
import ai.lumina.deployment.service.DeploymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for deployment operations
 */
@RestController
@RequestMapping("/api/deployments")
public class DeploymentController {

    private final DeploymentService deploymentService;

    @Autowired
    public DeploymentController(DeploymentService deploymentService) {
        this.deploymentService = deploymentService;
    }

    /**
     * Create a new deployment
     *
     * @param deployment The deployment to create
     * @return The created deployment
     */
    @PostMapping
    public ResponseEntity<Deployment> createDeployment(@RequestBody Deployment deployment) {
        Deployment createdDeployment = deploymentService.createDeployment(deployment);
        return new ResponseEntity<>(createdDeployment, HttpStatus.CREATED);
    }

    /**
     * Get a deployment by ID
     *
     * @param id The deployment ID
     * @return The deployment if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Deployment> getDeployment(@PathVariable String id) {
        return deploymentService.getDeployment(id)
                .map(deployment -> new ResponseEntity<>(deployment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get all deployments
     *
     * @return List of all deployments
     */
    @GetMapping
    public ResponseEntity<List<Deployment>> getAllDeployments() {
        List<Deployment> deployments = deploymentService.getAllDeployments();
        return new ResponseEntity<>(deployments, HttpStatus.OK);
    }

    /**
     * Get deployments by environment
     *
     * @param environment The deployment environment
     * @return List of deployments for the specified environment
     */
    @GetMapping("/environment/{environment}")
    public ResponseEntity<List<Deployment>> getDeploymentsByEnvironment(@PathVariable String environment) {
        List<Deployment> deployments = deploymentService.getDeploymentsByEnvironment(environment);
        return new ResponseEntity<>(deployments, HttpStatus.OK);
    }

    /**
     * Get deployments by status
     *
     * @param status The deployment status
     * @return List of deployments with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Deployment>> getDeploymentsByStatus(@PathVariable String status) {
        List<Deployment> deployments = deploymentService.getDeploymentsByStatus(status);
        return new ResponseEntity<>(deployments, HttpStatus.OK);
    }

    /**
     * Get recent deployments
     *
     * @param limit The maximum number of deployments to return
     * @return List of recent deployments
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Deployment>> getRecentDeployments(@RequestParam(defaultValue = "10") int limit) {
        List<Deployment> deployments = deploymentService.getRecentDeployments(limit);
        return new ResponseEntity<>(deployments, HttpStatus.OK);
    }

    /**
     * Update a deployment
     *
     * @param id The deployment ID
     * @param deployment The updated deployment data
     * @return The updated deployment if found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Deployment> updateDeployment(@PathVariable String id, @RequestBody Deployment deployment) {
        return deploymentService.updateDeployment(id, deployment)
                .map(updatedDeployment -> new ResponseEntity<>(updatedDeployment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update deployment status
     *
     * @param id The deployment ID
     * @param statusUpdate The status update
     * @return The updated deployment if found
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Deployment> updateDeploymentStatus(@PathVariable String id, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        return deploymentService.updateDeploymentStatus(id, status)
                .map(updatedDeployment -> new ResponseEntity<>(updatedDeployment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update component status
     *
     * @param deploymentId The deployment ID
     * @param componentId The component ID
     * @param statusUpdate The status update
     * @return The updated deployment if found
     */
    @PatchMapping("/{deploymentId}/components/{componentId}/status")
    public ResponseEntity<Deployment> updateComponentStatus(
            @PathVariable String deploymentId,
            @PathVariable String componentId,
            @RequestBody Map<String, String> statusUpdate) {
        
        String status = statusUpdate.get("status");
        if (status == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        return deploymentService.updateComponentStatus(deploymentId, componentId, status)
                .map(updatedDeployment -> new ResponseEntity<>(updatedDeployment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Add a component to a deployment
     *
     * @param deploymentId The deployment ID
     * @param component The component to add
     * @return The updated deployment if found
     */
    @PostMapping("/{deploymentId}/components")
    public ResponseEntity<Deployment> addComponent(
            @PathVariable String deploymentId,
            @RequestBody DeploymentComponent component) {
        
        return deploymentService.addComponent(deploymentId, component)
                .map(updatedDeployment -> new ResponseEntity<>(updatedDeployment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete a deployment
     *
     * @param id The deployment ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeployment(@PathVariable String id) {
        deploymentService.deleteDeployment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Get deployment statistics
     *
     * @return Deployment statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDeploymentStats() {
        long pendingCount = deploymentService.countByStatus("PENDING");
        long inProgressCount = deploymentService.countByStatus("IN_PROGRESS");
        long completedCount = deploymentService.countByStatus("COMPLETED");
        long failedCount = deploymentService.countByStatus("FAILED");
        long cancelledCount = deploymentService.countByStatus("CANCELLED");
        
        long devCount = deploymentService.countByEnvironment("DEV");
        long stagingCount = deploymentService.countByEnvironment("STAGING");
        long prodCount = deploymentService.countByEnvironment("PROD");
        
        Map<String, Object> stats = Map.of(
            "status", Map.of(
                "PENDING", pendingCount,
                "IN_PROGRESS", inProgressCount,
                "COMPLETED", completedCount,
                "FAILED", failedCount,
                "CANCELLED", cancelledCount
            ),
            "environment", Map.of(
                "DEV", devCount,
                "STAGING", stagingCount,
                "PROD", prodCount
            ),
            "total", pendingCount + inProgressCount + completedCount + failedCount + cancelledCount
        );
        
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}
