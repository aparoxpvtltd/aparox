import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    // 0. Remove Spline Watermark (More aggressive version)
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        const interval = setInterval(() => {
            const shadowRoot = splineViewer.shadowRoot;
            if (shadowRoot) {
                // Try removing elements directly
                const logo = shadowRoot.getElementById('logo') || 
                             shadowRoot.querySelector('a[href*="spline.design"]') || 
                             shadowRoot.querySelector('[class*="logo"]') ||
                             shadowRoot.querySelector('a[href*="spline"]');
                if (logo) {
                    logo.remove();
                }
                
                // Inject style element to hide watermark / logo elements
                if (!shadowRoot.querySelector('#anti-watermark-style')) {
                    const style = document.createElement('style');
                    style.id = 'anti-watermark-style';
                    style.textContent = `
                        #logo, .logo, a[href*="spline.design"], a[href*="spline"], #spline-logo, [class*="watermark"] {
                            display: none !important;
                            visibility: hidden !important;
                            opacity: 0 !important;
                            pointer-events: none !important;
                        }
                    `;
                    shadowRoot.appendChild(style);
                }
            }
        }, 100);
        // Keep running for 10 seconds to ensure it stays hidden
        setTimeout(() => clearInterval(interval), 10000);

        // Pause/Hide Spline rendering when hero is not in viewport to optimize GPU load
        const splineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    splineViewer.style.display = 'block';
                } else {
                    splineViewer.style.display = 'none';
                }
            });
        }, { threshold: 0 });
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            splineObserver.observe(heroSection);
            
            // Disable Zoom on Scroll in Hero section Spline model
            heroSection.addEventListener('wheel', (e) => {
                e.stopPropagation();
            }, { capture: true });
        }
    }

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
    window.activeServiceIndex = 0;

    accordionItems.forEach((item, index) => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close others
            accordionItems.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
                window.activeServiceIndex = index;
            } else {
                item.classList.add('active');
                window.activeServiceIndex = index;
            }
        });
    });

    // 3. Scroll Handling for Header (Optimized with requestAnimationFrame and CSS transitions)
    const header = document.querySelector('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    let scrollTicking = false;

    const updateHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateHeader);
            scrollTicking = true;
        }
    }, { passive: true });

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

    // init3DBackground(); // Disabled in favor of Spline 3D background


    
    // 6. Gemini API Integration
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
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
                <div class="ai-avatar"><img src="/logo.png" alt="Aparox AI" class="avatar-logo">Aparox</div>
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
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>SENDING...</span>';
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#818cf8';

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon')) {
                // Fallback to mailto link if Supabase is not configured yet
                console.warn('Supabase keys not configured in .env. Falling back to mailto.');
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
                return;
            }

            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': supabaseAnonKey,
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = '#10b981'; // Success Green
                    submitBtn.innerHTML = '<span>SENT</span>';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to send message.');
                }
            } catch (error) {
                console.error(error);
                formStatus.textContent = `Error: ${error.message}`;
                formStatus.style.color = '#ef4444'; // Error Red
                submitBtn.innerHTML = '<span>TRY AGAIN</span>';
            } finally {
                setTimeout(() => {
                    formStatus.textContent = '';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>SEND MESSAGE</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>';
                }, 4000);
            }
        });
    }
    // 9. Business Analytics Tool Logic (Mock Scraper)
    const analyticsForm = document.getElementById('analytics-form');
    const analyzeBtn = document.querySelector('.analyze-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const analyticsResults = document.getElementById('analytics-results');
    
    if (analyticsForm) {
        analyticsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const bizName = document.getElementById('biz-name').value;
            const bizLocation = document.getElementById('biz-location').value;
            
            if(!bizName || !bizLocation) return;
            
            // Loading State
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            analyzeBtn.disabled = true;
            analyticsResults.style.display = 'none';
            
            // Mock Scraper Delay
            setTimeout(() => {
                // Generate Mock Data (INR Rupee equivalents)
                const mockTAM = Math.floor(Math.random() * (50000000 - 5000000 + 1)) + 5000000; // ₹50 Lakh to ₹5 Crore
                const mockCustomers = Math.floor(Math.random() * (10000 - 500 + 1)) + 500; // 500 to 10000 customers
                const mockProfit = Math.floor(Math.random() * (2500000 - 200000 + 1)) + 200000; // ₹2 Lakh to ₹25 Lakh
                
                // Format Currency (INR) and Numbers
                const formatCurrency = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
                const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);
                
                // Populate DOM
                document.getElementById('result-biz-name').textContent = `Target: ${bizName} (${bizLocation})`;
                document.getElementById('stat-tam').textContent = formatCurrency(mockTAM);
                document.getElementById('stat-customers').textContent = formatNumber(mockCustomers);
                document.getElementById('stat-profit').textContent = formatCurrency(mockProfit);
                
                // Reset Button & Show Results
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                analyzeBtn.disabled = false;
                analyticsResults.style.display = 'block';
                
            }, 2500);
        });
    }

    // A. About Section: Interactive Neural Network Canvas
    const initNetworkCanvas = () => {
        const canvas = document.getElementById('about-network-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.clientWidth;
        let height = canvas.height = canvas.parentElement.clientHeight;

        let active = true;
        const particles = [];
        const particleCount = 45;
        const connectionDistance = 100;
        const mouse = { x: null, y: null, radius: 120 };

        // Handle Resize
        const resize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener('resize', resize);

        // Track Mouse
        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                // Pull toward mouse slightly if close
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.vx += (dx / dist) * force * 0.05;
                        this.vy += (dy / dist) * force * 0.05;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                // Friction
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Re-add small random impulses to keep them moving
                if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
                    this.vx += (Math.random() - 0.5) * 0.2;
                    this.vy += (Math.random() - 0.5) * 0.2;
                }

                // Boundary Bounce
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                this.x = Math.max(0, Math.min(width, this.x));
                this.y = Math.max(0, Math.min(height, this.y));
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(129, 140, 248, 0.7)'; // Indigo light
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // IntersectionObserver to pause rendering when canvas is not visible
        const obs = new IntersectionObserver((entries) => {
            active = entries[0].isIntersecting;
        }, { threshold: 0 });
        obs.observe(canvas);

        // Animation Loop
        const animate = () => {
            if (active) {
                ctx.clearRect(0, 0, width, height);

                // Draw connections
                for (let i = 0; i < particles.length; i++) {
                    const p1 = particles[i];
                    p1.update();
                    p1.draw();

                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < connectionDistance) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            // Fade out lines as they get further apart
                            const alpha = (1 - dist / connectionDistance) * 0.15;
                            ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`; // Purple light
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }

                    // Mouse connections
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = p1.x - mouse.x;
                        const dy = p1.y - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < mouse.radius) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(mouse.x, mouse.y);
                            const alpha = (1 - dist / mouse.radius) * 0.25;
                            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                }
            }
            requestAnimationFrame(animate);
        };

        animate();
    };

    // B. About Section: Stat Counter Animations
    const initStatCounters = () => {
        const statsSection = document.querySelector('.about-stats-grid');
        if (!statsSection) return;

        const statNumbers = document.querySelectorAll('.stat-number');
        let animated = false;

        const animateStats = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'), 10);
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    
                    // Ease out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.floor(easeProgress * target);
                    
                    stat.textContent = currentVal;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target; // Ensure exact final value
                    }
                };

                requestAnimationFrame(updateCount);
            });
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animateStats();
                animated = true;
            }
        }, { threshold: 0.2 });

        observer.observe(statsSection);
    };

    // C. Services Section: Dynamic Visualizer Canvas
    const initServicesCanvas = () => {
        const canvas = document.getElementById('services-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.clientWidth;
        let height = canvas.height = canvas.parentElement.clientHeight;

        let active = true;
        let transitionProgress = 1.0;
        let lastServiceIndex = 0;

        // Resize handler
        const resize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener('resize', resize);

        // Visibility observer
        const obs = new IntersectionObserver((entries) => {
            active = entries[0].isIntersecting;
        }, { threshold: 0 });
        obs.observe(canvas);

        // Particle systems for the visualizers
        // 1. Radar scan particles
        const radarPoints = [];
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 0.7 + 0.1; // Relative to radius
            radarPoints.push({
                angle,
                distance,
                size: Math.random() * 3 + 1.5,
                intensity: Math.random()
            });
        }

        // 2. Circuit particles
        const circuitTracks = [];
        const trackCount = 8;
        for (let i = 0; i < trackCount; i++) {
            const isHorizontal = Math.random() > 0.5;
            const pos = Math.random() * 0.7 + 0.15; // 15% to 85%
            circuitTracks.push({
                isHorizontal,
                pos,
                speed: (Math.random() * 0.5 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
                packets: [
                    { progress: Math.random(), len: Math.random() * 25 + 10 },
                    { progress: Math.random() - 0.4, len: Math.random() * 25 + 10 }
                ]
            });
        }

        // 3. Funnel particles
        const funnelParticles = [];
        const funnelParticleCount = 30;
        for (let i = 0; i < funnelParticleCount; i++) {
            funnelParticles.push({
                y: Math.random(), // 0 to 1 progress
                xAngle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.005 + 0.002,
                size: Math.random() * 2 + 1,
                color: Math.random() > 0.4 ? 'rgba(129, 140, 248, 0.8)' : 'rgba(192, 132, 252, 0.8)'
            });
        }

        let radarAngle = 0;

        // Draw functions
        const drawRadar = (alpha) => {
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.min(width, height) * 0.35;

            ctx.strokeStyle = `rgba(129, 140, 248, ${0.1 * alpha})`;
            ctx.lineWidth = 1;

            // Concentric circles
            for (let r = 1; r <= 4; r++) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, maxRadius * (r / 4), 0, Math.PI * 2);
                ctx.stroke();
            }

            // Cross lines
            ctx.beginPath();
            ctx.moveTo(centerX - maxRadius, centerY);
            ctx.lineTo(centerX + maxRadius, centerY);
            ctx.moveTo(centerX, centerY - maxRadius);
            ctx.lineTo(centerX, centerY + maxRadius);
            ctx.stroke();

            // Radar sweep
            radarAngle += 0.01;
            const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
            grad.addColorStop(0, `rgba(67, 56, 202, 0)`);
            grad.addColorStop(1, `rgba(67, 56, 202, ${0.12 * alpha})`);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, maxRadius, radarAngle - 0.6, radarAngle);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Sweep indicator line
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.5 * alpha})`;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(radarAngle) * maxRadius, centerY + Math.sin(radarAngle) * maxRadius);
            ctx.stroke();

            // Data Points
            radarPoints.forEach(p => {
                const px = centerX + Math.cos(p.angle) * p.distance * maxRadius;
                const py = centerY + Math.sin(p.angle) * p.distance * maxRadius;

                let angleDiff = (radarAngle - p.angle) % (Math.PI * 2);
                if (angleDiff < 0) angleDiff += Math.PI * 2;

                let opacity = 0;
                if (angleDiff < 1.5) {
                    opacity = (1.5 - angleDiff) / 1.5;
                } else {
                    opacity = 0.05;
                }

                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(192, 132, 252, ${opacity * alpha})`;
                ctx.fill();

                if (opacity > 0.6) {
                    ctx.beginPath();
                    ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(192, 132, 252, ${(opacity - 0.6) * 0.3 * alpha})`;
                    ctx.stroke();
                }
            });
        };

        const drawCircuit = (alpha) => {
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.08 * alpha})`;
            ctx.lineWidth = 1;

            // Draw grid tracks
            circuitTracks.forEach(t => {
                ctx.beginPath();
                if (t.isHorizontal) {
                    const y = t.pos * height;
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                } else {
                    const x = t.pos * width;
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                }
                ctx.stroke();
            });

            // Draw packets
            circuitTracks.forEach(t => {
                t.packets.forEach(p => {
                    p.progress += Math.abs(t.speed) * 0.003;
                    if (p.progress > 1) {
                        p.progress = -0.1;
                    }

                    const progressVal = Math.max(0, Math.min(1, p.progress));
                    
                    ctx.beginPath();
                    if (t.isHorizontal) {
                        const y = t.pos * height;
                        const x = progressVal * width;
                        const grad = ctx.createLinearGradient(Math.max(0, x - p.len), y, x, y);
                        grad.addColorStop(0, 'rgba(192, 132, 252, 0)');
                        grad.addColorStop(1, `rgba(192, 132, 252, ${0.7 * alpha})`);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 2;
                        ctx.moveTo(Math.max(0, x - p.len), y);
                        ctx.lineTo(x, y);
                        ctx.stroke();

                        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        const x = t.pos * width;
                        const y = progressVal * height;
                        const grad = ctx.createLinearGradient(x, Math.max(0, y - p.len), x, y);
                        grad.addColorStop(0, 'rgba(129, 140, 248, 0)');
                        grad.addColorStop(1, `rgba(129, 140, 248, ${0.7 * alpha})`);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 2;
                        ctx.moveTo(x, Math.max(0, y - p.len));
                        ctx.lineTo(x, y);
                        ctx.stroke();

                        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            });
        };

        const drawFunnel = (alpha) => {
            const centerX = width / 2;
            const startY = height * 0.15;
            const endY = height * 0.85;
            const funnelHeight = endY - startY;

            // Draw rings
            const rings = 3;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < rings; i++) {
                const progress = i / (rings - 1);
                const y = startY + progress * funnelHeight;
                const rx = (1 - progress * 0.65) * (width * 0.35);
                const ry = rx * 0.25;

                ctx.strokeStyle = `rgba(129, 140, 248, ${(0.15 + (1 - progress) * 0.15) * alpha})`;
                ctx.beginPath();
                ctx.ellipse(centerX, y, rx, ry, 0, 0, Math.PI * 2);
                ctx.stroke();

                ctx.strokeStyle = `rgba(192, 132, 252, ${0.1 * alpha})`;
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                    ctx.beginPath();
                    ctx.arc(centerX + Math.cos(a) * rx, y + Math.sin(a) * ry, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(192, 132, 252, ${0.3 * alpha})`;
                    ctx.fill();
                }
            }

            // Draw particles
            funnelParticles.forEach(p => {
                p.y += p.speed;
                if (p.y > 1) {
                    p.y = 0;
                    p.xAngle = Math.random() * Math.PI * 2;
                }

                const currentRx = (1 - p.y * 0.65) * (width * 0.35);
                const currentRy = currentRx * 0.25;
                
                const px = centerX + Math.cos(p.xAngle + p.y * 6) * currentRx * 0.85;
                const py = startY + p.y * funnelHeight + Math.sin(p.xAngle + p.y * 6) * currentRy * 0.85;

                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = (1 - p.y * 0.3) * alpha;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            });
        };

        // Render Frame
        const render = () => {
            if (active) {
                ctx.clearRect(0, 0, width, height);

                if (lastServiceIndex !== window.activeServiceIndex) {
                    transitionProgress -= 0.08;
                    if (transitionProgress <= 0) {
                        lastServiceIndex = window.activeServiceIndex;
                        transitionProgress = 0;
                    }
                } else if (transitionProgress < 1.0) {
                    transitionProgress += 0.08;
                }

                const currentAlpha = lastServiceIndex === window.activeServiceIndex ? 1 : transitionProgress;
                const prevAlpha = 1 - currentAlpha;

                // Draw previous visualizer if transitioning out
                if (prevAlpha > 0.01) {
                    if (lastServiceIndex === 0) drawRadar(prevAlpha);
                    else if (lastServiceIndex === 1) drawCircuit(prevAlpha);
                    else if (lastServiceIndex === 2) drawFunnel(prevAlpha);
                }

                // Draw active visualizer
                if (currentAlpha > 0.01) {
                    const visualizerToDraw = lastServiceIndex === window.activeServiceIndex ? lastServiceIndex : window.activeServiceIndex;

                    if (visualizerToDraw === 0) drawRadar(currentAlpha);
                    else if (visualizerToDraw === 1) drawCircuit(currentAlpha);
                    else if (visualizerToDraw === 2) drawFunnel(currentAlpha);
                }
            }
            requestAnimationFrame(render);
        };

        render();
    };

    initNetworkCanvas();
    initStatCounters();
    initServicesCanvas();
});
