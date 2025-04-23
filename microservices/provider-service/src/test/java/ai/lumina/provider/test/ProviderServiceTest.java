package ai.lumina.provider.test;

import ai.lumina.provider.model.Provider;
import ai.lumina.provider.model.Model;
import ai.lumina.provider.repository.ProviderRepository;
import ai.lumina.provider.service.ProviderService;
import ai.lumina.provider.exception.ProviderNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ProviderServiceTest {

    @Mock
    private ProviderRepository providerRepository;

    @InjectMocks
    private ProviderService providerService;

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
        when(providerRepository.save(any(Provider.class))).thenReturn(testProvider);

        Provider createdProvider = providerService.createProvider(testProvider);

        assertNotNull(createdProvider);
        assertEquals(testProvider.getName(), createdProvider.getName());
        assertEquals(testProvider.getDescription(), createdProvider.getDescription());
        assertEquals(testProvider.getType(), createdProvider.getType());
        assertTrue(createdProvider.isEnabled());
        verify(providerRepository, times(1)).save(any(Provider.class));
    }

    @Test
    public void testGetProvider() {
        when(providerRepository.findById(providerId)).thenReturn(Optional.of(testProvider));

        Provider foundProvider = providerService.getProvider(providerId);

        assertNotNull(foundProvider);
        assertEquals(providerId, foundProvider.getId());
        assertEquals(testProvider.getName(), foundProvider.getName());
        verify(providerRepository, times(1)).findById(providerId);
    }

    @Test
    public void testGetProviderNotFound() {
        when(providerRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        assertThrows(ProviderNotFoundException.class, () -> {
            providerService.getProvider("non-existent-id");
        });

        verify(providerRepository, times(1)).findById("non-existent-id");
    }

    @Test
    public void testGetAllProviders() {
        Provider secondProvider = new Provider();
        secondProvider.setId(UUID.randomUUID().toString());
        secondProvider.setName("Anthropic");
        secondProvider.setType(Provider.ProviderType.LLM);
        secondProvider.setEnabled(true);

        when(providerRepository.findAll()).thenReturn(Arrays.asList(testProvider, secondProvider));

        List<Provider> providers = providerService.getAllProviders();

        assertNotNull(providers);
        assertEquals(2, providers.size());
        verify(providerRepository, times(1)).findAll();
    }

    @Test
    public void testGetEnabledProviders() {
        Provider disabledProvider = new Provider();
        disabledProvider.setId(UUID.randomUUID().toString());
        disabledProvider.setName("Disabled Provider");
        disabledProvider.setEnabled(false);

        Provider enabledProvider = new Provider();
        enabledProvider.setId(UUID.randomUUID().toString());
        enabledProvider.setName("Enabled Provider");
        enabledProvider.setEnabled(true);

        when(providerRepository.findByEnabledTrue()).thenReturn(Arrays.asList(testProvider, enabledProvider));

        List<Provider> providers = providerService.getEnabledProviders();

        assertNotNull(providers);
        assertEquals(2, providers.size());
        for (Provider provider : providers) {
            assertTrue(provider.isEnabled());
        }
        verify(providerRepository, times(1)).findByEnabledTrue();
    }

    @Test
    public void testGetProvidersByType() {
        Provider llmProvider = new Provider();
        llmProvider.setId(UUID.randomUUID().toString());
        llmProvider.setName("LLM Provider");
        llmProvider.setType(Provider.ProviderType.LLM);

        Provider embeddingProvider = new Provider();
        embeddingProvider.setId(UUID.randomUUID().toString());
        embeddingProvider.setName("Embedding Provider");
        embeddingProvider.setType(Provider.ProviderType.EMBEDDING);

        when(providerRepository.findByType(Provider.ProviderType.LLM)).thenReturn(Arrays.asList(testProvider, llmProvider));

        List<Provider> providers = providerService.getProvidersByType(Provider.ProviderType.LLM);

        assertNotNull(providers);
        assertEquals(2, providers.size());
        for (Provider provider : providers) {
            assertEquals(Provider.ProviderType.LLM, provider.getType());
        }
        verify(providerRepository, times(1)).findByType(Provider.ProviderType.LLM);
    }

    @Test
    public void testGetProvidersByCapability() {
        when(providerRepository.findByCapabilitiesContaining("text-generation")).thenReturn(Collections.singletonList(testProvider));

        List<Provider> providers = providerService.getProvidersByCapability("text-generation");

        assertNotNull(providers);
        assertEquals(1, providers.size());
        assertTrue(providers.get(0).getCapabilities().contains("text-generation"));
        verify(providerRepository, times(1)).findByCapabilitiesContaining("text-generation");
    }

    @Test
    public void testUpdateProvider() {
        Provider updatedProvider = new Provider();
        updatedProvider.setName("Updated OpenAI");
        updatedProvider.setDescription("Updated Description");
        updatedProvider.setBaseUrl("https://updated-api.openai.com/v1");
        updatedProvider.setPriority(2);
        
        Set<String> updatedCapabilities = new HashSet<>();
        updatedCapabilities.add("text-generation");
        updatedCapabilities.add("embeddings");
        updatedCapabilities.add("image-generation");
        updatedProvider.setCapabilities(updatedCapabilities);

        when(providerRepository.findById(providerId)).thenReturn(Optional.of(testProvider));
        when(providerRepository.save(any(Provider.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Provider result = providerService.updateProvider(providerId, updatedProvider);

        assertNotNull(result);
        assertEquals(updatedProvider.getName(), result.getName());
        assertEquals(updatedProvider.getDescription(), result.getDescription());
        assertEquals(updatedProvider.getBaseUrl(), result.getBaseUrl());
        assertEquals(updatedProvider.getPriority(), result.getPriority());
        assertEquals(updatedProvider.getCapabilities().size(), result.getCapabilities().size());
        assertTrue(result.getCapabilities().contains("image-generation"));
        assertNotNull(result.getUpdatedAt());
        verify(providerRepository, times(1)).findById(providerId);
        verify(providerRepository, times(1)).save(any(Provider.class));
    }

    @Test
    public void testDeleteProvider() {
        when(providerRepository.findById(providerId)).thenReturn(Optional.of(testProvider));
        doNothing().when(providerRepository).delete(testProvider);

        providerService.deleteProvider(providerId);

        verify(providerRepository, times(1)).findById(providerId);
        verify(providerRepository, times(1)).delete(testProvider);
    }

    @Test
    public void testEnableProvider() {
        testProvider.setEnabled(false);
        when(providerRepository.findById(providerId)).thenReturn(Optional.of(testProvider));
        when(providerRepository.save(any(Provider.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Provider result = providerService.enableProvider(providerId);

        assertNotNull(result);
        assertTrue(result.isEnabled());
        assertNotNull(result.getUpdatedAt());
        verify(providerRepository, times(1)).findById(providerId);
        verify(providerRepository, times(1)).save(any(Provider.class));
    }

    @Test
    public void testDisableProvider() {
        when(providerRepository.findById(providerId)).thenReturn(Optional.of(testProvider));
        when(providerRepository.save(any(Provider.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Provider result = providerService.disableProvider(providerId);

        assertNotNull(result);
        assertFalse(result.isEnabled());
        assertNotNull(result.getUpdatedAt());
        verify(providerRepository, times(1)).findById(providerId);
        verify(providerRepository, times(1)).save(any(Provider.class));
    }

    @Test
    public void testUpdateApiKey() {
        when(providerRepository.findById(providerId)).thenReturn(Optional.of(testProvider));
        when(providerRepository.save(any(Provider.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Provider result = providerService.updateApiKey(providerId, "default", "sk-new-test-key");

        assertNotNull(result);
        assertEquals("sk-new-test-key", result.getApiKeys().get("default"));
        assertNotNull(result.getUpdatedAt());
        verify(providerRepository, times(1)).findById(providerId);
        verify(providerRepository, times(1)).save(any(Provider.class));
    }
}
