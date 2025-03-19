/**
 * Revelate Operations - Notification System
 * A flexible notification system for user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the notification system
  initNotifications();
});

/**
 * Initialize the notification system
 */
function initNotifications() {
  // Create notification container if it doesn't exist
  let container = document.getElementById('notification-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Create and expose global notifications object
  window.notifications = {
    container: container,
    
    /**
     * Show a notification
     * @param {string} message - The message to display
     * @param {string} type - The type of notification (success, error, warning, info)
     * @param {number} duration - How long to show the notification in milliseconds
     * @returns {HTMLElement} - The notification element
     */
    show: function(message, type = 'info', duration = 5000) {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">
            ${this.getIcon(type)}
          </div>
          <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
      `;
      
      this.container.appendChild(notification);
      
      // Add visible class after a small delay for animation
      setTimeout(() => {
        notification.classList.add('visible');
      }, 10);
      
      // Attach close handler
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
        this.hide(notification);
      });
      
      // Auto-hide after duration (if provided)
      if (duration) {
        setTimeout(() => {
          this.hide(notification);
        }, duration);
      }
      
      return notification;
    },
    
    /**
     * Hide a notification
     * @param {HTMLElement} notification - The notification element to hide
     */
    hide: function(notification) {
      notification.classList.remove('visible');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300); // Match transition duration
    },
    
    /**
     * Get the appropriate icon for a notification type
     * @param {string} type - The notification type
     * @returns {string} - The HTML for the icon
     */
    getIcon: function(type) {
      switch (type) {
        case 'success':
          return '<i class="fas fa-check-circle"></i>';
        case 'error':
          return '<i class="fas fa-exclamation-circle"></i>';
        case 'warning':
          return '<i class="fas fa-exclamation-triangle"></i>';
        default:
          return '<i class="fas fa-info-circle"></i>';
      }
    },
    
    /**
     * Show a success notification
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the notification
     * @returns {HTMLElement} - The notification element
     */
    success: function(message, duration) {
      return this.show(message, 'success', duration);
    },
    
    /**
     * Show an error notification
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the notification
     * @returns {HTMLElement} - The notification element
     */
    error: function(message, duration) {
      return this.show(message, 'error', duration);
    },
    
    /**
     * Show a warning notification
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the notification
     * @returns {HTMLElement} - The notification element
     */
    warning: function(message, duration) {
      return this.show(message, 'warning', duration);
    },
    
    /**
     * Show an info notification
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the notification
     * @returns {HTMLElement} - The notification element
     */
    info: function(message, duration) {
      return this.show(message, 'info', duration);
    }
  };
}

// Add CSS for notifications to the page if not already present
function addNotificationStyles() {
  if (document.getElementById('notification-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    }
    
    .notification {
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 15px;
      transform: translateX(100%);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }
    
    .notification.visible {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification-content {
      display: flex;
      align-items: flex-start;
      flex: 1;
    }
    
    .notification-icon {
      margin-right: 12px;
      font-size: 18px;
      color: #555;
      margin-top: 2px;
    }
    
    .notification-message {
      font-size: 14px;
      line-height: 1.4;
      color: #333;
      flex: 1;
    }
    
    .notification-close {
      background: none;
      border: none;
      font-size: 16px;
      color: #999;
      cursor: pointer;
      margin-left: 10px;
      padding: 0;
    }
    
    .notification-close:hover {
      color: #666;
    }
    
    .notification-success .notification-icon {
      color: #28a745;
    }
    
    .notification-error .notification-icon {
      color: #dc3545;
    }
    
    .notification-warning .notification-icon {
      color: #ffc107;
    }
    
    .notification-info .notification-icon {
      color: #17a2b8;
    }
    
    @media (max-width: 576px) {
      .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Add the notification styles
addNotificationStyles();