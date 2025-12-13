// Telegram Bot настройки (ЗАМЕНИТЕ НА ВАШИ!)
const BOT_TOKEN = '8533113122:AAHeLcL7gMkRgj_RjWdwKh1V8L3RBH12O-8'; // Замените на новый токен!
const CHAT_ID = '5059538801'; // Ваш Chat ID из Telegram

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

// Подсветка активного раздела
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

// Применяем анимации
document.querySelectorAll('.info-card, .spec-detail, .tech-card, .spec-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Анимация секций
document.querySelectorAll('section').forEach((section, index) => {
    if (section.id) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(section);
    }
});

// ========== ТЕЛЕГРАМ ФОРМА ==========

// Функция отправки в Telegram
async function sendToTelegram(formData) {
    const { name, email, message } = formData;
    
    // Форматируем сообщение для Telegram
    const telegramMessage = `
🚨 НОВЫЙ ЗАПРОС С САЙТА MCL39

👤 *Имя:* ${name}
📧 *Email:* ${email}
💬 *Сообщение:* ${message}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
📍 *Источник:* McLaren MCL39 Technical Specs
    `.trim();
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown',
            })
        });
        
        const data = await response.json();
        return data.ok;
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

// Функция показа сообщений
function showMessage(text, type = 'success') {
    // Создаем элемент сообщения
    const messageEl = document.createElement('div');
    messageEl.className = type === 'success' ? 'success-message' : 'error-message';
    messageEl.textContent = text;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 4.7s;
        font-weight: 500;
        max-width: 300px;
        text-align: center;
        ${type === 'success' 
            ? 'background: linear-gradient(45deg, #22c55e, #16a34a); color: white;' 
            : 'background: linear-gradient(45deg, #ef4444, #dc2626); color: white;'}
    `;
    
    document.body.appendChild(messageEl);
    
    // Удаляем через 5 секунд
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Обработчик Telegram формы (ИСПРАВЛЕННЫЙ!)
document.addEventListener('DOMContentLoaded', () => {
    const telegramForm = document.getElementById('telegramForm');
    
    if (telegramForm) {
        telegramForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = {
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                message: document.getElementById('userMessage').value.trim()
            };
            
            // Валидация
            if (!formData.name || !formData.email || !formData.message) {
                showMessage('Заполните все поля!', 'error');
                return;
            }
            
            // Показываем загрузку
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '📤 Отправка...';
            submitBtn.disabled = true;
            
            // Отправляем в Telegram
            const success = await sendToTelegram(formData);
            
            if (success) {
                // Успех
                showMessage('✅ Сообщение отправлено! Мы ответим в Telegram.', 'success');
                telegramForm.reset();
            } else {
                // Ошибка
                showMessage('❌ Ошибка отправки. Попробуйте позже.', 'error');
            }
            
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
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
    
    // Инициализация при загрузке
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    updateActiveNav();
});

// Hover эффекты
document.querySelectorAll('.spec-detail, .tech-card, .info-card, .spec-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);