#!/bin/bash

# Validation script for enhanced end-user interface configuration
# This script checks that all components and configurations are properly set up

echo "Starting validation of enhanced end-user interface configuration..."
echo "=================================================================="

# Check if all required component files exist
echo "Checking component files..."
COMPONENTS=(
  "/home/ubuntu/lumina-ai/ui/enduser/components/EndUserInterface.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/ChatInterface.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/AutonomousTaskPanel.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/VisualThinkingDisplay.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/MemoryTracker.jsx"
  "/home/ubuntu/lumina-ai/ui/enduser/components/WorkspaceManager.jsx"
)

for component in "${COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    echo "✓ $component exists"
  else
    echo "✗ ERROR: $component does not exist"
    exit 1
  fi
done

# Check if deployment configuration exists
echo -e "\nChecking deployment configuration..."
DEPLOYMENT_CONFIG="/home/ubuntu/lumina-ai-deployment/kubernetes/base/enduser-service-deployment.yaml"
CONFIG_MAP="/home/ubuntu/lumina-ai-deployment/kubernetes/base/enduser-service-config.yaml"

if [ -f "$DEPLOYMENT_CONFIG" ]; then
  echo "✓ Deployment configuration exists"
else
  echo "✗ ERROR: Deployment configuration does not exist"
  exit 1
fi

if [ -f "$CONFIG_MAP" ]; then
  echo "✓ ConfigMap exists"
else
  echo "✗ ERROR: ConfigMap does not exist"
  exit 1
fi

# Validate that enhanced features are enabled in the ConfigMap
echo -e "\nValidating feature flags in ConfigMap..."
REQUIRED_FLAGS=(
  "ENABLE_ADVANCED_TASK_AUTONOMY"
  "ENABLE_MEMORY_TRACKING"
  "ENABLE_VISUAL_THINKING"
  "ENABLE_PROACTIVE_SUGGESTIONS"
  "ENABLE_CROSS_WORKSPACE_SEARCH"
  "AUTO_MEMORY_EXTRACTION"
  "ENABLE_SEMANTIC_SEARCH"
  "INTERACTIVE_THINKING_DISPLAY"
  "ENABLE_THINKING_EXPORT"
)

for flag in "${REQUIRED_FLAGS[@]}"; do
  if grep -q "$flag: \"true\"" "$CONFIG_MAP"; then
    echo "✓ $flag is enabled"
  else
    echo "⚠ WARNING: $flag may not be enabled in ConfigMap"
  fi
done

# Validate that the deployment has all the necessary environment variables
echo -e "\nValidating environment variables in deployment..."
for flag in "${REQUIRED_FLAGS[@]}"; do
  if grep -q "$flag" "$DEPLOYMENT_CONFIG"; then
    echo "✓ $flag is configured in deployment"
  else
    echo "⚠ WARNING: $flag may not be configured in deployment"
  fi
done

# Check for enhanced features in component files
echo -e "\nChecking for enhanced features in component files..."

# Check AutonomousTaskPanel for task templates
if grep -q "taskTemplates" "/home/ubuntu/lumina-ai/ui/enduser/components/AutonomousTaskPanel.jsx"; then
  echo "✓ Task templates feature found in AutonomousTaskPanel"
else
  echo "⚠ WARNING: Task templates feature not found in AutonomousTaskPanel"
fi

# Check MemoryTracker for automatic memory extraction
if grep -q "extractMemoriesFromContext" "/home/ubuntu/lumina-ai/ui/enduser/components/MemoryTracker.jsx"; then
  echo "✓ Automatic memory extraction feature found in MemoryTracker"
else
  echo "⚠ WARNING: Automatic memory extraction feature not found in MemoryTracker"
fi

# Check VisualThinkingDisplay for interactive features
if grep -q "handleRequestAlternativePath" "/home/ubuntu/lumina-ai/ui/enduser/components/VisualThinkingDisplay.jsx"; then
  echo "✓ Interactive thinking features found in VisualThinkingDisplay"
else
  echo "⚠ WARNING: Interactive thinking features not found in VisualThinkingDisplay"
fi

# Validate resource requirements
echo -e "\nValidating resource requirements..."
if grep -q "cpu: \"1000m\"" "$DEPLOYMENT_CONFIG" && grep -q "memory: \"2Gi\"" "$DEPLOYMENT_CONFIG"; then
  echo "✓ Resource requests are properly configured"
else
  echo "⚠ WARNING: Resource requests may not be properly configured"
fi

if grep -q "cpu: \"2000m\"" "$DEPLOYMENT_CONFIG" && grep -q "memory: \"4Gi\"" "$DEPLOYMENT_CONFIG"; then
  echo "✓ Resource limits are properly configured"
else
  echo "⚠ WARNING: Resource limits may not be properly configured"
fi

# Validate horizontal pod autoscaler
echo -e "\nValidating horizontal pod autoscaler..."
if grep -q "HorizontalPodAutoscaler" "$DEPLOYMENT_CONFIG"; then
  echo "✓ Horizontal pod autoscaler is configured"
else
  echo "⚠ WARNING: Horizontal pod autoscaler may not be configured"
fi

# Validate health probes
echo -e "\nValidating health probes..."
if grep -q "livenessProbe" "$DEPLOYMENT_CONFIG" && grep -q "readinessProbe" "$DEPLOYMENT_CONFIG"; then
  echo "✓ Health probes are configured"
else
  echo "⚠ WARNING: Health probes may not be configured"
fi

# Validate security context
echo -e "\nValidating security context..."
if grep -q "securityContext" "$DEPLOYMENT_CONFIG" && grep -q "runAsNonRoot: true" "$DEPLOYMENT_CONFIG"; then
  echo "✓ Security context is properly configured"
else
  echo "⚠ WARNING: Security context may not be properly configured"
fi

# Validate Prometheus metrics
echo -e "\nValidating Prometheus metrics configuration..."
if grep -q "prometheus.io/scrape: \"true\"" "$DEPLOYMENT_CONFIG"; then
  echo "✓ Prometheus metrics are configured"
else
  echo "⚠ WARNING: Prometheus metrics may not be configured"
fi

echo -e "\nValidation complete!"
echo "===================="
echo "The enhanced end-user interface configuration has been validated."
echo "Please review any warnings above before deploying."
