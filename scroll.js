gsap.registerPlugin(ScrollTrigger);

const books = gsap.utils.toArray(".book");
const titles = gsap.utils.toArray(".heroT");
const totalSteps = books.length;

// Начальное состояние: книги сложены стопкой с 3D-перспективой
books.forEach((book, i) => {
    gsap.set(book, {
        zIndex: totalSteps - i,
        scale: 1 - i * 0.05,
        y: i * -50, // Увеличиваем смещение для более выраженного 3D
        rotationX: i * -15, // Наклоняем для 3D
        opacity: i === 0 ? 1 : 0.7,
        transformOrigin: "center 70%" // Точка трансформации чуть ниже центра
    });
});

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: `+=${totalSteps * 600}`, // Уменьшаем длину скролла для динамичности
        scrub: 1,
        pin: true,
        snap: {
            snapTo: 1 / (totalSteps - 1), // Привязка к шагам (книгам)
            duration: { min: 0.2, max: 0.4 }, // Скорость "пружинки"
            delay: 0.1, // Пауза перед срабатыванием (чтобы не дергалось при активном скролле)
            ease: "power2.inOut" // Плавность движения
        }
    }
});

titles.forEach((title, i) => {
    // Появление заголовка
    tl.to(title, { opacity: 1, y: -20, duration: 0.5 }, i);

    if (i < totalSteps - 1) {
        // Уход текущей книги: "улетает" с вращением
        tl.to(books[i], {
            y: "-=100",
            opacity: 0,
            scale: 0.4,
            rotationX: 45,
            rotationZ: -10,
            duration: 0.75,
            ease: "power2.in"
        }, i + 0.5);

        tl.to(title, { opacity: 0, y: -40, duration: 0.5 }, i + 0.5);

        // Приход следующей книги: занимает центральное место
        tl.to(books[i + 1], {
            y: 0,
            rotationX: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, i + 0.5);
    }
});

// --- Manifest Section Scroll Animation ---
const manifestSection = document.querySelector('.manifest');
if (manifestSection) {
    const stats = gsap.utils.toArray('.stat-item');

    const manifestTl = gsap.timeline({
        scrollTrigger: {
            trigger: manifestSection,
            start: "center center",
            end: "+=120%", // Scroll distance
            scrub: 1,
            pin: true,
            snap: {
                snapTo: 1 / stats.length, // Привязка к каждому элементу статистики
                duration: { min: 0.2, max: 0.4 },
                delay: 0.1,
                ease: "power2.inOut"
            }
        }
    });

    // Animate each stat item sequentially
    stats.forEach((stat, index) => {
        manifestTl.to(stat, {
            opacity: 1,
            y: 0,
            ease: 'power2.out'
        }, index * 0.3); // Stagger the animations
    });
}

// Анимация Bento Grid
const frontendBento = document.querySelector(".frontend-bento");
if (frontendBento) {
    ScrollTrigger.create({
        trigger: frontendBento,
        start: "top 80%",
        onEnter: () => {
            const mode = frontendBento.querySelector(".mode-value");
            mode.textContent = "DEV";
            mode.style.color = "#a855f7";
            gsap.to(".tech", { opacity: 1, y: 0, stagger: 0.1 });
        }
    });
}

// --- Новые фичи ---

// 1. Scroll Progress Bar
gsap.to(".scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3
    }
});

// 2. Custom Cursor Logic
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

// Проверяем, что это не тач-устройство
if (window.matchMedia("(pointer: fine)").matches) {
    const moveCursorX = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3" });
    const moveCursorY = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3" });
    const moveOutlineX = gsap.quickTo(cursorOutline, "x", { duration: 0.2, ease: "power3" });
    const moveOutlineY = gsap.quickTo(cursorOutline, "y", { duration: 0.2, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
        moveCursorX(e.clientX);
        moveCursorY(e.clientY);
        moveOutlineX(e.clientX);
        moveOutlineY(e.clientY);
    });

    // Эффект при наведении на активные элементы
    const interactiveElements = document.querySelectorAll("a, button, .bento-item, .language-card");

    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(cursorOutline, {
                width: 60,
                height: 60,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "transparent",
                duration: 0.3
            });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(cursorOutline, {
                width: 40,
                height: 40,
                backgroundColor: "transparent",
                borderColor: "rgba(255, 255, 255, 0.5)",
                duration: 0.3
            });
        });
    });
}

// Скрываем индикатор скролла при начале прокрутки
gsap.to(".scroll-indicator", {
    opacity: 0,
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "10% top", // Исчезнет быстро
        scrub: true
    }
});
