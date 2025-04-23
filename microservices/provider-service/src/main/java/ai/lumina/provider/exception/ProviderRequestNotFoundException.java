package ai.lumina.provider.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a provider request is not found
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProviderRequestNotFoundException extends RuntimeException {

    public ProviderRequestNotFoundException(String message) {
        super(message);
    }

    public ProviderRequestNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
