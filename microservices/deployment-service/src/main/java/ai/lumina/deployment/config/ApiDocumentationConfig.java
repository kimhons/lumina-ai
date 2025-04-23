package ai.lumina.deployment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Tag;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * Configuration for API documentation using Swagger/OpenAPI
 */
@Configuration
@EnableSwagger2
public class ApiDocumentationConfig {

    /**
     * Configure Swagger/OpenAPI documentation
     * 
     * @return Docket for Swagger configuration
     */
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("ai.lumina.deployment.controller"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(apiInfo())
                .tags(
                    new Tag("Deployment", "Operations related to deployments"),
                    new Tag("Configuration", "Operations related to configurations"),
                    new Tag("Pipeline", "Operations related to deployment pipelines"),
                    new Tag("Infrastructure", "Operations related to infrastructure resources")
                );
    }
    
    /**
     * Configure API information
     * 
     * @return ApiInfo for Swagger documentation
     */
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Enterprise Deployment System API")
                .description("API for managing deployments, configurations, pipelines, and infrastructure")
                .version("1.0.0")
                .contact(new Contact("Lumina AI", "https://lumina-ai.com", "support@lumina-ai.com"))
                .license("Proprietary")
                .licenseUrl("https://lumina-ai.com/license")
                .build();
    }
}
