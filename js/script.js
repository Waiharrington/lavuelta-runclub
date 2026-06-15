// FAQ Accordion V2
document.addEventListener('DOMContentLoaded', () => {
    const faqBtns = document.querySelectorAll('.faq-btn');

    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            
            // Toggle active state
            btn.classList.toggle('active');

            // Handle slide down/up
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }

            // Close others
            faqBtns.forEach(otherBtn => {
                if (otherBtn !== btn && otherBtn.classList.contains('active')) {
                    otherBtn.classList.remove('active');
                    otherBtn.nextElementSibling.style.maxHeight = null;
                }
            });
        });
    });

    // Force video autoplay on mobile devices
    const video = document.querySelector('.manifesto-video');
    if (video) {
        const playVideo = () => {
            video.play().catch(error => {
                console.log("Autoplay was prevented by browser, waiting for user interaction:", error);
            });
        };

        // Try playing immediately
        playVideo();

        // Fallback for strict mobile policies: play on first interaction
        document.body.addEventListener('touchstart', playVideo, { once: true });
        document.body.addEventListener('click', playVideo, { once: true });
    }

    // Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Custom observer for the Race Bib to stagger it on scroll
    const raceBib = document.querySelector('.race-bib');
    if (raceBib) {
        const bibObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px" // Trigger when it enters 40px inside viewport
        });
        bibObserver.observe(raceBib);
    }

    // --- Scrollytelling, Header & Parallax Effects ---
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                // 1. Header Shrink & Blur
                if (header) {
                    if (scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }

                // 2. Active Link Highlight (Scrollspy)
                let currentSectionId = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 120; // offset for fixed header
                    const sectionHeight = section.offsetHeight;
                    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                        currentSectionId = section.getAttribute('id');
                    }
                });

                if (currentSectionId) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentSectionId}`) {
                            link.classList.add('active');
                        }
                    });
                } else if (scrollY < 200) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#') {
                            link.classList.add('active');
                        }
                    });
                }

                // 3. Hero Parallax (Move background down, fade text)
                const heroBg = document.querySelector('.hero-background');
                const heroContent = document.querySelector('.hero-content');
                if (heroBg && scrollY <= windowHeight) {
                    heroBg.dataset.scrollY = scrollY;
                    applyHeroBgTransform();
                    
                    if (heroContent) {
                        heroContent.style.opacity = Math.max(0, 1 - (scrollY / (windowHeight * 0.7)));
                        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                    }
                }

                // 4. Stamp Scroll Rotation
                const stamp = document.querySelector('.stamp-wrap');
                if (stamp) {
                    stamp.style.transform = `rotate(${scrollY * 0.2}deg)`;
                }

                // 5. Crew Background Parallax
                const crewSection = document.querySelector('.the-crew');
                if (crewSection) {
                    const rect = crewSection.getBoundingClientRect();
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
                        const offset = scrollPercent * 60;
                        crewSection.style.backgroundPosition = `center calc(50% + ${offset}px)`;
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    }

    // Hero Background Entrance & Scroll Exit handler
    const heroBg = document.querySelector('.hero-background');
    if (heroBg) {
        heroBg.dataset.scrollY = 0;

        // Trigger entrance transition on load
        setTimeout(() => {
            heroBg.classList.add('entrance-transition');
            heroBg.classList.add('loaded');
        }, 100);
    }

    function applyHeroBgTransform() {
        if (!heroBg) return;
        const scrollY = parseFloat(heroBg.dataset.scrollY || 0);

        if (scrollY > 0) {
            // Remove transition class so scroll updates instantly without transition delay
            heroBg.classList.remove('entrance-transition');

            const fadePercent = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.85)));
            const translateY = scrollY * 0.35;

            heroBg.style.transform = `translate3d(0, ${translateY}px, 0) scale(1)`;
            heroBg.style.opacity = fadePercent;
        } else {
            // Restore initial CSS loaded state at top scroll
            if (heroBg.classList.contains('loaded')) {
                heroBg.style.transform = '';
                heroBg.style.opacity = '';
            }
        }
    }

    // Mobile Navigation Drawer Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const headerNav = document.querySelector('.header-nav');

    if (mobileNavToggle && headerNav) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            headerNav.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                headerNav.classList.remove('active');
            });
        });
    }

    // Initialize scrollytelling on load and scroll
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); 

    // Botón Volver Arriba
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Founders Horizontal Scroll Pin System (Physics Engine) ---
    const foundersGrid = document.querySelector('.founders-grid');
    const scrollTrack = document.querySelector('.founders-scroll-track');
    const foundersSection = document.getElementById('founders');

    if (foundersGrid && scrollTrack && foundersSection) {
        let currentTranslate = 0;
        let targetTranslate = 0;
        let isScrolling = false;

        let containerWidth = 0;
        let gridScrollWidth = 0;
        let maxMove = 0;
        let trackHeight = 0;
        let scrollRange = 0;
        let trackOffsetTop = 0;

        const getRealGridWidth = () => {
            const items = foundersGrid.querySelectorAll('.founder-card');
            if (items.length === 0) return foundersGrid.scrollWidth;
            
            const itemWidth = items[0].offsetWidth;
            const computedStyle = window.getComputedStyle(foundersGrid);
            const gap = parseFloat(computedStyle.gap) || 0;
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
            const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
            
            return (items.length * itemWidth) + ((items.length - 1) * gap) + paddingLeft + paddingRight;
        };

        const recalculateLayout = () => {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) {
                // Reset on desktop
                foundersGrid.style.removeProperty('--carousel-translate');
                currentTranslate = 0;
                targetTranslate = 0;
                return;
            }

            const headerOffset = 75;
            containerWidth = foundersSection.clientWidth;
            gridScrollWidth = getRealGridWidth();
            maxMove = Math.max(gridScrollWidth - containerWidth, 0);
            trackHeight = scrollTrack.clientHeight;
            
            const sectionHeight = foundersSection.clientHeight;
            scrollRange = Math.max(trackHeight - sectionHeight, 0);
            
            const rect = scrollTrack.getBoundingClientRect();
            trackOffsetTop = rect.top + window.scrollY - headerOffset;
        };

        // Recalculate layout initially
        recalculateLayout();

        const tick = () => {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) return;

            const lerpFactor = 0.12; // Buttery smooth horizontal LERP factor matching Epotech mobile
            currentTranslate += (targetTranslate - currentTranslate) * lerpFactor;

            foundersGrid.style.setProperty('--carousel-translate', `${currentTranslate}px`);

            if (Math.abs(targetTranslate - currentTranslate) > 0.05) {
                requestAnimationFrame(tick);
            } else {
                currentTranslate = targetTranslate;
                foundersGrid.style.setProperty('--carousel-translate', `${currentTranslate}px`);
                isScrolling = false;
            }
        };

        const updateScrollTranslation = () => {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) return;
            if (scrollRange <= 0) return;

            const scrolledPast = window.scrollY - trackOffsetTop;
            let progressRaw = scrolledPast / scrollRange;
            progressRaw = Math.min(Math.max(progressRaw, 0), 1);

            // Epotech LERP mapping: starts after 5%, reaches end at 92% of scroll track
            const endZone = 0.92;
            let progress = 0;
            if (progressRaw < 0.05) {
                progress = 0;
            } else if (progressRaw > endZone) {
                progress = 1;
            } else {
                progress = (progressRaw - 0.05) / (endZone - 0.05);
            }

            targetTranslate = -progress * maxMove;

            if (progressRaw >= 0.99) {
                currentTranslate = targetTranslate;
                foundersGrid.style.setProperty('--carousel-translate', `${currentTranslate}px`);
            }

            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(tick);
            }
        };

        window.addEventListener('scroll', updateScrollTranslation, { passive: true });
        window.addEventListener('resize', () => {
            recalculateLayout();
            updateScrollTranslation();
        });

        // Trigger on load
        setTimeout(() => {
            recalculateLayout();
            updateScrollTranslation();
        }, 150);
    }
});
