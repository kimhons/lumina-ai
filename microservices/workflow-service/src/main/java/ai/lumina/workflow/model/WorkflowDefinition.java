package ai.lumina.workflow.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a workflow definition in the Workflow Orchestration Engine.
 * A workflow definition consists of steps, transitions, and metadata.
 */
@Document(collection = "workflow_definitions")
public class WorkflowDefinition {

    @Id
    private String id;
    private String name;
    private String description;
    private String version;
    private List<WorkflowStep> steps;
    private List<WorkflowTransition> transitions;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private boolean isActive;
    private boolean isTemplate;

    /**
     * Default constructor.
     */
    public WorkflowDefinition() {
        this.id = UUID.randomUUID().toString();
        this.steps = new ArrayList<>();
        this.transitions = new ArrayList<>();
        this.metadata = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
        this.isTemplate = false;
    }

    /**
     * Constructor with name and description.
     * 
     * @param name        The name of the workflow
     * @param description The description of the workflow
     */
    public WorkflowDefinition(String name, String description) {
        this();
        this.name = name;
        this.description = description;
    }

    /**
     * Adds a step to the workflow definition.
     * 
     * @param step The step to add
     * @return This workflow definition for method chaining
     */
    public WorkflowDefinition addStep(WorkflowStep step) {
        this.steps.add(step);
        return this;
    }

    /**
     * Adds a transition to the workflow definition.
     * 
     * @param transition The transition to add
     * @return This workflow definition for method chaining
     */
    public WorkflowDefinition addTransition(WorkflowTransition transition) {
        this.transitions.add(transition);
        return this;
    }

    /**
     * Validates the workflow definition.
     * 
     * @return True if the workflow is valid, false otherwise
     */
    public boolean validate() {
        // Basic validation: must have at least one step
        if (steps.isEmpty()) {
            return false;
        }

        // Check that all transitions reference valid steps
        for (WorkflowTransition transition : transitions) {
            boolean fromStepExists = steps.stream()
                    .anyMatch(step -> step.getId().equals(transition.getFromStepId()));
            boolean toStepExists = steps.stream()
                    .anyMatch(step -> step.getId().equals(transition.getToStepId()));

            if (!fromStepExists || !toStepExists) {
                return false;
            }
        }

        return true;
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

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public List<WorkflowStep> getSteps() {
        return steps;
    }

    public void setSteps(List<WorkflowStep> steps) {
        this.steps = steps;
    }

    public List<WorkflowTransition> getTransitions() {
        return transitions;
    }

    public void setTransitions(List<WorkflowTransition> transitions) {
        this.transitions = transitions;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public boolean isTemplate() {
        return isTemplate;
    }

    public void setTemplate(boolean isTemplate) {
        this.isTemplate = isTemplate;
    }
}
