package ai.lumina.deployment.test;

import ai.lumina.deployment.model.Deployment;
import ai.lumina.deployment.model.DeploymentStatus;
import ai.lumina.deployment.repository.DeploymentRepository;
import ai.lumina.deployment.service.DeploymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class DeploymentServiceTest {

    @Mock
    private DeploymentRepository deploymentRepository;

    @InjectMocks
    private DeploymentService deploymentService;

    private Deployment testDeployment;
    private final String deploymentId = UUID.randomUUID().toString();

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        testDeployment = new Deployment();
        testDeployment.setId(deploymentId);
        testDeployment.setName("Test Deployment");
        testDeployment.setDescription("Test Deployment Description");
        testDeployment.setStatus(DeploymentStatus.CREATED);
        testDeployment.setEnvironment("development");
        testDeployment.setCreatedAt(LocalDateTime.now());
        testDeployment.setCreatedBy("test-user");
    }

    @Test
    public void testCreateDeployment() {
        when(deploymentRepository.save(any(Deployment.class))).thenReturn(testDeployment);

        Deployment createdDeployment = deploymentService.createDeployment(testDeployment);

        assertNotNull(createdDeployment);
        assertEquals(testDeployment.getName(), createdDeployment.getName());
        assertEquals(testDeployment.getDescription(), createdDeployment.getDescription());
        assertEquals(DeploymentStatus.CREATED, createdDeployment.getStatus());
        verify(deploymentRepository, times(1)).save(any(Deployment.class));
    }

    @Test
    public void testGetDeployment() {
        when(deploymentRepository.findById(deploymentId)).thenReturn(Optional.of(testDeployment));

        Deployment foundDeployment = deploymentService.getDeployment(deploymentId);

        assertNotNull(foundDeployment);
        assertEquals(deploymentId, foundDeployment.getId());
        assertEquals(testDeployment.getName(), foundDeployment.getName());
        verify(deploymentRepository, times(1)).findById(deploymentId);
    }

    @Test
    public void testGetDeploymentNotFound() {
        when(deploymentRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            deploymentService.getDeployment("non-existent-id");
        });

        verify(deploymentRepository, times(1)).findById("non-existent-id");
    }

    @Test
    public void testGetAllDeployments() {
        Deployment secondDeployment = new Deployment();
        secondDeployment.setId(UUID.randomUUID().toString());
        secondDeployment.setName("Second Deployment");
        secondDeployment.setStatus(DeploymentStatus.RUNNING);

        when(deploymentRepository.findAll()).thenReturn(Arrays.asList(testDeployment, secondDeployment));

        List<Deployment> deployments = deploymentService.getAllDeployments();

        assertNotNull(deployments);
        assertEquals(2, deployments.size());
        verify(deploymentRepository, times(1)).findAll();
    }

    @Test
    public void testUpdateDeployment() {
        Deployment updatedDeployment = new Deployment();
        updatedDeployment.setName("Updated Deployment");
        updatedDeployment.setDescription("Updated Description");
        updatedDeployment.setEnvironment("production");
        updatedDeployment.setUpdatedBy("update-user");

        when(deploymentRepository.findById(deploymentId)).thenReturn(Optional.of(testDeployment));
        when(deploymentRepository.save(any(Deployment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Deployment result = deploymentService.updateDeployment(deploymentId, updatedDeployment);

        assertNotNull(result);
        assertEquals(updatedDeployment.getName(), result.getName());
        assertEquals(updatedDeployment.getDescription(), result.getDescription());
        assertEquals(updatedDeployment.getEnvironment(), result.getEnvironment());
        assertEquals(updatedDeployment.getUpdatedBy(), result.getUpdatedBy());
        assertNotNull(result.getUpdatedAt());
        verify(deploymentRepository, times(1)).findById(deploymentId);
        verify(deploymentRepository, times(1)).save(any(Deployment.class));
    }

    @Test
    public void testDeleteDeployment() {
        when(deploymentRepository.findById(deploymentId)).thenReturn(Optional.of(testDeployment));
        doNothing().when(deploymentRepository).delete(testDeployment);

        deploymentService.deleteDeployment(deploymentId);

        verify(deploymentRepository, times(1)).findById(deploymentId);
        verify(deploymentRepository, times(1)).delete(testDeployment);
    }

    @Test
    public void testDeleteRunningDeployment() {
        testDeployment.setStatus(DeploymentStatus.RUNNING);
        when(deploymentRepository.findById(deploymentId)).thenReturn(Optional.of(testDeployment));

        assertThrows(IllegalStateException.class, () -> {
            deploymentService.deleteDeployment(deploymentId);
        });

        verify(deploymentRepository, times(1)).findById(deploymentId);
        verify(deploymentRepository, never()).delete(any(Deployment.class));
    }

    @Test
    public void testStartDeployment() {
        when(deploymentRepository.findById(deploymentId)).thenReturn(Optional.of(testDeployment));
        when(deploymentRepository.save(any(Deployment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Deployment result = deploymentService.startDeployment(deploymentId, "start-user");

        assertNotNull(result);
        assertEquals(DeploymentStatus.RUNNING, result.getStatus());
        assertEquals("start-user", result.getUpdatedBy());
        assertNotNull(result.getUpdatedAt());
        verify(deploymentRepository, times(1)).findById(deploymentId);
        verify(deploymentRepository, times(1)).save(any(Deployment.class));
    }

    @Test
    public void testStartAlreadyRunningDeployment() {
        testDeployment.setStatus(DeploymentStatus.RUNNING);
        when(deploymentRepository.findById(deploymentId)).thenReturn(Optional.of(testDeployment));

        assertThrows(IllegalStateException.class, () -> {
            deploymentService.startDeployment(deploymentId, "start-user");
        });

        verify(deploymentRepository, times(1)).findById(deploymentId);
        verify(deploymentRepository, never()).save(any(Deployment.class));
    }

    @Test
    public void testStopDeployment() {
        testDeployment.setStatus(DeploymentStatus.RUNNING);
        when(deploymentRepository.findById(deploymentId)).thenReturn(Optional.of(testDeployment));
        when(deploymentRepository.save(any(Deployment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Deployment result = deploymentService.stopDeployment(deploymentId, "stop-user");

        assertNotNull(result);
        assertEquals(DeploymentStatus.STOPPED, result.getStatus());
        assertEquals("stop-user", result.getUpdatedBy());
        assertNotNull(result.getUpdatedAt());
        verify(deploymentRepository, times(1)).findById(deploymentId);
        verify(deploymentRepository, times(1)).save(any(Deployment.class));
    }

    @Test
    public void testStopNotRunningDeployment() {
        when(deploymentRepository.findById(deploymentId)).thenReturn(Optional.of(testDeployment));

        assertThrows(IllegalStateException.class, () -> {
            deploymentService.stopDeployment(deploymentId, "stop-user");
        });

        verify(deploymentRepository, times(1)).findById(deploymentId);
        verify(deploymentRepository, never()).save(any(Deployment.class));
    }
}
