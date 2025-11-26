let cardContainer = document.querySelector(".card-container");
let searchInput = document.querySelector("#search-input");
let botaoBusca = document.querySelector("#botao-busca");
let dados = [];

// Carrega os dados do JSON
async function carregarDados() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
    renderizarCards(dados); // Renderiza todos os cards inicialmente
}

// Função que aplica o filtro
function filtrarDados() {
    const termoBusca = searchInput.value.toLowerCase().trim();

    if (termoBusca === "") {
        // Se não digitou nada, mostra todos
        renderizarCards(dados);
        return;
    }

    const dadosFiltrados = dados.filter(dado => {
        const nome = dado.nome.toLowerCase();
        const riscos = dado["Riscos Ambientais"].toLowerCase();
        const descarte = dado["Como Descartar"].toLowerCase();

        return (
            nome.includes(termoBusca) ||
            riscos.includes(termoBusca) ||
            descarte.includes(termoBusca)
        );
    });

    renderizarCards(dadosFiltrados);
}

// Busca em tempo real (digitando)
searchInput.addEventListener("input", filtrarDados);

// Busca ao clicar no botão
botaoBusca.addEventListener("click", filtrarDados);

// Renderiza os cards
function renderizarCards(lista) {
    cardContainer.innerHTML = "";

    // 🔎 Nenhum resultado encontrado
    if (!lista || lista.length === 0) {
        cardContainer.innerHTML = `
            <div class="empty-state">
                <p><strong>Nenhum resultado encontrado.</strong></p>
                <p>Tente buscar por palavras como <em>pilha</em>, <em>vidro</em>, <em>remédios</em>, <em>eletrônicos</em>...</p>
            </div>
        `;
        return;
    }

    for (let dado of lista) {
        let articole = document.createElement("article");
        articole.classList.add("card");

        // 🧩 Ícone por tipo
        const nome = dado.nome || "";
        const nomeLower = nome.toLowerCase();
        let icone = "♻️";

        if (nomeLower.includes("pilha")) icone = "🔋";
        else if (nomeLower.includes("vidro")) icone = "🧪";
        else if (nomeLower.includes("reméd")) icone = "💊";
        else if (nomeLower.includes("eletr")) icone = "💻";
        else if (nomeLower.includes("óleo")) icone = "🛢️";
        else if (nomeLower.includes("roupa") || nomeLower.includes("tecido")) icone = "👕";

        articole.innerHTML = `
            <h2><span class="icon">${icone}</span>${dado.nome}</h2>
            <p><strong>Tempo de Decomposição:</strong> ${dado["Tempo de Decomposição"]}</p>
            <p><strong>Riscos Ambientais:</strong> ${dado["Riscos Ambientais"]}</p>
            <p><strong>Como Descartar:</strong> ${dado["Como Descartar"]}</p>
            <a href="${dado.link}" target="_blank">Saiba mais</a>
        `;

        cardContainer.appendChild(articole);
    }
}

// Carrega os dados assim que a página abre
carregarDados();
