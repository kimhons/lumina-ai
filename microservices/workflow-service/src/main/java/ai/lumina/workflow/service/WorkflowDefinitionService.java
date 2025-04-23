package ai.lumina.workflow.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ai.lumina.workflow.model.WorkflowDefinition;
import ai.lumina.workflow.model.WorkflowTemplate;
import ai.lumina.workflow.repository.WorkflowDefinitionRepository;
import ai.lumina.workflow.repository.WorkflowTemplateRepository;

/**
 * Service for managing workflow definitions and templates.
 */
@Service
public class WorkflowDefinitionService {

    @Autowired
    private WorkflowDefinitionRepository workflowDefinitionRepository;
    
    @Autowired
    private WorkflowTemplateRepository workflowTemplateRepository;
    
    /**
     * Create a new workflow definition.
     * 
     * @param workflowDefinition The workflow definition to create
     * @param userId The ID of the user creating the workflow
     * @return The created workflow definition
     */
    public WorkflowDefinition createWorkflowDefinition(WorkflowDefinition workflowDefinition, String userId) {
        workflowDefinition.setCreatedBy(userId);
        workflowDefinition.setUpdatedBy(userId);
        workflowDefinition.setCreatedAt(LocalDateTime.now());
        workflowDefinition.setUpdatedAt(LocalDateTime.now());
        
        // Validate the workflow definition
        if (!workflowDefinition.validate()) {
            throw new IllegalArgumentException("Invalid workflow definition");
        }
        
        return workflowDefinitionRepository.save(workflowDefinition);
    }
    
    /**
     * Update an existing workflow definition.
     * 
     * @param id The ID of the workflow definition to update
     * @param workflowDefinition The updated workflow definition
     * @param userId The ID of the user updating the workflow
     * @return The updated workflow definition
     */
    public WorkflowDefinition updateWorkflowDefinition(String id, WorkflowDefinition workflowDefinition, String userId) {
        Optional<WorkflowDefinition> existingOpt = workflowDefinitionRepository.findById(id);
        if (!existingOpt.isPresent()) {
            throw new IllegalArgumentException("Workflow definition not found: " + id);
        }
        
        WorkflowDefinition existing = existingOpt.get();
        
        // Update fields
        existing.setName(workflowDefinition.getName());
        existing.setDescription(workflowDefinition.getDescription());
        existing.setSteps(workflowDefinition.getSteps());
        existing.setTransitions(workflowDefinition.getTransitions());
        existing.setMetadata(workflowDefinition.getMetadata());
        existing.setActive(workflowDefinition.isActive());
        existing.setTemplate(workflowDefinition.isTemplate());
        existing.setUpdatedBy(userId);
        existing.setUpdatedAt(LocalDateTime.now());
        
        // Validate the workflow definition
        if (!existing.validate()) {
            throw new IllegalArgumentException("Invalid workflow definition");
        }
        
        return workflowDefinitionRepository.save(existing);
    }
    
    /**
     * Get a workflow definition by ID.
     * 
     * @param id The ID of the workflow definition
     * @return The workflow definition
     */
    public Optional<WorkflowDefinition> getWorkflowDefinition(String id) {
        return workflowDefinitionRepository.findById(id);
    }
    
    /**
     * Get all workflow definitions.
     * 
     * @return List of all workflow definitions
     */
    public List<WorkflowDefinition> getAllWorkflowDefinitions() {
        return workflowDefinitionRepository.findAll();
    }
    
    /**
     * Get active workflow definitions.
     * 
     * @return List of active workflow definitions
     */
    public List<WorkflowDefinition> getActiveWorkflowDefinitions() {
        return workflowDefinitionRepository.findByIsActiveTrue();
    }
    
    /**
     * Delete a workflow definition.
     * 
     * @param id The ID of the workflow definition to delete
     */
    public void deleteWorkflowDefinition(String id) {
        workflowDefinitionRepository.deleteById(id);
    }
    
    /**
     * Create a workflow definition from a template.
     * 
     * @param templateId The ID of the template to use
     * @param name The name for the new workflow definition
     * @param description The description for the new workflow definition
     * @param userId The ID of the user creating the workflow
     * @return The created workflow definition
     */
    public WorkflowDefinition createFromTemplate(String templateId, String name, String description, String userId) {
        Optional<WorkflowTemplate> templateOpt = workflowTemplateRepository.findById(templateId);
        if (!templateOpt.isPresent()) {
            throw new IllegalArgumentException("Workflow template not found: " + templateId);
        }
        
        WorkflowTemplate template = templateOpt.get();
        WorkflowDefinition newDefinition = template.createDefinition(name, description);
        newDefinition.setCreatedBy(userId);
        newDefinition.setUpdatedBy(userId);
        
        return workflowDefinitionRepository.save(newDefinition);
    }
    
    /**
     * Create a new workflow template.
     * 
     * @param workflowTemplate The workflow template to create
     * @param userId The ID of the user creating the template
     * @return The created workflow template
     */
    public WorkflowTemplate createWorkflowTemplate(WorkflowTemplate workflowTemplate, String userId) {
        workflowTemplate.setCreatedBy(userId);
        workflowTemplate.setUpdatedBy(userId);
        workflowTemplate.setCreatedAt(LocalDateTime.now());
        workflowTemplate.setUpdatedAt(LocalDateTime.now());
        
        // Validate the template's workflow definition
        if (!workflowTemplate.getDefinition().validate()) {
            throw new IllegalArgumentException("Invalid workflow definition in template");
        }
        
        return workflowTemplateRepository.save(workflowTemplate);
    }
    
    /**
     * Get a workflow template by ID.
     * 
     * @param id The ID of the workflow template
     * @return The workflow template
     */
    public Optional<WorkflowTemplate> getWorkflowTemplate(String id) {
        return workflowTemplateRepository.findById(id);
    }
    
    /**
     * Get all workflow templates.
     * 
     * @return List of all workflow templates
     */
    public List<WorkflowTemplate> getAllWorkflowTemplates() {
        return workflowTemplateRepository.findAll();
    }
    
    /**
     * Get public workflow templates.
     * 
     * @return List of public workflow templates
     */
    public List<WorkflowTemplate> getPublicWorkflowTemplates() {
        return workflowTemplateRepository.findByIsPublicTrue();
    }
    
    /**
     * Delete a workflow template.
     * 
     * @param id The ID of the workflow template to delete
     */
    public void deleteWorkflowTemplate(String id) {
        workflowTemplateRepository.deleteById(id);
    }
}
