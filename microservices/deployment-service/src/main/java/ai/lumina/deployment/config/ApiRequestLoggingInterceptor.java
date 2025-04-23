package ai.lumina.deployment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Interceptor for logging API requests
 */
public class ApiRequestLoggingInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(ApiRequestLoggingInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        request.setAttribute("startTime", Instant.now());
        logger.info("Request started: {} {}", request.getMethod(), request.getRequestURI());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // No action needed in post handle
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        Instant startTime = (Instant) request.getAttribute("startTime");
        Instant endTime = Instant.now();
        long durationMs = ChronoUnit.MILLIS.between(startTime, endTime);
        
        logger.info("Request completed: {} {} - Status: {} - Duration: {}ms", 
                request.getMethod(), 
                request.getRequestURI(),
                response.getStatus(),
                durationMs);
        
        if (ex != null) {
            logger.error("Exception during request processing", ex);
        }
    }
}
