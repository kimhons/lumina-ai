// Lumina AI Testing Environment - Preview Panel Functionality

/**
 * Preview Panel Module for Lumina AI Testing Environment
 * 
 * This module provides functionality for the preview panel in the testing environment,
 * allowing users to see their code in action in real-time with various device simulations,
 * responsive testing, and debugging capabilities.
 */

class PreviewPanel {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      containerId: 'preview-content',
      frameId: 'preview-frame',
      refreshButtonId: 'refresh-preview',
      deviceSelectorId: 'device-selector',
      screenshotButtonId: 'screenshot-button',
      responsiveButtonId: 'responsive-view',
      consoleOutputId: 'debug-content',
      autoRefresh: true,
      refreshDelay: 1000,
      ...options
    };
    
    // State
    this.state = {
      currentDevice: 'desktop',
      isResponsiveMode: false,
      lastRefresh: Date.now(),
      pendingRefresh: null,
      consoleMessages: [],
      currentHtml: '',
      currentCss: '',
      currentJs: '',
      isRendering: false
    };
    
    // Device presets
    this.devices = {
      desktop: { width: '100%', height: '100%', userAgent: 'desktop' },
      tablet: { width: '768px', height: '1024px', userAgent: 'tablet' },
      mobile: { width: '375px', height: '667px', userAgent: 'mobile' },
      'mobile-landscape': { width: '667px', height: '375px', userAgent: 'mobile' }
    };
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the preview panel
   */
  init() {
    // Get DOM elements
    this.container = document.getElementById(this.config.containerId);
    this.refreshButton = document.getElementById(this.config.refreshButtonId);
    this.deviceSelector = document.getElementById(this.config.deviceSelectorId);
    this.screenshotButton = document.getElementById(this.config.screenshotButtonId);
    this.responsiveButton = document.getElementById(this.config.responsiveButtonId);
    this.consoleOutput = document.getElementById(this.config.consoleOutputId);
    
    // Create iframe if it doesn't exist
    if (!document.getElementById(this.config.frameId)) {
      this.createPreviewFrame();
    } else {
      this.frame = document.getElementById(this.config.frameId);
    }
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Initialize console interceptor
    this.initConsoleInterceptor();
  }
  
  /**
   * Create the preview iframe
   */
  createPreviewFrame() {
    this.frame = document.createElement('iframe');
    this.frame.id = this.config.frameId;
    this.frame.className = 'preview-frame';
    this.frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    this.container.appendChild(this.frame);
  }
  
  /**
   * Attach event listeners to UI controls
   */
  attachEventListeners() {
    // Refresh button
    if (this.refreshButton) {
      this.refreshButton.addEventListener('click', () => this.refresh());
    }
    
    // Device selector
    if (this.deviceSelector) {
      this.deviceSelector.addEventListener('click', () => this.toggleDeviceMenu());
    }
    
    // Screenshot button
    if (this.screenshotButton) {
      this.screenshotButton.addEventListener('click', () => this.takeScreenshot());
    }
    
    // Responsive mode button
    if (this.responsiveButton) {
      this.responsiveButton.addEventListener('click', () => this.toggleResponsiveMode());
    }
    
    // Listen for code changes
    document.addEventListener('lumina:codeChanged', (e) => {
      const { html, css, js, source } = e.detail;
      
      if (html !== undefined) this.state.currentHtml = html;
      if (css !== undefined) this.state.currentCss = css;
      if (js !== undefined) this.state.currentJs = js;
      
      if (this.config.autoRefresh) {
        this.scheduleRefresh();
      }
    });
    
    // Listen for run code command
    document.addEventListener('lumina:runCode', () => {
      this.refresh(true); // Force refresh
    });
  }
  
  /**
   * Initialize console interceptor to capture console output from the iframe
   */
  initConsoleInterceptor() {
    // Create a message channel for communication with the iframe
    this.messageChannel = new MessageChannel();
    this.messageChannel.port1.onmessage = (event) => {
      const { type, message, args } = event.data;
      this.logToConsole(type, message, args);
    };
    
    // Listen for iframe load to inject console interceptor
    this.frame.addEventListener('load', () => {
      try {
        // Only inject if same origin
        if (this.frame.contentWindow.location.origin === window.location.origin) {
          this.injectConsoleInterceptor();
        }
      } catch (e) {
        // Cross-origin restriction, can't access contentWindow
        console.warn('Cannot inject console interceptor due to cross-origin restrictions');
      }
    });
  }
  
  /**
   * Inject console interceptor into the iframe
   */
  injectConsoleInterceptor() {
    const frameWindow = this.frame.contentWindow;
    const frameConsole = frameWindow.console;
    
    // Save original console methods
    const originalMethods = {
      log: frameConsole.log,
      info: frameConsole.info,
      warn: frameConsole.warn,
      error: frameConsole.error,
      debug: frameConsole.debug
    };
    
    // Transfer message port to iframe
    frameWindow.postMessage('init-console-interceptor', '*', [this.messageChannel.port2]);
    
    // Override console methods
    Object.keys(originalMethods).forEach(method => {
      frameConsole[method] = (...args) => {
        // Call original method
        originalMethods[method].apply(frameConsole, args);
        
        // Send to parent
        const message = args.map(arg => {
          try {
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
          } catch (e) {
            return '[Object]';
          }
        }).join(' ');
        
        window.parent.postMessage({
          type: method,
          message,
          args
        }, '*');
      };
    });
    
    // Inject error handler
    const errorHandler = `
      window.addEventListener('error', function(event) {
        console.error('Uncaught error:', event.message, 'at', event.filename, 'line', event.lineno, 'column', event.colno);
        event.preventDefault();
      });
    `;
    
    const script = frameWindow.document.createElement('script');
    script.textContent = errorHandler;
    frameWindow.document.head.appendChild(script);
  }
  
  /**
   * Schedule a refresh with debouncing
   */
  scheduleRefresh() {
    if (this.state.pendingRefresh) {
      clearTimeout(this.state.pendingRefresh);
    }
    
    const timeSinceLastRefresh = Date.now() - this.state.lastRefresh;
    const delay = Math.max(0, this.config.refreshDelay - timeSinceLastRefresh);
    
    this.state.pendingRefresh = setTimeout(() => {
      this.refresh();
      this.state.pendingRefresh = null;
    }, delay);
  }
  
  /**
   * Refresh the preview with current code
   * @param {boolean} force - Force refresh even if content hasn't changed
   */
  refresh(force = false) {
    if (this.state.isRendering && !force) return;
    
    this.state.isRendering = true;
    this.state.lastRefresh = Date.now();
    
    // Clear console
    this.clearConsole();
    
    // Generate combined HTML with current code
    const combinedHtml = this.generateCombinedHtml();
    
    // Update iframe content
    this.updateFrameContent(combinedHtml);
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('lumina:previewRefreshed'));
  }
  
  /**
   * Generate combined HTML with current HTML, CSS, and JS
   * @returns {string} Combined HTML document
   */
  generateCombinedHtml() {
    // If HTML includes doctype and html tags, use it as base
    if (this.state.currentHtml.trim().toLowerCase().startsWith('<!doctype html>') ||
        this.state.currentHtml.trim().toLowerCase().startsWith('<html')) {
      
      // Insert CSS into head if not already included
      let html = this.state.currentHtml;
      if (this.state.currentCss && !html.includes('<style>') && !html.includes('<link rel="stylesheet"')) {
        html = html.replace('</head>', `<style>${this.state.currentCss}</style></head>`);
      }
      
      // Insert JS before end of body if not already included
      if (this.state.currentJs && !html.includes('<script>') && !html.includes('<script src=')) {
        html = html.replace('</body>', `<script>${this.state.currentJs}</script></body>`);
      }
      
      return html;
    }
    
    // Otherwise, create a complete HTML document
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lumina AI Preview</title>
        <style>${this.state.currentCss}</style>
      </head>
      <body>
        ${this.state.currentHtml}
        <script>${this.state.currentJs}</script>
      </body>
      </html>
    `;
  }
  
  /**
   * Update the iframe content with new HTML
   * @param {string} html - HTML content to render
   */
  updateFrameContent(html) {
    // Reset iframe
    this.frame.srcdoc = '';
    
    // Set device dimensions
    this.applyDeviceSettings();
    
    // Write new content
    setTimeout(() => {
      this.frame.srcdoc = html;
      this.state.isRendering = false;
    }, 50);
  }
  
  /**
   * Apply current device settings to the iframe
   */
  applyDeviceSettings() {
    const device = this.devices[this.state.currentDevice];
    
    if (device) {
      this.frame.style.width = device.width;
      this.frame.style.height = device.height;
      this.frame.style.margin = this.state.currentDevice === 'desktop' ? '0' : '0 auto';
      this.frame.style.border = this.state.currentDevice === 'desktop' ? 'none' : '1px solid #4D4D4F';
      this.frame.style.borderRadius = this.state.currentDevice === 'desktop' ? '0' : '8px';
      
      // Update device selector text
      if (this.deviceSelector) {
        const deviceIcon = this.deviceSelector.querySelector('.material-icons-round');
        const deviceText = this.deviceSelector.textContent.trim().split('\n')[1];
        
        if (deviceIcon) {
          deviceIcon.textContent = this.getDeviceIcon(this.state.currentDevice);
        }
        
        this.deviceSelector.innerHTML = `
          <span class="material-icons-round">${this.getDeviceIcon(this.state.currentDevice)}</span>
          ${this.getDeviceName(this.state.currentDevice)}
          <span class="material-icons-round">arrow_drop_down</span>
        `;
      }
    }
  }
  
  /**
   * Get icon name for device type
   * @param {string} device - Device type
   * @returns {string} Material icon name
   */
  getDeviceIcon(device) {
    switch (device) {
      case 'desktop': return 'desktop_windows';
      case 'tablet': return 'tablet';
      case 'mobile': return 'smartphone';
      case 'mobile-landscape': return 'stay_current_landscape';
      default: return 'devices';
    }
  }
  
  /**
   * Get display name for device type
   * @param {string} device - Device type
   * @returns {string} Display name
   */
  getDeviceName(device) {
    switch (device) {
      case 'desktop': return 'Desktop';
      case 'tablet': return 'Tablet';
      case 'mobile': return 'Mobile';
      case 'mobile-landscape': return 'Mobile Landscape';
      default: return 'Device';
    }
  }
  
  /**
   * Toggle device selection menu
   */
  toggleDeviceMenu() {
    // Create device menu if it doesn't exist
    if (!document.getElementById('device-menu')) {
      const menu = document.createElement('div');
      menu.id = 'device-menu';
      menu.className = 'device-menu';
      menu.style.position = 'absolute';
      menu.style.top = `${this.deviceSelector.offsetTop + this.deviceSelector.offsetHeight}px`;
      menu.style.left = `${this.deviceSelector.offsetLeft}px`;
      menu.style.backgroundColor = '#2A2B32';
      menu.style.border = '1px solid #4D4D4F';
      menu.style.borderRadius = '6px';
      menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      menu.style.zIndex = '100';
      menu.style.minWidth = '180px';
      
      // Add device options
      Object.keys(this.devices).forEach(device => {
        const option = document.createElement('div');
        option.className = 'device-option';
        option.style.display = 'flex';
        option.style.alignItems = 'center';
        option.style.gap = '8px';
        option.style.padding = '10px 16px';
        option.style.cursor = 'pointer';
        option.style.transition = 'background-color 0.2s';
        
        if (device === this.state.currentDevice) {
          option.style.backgroundColor = '#40414F';
        }
        
        option.innerHTML = `
          <span class="material-icons-round">${this.getDeviceIcon(device)}</span>
          ${this.getDeviceName(device)}
        `;
        
        option.addEventListener('mouseover', () => {
          option.style.backgroundColor = '#40414F';
        });
        
        option.addEventListener('mouseout', () => {
          if (device !== this.state.currentDevice) {
            option.style.backgroundColor = 'transparent';
          }
        });
        
        option.addEventListener('click', () => {
          this.setDevice(device);
          menu.remove();
        });
        
        menu.appendChild(option);
      });
      
      // Add to DOM
      document.body.appendChild(menu);
      
      // Close menu when clicking outside
      const closeMenu = (e) => {
        if (!menu.contains(e.target) && e.target !== this.deviceSelector) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      };
      
      setTimeout(() => {
        document.addEventListener('click', closeMenu);
      }, 0);
    } else {
      document.getElementById('device-menu').remove();
    }
  }
  
  /**
   * Set current device
   * @param {string} device - Device type
   */
  setDevice(device) {
    if (this.devices[device]) {
      this.state.currentDevice = device;
      this.applyDeviceSettings();
      
      // Refresh preview
      this.refresh();
    }
  }
  
  /**
   * Toggle responsive mode
   */
  toggleResponsiveMode() {
    this.state.isResponsiveMode = !this.state.isResponsiveMode;
    
    if (this.state.isResponsiveMode) {
      // Enable responsive mode
      this.container.style.position = 'relative';
      this.frame.style.width = '100%';
      this.frame.style.height = '100%';
      this.frame.style.border = 'none';
      this.frame.style.borderRadius = '0';
      
      // Add resize handles
      this.addResizeHandles();
      
      // Update button state
      if (this.responsiveButton) {
        this.responsiveButton.classList.add('active');
      }
    } else {
      // Disable responsive mode
      this.removeResizeHandles();
      this.applyDeviceSettings();
      
      // Update button state
      if (this.responsiveButton) {
        this.responsiveButton.classList.remove('active');
      }
    }
  }
  
  /**
   * Add resize handles for responsive mode
   */
  addResizeHandles() {
    // Create dimension display
    const dimensionDisplay = document.createElement('div');
    dimensionDisplay.id = 'dimension-display';
    dimensionDisplay.style.position = 'absolute';
    dimensionDisplay.style.top = '8px';
    dimensionDisplay.style.right = '8px';
    dimensionDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    dimensionDisplay.style.color = 'white';
    dimensionDisplay.style.padding = '4px 8px';
    dimensionDisplay.style.borderRadius = '4px';
    dimensionDisplay.style.fontSize = '12px';
    dimensionDisplay.style.fontFamily = 'monospace';
    dimensionDisplay.style.zIndex = '10';
    dimensionDisplay.textContent = `${this.frame.offsetWidth}px × ${this.frame.offsetHeight}px`;
    
   
(Content truncated due to size limit. Use line ranges to read in chunks)