const supabaseUrl = "https://nwxmubgivfwwqekzzpsw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eG11YmdpdmZ3d3Fla3p6cHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDI5MDksImV4cCI6MjA3MzUxODkwOX0.vVnC0QGTS7e6JojGCVnkxOerVR4G5uIc0dhB4c0AbSQ";

const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

let todosCarros = [];
let carrosFiltrados = [];

document.addEventListener('DOMContentLoaded', function () {
    carregarCarros();
    configurarBusca();
});

// Função principal para carregar carros
async function carregarCarros() {
    try {
        mostrarLoading(true);

        const { data, error } = await supabaseClient
            .from("carros")
            .select("*")
            .order("id");

        if (error) {
            throw new Error(`Erro ao carregar carros: ${error.message}`);
        }

        todosCarros = data || [];
        carrosFiltrados = [...todosCarros];

        renderizarCarros();

    } catch (error) {
        console.error(error);
        mostrarErro("Erro ao carregar os carros. Tente novamente mais tarde.");
    } finally {
        mostrarLoading(false);
    }
}

function renderizarCarros() {
    const container = document.getElementById('carrosContainer');

    if (carrosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="sem-resultados">
                <i class="fas fa-car fa-3x"></i>
                <h3>Nenhum carro encontrado</h3>
                <p>Tente alterar os termos da sua busca</p>
            </div>
        `;
        return;
    }

    container.innerHTML = carrosFiltrados.map(carro => criarCardCarro(carro)).join('');
}

function criarCardCarro(carro) {
    const isNovo = carro.novo || false;
    const badgeNovo = isNovo ? `<span class="badge"><i class="fa-solid fa-fire"></i> Novo</span>` : '';

    return `
        <div class="modelo" data-id="${carro.id}">
            ${badgeNovo}
            <img src="${carro.imagem_url || '/assets/placeholder-car.jpg'}" alt="${carro.nome}" />
            <h3>${carro.nome}</h3>
            <p>${carro.descricao || 'Descrição não disponível'}</p>
            <p class="preco">${formatarPreco(carro.preco)}</p>
            <button class="btn-buy" type="button" onclick="comprarCarro(${carro.id})">
                <span class="btn-icon-wrap">
                    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                        0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 
                        2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 
                        0 1.41-.41 1.75-1.03l3.58-6.49A1 1 
                        0 0 0 21 5H6.21l-.94-2H1v2h3l3.6 
                        7.59-1.35 2.45C5.11 15.37 5.92 17 
                        7.16 17h12v-2H7.42c-.14 0-.25-.11-.25-.25 
                        0-.03.01-.05.02-.08l.97-1.67z" />
                    </svg>
                </span>
                <span class="btn-text">Comprar</span>
            </button>
        </div>
    `;
}

// Função para formatar preço
function formatarPreco(preco) {
    if (!preco) return "Preço indisponível";

    const numero = typeof preco === 'string' ? parseFloat(preco) : preco;

    if (isNaN(numero)) return "Preço indisponível";

    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function comprarCarro(id) {
    window.location.href = `/pages/detalhes/detalhes.html?id=${id}`;
}

// Configurar funcionalidade de busca
function configurarBusca() {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const termo = e.target.value.toLowerCase().trim();

            if (termo === '') {
                carrosFiltrados = [...todosCarros];
            } else {
                carrosFiltrados = todosCarros.filter(carro =>
                    carro.nome.toLowerCase().includes(termo) ||
                    (carro.descricao && carro.descricao.toLowerCase().includes(termo)) ||
                    (carro.marca && carro.marca.toLowerCase().includes(termo))
                );
            }

            renderizarCarros();
        });
    }
}

// Funções auxiliares para UI
function mostrarLoading(mostrar) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = mostrar ? 'block' : 'none';
    }
}

function mostrarErro(mensagem) {
    const container = document.getElementById('carrosContainer');
    if (container) {
        container.innerHTML = `
            <div class="erro">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
                <h3>${mensagem}</h3>
            </div>
        `;
    }
}

// Tornar funções globais para o onclick
window.comprarCarro = comprarCarro;