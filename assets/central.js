// JS centralizado de todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    
    // Hero Slider Functionality
    initHeroSlider();
    
    // Mobile Menu Functionality
    initMobileMenu();
    
    // Contact Forms Functionality (unified submit to API)
    initContactForms();
    
    // Search Form Functionality
    initSearchForm();
    
    // FAQ Functionality
    initFAQ();
    
    // FAQ Accordion Logic
    initFAQAccordion();
});

// Hero Slider Functions
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    // Auto-advance slides
    setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }
    
    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }
}

// Mobile Menu Functions
function initMobileMenu() {
    const mobileButton = document.querySelector('.sc_layouts_iconed_text_link');
    const mobileMenu = document.querySelector('.menu_mobile');
    const mobileOverlay = document.querySelector('.menu_mobile_overlay');
    const mobileClose = document.querySelector('.menu_mobile_close');
    
    if (!mobileButton || !mobileMenu) return;
    
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    mobileButton.addEventListener('click', (e) => {
        e.preventDefault();
        openMobileMenu();
    });
    
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Handle submenu toggles
    const menuItems = document.querySelectorAll('.menu_mobile .menu-item-has-children > a');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const submenu = item.nextElementSibling;
            if (submenu) {
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
}

// Contact Form Functions
function initContactForms() {
    const forms = document.querySelectorAll('.contact-form');
    if (!forms.length) return;

    try { console.log('[forms] initContactForms -> found forms:', forms.length); } catch(_) {}

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try { console.log('[forms] submit captured for', form.getAttribute('data-endpoint')); } catch(_) {}

            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!String(field.value || '').trim()) {
                    field.style.borderColor = '#ff6b6b';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            // Email validation
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#ff6b6b';
                    isValid = false;
                }
            }

            if (!isValid) {
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            // Serialize all fields
            const fd = new FormData(form);
            const payload = Object.fromEntries(fd.entries());
            // Add page source
            if (!payload.page) payload.page = window.location.pathname;
            // Ensure servicio has a sensible default if not provided
            if (!payload.servicio || String(payload.servicio).trim() === '') {
                payload.servicio = window.location.pathname.includes('contacto') ? 'Contacto' : 'General';
            }

            // Endpoint
            const endpoint = form.getAttribute('data-endpoint') || 'https://api.mueveme.es/contact';

            // Submit state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }

            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    // No explicit Content-Type to keep it a simple request (avoid preflight)
                    // Browser will default to text/plain; Lambda parses JSON string fine
                    mode: 'cors',
                    body: JSON.stringify(payload)
                });
                const json = await res.json().catch(() => ({}));
                if (res.ok && (json.ok === true || Object.keys(json).length === 0)) {
                    showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
                    form.reset();
                } else {
                    console.warn('Envio formulario fallido', { status: res.status, json });
                    showNotification(json.error || 'No se pudo enviar. Inténtalo más tarde.', 'error');
                }
            } catch (err) {
                console.error('Error de red al enviar formulario', err);
                showNotification('Error de red. Inténtalo más tarde.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        }, { capture: true });
    });
}

// Search Form Functions
function initSearchForm() {
    const searchForms = document.querySelectorAll('.search_form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('.search_field').value.trim();
            
            if (searchTerm) {
                // In a real implementation, this would search the site
                showNotification(`Buscando: "${searchTerm}"`, 'info');
            }
        });
    });
}

// FAQ accordion logic
function initFAQAccordion() {
    var faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(function(item) {
        var btn = item.querySelector('.faq-question');
        if (btn) {
            btn.addEventListener('click', function() {
                faqs.forEach(function(other) {
                    if (other !== item) other.classList.remove('open');
                });
                item.classList.toggle('open');
            });
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'error': return '#f44336';
        case 'warning': return '#ff9800';
        case 'info': 
        default: return '#2196F3';
    }
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const mobileMenu = document.querySelector('.menu_mobile');
        const mobileOverlay = document.querySelector('.menu_mobile_overlay');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }
});

// FAQ Functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('.faq-icon');
            
            // Toggle active state
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherIcon = item.querySelector('.faq-icon');
                    if (otherAnswer) otherAnswer.style.display = 'none';
                    if (otherIcon) otherIcon.textContent = '+';
                }
            });
            
            // Toggle current FAQ item
            if (isActive) {
                faqItem.classList.remove('active');
                answer.style.display = 'none';
                icon.textContent = '+';
            } else {
                faqItem.classList.add('active');
                answer.style.display = 'block';
                icon.textContent = '−';
            }
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images (SEO optimization)
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy-placeholder');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.href = 'assets/central.css';
    criticalCSS.as = 'style';
    document.head.appendChild(criticalCSS);
    
    // Preload web fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);
}

// Call preload function
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
} else {
    preloadCriticalResources();
}

// Register Service Worker for PWA and performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
