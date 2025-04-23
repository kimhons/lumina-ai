package ai.lumina.deployment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Interceptor for API authentication and authorization
 */
public class ApiAuthenticationInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(ApiAuthenticationInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Get the authorization header
        String authHeader = request.getHeader("Authorization");
        
        // For development purposes, allow requests without authentication
        // In production, this should validate tokens and enforce authentication
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Request without valid authentication: {} {}", request.getMethod(), request.getRequestURI());
            // For now, we'll allow the request to proceed
            return true;
        }
        
        // Extract the token
        String token = authHeader.substring(7);
        
        // Validate the token (simplified for development)
        boolean isValid = validateToken(token);
        
        if (!isValid) {
            logger.warn("Invalid authentication token: {} {}", request.getMethod(), request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid authentication token\"}");
            return false;
        }
        
        // Set user information in request attributes for controllers
        setUserInformation(request, token);
        
        logger.info("Authenticated request: {} {}", request.getMethod(), request.getRequestURI());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // No action needed in post handle
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // No action needed after completion
    }
    
    /**
     * Validate the authentication token
     * 
     * @param token The authentication token
     * @return True if the token is valid
     */
    private boolean validateToken(String token) {
        // In a real implementation, this would validate the token with an auth service
        // For development, we'll consider all tokens valid
        return true;
    }
    
    /**
     * Set user information in request attributes
     * 
     * @param request The HTTP request
     * @param token The authentication token
     */
    private void setUserInformation(HttpServletRequest request, String token) {
        // In a real implementation, this would extract user information from the token
        // For development, we'll set a default user
        request.setAttribute("userId", "system");
        request.setAttribute("userRoles", new String[]{"ADMIN"});
    }
}
