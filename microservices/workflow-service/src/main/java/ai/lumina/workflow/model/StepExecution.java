package ai.lumina.workflow.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a runtime execution of a workflow step.
 * A step execution tracks the execution state of a single step in a workflow.
 */
@Document(collection = "step_executions")
public class StepExecution {

    @Id
    private String id;
    private String workflowInstanceId;
    private String stepId;
    private String stepName;
    private StepStatus status;
    private String assignedAgentId;
    private String assignedAgentRole;
    private Map<String, Object> input;
    private Map<String, Object> output;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private int attemptCount;
    private String errorMessage;
    private int timeoutSeconds;

    /**
     * Enum representing the status of a step execution.
     */
    public enum StepStatus {
        PENDING,    // Step is pending execution
        ASSIGNED,   // Step is assigned to an agent
        RUNNING,    // Step is currently running
        COMPLETED,  // Step completed successfully
        FAILED,     // Step failed
        SKIPPED,    // Step was skipped
        TIMEOUT     // Step timed out
    }

    /**
     * Default constructor.
     */
    public StepExecution() {
        this.id = UUID.randomUUID().toString();
        this.input = new HashMap<>();
        this.output = new HashMap<>();
        this.metadata = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = StepStatus.PENDING;
        this.attemptCount = 0;
        this.timeoutSeconds = 300; // Default 5 minute timeout
    }

    /**
     * Constructor with workflow instance ID and step ID.
     * 
     * @param workflowInstanceId The ID of the workflow instance
     * @param stepId The ID of the step
     * @param stepName The name of the step
     */
    public StepExecution(String workflowInstanceId, String stepId, String stepName) {
        this();
        this.workflowInstanceId = workflowInstanceId;
        this.stepId = stepId;
        this.stepName = stepName;
    }

    /**
     * Assigns the step to an agent.
     * 
     * @param agentId The ID of the agent
     * @param agentRole The role of the agent
     * @return This step execution for method chaining
     */
    public StepExecution assign(String agentId, String agentRole) {
        if (this.status != StepStatus.PENDING) {
            throw new IllegalStateException("Step execution not pending");
        }
        
        this.assignedAgentId = agentId;
        this.assignedAgentRole = agentRole;
        this.status = StepStatus.ASSIGNED;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Starts the step execution.
     * 
     * @return This step execution for method chaining
     */
    public StepExecution start() {
        if (this.status != StepStatus.ASSIGNED) {
            throw new IllegalStateException("Step execution not assigned");
        }
        
        this.status = StepStatus.RUNNING;
        this.startedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Completes the step execution.
     * 
     * @return This step execution for method chaining
     */
    public StepExecution complete() {
        if (this.status != StepStatus.RUNNING) {
            throw new IllegalStateException("Step execution not running");
        }
        
        this.status = StepStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Fails the step execution.
     * 
     * @param errorMessage The error message
     * @return This step execution for method chaining
     */
    public StepExecution fail(String errorMessage) {
        this.status = StepStatus.FAILED;
        this.errorMessage = errorMessage;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Skips the step execution.
     * 
     * @return This step execution for method chaining
     */
    public StepExecution skip() {
        this.status = StepStatus.SKIPPED;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Times out the step execution.
     * 
     * @return This step execution for method chaining
     */
    public StepExecution timeout() {
        this.status = StepStatus.TIMEOUT;
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Adds input data to the step execution.
     * 
     * @param key The input key
     * @param value The input value
     * @return This step execution for method chaining
     */
    public StepExecution addInput(String key, Object value) {
        this.input.put(key, value);
        return this;
    }

    /**
     * Adds output data to the step execution.
     * 
     * @param key The output key
     * @param value The output value
     * @return This step execution for method chaining
     */
    public StepExecution addOutput(String key, Object value) {
        this.output.put(key, value);
        return this;
    }

    /**
     * Adds metadata to the step execution.
     * 
     * @param key The metadata key
     * @param value The metadata value
     * @return This step execution for method chaining
     */
    public StepExecution addMetadata(String key, Object value) {
        this.metadata.put(key, value);
        return this;
    }

    /**
     * Increments the attempt count.
     * 
     * @return This step execution for method chaining
     */
    public StepExecution incrementAttempt() {
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

    public String getWorkflowInstanceId() {
        return workflowInstanceId;
    }

    public void setWorkflowInstanceId(String workflowInstanceId) {
        this.workflowInstanceId = workflowInstanceId;
    }

    public String getStepId() {
        return stepId;
    }

    public void setStepId(String stepId) {
        this.stepId = stepId;
    }

    public String getStepName() {
        return stepName;
    }

    public void setStepName(String stepName) {
        this.stepName = stepName;
    }

    public StepStatus getStatus() {
        return status;
    }

    public void setStatus(StepStatus status) {
        this.status = status;
    }

    public String getAssignedAgentId() {
        return assignedAgentId;
    }

    public void setAssignedAgentId(String assignedAgentId) {
        this.assignedAgentId = assignedAgentId;
    }

    public String getAssignedAgentRole() {
        return assignedAgentRole;
    }

    public void setAssignedAgentRole(String assignedAgentRole) {
        this.assignedAgentRole = assignedAgentRole;
    }

    public Map<String, Object> getInput() {
        return input;
    }

    public void setInput(Map<String, Object> input) {
        this.input = input;
    }

    public Map<String, Object> getOutput() {
        return output;
    }

    public void setOutput(Map<String, Object> output) {
        this.output = output;
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

    public int getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(int attemptCount) {
        this.attemptCount = attemptCount;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public int getTimeoutSeconds() {
        return timeoutSeconds;
    }

    public void setTimeoutSeconds(int timeoutSeconds) {
        this.timeoutSeconds = timeoutSeconds;
    }
}
