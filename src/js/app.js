// src/js/app.js - JavaScript com Acessibilidade e Funcionalidades

/**
 * PLATINA PARA TODOS - APP PRINCIPAL
 * JavaScript acessível e otimizado para WCAG 2.1 AA
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    // Configurações de acessibilidade
    accessibility: {
        maxFontSize: 3,
        animationDuration: 300
    },
    // Configurações da aplicação
    app: {
        version: '1.0.0',
        environment: 'production'
    }
};

// ===== GERENCIADOR DE ACESSIBILIDADE =====
class AccessibilityManager {
    constructor() {
        this.currentFontSize = 0;
        this.isHighContrast = false;
        this.isReadingMode = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.announceToScreenReader('Página carregada com sucesso. Use os controles de acessibilidade no lado direito para personalizar sua experiência.');
    }

    setupEventListeners() {
        // Controles de acessibilidade
        document.getElementById('highContrastBtn')?.addEventListener('click', () => this.toggleHighContrast());
        document.getElementById('fontSizeBtn')?.addEventListener('click', () => this.increaseFontSize());
        document.getElementById('readingModeBtn')?.addEventListener('click', () => this.toggleReadingMode());
        document.getElementById('resetAccessibilityBtn')?.addEventListener('click', () => this.resetAccessibility());

        // Navegação por teclado
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Foco para acessibilidade
        this.setupFocusManagement();
    }

    // ===== CONTROLES DE ACESSIBILIDADE =====
    toggleHighContrast() {
        this.isHighContrast = !this.isHighContrast;
        document.body.classList.toggle('high-contrast', this.isHighContrast);
        
        const button = document.getElementById('highContrastBtn');
        button.setAttribute('aria-pressed', this.isHighContrast);
        
        this.announceToScreenReader(
            this.isHighContrast ? 
            'Modo alto contraste ativado' : 
            'Modo alto contraste desativado'
        );
        
        this.saveUserPreferences();
    }

    increaseFontSize() {
        this.currentFontSize = (this.currentFontSize + 1) % (CONFIG.accessibility.maxFontSize + 1);
        
        // Remove todas as classes de tamanho de fonte
        document.body.classList.remove('font-large', 'font-xlarge', 'font-xxlarge');
        
        // Adiciona a classe correspondente
        switch(this.currentFontSize) {
            case 1:
                document.body.classList.add('font-large');
                this.announceToScreenReader('Tamanho da fonte aumentado para grande');
                break;
            case 2:
                document.body.classList.add('font-xlarge');
                this.announceToScreenReader('Tamanho da fonte aumentado para extra grande');
                break;
            case 3:
                document.body.classList.add('font-xxlarge');
                this.announceToScreenReader('Tamanho da fonte aumentado para máximo');
                break;
            default:
                this.announceToScreenReader('Tamanho da fonte redefinido para normal');
        }
        
        this.saveUserPreferences();
    }

    toggleReadingMode() {
        this.isReadingMode = !this.isReadingMode;
        document.body.classList.toggle('reading-mode', this.isReadingMode);
        
        const button = document.getElementById('readingModeBtn');
        button.setAttribute('aria-pressed', this.isReadingMode);
        
        this.announceToScreenReader(
            this.isReadingMode ? 
            'Modo de leitura ativado' : 
            'Modo de leitura desativado'
        );
        
        this.saveUserPreferences();
    }

    resetAccessibility() {
        this.currentFontSize = 0;
        this.isHighContrast = false;
        this.isReadingMode = false;
        
        document.body.className = '';
        
        // Reseta todos os botões
        const buttons = ['highContrastBtn', 'fontSizeBtn', 'readingModeBtn'];
        buttons.forEach(btnId => {
            const button = document.getElementById(btnId);
            if (button) button.setAttribute('aria-pressed', 'false');
        });
        
        this.announceToScreenReader('Todas as configurações de acessibilidade foram redefinidas');
        this.saveUserPreferences();
    }

    // ===== NAVEGAÇÃO POR TECLADO =====
    handleKeyboardNavigation(event) {
        // Atalhos de teclado para acessibilidade
        switch(event.key) {
            case '1':
                if (event.altKey) {
                    event.preventDefault();
                    document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' });
                    this.announceToScreenReader('Seção inicial');
                }
                break;
            case '2':
                if (event.altKey) {
                    event.preventDefault();
                    document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
                    this.announceToScreenReader('Seção sobre');
                }
                break;
            case '3':
                if (event.altKey) {
                    event.preventDefault();
                    document.getElementById('mentoria')?.scrollIntoView({ behavior: 'smooth' });
                    this.announceToScreenReader('Seção mentoria');
                }
                break;
            case '0':
                if (event.altKey) {
                    event.preventDefault();
                    this.resetAccessibility();
                }
                break;
        }
    }

    setupFocusManagement() {
        // Gerencia o foco para elementos dinâmicos
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableContent = document.querySelectorAll(focusableElements);
        
        focusableContent.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focused');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('focused');
            });
        });
    }

    // ===== PERSISTÊNCIA E UTILITÁRIOS =====
    saveUserPreferences() {
        const preferences = {
            fontSize: this.currentFontSize,
            highContrast: this.isHighContrast,
            readingMode: this.isReadingMode,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('platinaAccessibility', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Não foi possível salvar preferências:', error);
        }
    }

    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('platinaAccessibility');
            if (saved) {
                const preferences = JSON.parse(saved);
                
                this.currentFontSize = preferences.fontSize || 0;
                this.isHighContrast = preferences.highContrast || false;
                this.isReadingMode = preferences.readingMode || false;
                
                // Aplica as preferências salvas
                if (this.isHighContrast) document.body.classList.add('high-contrast');
                if (this.isReadingMode) document.body.classList.add('reading-mode');
                
                switch(this.currentFontSize) {
                    case 1: document.body.classList.add('font-large'); break;
                    case 2: document.body.classList.add('font-xlarge'); break;
                    case 3: document.body.classList.add('font-xxlarge'); break;
                }
            }
        } catch (error) {
            console.warn('Não foi possível carregar preferências:', error);
        }
    }

    announceToScreenReader(message) {
        // Cria um elemento para anunciar para leitores de tela
        const announcer = document.getElementById('screen-reader-announcer') || 
                          this.createScreenReaderAnnouncer();
        
        announcer.textContent = message;
    }

    createScreenReaderAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        return announcer;
    }
}

// ===== GERENCIADOR DE SERVIÇOS =====
class ServiceManager {
    constructor() {
        this.services = {
            'mentoria': 'Mentoria Individual',
            'guias': 'Biblioteca de Guias', 
            'grupos': 'Grupos de Apoio',
            'discord': 'Comunidade Discord'
        };
    }

    trackServiceClick(serviceName) {
        // Simula tracking de analytics (em produção, integraria com Google Analytics)
        console.log(`Serviço clicado: ${this.services[serviceName] || serviceName}`);
        
        // Feedback para o usuário
        const accessibilityManager = window.accessibilityManager;
        if (accessibilityManager) {
            accessibilityManager.announceToScreenReader(`Navegando para ${this.services[serviceName] || serviceName}`);
        }
    }

    initializeServiceLinks() {
        // Adiciona tracking a todos os links de serviço
        const serviceLinks = document.querySelectorAll('a[href*="#"]');
        serviceLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const service = href.replace('#', '');
                
                if (this.services[service]) {
                    this.trackServiceClick(service);
                }
            });
        });
    }
}

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
class PlatinaApp {
    constructor() {
        this.accessibilityManager = null;
        this.serviceManager = null;
        this.init();
    }

    init() {
        // Aguarda o DOM estar completamente carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        try {
            // Inicializa gerenciadores
            this.accessibilityManager = new AccessibilityManager();
            this.serviceManager = new ServiceManager();
            
            // Configurações globais
            window.accessibilityManager = this.accessibilityManager;
            window.platinaApp = this;
            
            // Inicializa componentes
            this.serviceManager.initializeServiceLinks();
            this.setupSmoothScrolling();
            this.setupPerformanceMonitoring();
            
            console.log('🎮 Platina Para Todos - App inicializado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            this.handleInitializationError(error);
        }
    }

    setupSmoothScrolling() {
        // Scroll suave para links âncora
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
    }

    setupPerformanceMonitoring() {
        // Monitora performance (em produção, integraria com ferramentas de monitoring)
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Tempo de carregamento: ${loadTime}ms`);
                
                if (loadTime > 3000) {
                    console.warn('Tempo de carregamento alto, considere otimizar recursos.');
                }
            });
        }
    }

    handleInitializationError(error) {
        // Fallback para caso de erro na inicialização
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            background: #ff4757;
            color: white;
            padding: 1rem;
            text-align: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10000;
        `;
        errorMessage.textContent = 'Erro ao carregar alguns recursos. A página pode não funcionar completamente.';
        document.body.appendChild(errorMessage);
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
}

// ===== INICIALIZAÇÃO =====
// Inicia a aplicação quando o script é carregado
new PlatinaApp();

// Export para testes (em ambiente de desenvolvimento)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PlatinaApp, AccessibilityManager, ServiceManager };
}
