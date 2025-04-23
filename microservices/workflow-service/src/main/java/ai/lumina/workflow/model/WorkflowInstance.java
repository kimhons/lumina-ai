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
 * Represents a runtime instance of a workflow definition.
 * A workflow instance tracks the execution state of a workflow.
 */
@Document(collection = "workflow_instances")
public class WorkflowInstance {

    @Id
    private String id;
    private String workflowDefinitionId;
    private String name;
    private WorkflowStatus status;
    private String currentStepId;
    private List<StepExecution> stepExecutions;
    private Map<String, Object> context;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String createdBy;
    private int priority;
    private String errorMessage;
    private int attemptCount;

    /**
     * Enum representing the status of a workflow instance.
     */
    public enum WorkflowStatus {
        CREATED,    // Workflow instance created but not started
        RUNNING,    // Workflow instance is running
        PAUSED,     // Workflow instance is paused
        COMPLETED,  // Workflow instance completed successfully
        FAILED,     // Workflow instance failed
        CANCELLED   // Workflow instance was cancelled
    }

    /**
     * Default constructor.
     */
    public WorkflowInstance() {
        this.id = UUID.randomUUID().toString();
        this.stepExecutions = new ArrayList<>();
        this.context = new HashMap<>();
        this.metadata = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = WorkflowStatus.CREATED;
        this.priority = 0;
        this.attemptCount = 0;
    }

    /**
     * Constructor with workflow definition ID.
     * 
     * @param workflowDefinitionId The ID of the workflow definition
     * @param name The name of the workflow instance
     * @param createdBy The ID of the user creating the workflow instance
     */
    public WorkflowInstance(String workflowDefinitionId, String name, String createdBy) {
        this();
        this.workflowDefinitionId = workflowDefinitionId;
        this.name = name;
        this.createdBy = createdBy;
    }

    /**
     * Adds a step execution to the workflow instance.
     * 
     * @param stepExecution The step execution to add
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance addStepExecution(StepExecution stepExecution) {
        this.stepExecutions.add(stepExecution);
        return this;
    }

    /**
     * Adds context data to the workflow instance.
     * 
     * @param key The context key
     * @param value The context value
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance addContext(String key, Object value) {
        this.context.put(key, value);
        return this;
    }

    /**
     * Adds metadata to the workflow instance.
     * 
     * @param key The metadata key
     * @param value The metadata value
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance addMetadata(String key, Object value) {
        this.metadata.put(key, value);
        return this;
    }

    /**
     * Starts the workflow instance.
     * 
     * @param firstStepId The ID of the first step
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance start(String firstStepId) {
        if (this.status != WorkflowStatus.CREATED) {
            throw new IllegalStateException("Workflow instance already started");
        }
        
        this.status = WorkflowStatus.RUNNING;
        this.currentStepId = firstStepId;
        this.startedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Completes the workflow instance.
     * 
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance complete() {
        if (this.status != WorkflowStatus.RUNNING) {
            throw new IllegalStateException("Workflow instance not running");
        }
        
        this.status = WorkflowStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Fails the workflow instance.
     * 
     * @param errorMessage The error message
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance fail(String errorMessage) {
        this.status = WorkflowStatus.FAILED;
        this.errorMessage = errorMessage;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Pauses the workflow instance.
     * 
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance pause() {
        if (this.status != WorkflowStatus.RUNNING) {
            throw new IllegalStateException("Workflow instance not running");
        }
        
        this.status = WorkflowStatus.PAUSED;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Resumes the workflow instance.
     * 
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance resume() {
        if (this.status != WorkflowStatus.PAUSED) {
            throw new IllegalStateException("Workflow instance not paused");
        }
        
        this.status = WorkflowStatus.RUNNING;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Cancels the workflow instance.
     * 
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance cancel() {
        if (this.status == WorkflowStatus.COMPLETED || this.status == WorkflowStatus.FAILED) {
            throw new IllegalStateException("Workflow instance already finished");
        }
        
        this.status = WorkflowStatus.CANCELLED;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Transitions to a new step.
     * 
     * @param stepId The ID of the new step
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance transitionTo(String stepId) {
        if (this.status != WorkflowStatus.RUNNING) {
            throw new IllegalStateException("Workflow instance not running");
        }
        
        this.currentStepId = stepId;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Increments the attempt count.
     * 
     * @return This workflow instance for method chaining
     */
    public WorkflowInstance incrementAttempt() {
        this.attemptCount++;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getWorkflowDefinitionId() {
        return workflowDefinitionId;
    }

    public void setWorkflowDefinitionId(String workflowDefinitionId) {
        this.workflowDefinitionId = workflowDefinitionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public WorkflowStatus getStatus() {
        return status;
    }

    public void setStatus(WorkflowStatus status) {
        this.status = status;
    }

    public String getCurrentStepId() {
        return currentStepId;
    }

    public void setCurrentStepId(String currentStepId) {
        this.currentStepId = currentStepId;
    }

    public List<StepExecution> getStepExecutions() {
        return stepExecutions;
    }

    public void setStepExecutions(List<StepExecution> stepExecutions) {
        this.stepExecutions = stepExecutions;
    }

    public Map<String, Object> getContext() {
        return context;
    }

    public void setContext(Map<String, Object> context) {
        this.context = context;
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

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(int attemptCount) {
        this.attemptCount = attemptCount;
    }
}
