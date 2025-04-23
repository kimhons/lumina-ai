package ai.lumina.governance.test;

import ai.lumina.governance.controller.ContentEvaluationController;
import ai.lumina.governance.model.ContentEvaluation;
import ai.lumina.governance.service.ContentEvaluationService;
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

public class ContentEvaluationControllerTest {

    @Mock
    private ContentEvaluationService evaluationService;

    @InjectMocks
    private ContentEvaluationController evaluationController;

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
        when(evaluationService.evaluateContent(
                anyString(),
                any(ContentEvaluation.ContentType.class),
                anyString(),
                anyString(),
                anyString(),
                anyString()
        )).thenReturn(testEvaluation);

        ResponseEntity<ContentEvaluation> response = evaluationController.evaluateContent(
                "This is test content for evaluation",
                ContentEvaluation.ContentType.MODEL_OUTPUT,
                requestId,
                userId,
                modelId,
                providerId
        );

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testEvaluation, response.getBody());
        verify(evaluationService, times(1)).evaluateContent(
                anyString(),
                any(ContentEvaluation.ContentType.class),
                anyString(),
                anyString(),
                anyString(),
                anyString()
        );
    }

    @Test
    public void testGetEvaluation() {
        when(evaluationService.getEvaluation(evaluationId)).thenReturn(testEvaluation);

        ResponseEntity<ContentEvaluation> response = evaluationController.getEvaluation(evaluationId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testEvaluation, response.getBody());
        verify(evaluationService, times(1)).getEvaluation(evaluationId);
    }

    @Test
    public void testGetEvaluationsByUserId() {
        List<ContentEvaluation> evaluations = Collections.singletonList(testEvaluation);
        
        when(evaluationService.getEvaluationsByUserId(userId)).thenReturn(evaluations);

        ResponseEntity<List<ContentEvaluation>> response = evaluationController.getEvaluationsByUserId(userId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evaluations, response.getBody());
        verify(evaluationService, times(1)).getEvaluationsByUserId(userId);
    }

    @Test
    public void testGetEvaluationsByRequestId() {
        List<ContentEvaluation> evaluations = Collections.singletonList(testEvaluation);
        
        when(evaluationService.getEvaluationsByRequestId(requestId)).thenReturn(evaluations);

        ResponseEntity<List<ContentEvaluation>> response = evaluationController.getEvaluationsByRequestId(requestId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evaluations, response.getBody());
        verify(evaluationService, times(1)).getEvaluationsByRequestId(requestId);
    }

    @Test
    public void testGetEvaluationsByContentType() {
        List<ContentEvaluation> evaluations = Collections.singletonList(testEvaluation);
        
        when(evaluationService.getEvaluationsByContentType(ContentEvaluation.ContentType.MODEL_OUTPUT)).thenReturn(evaluations);

        ResponseEntity<List<ContentEvaluation>> response = evaluationController.getEvaluationsByContentType(ContentEvaluation.ContentType.MODEL_OUTPUT);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evaluations, response.getBody());
        verify(evaluationService, times(1)).getEvaluationsByContentType(ContentEvaluation.ContentType.MODEL_OUTPUT);
    }

    @Test
    public void testGetEvaluationsBelowSafetyThreshold() {
        List<ContentEvaluation> evaluations = Collections.singletonList(testEvaluation);
        
        when(evaluationService.getEvaluationsBelowSafetyThreshold(0.5)).thenReturn(evaluations);

        ResponseEntity<List<ContentEvaluation>> response = evaluationController.getEvaluationsBelowSafetyThreshold(0.5);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evaluations, response.getBody());
        verify(evaluationService, times(1)).getEvaluationsBelowSafetyThreshold(0.5);
    }

    @Test
    public void testGetEvaluationsBelowPrivacyThreshold() {
        List<ContentEvaluation> evaluations = Collections.singletonList(testEvaluation);
        
        when(evaluationService.getEvaluationsBelowPrivacyThreshold(0.6)).thenReturn(evaluations);

        ResponseEntity<List<ContentEvaluation>> response = evaluationController.getEvaluationsBelowPrivacyThreshold(0.6);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evaluations, response.getBody());
        verify(evaluationService, times(1)).getEvaluationsBelowPrivacyThreshold(0.6);
    }

    @Test
    public void testGetEvaluationsBelowTransparencyThreshold() {
        List<ContentEvaluation> evaluations = Collections.singletonList(testEvaluation);
        
        when(evaluationService.getEvaluationsBelowTransparencyThreshold(0.7)).thenReturn(evaluations);

        ResponseEntity<List<ContentEvaluation>> response = evaluationController.getEvaluationsBelowTransparencyThreshold(0.7);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evaluations, response.getBody());
        verify(evaluationService, times(1)).getEvaluationsBelowTransparencyThreshold(0.7);
    }

    @Test
    public void testGetEvaluationsWithFlag() {
        List<ContentEvaluation> evaluations = Collections.singletonList(testEvaluation);
        
        when(evaluationService.getEvaluationsWithFlag("hate_speech")).thenReturn(evaluations);

        ResponseEntity<List<ContentEvaluation>> response = evaluationController.getEvaluationsWithFlag("hate_speech");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evaluations, response.getBody());
        verify(evaluationService, times(1)).getEvaluationsWithFlag("hate_speech");
    }

    @Test
    public void testGetEvaluationsWithFlagAboveThreshold() {
        List<ContentEvaluation> evaluations = Collections.singletonList(testEvaluation);
        
        when(evaluationService.getEvaluationsWithFlagAboveThreshold("hate_speech", 0.5)).thenReturn(evaluations);

        ResponseEntity<List<ContentEvaluation>> response = evaluationController.getEvaluationsWithFlagAboveThreshold("hate_speech", 0.5);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evaluations, response.getBody());
        verify(evaluationService, times(1)).getEvaluationsWithFlagAboveThreshold("hate_speech", 0.5);
    }

    @Test
    public void testUpdateEvaluationDetails() {
        when(evaluationService.updateEvaluationDetails(eq(evaluationId), anyString())).thenReturn(testEvaluation);

        ResponseEntity<ContentEvaluation> response = evaluationController.updateEvaluationDetails(evaluationId, "Updated evaluation details");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testEvaluation, response.getBody());
        verify(evaluationService, times(1)).updateEvaluationDetails(eq(evaluationId), anyString());
    }
}
