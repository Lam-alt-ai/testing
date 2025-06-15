// Militect Tesla-Style Configurator JavaScript

class MilitectConfigurator {
    constructor() {
        this.config = {
            academyTheme: 'usa',
            customTheme: '',
            environment: 'tropical',
            layout: 'layout1',
            addons: [],
            currency: 'robux'
        };
        
        this.prices = {
            base: 5000,
            addons: {
                'vanilla-scripts': 1500,
                'complete-ui': 1000,
                'npc-gamepass': 800
            },
            usdRate: 0.005 // 1 Robux = $0.005
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updatePreview();
        this.updatePricing();
        this.validatePurchaseButtons();
        
        // Security notice in console
        console.log('%cMILITECT SECURITY NOTICE', 'color: #ff4444; font-size: 20px; font-weight: bold;');
        console.log('%cUnauthorized access to this system is prohibited.', 'color: #ff4444; font-size: 14px;');
        console.log('%cAll activities are monitored and logged.', 'color: #ff4444; font-size: 14px;');
    }
    
    bindEvents() {
        // Academy theme selection
        const themeOptions = document.querySelectorAll('[data-option="theme"]');
        if (themeOptions) {
            themeOptions.forEach(item => {
                item.addEventListener('click', (e) => this.selectTheme(e.currentTarget));
            });
        }
        
        // Environment selection
        const envOptions = document.querySelectorAll('[data-option="environment"]');
        if (envOptions) {
            envOptions.forEach(item => {
                item.addEventListener('click', (e) => this.selectEnvironment(e.currentTarget));
            });
        }
        
        // Layout selection
        const layoutOptions = document.querySelectorAll('[data-option="layout"]');
        if (layoutOptions) {
            layoutOptions.forEach(item => {
                item.addEventListener('click', (e) => this.selectLayout(e.currentTarget));
            });
        }
        
        // Custom theme input
        const customThemeInput = document.getElementById('customThemeText');
        if (customThemeInput) {
            customThemeInput.addEventListener('input', (e) => {
                this.config.customTheme = e.target.value;
                this.updatePreview();
            });
        }
        
        // Add-on checkboxes
        const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
        if (addonCheckboxes) {
            addonCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => this.toggleAddon(e.target));
            });
        }
        
        // Currency toggle (if implemented)
        const currencyButtons = document.querySelectorAll('[data-currency]');
        if (currencyButtons) {
            currencyButtons.forEach(button => {
                button.addEventListener('click', (e) => this.toggleCurrency(e.currentTarget));
            });
        }
        
        // Terms of Service agreement
        const tosCheckbox = document.getElementById('agreeToTos');
        if (tosCheckbox) {
            tosCheckbox.addEventListener('change', () => this.validatePurchaseButtons());
        }
        
        // Purchase buttons
        const robuxBtn = document.getElementById('purchaseRobux');
        const usdBtn = document.getElementById('purchaseUSD');
        
        if (robuxBtn) {
            robuxBtn.addEventListener('click', () => this.purchase('robux'));
        }
        
        if (usdBtn) {
            usdBtn.addEventListener('click', () => this.purchase('usd'));
        }
        
        // View controls
        const viewButtons = document.querySelectorAll('.view-btn');
        if (viewButtons) {
            viewButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.switchPreviewMode(e.currentTarget));
            });
        }
    }
    
    selectTheme(element) {
        // Remove active class from all theme options
        const themeOptions = document.querySelectorAll('[data-option="theme"]');
        if (themeOptions && themeOptions.length > 0) {
            themeOptions.forEach(item => {
                item.classList.remove('active');
            });
        }
        
        // Add active class to selected option
        element.classList.add('active');
        this.animateSelection(element);
        
        // Update configuration
        const value = element.dataset.value;
        this.config.academyTheme = value;
        
        // Show/hide custom theme input
        const customInput = document.getElementById('customThemeInput');
        if (customInput) {
            if (value === 'other') {
                customInput.style.display = 'block';
                customInput.querySelector('input').focus();
            } else {
                customInput.style.display = 'none';
                this.config.customTheme = '';
            }
        }
        
        this.updatePreview();
    }
    
    selectEnvironment(element) {
        // Remove active class from all environment options
        const envOptions = document.querySelectorAll('[data-option="environment"]');
        if (envOptions && envOptions.length > 0) {
            envOptions.forEach(item => {
                item.classList.remove('active');
            });
        }
        
        // Add active class to selected option
        element.classList.add('active');
        this.animateSelection(element);
        
        // Update configuration
        this.config.environment = element.dataset.value;
        this.updatePreview();
    }
    
    selectLayout(element) {
        // Remove active class from all layout options
        const layoutOptions = document.querySelectorAll('[data-option="layout"]');
        if (layoutOptions && layoutOptions.length > 0) {
            layoutOptions.forEach(item => {
                item.classList.remove('active');
            });
        }
        
        // Add active class to selected option
        element.classList.add('active');
        this.animateSelection(element);
        
        // Update configuration
        this.config.layout = element.dataset.value;
        this.updatePreview();
    }
    
    toggleAddon(checkbox) {
        const addonId = checkbox.closest('.addon-item').dataset.addon;
        
        if (checkbox.checked) {
            if (!this.config.addons.includes(addonId)) {
                this.config.addons.push(addonId);
            }
        } else {
            this.config.addons = this.config.addons.filter(id => id !== addonId);
        }
        
        this.updatePricing();
        this.animateSelection(checkbox.closest('.addon-item'));
    }
    
    toggleCurrency(button) {
        const currencyButtons = document.querySelectorAll('[data-currency]');
        if (currencyButtons && currencyButtons.length > 0) {
            currencyButtons.forEach(btn => {
                btn.classList.remove('active');
            });
        }
        
        button.classList.add('active');
        this.config.currency = button.dataset.currency;
        this.updatePricing();
    }
    
    updatePreview() {
        // Update preview image
        this.updatePreviewImage();
        
        // Update preview stats
        const themeDisplay = this.config.academyTheme === 'other' ? 
            (this.config.customTheme || 'Custom') : 
            this.config.academyTheme.toUpperCase();
            
        const previewTheme = document.getElementById('previewTheme');
        const previewEnvironment = document.getElementById('previewEnvironment');
        const previewLayout = document.getElementById('previewLayout');
        
        if (previewTheme) previewTheme.textContent = themeDisplay;
        if (previewEnvironment) previewEnvironment.textContent = this.capitalizeFirst(this.config.environment);
        if (previewLayout) previewLayout.textContent = this.capitalizeFirst(this.config.layout.replace('layout', 'Layout '));
    }
    
    updatePreviewImage() {
        const preview = document.getElementById('mapPreview');
        if (!preview) return;
        
        // Generate preview URL based on configuration
        const previewUrl = this.generatePreviewUrl();
        
        // Fade out, change image, fade in
        preview.style.opacity = '0.5';
        
        setTimeout(() => {
            preview.src = previewUrl;
            preview.style.opacity = '1';
        }, 200);
    }
    
    generatePreviewUrl() {
        // This would typically connect to a real preview generation system
        // For now, return a placeholder that reflects the configuration
        const theme = this.config.academyTheme;
        const env = this.config.environment;
        const layout = this.config.layout;
        
        return `/static/preview-${theme}-${env}-${layout}.jpg`;
    }
    
    updatePricing() {
        const total = this.calculateTotal();
        
        // Update price displays
        const totalElement = document.getElementById('totalRobux');
        const robuxPriceElement = document.getElementById('robuxPrice');
        const usdPriceElement = document.getElementById('totalUSD');
        const addonsElement = document.getElementById('addonsPrice');
        const addonsTotalElement = document.querySelector('.addons-total');
        
        if (totalElement) totalElement.textContent = this.formatPrice(total);
        if (robuxPriceElement) robuxPriceElement.textContent = this.formatPrice(total);
        if (usdPriceElement) usdPriceElement.textContent = this.formatPrice(total, 'usd');
        
        // Show/hide addons total
        const addonsTotal = this.config.addons.reduce((sum, addonId) => {
            return sum + (this.prices.addons[addonId] || 0);
        }, 0);
        
        if (addonsElement) {
            addonsElement.textContent = this.formatPrice(addonsTotal);
        }
        
        if (addonsTotalElement) {
            if (addonsTotal > 0) {
                addonsTotalElement.style.display = 'flex';
            } else {
                addonsTotalElement.style.display = 'none';
            }
        }
        
        // Update base price display
        const baseElement = document.getElementById('basePrice');
        if (baseElement) baseElement.textContent = this.formatPrice(this.prices.base);
        
        this.animatePriceUpdate();
    }
    
    formatPrice(amount, currency = null) {
        const curr = currency || this.config.currency;
        if (curr === 'usd') {
            return `$${(amount * this.prices.usdRate).toFixed(2)}`;
        }
        return `${amount.toLocaleString()} R$`;
    }
    
    getAddonDisplayName(addonId) {
        const names = {
            'vanilla-scripts': 'Vanilla Works Scripts',
            'complete-ui': 'Complete UI',
            'npc-gamepass': 'NPC Game Pass System'
        };
        return names[addonId] || addonId;
    }
    
    validatePurchaseButtons() {
        const tosCheckbox = document.getElementById('agreeToTos');
        const robuxBtn = document.getElementById('purchaseRobux');
        const usdBtn = document.getElementById('purchaseUSD');
        
        const isValid = tosCheckbox && tosCheckbox.checked;
        
        if (robuxBtn) {
            robuxBtn.disabled = !isValid;
            robuxBtn.style.opacity = isValid ? '1' : '0.5';
        }
        
        if (usdBtn) {
            usdBtn.disabled = !isValid;
            usdBtn.style.opacity = isValid ? '1' : '0.5';
        }
    }
    
    switchPreviewMode(button) {
        const viewButtons = document.querySelectorAll('.view-btn');
        if (viewButtons && viewButtons.length > 0) {
            viewButtons.forEach(btn => {
                btn.classList.remove('active');
            });
        }
        
        button.classList.add('active');
        
        const mode = button.dataset.view;
        this.animatePreviewTransition(mode);
    }
    
    animatePreviewTransition(mode) {
        const preview = document.getElementById('mapPreview');
        if (!preview) return;
        
        // Add a subtle animation effect
        preview.style.transform = 'scale(0.95)';
        preview.style.filter = 'brightness(0.8)';
        
        setTimeout(() => {
            preview.style.transform = 'scale(1)';
            preview.style.filter = 'brightness(1)';
        }, 150);
    }
    
    animateSelection(element) {
        // Add a pulse animation to show selection
        element.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
    
    animatePriceUpdate() {
        const priceElements = [
            document.getElementById('totalRobux'),
            document.getElementById('totalUSD'),
            document.getElementById('addonsPrice')
        ];
        
        priceElements.forEach(element => {
            if (element) {
                element.style.transform = 'scale(1.1)';
                element.style.color = '#66cc66';
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.color = '';
                }, 200);
            }
        });
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    async purchase(currency) {
        if (!this.validatePurchase()) {
            this.showNotification('Please agree to the Terms of Service before purchasing.', 'error');
            return;
        }
        
        // Prepare purchase data
        const purchaseData = {
            academyTheme: this.config.academyTheme,
            customTheme: this.config.customTheme,
            environment: this.config.environment,
            layout: this.config.layout,
            addons: this.config.addons,
            currency: currency,
            totalPrice: this.calculateTotal(),
            timestamp: new Date().toISOString()
        };
        
        // Show loading state
        const button = currency === 'robux' ? 
            document.getElementById('purchaseRobux') : 
            document.getElementById('purchaseUSD');
            
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<span>Processing...</span>';
            button.disabled = true;
            
            try {
                // Determine purchase endpoint based on current page
                const purchaseEndpoint = window.location.pathname.includes('/demo') ? '/demo/purchase' : '/purchase';
                
                // Send purchase request
                const response = await fetch(purchaseEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(purchaseData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (currency === 'robux') {
                        // Redirect to Roblox game pass
                        window.open(result.gamepassUrl, '_blank');
                    } else {
                        // Redirect to Stripe checkout
                        window.location.href = result.checkoutUrl;
                    }
                    
                    this.showNotification('Redirecting to payment...', 'success');
                } else {
                    throw new Error('Purchase failed');
                }
            } catch (error) {
                console.error('Purchase error:', error);
                this.showNotification('Purchase failed. Please try again.', 'error');
            } finally {
                // Restore button
                if (button) {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    this.validatePurchaseButtons();
                }
            }
        }
    }
    
    calculateTotal() {
        let total = this.prices.base;
        
        this.config.addons.forEach(addonId => {
            total += this.prices.addons[addonId] || 0;
        });
        
        return total;
    }
    
    validatePurchase() {
        const tosCheckbox = document.getElementById('agreeToTos');
        return tosCheckbox && tosCheckbox.checked;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff6b35' : type === 'success' ? '#4da64d' : '#2d7d2d'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize configurator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MilitectConfigurator();
});

// Helper function for cross-browser matches support
function matchesSelector(element, selector) {
    if (!element || !selector) return false;
    
    if (element.matches) {
        return element.matches(selector);
    } else if (element.msMatchesSelector) {
        return element.msMatchesSelector(selector);
    } else if (element.webkitMatchesSelector) {
        return element.webkitMatchesSelector(selector);
    } else if (element.mozMatchesSelector) {
        return element.mozMatchesSelector(selector);
    } else {
        // Fallback for very old browsers
        const matches = (element.document || element.ownerDocument).querySelectorAll(selector);
        let i = matches.length;
        while (--i >= 0 && matches.item(i) !== element) {}
        return i > -1;
    }
}

// Smooth scrolling for any anchor links
document.addEventListener('click', (e) => {
    if (matchesSelector(e.target, 'a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add visual feedback for interactive elements
document.addEventListener('mouseenter', (e) => {
    if (matchesSelector(e.target, '.option-item, .layout-item, .addon-item, .purchase-btn')) {
        e.target.style.transform = 'translateY(-2px)';
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    if (matchesSelector(e.target, '.option-item, .layout-item, .addon-item, .purchase-btn')) {
        e.target.style.transform = 'translateY(0)';
    }
}, true);