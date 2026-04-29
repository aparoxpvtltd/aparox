import './style.css'
import * as THREE from 'three';

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

    // 5.5 Global Scrollytelling 3D Background - Neural Vortex
    const initGlobal3DScrollSync = () => {
        const canvas = document.getElementById('global-3d-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.005); // Lighter fog for deeper view

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 200, 0); // Start high up

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const vortexGroup = new THREE.Group();
        scene.add(vortexGroup);

        // Instanced Cubes Vortex
        const instanceCount = 3000;
        const geom = new THREE.OctahedronGeometry(1.5, 0);
        const mat = new THREE.MeshBasicMaterial({ 
            color: 0x818cf8, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });

        const instancedMesh = new THREE.InstancedMesh(geom, mat, instanceCount);
        vortexGroup.add(instancedMesh);

        const dummy = new THREE.Object3D();
        const instanceData = [];

        // Distribute in a spiral/vortex along the Y axis
        // We will fly down the Y axis from 200 to -400
        for(let i=0; i<instanceCount; i++) {
            const y = (Math.random() - 0.5) * 800; 
            const radius = 15 + Math.random() * 40; 
            const angle = y * 0.02 + Math.random() * Math.PI * 2;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            dummy.position.set(x, y, z);
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            
            const s = Math.random() * 2 + 0.5;
            dummy.scale.set(s, s, s);

            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);

            instanceData.push({ 
                rx: (Math.random() - 0.5) * 0.05, 
                ry: (Math.random() - 0.5) * 0.05 
            });
        }

        // Glowing Dust
        const dustGeom = new THREE.BufferGeometry();
        const dustPos = new Float32Array(instanceCount * 3);
        for(let i=0; i<instanceCount * 3; i+=3) {
            const y = (Math.random() - 0.5) * 800;
            const radius = Math.random() * 20; 
            const angle = Math.random() * Math.PI * 2;
            dustPos[i] = Math.cos(angle) * radius;
            dustPos[i+1] = y;
            dustPos[i+2] = Math.sin(angle) * radius;
        }
        dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({ 
            color: 0xc084fc, 
            size: 0.8, 
            transparent: true, 
            opacity: 0.6, 
            blending: THREE.AdditiveBlending 
        });
        const dustPoints = new THREE.Points(dustGeom, dustMat);
        vortexGroup.add(dustPoints);

        // Scroll and Mouse sync
        let scrollY = window.scrollY;
        let mouseX = 0; 
        let mouseY = 0;

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();
        
        // Ensure instanced mesh gets updated
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        const animateAll = () => {
            const time = clock.getElapsedTime();

            // Calculate scroll percentage
            const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
            const scrollRatio = Math.min(1, Math.max(0, scrollY / maxScroll));
            
            // Map scroll ratio (0 to 1) to camera Y position (200 down to -400)
            const targetY = 200 - (scrollRatio * 600); 
            camera.position.y += (targetY - camera.position.y) * 0.1;

            // Rotate the entire vortex slowly
            vortexGroup.rotation.y = time * 0.1;

            // Animate instances
            for(let i = 0; i < instanceCount; i++) {
                instancedMesh.getMatrixAt(i, dummy.matrix);
                dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
                
                dummy.rotation.x += instanceData[i].rx;
                dummy.rotation.y += instanceData[i].ry;
                
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;

            // Subtle camera movement based on scroll ratio to make path feel curved
            camera.position.x = Math.sin(scrollRatio * Math.PI * 2) * 8;
            camera.position.z = Math.cos(scrollRatio * Math.PI * 2) * 8;

            // Mouse Interaction
            camera.position.x += mouseX * 5;
            camera.position.z += mouseY * 5;

            // Look down the tunnel
            camera.lookAt(0, camera.position.y - 100, 0);

            renderer.render(scene, camera);
            requestAnimationFrame(animateAll);
        };

        animateAll();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    initGlobal3DScrollSync();
    
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
                // Generate Mock Data
                const mockTAM = Math.floor(Math.random() * (5000000 - 500000 + 1)) + 500000;
                const mockCustomers = Math.floor(Math.random() * (5000 - 300 + 1)) + 300;
                const mockProfit = Math.floor(Math.random() * (150000 - 20000 + 1)) + 20000;
                
                // Format Currency and Numbers
                const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
                const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);
                
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
});
