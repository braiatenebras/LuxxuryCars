// Importar Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 🔑 Configuração do Supabase (usar apenas chave anon)
const supabaseUrl = "https://nwxmubgivfwwqekzzpsw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eG11YmdpdmZ3d3Fla3p6cHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDI5MDksImV4cCI6MjA3MzUxODkwOX0.vVnC0QGTS7e6JojGCVnkxOerVR4G5uIc0dhB4c0AbSQ";

const supabase = createClient(supabaseUrl, supabaseKey);

// Pegar id do carro na URL
const params = new URLSearchParams(window.location.search);
const carroId = params.get("id");

// Função principal para carregar os dados do carro
async function carregarCarro() {
    if (!carroId) {
        console.error("Nenhum ID de carro fornecido na URL.");
        return;
    }

    // Buscar dados no Supabase
    const { data, error } = await supabase
        .from("carros")
        .select("*")
        .eq("id", carroId)
        .single();

    if (error) {
        console.error("Erro ao carregar carro:", error.message);
        return;
    }

    // Preencher elementos do HTML
    document.getElementById("produto-imagem").src = data.imagem_url || "/assets/default.png";
    document.getElementById("produto-nome").textContent = data.nome || "Produto sem nome";
    document.getElementById("produto-preco").textContent = data.preco ? `R$ ${data.preco}` : "Preço indisponível";
    document.getElementById("produto-descricao").textContent = data.descricao || "Sem descrição disponível";

    if (data.vendidos) {
        document.getElementById("produto-vendidos").textContent = `${data.vendidos} vendidos`;
    }

    // Benefícios
    const ulBeneficios = document.getElementById("produto-beneficios");
    ulBeneficios.innerHTML = ""; // limpar lista antes
    if (data.beneficios) {
        if (Array.isArray(data.beneficios)) {
            data.beneficios.forEach(b => {
                const li = document.createElement("li");
                li.textContent = b;
                ulBeneficios.appendChild(li);
            });
        } else if (typeof data.beneficios === "string") {
            data.beneficios.split(",").forEach(b => {
                const li = document.createElement("li");
                li.textContent = b.trim();
                ulBeneficios.appendChild(li);
            });
        }
    }

    // Avaliação (opcional, se existir)
    if (data.avaliacao) {
        document.getElementById("produto-avaliacao").textContent = "★".repeat(Math.round(data.avaliacao));
        document.getElementById("produto-avaliacoes").textContent = data.avaliacoes ? `(${data.avaliacoes} avaliações)` : "";
    }
}

// Inicializa
carregarCarro();
