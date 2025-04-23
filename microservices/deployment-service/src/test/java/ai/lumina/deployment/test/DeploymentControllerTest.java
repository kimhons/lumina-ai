package ai.lumina.deployment.test;

import ai.lumina.deployment.controller.DeploymentController;
import ai.lumina.deployment.model.Deployment;
import ai.lumina.deployment.model.DeploymentStatus;
import ai.lumina.deployment.service.DeploymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class DeploymentControllerTest {

    @Mock
    private DeploymentService deploymentService;

    @InjectMocks
    private DeploymentController deploymentController;

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
        when(deploymentService.createDeployment(any(Deployment.class))).thenReturn(testDeployment);

        ResponseEntity<Deployment> response = deploymentController.createDeployment(testDeployment);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testDeployment, response.getBody());
        verify(deploymentService, times(1)).createDeployment(any(Deployment.class));
    }

    @Test
    public void testGetAllDeployments() {
        Deployment secondDeployment = new Deployment();
        secondDeployment.setId(UUID.randomUUID().toString());
        secondDeployment.setName("Second Deployment");
        
        List<Deployment> deployments = Arrays.asList(testDeployment, secondDeployment);
        
        when(deploymentService.getAllDeployments()).thenReturn(deployments);

        ResponseEntity<List<Deployment>> response = deploymentController.getAllDeployments();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(deployments, response.getBody());
        assertEquals(2, response.getBody().size());
        verify(deploymentService, times(1)).getAllDeployments();
    }

    @Test
    public void testGetDeployment() {
        when(deploymentService.getDeployment(deploymentId)).thenReturn(testDeployment);

        ResponseEntity<Deployment> response = deploymentController.getDeployment(deploymentId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testDeployment, response.getBody());
        verify(deploymentService, times(1)).getDeployment(deploymentId);
    }

    @Test
    public void testUpdateDeployment() {
        Deployment updatedDeployment = new Deployment();
        updatedDeployment.setName("Updated Deployment");
        updatedDeployment.setDescription("Updated Description");
        
        when(deploymentService.updateDeployment(eq(deploymentId), any(Deployment.class))).thenReturn(updatedDeployment);

        ResponseEntity<Deployment> response = deploymentController.updateDeployment(deploymentId, updatedDeployment);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedDeployment, response.getBody());
        verify(deploymentService, times(1)).updateDeployment(eq(deploymentId), any(Deployment.class));
    }

    @Test
    public void testDeleteDeployment() {
        doNothing().when(deploymentService).deleteDeployment(deploymentId);

        ResponseEntity<Void> response = deploymentController.deleteDeployment(deploymentId);

        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(deploymentService, times(1)).deleteDeployment(deploymentId);
    }

    @Test
    public void testStartDeployment() {
        Deployment startedDeployment = new Deployment();
        startedDeployment.setId(deploymentId);
        startedDeployment.setStatus(DeploymentStatus.RUNNING);
        
        when(deploymentService.startDeployment(eq(deploymentId), anyString())).thenReturn(startedDeployment);

        ResponseEntity<Deployment> response = deploymentController.startDeployment(deploymentId, "test-user");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(startedDeployment, response.getBody());
        assertEquals(DeploymentStatus.RUNNING, response.getBody().getStatus());
        verify(deploymentService, times(1)).startDeployment(eq(deploymentId), anyString());
    }

    @Test
    public void testStopDeployment() {
        Deployment stoppedDeployment = new Deployment();
        stoppedDeployment.setId(deploymentId);
        stoppedDeployment.setStatus(DeploymentStatus.STOPPED);
        
        when(deploymentService.stopDeployment(eq(deploymentId), anyString())).thenReturn(stoppedDeployment);

        ResponseEntity<Deployment> response = deploymentController.stopDeployment(deploymentId, "test-user");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(stoppedDeployment, response.getBody());
        assertEquals(DeploymentStatus.STOPPED, response.getBody().getStatus());
        verify(deploymentService, times(1)).stopDeployment(eq(deploymentId), anyString());
    }
}
