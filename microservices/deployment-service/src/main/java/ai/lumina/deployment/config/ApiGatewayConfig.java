package ai.lumina.deployment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration for the API Gateway component of the Enterprise Deployment System
 */
@Configuration
@EnableWebMvc
public class ApiGatewayConfig implements WebMvcConfigurer {

    /**
     * Configure CORS for the API Gateway
     * 
     * @return CorsFilter for handling Cross-Origin Resource Sharing
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow all origins, headers, and methods for development
        // In production, this should be restricted to specific origins
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
    
    /**
     * Add API request logging interceptor
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ApiRequestLoggingInterceptor());
        registry.addInterceptor(new ApiAuthenticationInterceptor());
        registry.addInterceptor(new ApiRateLimitingInterceptor());
    }
    
    /**
     * Configure API documentation
     */
    @Bean
    public ApiDocumentationConfig apiDocumentationConfig() {
        return new ApiDocumentationConfig();
    }
}
