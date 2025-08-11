document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle --- //
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Set initial theme based on user preference or default to dark
    if (localStorage.getItem('theme') === 'light') {
        body.classList.remove('dark');
    } else {
        body.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    });

    // --- Accordion --- //
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const wasActive = header.classList.contains('active');

            // Close all accordions
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!wasActive) {
                header.classList.add('active');
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- Smooth Scroll --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Scroll Animations --- //
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});