package ai.lumina.workflow.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import ai.lumina.workflow.model.StepExecution;
import ai.lumina.workflow.model.WorkflowInstance;
import ai.lumina.workflow.model.StepExecution.StepStatus;
import ai.lumina.workflow.model.WorkflowInstance.WorkflowStatus;
import ai.lumina.workflow.repository.StepExecutionRepository;
import ai.lumina.workflow.repository.WorkflowInstanceRepository;
import ai.lumina.workflow.service.WorkflowMonitoringService;

/**
 * Unit tests for the WorkflowMonitoringService.
 */
public class WorkflowMonitoringServiceTest {

    @Mock
    private WorkflowInstanceRepository workflowInstanceRepository;
    
    @Mock
    private StepExecutionRepository stepExecutionRepository;
    
    @InjectMocks
    private WorkflowMonitoringService workflowMonitoringService;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testGetAllWorkflowInstances() {
        // Prepare test data
        Pageable pageable = PageRequest.of(0, 10);
        List<WorkflowInstance> instances = Arrays.asList(
                createWorkflowInstance("1", "Workflow 1", WorkflowStatus.RUNNING),
                createWorkflowInstance("2", "Workflow 2", WorkflowStatus.COMPLETED)
        );
        Page<WorkflowInstance> page = new PageImpl<>(instances, pageable, instances.size());
        
        // Mock repository response
        when(workflowInstanceRepository.findAll(pageable)).thenReturn(page);
        
        // Call the method under test
        Page<WorkflowInstance> result = workflowMonitoringService.getAllWorkflowInstances(pageable);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals("Workflow 1", result.getContent().get(0).getName());
        assertEquals("Workflow 2", result.getContent().get(1).getName());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findAll(pageable);
    }
    
    @Test
    public void testGetWorkflowInstancesByStatus() {
        // Prepare test data
        Pageable pageable = PageRequest.of(0, 10);
        WorkflowStatus status = WorkflowStatus.RUNNING;
        List<WorkflowInstance> instances = Arrays.asList(
                createWorkflowInstance("1", "Workflow 1", status),
                createWorkflowInstance("2", "Workflow 2", status)
        );
        Page<WorkflowInstance> page = new PageImpl<>(instances, pageable, instances.size());
        
        // Mock repository response
        when(workflowInstanceRepository.findByStatus(status, pageable)).thenReturn(page);
        
        // Call the method under test
        Page<WorkflowInstance> result = workflowMonitoringService.getWorkflowInstancesByStatus(status, pageable);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(status, result.getContent().get(0).getStatus());
        assertEquals(status, result.getContent().get(1).getStatus());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findByStatus(status, pageable);
    }
    
    @Test
    public void testGetWorkflowInstancesByUser() {
        // Prepare test data
        Pageable pageable = PageRequest.of(0, 10);
        String userId = "user-1";
        List<WorkflowInstance> instances = Arrays.asList(
                createWorkflowInstance("1", "Workflow 1", WorkflowStatus.RUNNING, userId),
                createWorkflowInstance("2", "Workflow 2", WorkflowStatus.COMPLETED, userId)
        );
        Page<WorkflowInstance> page = new PageImpl<>(instances, pageable, instances.size());
        
        // Mock repository response
        when(workflowInstanceRepository.findByCreatedBy(userId, pageable)).thenReturn(page);
        
        // Call the method under test
        Page<WorkflowInstance> result = workflowMonitoringService.getWorkflowInstancesByUser(userId, pageable);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(userId, result.getContent().get(0).getCreatedBy());
        assertEquals(userId, result.getContent().get(1).getCreatedBy());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findByCreatedBy(userId, pageable);
    }
    
    @Test
    public void testGetLongRunningWorkflows() {
        // Prepare test data
        int minutes = 60;
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(minutes);
        List<WorkflowInstance> instances = Arrays.asList(
                createWorkflowInstance("1", "Workflow 1", WorkflowStatus.RUNNING),
                createWorkflowInstance("2", "Workflow 2", WorkflowStatus.RUNNING)
        );
        
        // Mock repository response
        when(workflowInstanceRepository.findByStatusAndStartedAtBefore(WorkflowStatus.RUNNING, threshold)).thenReturn(instances);
        
        // Call the method under test
        List<WorkflowInstance> result = workflowMonitoringService.getLongRunningWorkflows(minutes);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(2, result.size());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findByStatusAndStartedAtBefore(WorkflowStatus.RUNNING, threshold);
    }
    
    @Test
    public void testGetFailedWorkflows() {
        // Prepare test data
        List<WorkflowInstance> instances = Arrays.asList(
                createWorkflowInstance("1", "Workflow 1", WorkflowStatus.FAILED),
                createWorkflowInstance("2", "Workflow 2", WorkflowStatus.FAILED)
        );
        
        // Mock repository response
        when(workflowInstanceRepository.findByStatus(WorkflowStatus.FAILED)).thenReturn(instances);
        
        // Call the method under test
        List<WorkflowInstance> result = workflowMonitoringService.getFailedWorkflows();
        
        // Verify the result
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(WorkflowStatus.FAILED, result.get(0).getStatus());
        assertEquals(WorkflowStatus.FAILED, result.get(1).getStatus());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findByStatus(WorkflowStatus.FAILED);
    }
    
    @Test
    public void testGetFailedStepExecutions() {
        // Prepare test data
        List<StepExecution> stepExecutions = Arrays.asList(
                createStepExecution("1", "Step 1", StepStatus.FAILED),
                createStepExecution("2", "Step 2", StepStatus.FAILED)
        );
        
        // Mock repository response
        when(stepExecutionRepository.findByStatus(StepStatus.FAILED)).thenReturn(stepExecutions);
        
        // Call the method under test
        List<StepExecution> result = workflowMonitoringService.getFailedStepExecutions();
        
        // Verify the result
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(StepStatus.FAILED, result.get(0).getStatus());
        assertEquals(StepStatus.FAILED, result.get(1).getStatus());
        
        // Verify repository interactions
        verify(stepExecutionRepository).findByStatus(StepStatus.FAILED);
    }
    
    @Test
    public void testGetWorkflowStatistics() {
        // Prepare test data
        when(workflowInstanceRepository.countByStatus(WorkflowStatus.RUNNING)).thenReturn(5L);
        when(workflowInstanceRepository.countByStatus(WorkflowStatus.COMPLETED)).thenReturn(10L);
        when(workflowInstanceRepository.countByStatus(WorkflowStatus.FAILED)).thenReturn(2L);
        when(workflowInstanceRepository.countByStatus(WorkflowStatus.PAUSED)).thenReturn(3L);
        when(workflowInstanceRepository.countByStatus(WorkflowStatus.CANCELLED)).thenReturn(1L);
        when(workflowInstanceRepository.countByStatus(WorkflowStatus.CREATED)).thenReturn(4L);
        when(workflowInstanceRepository.count()).thenReturn(25L);
        
        List<WorkflowInstance> completedWorkflows = Arrays.asList(
                createCompletedWorkflowInstance("1", "Workflow 1", LocalDateTime.now().minusMinutes(30), LocalDateTime.now()),
                createCompletedWorkflowInstance("2", "Workflow 2", LocalDateTime.now().minusMinutes(60), LocalDateTime.now())
        );
        when(workflowInstanceRepository.findByStatus(WorkflowStatus.COMPLETED)).thenReturn(completedWorkflows);
        
        when(stepExecutionRepository.countByStatus(any(StepStatus.class))).thenReturn(5L);
        
        // Call the method under test
        Map<String, Object> result = workflowMonitoringService.getWorkflowStatistics();
        
        // Verify the result
        assertNotNull(result);
        assertEquals(5L, result.get("count_running"));
        assertEquals(10L, result.get("count_completed"));
        assertEquals(2L, result.get("count_failed"));
        assertEquals(3L, result.get("count_paused"));
        assertEquals(1L, result.get("count_cancelled"));
        assertEquals(4L, result.get("count_created"));
        assertEquals(25L, result.get("count_total"));
        assertTrue(result.containsKey("avg_completion_time_minutes"));
        
        // Verify repository interactions
        verify(workflowInstanceRepository, times(6)).countByStatus(any(WorkflowStatus.class));
        verify(workflowInstanceRepository).count();
        verify(workflowInstanceRepository).findByStatus(WorkflowStatus.COMPLETED);
        verify(stepExecutionRepository, times(7)).countByStatus(any(StepStatus.class));
    }
    
    @Test
    public void testDetectStalledWorkflows() {
        // Prepare test data
        int minutes = 30;
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(minutes);
        List<WorkflowInstance> instances = Arrays.asList(
                createWorkflowInstance("1", "Workflow 1", WorkflowStatus.RUNNING),
                createWorkflowInstance("2", "Workflow 2", WorkflowStatus.RUNNING)
        );
        
        // Mock repository response
        when(workflowInstanceRepository.findByStatusAndUpdatedAtBefore(WorkflowStatus.RUNNING, threshold)).thenReturn(instances);
        
        // Call the method under test
        List<WorkflowInstance> result = workflowMonitoringService.detectStalledWorkflows(minutes);
        
        // Verify the result
        assertNotNull(result);
        assertEquals(2, result.size());
        
        // Verify repository interactions
        verify(workflowInstanceRepository).findByStatusAndUpdatedAtBefore(WorkflowStatus.RUNNING, threshold);
    }
    
    // Helper methods to create test objects
    
    private WorkflowInstance createWorkflowInstance(String id, String name, WorkflowStatus status) {
        return createWorkflowInstance(id, name, status, "user-1");
    }
    
    private WorkflowInstance createWorkflowInstance(String id, String name, WorkflowStatus status, String createdBy) {
        WorkflowInstance instance = new WorkflowInstance();
        instance.setId(id);
        instance.setName(name);
        instance.setStatus(status);
        instance.setCreatedBy(createdBy);
        instance.setCreatedAt(LocalDateTime.now().minusHours(1));
        instance.setUpdatedAt(LocalDateTime.now().minusMinutes(30));
        instance.setStartedAt(LocalDateTime.now().minusHours(1));
        return instance;
    }
    
    private WorkflowInstance createCompletedWorkflowInstance(String id, String name, LocalDateTime startedAt, LocalDateTime completedAt) {
        WorkflowInstance instance = createWorkflowInstance(id, name, WorkflowStatus.COMPLETED);
        instance.setStartedAt(startedAt);
        instance.setCompletedAt(completedAt);
        return instance;
    }
    
    private StepExecution createStepExecution(String id, String name, StepStatus status) {
        StepExecution stepExecution = new StepExecution();
        stepExecution.setId(id);
        stepExecution.setStepName(name);
        stepExecution.setStatus(status);
        stepExecution.setCreatedAt(LocalDateTime.now().minusHours(1));
        stepExecution.setUpdatedAt(LocalDateTime.now().minusMinutes(30));
        return stepExecution;
    }
}
