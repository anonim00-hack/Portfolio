gsap.registerPlugin(ScrollTrigger);

const books = gsap.utils.toArray(".book");
const titles = gsap.utils.toArray(".heroT");
const totalSteps = books.length;

// Начальное состояние: все скрыты, кроме первого
books.forEach((book, i) => {
    gsap.set(book, {
        xPercent: i * 100, // Располагаем в ряд
        scale: i === 0 ? 1 : 0.7,
        opacity: i === 0 ? 1 : 0,
        zIndex: totalSteps - i
    });
});

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: `+=${totalSteps * 800}`,
        scrub: 1,
        pin: true,
        snap: 1 / (totalSteps - 1)
    }
});

titles.forEach((title, i) => {
    // Появление заголовка
    tl.to(title, { opacity: 1, y: -20, duration: 0.5 }, i);

    if (i < totalSteps - 1) {
        // Уход текущей книги и заголовка
        tl.to(books[i], {
            xPercent: -100,
            scale: 0.7,
            opacity: 0,
            rotateY: -20,
            duration: 1
        }, i + 0.5);

        tl.to(title, { opacity: 0, y: -40, duration: 0.5 }, i + 0.5);

        // Приход следующей книги
        tl.fromTo(books[i + 1],
            { xPercent: 100, opacity: 0, scale: 0.7 },
            { xPercent: 0, opacity: 1, scale: 1, duration: 1 },
            i + 0.5
        );
    }
});

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

const widget = document.querySelector('.tech-stack-widget');
const items = document.querySelectorAll('.tech-item');

items.forEach((item, i) => {
    const angle = (i / items.length) * Math.PI * 2;
    const x = Math.cos(angle) * 40;
    const y = Math.sin(angle) * 40;
    gsap.set(item, { x, y, scale: 0.8, opacity: 0.6 });
});

gsap.to(widget, {
    y: "-=15",
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

widget.addEventListener('mouseenter', () => {
    items.forEach((item, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const x = Math.cos(angle) * 80;
        const y = Math.sin(angle) * 80;
        gsap.to(item, {
            x, y,
            scale: 1.1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            backgroundColor: "rgba(168, 85, 247, 0.4)"
        });
    });
    gsap.to('.tech-pill', { scale: 0.9, duration: 0.3 });
});

widget.addEventListener('mouseleave', () => {
    items.forEach((item, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const x = Math.cos(angle) * 40;
        const y = Math.sin(angle) * 40;
        gsap.to(item, {
            x, y,
            scale: 0.8,
            opacity: 0.6,
            duration: 0.5,
            ease: "power2.inOut",
            backgroundColor: "rgba(255, 255, 255, 0.03)"
        });
    });
    gsap.to('.tech-pill', { scale: 1, duration: 0.3 });
});

widget.addEventListener('mousemove', (e) => {
    const rect = widget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(widget, {
        rotateY: x * 0.5,
        rotateX: -y * 0.5,
        duration: 0.2
    });
});

