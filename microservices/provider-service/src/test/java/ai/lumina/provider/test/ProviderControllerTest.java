package ai.lumina.provider.test;

import ai.lumina.provider.controller.ProviderController;
import ai.lumina.provider.model.Provider;
import ai.lumina.provider.service.ProviderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class ProviderControllerTest {

    @Mock
    private ProviderService providerService;

    @InjectMocks
    private ProviderController providerController;

    private Provider testProvider;
    private final String providerId = UUID.randomUUID().toString();

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        testProvider = new Provider();
        testProvider.setId(providerId);
        testProvider.setName("OpenAI");
        testProvider.setDescription("OpenAI API Provider");
        testProvider.setType(Provider.ProviderType.LLM);
        testProvider.setBaseUrl("https://api.openai.com/v1");
        testProvider.setEnabled(true);
        testProvider.setPriority(1);
        
        Set<String> capabilities = new HashSet<>();
        capabilities.add("text-generation");
        capabilities.add("embeddings");
        testProvider.setCapabilities(capabilities);
        
        Map<String, String> apiKeys = new HashMap<>();
        apiKeys.put("default", "sk-test-key");
        testProvider.setApiKeys(apiKeys);
        
        testProvider.setCreatedAt(LocalDateTime.now());
    }

    @Test
    public void testCreateProvider() {
        when(providerService.createProvider(any(Provider.class))).thenReturn(testProvider);

        ResponseEntity<Provider> response = providerController.createProvider(testProvider);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testProvider, response.getBody());
        verify(providerService, times(1)).createProvider(any(Provider.class));
    }

    @Test
    public void testGetAllProviders() {
        Provider secondProvider = new Provider();
        secondProvider.setId(UUID.randomUUID().toString());
        secondProvider.setName("Anthropic");
        
        List<Provider> providers = Arrays.asList(testProvider, secondProvider);
        
        when(providerService.getAllProviders()).thenReturn(providers);

        ResponseEntity<List<Provider>> response = providerController.getAllProviders();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(providers, response.getBody());
        assertEquals(2, response.getBody().size());
        verify(providerService, times(1)).getAllProviders();
    }

    @Test
    public void testGetProvider() {
        when(providerService.getProvider(providerId)).thenReturn(testProvider);

        ResponseEntity<Provider> response = providerController.getProvider(providerId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testProvider, response.getBody());
        verify(providerService, times(1)).getProvider(providerId);
    }

    @Test
    public void testUpdateProvider() {
        Provider updatedProvider = new Provider();
        updatedProvider.setName("Updated OpenAI");
        updatedProvider.setDescription("Updated Description");
        
        when(providerService.updateProvider(eq(providerId), any(Provider.class))).thenReturn(updatedProvider);

        ResponseEntity<Provider> response = providerController.updateProvider(providerId, updatedProvider);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedProvider, response.getBody());
        verify(providerService, times(1)).updateProvider(eq(providerId), any(Provider.class));
    }

    @Test
    public void testDeleteProvider() {
        doNothing().when(providerService).deleteProvider(providerId);

        ResponseEntity<Void> response = providerController.deleteProvider(providerId);

        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(providerService, times(1)).deleteProvider(providerId);
    }

    @Test
    public void testEnableProvider() {
        Provider enabledProvider = new Provider();
        enabledProvider.setId(providerId);
        enabledProvider.setEnabled(true);
        
        when(providerService.enableProvider(providerId)).thenReturn(enabledProvider);

        ResponseEntity<Provider> response = providerController.enableProvider(providerId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(enabledProvider, response.getBody());
        verify(providerService, times(1)).enableProvider(providerId);
    }

    @Test
    public void testDisableProvider() {
        Provider disabledProvider = new Provider();
        disabledProvider.setId(providerId);
        disabledProvider.setEnabled(false);
        
        when(providerService.disableProvider(providerId)).thenReturn(disabledProvider);

        ResponseEntity<Provider> response = providerController.disableProvider(providerId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(disabledProvider, response.getBody());
        verify(providerService, times(1)).disableProvider(providerId);
    }

    @Test
    public void testGetProvidersByType() {
        List<Provider> providers = Collections.singletonList(testProvider);
        
        when(providerService.getProvidersByType(Provider.ProviderType.LLM)).thenReturn(providers);

        ResponseEntity<List<Provider>> response = providerController.getProvidersByType(Provider.ProviderType.LLM);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(providers, response.getBody());
        verify(providerService, times(1)).getProvidersByType(Provider.ProviderType.LLM);
    }

    @Test
    public void testGetProvidersByCapability() {
        List<Provider> providers = Collections.singletonList(testProvider);
        
        when(providerService.getProvidersByCapability("text-generation")).thenReturn(providers);

        ResponseEntity<List<Provider>> response = providerController.getProvidersByCapability("text-generation");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(providers, response.getBody());
        verify(providerService, times(1)).getProvidersByCapability("text-generation");
    }

    @Test
    public void testUpdateApiKey() {
        Provider updatedProvider = new Provider();
        updatedProvider.setId(providerId);
        Map<String, String> apiKeys = new HashMap<>();
        apiKeys.put("default", "sk-new-test-key");
        updatedProvider.setApiKeys(apiKeys);
        
        when(providerService.updateApiKey(eq(providerId), eq("default"), eq("sk-new-test-key"))).thenReturn(updatedProvider);

        ResponseEntity<Provider> response = providerController.updateApiKey(providerId, "default", "sk-new-test-key");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedProvider, response.getBody());
        verify(providerService, times(1)).updateApiKey(eq(providerId), eq("default"), eq("sk-new-test-key"));
    }
}
