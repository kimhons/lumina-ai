package ai.lumina.workflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.mapping.event.ValidatingMongoEventListener;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

/**
 * Configuration class for the Workflow Service.
 */
@Configuration
@EnableMongoRepositories(basePackages = "ai.lumina.workflow.repository")
public class WorkflowServiceConfig {

    /**
     * Creates a validator factory bean for MongoDB validation.
     * 
     * @return The validator factory bean
     */
    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }
    
    /**
     * Creates a validating MongoDB event listener.
     * 
     * @param validator The validator factory bean
     * @return The validating MongoDB event listener
     */
    @Bean
    public ValidatingMongoEventListener validatingMongoEventListener(LocalValidatorFactoryBean validator) {
        return new ValidatingMongoEventListener(validator);
    }
}
