/**
 * Lumina AI Export System
 * 
 * This module provides functionality for exporting projects created in Lumina AI
 * to various formats based on project type, with customization options and
 * deployment capabilities.
 */

class ExportSystem {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      containerId: 'export-wizard',
      overlayId: 'export-overlay',
      progressId: 'export-progress',
      successId: 'export-success',
      closeButtonId: 'close-wizard',
      nextButtonId: 'wizard-next',
      backButtonId: 'wizard-back',
      projectTypeSelector: '.project-type-option',
      exportGoalSelector: '.export-goal-option',
      formatSelector: '.format-option',
      autoDetectProjectType: true,
      enableDeployment: true,
      ...options
    };
    
    // State
    this.state = {
      currentStep: 1,
      totalSteps: 5,
      projectType: null,
      projectName: '',
      projectFramework: '',
      exportGoal: null,
      selectedFormats: [],
      customOptions: {},
      isExporting: false,
      exportProgress: 0,
      exportResults: [],
      currentContent: {
        html: '',
        css: '',
        js: '',
        assets: []
      }
    };
    
    // Project type definitions
    this.projectTypes = {
      website: {
        name: 'Website',
        icon: 'language',
        description: 'Static or dynamic website',
        formats: ['source', 'static-site', 'deployment', 'optimized']
      },
      mobileApp: {
        name: 'Mobile App',
        icon: 'smartphone',
        description: 'iOS or Android application',
        formats: ['source', 'android-apk', 'ios-ipa', 'app-store']
      },
      dataViz: {
        name: 'Data Visualization',
        icon: 'bar_chart',
        description: 'Charts, graphs, and dashboards',
        formats: ['static-image', 'interactive', 'embed', 'data-export']
      },
      document: {
        name: 'Document',
        icon: 'description',
        description: 'Book, report, or article',
        formats: ['pdf', 'epub', 'print', 'web']
      },
      api: {
        name: 'API',
        icon: 'api',
        description: 'Backend service or API',
        formats: ['source', 'docker', 'serverless', 'documentation']
      },
      code: {
        name: 'Other Code',
        icon: 'code',
        description: 'Scripts, algorithms, etc.',
        formats: ['source', 'executable', 'library', 'documentation']
      }
    };
    
    // Export goals
    this.exportGoals = {
      development: {
        name: 'Continue Development',
        icon: 'code',
        description: 'Export code for further development'
      },
      testing: {
        name: 'Testing & Review',
        icon: 'bug_report',
        description: 'Share with others for testing and feedback'
      },
      deployment: {
        name: 'Production Deployment',
        icon: 'rocket_launch',
        description: 'Deploy to production environment'
      },
      presentation: {
        name: 'Presentation',
        icon: 'slideshow',
        description: 'Create materials for stakeholder presentation'
      }
    };
    
    // Format definitions
    this.formatDefinitions = {
      // Website formats
      'source': {
        name: 'Source Code Package',
        icon: 'folder_zip',
        description: 'Complete project files as ZIP archive',
        projectTypes: ['website', 'mobileApp', 'api', 'code'],
        fileExtension: '.zip'
      },
      'static-site': {
        name: 'Static Site Deployment',
        icon: 'public',
        description: 'Deploy to GitHub Pages, Netlify, or Vercel',
        projectTypes: ['website'],
        requiresDeployment: true
      },
      'deployment': {
        name: 'Server Configuration',
        icon: 'dns',
        description: 'Apache/Nginx setup files',
        projectTypes: ['website', 'api'],
        fileExtension: '.zip'
      },
      'optimized': {
        name: 'Optimized Build',
        icon: 'speed',
        description: 'Minified and bundled for production',
        projectTypes: ['website'],
        fileExtension: '.zip'
      },
      
      // Mobile app formats
      'android-apk': {
        name: 'Android APK',
        icon: 'android',
        description: 'Installable Android package',
        projectTypes: ['mobileApp'],
        fileExtension: '.apk'
      },
      'ios-ipa': {
        name: 'iOS IPA',
        icon: 'apple',
        description: 'iOS application package',
        projectTypes: ['mobileApp'],
        fileExtension: '.ipa'
      },
      'app-store': {
        name: 'App Store Package',
        icon: 'store',
        description: 'Prepared for app store submission',
        projectTypes: ['mobileApp'],
        fileExtension: '.zip'
      },
      
      // Data visualization formats
      'static-image': {
        name: 'Static Image',
        icon: 'image',
        description: 'High-resolution PNG/SVG export',
        projectTypes: ['dataViz'],
        fileExtension: '.zip'
      },
      'interactive': {
        name: 'Interactive Web Version',
        icon: 'touch_app',
        description: 'Self-contained interactive HTML/JS/CSS',
        projectTypes: ['dataViz'],
        fileExtension: '.zip'
      },
      'embed': {
        name: 'Embed Code',
        icon: 'code',
        description: 'Code snippet for embedding in websites',
        projectTypes: ['dataViz'],
        fileExtension: '.html'
      },
      'data-export': {
        name: 'Data Export',
        icon: 'table_chart',
        description: 'Raw data in CSV/JSON format',
        projectTypes: ['dataViz'],
        fileExtension: '.zip'
      },
      
      // Document formats
      'pdf': {
        name: 'PDF Document',
        icon: 'picture_as_pdf',
        description: 'Portable Document Format',
        projectTypes: ['document'],
        fileExtension: '.pdf'
      },
      'epub': {
        name: 'EPUB/MOBI',
        icon: 'auto_stories',
        description: 'E-book formats for digital readers',
        projectTypes: ['document'],
        fileExtension: '.zip'
      },
      'print': {
        name: 'Print-Ready PDF',
        icon: 'print',
        description: 'PDF with bleed, crop marks for printing',
        projectTypes: ['document'],
        fileExtension: '.pdf'
      },
      'web': {
        name: 'Web Version',
        icon: 'language',
        description: 'HTML version for online publishing',
        projectTypes: ['document'],
        fileExtension: '.zip'
      },
      
      // API formats
      'docker': {
        name: 'Docker Container',
        icon: 'inventory_2',
        description: 'Containerized application with Docker',
        projectTypes: ['api'],
        fileExtension: '.tar'
      },
      'serverless': {
        name: 'Serverless Package',
        icon: 'cloud',
        description: 'AWS Lambda/Azure Functions package',
        projectTypes: ['api'],
        fileExtension: '.zip'
      },
      'documentation': {
        name: 'API Documentation',
        icon: 'menu_book',
        description: 'Swagger/OpenAPI documentation',
        projectTypes: ['api', 'code'],
        fileExtension: '.zip'
      },
      
      // Code formats
      'executable': {
        name: 'Executable',
        icon: 'terminal',
        description: 'Compiled executable program',
        projectTypes: ['code'],
        fileExtension: '.zip'
      },
      'library': {
        name: 'Library Package',
        icon: 'inventory',
        description: 'Packaged library for import',
        projectTypes: ['code'],
        fileExtension: '.zip'
      }
    };
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the export system
   */
  init() {
    // Get DOM elements
    this.container = document.getElementById(this.config.containerId);
    this.overlay = document.getElementById(this.config.overlayId);
    this.progressContainer = document.getElementById(this.config.progressId);
    this.successContainer = document.getElementById(this.config.successId);
    this.closeButton = document.getElementById(this.config.closeButtonId);
    this.nextButton = document.getElementById(this.config.nextButtonId);
    this.backButton = document.getElementById(this.config.backButtonId);
    
    // Create elements if they don't exist
    if (!this.container) {
      this.createWizardInterface();
    }
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Listen for content updates
    document.addEventListener('lumina:codeChanged', (e) => {
      const { html, css, js, assets } = e.detail;
      
      if (html !== undefined) this.state.currentContent.html = html;
      if (css !== undefined) this.state.currentContent.css = css;
      if (js !== undefined) this.state.currentContent.js = js;
      if (assets !== undefined) this.state.currentContent.assets = assets;
      
      // Auto-detect project type if enabled
      if (this.config.autoDetectProjectType) {
        this.detectProjectType();
      }
    });
  }
  
  /**
   * Create the wizard interface if it doesn't exist
   */
  createWizardInterface() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.id = this.config.overlayId;
    this.overlay.className = 'overlay';
    this.overlay.style.display = 'none';
    document.body.appendChild(this.overlay);
    
    // Create wizard container
    this.container = document.createElement('div');
    this.container.id = this.config.containerId;
    this.container.className = 'export-wizard';
    this.container.style.display = 'none';
    document.body.appendChild(this.container);
    
    // Create progress container
    this.progressContainer = document.createElement('div');
    this.progressContainer.id = this.config.progressId;
    this.progressContainer.className = 'export-progress';
    this.progressContainer.style.display = 'none';
    document.body.appendChild(this.progressContainer);
    
    // Create success container
    this.successContainer = document.createElement('div');
    this.successContainer.id = this.config.successId;
    this.successContainer.className = 'export-success';
    this.successContainer.style.display = 'none';
    document.body.appendChild(this.successContainer);
    
    // Initialize wizard content
    this.renderWizardStep(1);
  }
  
  /**
   * Attach event listeners to UI controls
   */
  attachEventListeners() {
    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.closeWizard());
    }
    
    // Next button
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.nextStep());
    }
    
    // Back button
    if (this.backButton) {
      this.backButton.addEventListener('click', () => this.previousStep());
    }
    
    // Project type selection
    document.querySelectorAll(this.config.projectTypeSelector).forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        document.querySelectorAll(this.config.projectTypeSelector).forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        option.classList.add('selected');
        
        // Update state
        const projectTypeId = option.getAttribute('data-type');
        this.state.projectType = projectTypeId;
        
        // Update project name input if empty
        const projectNameInput = document.getElementById('project-name');
        if (projectNameInput && !projectNameInput.value) {
          projectNameInput.value = `My ${this.projectTypes[projectTypeId].name} Project`;
          this.state.projectName = projectNameInput.value;
        }
      });
    });
    
    // Project name input
    document.getElementById('project-name')?.addEventListener('input', (e) => {
      this.state.projectName = e.target.value;
    });
    
    // Project framework select
    document.getElementById('project-framework')?.addEventListener('change', (e) => {
      this.state.projectFramework = e.target.value;
    });
    
    // Listen for export button clicks
    document.addEventListener('click', (e) => {
      if (e.target.id === 'export-toggle' || e.target.closest('#export-toggle')) {
        this.openWizard();
      }
    });
  }
  
  /**
   * Open the export wizard
   */
  openWizard() {
    // Reset state
    this.state.currentStep = 1;
    this.state.exportProgress = 0;
    this.state.isExporting = false;
    this.state.exportResults = [];
    
    // Show overlay and wizard
    this.overlay.style.display = 'block';
    this.container.style.display = 'flex';
    this.progressContainer.style.display = 'none';
    this.successContainer.style.display = 'none';
    
    // Render first step
    this.renderWizardStep(1);
    
    // Auto-detect project type
    if (this.config.autoDetectProjectType) {
      this.detectProjectType();
    }
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('lumina:exportWizardOpened'));
  }
  
  /**
   * Close the export wizard
   */
  closeWizard() {
    this.overlay.style.display = 'none';
    this.container.style.display = 'none';
    this.progressContainer.style.display = 'none';
    this.successContainer.style.display = 'none';
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('lumina:exportWizardClosed'));
  }
  
  /**
   * Move to the next step in the wizard
   */
  nextStep() {
    // Validate current step
    if (!this.validateStep(this.state.currentStep)) {
      this.showValidationError();
      return;
    }
    
    // If on last step, start export
    if (this.state.currentStep === this.state.totalSteps) {
      this.startExport();
      return;
    }
    
    // Move to next step
    this.state.currentStep++;
    this.renderWizardStep(this.state.currentStep);
    
    // Update back button state
    this.backButton.disabled = false;
    
    // Update next button text on last step
    if (this.state.currentStep === this.state.totalSteps) {
      this.nextButton.innerHTML = `
        Export
        <span class="material-icons-round">download</span>
      `;
    } else {
      this.nextButton.innerHTML = `
        Next
        <span class="material-icons-round">arrow_forward</span>
      `;
    }
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('lumina:exportWizardStepChanged', {
      detail: { step: this.state.currentStep }
    }));
  }
  
  /**
   * Move to the previous step in the wizard
   */
  previousStep() {
    if (this.state.currentStep > 1) {
      this.state.currentStep--;
      this.renderWizardStep(this.state.currentStep);
      
      // Update back button state
      this.backButton.disabled = this.state.currentStep === 1;
      
      // Update next button text
      this.nextButton.innerHTML = `
        Next
        <span class="material-icons-round">arrow_forward</span>
      `;
      
      // Dispatch event
      document.dispatchEvent(new CustomEvent('lumina:exportWizardStepChanged', {
        detail: { step: this.state.currentStep }
      }));
    }
  }
  
  /**
   * Validate the current step
   * @param {number} step - Step number to validate
   * @returns {boolean} Whether the step is valid
   */
  validateStep(step) {
    switch (step) {
      case 1: // Project Type
        return this.state.projectType && this.state.projectName;
      case 2: // Export Goal
        return this.state.exportGoal;
      case 3: // Format Selection
        return this.state.selectedFormats.length > 0;
      case 4: // Customization
        return true; // All customization options are optional
      case 5: // Preview
        return true; // Preview is informational only
      default:
        return false;
    }
  }
  
  /**
   * Show validation error for the current step
   */
  showValidationError() {
    let errorMessage = 'Please complete all required fields before continuing.';
    
    switch (
(Content truncated due to size limit. Use line ranges to read in chunks)