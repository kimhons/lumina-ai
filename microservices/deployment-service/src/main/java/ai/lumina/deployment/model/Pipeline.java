package ai.lumina.deployment.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
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
 * Represents a pipeline for executing deployment steps.
 */
@Entity
@Table(name = "pipelines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Pipeline {

    /**
     * Possible pipeline statuses.
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
    private String deploymentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @OneToMany(mappedBy = "pipeline", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<PipelineStage> stages;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    /**
     * Initializes a new pipeline with default values.
     * 
     * @return A new pipeline instance with default values.
     */
    public static Pipeline initializeNew(String name, String deploymentId) {
        return Pipeline.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .deploymentId(deploymentId)
                .status(Status.PENDING)
                .stages(new ArrayList<>())
                .build();
    }

    /**
     * Starts the pipeline.
     */
    public void start() {
        if (this.status != Status.PENDING) {
            throw new IllegalStateException("Pipeline can only be started from PENDING state");
        }
        this.status = Status.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }

    /**
     * Completes the pipeline.
     */
    public void complete() {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Pipeline can only be completed from IN_PROGRESS state");
        }
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Fails the pipeline.
     */
    public void fail() {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Pipeline can only be failed from IN_PROGRESS state");
        }
        this.status = Status.FAILED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Cancels the pipeline.
     */
    public void cancel() {
        if (this.status != Status.PENDING && this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Pipeline can only be cancelled from PENDING or IN_PROGRESS state");
        }
        this.status = Status.CANCELLED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Adds a stage to the pipeline.
     * 
     * @param stage The stage to add.
     */
    public void addStage(PipelineStage stage) {
        if (this.stages == null) {
            this.stages = new ArrayList<>();
        }
        stage.setPipeline(this);
        this.stages.add(stage);
    }
}
