// supabase imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = "https://nwxmubgivfwwqekzzpsw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eG11YmdpdmZ3d3Fla3p6cHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDI5MDksImV4cCI6MjA3MzUxODkwOX0.vVnC0QGTS7e6JojGCVnkxOerVR4G5uIc0dhB4c0AbSQ";

const supabase = createClient(supabaseUrl, supabaseKey);

const params = new URLSearchParams(window.location.search);
const carroId = params.get("id");

// carregar carro
async function carregarCarro() {
    if (!carroId) {
        console.error("Nenhum ID de carro fornecido na URL.");
        return;
    }

    const { data, error } = await supabase
        .from("carros")
        .select("*")
        .eq("id", carroId)
        .single();

    if (error) {
        console.error("Erro ao carregar carro:", error.message);
        return;
    }

    document.getElementById("produto-imagem").src = data.imagem_url || "Imagem não carregou";
    document.getElementById("produto-imagem2").src = data.imagem_url2 || "Imagem não carregou";
    document.getElementById("produto-imagem3").src = data.imagem_url3 || "Imagem não carregou";
    document.getElementById("miniatura1").src = data.imagem_url || "Imagem não carregou";
    document.getElementById("miniatura2").src = data.imagem_url2 || "Imagem não carregou";
    document.getElementById("miniatura3").src = data.imagem_url3 || "Imagem não carregou";

    document.getElementById("produto-nome").textContent = data.nome || "Produto sem nome";
    document.getElementById("produto-preco").textContent = formatarPreco(data.preco);
    document.getElementById("produto-descricao").textContent = data.descricao || "Sem descrição disponível";
    document.getElementById("produto-beneficios").textContent = data.beneficios || "Sem benefícios disponíveis";


    if (data.vendidos) {
        document.getElementById("produto-vendidos").textContent = `${data.vendidos} vendidos`;
    }
}
// formatar preço
function formatarPreco(preco) {
    if (!preco) return "Preço indisponível";

    const numero = typeof preco === 'string' ? parseFloat(preco) : preco;

    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

carregarCarro();


document.addEventListener('DOMContentLoaded', function () {
    // Elementos do slideshow
    const slides = document.querySelectorAll('.slide-principal');
    const miniaturas = document.querySelectorAll('.miniatura');
    const indicadores = document.querySelectorAll('.indicador');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');

    let currentSlide = 0;
    let slideInterval;

    // Função para mostrar slide específico
    function showSlide(index) {
        // Remove classe active de todos os slides
        slides.forEach(slide => slide.classList.remove('active'));
        miniaturas.forEach(min => min.classList.remove('active'));
        indicadores.forEach(ind => ind.classList.remove('active'));

        // Adiciona classe active ao slide atual
        slides[index].classList.add('active');
        miniaturas[index].classList.add('active');
        indicadores[index].classList.add('active');

        currentSlide = index;
    }

    // Próximo slide
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        showSlide(next);
    }

    // Slide anterior
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) prev = slides.length - 1;
        showSlide(prev);
    }

    // Event listeners
    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    // Miniaturas - clique para navegar
    miniaturas.forEach((miniatura, index) => {
        miniatura.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Indicadores - clique para navegar
    indicadores.forEach((indicador, index) => {
        indicador.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-play do slideshow
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Pausa o slideshow quando o mouse está sobre as imagens
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.addEventListener('mouseenter', stopSlideShow);
    slideshowContainer.addEventListener('mouseleave', startSlideShow);

    // Inicia o slideshow
    startSlideShow();
    showSlide(0);
});
