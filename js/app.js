document.addEventListener('DOMContentLoaded', () => {
    // Cinematic fade-in effect on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // --- SCROLL REVEAL OBSERVER ---
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
    };
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    // Observe static elements
    document.querySelectorAll('.service-card, .faq-item, .footer-container, .testimonial-card, .submit-testimonial').forEach(el => {
        el.classList.add('reveal');
        revealOnScroll.observe(el);
    });

    // --- WHATSAPP DYNAMIC MESSAGE FORMAT ---
    const phoneNum = "6282147337116";
    function generateWAMessage(packageName) {
        const msg = `Halo ZAVANA HOME STUDIO,\n\nSaya ingin booking paket:\n${packageName}\n\nNama:\nTanggal:\nLokasi:`;
        return `https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`;
    }
    
    // Load Dynamic Data for both Portfolio and Pricing
    fetch('data/katalog.json')
        .then(response => response.json())
        .then(data => {
            const portfolioGrid = document.getElementById('portfolio-grid');
            const pricingGrid = document.getElementById('pricing-grid');
            const blogGrid = document.getElementById('blog-grid');
            
            // 1. Generate Portfolio Grid
            if (portfolioGrid) {
                data.packages.forEach(pkg => {
                    const item = document.createElement('div');
                    item.className = 'portfolio-item';
                    item.setAttribute('data-category', pkg.category.toLowerCase());
                    
                    item.innerHTML = `
                        <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
                        <div class="overlay"></div>
                        <h3>${pkg.title}</h3>
                        <p>Lihat Detail Paket</p>
                    `;
                    
                    item.addEventListener('click', () => openPackageModal(pkg));
                    portfolioGrid.appendChild(item);
                    
                    item.classList.add('reveal');
                    revealOnScroll.observe(item);
                });
                initFilters();
            }

            // 2. Generate Pricing Cards Dynamically
            if (pricingGrid) {
                data.packages.forEach(pkg => {
                    const waLink = generateWAMessage(pkg.title);
                    const card = document.createElement('div');
                    card.className = 'pricing-card';
                    
                    const priceHTML = pkg.originalPrice ? `<p class="price"><del class="original-price">${pkg.originalPrice}</del> ${pkg.price}</p>` : `<p class="price">${pkg.price}</p>`;
                    
                    card.innerHTML = `
                        <div class="pricing-img" style="background-image: url('${pkg.image}');"></div>
                        <div class="pricing-content">
                            <h2>${pkg.title}</h2>
                            <p class="pricing-desc">${pkg.desc}</p>
                            ${priceHTML}
                            <ul class="pricing-features">
                                ${pkg.features.map(f => `<li>${f}</li>`).join('')}
                            </ul>
                            <div style="display:flex; flex-direction:column; gap:15px; margin-top: auto;">
                                <a href="${waLink}" target="_blank" class="btn btn-primary wa-btn">Booking via WhatsApp</a>
                                <a href="https://wa.me/c/${phoneNum}" target="_blank" class="btn btn-secondary catalog-btn">Lihat Katalog WA</a>
                            </div>
                        </div>
                    `;
                    pricingGrid.appendChild(card);
                    
                    card.classList.add('reveal');
                    revealOnScroll.observe(card);
                });
            }

            // 3. Generate Blog Cards
            if (blogGrid && data.blogs) {
                data.blogs.forEach(blog => {
                    const card = document.createElement('div');
                    card.className = 'blog-card';
                    card.innerHTML = `
                        <div class="blog-img" style="background-image: url('${blog.image}');"></div>
                        <div class="blog-content">
                            <span class="blog-date">${blog.date}</span>
                            <h2>${blog.title}</h2>
                            <p class="blog-excerpt">${blog.content.substring(0, 120)}...</p>
                            <button class="btn btn-secondary read-more-btn" style="margin-top: auto;">Baca Artikel</button>
                        </div>
                    `;
                    card.querySelector('.read-more-btn').addEventListener('click', () => openBlogModal(blog));
                    blogGrid.appendChild(card);
                    card.classList.add('reveal');
                    revealOnScroll.observe(card);
                });
            }
        })
    .catch(error => {
        console.error("Error loading catalogue data:", error);
        const gridIds = ['portfolio-grid', 'pricing-grid', 'blog-grid'];
        gridIds.forEach(id => {
            const gridElement = document.getElementById(id);
            if (gridElement) {
                gridElement.innerHTML = `<p style="text-align:center; width:100%; color:var(--text-secondary);">Gagal memuat katalog data. Silakan periksa koneksi internet Anda atau muat ulang halaman.</p>`;
            }
        });
    });

    // --- NAVBAR SCROLL EFFECT ---
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            header.classList.toggle('menu-open');
            
            if (mainNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // --- PORTFOLIO FILTERS LOGIC ---
    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                items.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'flex';
                        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => { item.style.display = 'none'; }, 400);
                    }
                });
            });
        });
    }

    // --- PACKAGE MODAL LOGIC ---
    const packageModal = document.getElementById('package-modal');
    const modalClose = document.getElementById('modal-close');

    function openPackageModal(pkg) {
        if (!packageModal) return;
        document.getElementById('modal-img').src = pkg.image;
        document.getElementById('modal-category').textContent = pkg.category;
        document.getElementById('modal-title').textContent = pkg.title;
        document.getElementById('modal-desc').textContent = pkg.desc;
        document.getElementById('modal-price').innerHTML = pkg.originalPrice 
            ? `<del class="original-price" style="font-size: 1rem; color: #a0a0a0; margin-right: 10px;">${pkg.originalPrice}</del>${pkg.price}` 
            : pkg.price;
        document.getElementById('modal-features').innerHTML = pkg.features.map(f => `<li>${f}</li>`).join('');
        document.getElementById('modal-wa-btn').href = generateWAMessage(pkg.title);
        
        packageModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scroll
    }

    if (packageModal && modalClose) {
        const closeModal = () => { packageModal.classList.remove('active'); document.body.style.overflow = ''; };
        modalClose.addEventListener('click', closeModal);
        packageModal.addEventListener('click', (e) => {
            if (e.target === packageModal) closeModal();
        });
    }

    // --- BLOG MODAL LOGIC ---
    const blogModal = document.getElementById('blog-modal');
    const blogModalClose = document.getElementById('blog-modal-close');

    function openBlogModal(blog) {
        if (!blogModal) return;
        document.getElementById('blog-modal-img').src = blog.image;
        document.getElementById('blog-modal-date').textContent = blog.date;
        document.getElementById('blog-modal-title').textContent = blog.title;
        
        // Memformat tulisan menjadi paragraf asli dengan margin rapi
        document.getElementById('blog-modal-content').innerHTML = blog.content
            .split('\n\n')
            .map(p => `<p style="margin-bottom: 25px;">${p.replace(/\n/g, '<br>')}</p>`)
            .join('');
            
        blogModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (blogModal && blogModalClose) {
        const closeBlogModal = () => { blogModal.classList.remove('active'); document.body.style.overflow = ''; };
        blogModalClose.addEventListener('click', closeBlogModal);
        blogModal.addEventListener('click', (e) => { if (e.target === blogModal) closeBlogModal(); });
    }

    // --- CLOSE MODALS ON ESCAPE KEY ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (packageModal && packageModal.classList.contains('active')) {
                packageModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (blogModal && blogModal.classList.contains('active')) {
                blogModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // --- FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                    faq.querySelector('.faq-answer').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }

    // --- WHATSAPP CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('wa-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah form reload halaman
            const name = document.getElementById('name').value;
            const alamat = document.getElementById('alamat').value;
            const message = document.getElementById('message').value;
            
            const waText = `Halo ZAVANA HOME STUDIO,\n\nSaya ingin berdiskusi mengenai proyek fotografi/videografi.\n\nNama: ${name}\nAlamat: ${alamat}\nDetail Proyek:\n${message}`;
            const waUrl = `https://wa.me/${phoneNum}?text=${encodeURIComponent(waText)}`;
            
            window.open(waUrl, '_blank');
        });
    }

    // --- TESTIMONIAL SLIDER LOGIC ---
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (testimonialGrid) {
        // Membuat elemen wrapper untuk tombol kontrol
        const controls = document.createElement('div');
        controls.className = 'testimonial-controls';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn prev-btn';
        prevBtn.innerHTML = '&#10094;'; // Panah ke kiri
        prevBtn.setAttribute('aria-label', 'Testimoni Sebelumnya');
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn next-btn';
        nextBtn.innerHTML = '&#10095;'; // Panah ke kanan
        nextBtn.setAttribute('aria-label', 'Testimoni Selanjutnya');
        
        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        
        // Memasukkan tombol ke dalam HTML setelah elemen grid testimoni
        testimonialGrid.parentNode.insertBefore(controls, testimonialGrid.nextSibling);
        
        // Logika saat tombol diklik
        const getScrollAmount = () => testimonialGrid.clientWidth; // Geser tepat 1 panel (100% layar)
        
        nextBtn.addEventListener('click', () => {
            testimonialGrid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            testimonialGrid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        // Fitur Auto-play (Disesuaikan jadi 5 detik untuk memberi kenyamanan membaca)
        let autoSlide = setInterval(() => {
            if (testimonialGrid.scrollLeft + testimonialGrid.clientWidth >= testimonialGrid.scrollWidth - 10) {
                testimonialGrid.scrollTo({ left: 0, behavior: 'smooth' }); // Kembali ke awal jika sudah di ujung
            } else {
                testimonialGrid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            }
        }, 5000);

        // Jeda auto-play saat kursor hover di atas testimoni (memberi waktu pengunjung membaca)
        testimonialGrid.addEventListener('mouseenter', () => clearInterval(autoSlide));
        testimonialGrid.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                if (testimonialGrid.scrollLeft + testimonialGrid.clientWidth >= testimonialGrid.scrollWidth - 10) {
                    testimonialGrid.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    testimonialGrid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                }
            }, 5000);
        });
    }

    // --- CUSTOM TOAST NOTIFICATION ---
    function showToast(message) {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // Fungsi pembantu untuk mencegah XSS (Cross-Site Scripting)
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

    // --- LOCAL TESTIMONIAL FORM LOGIC ---
    const testimonialForm = document.getElementById('local-testimonial-form');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('testi-name').value;
            const pkg = document.getElementById('testi-package').value;
            const message = document.getElementById('testi-message').value;
            
            const testimonialGrid = document.querySelector('.testimonial-grid');
            
            if (testimonialGrid) {
                // Sanitasi input pengguna sebelum dimasukkan ke dalam HTML
                const safeName = escapeHTML(name);
                const safePkg = escapeHTML(pkg);
                const safeMessage = escapeHTML(message);

                // Membuat elemen kartu testimoni baru
                const newCard = document.createElement('div');
                newCard.className = 'testimonial-card reveal active'; // Langsung diberi class active agar tidak perlu di-scroll
                newCard.innerHTML = `
                    <div class="quote-icon">“</div>
                    <p class="testimonial-text">${safeMessage}</p>
                    <div class="testimonial-author">
                        <span class="testimonial-name">${safeName}</span>
                        <span class="testimonial-package">${safePkg}</span>
                    </div>
                `;
                // Menyisipkan kartu baru di urutan paling atas grid
                testimonialGrid.prepend(newCard);
                
                // Scroll otomatis ke testimoni baru
                testimonialGrid.scrollTo({ left: 0, behavior: 'smooth' });
                
                // Mereset formulir dan memunculkan notifikasi
                testimonialForm.reset();
                showToast("Terima kasih! Ulasan Anda berhasil ditambahkan.");
            }
        });
    }

    // --- SHARE WEBSITE LOGIC ---
    const shareBtns = document.querySelectorAll('.share-website-btn');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const shareData = {
                title: document.title,
                text: 'Kunjungi ZAVANA HOME STUDIO - Fotografi & Videografi Premium!',
                url: window.location.href
            };
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(window.location.href);
                    showToast("Tautan website berhasil disalin!");
                }
            } catch (err) {
                console.error("Error sharing:", err);
            }
        });
    });
});
