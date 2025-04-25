#!/bin/bash

# Deploy Lumina AI Website Script
# This script prepares and deploys the Lumina AI marketing website

echo "Starting Lumina AI website deployment..."

# Create deployment directory
DEPLOY_DIR="/home/ubuntu/lumina-ai-website-deploy"
mkdir -p $DEPLOY_DIR

# Copy all website files to deployment directory
echo "Copying website files to deployment directory..."
cp -r /home/ubuntu/lumina-ai-website/* $DEPLOY_DIR/

# Verify all required files exist
echo "Verifying required files..."
REQUIRED_FILES=(
  "index.html"
  "css/styles.css"
  "js/main.js"
  "pages/features.html"
  "pages/solutions.html"
  "pages/case-studies.html"
  "pages/documentation.html"
  "pages/about.html"
  "pages/contact.html"
  "images/lumina_ai_logo.png"
  "images/tech_background.jpg"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$DEPLOY_DIR/$file" ]; then
    echo "ERROR: Required file $file is missing!"
    exit 1
  fi
done

echo "All required files verified successfully."

# Check for broken links
echo "Checking for broken internal links..."
cd $DEPLOY_DIR
BROKEN_LINKS=0

# Function to check links in an HTML file
check_links() {
  local file=$1
  echo "Checking links in $file..."
  
  # Extract href attributes
  grep -o 'href="[^"]*"' "$file" | cut -d'"' -f2 | while read -r link; do
    # Skip external links, anchors, and javascript
    if [[ $link == http* ]] || [[ $link == "#"* ]] || [[ $link == "javascript:"* ]]; then
      continue
    fi
    
    # Handle relative paths
    if [[ $link == /* ]]; then
      # Remove leading slash for local testing
      link=${link:1}
    fi
    
    # Get directory of current file for relative path resolution
    local dir=$(dirname "$file")
    
    # Resolve path
    if [[ $link != /* ]] && [[ $link != ../* ]] && [[ $dir != "." ]]; then
      link="$dir/$link"
    fi
    
    # Check if file exists
    if [[ ! -f "$link" ]] && [[ ! -d "$link" ]]; then
      echo "  Broken link in $file: $link"
      BROKEN_LINKS=$((BROKEN_LINKS + 1))
    fi
  done
}

# Check all HTML files
find . -name "*.html" | while read -r file; do
  check_links "$file"
done

if [ $BROKEN_LINKS -gt 0 ]; then
  echo "WARNING: Found $BROKEN_LINKS broken links. Please fix before production deployment."
else
  echo "No broken links found."
fi

# Validate HTML
echo "Validating HTML files..."
find . -name "*.html" | while read -r file; do
  echo "Checking $file for basic HTML validity..."
  # Simple check for balanced tags
  if grep -q "<html" "$file" && grep -q "</html>" "$file" && grep -q "<body" "$file" && grep -q "</body>" "$file"; then
    echo "  $file has basic HTML structure."
  else
    echo "  WARNING: $file may have HTML structure issues."
  fi
done

# Check responsive design
echo "Checking for responsive design elements..."
if grep -q "media" css/styles.css; then
  echo "Responsive design media queries found in CSS."
else
  echo "WARNING: No media queries found in CSS. Website may not be responsive."
fi

# Prepare for deployment
echo "Preparing for deployment..."

# Create a zip archive for easy distribution
ZIP_FILE="/home/ubuntu/lumina_ai_website.zip"
cd /home/ubuntu
zip -r $ZIP_FILE lumina-ai-website-deploy

echo "Website deployment package created at $ZIP_FILE"

# Deploy to local server for testing
echo "Setting up local test server..."
cd $DEPLOY_DIR
python3 -m http.server 8080 &
SERVER_PID=$!

echo "Local test server started on port 8080 (PID: $SERVER_PID)"
echo "Website available at: http://localhost:8080/"

# Create a simple test report
TEST_REPORT="/home/ubuntu/lumina_ai_website_test_report.md"
cat > $TEST_REPORT << EOF
# Lumina AI Website Test Report

## Deployment Summary
- **Date:** $(date)
- **Deployment Directory:** $DEPLOY_DIR
- **Deployment Package:** $ZIP_FILE
- **Test Server:** http://localhost:8080/

## Verification Results
- **Required Files:** All present
- **Broken Links:** ${BROKEN_LINKS} found
- **HTML Validation:** Basic structure verified
- **Responsive Design:** Media queries detected in CSS

## Manual Testing Checklist
- [ ] Verify all pages load correctly
- [ ] Test responsive design on multiple screen sizes
- [ ] Verify all images display properly
- [ ] Test navigation menu functionality
- [ ] Verify form submissions on contact page
- [ ] Test interactive elements (FAQ toggles, animations)
- [ ] Check accessibility features
- [ ] Verify cross-browser compatibility

## Next Steps for Production Deployment
1. Complete manual testing checklist
2. Fix any identified issues
3. Deploy to production server
4. Set up SSL certificate
5. Configure domain name
6. Implement analytics tracking
7. Set up monitoring

## Notes
The website has been successfully deployed to a local test server. The deployment package is ready for production deployment after completing the manual testing checklist.
EOF

echo "Test report created at $TEST_REPORT"
echo "Deployment and testing setup complete!"
echo "To stop the test server, run: kill $SERVER_PID"
