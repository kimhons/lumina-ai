#!/bin/bash

# Verification script for Lumina AI repository updates
# This script checks that all components are properly integrated and configured

echo "Starting Lumina AI repository verification..."
echo "=============================================="

# Check UI components
echo "Checking UI components..."
UI_COMPONENTS=(
  "/home/ubuntu/lumina-ai/ui/enduser/components/ChatInterface.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/WorkspaceManager.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/AutonomousTaskPanel.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/VisualThinkingDisplay.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/MemoryTracker.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/EndUserInterface.jsx"
)

UI_FEATURES=(
  "Projects"
  "Operator Window"
  "Visual Thinking"
  "Memory Tracking"
  "Testing Environment"
  "Export System"
)

UI_SUCCESS=true
for component in "${UI_COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    echo "✓ Found component: $component"
    
    # Check for enhanced features in each component
    for feature in "${UI_FEATURES[@]}"; do
      if grep -q "$feature" "$component"; then
        echo "  ✓ Feature found: $feature"
      else
        echo "  ⚠ Feature not found: $feature (may be in another component)"
      fi
    done
  else
    echo "✗ Missing component: $component"
    UI_SUCCESS=false
  fi
done

echo ""

# Check deployment configurations
echo "Checking deployment configurations..."
DEPLOYMENT_CONFIGS=(
  "/home/ubuntu/lumina-ai-deployment/kubernetes/base/enduser-service.yaml"
  "/home/ubuntu/lumina-ai-deployment/kubernetes/base/config-map.yaml"
  "/home/ubuntu/lumina-ai-deployment/kubernetes/base/testing-environment.yaml"
  "/home/ubuntu/lumina-ai-deployment/kubernetes/base/export-system.yaml"
  "/home/ubuntu/lumina-ai-deployment/kubernetes/base/integration-config.yaml"
)

DEPLOYMENT_SUCCESS=true
for config in "${DEPLOYMENT_CONFIGS[@]}"; do
  if [ -f "$config" ]; then
    echo "✓ Found configuration: $config"
  else
    echo "✗ Missing configuration: $config"
    DEPLOYMENT_SUCCESS=false
  fi
done

echo ""

# Check feature flags in config-map
echo "Checking feature flags in config-map..."
CONFIG_MAP="/home/ubuntu/lumina-ai-deployment/kubernetes/base/config-map.yaml"
FEATURE_FLAGS=(
  "visualThinking"
  "memoryTracking"
  "chatLengthMonitoring"
  "operatorWindow"
  "projectsFeature"
  "testingEnvironment"
  "exportSystem"
  "autonomousTasks"
)

CONFIG_SUCCESS=true
if [ -f "$CONFIG_MAP" ]; then
  for flag in "${FEATURE_FLAGS[@]}"; do
    if grep -q "$flag" "$CONFIG_MAP"; then
      echo "✓ Feature flag found: $flag"
    else
      echo "✗ Missing feature flag: $flag"
      CONFIG_SUCCESS=false
    fi
  done
else
  echo "✗ Config map not found"
  CONFIG_SUCCESS=false
fi

echo ""

# Check integration between services
echo "Checking service integration..."
INTEGRATION_CONFIG="/home/ubuntu/lumina-ai-deployment/kubernetes/base/integration-config.yaml"
INTEGRATIONS=(
  "enduser-service"
  "testing-environment"
  "export-system"
)

INTEGRATION_SUCCESS=true
if [ -f "$INTEGRATION_CONFIG" ]; then
  for integration in "${INTEGRATIONS[@]}"; do
    if grep -q "$integration" "$INTEGRATION_CONFIG"; then
      echo "✓ Service integration found: $integration"
    else
      echo "✗ Missing service integration: $integration"
      INTEGRATION_SUCCESS=false
    fi
  done
else
  echo "✗ Integration config not found"
  INTEGRATION_SUCCESS=false
fi

echo ""

# Check for resource requirements
echo "Checking resource requirements..."
RESOURCE_CONFIGS=(
  "/home/ubuntu/lumina-ai-deployment/kubernetes/base/enduser-service.yaml"
  "/home/ubuntu/lumina-ai-deployment/kubernetes/base/testing-environment.yaml"
  "/home/ubuntu/lumina-ai-deployment/kubernetes/base/export-system.yaml"
)

RESOURCE_SUCCESS=true
for config in "${RESOURCE_CONFIGS[@]}"; do
  if [ -f "$config" ]; then
    if grep -q "resources:" "$config" && grep -q "requests:" "$config" && grep -q "limits:" "$config"; then
      echo "✓ Resource requirements found in: $config"
    else
      echo "✗ Missing resource requirements in: $config"
      RESOURCE_SUCCESS=false
    fi
  fi
done

echo ""

# Check for health probes
echo "Checking health probes..."
HEALTH_SUCCESS=true
for config in "${RESOURCE_CONFIGS[@]}"; do
  if [ -f "$config" ]; then
    if grep -q "readinessProbe:" "$config" && grep -q "livenessProbe:" "$config"; then
      echo "✓ Health probes found in: $config"
    else
      echo "✗ Missing health probes in: $config"
      HEALTH_SUCCESS=false
    fi
  fi
done

echo ""

# Check for security contexts
echo "Checking security contexts..."
SECURITY_SUCCESS=true
for config in "${RESOURCE_CONFIGS[@]}"; do
  if [ -f "$config" ]; then
    if grep -q "securityContext:" "$config"; then
      echo "✓ Security context found in: $config"
    else
      echo "⚠ Missing security context in: $config"
    fi
  fi
done

echo ""

# Summary
echo "Verification Summary:"
echo "===================="
if [ "$UI_SUCCESS" = true ]; then
  echo "✓ UI Components: All components found"
else
  echo "✗ UI Components: Some components missing"
fi

if [ "$DEPLOYMENT_SUCCESS" = true ]; then
  echo "✓ Deployment Configurations: All configurations found"
else
  echo "✗ Deployment Configurations: Some configurations missing"
fi

if [ "$CONFIG_SUCCESS" = true ]; then
  echo "✓ Feature Flags: All feature flags found"
else
  echo "✗ Feature Flags: Some feature flags missing"
fi

if [ "$INTEGRATION_SUCCESS" = true ]; then
  echo "✓ Service Integration: All integrations found"
else
  echo "✗ Service Integration: Some integrations missing"
fi

if [ "$RESOURCE_SUCCESS" = true ]; then
  echo "✓ Resource Requirements: All resource requirements found"
else
  echo "✗ Resource Requirements: Some resource requirements missing"
fi

if [ "$HEALTH_SUCCESS" = true ]; then
  echo "✓ Health Probes: All health probes found"
else
  echo "✗ Health Probes: Some health probes missing"
fi

if [ "$UI_SUCCESS" = true ] && [ "$DEPLOYMENT_SUCCESS" = true ] && [ "$CONFIG_SUCCESS" = true ] && [ "$INTEGRATION_SUCCESS" = true ] && [ "$RESOURCE_SUCCESS" = true ] && [ "$HEALTH_SUCCESS" = true ]; then
  echo ""
  echo "✅ VERIFICATION PASSED: All components are properly integrated and configured"
  exit 0
else
  echo ""
  echo "❌ VERIFICATION FAILED: Some components are missing or not properly configured"
  exit 1
fi
