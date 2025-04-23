package ai.lumina.workflow.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import ai.lumina.workflow.model.ExecutionContext;
import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.WorkflowDefinition;
import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.model.WorkflowStep;
import ai.lumina.workflow.model.WorkflowTransition;
import ai.lumina.workflow.model.WorkflowInstance.WorkflowStatus;
import ai.lumina.workflow.repository.ExecutionContextRepository;
import ai.lumina.workflow.repository.StepExecutionRepository;
import ai.lumina.workflow.repository.WorkflowDefinitionRepository;
import ai.lumina.workflow.repository.WorkflowInstanceRepository;
import ai.lumina.workflow.service.WorkflowExecutionEngine;

/**
 * Unit tests for the WorkflowExecutionEngine service.
 */
public class WorkflowExecutionEngineTest {

    @Mock
    private WorkflowDefinitionRepository workflowDefinitionRepository;
    
    @Mock
    private WorkflowInstanceRepository workflowInstanceRepository;
    
    @Mock
    private StepExecutionRepository stepExecutionRepository;
    
    @Mock
    private ExecutionContextRepository executionContextRepository;
    
    @InjectMocks
    private WorkflowExecutionEngine workflowExecutionEngine;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testStartWorkflow() {
        // Prepare test data
        String workflowDefinitionId = "test-workflow-def-1";
        String workflowName = "Test Workflow";
        String userId = "test-user-1";
        Map<String, Object> initialContext = new HashMap<>();
        initialContext.put("key1", "value1");
        
        // Create a mock workflow definition
        WorkflowDefinition definition = new WorkflowDefinition();
        definition.setId(workflowDefinitionId);
        definition.setName(workflowName);
        
        // Create a mock start step
        WorkflowStep startStep = new WorkflowStep();
        startStep.setId("start-step-1");
        startStep.setName("Start Step");
        startStep.setType(WorkflowStep.StepType.START);
        
        // Add the start step to the definition
        definition.setSteps(Arrays.asList(startStep));
        
        // Mock repository responses
        when(workflowDefinitionRepository.findById(workflowDefinitionId)).thenReturn(Optional.of(definition));
        
        // Mock saving workflow instance
        when(workflowInstanceRepository.save(any(WorkflowInstance.class))).thenAnswer(invocation -> {
            WorkflowInstance instance = invocation.getArgument(0);
            return instance;
        });
        
        // Mock saving execution context
        when(executionContextRepository.save(any(ExecutionContext.class))).thenAnswer(invocation -> {
            ExecutionContext context = invocation.getArgument(0);
            return context;
        });
        
        // Mock saving step execution
        when(stepExecutionRepository.save(any(StepExecution.class))).thenAnswer(invocation -> {
            StepExecution stepExecution = invocation.getArgument(0);
            return stepExecution;
        });
        
        // Call the method under test
        WorkflowInstance result = workflowExecutionEngine.startWorkflow(workflowDefinitionId, workflowName, userId, initialContext);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(workflowDefinitionId, result.getWorkflowDefinitionId());
        assertEquals(workflowName, result.getName());
        assertEquals(userId, result.getCreatedBy());
        assertEquals(WorkflowStatus.RUNNING, result.getStatus());
        assertEquals(startStep.getId(), result.getCurrentStepId());
        
        // Verify repository interactions
        verify(workflowDefinitionRepository).findById(workflowDefinitionId);
        verify(workflowInstanceRepository, times(2)).save(any(WorkflowInstance.class));
        verify(executionContextRepository).save(any(ExecutionContext.class));
        verify(stepExecutionRepository).save(any(StepExecution.class));
    }
    
    @Test
    public void testPauseWorkflow() {
        // Prepare test data
        String workflowInstanceId = "test-workflow-instance-1";
        
        // Create a mock workflow instance
        WorkflowInstance instance = new WorkflowInstance();
        instance.setId(workflowInstanceId);
        instance.setStatus(WorkflowStatus.RUNNING);
        
        // Mock repository responses
        when(workflowInstanceRepository.findById(workflowInstanceId)).thenReturn(Optional.of(instance));
        when(workflowInstanceRepository.save(any(WorkflowInstance.class))).thenAnswer(invocation -> {
            WorkflowInstance savedInstance = invocation.getArgument(0);
            return savedInstance;
        });
        
        // Call the method under test
        WorkflowInstance result = workflowExecutionEngine.pauseWorkflow(workflowInstanceId);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(workflowInstanceId, result.getId());
        assertEquals(WorkflowStatus.PAUSED, result.getStatus());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findById(workflowInstanceId);
        verify(workflowInstanceRepository).save(any(WorkflowInstance.class));
    }
    
    @Test
    public void testResumeWorkflow() {
        // Prepare test data
        String workflowInstanceId = "test-workflow-instance-1";
        
        // Create a mock workflow instance
        WorkflowInstance instance = new WorkflowInstance();
        instance.setId(workflowInstanceId);
        instance.setStatus(WorkflowStatus.PAUSED);
        
        // Mock repository responses
        when(workflowInstanceRepository.findById(workflowInstanceId)).thenReturn(Optional.of(instance));
        when(workflowInstanceRepository.save(any(WorkflowInstance.class))).thenAnswer(invocation -> {
            WorkflowInstance savedInstance = invocation.getArgument(0);
            return savedInstance;
        });
        
        // Call the method under test
        WorkflowInstance result = workflowExecutionEngine.resumeWorkflow(workflowInstanceId);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(workflowInstanceId, result.getId());
        assertEquals(WorkflowStatus.RUNNING, result.getStatus());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findById(workflowInstanceId);
        verify(workflowInstanceRepository).save(any(WorkflowInstance.class));
    }
    
    @Test
    public void testCancelWorkflow() {
        // Prepare test data
        String workflowInstanceId = "test-workflow-instance-1";
        
        // Create a mock workflow instance
        WorkflowInstance instance = new WorkflowInstance();
        instance.setId(workflowInstanceId);
        instance.setStatus(WorkflowStatus.RUNNING);
        
        // Mock repository responses
        when(workflowInstanceRepository.findById(workflowInstanceId)).thenReturn(Optional.of(instance));
        when(workflowInstanceRepository.save(any(WorkflowInstance.class))).thenAnswer(invocation -> {
            WorkflowInstance savedInstance = invocation.getArgument(0);
            return savedInstance;
        });
        
        // Call the method under test
        WorkflowInstance result = workflowExecutionEngine.cancelWorkflow(workflowInstanceId);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(workflowInstanceId, result.getId());
        assertEquals(WorkflowStatus.CANCELLED, result.getStatus());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findById(workflowInstanceId);
        verify(workflowInstanceRepository).save(any(WorkflowInstance.class));
    }
    
    @Test
    public void testUpdateExecutionContext() {
        // Prepare test data
        String workflowInstanceId = "test-workflow-instance-1";
        Map<String, Object> updates = new HashMap<>();
        updates.put("key1", "updated-value1");
        updates.put("key2", "value2");
        
        // Create a mock execution context
        ExecutionContext context = new ExecutionContext(workflowInstanceId);
        context.put("key1", "value1");
        
        // Mock repository responses
        when(executionContextRepository.findByWorkflowInstanceId(workflowInstanceId)).thenReturn(Optional.of(context));
        when(executionContextRepository.save(any(ExecutionContext.class))).thenAnswer(invocation -> {
            ExecutionContext savedContext = invocation.getArgument(0);
            return savedContext;
        });
        
        // Call the method under test
        ExecutionContext result = workflowExecutionEngine.updateExecutionContext(workflowInstanceId, updates);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(workflowInstanceId, result.getWorkflowInstanceId());
        assertEquals("updated-value1", result.get("key1"));
        assertEquals("value2", result.get("key2"));
        
        // Verify repository interactions
        verify(executionContextRepository).findByWorkflowInstanceId(workflowInstanceId);
        verify(executionContextRepository).save(any(ExecutionContext.class));
    }
}
