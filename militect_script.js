// Militect Tesla-Style Map Builder JavaScript

class MilitectConfigurator {
    constructor() {
        this.config = {
            theme: 'usa',
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
        // Theme selection
        document.querySelectorAll('[data-option="theme"]').forEach(item => {
            item.addEventListener('click', (e) => this.selectTheme(e.currentTarget));
        });
        
        // Environment selection
        document.querySelectorAll('[data-option="environment"]').forEach(item => {
            item.addEventListener('click', (e) => this.selectEnvironment(e.currentTarget));
        });
        
        // Layout selection
        document.querySelectorAll('[data-option="layout"]').forEach(item => {
            item.addEventListener('click', (e) => this.selectLayout(e.currentTarget));
        });
        
        // Add-on checkboxes
        document.querySelectorAll('.addon-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.toggleAddon(e.target));
        });
        
        // Currency toggle
        document.querySelectorAll('[data-currency]').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleCurrency(e.currentTarget));
        });
        
        // Terms checkbox
        const tosCheckbox = document.getElementById('agreeToTos');
        if (tosCheckbox) {
            tosCheckbox.addEventListener('change', () => this.validatePurchaseButtons());
        }
        
        // Purchase buttons
        document.getElementById('purchaseRobux')?.addEventListener('click', () => this.purchase('robux'));
        document.getElementById('purchaseUSD')?.addEventListener('click', () => this.purchase('usd'));
        
        // Preview controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPreviewMode(e.currentTarget));
        });
        
        // Custom theme input
        const customInput = document.querySelector('.custom-input');
        if (customInput) {
            customInput.addEventListener('input', (e) => {
                this.config.customTheme = e.target.value;
                this.updatePreview();
            });
        }
    }
    
    selectTheme(element) {
        // Remove active from all theme options
        document.querySelectorAll('[data-option="theme"]').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active to selected
        element.classList.add('active');
        
        const value = element.dataset.value;
        this.config.theme = value;
        
        // Show/hide custom input
        const customInput = element.querySelector('.custom-input');
        if (value === 'other') {
            if (customInput) {
                customInput.style.display = 'block';
                customInput.focus();
            }
        } else {
            document.querySelectorAll('.custom-input').forEach(input => {
                input.style.display = 'none';
            });
            this.config.customTheme = '';
        }
        
        this.updatePreview();
        this.animateSelection(element);
    }
    
    selectEnvironment(element) {
        document.querySelectorAll('[data-option="environment"]').forEach(item => {
            item.classList.remove('active');
        });
        
        element.classList.add('active');
        this.config.environment = element.dataset.value;
        
        this.updatePreview();
        this.animateSelection(element);
    }
    
    selectLayout(element) {
        document.querySelectorAll('[data-option="layout"]').forEach(item => {
            item.classList.remove('active');
        });
        
        element.classList.add('active');
        this.config.layout = element.dataset.value;
        
        this.updatePreview();
        this.animateSelection(element);
    }
    
    toggleAddon(checkbox) {
        const addonItem = checkbox.closest('.addon-item');
        const addonId = addonItem.dataset.addon;
        
        if (checkbox.checked) {
            if (!this.config.addons.includes(addonId)) {
                this.config.addons.push(addonId);
            }
            addonItem.style.borderColor = '#66cc66';
            addonItem.style.background = 'rgba(102, 204, 102, 0.1)';
        } else {
            this.config.addons = this.config.addons.filter(addon => addon !== addonId);
            addonItem.style.borderColor = '#333d33';
            addonItem.style.background = '#2a2a2a';
        }
        
        this.updatePricing();
        this.animateSelection(addonItem);
    }
    
    toggleCurrency(button) {
        document.querySelectorAll('[data-currency]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');
        this.config.currency = button.dataset.currency;
        
        this.updatePricing();
        this.animateSelection(button);
    }
    
    updatePreview() {
        // Update preview stats
        const themeDisplay = document.getElementById('themeDisplay');
        const environmentDisplay = document.getElementById('environmentDisplay');
        const layoutDisplay = document.getElementById('layoutDisplay');
        
        if (themeDisplay) {
            let themeText = this.config.theme.toUpperCase();
            if (this.config.theme === 'other' && this.config.customTheme) {
                themeText = this.config.customTheme;
            }
            themeDisplay.textContent = themeText;
        }
        
        if (environmentDisplay) {
            environmentDisplay.textContent = this.capitalizeFirst(this.config.environment);
        }
        
        if (layoutDisplay) {
            const layoutNumber = this.config.layout.replace('layout', '');
            layoutDisplay.textContent = `Layout ${layoutNumber}`;
        }
        
        // Update preview image based on configuration
        this.updatePreviewImage();
    }
    
    updatePreviewImage() {
        const previewImg = document.getElementById('previewImage');
        if (previewImg) {
            // Generate preview based on configuration
            const imageUrl = this.generatePreviewUrl();
            previewImg.src = imageUrl;
            
            // Add loading effect
            previewImg.style.opacity = '0.7';
            setTimeout(() => {
                previewImg.style.opacity = '1';
            }, 300);
        }
    }
    
    generatePreviewUrl() {
        // Generate preview URL based on current configuration
        const { theme, environment, layout } = this.config;
        return `/static/preview-${theme}-${environment}-${layout}.jpg`;
    }
    
    updatePricing() {
        let total = this.prices.base;
        
        // Calculate add-ons
        const addonPricesContainer = document.getElementById('addonPrices');
        if (addonPricesContainer) {
            addonPricesContainer.innerHTML = '';
            
            this.config.addons.forEach(addonId => {
                const price = this.prices.addons[addonId];
                total += price;
                
                const priceItem = document.createElement('div');
                priceItem.className = 'price-item';
                priceItem.innerHTML = `
                    <span>${this.getAddonDisplayName(addonId)}</span>
                    <span>+${this.formatPrice(price)}</span>
                `;
                addonPricesContainer.appendChild(priceItem);
            });
        }
        
        // Update total price
        const totalElement = document.getElementById('totalPrice');
        const robuxPriceElement = document.getElementById('robuxPrice');
        const usdPriceElement = document.getElementById('usdPrice');
        
        if (totalElement) totalElement.textContent = this.formatPrice(total);
        if (robuxPriceElement) robuxPriceElement.textContent = this.formatPrice(total);
        if (usdPriceElement) usdPriceElement.textContent = this.formatPrice(total, 'usd');
        
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
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');
        
        const mode = button.dataset.view;
        this.animatePreviewTransition(mode);
    }
    
    animatePreviewTransition(mode) {
        const previewContainer = document.querySelector('.preview-image');
        if (previewContainer) {
            previewContainer.style.transform = 'scale(0.95)';
            previewContainer.style.opacity = '0.7';
            
            setTimeout(() => {
                previewContainer.style.transform = 'scale(1)';
                previewContainer.style.opacity = '1';
            }, 200);
        }
    }
    
    animateSelection(element) {
        element.style.transform = 'scale(0.98)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
    
    animatePriceUpdate() {
        const totalElement = document.getElementById('totalPrice');
        if (totalElement) {
            totalElement.style.transform = 'scale(1.05)';
            totalElement.style.color = '#66cc66';
            
            setTimeout(() => {
                totalElement.style.transform = 'scale(1)';
                totalElement.style.color = '';
            }, 300);
        }
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    async purchase(currency) {
        const tosCheckbox = document.getElementById('agreeToTos');
        if (!tosCheckbox || !tosCheckbox.checked) {
            this.showNotification('Please agree to the Terms of Service', 'error');
            return;
        }
        
        // Prepare purchase data
        const purchaseData = {
            theme: this.config.theme,
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
                // Send purchase request
                const response = await fetch('/purchase', {
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
                
                // Restore button
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
    }
    
    calculateTotal() {
        let total = this.prices.base;
        this.config.addons.forEach(addonId => {
            total += this.prices.addons[addonId];
        });
        return total;
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