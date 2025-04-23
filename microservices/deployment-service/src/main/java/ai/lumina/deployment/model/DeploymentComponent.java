package ai.lumina.deployment.model;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a component being deployed as part of a deployment.
 */
@Entity
@Table(name = "deployment_components")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeploymentComponent {

    /**
     * Possible component statuses.
     */
    public enum Status {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        FAILED,
        CANCELLED
    }

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String version;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deployment_id", nullable = false)
    @JsonIgnore
    private Deployment deployment;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Column(length = 1000)
    private String errorMessage;

    /**
     * Initializes a new deployment component with default values.
     * 
     * @return A new deployment component instance with default values.
     */
    public static DeploymentComponent initializeNew(String name, String version) {
        return DeploymentComponent.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .version(version)
                .status(Status.PENDING)
                .build();
    }

    /**
     * Starts the deployment component.
     */
    public void start() {
        if (this.status != Status.PENDING) {
            throw new IllegalStateException("Component can only be started from PENDING state");
        }
        this.status = Status.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }

    /**
     * Completes the deployment component.
     */
    public void complete() {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Component can only be completed from IN_PROGRESS state");
        }
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Fails the deployment component.
     * 
     * @param errorMessage The error message describing the failure.
     */
    public void fail(String errorMessage) {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Component can only be failed from IN_PROGRESS state");
        }
        this.status = Status.FAILED;
        this.completedAt = LocalDateTime.now();
        this.errorMessage = errorMessage;
    }

    /**
     * Cancels the deployment component.
     */
    public void cancel() {
        if (this.status != Status.PENDING && this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Component can only be cancelled from PENDING or IN_PROGRESS state");
        }
        this.status = Status.CANCELLED;
        this.completedAt = LocalDateTime.now();
    }
}
