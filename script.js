// Initialize Lucide Icons
lucide.createIcons();

// Matrix Rain Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
const matrixArray = matrix.split("");

const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = "rgba(10, 14, 39, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff41";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Smooth Scrolling
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

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 39, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 217, 255, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 14, 39, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Observe skill cards
document.querySelectorAll('.skill-card, .service-card, .stat-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ========== UPDATED FORM SUBMISSION ==========
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Get submit button and update its state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2"></i> Sending...';
        
        // Re-initialize Lucide icons for the loader
        lucide.createIcons();
        
        try {
            // Send data to your Vercel server
            const response = await fetch('https://personalserver12.vercel.app/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Show success message
                showFormMessage('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset(); // Reset form on success
            } else {
                // Show error message
                showFormMessage(result.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            lucide.createIcons(); // Re-initialize icons
        }
    });
}

// Helper function to show form messages
function showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message div
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        margin-top: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 0.95rem;
        animation: slideUp 0.3s ease;
        text-align: center;
        ${type === 'success' ? 
            'background: rgba(0, 255, 65, 0.1); border: 1px solid #00ff41; color: #00ff41;' : 
            'background: rgba(255, 68, 68, 0.1); border: 1px solid #ff4444; color: #ff4444;'}
    `;
    
    // Insert after form
    const form = document.querySelector('.contact-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (messageDiv) messageDiv.remove();
            }, 300);
        }
    }, 5000);
}

// Glitch Effect on Hero Title
const glitchText = document.querySelector('.glitch');
let glitchInterval;

if (glitchText) {
    function createGlitch() {
        const originalText = glitchText.getAttribute('data-text');
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        
        let iterations = 0;
        clearInterval(glitchInterval);
        
        glitchInterval = setInterval(() => {
            glitchText.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(glitchInterval);
            }
            
            iterations += 1 / 3;
        }, 30);
    }

    // Trigger glitch effect on page load
    window.addEventListener('load', () => {
        setTimeout(createGlitch, 500);
    });

    // Trigger glitch effect on hover
    glitchText.addEventListener('mouseenter', createGlitch);
}

// Particle Effect on Circular Badge
const badge = document.querySelector('.circular-badge');
let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = 100;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(0, 217, 255, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Add hover effect to create particles
if (badge) {
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.05)';
    });

    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1)';
    });
}

// Typing Effect for Tagline
const tagline = document.querySelector('.tagline');
if (tagline) {
    const taglineText = tagline.textContent;
    tagline.textContent = '';

    let charIndex = 0;
    function typeWriter() {
        if (charIndex < taglineText.length) {
            tagline.textContent += taglineText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing effect after page load
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 1500);
    });
}

// Skill Progress Animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 100);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Cursor Trail Effect
let cursorTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }
});

// Add custom cursor effect
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #00d9ff;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    mix-blend-mode: difference;
    transform: translate(-50%, -50%);
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Scale cursor on interactive elements
document.querySelectorAll('a, button, .btn, input, textarea').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.borderColor = '#00ff41';
    });
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderColor = '#00d9ff';
    });
});

// Console Easter Egg
console.log('%c🚀 Welcome to the Matrix!', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with AI & Passion', 'color: #00ff41; font-size: 14px;');
console.log('%cInterested in working together? Contact me!', 'color: #ffffff; font-size: 12px;');

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
