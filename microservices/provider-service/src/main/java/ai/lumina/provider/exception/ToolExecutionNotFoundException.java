package ai.lumina.provider.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a tool execution is not found
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ToolExecutionNotFoundException extends RuntimeException {

    public ToolExecutionNotFoundException(String message) {
        super(message);
    }

    public ToolExecutionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
