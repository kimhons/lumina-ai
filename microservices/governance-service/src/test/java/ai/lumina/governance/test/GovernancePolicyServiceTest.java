package ai.lumina.governance.test;

import ai.lumina.governance.model.GovernancePolicy;
import ai.lumina.governance.repository.GovernancePolicyRepository;
import ai.lumina.governance.service.GovernancePolicyService;
import ai.lumina.governance.exception.PolicyNotFoundException;

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
public class GovernancePolicyServiceTest {

    @Mock
    private GovernancePolicyRepository policyRepository;

    @InjectMocks
    private GovernancePolicyService policyService;

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
        when(policyRepository.save(any(GovernancePolicy.class))).thenReturn(testPolicy);

        GovernancePolicy createdPolicy = policyService.createPolicy(testPolicy);

        assertNotNull(createdPolicy);
        assertEquals(testPolicy.getName(), createdPolicy.getName());
        assertEquals(testPolicy.getDescription(), createdPolicy.getDescription());
        assertEquals(testPolicy.getType(), createdPolicy.getType());
        assertTrue(createdPolicy.isEnabled());
        verify(policyRepository, times(1)).save(any(GovernancePolicy.class));
    }

    @Test
    public void testGetPolicy() {
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(testPolicy));

        GovernancePolicy foundPolicy = policyService.getPolicy(policyId);

        assertNotNull(foundPolicy);
        assertEquals(policyId, foundPolicy.getId());
        assertEquals(testPolicy.getName(), foundPolicy.getName());
        verify(policyRepository, times(1)).findById(policyId);
    }

    @Test
    public void testGetPolicyNotFound() {
        when(policyRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        assertThrows(PolicyNotFoundException.class, () -> {
            policyService.getPolicy("non-existent-id");
        });

        verify(policyRepository, times(1)).findById("non-existent-id");
    }

    @Test
    public void testGetAllPolicies() {
        GovernancePolicy secondPolicy = new GovernancePolicy();
        secondPolicy.setId(UUID.randomUUID().toString());
        secondPolicy.setName("Safety Policy");
        secondPolicy.setType(GovernancePolicy.PolicyType.SAFETY);
        secondPolicy.setEnabled(true);

        when(policyRepository.findAll()).thenReturn(Arrays.asList(testPolicy, secondPolicy));

        List<GovernancePolicy> policies = policyService.getAllPolicies();

        assertNotNull(policies);
        assertEquals(2, policies.size());
        verify(policyRepository, times(1)).findAll();
    }

    @Test
    public void testGetEnabledPolicies() {
        GovernancePolicy disabledPolicy = new GovernancePolicy();
        disabledPolicy.setId(UUID.randomUUID().toString());
        disabledPolicy.setName("Disabled Policy");
        disabledPolicy.setEnabled(false);

        GovernancePolicy enabledPolicy = new GovernancePolicy();
        enabledPolicy.setId(UUID.randomUUID().toString());
        enabledPolicy.setName("Enabled Policy");
        enabledPolicy.setEnabled(true);

        when(policyRepository.findByEnabledTrue()).thenReturn(Arrays.asList(testPolicy, enabledPolicy));

        List<GovernancePolicy> policies = policyService.getEnabledPolicies();

        assertNotNull(policies);
        assertEquals(2, policies.size());
        for (GovernancePolicy policy : policies) {
            assertTrue(policy.isEnabled());
        }
        verify(policyRepository, times(1)).findByEnabledTrue();
    }

    @Test
    public void testGetPoliciesByType() {
        GovernancePolicy privacyPolicy1 = new GovernancePolicy();
        privacyPolicy1.setId(UUID.randomUUID().toString());
        privacyPolicy1.setName("Privacy Policy 1");
        privacyPolicy1.setType(GovernancePolicy.PolicyType.PRIVACY);

        GovernancePolicy privacyPolicy2 = new GovernancePolicy();
        privacyPolicy2.setId(UUID.randomUUID().toString());
        privacyPolicy2.setName("Privacy Policy 2");
        privacyPolicy2.setType(GovernancePolicy.PolicyType.PRIVACY);

        when(policyRepository.findByType(GovernancePolicy.PolicyType.PRIVACY)).thenReturn(Arrays.asList(testPolicy, privacyPolicy1, privacyPolicy2));

        List<GovernancePolicy> policies = policyService.getPoliciesByType(GovernancePolicy.PolicyType.PRIVACY);

        assertNotNull(policies);
        assertEquals(3, policies.size());
        for (GovernancePolicy policy : policies) {
            assertEquals(GovernancePolicy.PolicyType.PRIVACY, policy.getType());
        }
        verify(policyRepository, times(1)).findByType(GovernancePolicy.PolicyType.PRIVACY);
    }

    @Test
    public void testGetPoliciesByRegion() {
        when(policyRepository.findByApplicableRegion(GovernancePolicy.Region.EU)).thenReturn(Collections.singletonList(testPolicy));

        List<GovernancePolicy> policies = policyService.getPoliciesByRegion(GovernancePolicy.Region.EU);

        assertNotNull(policies);
        assertEquals(1, policies.size());
        assertTrue(policies.get(0).getApplicableRegions().contains(GovernancePolicy.Region.EU));
        verify(policyRepository, times(1)).findByApplicableRegion(GovernancePolicy.Region.EU);
    }

    @Test
    public void testGetEnabledPoliciesByRegion() {
        when(policyRepository.findByApplicableRegionAndEnabledTrue(GovernancePolicy.Region.US)).thenReturn(Collections.singletonList(testPolicy));

        List<GovernancePolicy> policies = policyService.getEnabledPoliciesByRegion(GovernancePolicy.Region.US);

        assertNotNull(policies);
        assertEquals(1, policies.size());
        assertTrue(policies.get(0).getApplicableRegions().contains(GovernancePolicy.Region.US));
        assertTrue(policies.get(0).isEnabled());
        verify(policyRepository, times(1)).findByApplicableRegionAndEnabledTrue(GovernancePolicy.Region.US);
    }

    @Test
    public void testUpdatePolicy() {
        GovernancePolicy updatedPolicy = new GovernancePolicy();
        updatedPolicy.setName("Updated Privacy Policy");
        updatedPolicy.setDescription("Updated Description");
        updatedPolicy.setPriority(2);
        updatedPolicy.setPolicyDefinition("Updated policy definition");
        
        Map<String, String> updatedRules = new HashMap<>();
        updatedRules.put("pii_detection", "Enhanced PII detection");
        updatedRules.put("data_retention", "Retain user data for no more than 15 days");
        updatedRules.put("consent_verification", "Verify user consent before processing");
        updatedPolicy.setEnforcementRules(updatedRules);

        when(policyRepository.findById(policyId)).thenReturn(Optional.of(testPolicy));
        when(policyRepository.save(any(GovernancePolicy.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GovernancePolicy result = policyService.updatePolicy(policyId, updatedPolicy);

        assertNotNull(result);
        assertEquals(updatedPolicy.getName(), result.getName());
        assertEquals(updatedPolicy.getDescription(), result.getDescription());
        assertEquals(updatedPolicy.getPriority(), result.getPriority());
        assertEquals(updatedPolicy.getPolicyDefinition(), result.getPolicyDefinition());
        assertEquals(updatedPolicy.getEnforcementRules().size(), result.getEnforcementRules().size());
        assertTrue(result.getEnforcementRules().containsKey("consent_verification"));
        assertNotNull(result.getUpdatedAt());
        verify(policyRepository, times(1)).findById(policyId);
        verify(policyRepository, times(1)).save(any(GovernancePolicy.class));
    }

    @Test
    public void testDeletePolicy() {
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(testPolicy));
        doNothing().when(policyRepository).delete(testPolicy);

        policyService.deletePolicy(policyId);

        verify(policyRepository, times(1)).findById(policyId);
        verify(policyRepository, times(1)).delete(testPolicy);
    }

    @Test
    public void testEnablePolicy() {
        testPolicy.setEnabled(false);
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(testPolicy));
        when(policyRepository.save(any(GovernancePolicy.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GovernancePolicy result = policyService.enablePolicy(policyId);

        assertNotNull(result);
        assertTrue(result.isEnabled());
        assertNotNull(result.getUpdatedAt());
        verify(policyRepository, times(1)).findById(policyId);
        verify(policyRepository, times(1)).save(any(GovernancePolicy.class));
    }

    @Test
    public void testDisablePolicy() {
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(testPolicy));
        when(policyRepository.save(any(GovernancePolicy.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GovernancePolicy result = policyService.disablePolicy(policyId);

        assertNotNull(result);
        assertFalse(result.isEnabled());
        assertNotNull(result.getUpdatedAt());
        verify(policyRepository, times(1)).findById(policyId);
        verify(policyRepository, times(1)).save(any(GovernancePolicy.class));
    }

    @Test
    public void testAddRegionToPolicy() {
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(testPolicy));
        when(policyRepository.save(any(GovernancePolicy.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GovernancePolicy result = policyService.addRegionToPolicy(policyId, GovernancePolicy.Region.UK);

        assertNotNull(result);
        assertTrue(result.getApplicableRegions().contains(GovernancePolicy.Region.UK));
        assertNotNull(result.getUpdatedAt());
        verify(policyRepository, times(1)).findById(policyId);
        verify(policyRepository, times(1)).save(any(GovernancePolicy.class));
    }

    @Test
    public void testRemoveRegionFromPolicy() {
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(testPolicy));
        when(policyRepository.save(any(GovernancePolicy.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GovernancePolicy result = policyService.removeRegionFromPolicy(policyId, GovernancePolicy.Region.EU);

        assertNotNull(result);
        assertFalse(result.getApplicableRegions().contains(GovernancePolicy.Region.EU));
        assertTrue(result.getApplicableRegions().contains(GovernancePolicy.Region.US));
        assertNotNull(result.getUpdatedAt());
        verify(policyRepository, times(1)).findById(policyId);
        verify(policyRepository, times(1)).save(any(GovernancePolicy.class));
    }
}
