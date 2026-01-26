// ========== КОНСТАНТЫ ==========
const BOT_TOKEN = '8533113122:AAHeLcL7gMkRgj_RjWdwKh1V8L3RBH12O-8'; // Токен бота Telegram
const CHAT_ID = '5059538801'; // ID чата для отправки сообщений
const burgerBtn = document.getElementById('burgerBtn'); // Кнопка бургер-меню
const mobileMenu = document.getElementById('mobileMenu'); // Мобильное меню

// ========== БУРГЕР-МЕНЮ ==========
// Обработка открытия/закрытия мобильного меню с анимацией иконки
if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
        // Переключаем класс active у меню
        mobileMenu.classList.toggle('active');
        const spans = burgerBtn.querySelectorAll('span');
        
        // Анимация иконки бургера в крестик
        if (mobileMenu.classList.contains('active')) {
            // Превращаем в крестик
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0'; // Средняя линия скрывается
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            // Возвращаем в исходное состояние
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/**
 * Закрывает мобильное меню и сбрасывает иконку бургера
 */
function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (burgerBtn) {
        const spans = burgerBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ========== ПЛАВНАЯ ПРОКРУТКА ==========
/**
 * Плавно прокручивает страницу к указанной секции
 * @param {string} sectionId - ID целевой секции
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Плавная прокрутка с настройками
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' // Выравнивание по верхнему краю
        });
        closeMenu(); // Закрываем меню после клика на мобильном
    }
}

// ========== ПОДСВЕТКА АКТИВНОГО РАЗДЕЛА ==========
const sections = document.querySelectorAll('section[id]'); // Все секции с ID
const navLinks = document.querySelectorAll('.nav-link, .mobile-link'); // Все ссылки навигации

/**
 * Обновляет активное состояние навигационных ссылок в зависимости от текущей позиции скролла
 */
function updateActiveNav() {
    let current = ''; // ID текущей активной секции
    const scrollPos = window.scrollY + 150; // Текущая позиция скролла с небольшим отступом
    
    // Определяем, какая секция сейчас в области видимости
    sections.forEach(section => {
        const sectionTop = section.offsetTop; // Верхняя граница секции
        const sectionHeight = section.clientHeight; // Высота секции
        
        // Проверяем, находится ли секция в области видимости
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id'); // Запоминаем ID активной секции
        }
    });
    
    // Обновляем класс active у ссылок навигации
    navLinks.forEach(link => {
        link.classList.remove('active'); // Удаляем активный класс у всех ссылок
        
        const href = link.getAttribute('href');
        // Если ссылка ведет на текущую секцию - добавляем класс active
        if (href && href.includes(current)) {
            link.classList.add('active');
        }
    });
}

// Обновляем активную навигацию при скролле
window.addEventListener('scroll', updateActiveNav);

// ========== АНИМАЦИИ ПРИ СКРОЛЛЕ ==========
// Настройки для Intersection Observer (отслеживание появления элементов в viewport)
const observerOptions = {
    threshold: 0.1, // Срабатывает когда 10% элемента видно
    rootMargin: '0px 0px -50px 0px' // Смещение области просмотра
};

// Создаем observer для анимации элементов при их появлении на экране
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Анимируем элемент когда он становится видимым
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимации к карточкам с информацией
document.querySelectorAll('.info-card, .spec-detail, .tech-card, .spec-item').forEach(el => {
    // Начальное состояние (скрыто и смещено вниз)
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Начинаем отслеживать элемент
    observer.observe(el);
});

// Анимация для секций страницы
document.querySelectorAll('section').forEach((section, index) => {
    if (section.id) {
        // Секции появляются с задержкой для создания каскадного эффекта
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(section);
    }
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

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Обработчик формы Telegram
    const telegramForm = document.getElementById('telegramForm');
    
    if (telegramForm) {
        telegramForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Отменяем стандартную отправку формы
            
            // Получаем данные из формы
            const formData = {
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                message: document.getElementById('userMessage').value.trim()
            };
            
            // Простая валидация - проверяем что все поля заполнены
            if (!formData.name || !formData.email || !formData.message) {
                showMessage('Заполните все поля!', 'error');
                return;
            }
            
            // Показываем состояние загрузки на кнопке
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '📤 Отправка...';
            submitBtn.disabled = true;
            
            // Отправляем данные в Telegram
            const success = await sendToTelegram(formData);
            
            if (success) {
                // Успешная отправка
                showMessage('✅ Сообщение отправлено! Мы ответим в Telegram.', 'success');
                telegramForm.reset(); // Очищаем форму
            } else {
                // Ошибка отправки
                showMessage('❌ Ошибка отправки. Попробуйте позже.', 'error');
            }
            
            // Восстанавливаем кнопку в исходное состояние
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // Обработка кликов по навигационным ссылкам (якорям)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Отменяем стандартное поведение
            
            const targetId = this.getAttribute('href');
            // Если ссылка ведет на конкретную секцию
            if (targetId && targetId !== '#') {
                scrollToSection(targetId.substring(1)); // Убираем # из ID
            }
        });
    });
    
    // Плавное появление всей страницы при загрузке
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100); // Небольшая задержка
    
    // Инициализируем активную навигацию
    updateActiveNav();
});

// ========== HOVER ЭФФЕКТЫ ==========
// Добавляем эффекты при наведении на интерактивные элементы
document.querySelectorAll('.spec-detail, .tech-card, .info-card, .spec-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // При наведении - небольшой подъем и увеличение
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        // Возвращаем в исходное состояние
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========== ДИНАМИЧЕСКИЕ СТИЛИ ДЛЯ АНИМАЦИЙ ==========
// Добавляем CSS анимации для всплывающих сообщений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%); // Начинаем за пределами экрана справа
            opacity: 0;
        }
        to {
            transform: translateX(0); // Сдвигаем в нормальную позицию
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
document.head.appendChild(style); // Добавляем стили в head документа
