import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('work-item')) {
                    entry.target.classList.add('reveal');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-text, .work-item').forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close others
            accordionItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. Smooth Magnetic Button (Optional subtle effect)
    const initBtn = document.querySelector('.initialize-btn');
    if (initBtn) {
        initBtn.addEventListener('mousemove', (e) => {
            const rect = initBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            initBtn.style.transform = `translate(calc(-50% + ${x * 0.2}px), calc(-50% + ${y * 0.2}px)) scale(1.02)`;
        });

        initBtn.addEventListener('mouseleave', () => {
            initBtn.style.transform = `translate(-50%, -50%) scale(1)`;
        });
    }

    // 4. Header background shift on scroll (optional, but mix-blend handles visibility)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '1.5rem 4rem';
        } else {
            header.style.padding = '0 4rem';
        }
    });
});
