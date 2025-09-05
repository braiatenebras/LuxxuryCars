// FADE-IN AO SCROLL
const faders = document.querySelectorAll('.fade-in');

const options = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, options);

faders.forEach(fader => {
    observer.observe(fader);
});

// menu hamburguer
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active');
});
