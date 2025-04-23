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
import javax.persistence.Lob;
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
 * Represents a step in a pipeline stage.
 */
@Entity
@Table(name = "pipeline_steps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PipelineStep {

    /**
     * Possible step statuses.
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
    @JoinColumn(name = "stage_id", nullable = false)
    @JsonIgnore
    private PipelineStage stage;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Lob
    @Column(length = 10000)
    private String logs;

    @CreationTimestamp
    private LocalDateTime createdAt;

    /**
     * Initializes a new pipeline step with default values.
     * 
     * @return A new pipeline step instance with default values.
     */
    public static PipelineStep initializeNew(String name) {
        return PipelineStep.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .status(Status.PENDING)
                .build();
    }

    /**
     * Starts the step.
     */
    public void start() {
        if (this.status != Status.PENDING) {
            throw new IllegalStateException("Step can only be started from PENDING state");
        }
        this.status = Status.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }

    /**
     * Completes the step.
     */
    public void complete() {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Step can only be completed from IN_PROGRESS state");
        }
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Fails the step.
     * 
     * @param errorLogs The error logs describing the failure.
     */
    public void fail(String errorLogs) {
        if (this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Step can only be failed from IN_PROGRESS state");
        }
        this.status = Status.FAILED;
        this.completedAt = LocalDateTime.now();
        this.appendLogs(errorLogs);
    }

    /**
     * Cancels the step.
     */
    public void cancel() {
        if (this.status != Status.PENDING && this.status != Status.IN_PROGRESS) {
            throw new IllegalStateException("Step can only be cancelled from PENDING or IN_PROGRESS state");
        }
        this.status = Status.CANCELLED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Appends logs to the step.
     * 
     * @param logEntry The log entry to append.
     */
    public void appendLogs(String logEntry) {
        if (this.logs == null) {
            this.logs = "";
        }
        this.logs += LocalDateTime.now() + ": " + logEntry + "\n";
    }
}
