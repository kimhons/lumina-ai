package ai.lumina.provider.service;

import ai.lumina.provider.model.Tool;
import ai.lumina.provider.repository.ToolRepository;
import ai.lumina.provider.exception.ToolNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing AI tools
 */
@Service
public class ToolService {

    private final ToolRepository toolRepository;

    @Autowired
    public ToolService(ToolRepository toolRepository) {
        this.toolRepository = toolRepository;
    }

    /**
     * Create a new tool
     *
     * @param tool The tool to create
     * @return The created tool
     */
    @Transactional
    public Tool createTool(Tool tool) {
        // Generate ID if not provided
        if (tool.getId() == null || tool.getId().isEmpty()) {
            tool.setId(UUID.randomUUID().toString());
        }
        
        // Set timestamps
        tool.setCreatedAt(LocalDateTime.now());
        tool.setUpdatedAt(LocalDateTime.now());
        
        return toolRepository.save(tool);
    }

    /**
     * Get a tool by ID
     *
     * @param id The tool ID
     * @return The tool if found
     * @throws ToolNotFoundException if tool not found
     */
    public Tool getTool(String id) {
        return toolRepository.findById(id)
                .orElseThrow(() -> new ToolNotFoundException("Tool not found with ID: " + id));
    }

    /**
     * Get a tool by ID (optional version)
     *
     * @param id The tool ID
     * @return Optional containing the tool if found
     */
    public Optional<Tool> findTool(String id) {
        return toolRepository.findById(id);
    }

    /**
     * Get all tools
     *
     * @return List of all tools
     */
    public List<Tool> getAllTools() {
        return toolRepository.findAll();
    }

    /**
     * Get tools by type
     *
     * @param type The tool type
     * @return List of tools of the specified type
     */
    public List<Tool> getToolsByType(Tool.ToolType type) {
        return toolRepository.findByType(type);
    }

    /**
     * Get enabled tools
     *
     * @return List of enabled tools
     */
    public List<Tool> getEnabledTools() {
        return toolRepository.findByEnabledTrue();
    }

    /**
     * Get enabled tools by type
     *
     * @param type The tool type
     * @return List of enabled tools of the specified type
     */
    public List<Tool> getEnabledToolsByType(Tool.ToolType type) {
        return toolRepository.findByTypeAndEnabledTrue(type);
    }

    /**
     * Get tools that support a specific provider
     *
     * @param providerId The provider ID
     * @return List of tools that support the specified provider
     */
    public List<Tool> getToolsBySupportedProvider(String providerId) {
        return toolRepository.findBySupportedProvider(providerId);
    }

    /**
     * Get enabled tools that support a specific provider
     *
     * @param providerId The provider ID
     * @return List of enabled tools that support the specified provider
     */
    public List<Tool> getEnabledToolsBySupportedProvider(String providerId) {
        return toolRepository.findBySupportedProviderAndEnabledTrue(providerId);
    }

    /**
     * Get tools by name containing the specified string (case insensitive)
     *
     * @param name The name to search for
     * @return List of tools with names containing the specified string
     */
    public List<Tool> getToolsByNameContaining(String name) {
        return toolRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Update a tool
     *
     * @param id The tool ID
     * @param tool The updated tool data
     * @return The updated tool
     * @throws ToolNotFoundException if tool not found
     */
    @Transactional
    public Tool updateTool(String id, Tool tool) {
        Tool existingTool = getTool(id);
        
        // Update fields
        if (tool.getName() != null) {
            existingTool.setName(tool.getName());
        }
        if (tool.getDescription() != null) {
            existingTool.setDescription(tool.getDescription());
        }
        if (tool.getType() != null) {
            existingTool.setType(tool.getType());
        }
        if (tool.getApiSchema() != null) {
            existingTool.setApiSchema(tool.getApiSchema());
        }
        if (tool.getImplementationClass() != null) {
            existingTool.setImplementationClass(tool.getImplementationClass());
        }
        if (tool.getEndpointUrl() != null) {
            existingTool.setEndpointUrl(tool.getEndpointUrl());
        }
        if (tool.getSupportedProviders() != null && !tool.getSupportedProviders().isEmpty()) {
            existingTool.setSupportedProviders(tool.getSupportedProviders());
        }
        
        existingTool.setEnabled(tool.isEnabled());
        
        // Update timestamp
        existingTool.setUpdatedAt(LocalDateTime.now());
        
        return toolRepository.save(existingTool);
    }

    /**
     * Update tool status (enabled/disabled)
     *
     * @param id The tool ID
     * @param enabled The enabled status
     * @return The updated tool
     * @throws ToolNotFoundException if tool not found
     */
    @Transactional
    public Tool updateToolStatus(String id, boolean enabled) {
        Tool tool = getTool(id);
        tool.setEnabled(enabled);
        tool.setUpdatedAt(LocalDateTime.now());
        return toolRepository.save(tool);
    }

    /**
     * Add a supported provider to a tool
     *
     * @param id The tool ID
     * @param providerId The provider ID to add
     * @return The updated tool
     * @throws ToolNotFoundException if tool not found
     */
    @Transactional
    public Tool addSupportedProvider(String id, String providerId) {
        Tool tool = getTool(id);
        tool.addSupportedProvider(providerId);
        tool.setUpdatedAt(LocalDateTime.now());
        return toolRepository.save(tool);
    }

    /**
     * Remove a supported provider from a tool
     *
     * @param id The tool ID
     * @param providerId The provider ID to remove
     * @return The updated tool
     * @throws ToolNotFoundException if tool not found
     */
    @Transactional
    public Tool removeSupportedProvider(String id, String providerId) {
        Tool tool = getTool(id);
        tool.getSupportedProviders().remove(providerId);
        tool.setUpdatedAt(LocalDateTime.now());
        return toolRepository.save(tool);
    }

    /**
     * Delete a tool
     *
     * @param id The tool ID
     * @throws ToolNotFoundException if tool not found
     */
    @Transactional
    public void deleteTool(String id) {
        if (!toolRepository.existsById(id)) {
            throw new ToolNotFoundException("Tool not found with ID: " + id);
        }
        toolRepository.deleteById(id);
    }
}
