package ai.lumina.deployment.controller;

import ai.lumina.deployment.model.Infrastructure;
import ai.lumina.deployment.service.InfrastructureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for infrastructure operations
 */
@RestController
@RequestMapping("/api/infrastructure")
public class InfrastructureController {

    private final InfrastructureService infrastructureService;

    @Autowired
    public InfrastructureController(InfrastructureService infrastructureService) {
        this.infrastructureService = infrastructureService;
    }

    /**
     * Create a new infrastructure resource
     *
     * @param infrastructure The infrastructure to create
     * @return The created infrastructure
     */
    @PostMapping
    public ResponseEntity<Infrastructure> createInfrastructure(@RequestBody Infrastructure infrastructure) {
        Infrastructure createdInfrastructure = infrastructureService.createInfrastructure(infrastructure);
        return new ResponseEntity<>(createdInfrastructure, HttpStatus.CREATED);
    }

    /**
     * Get an infrastructure resource by ID
     *
     * @param id The infrastructure ID
     * @return The infrastructure if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Infrastructure> getInfrastructure(@PathVariable String id) {
        return infrastructureService.getInfrastructure(id)
                .map(infrastructure -> new ResponseEntity<>(infrastructure, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Get all infrastructure resources
     *
     * @return List of all infrastructure resources
     */
    @GetMapping
    public ResponseEntity<List<Infrastructure>> getAllInfrastructure() {
        List<Infrastructure> infrastructureList = infrastructureService.getAllInfrastructure();
        return new ResponseEntity<>(infrastructureList, HttpStatus.OK);
    }

    /**
     * Get infrastructure resources by environment
     *
     * @param environment The deployment environment
     * @return List of infrastructure resources for the specified environment
     */
    @GetMapping("/environment/{environment}")
    public ResponseEntity<List<Infrastructure>> getInfrastructureByEnvironment(@PathVariable String environment) {
        List<Infrastructure> infrastructureList = infrastructureService.getInfrastructureByEnvironment(environment);
        return new ResponseEntity<>(infrastructureList, HttpStatus.OK);
    }

    /**
     * Get infrastructure resources by type
     *
     * @param type The infrastructure type
     * @return List of infrastructure resources of the specified type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Infrastructure>> getInfrastructureByType(@PathVariable String type) {
        List<Infrastructure> infrastructureList = infrastructureService.getInfrastructureByType(type);
        return new ResponseEntity<>(infrastructureList, HttpStatus.OK);
    }

    /**
     * Get infrastructure resources by status
     *
     * @param status The infrastructure status
     * @return List of infrastructure resources with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Infrastructure>> getInfrastructureByStatus(@PathVariable String status) {
        List<Infrastructure> infrastructureList = infrastructureService.getInfrastructureByStatus(status);
        return new ResponseEntity<>(infrastructureList, HttpStatus.OK);
    }

    /**
     * Get infrastructure resources by environment and type
     *
     * @param environment The deployment environment
     * @param type The infrastructure type
     * @return List of infrastructure resources for the specified environment and type
     */
    @GetMapping("/environment/{environment}/type/{type}")
    public ResponseEntity<List<Infrastructure>> getInfrastructureByEnvironmentAndType(
            @PathVariable String environment,
            @PathVariable String type) {
        
        List<Infrastructure> infrastructureList = infrastructureService.getInfrastructureByEnvironmentAndType(environment, type);
        return new ResponseEntity<>(infrastructureList, HttpStatus.OK);
    }

    /**
     * Update an infrastructure resource
     *
     * @param id The infrastructure ID
     * @param infrastructure The updated infrastructure data
     * @return The updated infrastructure if found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Infrastructure> updateInfrastructure(
            @PathVariable String id,
            @RequestBody Infrastructure infrastructure) {
        
        return infrastructureService.updateInfrastructure(id, infrastructure)
                .map(updatedInfrastructure -> new ResponseEntity<>(updatedInfrastructure, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update infrastructure status
     *
     * @param id The infrastructure ID
     * @param statusUpdate The status update
     * @return The updated infrastructure if found
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Infrastructure> updateInfrastructureStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        
        String status = statusUpdate.get("status");
        if (status == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        return infrastructureService.updateInfrastructureStatus(id, status)
                .map(updatedInfrastructure -> new ResponseEntity<>(updatedInfrastructure, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete an infrastructure resource
     *
     * @param id The infrastructure ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInfrastructure(@PathVariable String id) {
        infrastructureService.deleteInfrastructure(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Get infrastructure statistics
     *
     * @return Infrastructure statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getInfrastructureStats() {
        long provisioningCount = infrastructureService.countByStatus("PROVISIONING");
        long activeCount = infrastructureService.countByStatus("ACTIVE");
        long updatingCount = infrastructureService.countByStatus("UPDATING");
        long deletingCount = infrastructureService.countByStatus("DELETING");
        long failedCount = infrastructureService.countByStatus("FAILED");
        
        long kubernetesCount = infrastructureService.countByType("KUBERNETES");
        long vmCount = infrastructureService.countByType("VM");
        long serverlessCount = infrastructureService.countByType("SERVERLESS");
        
        long devCount = infrastructureService.countByEnvironment("DEV");
        long stagingCount = infrastructureService.countByEnvironment("STAGING");
        long prodCount = infrastructureService.countByEnvironment("PROD");
        
        Map<String, Object> stats = Map.of(
            "status", Map.of(
                "PROVISIONING", provisioningCount,
                "ACTIVE", activeCount,
                "UPDATING", updatingCount,
                "DELETING", deletingCount,
                "FAILED", failedCount
            ),
            "type", Map.of(
                "KUBERNETES", kubernetesCount,
                "VM", vmCount,
                "SERVERLESS", serverlessCount
            ),
            "environment", Map.of(
                "DEV", devCount,
                "STAGING", stagingCount,
                "PROD", prodCount
            ),
            "total", provisioningCount + activeCount + updatingCount + deletingCount + failedCount
        );
        
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}
