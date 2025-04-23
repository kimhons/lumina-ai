import { createGlobalStyle } from 'styled-components';
import { fontSizes, animations, spacing, borderRadius } from './themes';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.base : 
                               theme.fontSize === 'large' ? fontSizes.large.base : 
                               fontSizes.medium.base};
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    transition: ${({ theme }) => theme.reducedMotion ? animations.reduced.transition : animations.default.transition};
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.headings};
    margin-bottom: ${spacing.md};
    font-weight: 600;
    line-height: 1.2;
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.h1 : 
                               theme.fontSize === 'large' ? fontSizes.large.h1 : 
                               fontSizes.medium.h1};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.h2 : 
                               theme.fontSize === 'large' ? fontSizes.large.h2 : 
                               fontSizes.medium.h2};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.h3 : 
                               theme.fontSize === 'large' ? fontSizes.large.h3 : 
                               fontSizes.medium.h3};
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.h4 : 
                               theme.fontSize === 'large' ? fontSizes.large.h4 : 
                               fontSizes.medium.h4};
  }

  h5 {
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.h5 : 
                               theme.fontSize === 'large' ? fontSizes.large.h5 : 
                               fontSizes.medium.h5};
  }

  h6 {
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.h6 : 
                               theme.fontSize === 'large' ? fontSizes.large.h6 : 
                               fontSizes.medium.h6};
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    transition: ${({ theme }) => theme.reducedMotion ? animations.reduced.transition : animations.default.transition};
    
    &:hover {
      text-decoration: underline;
      color: ${({ theme }) => theme.primaryHover};
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.focusRing};
      outline-offset: 2px;
    }
  }

  button {
    background: ${({ theme }) => theme.buttonPrimary};
    border: none;
    border-radius: ${borderRadius.md};
    color: white;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.button : 
                               theme.fontSize === 'large' ? fontSizes.large.button : 
                               fontSizes.medium.button};
    padding: ${spacing.sm} ${spacing.md};
    transition: ${({ theme }) => theme.reducedMotion ? animations.reduced.transition : animations.default.transition};
    
    &:hover {
      background: ${({ theme }) => theme.primaryHover};
    }
    
    &:disabled {
      background: ${({ theme }) => theme.disabled};
      cursor: not-allowed;
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.focusRing};
      outline-offset: 2px;
    }
  }

  input, select, textarea {
    background: ${({ theme }) => theme.inputBackground};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${borderRadius.md};
    color: ${({ theme }) => theme.text};
    font-size: ${({ theme }) => theme.fontSize === 'small' ? fontSizes.small.input : 
                               theme.fontSize === 'large' ? fontSizes.large.input : 
                               fontSizes.medium.input};
    padding: ${spacing.sm} ${spacing.md};
    transition: ${({ theme }) => theme.reducedMotion ? animations.reduced.transition : animations.default.transition};
    
    &:focus {
      border-color: ${({ theme }) => theme.primary};
      outline: 2px solid ${({ theme }) => theme.focusRing};
      outline-offset: 2px;
    }

    &:disabled {
      background: ${({ theme }) => theme.disabled};
      cursor: not-allowed;
    }
  }

  /* Selection styling */
  ::selection {
    background-color: ${({ theme }) => theme.selectionBackground};
    color: ${({ theme }) => theme.selectionText};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.scrollbarTrack};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollbarThumb};
    border-radius: ${borderRadius.md};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.secondary};
  }

  /* Code blocks */
  code, pre {
    font-family: 'Fira Code', 'Courier New', Courier, monospace;
    background-color: ${({ theme }) => theme.codeBackground};
    color: ${({ theme }) => theme.codeText};
    border-radius: ${borderRadius.sm};
  }

  code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
  }

  pre {
    padding: ${spacing.md};
    overflow-x: auto;
    
    code {
      padding: 0;
      background-color: transparent;
    }
  }

  /* Layout classes */
  .lumina-app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
  }

  .app-header {
    align-items: center;
    background: ${({ theme }) => theme.headerBackground};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    display: flex;
    height: 60px;
    justify-content: space-between;
    padding: 0 ${spacing.md};
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1030;
    box-shadow: ${({ theme }) => theme.shadow};
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
  }

  .app-title {
    font-size: 1.25rem;
    margin: 0;
    margin-left: ${spacing.sm};
  }

  .app-body {
    display: flex;
    flex: 1;
    margin-top: 60px;
  }

  .content-area {
    flex: 1;
    padding: ${spacing.lg};
    overflow-y: auto;
    transition: ${({ theme }) => theme.reducedMotion ? animations.reduced.transition : animations.default.transition};
  }

  .app-footer {
    background: ${({ theme }) => theme.footerBackground};
    border-top: 1px solid ${({ theme }) => theme.border};
    padding: ${spacing.md};
    text-align: center;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Sidebar states */
  .sidebar-open .content-area {
    margin-left: 250px;
  }

  .sidebar-closed .app-navigation {
    transform: translateX(-250px);
  }

  /* Layout variations */
  .layout-centered .content-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .layout-minimal .content-area {
    margin-left: 0;
    margin-top: 0;
  }

  .layout-dashboard .content-area {
    padding: ${spacing.md};
    background-color: ${({ theme }) => theme.background};
  }

  /* Content width variations */
  .content-narrow .content-area > * {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
  }

  .content-standard .content-area > * {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .content-wide .content-area > * {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  .content-full .content-area > * {
    max-width: none;
  }

  /* Font size classes */
  .font-small {
    font-size: ${fontSizes.small.base};
  }

  .font-medium {
    font-size: ${fontSizes.medium.base};
  }

  .font-large {
    font-size: ${fontSizes.large.base};
  }

  /* High contrast mode */
  .high-contrast {
    * {
      border-color: ${({ theme }) => theme.border} !important;
    }

    button, a, .clickable {
      &:focus {
        outline: 3px solid ${({ theme }) => theme.primary} !important;
        outline-offset: 3px !important;
      }
    }
  }

  /* Reduced motion */
  .reduced-motion * {
    animation: none !important;
    transition: none !important;
  }

  /* User menu */
  .user-controls {
    position: relative;
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
  }

  .user-menu-button {
    background: transparent;
    color: ${({ theme }) => theme.text};
    padding: ${spacing.xs} ${spacing.sm};
    
    &:hover {
      background: ${({ theme }) => theme.primaryHover};
    }
  }

  .user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 250px;
    background: ${({ theme }) => theme.cardBackground};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadow};
    z-index: 1000;
    overflow: hidden;
  }

  .user-menu-header {
    padding: ${spacing.md};
    background: ${({ theme }) => theme.cardHeaderBackground};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    display: flex;
    align-items: center;
    gap: ${spacing.md};
  }

  .user-avatar {
    font-size: 1.5rem;
  }

  .user-info {
    flex: 1;
  }

  .user-name {
    font-weight: 600;
  }

  .user-email {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.secondary};
  }

  .user-menu-items {
    list-style: none;
  }

  .user-menu-item {
    a {
      display: block;
      padding: ${spacing.md};
      color: ${({ theme }) => theme.text};
      text-decoration: none;
      transition: ${({ theme }) => theme.reducedMotion ? animations.reduced.transition : animations.default.transition};
      
      &:hover {
        background: ${({ theme }) => theme.primaryHover};
        color: white;
      }
    }
  }

  /* Notifications */
  .notifications-toggle {
    position: relative;
    background: transparent;
    color: ${({ theme }) => theme.text};
    
    &:hover {
      background: ${({ theme }) => theme.primaryHover};
      color: white;
    }
  }

  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: ${({ theme }) => theme.danger};
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notifications-panel {
    position: absolute;
    top: 60px;
    right: ${spacing.md};
    width: 350px;
    max-height: 500px;
    overflow-y: auto;
    background: ${({ theme }) => theme.notificationBackground};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadow};
    z-index: 1000;
  }

  .notifications-header {
    padding: ${spacing.md};
    background: ${({ theme }) => theme.cardHeaderBackground};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .notifications-list {
    list-style: none;
  }

  .notification-item {
    padding: ${spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    display: flex;
    gap: ${spacing.md};
    
    &.info {
      background-color: ${({ theme }) => theme.notificationInfo};
    }
    
    &.success {
      background-color: ${({ theme }) => theme.notificationSuccess};
    }
    
    &.warning {
      background-color: ${({ theme }) => theme.notificationWarning};
    }
    
    &.error {
      background-color: ${({ theme }) => theme.notificationError};
    }
  }

  .notification-content {
    flex: 1;
  }

  .notification-title {
    font-weight: 600;
    margin-bottom: ${spacing.xs};
  }

  .notification-time {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.secondary};
    margin-top: ${spacing.xs};
  }

  .notification-dismiss {
    background: transparent;
    color: ${({ theme }) => theme.secondary};
    font-size: 1.25rem;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: ${({ theme }) => theme.danger};
      color: white;
    }
  }

  .no-notifications {
    padding: ${spacing.lg};
    text-align: center;
    color: ${({ theme }) => theme.secondary};
  }

  /* Accessibility controls */
  .accessibility-toggle {
    position: relative;
  }

  .a11y-toggle-btn {
    background: transparent;
    color: ${({ theme }) => theme.text};
    
    &:hover {
      background: ${({ theme }) => theme.primaryHover};
      color: white;
    }
  }

  .a11y-controls {
    position: absolute;
    top: 100%;
    right: 0;
    width: 250px;
    background: ${({ theme }) => theme.cardBackground};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadow};
    z-index: 1000;
    padding: ${spacing.md};
    display: none;
    
    &.open {
      display: block;
    }
  }

  .accessibility-controls {
    display: flex;
    flex-direction: column;
    gap: ${spacing.md};
  }

  .font-size-controls {
    display: flex;
    gap: ${spacing.xs};
  }

  .font-size-btn {
    flex: 1;
    background: ${({ theme }) => theme.buttonSecondary};
    
    &.active {
      background: ${({ theme }) => theme.buttonPrimary};
    }
  }

  .contrast-toggle, .motion-toggle {
    background: ${({ theme }) => theme.buttonSecondary};
    
    &.active {
      background: ${({ theme }) => theme.buttonPrimary};
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .sidebar-open .content-area {
      margin-left: 0;
    }
    
    .app-header {
      padding: 0 ${spacing.sm};
    }
    
    .content-area {
      padding: ${spacing.md};
    }
    
    .user-name {
      display: none;
    }
    
    .notifications-panel {
      width: calc(100% - ${spacing.md} * 2);
      right: ${spacing.md};
    }
  }
`;
