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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
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
 * Represents a stage in a deployment pipeline.
 */
@Entity
@Table(name = "pipeline_stages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PipelineStage {

    /**
     * Possible stage statuses.
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pipeline_id", nullable = false)
    @JsonIgnore
    private Pipeline pipeline;

    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<PipelineStep> steps;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    /**
     * Initializes a new pipeline stage with default values.
     * 
     * @return A new pipeline stage instance with default values.
     */
    public static PipelineStage initializeNew(String name) {
        return PipelineStage.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .status(Status.PENDING)
                .steps(new ArrayList<>())
                .build();
    }

    /**
     * Starts the stage.
     */
    public void start() {
        if (this.status != Status.PENDING) {
            throw new IllegalStateException("Stage can only be started from PENDING state");
        }
        this.status = Status.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }

    /**
     * Completes the stage.
     */
    public void complete() {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Stage can only be completed from IN_PROGRESS state");
        }
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Fails the stage.
     */
    public void fail() {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Stage can only be failed from IN_PROGRESS state");
        }
        this.status = Status.FAILED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Cancels the stage.
     */
    public void cancel() {
        if (this.status != Status.PENDING && this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Stage can only be cancelled from PENDING or IN_PROGRESS state");
        }
        this.status = Status.CANCELLED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Adds a step to the stage.
     * 
     * @param step The step to add.
     */
    public void addStep(PipelineStep step) {
        if (this.steps == null) {
            this.steps = new ArrayList<>();
        }
        step.setStage(this);
        this.steps.add(step);
    }
}
