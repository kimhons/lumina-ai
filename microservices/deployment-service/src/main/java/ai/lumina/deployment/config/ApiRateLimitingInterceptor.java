package ai.lumina.deployment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Interceptor for API rate limiting
 */
public class ApiRateLimitingInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(ApiRateLimitingInterceptor.class);
    
    // Rate limit configuration (requests per minute)
    private static final int DEFAULT_RATE_LIMIT = 60;
    private static final Map<String, Integer> ENDPOINT_RATE_LIMITS = Map.of(
        "/api/deployments", 30,
        "/api/pipelines", 30,
        "/api/configurations", 30,
        "/api/infrastructure", 30
    );
    
    // In-memory store for request counts (in production, use Redis or similar)
    private final Map<String, RequestCount> requestCounts = new ConcurrentHashMap<>();
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Get client identifier (IP address or user ID if authenticated)
        String clientId = getClientIdentifier(request);
        
        // Get the rate limit for this endpoint
        String endpoint = getEndpointKey(request);
        int rateLimit = getRateLimit(endpoint);
        
        // Check if the client has exceeded the rate limit
        if (isRateLimitExceeded(clientId, endpoint, rateLimit)) {
            logger.warn("Rate limit exceeded for client: {} on endpoint: {}", clientId, endpoint);
            response.setStatus(HttpServletResponse.SC_TOO_MANY_REQUESTS);
            response.setHeader("X-RateLimit-Limit", String.valueOf(rateLimit));
            response.setHeader("X-RateLimit-Reset", String.valueOf(getResetTimeSeconds()));
            response.getWriter().write("{\"error\": \"Rate limit exceeded. Please try again later.\"}");
            return false;
        }
        
        // Increment the request count
        incrementRequestCount(clientId, endpoint);
        
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
     * Get client identifier from request
     * 
     * @param request The HTTP request
     * @return Client identifier
     */
    private String getClientIdentifier(HttpServletRequest request) {
        // If authenticated, use user ID
        Object userId = request.getAttribute("userId");
        if (userId != null) {
            return userId.toString();
        }
        
        // Otherwise use IP address
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }
    
    /**
     * Get endpoint key for rate limiting
     * 
     * @param request The HTTP request
     * @return Endpoint key
     */
    private String getEndpointKey(HttpServletRequest request) {
        String uri = request.getRequestURI();
        // Simplify the URI to the base endpoint
        for (String endpoint : ENDPOINT_RATE_LIMITS.keySet()) {
            if (uri.startsWith(endpoint)) {
                return endpoint;
            }
        }
        return uri;
    }
    
    /**
     * Get rate limit for endpoint
     * 
     * @param endpoint The endpoint
     * @return Rate limit
     */
    private int getRateLimit(String endpoint) {
        return ENDPOINT_RATE_LIMITS.getOrDefault(endpoint, DEFAULT_RATE_LIMIT);
    }
    
    /**
     * Check if rate limit is exceeded
     * 
     * @param clientId Client identifier
     * @param endpoint Endpoint
     * @param rateLimit Rate limit
     * @return True if rate limit is exceeded
     */
    private boolean isRateLimitExceeded(String clientId, String endpoint, int rateLimit) {
        String key = clientId + ":" + endpoint;
        RequestCount count = requestCounts.get(key);
        
        if (count == null) {
            return false;
        }
        
        // Check if the minute window has passed
        long currentTimeMinutes = TimeUnit.MILLISECONDS.toMinutes(System.currentTimeMillis());
        if (currentTimeMinutes > count.getMinute()) {
            // Reset for new minute window
            count.setMinute(currentTimeMinutes);
            count.setCount(0);
            return false;
        }
        
        return count.getCount() >= rateLimit;
    }
    
    /**
     * Increment request count
     * 
     * @param clientId Client identifier
     * @param endpoint Endpoint
     */
    private void incrementRequestCount(String clientId, String endpoint) {
        String key = clientId + ":" + endpoint;
        long currentTimeMinutes = TimeUnit.MILLISECONDS.toMinutes(System.currentTimeMillis());
        
        requestCounts.compute(key, (k, v) -> {
            if (v == null) {
                return new RequestCount(currentTimeMinutes, 1);
            }
            
            if (currentTimeMinutes > v.getMinute()) {
                v.setMinute(currentTimeMinutes);
                v.setCount(1);
            } else {
                v.setCount(v.getCount() + 1);
            }
            
            return v;
        });
    }
    
    /**
     * Get reset time in seconds
     * 
     * @return Seconds until rate limit reset
     */
    private long getResetTimeSeconds() {
        long currentTimeMillis = System.currentTimeMillis();
        long currentTimeMinutes = TimeUnit.MILLISECONDS.toMinutes(currentTimeMillis);
        long nextMinuteMillis = TimeUnit.MINUTES.toMillis(currentTimeMinutes + 1);
        return TimeUnit.MILLISECONDS.toSeconds(nextMinuteMillis - currentTimeMillis);
    }
    
    /**
     * Class to track request counts
     */
    private static class RequestCount {
        private long minute;
        private int count;
        
        public RequestCount(long minute, int count) {
            this.minute = minute;
            this.count = count;
        }
        
        public long getMinute() {
            return minute;
        }
        
        public void setMinute(long minute) {
            this.minute = minute;
        }
        
        public int getCount() {
            return count;
        }
        
        public void setCount(int count) {
            this.count = count;
        }
    }
}
