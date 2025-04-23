package ai.lumina.workflow.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ai.lumina.workflow.model.WorkflowDefinition;
import ai.lumina.workflow.model.WorkflowTemplate;
import ai.lumina.workflow.service.WorkflowDefinitionService;

/**
 * REST controller for workflow definitions and templates.
 */
@RestController
@RequestMapping("/api/workflows")
public class WorkflowDefinitionController {

    @Autowired
    private WorkflowDefinitionService workflowDefinitionService;
    
    /**
     * Create a new workflow definition.
     * 
     * @param workflowDefinition The workflow definition to create
     * @param userId The ID of the user creating the workflow
     * @return The created workflow definition
     */
    @PostMapping("/definitions")
    public ResponseEntity<WorkflowDefinition> createWorkflowDefinition(
            @RequestBody WorkflowDefinition workflowDefinition,
            @RequestParam String userId) {
        WorkflowDefinition created = workflowDefinitionService.createWorkflowDefinition(workflowDefinition, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    /**
     * Update an existing workflow definition.
     * 
     * @param id The ID of the workflow definition to update
     * @param workflowDefinition The updated workflow definition
     * @param userId The ID of the user updating the workflow
     * @return The updated workflow definition
     */
    @PutMapping("/definitions/{id}")
    public ResponseEntity<WorkflowDefinition> updateWorkflowDefinition(
            @PathVariable String id,
            @RequestBody WorkflowDefinition workflowDefinition,
            @RequestParam String userId) {
        try {
            WorkflowDefinition updated = workflowDefinitionService.updateWorkflowDefinition(id, workflowDefinition, userId);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * Get a workflow definition by ID.
     * 
     * @param id The ID of the workflow definition
     * @return The workflow definition
     */
    @GetMapping("/definitions/{id}")
    public ResponseEntity<WorkflowDefinition> getWorkflowDefinition(@PathVariable String id) {
        Optional<WorkflowDefinition> workflowDefinition = workflowDefinitionService.getWorkflowDefinition(id);
        return workflowDefinition.map(def -> new ResponseEntity<>(def, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**
     * Get all workflow definitions.
     * 
     * @param activeOnly Whether to return only active workflow definitions
     * @return List of workflow definitions
     */
    @GetMapping("/definitions")
    public ResponseEntity<List<WorkflowDefinition>> getAllWorkflowDefinitions(
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        List<WorkflowDefinition> definitions;
        if (activeOnly) {
            definitions = workflowDefinitionService.getActiveWorkflowDefinitions();
        } else {
            definitions = workflowDefinitionService.getAllWorkflowDefinitions();
        }
        return new ResponseEntity<>(definitions, HttpStatus.OK);
    }
    
    /**
     * Delete a workflow definition.
     * 
     * @param id The ID of the workflow definition to delete
     * @return No content response
     */
    @DeleteMapping("/definitions/{id}")
    public ResponseEntity<Void> deleteWorkflowDefinition(@PathVariable String id) {
        workflowDefinitionService.deleteWorkflowDefinition(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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
    @PostMapping("/definitions/from-template")
    public ResponseEntity<WorkflowDefinition> createFromTemplate(
            @RequestParam String templateId,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String userId) {
        try {
            WorkflowDefinition created = workflowDefinitionService.createFromTemplate(templateId, name, description, userId);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * Create a new workflow template.
     * 
     * @param workflowTemplate The workflow template to create
     * @param userId The ID of the user creating the template
     * @return The created workflow template
     */
    @PostMapping("/templates")
    public ResponseEntity<WorkflowTemplate> createWorkflowTemplate(
            @RequestBody WorkflowTemplate workflowTemplate,
            @RequestParam String userId) {
        try {
            WorkflowTemplate created = workflowDefinitionService.createWorkflowTemplate(workflowTemplate, userId);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Get a workflow template by ID.
     * 
     * @param id The ID of the workflow template
     * @return The workflow template
     */
    @GetMapping("/templates/{id}")
    public ResponseEntity<WorkflowTemplate> getWorkflowTemplate(@PathVariable String id) {
        Optional<WorkflowTemplate> workflowTemplate = workflowDefinitionService.getWorkflowTemplate(id);
        return workflowTemplate.map(template -> new ResponseEntity<>(template, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**
     * Get all workflow templates.
     * 
     * @param publicOnly Whether to return only public workflow templates
     * @return List of workflow templates
     */
    @GetMapping("/templates")
    public ResponseEntity<List<WorkflowTemplate>> getAllWorkflowTemplates(
            @RequestParam(required = false, defaultValue = "false") boolean publicOnly) {
        List<WorkflowTemplate> templates;
        if (publicOnly) {
            templates = workflowDefinitionService.getPublicWorkflowTemplates();
        } else {
            templates = workflowDefinitionService.getAllWorkflowTemplates();
        }
        return new ResponseEntity<>(templates, HttpStatus.OK);
    }
    
    /**
     * Delete a workflow template.
     * 
     * @param id The ID of the workflow template to delete
     * @return No content response
     */
    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteWorkflowTemplate(@PathVariable String id) {
        workflowDefinitionService.deleteWorkflowTemplate(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
