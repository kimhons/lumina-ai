package ai.lumina.workflow.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a transition between workflow steps.
 * A transition defines how the workflow moves from one step to another.
 */
@Document(collection = "workflow_transitions")
public class WorkflowTransition {

    @Id
    private String id;
    private String name;
    private String description;
    private String fromStepId;
    private String toStepId;
    private TransitionType type;
    private String condition;
    private Map<String, Object> metadata;
    private int priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Enum representing the type of transition.
     */
    public enum TransitionType {
        AUTOMATIC,      // Transition happens automatically
        CONDITIONAL,    // Transition happens based on a condition
        USER_DECISION,  // Transition requires user decision
        AGENT_DECISION, // Transition requires agent decision
        ERROR,          // Transition happens on error
        TIMEOUT         // Transition happens on timeout
    }

    /**
     * Default constructor.
     */
    public WorkflowTransition() {
        this.id = UUID.randomUUID().toString();
        this.metadata = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.priority = 0;
    }

    /**
     * Constructor with from and to step IDs.
     * 
     * @param fromStepId The ID of the step this transition comes from
     * @param toStepId   The ID of the step this transition goes to
     * @param type       The type of transition
     */
    public WorkflowTransition(String fromStepId, String toStepId, TransitionType type) {
        this();
        this.fromStepId = fromStepId;
        this.toStepId = toStepId;
        this.type = type;
        this.name = "Transition from " + fromStepId + " to " + toStepId;
    }

    /**
     * Constructor with name, from and to step IDs, and type.
     * 
     * @param name       The name of the transition
     * @param fromStepId The ID of the step this transition comes from
     * @param toStepId   The ID of the step this transition goes to
     * @param type       The type of transition
     */
    public WorkflowTransition(String name, String fromStepId, String toStepId, TransitionType type) {
        this(fromStepId, toStepId, type);
        this.name = name;
    }

    /**
     * Adds metadata to the transition.
     * 
     * @param key   The metadata key
     * @param value The metadata value
     * @return This transition for method chaining
     */
    public WorkflowTransition addMetadata(String key, Object value) {
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

    public String getFromStepId() {
        return fromStepId;
    }

    public void setFromStepId(String fromStepId) {
        this.fromStepId = fromStepId;
    }

    public String getToStepId() {
        return toStepId;
    }

    public void setToStepId(String toStepId) {
        this.toStepId = toStepId;
    }

    public TransitionType getType() {
        return type;
    }

    public void setType(TransitionType type) {
        this.type = type;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
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
