package ai.lumina.workflow.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents the shared execution context for a workflow instance.
 * The execution context stores data that is shared between steps in a workflow.
 */
@Document(collection = "execution_contexts")
public class ExecutionContext {

    @Id
    private String id;
    private String workflowInstanceId;
    private Map<String, Object> data;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int version;

    /**
     * Default constructor.
     */
    public ExecutionContext() {
        this.id = UUID.randomUUID().toString();
        this.data = new HashMap<>();
        this.metadata = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.version = 1;
    }

    /**
     * Constructor with workflow instance ID.
     * 
     * @param workflowInstanceId The ID of the workflow instance
     */
    public ExecutionContext(String workflowInstanceId) {
        this();
        this.workflowInstanceId = workflowInstanceId;
    }

    /**
     * Gets a value from the context.
     * 
     * @param key The key to get
     * @return The value, or null if not found
     */
    public Object get(String key) {
        return this.data.get(key);
    }

    /**
     * Gets a value from the context with a default value if not found.
     * 
     * @param key The key to get
     * @param defaultValue The default value to return if the key is not found
     * @return The value, or the default value if not found
     */
    public Object getOrDefault(String key, Object defaultValue) {
        return this.data.getOrDefault(key, defaultValue);
    }

    /**
     * Puts a value in the context.
     * 
     * @param key The key to put
     * @param value The value to put
     * @return This execution context for method chaining
     */
    public ExecutionContext put(String key, Object value) {
        this.data.put(key, value);
        this.updatedAt = LocalDateTime.now();
        this.version++;
        
        return this;
    }

    /**
     * Removes a value from the context.
     * 
     * @param key The key to remove
     * @return This execution context for method chaining
     */
    public ExecutionContext remove(String key) {
        this.data.remove(key);
        this.updatedAt = LocalDateTime.now();
        this.version++;
        
        return this;
    }

    /**
     * Checks if the context contains a key.
     * 
     * @param key The key to check
     * @return True if the context contains the key, false otherwise
     */
    public boolean containsKey(String key) {
        return this.data.containsKey(key);
    }

    /**
     * Clears all data from the context.
     * 
     * @return This execution context for method chaining
     */
    public ExecutionContext clear() {
        this.data.clear();
        this.updatedAt = LocalDateTime.now();
        this.version++;
        
        return this;
    }

    /**
     * Adds metadata to the context.
     * 
     * @param key The metadata key
     * @param value The metadata value
     * @return This execution context for method chaining
     */
    public ExecutionContext addMetadata(String key, Object value) {
        this.metadata.put(key, value);
        this.updatedAt = LocalDateTime.now();
        
        return this;
    }

    /**
     * Merges another context into this one.
     * 
     * @param other The other context to merge
     * @return This execution context for method chaining
     */
    public ExecutionContext merge(ExecutionContext other) {
        this.data.putAll(other.getData());
        this.updatedAt = LocalDateTime.now();
        this.version++;
        
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

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
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

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }
}
