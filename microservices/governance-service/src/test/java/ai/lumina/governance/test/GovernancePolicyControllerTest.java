package ai.lumina.governance.test;

import ai.lumina.governance.controller.GovernancePolicyController;
import ai.lumina.governance.model.GovernancePolicy;
import ai.lumina.governance.service.GovernancePolicyService;
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

public class GovernancePolicyControllerTest {

    @Mock
    private GovernancePolicyService policyService;

    @InjectMocks
    private GovernancePolicyController policyController;

    private GovernancePolicy testPolicy;
    private final String policyId = UUID.randomUUID().toString();

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        testPolicy = new GovernancePolicy();
        testPolicy.setId(policyId);
        testPolicy.setName("Privacy Policy");
        testPolicy.setDescription("User data privacy protection policy");
        testPolicy.setType(GovernancePolicy.PolicyType.PRIVACY);
        testPolicy.setScope(GovernancePolicy.PolicyScope.USER_INPUT);
        testPolicy.setEnabled(true);
        testPolicy.setPriority(1);
        testPolicy.setPolicyDefinition("User data must be protected and anonymized");
        
        Set<GovernancePolicy.Region> regions = new HashSet<>();
        regions.add(GovernancePolicy.Region.US);
        regions.add(GovernancePolicy.Region.EU);
        testPolicy.setApplicableRegions(regions);
        
        Map<String, String> rules = new HashMap<>();
        rules.put("pii_detection", "Detect and mask personally identifiable information");
        rules.put("data_retention", "Retain user data for no more than 30 days");
        testPolicy.setEnforcementRules(rules);
        
        testPolicy.setCreatedAt(LocalDateTime.now());
        testPolicy.setCreatedBy("admin");
    }

    @Test
    public void testCreatePolicy() {
        when(policyService.createPolicy(any(GovernancePolicy.class))).thenReturn(testPolicy);

        ResponseEntity<GovernancePolicy> response = policyController.createPolicy(testPolicy);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testPolicy, response.getBody());
        verify(policyService, times(1)).createPolicy(any(GovernancePolicy.class));
    }

    @Test
    public void testGetAllPolicies() {
        GovernancePolicy secondPolicy = new GovernancePolicy();
        secondPolicy.setId(UUID.randomUUID().toString());
        secondPolicy.setName("Safety Policy");
        
        List<GovernancePolicy> policies = Arrays.asList(testPolicy, secondPolicy);
        
        when(policyService.getAllPolicies()).thenReturn(policies);

        ResponseEntity<List<GovernancePolicy>> response = policyController.getAllPolicies();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(policies, response.getBody());
        assertEquals(2, response.getBody().size());
        verify(policyService, times(1)).getAllPolicies();
    }

    @Test
    public void testGetPolicy() {
        when(policyService.getPolicy(policyId)).thenReturn(testPolicy);

        ResponseEntity<GovernancePolicy> response = policyController.getPolicy(policyId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testPolicy, response.getBody());
        verify(policyService, times(1)).getPolicy(policyId);
    }

    @Test
    public void testUpdatePolicy() {
        GovernancePolicy updatedPolicy = new GovernancePolicy();
        updatedPolicy.setName("Updated Privacy Policy");
        updatedPolicy.setDescription("Updated Description");
        
        when(policyService.updatePolicy(eq(policyId), any(GovernancePolicy.class))).thenReturn(updatedPolicy);

        ResponseEntity<GovernancePolicy> response = policyController.updatePolicy(policyId, updatedPolicy);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedPolicy, response.getBody());
        verify(policyService, times(1)).updatePolicy(eq(policyId), any(GovernancePolicy.class));
    }

    @Test
    public void testDeletePolicy() {
        doNothing().when(policyService).deletePolicy(policyId);

        ResponseEntity<Void> response = policyController.deletePolicy(policyId);

        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(policyService, times(1)).deletePolicy(policyId);
    }

    @Test
    public void testEnablePolicy() {
        GovernancePolicy enabledPolicy = new GovernancePolicy();
        enabledPolicy.setId(policyId);
        enabledPolicy.setEnabled(true);
        
        when(policyService.enablePolicy(policyId)).thenReturn(enabledPolicy);

        ResponseEntity<GovernancePolicy> response = policyController.enablePolicy(policyId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(enabledPolicy, response.getBody());
        verify(policyService, times(1)).enablePolicy(policyId);
    }

    @Test
    public void testDisablePolicy() {
        GovernancePolicy disabledPolicy = new GovernancePolicy();
        disabledPolicy.setId(policyId);
        disabledPolicy.setEnabled(false);
        
        when(policyService.disablePolicy(policyId)).thenReturn(disabledPolicy);

        ResponseEntity<GovernancePolicy> response = policyController.disablePolicy(policyId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(disabledPolicy, response.getBody());
        verify(policyService, times(1)).disablePolicy(policyId);
    }

    @Test
    public void testGetPoliciesByType() {
        List<GovernancePolicy> policies = Collections.singletonList(testPolicy);
        
        when(policyService.getPoliciesByType(GovernancePolicy.PolicyType.PRIVACY)).thenReturn(policies);

        ResponseEntity<List<GovernancePolicy>> response = policyController.getPoliciesByType(GovernancePolicy.PolicyType.PRIVACY);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(policies, response.getBody());
        verify(policyService, times(1)).getPoliciesByType(GovernancePolicy.PolicyType.PRIVACY);
    }

    @Test
    public void testGetPoliciesByRegion() {
        List<GovernancePolicy> policies = Collections.singletonList(testPolicy);
        
        when(policyService.getPoliciesByRegion(GovernancePolicy.Region.EU)).thenReturn(policies);

        ResponseEntity<List<GovernancePolicy>> response = policyController.getPoliciesByRegion(GovernancePolicy.Region.EU);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(policies, response.getBody());
        verify(policyService, times(1)).getPoliciesByRegion(GovernancePolicy.Region.EU);
    }

    @Test
    public void testAddRegionToPolicy() {
        GovernancePolicy updatedPolicy = new GovernancePolicy();
        updatedPolicy.setId(policyId);
        Set<GovernancePolicy.Region> regions = new HashSet<>();
        regions.add(GovernancePolicy.Region.US);
        regions.add(GovernancePolicy.Region.EU);
        regions.add(GovernancePolicy.Region.UK);
        updatedPolicy.setApplicableRegions(regions);
        
        when(policyService.addRegionToPolicy(policyId, GovernancePolicy.Region.UK)).thenReturn(updatedPolicy);

        ResponseEntity<GovernancePolicy> response = policyController.addRegionToPolicy(policyId, GovernancePolicy.Region.UK);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedPolicy, response.getBody());
        verify(policyService, times(1)).addRegionToPolicy(policyId, GovernancePolicy.Region.UK);
    }

    @Test
    public void testRemoveRegionFromPolicy() {
        GovernancePolicy updatedPolicy = new GovernancePolicy();
        updatedPolicy.setId(policyId);
        Set<GovernancePolicy.Region> regions = new HashSet<>();
        regions.add(GovernancePolicy.Region.US);
        updatedPolicy.setApplicableRegions(regions);
        
        when(policyService.removeRegionFromPolicy(policyId, GovernancePolicy.Region.EU)).thenReturn(updatedPolicy);

        ResponseEntity<GovernancePolicy> response = policyController.removeRegionFromPolicy(policyId, GovernancePolicy.Region.EU);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedPolicy, response.getBody());
        verify(policyService, times(1)).removeRegionFromPolicy(policyId, GovernancePolicy.Region.EU);
    }
}
