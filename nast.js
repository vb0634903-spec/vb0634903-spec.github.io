/* ============================================
   JAVASCRIPT ДЛЯ САЙТА ДИЗАЙНЕРА ИНТЕРЬЕРОВ
   Анастасия | Дизайн интерьеров
   ============================================ */

// Ожидаем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // 1. ПЛАВНАЯ ПРОКРУТКА К СЕКЦИЯМ (ЯКОРЯ)
    // =============================================
    const navLinks = document.querySelectorAll('nav a[href^="#"], footer a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Проверяем, что это якорь (начинается с #)
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault(); // Отменяем стандартное поведение
                
                // Получаем высоту шапки для корректного смещения
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Плавно прокручиваем
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 10,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // 2. АКТИВНЫЙ ПУНКТ МЕНЮ ПРИ ПРОКРУТКЕ
    // =============================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('nav ul a');
    
    function updateActiveNavItem() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 150; // Смещение для учёта шапки
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }
    
    // Вызываем при загрузке и при прокрутке
    window.addEventListener('scroll', updateActiveNavItem);
    updateActiveNavItem();

    // =============================================
    // 3. АНИМАЦИЯ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ (Intersection Observer)
    // =============================================
    // Находим все элементы, которые хотим анимировать
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Если элементы с классом animate-on-scroll уже есть в HTML,
    // можно добавить, но мы добавим динамически для красоты
    
    // Добавляем классы для анимации к карточкам проектов и услуг
    const projectCards = document.querySelectorAll('#projects > div > div');
    const serviceCards = document.querySelectorAll('#services > div > div');
    const testimonialCards = document.querySelectorAll('#testimonials > div > div');
    
    // Объединяем все карточки
    const cardsToAnimate = [...projectCards, ...serviceCards, ...testimonialCards];
    
    // Добавляем класс для анимации и скрываем их изначально
    cardsToAnimate.forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`; // Постепенное появление
    });
    
    // Создаём наблюдатель
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Перестаём наблюдать после появления
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Начинаем наблюдение за каждой карточкой
    cardsToAnimate.forEach(card => {
        observer.observe(card);
    });

    // =============================================
    // 4. ОБРАБОТКА ФОРМЫ СВЯЗИ
    // =============================================
    const contactForm = document.querySelector('#contacts form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Отменяем отправку формы
            
            // Получаем данные из полей
            const name = this.querySelector('#name')?.value.trim() || '';
            const email = this.querySelector('#email')?.value.trim() || '';
            const phone = this.querySelector('#phone')?.value.trim() || '';
            const message = this.querySelector('#message')?.value.trim() || '';
            
            // Простая валидация
            if (!name || !email || !message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // Проверка email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Пожалуйста, введите корректный email', 'error');
                return;
            }
            
            // Если всё хорошо — показываем сообщение об успехе
            showNotification('Спасибо! Я свяжусь с вами в ближайшее время 💫', 'success');
            
            // Очищаем форму
            this.reset();
            
            // Можно также отправить данные на сервер через fetch
            // sendFormData(name, email, phone, message);
        });
    }

    // =============================================
    // 5. ВСПЛЫВАЮЩИЕ УВЕДОМЛЕНИЯ
    // =============================================
    function showNotification(message, type = 'info') {
        // Удаляем старое уведомление, если есть
        const oldNotification = document.querySelector('.notification-toast');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        // Создаём элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        
        // Выбираем иконку в зависимости от типа
        let icon = '📬';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'info') icon = 'ℹ️';
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.5rem;">${icon}</span>
                <span>${message}</span>
            </div>
            <button class="notification-close" style="background: none; border: none; color: inherit; font-size: 1.3rem; cursor: pointer; padding: 0 4px;">×</button>
        `;
        
        // Стили уведомления
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            padding: '18px 24px',
            borderRadius: '16px',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '1rem',
            fontWeight: '500',
            zIndex: '1000',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            maxWidth: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            transform: 'translateY(120px)',
            opacity: '0',
            transition: 'transform 0.5s ease, opacity 0.5s ease'
        });
        
        // Цвет в зависимости от типа
        const colors = {
            success: '#2e7d32',
            error: '#c62828',
            info: '#2e2a27'
        };
        notification.style.backgroundColor = colors[type] || '#2e2a27';
        
        // Добавляем на страницу
        document.body.appendChild(notification);
        
        // Анимация появления
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        });
        
        // Кнопка закрытия
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
    }
    
    function removeNotification(notification) {
        notification.style.transform = 'translateY(120px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }

    // =============================================
    // 6. КНОПКА "НАВЕРХ" (SCROLL TO TOP)
    // =============================================
    function createScrollTopButton() {
        const button = document.createElement('button');
        button.className = 'scroll-top-btn';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Наверх');
        
        // Стили для кнопки
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#a67c6b',
            color: '#fff',
            border: 'none',
            fontSize: '1.8rem',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(166, 124, 107, 0.4)',
            zIndex: '99',
            transform: 'scale(0)',
            transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        // Ховер эффекты
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#8c6657';
            button.style.boxShadow = '0 8px 28px rgba(166, 124, 107, 0.5)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#a67c6b';
            button.style.boxShadow = '0 6px 20px rgba(166, 124, 107, 0.4)';
        });
        
        // При клике — плавно наверх
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(button);
        
        // Показывать/скрывать кнопку при прокрутке
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 400) {
                button.style.transform = 'scale(1)';
            } else {
                button.style.transform = 'scale(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    // Создаём кнопку
    createScrollTopButton();

    // =============================================
    // 7. ПАРАЛЛАКС ЭФФЕКТ ДЛЯ ГЕРОЯ (опционально)
    // =============================================
    const heroSection = document.querySelector('#hero');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroContent = heroSection.querySelector('h1, p, a');
            
            // Лёгкий эффект параллакса для заголовка
            const title = heroSection.querySelector('h1');
            if (title && scrollY < 600) {
                title.style.transform = `translateY(${scrollY * 0.05}px)`;
                title.style.opacity = 1 - (scrollY / 800);
            }
        });
    }

    // =============================================
    // 8. ДИНАМИЧЕСКИЙ ГОД В ФУТЕРЕ
    // =============================================
    const footerYear = document.querySelector('footer p:last-child');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace('2026', currentYear);
    }

    // =============================================
    // 9. ПЛАВНАЯ АНИМАЦИЯ ДЛЯ ИЗОБРАЖЕНИЙ (при загрузке)
    // =============================================
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.8s ease';
            requestAnimationFrame(() => {
                this.style.opacity = '1';
            });
        });
        
        // Если изображение уже загружено (из кеша)
        if (img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.8s ease';
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });
        }
    });

    // =============================================
    // 10. ПОДСВЕТКА ПОЛЕЙ ФОРМЫ ПРИ ФОКУСЕ
    // =============================================
    const formInputs = document.querySelectorAll('#contacts input, #contacts textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#a67c6b';
            this.style.boxShadow = '0 0 0 4px rgba(166, 124, 107, 0.15)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e2d5cc';
            this.style.boxShadow = 'none';
        });
    });

    // =============================================
    // 11. АДАПТИВНОЕ МЕНЮ (бургер, если понадобится)
    // =============================================
    // Можно добавить бургер-меню для мобильных, но в текущей версии меню адаптивное
    
    // =============================================
    // 12. СЧЁТЧИКИ СТАТИСТИКИ (анимация цифр)
    // =============================================
    function animateCounters() {
        const statItems = document.querySelectorAll('#about ul li');
        // Для каждого элемента с цифрой можно анимировать
        // Здесь оставляем как простой пример
    }
    
    // Вызываем при загрузке
    animateCounters();

    // =============================================
    // 13. ЗАЩИТА ОТ СПАМА В ФОРМЕ (простая)
    // =============================================
    // Добавляем скрытое поле honeypot
    const form = document.querySelector('#contacts form');
    if (form) {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'hp';
        honeypot.style.display = 'none';
        honeypot.setAttribute('aria-hidden', 'true');
        form.appendChild(honeypot);
        
        // При отправке проверяем honeypot
        form.addEventListener('submit', function(e) {
            const hp = this.querySelector('input[name="hp"]');
            if (hp && hp.value !== '') {
                e.preventDefault();
                // Если заполнено — блокируем отправку (бот)
                return false;
            }
        });
    }

    // =============================================
    // 14. КОНСОЛЬНОЕ ПРИВЕТСТВИЕ (для разработчиков)
    // =============================================
    console.log('%c✨ Анастасия | Дизайн интерьеров', 'font-size: 20px; font-weight: bold; color: #a67c6b;');
    console.log('%cСайт-портфолио загружен успешно!', 'font-size: 14px; color: #4a403b;');
    console.log('%c📧 anastasia@interior.ru', 'font-size: 12px; color: #888;');

    console.log('🎯 Код готов к работе!');
});

// =============================================
// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ (для отладки)
// =============================================

// Функция для отладки (можно вызвать в консоли)
function debugSite() {
    console.log('=== ДЕБАГ САЙТА ===');
    console.log('Секции:', document.querySelectorAll('section[id]').length);
    console.log('Изображения:', document.querySelectorAll('img').length);
    console.log('Ссылки в меню:', document.querySelectorAll('nav a').length);
    console.log('Форма:', document.querySelector('#contacts form') ? '✅ есть' : '❌ нет');
    console.log('Кнопка "Наверх":', document.querySelector('.scroll-top-btn') ? '✅ есть' : '❌ нет');
    console.log('===================');
}

// Доступ к функции из консоли
window.debugSite = debugSite;

// =============================================
// ПОЛЕЗНЫЕ СНИППЕТЫ ДЛЯ РАСШИРЕНИЯ (закомментированы)
// =============================================

/*
// Пример: Получение данных формы и отправка на сервер
function sendFormData(name, email, phone, message) {
    const data = { name, email, phone, message };
    
    fetch('/api/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Успешно отправлено:', data);
        showNotification('Сообщение отправлено!', 'success');
    })
    .catch(error => {
        console.error('Ошибка:', error);
        showNotification('Произошла ошибка. Попробуйте позже.', 'error');
    });
}

// Пример: Загрузка проектов из JSON
function loadProjects() {
    fetch('/api/projects')
        .then(response => response.json())
        .then(projects => {
            // Отобразить проекты на странице
        });
}
*/
