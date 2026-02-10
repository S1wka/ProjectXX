// Добавьте этот код в конец существующего файла script.js

// Функция для переключения вкладок автомобилей
function openTab(tabName) {
    // Скрыть все вкладки
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убрать активный класс у всех кнопок
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    document.getElementById(tabName).classList.add('active');
    
    // Активировать соответствующую кнопку
    event.currentTarget.classList.add('active');
}

// Анимация для статистических карточек
function animateStats() {
    const stats = document.querySelectorAll('.stat-card, .innovation-card, .fact');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        stat.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(stat);
    });
}

// Функция для подсчета статистики с анимацией
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 100;
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Запускаем анимацию когда элемент появляется в viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация вкладок
    const defaultTab = document.querySelector('.tab.active');
    if (defaultTab) {
        const tabId = defaultTab.getAttribute('onclick').match(/'([^']+)'/)[1];
        document.getElementById(tabId).classList.add('active');
    }
    
    // Анимация статистических карточек
    animateStats();
    
    // Анимация счетчиков (опционально, можно включить если нужно)
    // animateCounters();
    
    // Добавляем обработчики для вкладок
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            openTab(tabName);
        });
    });
    
    // Плавная прокрутка для всех внутренних ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.getElementById(targetId.substring(1));
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
