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

    // 3. Header background shift on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '1.5rem 4rem';
        } else {
            header.style.padding = '0 4rem';
        }
    });

    // 1. Scroll Handling for Header
    const header = document.querySelector('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            header.classList.toggle('menu-open'); // For CSS targeting
            document.body.classList.toggle('no-scroll');
        });

        // Close menu on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                header.classList.remove('menu-open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // 3. Chat Closure Logic
    const closeChatBtn = document.getElementById('close-chat');
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) heroContent.classList.remove('chat-active');
            
            // Clear thread
            const chatThread = document.getElementById('chat-thread');
            // Remove everything except the close button
            Array.from(chatThread.children).forEach(child => {
                if (!child.classList.contains('close-chat-btn')) child.remove();
            });
        });
    }

    // 4. Smooth Scroll for Nav Links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 5. 3D Tubes Background Initialization
    const init3DBackground = async () => {
        const canvas = document.getElementById('tubes-canvas');
        if (!canvas) return;

        try {
            const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
            const TubesCursor = module.default;

            const app = TubesCursor(canvas, {
                tubes: {
                    colors: ["#4338ca", "#c084fc", "#818cf8"],
                    lights: {
                        intensity: 1500,
                        colors: ["#4338ca", "#c084fc", "#818cf8", "#ffffff"]
                    }
                }
            });

            window.tubesApp = app;

            // Optional: click on hero to randomize
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.addEventListener('click', (e) => {
                    // Only randomize if clicking background, not UI
                    if (e.target.closest('.hero-content') || e.target.closest('#chat-thread')) return;
                    
                    const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                    app.tubes.setColors([randomColor(), randomColor(), randomColor()]);
                    app.tubes.setLightsColors([randomColor(), randomColor(), randomColor(), randomColor()]);
                });
            }

        } catch (error) {
            console.error("Failed to load 3D background:", error);
        }
    };

    init3DBackground();

    // 6. Gemini API Integration
    const API_KEY = 'AIzaSyD6IcMnQPOJXLXCIylcUoHIBMZayVujY4A';
    const textarea = document.querySelector('.search-input-wrapper textarea');
    const sendBtn = document.querySelector('.send-btn');
    const searchContainer = document.querySelector('.search-container');

    const handleGeminiResponse = async () => {
        const prompt = textarea.value.trim();
        if (!prompt) return;

        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.classList.add('chat-active');

        appendMessage('user', prompt);

        sendBtn.disabled = true;
        sendBtn.innerHTML = '<div class="loader-dot"></div>';
        textarea.disabled = true;
        textarea.value = '';
        textarea.style.height = 'auto';

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error?.message || `API Error: ${response.status}`);

            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                appendMessage('ai', data.candidates[0].content.parts[0].text);
            } else {
                throw new Error("Invalid response format.");
            }

        } catch (error) {
            appendMessage('ai', `Neural Core Error: ${error.message}`);
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
            textarea.disabled = false;
            textarea.focus(); // Re-focus after response
        }
    };

    const appendMessage = (role, text) => {
        const chatThread = document.getElementById('chat-thread');
        if (!chatThread) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message message-${role}`;

        if (role === 'user') {
            messageDiv.innerHTML = `<div class="user-content">${text}</div>`;
        } else {
            const formattedText = formatMarkdown(text);
            messageDiv.innerHTML = `
                <div class="ai-avatar">Aparox</div>
                <div class="ai-content">${formattedText}</div>
            `;
        }

        chatThread.appendChild(messageDiv);
        chatThread.scrollTop = chatThread.scrollHeight;
    };

    const formatMarkdown = (text) => {
        return text
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    };

    if (textarea) {
        // Mobile-friendly focus handling
        textarea.addEventListener('touchstart', (e) => {
            textarea.focus();
        });

        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGeminiResponse();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering background click
            handleGeminiResponse();
        });
    }

    // 8. Contact Form Interaction
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>OPENING MAIL CLIENT...</span>';

            // Construct mailto link
            const subject = `Project Inquiry from ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
            const mailtoLink = `mailto:aparoxpvtltd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body).replace(/%0A/g, '%0D%0A')}`;

            setTimeout(() => {
                window.location.href = mailtoLink;
                formStatus.textContent = 'REDIRECTING TO MAIL CLIENT...';
                submitBtn.innerHTML = '<span>SENT</span>';
                
                setTimeout(() => {
                    formStatus.textContent = '';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>SEND MESSAGE</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>';
                    contactForm.reset();
                }, 3000);
            }, 800);
        });
    }
});
