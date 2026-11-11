/* ==========================================================================
   main.js — progressive enhancement only (vanilla, no dependencies)
   ==========================================================================
   1. mobile navigation toggle
   2. reveal-on-scroll for .reveal blocks
   3. current year in the footer
   4. "Print / save as PDF" button on the CV page
   5. age calculation on the CV page
   ========================================================================== */

(function () {
    'use strict';

    document.documentElement.classList.remove('no-js');

    /* ---------- 1. mobile navigation -------------------------------------- */

    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');

    if (toggle && nav) {
        var setNav = function (open) {
            nav.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        };

        toggle.addEventListener('click', function () {
            setNav(toggle.getAttribute('aria-expanded') !== 'true');
        });

        nav.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                setNav(false);
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setNav(false);
            }
        });

        var desktop = window.matchMedia('(min-width: 881px)');
        var onChange = function (event) {
            if (event.matches) {
                setNav(false);
            }
        };

        if (typeof desktop.addEventListener === 'function') {
            desktop.addEventListener('change', onChange);
        } else if (typeof desktop.addListener === 'function') {
            desktop.addListener(onChange);
        }
    }

    /* ---------- 2. reveal on scroll --------------------------------------- */

    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!items.length || reduceMotion || !('IntersectionObserver' in window)) {
        items.forEach(function (el) {
            el.classList.add('is-visible');
        });
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                var el = entry.target;
                var delay = parseInt(el.getAttribute('data-delay') || '0', 10);

                window.setTimeout(function () {
                    el.classList.add('is-visible');
                }, delay);

                observer.unobserve(el);
            });
        }, {
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.08
        });

        items.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ---------- 3. footer year -------------------------------------------- */

    var year = String(new Date().getFullYear());

    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = year;
    });

    /* ---------- 4. print button ------------------------------------------- */

    var printBtn = document.querySelector('[data-print]');

    if (printBtn) {
        printBtn.addEventListener('click', function () {
            window.print();
        });
    }

    /* ---------- 5. age on the CV ------------------------------------------ */

    var ageTarget = document.querySelector('[data-age]');

    if (ageTarget) {
        var born = new Date(ageTarget.getAttribute('data-age'));
        var now = new Date();
        var age = now.getFullYear() - born.getFullYear();
        var beforeBirthday =
            now.getMonth() < born.getMonth() ||
            (now.getMonth() === born.getMonth() && now.getDate() < born.getDate());

        ageTarget.textContent = String(beforeBirthday ? age - 1 : age);
    }

    /* ---------- 6. theme switch: light / dark / system -------------------- */

    var root = document.documentElement;
    var themeBtn = document.querySelector('[data-theme-toggle]');
    var THEME_KEY = 'theme';
    var MODES = ['light', 'dark', 'auto'];
    var isRu = (root.lang || '').toLowerCase().indexOf('ru') === 0;

    var TEXT = isRu ? {
        light: 'Светлая',
        dark: 'Тёмная',
        auto: 'Системная',
        label: 'Тема оформления',
        next: 'Далее:',
        prefix: 'Тема:'
    } : {
        light: 'Light',
        dark: 'Dark',
        auto: 'System',
        label: 'Colour theme',
        next: 'Next:',
        prefix: 'Theme:'
    };

    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function readMode() {
        try {
            var stored = localStorage.getItem(THEME_KEY);
            if (stored === 'light' || stored === 'dark') {
                return stored;
            }
        } catch (e) { /* приватный режим, storage недоступен */ }

        return 'auto';
    }

    function modeLabel(mode) {
        if (mode === 'auto') {
            return TEXT.auto + ' (' + (darkQuery.matches ? TEXT.dark : TEXT.light).toLowerCase() + ')';
        }

        return TEXT[mode];
    }

    function paintButton(mode) {
        if (!themeBtn) {
            return;
        }

        var label = themeBtn.querySelector('.theme-toggle__label');
        var text = modeLabel(mode);
        var next = modeLabel(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
        var description = TEXT.label + ': ' + text + '. ' + TEXT.next + ' ' + next;

        if (label) {
            label.textContent = TEXT.prefix + ' ' + text;
        }

        themeBtn.setAttribute('title', description);
        themeBtn.setAttribute('aria-label', description);
        themeBtn.setAttribute('data-mode', mode);
    }

    function applyMode(mode) {
        if (mode === 'auto') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', mode);
        }

        paintButton(mode);
    }

    if (themeBtn) {
        paintButton(readMode());

        themeBtn.addEventListener('click', function () {
            var next = MODES[(MODES.indexOf(readMode()) + 1) % MODES.length];

            try {
                localStorage.setItem(THEME_KEY, next);
            } catch (e) { /* игнорируем: тема просто не запомнится */ }

            applyMode(next);
        });

        /* системная тема переключилась, пока выбран режим «системная» */
        var onSystemChange = function () {
            if (readMode() === 'auto') {
                paintButton('auto');
            }
        };

        if (typeof darkQuery.addEventListener === 'function') {
            darkQuery.addEventListener('change', onSystemChange);
        } else if (typeof darkQuery.addListener === 'function') {
            darkQuery.addListener(onSystemChange);
        }

        /* смена темы в другой вкладке */
        window.addEventListener('storage', function (event) {
            if (event.key === THEME_KEY) {
                applyMode(readMode());
            }
        });
    }
})();
