package ai.lumina.workflow.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a reusable workflow template.
 * Templates can be used to create new workflow definitions quickly.
 */
@Document(collection = "workflow_templates")
public class WorkflowTemplate {

    @Id
    private String id;
    private String name;
    private String description;
    private String category;
    private WorkflowDefinition definition;
    private Map<String, Object> defaultParameters;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private boolean isPublic;
    private int version;

    /**
     * Default constructor.
     */
    public WorkflowTemplate() {
        this.id = UUID.randomUUID().toString();
        this.defaultParameters = new HashMap<>();
        this.metadata = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isPublic = false;
        this.version = 1;
    }

    /**
     * Constructor with name, description, and definition.
     * 
     * @param name        The name of the template
     * @param description The description of the template
     * @param definition  The workflow definition
     */
    public WorkflowTemplate(String name, String description, WorkflowDefinition definition) {
        this();
        this.name = name;
        this.description = description;
        this.definition = definition;
    }

    /**
     * Creates a new workflow definition from this template.
     * 
     * @param newName        The name for the new workflow definition
     * @param newDescription The description for the new workflow definition
     * @return A new workflow definition based on this template
     */
    public WorkflowDefinition createDefinition(String newName, String newDescription) {
        WorkflowDefinition newDefinition = new WorkflowDefinition(newName, newDescription);
        
        // Copy steps and transitions from the template
        for (WorkflowStep step : definition.getSteps()) {
            WorkflowStep newStep = new WorkflowStep();
            // Copy properties from the template step
            newStep.setName(step.getName());
            newStep.setDescription(step.getDescription());
            newStep.setType(step.getType());
            newStep.setAgentRoleRequired(step.getAgentRoleRequired());
            newStep.setParameters(new HashMap<>(step.getParameters()));
            newStep.setMetadata(new HashMap<>(step.getMetadata()));
            newStep.setTimeoutSeconds(step.getTimeoutSeconds());
            newStep.setRetryLimit(step.getRetryLimit());
            
            newDefinition.addStep(newStep);
        }
        
        for (WorkflowTransition transition : definition.getTransitions()) {
            WorkflowTransition newTransition = new WorkflowTransition();
            // Copy properties from the template transition
            newTransition.setName(transition.getName());
            newTransition.setDescription(transition.getDescription());
            newTransition.setFromStepId(transition.getFromStepId());
            newTransition.setToStepId(transition.getToStepId());
            newTransition.setType(transition.getType());
            newTransition.setCondition(transition.getCondition());
            newTransition.setMetadata(new HashMap<>(transition.getMetadata()));
            newTransition.setPriority(transition.getPriority());
            
            newDefinition.addTransition(newTransition);
        }
        
        // Apply default parameters
        newDefinition.setMetadata(new HashMap<>(this.defaultParameters));
        
        return newDefinition;
    }

    /**
     * Adds a default parameter to the template.
     * 
     * @param key   The parameter key
     * @param value The parameter value
     * @return This template for method chaining
     */
    public WorkflowTemplate addDefaultParameter(String key, Object value) {
        this.defaultParameters.put(key, value);
        return this;
    }

    /**
     * Adds metadata to the template.
     * 
     * @param key   The metadata key
     * @param value The metadata value
     * @return This template for method chaining
     */
    public WorkflowTemplate addMetadata(String key, Object value) {
        this.metadata.put(key, value);
        return this;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public WorkflowDefinition getDefinition() {
        return definition;
    }

    public void setDefinition(WorkflowDefinition definition) {
        this.definition = definition;
    }

    public Map<String, Object> getDefaultParameters() {
        return defaultParameters;
    }

    public void setDefaultParameters(Map<String, Object> defaultParameters) {
        this.defaultParameters = defaultParameters;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }
}
