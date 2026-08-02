document.addEventListener("DOMContentLoaded", () => {
    // 1. Loading Screen
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500);
        }, 1000); // 1s simulation
    }

    // 2. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // 3. Dark Mode Toggle
    const toggleBtn = document.getElementById("darkModeToggle");
    const htmlElement = document.documentElement;
    
    // Check local storage for preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        htmlElement.setAttribute('data-bs-theme', currentTheme);
        if (toggleBtn) {
            toggleBtn.innerHTML = currentTheme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            let theme = htmlElement.getAttribute('data-bs-theme');
            if (theme === 'dark') {
                htmlElement.setAttribute('data-bs-theme', 'light');
                localStorage.setItem('theme', 'light');
                toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
            } else {
                htmlElement.setAttribute('data-bs-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
            }
        });
    }

    // 4. Sticky Navbar & Back to Top
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }

        if (window.scrollY > 300) {
            if(backToTopBtn) backToTopBtn.classList.add('show');
        } else {
            if(backToTopBtn) backToTopBtn.classList.remove('show');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            
            // Check if element is in viewport
            const rect = counter.getBoundingClientRect();
            if(rect.top < window.innerHeight && counter.innerText == "0") {
                updateCount();
            }
        });
    }
    
    if (counters.length > 0) {
        window.addEventListener('scroll', animateCounters);
        animateCounters(); // Initial check
    }

    // 5.5 Progress Bar Animation
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-target-width');
                    
                    if (targetWidth && !bar.classList.contains('animated')) {
                        bar.classList.add('animated');
                        
                        // Set basic smooth transition
                        bar.style.transition = 'width 0.5s ease-in-out';
                        
                        // Step 1: Simulate scanning up
                        setTimeout(() => {
                            bar.style.width = '85%';
                        }, 50);
                        
                        // Step 2: Simulate scanning down
                        setTimeout(() => {
                            bar.style.width = '15%';
                        }, 550);
                        
                        // Step 3: Settle smoothly at accurate data
                        setTimeout(() => {
                            bar.style.transition = 'width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
                            bar.style.width = targetWidth;
                        }, 1050);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    // 6. Dynamic Gallery Rendering & Lightbox
    const marqueeWrapper = document.querySelector('.marquee-wrapper');
    const gridContainer = document.getElementById('gallery-grid-container');
    const viewAllBtnContainer = document.getElementById('view-all-gallery-btn-wrapper');

    function renderGallery(data) {
        if (!data || data.length === 0 || !marqueeWrapper) return;

        // Tentukan jumlah baris marquee (3 baris jika foto > 12 agar animasi berjalan lebih seimbang dan cepat)
        const numRows = data.length > 12 ? 3 : 2;

        // Distribusikan gambar secara berselang-seling (interleaved)
        // Agar gambar-gambar terbaru (seperti g15 - g23) tersebar merata di seluruh baris marquee
        const rowsData = Array.from({ length: numRows }, () => []);
        data.forEach((item, index) => {
            rowsData[index % numRows].push(item);
        });

        const buildSetHTML = (items) => {
            return items.map(item => {
                const src = typeof item === 'string' ? item : item.src;
                const title = (typeof item === 'object' && item.title) ? item.title : 'Dokumentasi';
                const caption = (typeof item === 'object' && item.caption) ? item.caption : 'Kegiatan Gampong';
                const alt = title;

                return `
                    <div class="gallery-card shadow-sm marquee-item">
                        <img src="${src}" alt="${alt}" class="img-fluid">
                        <div class="gallery-caption">
                            <h5>${title}</h5>
                            <p class="mb-0 small">${caption}</p>
                        </div>
                    </div>
                `;
            }).join('');
        };

        // Buat HTML untuk setiap baris marquee
        let wrapperHTML = '';
        rowsData.forEach((rowData, rIndex) => {
            const setHTML = buildSetHTML(rowData);
            const isReverse = rIndex % 2 !== 0 ? ' marquee-reverse' : '';
            const marginTop = rIndex > 0 ? ' mt-3' : '';

            wrapperHTML += `
                <div class="marquee-container${marginTop}">
                    <div class="marquee-track${isReverse}">
                        <div class="marquee-set">
                            ${setHTML}
                        </div>
                        <div class="marquee-set">
                            ${setHTML}
                        </div>
                    </div>
                </div>
            `;
        });

        marqueeWrapper.innerHTML = wrapperHTML;

        // Render Tombol "Lihat Semua Foto"
        if (viewAllBtnContainer) {
            viewAllBtnContainer.innerHTML = `
                <button class="btn btn-outline-success rounded-pill px-4 py-2 shadow-sm" data-bs-toggle="modal" data-bs-target="#galleryGridModal">
                    <i class="bi bi-grid-3x3-gap-fill me-2"></i>Lihat Semua Foto (${data.length} Foto)
                </button>
            `;
        }

        // Render Grid Foto di Modal
        if (gridContainer) {
            gridContainer.innerHTML = data.map(item => {
                const src = typeof item === 'string' ? item : item.src;
                const title = (typeof item === 'object' && item.title) ? item.title : 'Dokumentasi';
                const caption = (typeof item === 'object' && item.caption) ? item.caption : 'Kegiatan Gampong';

                return `
                    <div class="col">
                        <div class="gallery-card shadow-sm h-100">
                            <img src="${src}" alt="${title}" class="img-fluid">
                            <div class="gallery-caption">
                                <h5>${title}</h5>
                                <p class="mb-0 small">${caption}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    if (marqueeWrapper && typeof galleryImages !== 'undefined' && Array.isArray(galleryImages)) {
        renderGallery(galleryImages);
    }

    // Lightbox logic (Event Delegation)
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox) {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-card img')) {
                const img = e.target.closest('.gallery-card img');
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            }
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
});
