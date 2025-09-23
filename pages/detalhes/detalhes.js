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
