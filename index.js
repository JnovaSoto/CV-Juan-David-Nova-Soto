// ===== SPLASH SCREEN ANIMATION =====
window.addEventListener("load", () => {

    const splash = document.getElementById("splash");
    const mainContent = document.getElementById("main-content");

    mainContent.style.display = "none";

    setTimeout(() => {
        splash.style.opacity = 0;
        setTimeout(() => {
            splash.style.display = "none";
            mainContent.style.display = "block";

            initScrollAnimations();
        }, 800);
    }, 1000);

    // ===== SMOOTH SCROLL WITH HIGHLIGHT =====
    document.querySelectorAll("a.func").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                target.classList.add("highlight");

                setTimeout(() => {
                    target.classList.remove("highlight");
                }, 1200);
            }
        });
    });

    // ===== TYPING ANIMATION =====
    const textElement = document.getElementById('animated-text');
    if (textElement) {
        const text = textElement.textContent;
        let index = 0;
        let deleting = false;

        textElement.textContent = '';

        function type() {
            if (!deleting) {
                textElement.textContent += text[index];
                index++;
                if (index === text.length) {
                    deleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            } else {
                textElement.textContent = textElement.textContent.slice(0, -1);
                if (textElement.textContent.length === 0) {
                    deleting = false;
                    index = 0;
                    setTimeout(type, 500);
                    return;
                }
            }
            setTimeout(type, deleting ? 50 : 150);
        }

        type();
    }
});

// ===== SCROLL-TRIGGERED ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.code-cage, .project-card-info');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== ENHANCED HOVER EFFECTS =====
document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("mouseenter", function (e) {
            this.style.transition = "all 0.3s ease";
        });
    });

    const images = document.querySelectorAll('.info_studies img, .projects img');
    images.forEach(img => {
        img.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        img.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Add glow effect to code lines on hover
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach(line => {
        line.addEventListener('mouseenter', function () {
            this.style.boxShadow = "inset 4px 0 0 rgba(148, 32, 140, 0.5)";
        });

        line.addEventListener('mouseleave', function () {
            this.style.boxShadow = "";
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle internal links
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

function debounce(func, wait) {
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

window.addEventListener('scroll', debounce(() => {
    const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
}, 10));
