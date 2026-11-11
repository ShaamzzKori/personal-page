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

    if (!items.length) {
        return;
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
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
})();
