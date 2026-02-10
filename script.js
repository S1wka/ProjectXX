// ========== КОНСТАНТЫ ==========
const BOT_TOKEN = '8533113122:AAHeLcL7gMkRgj_RjWdwKh1V8L3RBH12O-8'; // Токен бота Telegram
const CHAT_ID = '5059538801'; // ID чата для отправки сообщений
// Мобильное меню
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const spans = burgerBtn.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
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

function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (burgerBtn) {
        const spans = burgerBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Плавная прокрутка
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        closeMenu();
    }
}

// Подсветка активного раздела при скролле
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

function updateActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(current)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Анимация элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимации к карточкам и элементам timeline
document.addEventListener('DOMContentLoaded', () => {
    // Анимация для карточек гонщиков, автомобилей и блоков "сегодня"
    document.querySelectorAll('.driver-card, .car-card, .today-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Обработка кликов по навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                scrollToSection(targetId.substring(1));
            }
        });
    });
    
    // Плавное появление страницы
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Обновляем активную навигацию при загрузке
    updateActiveNav();
});

// Hover эффекты для карточек
document.querySelectorAll('.driver-card, .car-card, .today-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Добавляем простые стили для анимаций
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #ff5800 !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

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
// ========== ТЕЛЕГРАМ ФОРМА ==========

/**
 * Отправляет данные формы в Telegram через Bot API
 * @param {Object} formData - Данные формы {name, email, message}
 * @returns {Promise<boolean>} Успешность отправки
 */
async function sendToTelegram(formData) {
    const { name, email, message } = formData;
    
    // Форматируем сообщение для Telegram (Markdown форматирование)
    const telegramMessage = `
🚨 НОВЫЙ ЗАПРОС С САЙТА MCLaren!

👤 *Имя:* ${name}
📧 *Email:* ${email}
💬 *Сообщение:* ${message}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
📍 *Источник:* McLaren MCL39 Technical Specs
    `.trim(); // trim() убирает лишние переносы в начале/конце
    
    try {
        // Отправляем запрос к Telegram Bot API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown', // Включаем форматирование Markdown
            })
        });
        
        const data = await response.json();
        return data.ok; // true если сообщение отправлено успешно
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

/**
 * Показывает всплывающее сообщение (успех/ошибка)
 * @param {string} text - Текст сообщения
 * @param {string} type - Тип сообщения: 'success' или 'error'
 */
function showMessage(text, type = 'success') {
    // Создаем элемент сообщения
    const messageEl = document.createElement('div');
    messageEl.className = type === 'success' ? 'success-message' : 'error-message';
    messageEl.textContent = text;
    
    // Стили для сообщения
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000; // Высокий z-index чтобы было поверх всего
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 4.7s; // Анимация появления и исчезновения
        font-weight: 500;
        max-width: 300px;
        text-align: center;
        ${type === 'success' 
            ? 'background: linear-gradient(45deg, #22c55e, #16a34a); color: white;' // Зеленый градиент для успеха
            : 'background: linear-gradient(45deg, #ef4444, #dc2626); color: white;'} // Красный градиент для ошибки
    `;
    
    document.body.appendChild(messageEl);
    
    // Автоматически удаляем сообщение через 5 секунд
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}
// ========== ОБРАБОТКА ФОРМЫ ОБРАТНОЙ СВЯЗИ ==========

document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('formSuccess');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем значения полей
            const name = document.getElementById('feedbackName').value.trim();
            const email = document.getElementById('feedbackEmail').value.trim();
            const subject = document.getElementById('feedbackSubject').value;
            const message = document.getElementById('feedbackMessage').value.trim();
            const newsletter = document.getElementById('newsletter').checked;
            
            // Очищаем предыдущие ошибки
            clearErrors();
            
            // Валидация
            let isValid = true;
            
            if (!name) {
                showError('feedbackName', 'Пожалуйста, введите ваше имя');
                isValid = false;
            }
            
            if (!email) {
                showError('feedbackEmail', 'Пожалуйста, введите ваш email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('feedbackEmail', 'Пожалуйста, введите корректный email');
                isValid = false;
            }
            
            if (!message) {
                showError('feedbackMessage', 'Пожалуйста, введите сообщение');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Формируем данные для отправки
            const fullMessage = subject 
                ? `Тема: ${document.getElementById('feedbackSubject').options[document.getElementById('feedbackSubject').selectedIndex].text}\n\n${message}`
                : message;
            
            const formData = {
                name: name,
                email: email,
                message: fullMessage,
                newsletter: newsletter,
                subject: subject
            };
            
            // Показываем состояние загрузки
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Отправка...</span><span class="btn-icon">⏳</span>';
            submitBtn.disabled = true;
            
            try {
                // Отправляем в Telegram
                const success = await sendToTelegram({
                    name: name,
                    email: email,
                    message: fullMessage + (newsletter ? '\n\n✅ Подписан на новости' : '')
                });
                
                if (success) {
                    // Скрываем форму, показываем сообщение об успехе
                    feedbackForm.style.display = 'none';
                    successMessage.style.display = 'flex';
                    
                    // Прокручиваем к сообщению об успехе
                    successMessage.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Очищаем форму
                    feedbackForm.reset();
                    
                    // Показываем всплывающее сообщение
                    showMessage('✅ Сообщение успешно отправлено! Спасибо за обратную связь.', 'success');
                } else {
                    showMessage('❌ Ошибка отправки. Пожалуйста, попробуйте позже.', 'error');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('❌ Произошла ошибка. Пожалуйста, попробуйте еще раз.', 'error');
            } finally {
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Функции валидации
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field && errorElement) {
            // Добавляем класс ошибки к полю
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            
            // Показываем сообщение об ошибке
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearErrors() {
        // Очищаем все ошибки
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        // Сбрасываем стили полей
        const inputs = document.querySelectorAll('#feedbackForm input, #feedbackForm select, #feedbackForm textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        });
    }
    
    // Обработчики для очистки ошибок при вводе
    const formInputs = feedbackForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });
});
