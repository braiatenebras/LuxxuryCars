import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://nwxmubgivfwwqekzzpsw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eG11YmdpdmZ3d3Fla3p6cHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDI5MDksImV4cCI6MjA3MzUxODkwOX0.vVnC0QGTS7e6JojGCVnkxOerVR4G5uIc0dhB4c0AbSQ";

const supabase = createClient(supabaseUrl, supabaseKey);

const tabela = document.getElementById("carros-tabela");
const modal = document.getElementById("modal-edicao");
const modalTitle = document.getElementById("modal-title");
const btnExcluir = document.getElementById("btn-excluir");

let carroAtual = null;
let modoEdicao = 'editar'; // 'editar' ou 'adicionar'

// Função para formatar preço
function formatarPreco(preco) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(preco);
}

async function carregarCarros() {
    const { data, error } = await supabase.from("carros").select("*").order('id', { ascending: true });

    if (error) {
        console.error("Erro ao carregar carros:", error);
        mostrarNotificacao('Erro ao carregar carros', 'error');
        return;
    }

    tabela.innerHTML = "";

    if (data.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-car" style="font-size: 3rem; margin-bottom: 10px; display: block;"></i>
                    Nenhum carro cadastrado
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(carro => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${carro.id}</td>
            <td>
                <div style="font-weight: 600; color: #fff;">${carro.nome}</div>
                ${carro.descricao ? `<div style="font-size: 0.8rem; color: #888; margin-top: 4px;">${carro.descricao.substring(0, 50)}...</div>` : ''}
            </td>
            <td style="font-weight: 700; color: #f80b0b;">${formatarPreco(carro.preco)}</td>
            <td>
                <img src="${carro.imagem_url || '/assets/placeholder-car.jpg'}" 
                     alt="${carro.nome}" 
                     onerror="this.src='/assets/placeholder-car.jpg'">
            </td>
            <td>
                <button class="btn-action btn-edit" onclick="editarCarro(${carro.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </td>
        `;
        tabela.appendChild(row);
    });
}

window.editarCarro = async function (id) {
    const { data, error } = await supabase.from("carros").select("*").eq("id", id).single();

    if (error) {
        console.error("Erro ao carregar carro:", error);
        mostrarNotificacao('Erro ao carregar dados do carro', 'error');
        return;
    }

    carroAtual = data;
    modoEdicao = 'editar';

    // Preencher formulário
    document.getElementById("edit-nome").value = data.nome || "";
    document.getElementById("edit-preco").value = data.preco || "";
    document.getElementById("edit-descricao").value = data.descricao || "";
    document.getElementById("edit-beneficios").value = data.beneficios || "";
    document.getElementById("edit-imagem1").value = data.imagem_url || "";
    document.getElementById("edit-imagem2").value = data.imagem_url2 || "";
    document.getElementById("edit-imagem3").value = data.imagem_url3 || "";

    // Atualizar título do modal
    modalTitle.textContent = "Editar Carro";
    btnExcluir.style.display = 'flex';

    abrirModal();
};

window.adicionarCarro = function () {
    modoEdicao = 'adicionar';
    carroAtual = null;

    // Limpar formulário
    document.getElementById("edit-nome").value = "";
    document.getElementById("edit-preco").value = "";
    document.getElementById("edit-descricao").value = "";
    document.getElementById("edit-beneficios").value = "";
    document.getElementById("edit-imagem1").value = "";
    document.getElementById("edit-imagem2").value = "";
    document.getElementById("edit-imagem3").value = "";

    // Atualizar título do modal
    modalTitle.textContent = "Adicionar Novo Carro";
    btnExcluir.style.display = 'none';

    abrirModal();
};

window.excluirCarro = async function () {
    if (!carroAtual || !confirm(`Tem certeza que deseja excluir o carro "${carroAtual.nome}"?`)) {
        return;
    }

    const { error } = await supabase.from("carros").delete().eq("id", carroAtual.id);

    if (error) {
        console.error("Erro ao excluir carro:", error);
        mostrarNotificacao('Erro ao excluir carro', 'error');
        return;
    }

    mostrarNotificacao('Carro excluído com sucesso!', 'success');
    fecharModal();
    carregarCarros();
};

function abrirModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.fecharModal = function () {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById("btn-salvar").addEventListener("click", async () => {
    const nome = document.getElementById("edit-nome").value.trim();
    const preco = parseFloat(document.getElementById("edit-preco").value);
    const descricao = document.getElementById("edit-descricao").value.trim();
    const beneficios = document.getElementById("edit-beneficios").value.trim();

    if (!nome) {
        mostrarNotificacao('Por favor, insira o nome do carro', 'warning');
        return;
    }

    if (!preco || preco <= 0) {
        mostrarNotificacao('Por favor, insira um preço válido', 'warning');
        return;
    }

    const updates = {
        nome: nome,
        preco: preco,
        descricao: descricao,
        beneficios: beneficios,
        imagem_url: document.getElementById("edit-imagem1").value.trim(),
        imagem_url2: document.getElementById("edit-imagem2").value.trim(),
        imagem_url3: document.getElementById("edit-imagem3").value.trim(),
    };

    try {
        let result;

        if (modoEdicao === 'editar') {
            result = await supabase.from("carros").update(updates).eq("id", carroAtual.id);
        } else {
            result = await supabase.from("carros").insert([updates]);
        }

        if (result.error) {
            throw result.error;
        }

        const mensagem = modoEdicao === 'editar' ? 'Carro atualizado com sucesso!' : 'Carro adicionado com sucesso!';
        mostrarNotificacao(mensagem, 'success');

        fecharModal();
        carregarCarros();

    } catch (error) {
        console.error("Erro ao salvar carro:", error);
        mostrarNotificacao('Erro ao salvar carro', 'error');
    }
});


// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacaoAnterior = document.querySelector('.notificacao');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }

    const cores = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };

    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${cores[tipo] || '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        ">
            <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'error' ? 'exclamation-triangle' : tipo === 'warning' ? 'exclamation' : 'info'}-circle"></i>
            ${mensagem}
        </div>
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.remove();
    }, 4000);
}

// Estilo para a animação da notificação
const estiloNotificacao = document.createElement('style');
estiloNotificacao.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(estiloNotificacao);

// Carregar dados ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarCarros();
});