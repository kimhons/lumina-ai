package ai.lumina.provider.controller;

import ai.lumina.provider.model.Tool;
import ai.lumina.provider.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for tool operations
 */
@RestController
@RequestMapping("/api/tools")
public class ToolController {

    private final ToolService toolService;

    @Autowired
    public ToolController(ToolService toolService) {
        this.toolService = toolService;
    }

    /**
     * Create a new tool
     *
     * @param tool The tool to create
     * @return The created tool
     */
    @PostMapping
    public ResponseEntity<Tool> createTool(@RequestBody Tool tool) {
        Tool createdTool = toolService.createTool(tool);
        return new ResponseEntity<>(createdTool, HttpStatus.CREATED);
    }

    /**
     * Get a tool by ID
     *
     * @param id The tool ID
     * @return The tool if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tool> getTool(@PathVariable String id) {
        Tool tool = toolService.getTool(id);
        return new ResponseEntity<>(tool, HttpStatus.OK);
    }

    /**
     * Get all tools
     *
     * @return List of all tools
     */
    @GetMapping
    public ResponseEntity<List<Tool>> getAllTools() {
        List<Tool> tools = toolService.getAllTools();
        return new ResponseEntity<>(tools, HttpStatus.OK);
    }

    /**
     * Get tools by type
     *
     * @param type The tool type
     * @return List of tools of the specified type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Tool>> getToolsByType(@PathVariable Tool.ToolType type) {
        List<Tool> tools = toolService.getToolsByType(type);
        return new ResponseEntity<>(tools, HttpStatus.OK);
    }

    /**
     * Get enabled tools
     *
     * @return List of enabled tools
     */
    @GetMapping("/enabled")
    public ResponseEntity<List<Tool>> getEnabledTools() {
        List<Tool> tools = toolService.getEnabledTools();
        return new ResponseEntity<>(tools, HttpStatus.OK);
    }

    /**
     * Get enabled tools by type
     *
     * @param type The tool type
     * @return List of enabled tools of the specified type
     */
    @GetMapping("/enabled/type/{type}")
    public ResponseEntity<List<Tool>> getEnabledToolsByType(@PathVariable Tool.ToolType type) {
        List<Tool> tools = toolService.getEnabledToolsByType(type);
        return new ResponseEntity<>(tools, HttpStatus.OK);
    }

    /**
     * Get tools that support a specific provider
     *
     * @param providerId The provider ID
     * @return List of tools that support the specified provider
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Tool>> getToolsBySupportedProvider(@PathVariable String providerId) {
        List<Tool> tools = toolService.getToolsBySupportedProvider(providerId);
        return new ResponseEntity<>(tools, HttpStatus.OK);
    }

    /**
     * Get enabled tools that support a specific provider
     *
     * @param providerId The provider ID
     * @return List of enabled tools that support the specified provider
     */
    @GetMapping("/enabled/provider/{providerId}")
    public ResponseEntity<List<Tool>> getEnabledToolsBySupportedProvider(@PathVariable String providerId) {
        List<Tool> tools = toolService.getEnabledToolsBySupportedProvider(providerId);
        return new ResponseEntity<>(tools, HttpStatus.OK);
    }

    /**
     * Get tools by name containing the specified string
     *
     * @param name The name to search for
     * @return List of tools with names containing the specified string
     */
    @GetMapping("/search")
    public ResponseEntity<List<Tool>> getToolsByNameContaining(@RequestParam String name) {
        List<Tool> tools = toolService.getToolsByNameContaining(name);
        return new ResponseEntity<>(tools, HttpStatus.OK);
    }

    /**
     * Update a tool
     *
     * @param id The tool ID
     * @param tool The updated tool data
     * @return The updated tool
     */
    @PutMapping("/{id}")
    public ResponseEntity<Tool> updateTool(
            @PathVariable String id,
            @RequestBody Tool tool) {
        Tool updatedTool = toolService.updateTool(id, tool);
        return new ResponseEntity<>(updatedTool, HttpStatus.OK);
    }

    /**
     * Update tool status
     *
     * @param id The tool ID
     * @param statusUpdate The status update
     * @return The updated tool
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Tool> updateToolStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        Boolean enabled = statusUpdate.get("enabled");
        if (enabled == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Tool updatedTool = toolService.updateToolStatus(id, enabled);
        return new ResponseEntity<>(updatedTool, HttpStatus.OK);
    }

    /**
     * Add a supported provider to a tool
     *
     * @param id The tool ID
     * @param providerData The provider data
     * @return The updated tool
     */
    @PostMapping("/{id}/providers")
    public ResponseEntity<Tool> addSupportedProvider(
            @PathVariable String id,
            @RequestBody Map<String, String> providerData) {
        String providerId = providerData.get("providerId");
        if (providerId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Tool updatedTool = toolService.addSupportedProvider(id, providerId);
        return new ResponseEntity<>(updatedTool, HttpStatus.OK);
    }

    /**
     * Remove a supported provider from a tool
     *
     * @param id The tool ID
     * @param providerId The provider ID
     * @return The updated tool
     */
    @DeleteMapping("/{id}/providers/{providerId}")
    public ResponseEntity<Tool> removeSupportedProvider(
            @PathVariable String id,
            @PathVariable String providerId) {
        Tool updatedTool = toolService.removeSupportedProvider(id, providerId);
        return new ResponseEntity<>(updatedTool, HttpStatus.OK);
    }

    /**
     * Delete a tool
     *
     * @param id The tool ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTool(@PathVariable String id) {
        toolService.deleteTool(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
