// estilos gerais das pages
// Configuração do Supabase com a URL e chave fornecida
const supabaseUrl = 'https://nwxmubgivfwwqekzzpsw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eG11YmdpdmZ3d3Fla3p6cHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDI5MDksImV4cCI6MjA3MzUxODkwOX0.vVnC0QGTS7e6JojGCVnkxOerVR4G5uIc0dhB4c0AbSQ'; // Substitua com sua chave
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
