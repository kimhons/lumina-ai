package ai.lumina.workflow.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import ai.lumina.collaboration.model.Agent;
import ai.lumina.collaboration.model.Team;
import ai.lumina.collaboration.model.SharedContext;
import ai.lumina.collaboration.service.AdvancedTeamFormationService;
import ai.lumina.collaboration.service.NegotiationService;
import ai.lumina.collaboration.service.SharedContextService;
import ai.lumina.workflow.model.ExecutionContext;
import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.repository.ExecutionContextRepository;
import ai.lumina.workflow.repository.StepExecutionRepository;
import ai.lumina.workflow.service.CollaborationIntegrationService;

/**
 * Unit tests for the CollaborationIntegrationService.
 */
public class CollaborationIntegrationServiceTest {

    @Mock
    private AdvancedTeamFormationService teamFormationService;
    
    @Mock
    private NegotiationService negotiationService;
    
    @Mock
    private SharedContextService sharedContextService;
    
    @Mock
    private StepExecutionRepository stepExecutionRepository;
    
    @Mock
    private ExecutionContextRepository executionContextRepository;
    
    @InjectMocks
    private CollaborationIntegrationService collaborationIntegrationService;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testAssignStepToAgent() {
        // Prepare test data
        StepExecution stepExecution = new StepExecution();
        stepExecution.setId("step-1");
        stepExecution.setStepId("workflow-step-1");
        stepExecution.setStepName("Test Step");
        stepExecution.setAssignedAgentRole("analyst");
        
        Agent agent = new Agent();
        agent.setId("agent-1");
        agent.setRole("analyst");
        
        Map<String, Object> capabilityRequirements = new HashMap<>();
        capabilityRequirements.put("stepId", stepExecution.getStepId());
        capabilityRequirements.put("stepName", stepExecution.getStepName());
        
        // Mock service responses
        when(teamFormationService.findMostSuitableAgent(eq("analyst"), any(Map.class))).thenReturn(agent);
        when(stepExecutionRepository.save(any(StepExecution.class))).thenReturn(stepExecution);
        
        // Call the method under test
        StepExecution result = collaborationIntegrationService.assignStepToAgent(stepExecution);
        
        // Verify the result
        assertNotNull(result);
        assertEquals("agent-1", result.getAssignedAgentId());
        assertEquals("analyst", result.getAssignedAgentRole());
        
        // Verify service interactions
        verify(teamFormationService).findMostSuitableAgent(eq("analyst"), any(Map.class));
        verify(stepExecutionRepository).save(stepExecution);
    }
    
    @Test
    public void testCreateTeamForWorkflow() {
        // Prepare test data
        WorkflowInstance workflowInstance = new WorkflowInstance();
        workflowInstance.setId("workflow-1");
        workflowInstance.setName("Test Workflow");
        workflowInstance.setCreatedBy("user-1");
        workflowInstance.setPriority(3);
        
        String[] requiredRoles = new String[] {"analyst", "developer", "reviewer"};
        
        Team team = new Team();
        team.setId("team-1");
        team.setName("Workflow-Test Workflow-Team");
        
        // Mock service responses
        when(teamFormationService.createTeam(eq("Workflow-Test Workflow-Team"), eq(requiredRoles), any(Map.class))).thenReturn(team);
        
        // Call the method under test
        Team result = collaborationIntegrationService.createTeamForWorkflow(workflowInstance, requiredRoles);
        
        // Verify the result
        assertNotNull(result);
        assertEquals("team-1", result.getId());
        assertEquals("Workflow-Test Workflow-Team", result.getName());
        
        // Verify service interactions
        verify(teamFormationService).createTeam(eq("Workflow-Test Workflow-Team"), eq(requiredRoles), any(Map.class));
    }
    
    @Test
    public void testSynchronizeContext() {
        // Prepare test data
        String workflowInstanceId = "workflow-1";
        String teamId = "team-1";
        
        ExecutionContext executionContext = new ExecutionContext(workflowInstanceId);
        executionContext.put("key1", "value1");
        executionContext.put("key2", "value2");
        
        SharedContext sharedContext = new SharedContext();
        sharedContext.setId("shared-context-1");
        sharedContext.setTeamId(teamId);
        Map<String, Object> sharedData = new HashMap<>();
        sharedData.put("key3", "value3");
        sharedData.put("key4", "value4");
        sharedContext.setData(sharedData);
        
        // Mock service responses
        when(executionContextRepository.findByWorkflowInstanceId(workflowInstanceId)).thenReturn(Optional.of(executionContext));
        when(sharedContextService.getSharedContext(teamId)).thenReturn(sharedContext);
        when(executionContextRepository.save(any(ExecutionContext.class))).thenReturn(executionContext);
        
        // Call the method under test
        ExecutionContext result = collaborationIntegrationService.synchronizeContext(workflowInstanceId, teamId);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(workflowInstanceId, result.getWorkflowInstanceId());
        assertEquals("value1", result.get("key1"));
        assertEquals("value2", result.get("key2"));
        assertEquals("value3", result.get("key3"));
        assertEquals("value4", result.get("key4"));
        
        // Verify service interactions
        verify(executionContextRepository).findByWorkflowInstanceId(workflowInstanceId);
        verify(sharedContextService).getSharedContext(teamId);
        verify(sharedContextService).updateSharedContext(eq(teamId), any(Map.class));
        verify(executionContextRepository).save(executionContext);
    }
    
    @Test
    public void testNegotiateResourcesForStep() {
        // Prepare test data
        StepExecution stepExecution = new StepExecution();
        stepExecution.setId("step-1");
        stepExecution.setStepId("workflow-step-1");
        stepExecution.setStepName("Test Step");
        stepExecution.setAssignedAgentId("agent-1");
        stepExecution.setAssignedAgentRole("analyst");
        stepExecution.setTimeoutSeconds(300);
        
        String teamId = "team-1";
        
        // Mock service responses
        when(negotiationService.negotiateResources(eq(teamId), eq(stepExecution.getId()), any(Map.class))).thenReturn(true);
        
        // Call the method under test
        boolean result = collaborationIntegrationService.negotiateResourcesForStep(stepExecution, teamId);
        
        // Verify the result
        assertTrue(result);
        
        // Verify service interactions
        verify(negotiationService).negotiateResources(eq(teamId), eq(stepExecution.getId()), any(Map.class));
    }
    
    @Test
    public void testNotifyAgents() {
        // Prepare test data
        WorkflowInstance workflowInstance = new WorkflowInstance();
        workflowInstance.setId("workflow-1");
        workflowInstance.setName("Test Workflow");
        
        String eventType = "workflow_completed";
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("completionTime", "2025-04-22T22:00:00Z");
        eventData.put("status", "success");
        
        // Call the method under test
        collaborationIntegrationService.notifyAgents(workflowInstance, eventType, eventData);
        
        // Verify service interactions
        verify(sharedContextService).broadcastNotification(any(Map.class));
    }
}
