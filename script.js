// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const html = document.documentElement;
    const body = document.body;
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply theme
    body.setAttribute('data-theme', savedTheme);
    html.setAttribute('data-theme', savedTheme);
    
    // Update icons
    updateThemeIcons(savedTheme);
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcons(newTheme);
        
        // Add transition class for smooth change
        body.classList.add('theme-transitioning');
        // Use requestAnimationFrame to ensure smooth transition
        requestAnimationFrame(() => {
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
            }, 400);
        });
    }
    
    function updateThemeIcons(theme) {
        const darkIcons = document.querySelectorAll('#theme-toggle-dark-icon, #theme-toggle-dark-icon-mobile');
        const lightIcons = document.querySelectorAll('#theme-toggle-light-icon, #theme-toggle-light-icon-mobile');
        
        if (theme === 'dark') {
            darkIcons.forEach(icon => {
                icon.classList.remove('hidden');
                icon.classList.add('block');
            });
            lightIcons.forEach(icon => {
                icon.classList.remove('block');
                icon.classList.add('hidden');
            });
        } else {
            darkIcons.forEach(icon => {
                icon.classList.remove('block');
                icon.classList.add('hidden');
            });
            lightIcons.forEach(icon => {
                icon.classList.remove('hidden');
                icon.classList.add('block');
            });
        }
    }
    
    // Add event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            html.setAttribute('data-theme', newTheme);
            updateThemeIcons(newTheme);
        }
    });
}

// Initialize theme on page load
initTheme();

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Animate hamburger icon
        const icon = mobileMenuBtn.querySelector('svg');
        if (icon) {
            icon.style.transform = mobileMenu.classList.contains('hidden') 
                ? 'rotate(0deg)' 
                : 'rotate(90deg)';
        }
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (mobileMenuBtn.querySelector('svg')) {
                mobileMenuBtn.querySelector('svg').style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }

    lastScroll = currentScroll;
});

// Active Navigation Link
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink(); // Initial call

// Smooth Scroll for Navigation Links
let isProgrammaticScroll = false;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            isProgrammaticScroll = true;
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Reseta a flag após a animação
            setTimeout(() => {
                isProgrammaticScroll = false;
            }, 1000);
        }
    });
});

// Scroll Snap - Centraliza a seção mais próxima após o scroll parar
let scrollTimeout;
let isScrolling = false;
let isSnapping = false;

function findClosestSectionToCenter() {
    const viewportHeight = window.innerHeight;
    const viewportCenter = window.pageYOffset + (viewportHeight / 2);
    
    let closestSection = null;
    let closestDistance = Infinity;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionCenter = sectionTop + (sectionHeight / 2);
        
        // Calcula a distância do centro da seção ao centro da viewport
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        // Verifica se a seção está visível na viewport
        const sectionBottom = sectionTop + sectionHeight;
        const isVisible = (
            (sectionTop <= viewportCenter && sectionBottom >= viewportCenter) ||
            (sectionTop <= window.pageYOffset + viewportHeight && sectionBottom >= window.pageYOffset)
        );
        
        if (isVisible && distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
        }
    });
    
    return closestSection;
}

function snapToClosestSection() {
    if (isSnapping || isProgrammaticScroll) return;
    
    const closestSection = findClosestSectionToCenter();
    
    if (closestSection) {
        const sectionTop = closestSection.offsetTop;
        const sectionHeight = closestSection.clientHeight;
        const viewportHeight = window.innerHeight;
        const viewportCenter = window.pageYOffset + (viewportHeight / 2);
        const sectionCenter = sectionTop + (sectionHeight / 2);
        
        // Calcula a distância do centro da seção ao centro da viewport
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
        
        // Só faz snap se a seção já estiver perto do centro (dentro de 30% da altura da viewport)
        const snapThreshold = viewportHeight * 0.15;
        
        if (distanceFromCenter < snapThreshold && distanceFromCenter > 20) {
            // Calcula a posição para centralizar a seção
            const targetScroll = sectionTop + (sectionHeight / 2) - (viewportHeight / 2);
            const currentScroll = window.pageYOffset;
            const scrollDistance = Math.abs(targetScroll - currentScroll);
            
            // Só faz snap se a distância for razoável (entre 20px e o threshold)
            if (scrollDistance > 20 && scrollDistance < snapThreshold) {
                isSnapping = true;
                
                // Usa uma animação mais suave e lenta
                const startScroll = currentScroll;
                const distance = targetScroll - startScroll;
                const duration = 600; // 600ms para uma animação mais suave
                const startTime = performance.now();
                
                function animateScroll(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function para suavidade (ease-out)
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    
                    const currentPosition = startScroll + (distance * easeOut);
                    window.scrollTo(0, currentPosition);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    } else {
                        isSnapping = false;
                    }
                }
                
                requestAnimationFrame(animateScroll);
            }
        }
    }
}

// Detecta quando o scroll para
window.addEventListener('scroll', () => {
    isScrolling = true;
    
    // Limpa o timeout anterior
    clearTimeout(scrollTimeout);
    
    // Define um novo timeout para detectar quando o scroll para (mais tempo para ser mais suave)
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        // Aguarda um pouco mais para garantir que o scroll realmente parou
        setTimeout(() => {
            if (!isScrolling && !isSnapping) {
                snapToClosestSection();
            }
        }, 200);
    }, 300);
});

// Contact Form Handler
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Simulate form submission with loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <span class="relative z-10 flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
            </span>
        `;
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);
            
            // Show success message
            submitBtn.innerHTML = `
                <span class="relative z-10 flex items-center justify-center gap-2">
                    ✓ Mensagem Enviada!
                </span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe skill cards and project cards
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    const projectCards = document.querySelectorAll('.project-card');
    const aboutCards = document.querySelectorAll('.group\\/item');

    skillCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(card);
    });

    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    aboutCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.getElementById('home');
    
    if (heroSection) {
        const heroContent = heroSection.querySelector('.relative.z-10');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 1.5;
        }
    }
});

// Mouse move parallax effect for orbs
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * 100 * speed;
        const y = (mouseY - 0.5) * 100 * speed;
        
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add ripple effect to buttons
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Typing effect for hero subtitle (optional enhancement)
function initTypingEffect() {
    const subtitle = document.querySelector('#home p.text-2xl');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        
        // Start typing after a delay
        setTimeout(type, 100);
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    // Add fade-in to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', throttledScroll);

// Add smooth reveal animation to sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// Load GitHub Avatar
async function loadGitHubAvatar() {
    const avatarImg = document.getElementById('github-avatar');
    if (!avatarImg) return;
    
    try {
        const response = await fetch('https://api.github.com/users/clesiorods');
        if (response.ok) {
            const data = await response.json();
            if (data.avatar_url) {
                avatarImg.src = data.avatar_url;
            }
        }
    } catch (error) {
        console.log('Could not load GitHub avatar:', error);
        // Fallback: tenta usar a URL direta do GitHub
        avatarImg.src = `https://github.com/clesiorods.png?size=128`;
    }
}

// Carrega o avatar quando a página estiver pronta
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGitHubAvatar);
} else {
    loadGitHubAvatar();
}
