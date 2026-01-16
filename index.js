// ===== SPLASH SCREEN ANIMATION =====
window.addEventListener("load", () => {
    const splash = document.getElementById("splash");
    const mainContent = document.getElementById("main-content");

    mainContent.style.display = "none";

    setTimeout(() => {
        splash.style.opacity = 0;
        setTimeout(() => {
            splash.style.display = "none";
            mainContent.style.display = "flex";
            initializeIDE();
        }, 800);
    }, 1500);
});

// ===== IDE INITIALIZATION =====
function initializeIDE() {
    initializeTabs();
    initializeFileTree();
    initializeSidebar();
    updateLineNumbers();
    initializeStatusBar();
}

// ===== TAB MANAGEMENT =====
const tabManager = {
    openTabs: new Set(['intro']),
    activeTab: 'intro',

    openTab(tabName) {
        if (!this.openTabs.has(tabName)) {
            this.openTabs.add(tabName);
            this.createTabElement(tabName);
        }
        this.switchTab(tabName);
    },

    createTabElement(tabName) {
        const tabBar = document.querySelector('.tab-bar');
        const tabConfig = this.getTabConfig(tabName);

        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.tab = tabName;

        tab.innerHTML = `
            <span class="material-symbols-outlined tab-icon ${tabConfig.iconClass}">description</span>
            <span class="tab-name">${tabConfig.fileName}</span>
            <span class="material-symbols-outlined tab-close">close</span>
        `;

        // Tab click to switch
        tab.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tab-close')) {
                this.switchTab(tabName);
            }
        });

        // Close button
        const closeBtn = tab.querySelector('.tab-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tabName);
        });

        tabBar.appendChild(tab);
    },

    switchTab(tabName) {
        // Update active tab
        this.activeTab = tabName;

        // Update tab bar
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update content - hide all first then show active to prevent jumps
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => {
            if (content.id === `${tabName}-content`) {
                content.style.display = 'block';
                // Trigger reflow if needed, but display block is key
                setTimeout(() => content.classList.add('active'), 10);
            } else {
                content.style.display = 'none';
                content.classList.remove('active');
            }
        });

        // Update file tree
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });

        // Update line numbers for active tab
        updateLineNumbers(tabName);

        // Reset scroll position
        const editorContent = document.querySelector('.editor-content');
        if (editorContent) editorContent.scrollTop = 0;

        // Update status bar language
        updateStatusBarLanguage(tabName);
    },

    closeTab(tabName) {
        if (this.openTabs.size === 1) {
            return; // Don't close the last tab
        }

        this.openTabs.delete(tabName);

        // Remove tab element
        const tabElement = document.querySelector(`.tab[data-tab="${tabName}"]`);
        if (tabElement) {
            tabElement.remove();
        }

        // If closing active tab, switch to another
        if (this.activeTab === tabName) {
            const nextTab = Array.from(this.openTabs)[0];
            this.switchTab(nextTab);
        }
    },

    getTabConfig(tabName) {
        const configs = {
            intro: { fileName: 'intro.js', iconClass: 'js-icon', language: 'JavaScript' },
            skills: { fileName: 'skills.py', iconClass: 'py-icon', language: 'Python' },
            education: { fileName: 'education.json', iconClass: 'json-icon', language: 'JSON' },
            projects: { fileName: 'projects.md', iconClass: 'md-icon', language: 'Markdown' },
            contact: { fileName: 'contact.ts', iconClass: 'ts-icon', language: 'TypeScript' }
        };
        return configs[tabName] || configs.intro;
    }
};

// ===== INITIALIZE TABS =====
function initializeTabs() {
    // Tab switching is handled by tabManager
    // Initial tab is already set in HTML
}

// ===== FILE TREE INTERACTION =====
function initializeFileTree() {
    const fileItems = document.querySelectorAll('.file-item');

    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.dataset.tab;
            tabManager.openTab(tabName);
        });
    });

    // Folder toggle
    const folderHeader = document.querySelector('.folder-header');
    if (folderHeader) {
        folderHeader.addEventListener('click', () => {
            const fileList = folderHeader.nextElementSibling;
            const icon = folderHeader.querySelector('.folder-icon');

            if (fileList.style.display === 'none') {
                fileList.style.display = 'block';
                icon.textContent = 'expand_more';
            } else {
                fileList.style.display = 'none';
                icon.textContent = 'chevron_right';
            }
        });
    }
}

// ===== SIDEBAR MANAGEMENT =====
function initializeSidebar() {
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    const sidebarPanels = document.querySelectorAll('.sidebar-panel');

    sidebarIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const panelName = icon.dataset.panel;

            // Toggle active icon
            sidebarIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');

            // Toggle active panel
            sidebarPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === panelName);
            });
        });
    });
}

// ===== LINE NUMBERS =====
function updateLineNumbers(tabName = 'intro') {
    const lineNumbersId = `${tabName}-lines`;
    const lineNumbersContainer = document.getElementById(lineNumbersId);

    if (!lineNumbersContainer) return;

    const contentId = `${tabName}-content`;
    const content = document.getElementById(contentId);

    if (!content) return;

    const codeLines = content.querySelectorAll('.code-line');
    const lineCount = codeLines.length;

    let lineNumbersHTML = '';
    for (let i = 1; i <= lineCount; i++) {
        lineNumbersHTML += `<div class="code-line">${i}</div>`;
    }

    lineNumbersContainer.innerHTML = lineNumbersHTML;
}

// ===== STATUS BAR =====
function initializeStatusBar() {
    updateStatusBarLanguage('intro');
}

function updateStatusBarLanguage(tabName) {
    const languageElement = document.getElementById('current-language');
    if (!languageElement) return;

    const config = tabManager.getTabConfig(tabName);
    languageElement.textContent = config.language;
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + W to close tab
    if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        tabManager.closeTab(tabManager.activeTab);
    }

    // Ctrl/Cmd + Tab to switch tabs
    if ((e.ctrlKey || e.metaKey) && e.key === 'Tab') {
        e.preventDefault();
        const tabs = Array.from(tabManager.openTabs);
        const currentIndex = tabs.indexOf(tabManager.activeTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        tabManager.switchTab(tabs[nextIndex]);
    }

    // Ctrl/Cmd + B to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    }
});

// ===== SMOOTH SCROLLING =====
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for editor content
    const editorContent = document.querySelector('.editor-content');
    if (editorContent) {
        editorContent.style.scrollBehavior = 'smooth';
    }
});

// ===== CODE LINE HOVER EFFECTS =====
document.addEventListener('DOMContentLoaded', () => {
    const codeLines = document.querySelectorAll('.code-text .code-line');

    codeLines.forEach(line => {
        line.addEventListener('mouseenter', function () {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        });

        line.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
        });
    });
});

// ===== RESPONSIVE SIDEBAR TOGGLE =====
function createMobileMenuToggle() {
    if (window.innerWidth <= 768) {
        const headerLeft = document.querySelector('.header-left');

        // Check if toggle already exists
        if (!document.querySelector('.mobile-menu-toggle')) {
            const toggleBtn = document.createElement('span');
            toggleBtn.className = 'material-symbols-outlined header-icon mobile-menu-toggle';
            toggleBtn.textContent = 'menu';
            toggleBtn.style.marginRight = '8px';

            toggleBtn.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('open');
            });

            headerLeft.insertBefore(toggleBtn, headerLeft.firstChild);
        }
    }
}

window.addEventListener('resize', createMobileMenuToggle);
window.addEventListener('load', createMobileMenuToggle);

// ===== CLOSE SIDEBAR ON OUTSIDE CLICK (MOBILE) =====
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.mobile-menu-toggle');

        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                sidebar.classList.remove('open');
            }
        }
    }
});

// ===== ENHANCED INTERACTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to clickable items
    const clickableItems = document.querySelectorAll('.file-item, .tab, .sidebar-icon');

    clickableItems.forEach(item => {
        item.addEventListener('click', function (e) {
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

            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for resize events
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

// Optimized resize handler
const handleResize = debounce(() => {
    updateLineNumbers(tabManager.activeTab);
    createMobileMenuToggle();
}, 250);

window.addEventListener('resize', handleResize);

// ===== INITIALIZE ALL LINE NUMBERS ON LOAD =====
window.addEventListener('load', () => {
    ['intro', 'skills', 'education', 'projects', 'contact'].forEach(tab => {
        updateLineNumbers(tab);
    });
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    const editorArea = document.querySelector('.editor-area');
    editorArea.style.animation = 'rainbow 2s linear';

    setTimeout(() => {
        editorArea.style.animation = '';
    }, 2000);

    // Add rainbow animation to CSS dynamically
    if (!document.querySelector('#easter-egg-style')) {
        const style = document.createElement('style');
        style.id = 'easter-egg-style';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    console.log('🎉 Easter egg activated! You found the secret!');
}

// ===== EXPORT FOR DEBUGGING =====
window.IDE = {
    tabManager,
    updateLineNumbers,
    updateStatusBarLanguage
};
