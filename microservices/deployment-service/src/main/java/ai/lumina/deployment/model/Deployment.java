package ai.lumina.deployment.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapKeyColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a deployment of Lumina AI components to a specific environment.
 */
@Entity
@Table(name = "deployments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Deployment {

    /**
     * Possible deployment statuses.
     */
    public enum Status {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        FAILED,
        CANCELLED
    }

    /**
     * Possible deployment environments.
     */
    public enum Environment {
        DEV,
        STAGING,
        PROD
    }

    /**
     * Possible deployment strategies.
     */
    public enum Strategy {
        ROLLING,
        BLUE_GREEN,
        CANARY
    }

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Environment environment;

    @OneToMany(mappedBy = "deployment", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<DeploymentComponent> components;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Strategy strategy;

    @Column(nullable = false)
    private String createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @ElementCollection
    @CollectionTable(name = "deployment_metadata", joinColumns = @JoinColumn(name = "deployment_id"))
    @MapKeyColumn(name = "metadata_key")
    @Column(name = "metadata_value")
    private Map<String, String> metadata;

    /**
     * Initializes a new deployment with default values.
     * 
     * @return A new deployment instance with default values.
     */
    public static Deployment initializeNew(String name, String description, Environment environment, Strategy strategy, String createdBy) {
        return Deployment.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .description(description)
                .status(Status.PENDING)
                .environment(environment)
                .components(new ArrayList<>())
                .strategy(strategy)
                .createdBy(createdBy)
                .metadata(new HashMap<>())
                .build();
    }

    /**
     * Starts the deployment.
     */
    public void start() {
        if (this.status != Status.PENDING) {
            throw new IllegalStateException("Deployment can only be started from PENDING state");
        }
        this.status = Status.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }

    /**
     * Completes the deployment.
     */
    public void complete() {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Deployment can only be completed from IN_PROGRESS state");
        }
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Fails the deployment.
     */
    public void fail() {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Deployment can only be failed from IN_PROGRESS state");
        }
        this.status = Status.FAILED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Cancels the deployment.
     */
    public void cancel() {
        if (this.status != Status.PENDING && this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Deployment can only be cancelled from PENDING or IN_PROGRESS state");
        }
        this.status = Status.CANCELLED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Adds a component to the deployment.
     * 
     * @param component The component to add.
     */
    public void addComponent(DeploymentComponent component) {
        if (this.components == null) {
            this.components = new ArrayList<>();
        }
        component.setDeployment(this);
        this.components.add(component);
    }

    /**
     * Adds metadata to the deployment.
     * 
     * @param key The metadata key.
     * @param value The metadata value.
     */
    public void addMetadata(String key, String value) {
        if (this.metadata == null) {
            this.metadata = new HashMap<>();
        }
        this.metadata.put(key, value);
    }
}
