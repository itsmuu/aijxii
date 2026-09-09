class AppNavbar extends HTMLElement {
    connectedCallback() {
        if (this._inited) return;
        this._inited = true;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', savedTheme);

        const homeIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>`;
        const gradIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11v5c0 1.5 2.7 4 6 4s6-2.5 6-4v-5"/><line x1="22" y1="9" x2="22" y2="14"/></svg>`;

        this.innerHTML = `
        <style>
            :host {
                position: sticky;
                top: 0;
                z-index: 1000;
                display: block;
                transition: transform 0.2s ease, opacity 0.2s ease;
            }

            :host(.exam-hidden) {
                display: none;
            }

            .navbar {
                background: var(--navbar-bg);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border-bottom: 1px solid var(--border-color);
                padding: 0 24px;
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }

            .nav-container {
                max-width: 1000px;
                margin: 0 auto;
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .brand {
                font-weight: 700;
                font-size: 16px;
                color: var(--text-primary);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 12px;
                letter-spacing: -0.3px;
                white-space: nowrap;
            }

            .logo-icon {
                width: 40px;
                height: 40px;
                background-color: #e0f2fe;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0284c7;
                flex-shrink: 0;
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            [data-theme="dark"] .logo-icon {
                background-color: rgba(56, 189, 248, 0.15);
                color: #38bdf8;
            }

            .nav-right {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .nav-links {
                display: flex;
                gap: 6px;
                list-style: none;
                margin: 0;
                padding: 0;
            }

            .nav-links a {
                text-decoration: none;
                color: var(--text-secondary);
                font-weight: 500;
                font-size: 13.5px;
                padding: 8px 14px;
                border-radius: 8px;
                transition: all 0.2s ease;
            }

            .nav-links a:hover {
                color: var(--text-primary);
                background-color: var(--border-color);
            }

            .nav-links a.active {
                color: var(--accent-blue);
                background-color: rgba(2, 132, 199, 0.12);
                font-weight: 600;
            }

            .theme-btn {
                background: transparent;
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                width: 38px;
                height: 38px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .theme-btn:hover {
                background-color: var(--border-color);
                color: var(--accent-blue);
            }

            .menu-toggle-btn {
                display: none;
                background: transparent;
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                width: 38px;
                height: 38px;
                border-radius: 10px;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .menu-toggle-btn:hover {
                background-color: var(--border-color);
                color: var(--accent-blue);
            }

            .menu-toggle-btn {
                position: relative;
            }

            .menu-toggle-btn > svg {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                transform: translate(-50%, -50%);
                transition: opacity 0.18s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .menu-toggle-btn > svg.icon-close {
                opacity: 0;
                transform: translate(-50%, -50%) rotate(-90deg) scale(0.4);
            }

            .menu-toggle-btn.is-open > svg.icon-menu {
                opacity: 0;
                transform: translate(-50%, -50%) rotate(90deg) scale(0.4);
            }

            .menu-toggle-btn.is-open > svg.icon-close {
                opacity: 1;
                transform: translate(-50%, -50%) rotate(0deg) scale(1);
            }

            /* ===== Side drawer & backdrop — APPENDED KE body, */
            /* agar position:fixed memakai viewport (bukan .navbar yg punya backdrop-filter) ===== */
            .nav-backdrop {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 1020;
                background: rgba(10, 28, 50, 0.45);
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.28s ease, visibility 0.28s ease;
            }

            .nav-backdrop.open {
                opacity: 1;
                visibility: visible;
            }

            .nav-side {
                display: none;
            }

            @media (max-width: 900px) {
                .nav-links {
                    display: none;
                }

                .menu-toggle-btn {
                    display: inline-flex;
                }

                .nav-backdrop {
                    display: block;
                }

                .nav-side {
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: min(300px, 84vw);
                    padding: 76px 18px 24px;
                    background: var(--navbar-bg);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-left: 1px solid var(--border-color);
                    box-shadow: -18px 0 60px rgba(10, 28, 50, 0.25);
                    transform: translateX(105%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1030;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                }

                .nav-side.open {
                    transform: translateX(0);
                }

                .side-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-bottom: 18px;
                    margin-bottom: 18px;
                    border-bottom: 1px solid var(--border-color);
                }

                .side-brand .logo-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 11px;
                }

                .side-brand strong {
                    display: block;
                    color: var(--text-primary);
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: -0.3px;
                }

                .side-brand small {
                    display: block;
                    color: var(--text-secondary);
                    font-size: 11.5px;
                    margin-top: 2px;
                }

                .side-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .side-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    text-decoration: none;
                    color: var(--text-secondary);
                    font-size: 14.5px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                }

                .side-link:hover {
                    color: var(--text-primary);
                    background-color: var(--border-color);
                }

                .side-link.active {
                    color: var(--accent-blue);
                    background-color: rgba(2, 132, 199, 0.12);
                    border-color: rgba(2, 132, 199, 0.18);
                    font-weight: 600;
                }

                .side-link svg {
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                }

                .side-link.active svg {
                    color: var(--accent-blue);
                }

                .side-num {
                    width: 26px;
                    height: 26px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    background-color: var(--border-color);
                    color: var(--text-secondary);
                    font-size: 13px;
                    font-weight: 700;
                }

                .side-link.active .side-num {
                    background-color: rgba(2, 132, 199, 0.16);
                    color: var(--accent-blue);
                }
            }
        </style>

        <nav class="navbar">
            <div class="nav-container">
                <a href="index.html" class="brand">
                    <div class="logo-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="2"></rect>
                            <rect x="14" y="3" width="7" height="7" rx="2"></rect>
                            <rect x="14" y="14" width="7" height="7" rx="2"></rect>
                            <rect x="3" y="14" width="7" height="7" rx="2"></rect>
                        </svg>
                    </div>
                    <span>Modul MikroTik</span>
                </a>
                
                <div class="nav-right">
                    <ul class="nav-links">
                        <li><a href="index.html" class="${currentPath === 'index.html' ? 'active' : ''}">Beranda</a></li>
                        <li><a href="modul1.html" class="${currentPath === 'modul1.html' ? 'active' : ''}">Modul 1</a></li>
                        <li><a href="modul2.html" class="${currentPath === 'modul2.html' ? 'active' : ''}">Modul 2</a></li>
                        <li><a href="modul3.html" class="${currentPath === 'modul3.html' ? 'active' : ''}">Modul 3</a></li>
                        <li><a href="modul4.html" class="${currentPath === 'modul4.html' ? 'active' : ''}">Modul 4</a></li>
                        <li><a href="sts.html" class="${currentPath === 'sts.html' ? 'active' : ''}">Sumatif</a></li>
                    </ul>

                    <button class="theme-btn" id="theme-toggle" title="Ubah Mode Tampilan">
                        <span id="theme-icon"></span>
                    </button>
                    <button type="button" class="menu-toggle-btn" id="navMenuToggle" aria-label="Buka menu navigasi" aria-haspopup="true" aria-expanded="false" aria-controls="navSide">
                        <svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line>
                        </svg>
                        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
        `;

        this.initThemeToggle();
        this.initMobileMenu();
    }

    initMobileMenu() {
        const toggleBtn = this.querySelector('#navMenuToggle');
        if (!toggleBtn) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        const homeIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>`;
        const gradIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11v5c0 1.5 2.7 4 6 4s6-2.5 6-4v-5"/><line x1="22" y1="9" x2="22" y2="14"/></svg>`;

        // Drawer & backdrop dibuat terpisah di <body>, BUKAN di dalam .navbar
        // (backdrop-filter pada .navbar akan 'menjebak' position:fixed turunannya).
        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.id = 'navBackdrop';

        const side = document.createElement('aside');
        side.className = 'nav-side';
        side.id = 'navSide';
        side.setAttribute('aria-label', 'Menu navigasi');
        side.innerHTML = `
            <div class="side-brand">
                <div class="logo-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="2"></rect>
                        <rect x="14" y="3" width="7" height="7" rx="2"></rect>
                        <rect x="14" y="14" width="7" height="7" rx="2"></rect>
                        <rect x="3" y="14" width="7" height="7" rx="2"></rect>
                    </svg>
                </div>
                <div>
                    <strong>Modul MikroTik</strong>
                    <small>Praktikum TKJ</small>
                </div>
            </div>
            <nav class="side-nav">
                <a href="index.html" class="side-link ${currentPath === 'index.html' ? 'active' : ''}">${homeIcon}<span>Beranda</span></a>
                <a href="modul1.html" class="side-link ${currentPath === 'modul1.html' ? 'active' : ''}"><span class="side-num">1</span><span>Modul 1</span></a>
                <a href="modul2.html" class="side-link ${currentPath === 'modul2.html' ? 'active' : ''}"><span class="side-num">2</span><span>Modul 2</span></a>
                <a href="modul3.html" class="side-link ${currentPath === 'modul3.html' ? 'active' : ''}"><span class="side-num">3</span><span>Modul 3</span></a>
                <a href="modul4.html" class="side-link ${currentPath === 'modul4.html' ? 'active' : ''}"><span class="side-num">4</span><span>Modul 4</span></a>
                <a href="sts.html" class="side-link ${currentPath === 'sts.html' ? 'active' : ''}">${gradIcon}<span>Sumatif</span></a>
            </nav>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(side);

        const setOpen = (open) => {
            side.classList.toggle('open', open);
            backdrop.classList.toggle('open', open);
            toggleBtn.classList.toggle('is-open', open);
            toggleBtn.setAttribute('aria-expanded', String(open));
            toggleBtn.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
            // Naikkan z-index host (sticky z-index awalnya 1000) di atas backdrop (1020)
            // dan drawer (1030) agar tombol X tidak tertutup dan tetap bisa diklik.
            this.style.zIndex = open ? '1045' : '1000';
            document.body.style.overflow = open ? 'hidden' : '';
        };

        const isOpen = () => side.classList.contains('open');

        toggleBtn.addEventListener('click', () => setOpen(!isOpen()));
        backdrop.addEventListener('click', () => setOpen(false));
        side.addEventListener('click', (event) => {
            if (event.target.closest('a')) setOpen(false);
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isOpen()) setOpen(false);
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) setOpen(false);
        });
    }

    initThemeToggle() {
        const toggleBtn = this.querySelector('#theme-toggle');
        const iconSpan = this.querySelector('#theme-icon');
        if (!toggleBtn || !iconSpan) return;

        const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

        const updateIcon = (theme) => {
            iconSpan.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        };

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        updateIcon(currentTheme);

        toggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }
}

customElements.define('app-navbar', AppNavbar);