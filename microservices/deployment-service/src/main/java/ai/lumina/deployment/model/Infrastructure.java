package ai.lumina.deployment.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapKeyColumn;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents infrastructure resources for deployment environments.
 */
@Entity
@Table(name = "infrastructure")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Infrastructure {

    /**
     * Possible infrastructure types.
     */
    public enum Type {
        KUBERNETES,
        VM,
        SERVERLESS
    }

    /**
     * Possible infrastructure environments.
     */
    public enum Environment {
        DEV,
        STAGING,
        PROD
    }

    /**
     * Possible infrastructure statuses.
     */
    public enum Status {
        PROVISIONING,
        ACTIVE,
        UPDATING,
        DELETING,
        FAILED
    }

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Environment environment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ElementCollection
    @CollectionTable(name = "infrastructure_resources", joinColumns = @JoinColumn(name = "infrastructure_id"))
    @MapKeyColumn(name = "resource_key")
    @Column(name = "resource_value", length = 4000)
    private Map<String, String> resources;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(length = 1000)
    private String errorMessage;

    /**
     * Initializes a new infrastructure with default values.
     * 
     * @return A new infrastructure instance with default values.
     */
    public static Infrastructure initializeNew(String name, Type type, Environment environment) {
        return Infrastructure.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .type(type)
                .environment(environment)
                .status(Status.PROVISIONING)
                .resources(new HashMap<>())
                .build();
    }

    /**
     * Activates the infrastructure.
     */
    public void activate() {
        if (this.status != Status.PROVISIONING && this.status != Status.UPDATING) {
            throw new IllegalStateException("Infrastructure can only be activated from PROVISIONING or UPDATING state");
        }
        this.status = Status.ACTIVE;
    }

    /**
     * Updates the infrastructure.
     */
    public void update() {
        if (this.status != Status.ACTIVE) {
            throw new IllegalStateException("Infrastructure can only be updated from ACTIVE state");
        }
        this.status = Status.UPDATING;
    }

    /**
     * Marks the infrastructure for deletion.
     */
    public void delete() {
        if (this.status == Status.DELETING) {
            throw new IllegalStateException("Infrastructure is already being deleted");
        }
        this.status = Status.DELETING;
    }

    /**
     * Fails the infrastructure.
     * 
     * @param errorMessage The error message describing the failure.
     */
    public void fail(String errorMessage) {
        this.status = Status.FAILED;
        this.errorMessage = errorMessage;
    }

    /**
     * Adds a resource to the infrastructure.
     * 
     * @param key The resource key.
     * @param value The resource value.
     */
    public void addResource(String key, String value) {
        if (this.resources == null) {
            this.resources = new HashMap<>();
        }
        this.resources.put(key, value);
    }
}
