package ai.lumina.provider.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a tool is not found
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ToolNotFoundException extends RuntimeException {

    public ToolNotFoundException(String message) {
        super(message);
    }

    public ToolNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
