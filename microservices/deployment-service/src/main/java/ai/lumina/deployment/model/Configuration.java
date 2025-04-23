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
 * Represents a configuration for a specific environment.
 */
@Entity
@Table(name = "configurations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Configuration {

    /**
     * Possible configuration environments.
     */
    public enum Environment {
        DEV,
        STAGING,
        PROD
    }

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Environment environment;

    @Column(nullable = false)
    private String version;

    @ElementCollection
    @CollectionTable(name = "configuration_data", joinColumns = @JoinColumn(name = "configuration_id"))
    @MapKeyColumn(name = "data_key")
    @Column(name = "data_value", length = 4000)
    private Map<String, String> data;

    @ElementCollection
    @CollectionTable(name = "configuration_secrets", joinColumns = @JoinColumn(name = "configuration_id"))
    @MapKeyColumn(name = "secret_key")
    @Column(name = "secret_reference")
    private Map<String, String> secrets;

    @Column(nullable = false)
    private String createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * Initializes a new configuration with default values.
     * 
     * @return A new configuration instance with default values.
     */
    public static Configuration initializeNew(String name, Environment environment, String version, String createdBy) {
        return Configuration.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .environment(environment)
                .version(version)
                .data(new HashMap<>())
                .secrets(new HashMap<>())
                .createdBy(createdBy)
                .build();
    }

    /**
     * Adds a configuration data entry.
     * 
     * @param key The data key.
     * @param value The data value.
     */
    public void addData(String key, String value) {
        if (this.data == null) {
            this.data = new HashMap<>();
        }
        this.data.put(key, value);
    }

    /**
     * Adds a configuration secret reference.
     * 
     * @param key The secret key.
     * @param reference The secret reference.
     */
    public void addSecret(String key, String reference) {
        if (this.secrets == null) {
            this.secrets = new HashMap<>();
        }
        this.secrets.put(key, reference);
    }

    /**
     * Creates a new version of this configuration.
     * 
     * @param newVersion The new version.
     * @param createdBy The user creating the new version.
     * @return A new configuration instance with the same data but a new version.
     */
    public Configuration createNewVersion(String newVersion, String createdBy) {
        Configuration newConfig = Configuration.builder()
                .id(UUID.randomUUID().toString())
                .name(this.name)
                .environment(this.environment)
                .version(newVersion)
                .data(new HashMap<>(this.data))
                .secrets(new HashMap<>(this.secrets))
                .createdBy(createdBy)
                .build();
        
        return newConfig;
    }
}
