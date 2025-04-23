package ai.lumina.governance.test;

import ai.lumina.governance.model.ContentEvaluation;
import ai.lumina.governance.repository.ContentEvaluationRepository;
import ai.lumina.governance.service.ContentEvaluationService;
import ai.lumina.governance.exception.ContentEvaluationNotFoundException;

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
public class ContentEvaluationServiceTest {

    @Mock
    private ContentEvaluationRepository evaluationRepository;

    @InjectMocks
    private ContentEvaluationService evaluationService;

    private ContentEvaluation testEvaluation;
    private final String evaluationId = UUID.randomUUID().toString();
    private final String requestId = UUID.randomUUID().toString();
    private final String userId = "user123";
    private final String modelId = "model456";
    private final String providerId = "provider789";

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        testEvaluation = new ContentEvaluation();
        testEvaluation.setId(evaluationId);
        testEvaluation.setRequestId(requestId);
        testEvaluation.setUserId(userId);
        testEvaluation.setModelId(modelId);
        testEvaluation.setProviderId(providerId);
        testEvaluation.setContentType(ContentEvaluation.ContentType.MODEL_OUTPUT);
        testEvaluation.setContent("This is test content for evaluation");
        testEvaluation.setSafetyScore(0.95);
        testEvaluation.setPrivacyScore(0.87);
        testEvaluation.setTransparencyScore(0.92);
        
        Map<String, Double> flags = new HashMap<>();
        flags.put("hate_speech", 0.02);
        flags.put("violence", 0.01);
        flags.put("sexual_content", 0.00);
        testEvaluation.setFlags(flags);
        
        testEvaluation.setEvaluationDetails("Content evaluated with no significant issues");
        testEvaluation.setEvaluatedAt(LocalDateTime.now());
    }

    @Test
    public void testEvaluateContent() {
        when(evaluationRepository.save(any(ContentEvaluation.class))).thenReturn(testEvaluation);

        ContentEvaluation result = evaluationService.evaluateContent(
                "This is test content for evaluation",
                ContentEvaluation.ContentType.MODEL_OUTPUT,
                requestId,
                userId,
                modelId,
                providerId);

        assertNotNull(result);
        assertEquals(testEvaluation.getRequestId(), result.getRequestId());
        assertEquals(testEvaluation.getUserId(), result.getUserId());
        assertEquals(testEvaluation.getModelId(), result.getModelId());
        assertEquals(testEvaluation.getProviderId(), result.getProviderId());
        assertEquals(testEvaluation.getContentType(), result.getContentType());
        verify(evaluationRepository, times(1)).save(any(ContentEvaluation.class));
    }

    @Test
    public void testGetEvaluation() {
        when(evaluationRepository.findById(evaluationId)).thenReturn(Optional.of(testEvaluation));

        ContentEvaluation foundEvaluation = evaluationService.getEvaluation(evaluationId);

        assertNotNull(foundEvaluation);
        assertEquals(evaluationId, foundEvaluation.getId());
        assertEquals(testEvaluation.getRequestId(), foundEvaluation.getRequestId());
        verify(evaluationRepository, times(1)).findById(evaluationId);
    }

    @Test
    public void testGetEvaluationNotFound() {
        when(evaluationRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        assertThrows(ContentEvaluationNotFoundException.class, () -> {
            evaluationService.getEvaluation("non-existent-id");
        });

        verify(evaluationRepository, times(1)).findById("non-existent-id");
    }

    @Test
    public void testGetEvaluationsByUserId() {
        ContentEvaluation secondEvaluation = new ContentEvaluation();
        secondEvaluation.setId(UUID.randomUUID().toString());
        secondEvaluation.setUserId(userId);
        secondEvaluation.setContentType(ContentEvaluation.ContentType.USER_INPUT);

        when(evaluationRepository.findByUserId(userId)).thenReturn(Arrays.asList(testEvaluation, secondEvaluation));

        List<ContentEvaluation> evaluations = evaluationService.getEvaluationsByUserId(userId);

        assertNotNull(evaluations);
        assertEquals(2, evaluations.size());
        for (ContentEvaluation evaluation : evaluations) {
            assertEquals(userId, evaluation.getUserId());
        }
        verify(evaluationRepository, times(1)).findByUserId(userId);
    }

    @Test
    public void testGetEvaluationsByRequestId() {
        when(evaluationRepository.findByRequestId(requestId)).thenReturn(Collections.singletonList(testEvaluation));

        List<ContentEvaluation> evaluations = evaluationService.getEvaluationsByRequestId(requestId);

        assertNotNull(evaluations);
        assertEquals(1, evaluations.size());
        assertEquals(requestId, evaluations.get(0).getRequestId());
        verify(evaluationRepository, times(1)).findByRequestId(requestId);
    }

    @Test
    public void testGetEvaluationsByContentType() {
        ContentEvaluation userInputEvaluation = new ContentEvaluation();
        userInputEvaluation.setId(UUID.randomUUID().toString());
        userInputEvaluation.setContentType(ContentEvaluation.ContentType.USER_INPUT);

        ContentEvaluation modelOutputEvaluation = new ContentEvaluation();
        modelOutputEvaluation.setId(UUID.randomUUID().toString());
        modelOutputEvaluation.setContentType(ContentEvaluation.ContentType.MODEL_OUTPUT);

        when(evaluationRepository.findByContentType(ContentEvaluation.ContentType.MODEL_OUTPUT))
                .thenReturn(Arrays.asList(testEvaluation, modelOutputEvaluation));

        List<ContentEvaluation> evaluations = evaluationService.getEvaluationsByContentType(ContentEvaluation.ContentType.MODEL_OUTPUT);

        assertNotNull(evaluations);
        assertEquals(2, evaluations.size());
        for (ContentEvaluation evaluation : evaluations) {
            assertEquals(ContentEvaluation.ContentType.MODEL_OUTPUT, evaluation.getContentType());
        }
        verify(evaluationRepository, times(1)).findByContentType(ContentEvaluation.ContentType.MODEL_OUTPUT);
    }

    @Test
    public void testGetEvaluationsBelowSafetyThreshold() {
        ContentEvaluation lowSafetyEvaluation = new ContentEvaluation();
        lowSafetyEvaluation.setId(UUID.randomUUID().toString());
        lowSafetyEvaluation.setSafetyScore(0.3);

        when(evaluationRepository.findBySafetyScoreLessThan(0.5))
                .thenReturn(Collections.singletonList(lowSafetyEvaluation));

        List<ContentEvaluation> evaluations = evaluationService.getEvaluationsBelowSafetyThreshold(0.5);

        assertNotNull(evaluations);
        assertEquals(1, evaluations.size());
        assertTrue(evaluations.get(0).getSafetyScore() < 0.5);
        verify(evaluationRepository, times(1)).findBySafetyScoreLessThan(0.5);
    }

    @Test
    public void testGetEvaluationsBelowPrivacyThreshold() {
        ContentEvaluation lowPrivacyEvaluation = new ContentEvaluation();
        lowPrivacyEvaluation.setId(UUID.randomUUID().toString());
        lowPrivacyEvaluation.setPrivacyScore(0.4);

        when(evaluationRepository.findByPrivacyScoreLessThan(0.6))
                .thenReturn(Collections.singletonList(lowPrivacyEvaluation));

        List<ContentEvaluation> evaluations = evaluationService.getEvaluationsBelowPrivacyThreshold(0.6);

        assertNotNull(evaluations);
        assertEquals(1, evaluations.size());
        assertTrue(evaluations.get(0).getPrivacyScore() < 0.6);
        verify(evaluationRepository, times(1)).findByPrivacyScoreLessThan(0.6);
    }

    @Test
    public void testGetEvaluationsBelowTransparencyThreshold() {
        ContentEvaluation lowTransparencyEvaluation = new ContentEvaluation();
        lowTransparencyEvaluation.setId(UUID.randomUUID().toString());
        lowTransparencyEvaluation.setTransparencyScore(0.5);

        when(evaluationRepository.findByTransparencyScoreLessThan(0.7))
                .thenReturn(Collections.singletonList(lowTransparencyEvaluation));

        List<ContentEvaluation> evaluations = evaluationService.getEvaluationsBelowTransparencyThreshold(0.7);

        assertNotNull(evaluations);
        assertEquals(1, evaluations.size());
        assertTrue(evaluations.get(0).getTransparencyScore() < 0.7);
        verify(evaluationRepository, times(1)).findByTransparencyScoreLessThan(0.7);
    }

    @Test
    public void testGetEvaluationsWithFlag() {
        when(evaluationRepository.findByFlagsContainingKey("hate_speech"))
                .thenReturn(Collections.singletonList(testEvaluation));

        List<ContentEvaluation> evaluations = evaluationService.getEvaluationsWithFlag("hate_speech");

        assertNotNull(evaluations);
        assertEquals(1, evaluations.size());
        assertTrue(evaluations.get(0).getFlags().containsKey("hate_speech"));
        verify(evaluationRepository, times(1)).findByFlagsContainingKey("hate_speech");
    }

    @Test
    public void testGetEvaluationsWithFlagAboveThreshold() {
        ContentEvaluation highFlagEvaluation = new ContentEvaluation();
        highFlagEvaluation.setId(UUID.randomUUID().toString());
        Map<String, Double> flags = new HashMap<>();
        flags.put("hate_speech", 0.6);
        highFlagEvaluation.setFlags(flags);

        when(evaluationRepository.findByFlagAboveThreshold("hate_speech", 0.5))
                .thenReturn(Collections.singletonList(highFlagEvaluation));

        List<ContentEvaluation> evaluations = evaluationService.getEvaluationsWithFlagAboveThreshold("hate_speech", 0.5);

        assertNotNull(evaluations);
        assertEquals(1, evaluations.size());
        assertTrue(evaluations.get(0).getFlags().get("hate_speech") > 0.5);
        verify(evaluationRepository, times(1)).findByFlagAboveThreshold("hate_speech", 0.5);
    }

    @Test
    public void testUpdateEvaluationDetails() {
        when(evaluationRepository.findById(evaluationId)).thenReturn(Optional.of(testEvaluation));
        when(evaluationRepository.save(any(ContentEvaluation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContentEvaluation result = evaluationService.updateEvaluationDetails(evaluationId, "Updated evaluation details");

        assertNotNull(result);
        assertEquals("Updated evaluation details", result.getEvaluationDetails());
        verify(evaluationRepository, times(1)).findById(evaluationId);
        verify(evaluationRepository, times(1)).save(any(ContentEvaluation.class));
    }
}
