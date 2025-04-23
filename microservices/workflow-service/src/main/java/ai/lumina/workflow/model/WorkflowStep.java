package ai.lumina.workflow.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a step in a workflow definition.
 * A workflow step defines a single unit of work that can be assigned to an agent.
 */
@Document(collection = "workflow_steps")
public class WorkflowStep {

    @Id
    private String id;
    private String name;
    private String description;
    private StepType type;
    private String agentRoleRequired;
    private Map<String, Object> parameters;
    private Map<String, Object> metadata;
    private int timeoutSeconds;
    private int retryLimit;
    private String errorHandlingStepId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Enum representing the type of workflow step.
     */
    public enum StepType {
        TASK,           // A task to be performed by an agent
        DECISION,       // A decision point in the workflow
        NOTIFICATION,   // A notification step
        INTEGRATION,    // Integration with external system
        SUBPROCESS,     // A reference to another workflow
        START,          // Start of workflow
        END             // End of workflow
    }

    /**
     * Default constructor.
     */
    public WorkflowStep() {
        this.id = UUID.randomUUID().toString();
        this.parameters = new HashMap<>();
        this.metadata = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.timeoutSeconds = 300; // Default 5 minute timeout
        this.retryLimit = 3;       // Default 3 retries
    }

    /**
     * Constructor with name, description, and type.
     * 
     * @param name        The name of the step
     * @param description The description of the step
     * @param type        The type of the step
     */
    public WorkflowStep(String name, String description, StepType type) {
        this();
        this.name = name;
        this.description = description;
        this.type = type;
    }

    /**
     * Adds a parameter to the step.
     * 
     * @param key   The parameter key
     * @param value The parameter value
     * @return This step for method chaining
     */
    public WorkflowStep addParameter(String key, Object value) {
        this.parameters.put(key, value);
        return this;
    }

    /**
     * Adds metadata to the step.
     * 
     * @param key   The metadata key
     * @param value The metadata value
     * @return This step for method chaining
     */
    public WorkflowStep addMetadata(String key, Object value) {
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

    public StepType getType() {
        return type;
    }

    public void setType(StepType type) {
        this.type = type;
    }

    public String getAgentRoleRequired() {
        return agentRoleRequired;
    }

    public void setAgentRoleRequired(String agentRoleRequired) {
        this.agentRoleRequired = agentRoleRequired;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }

    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public int getTimeoutSeconds() {
        return timeoutSeconds;
    }

    public void setTimeoutSeconds(int timeoutSeconds) {
        this.timeoutSeconds = timeoutSeconds;
    }

    public int getRetryLimit() {
        return retryLimit;
    }

    public void setRetryLimit(int retryLimit) {
        this.retryLimit = retryLimit;
    }

    public String getErrorHandlingStepId() {
        return errorHandlingStepId;
    }

    public void setErrorHandlingStepId(String errorHandlingStepId) {
        this.errorHandlingStepId = errorHandlingStepId;
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
}
