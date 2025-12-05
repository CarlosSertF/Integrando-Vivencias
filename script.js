// Nome da chave única do LocalStorage
const CHAVE = "usuarios";
let listaAberta = false;

// Selecionando elementos
const form = document.getElementById("cadastro-usuario");
const btnCadastrar = form.querySelectorAll("button")[1];
const btnListar = form.querySelectorAll("button")[2];
const btnLimparLista = form.querySelectorAll("button")[3];

// Impede envio automático do formulário
form.addEventListener("submit", function (event) {
    event.preventDefault();
});


// Função para carregar a Lista
function carregarLista() {
    const lista = localStorage.getItem(CHAVE);
    return lista ? JSON.parse(lista) : [];
}


// Função para salvar a Lista
function salvarLista(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
}

-
// Cadastrar Usuário
btnCadastrar.addEventListener("click", () => {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const usuario = form.usuario.value.trim();
    const data = new Date().toLocaleDateString("pt-BR");

    if (!nome || !email || !usuario) {
        alert("Preencha todos os campos.");
        return;
    }

    const emailInput = document.getElementById("email");
    if (!emailInput.checkValidity()) {
        alert("Digite um email válido.");
        return;
    }

    const novoUsuario = { nome, email, usuario, data};

    const lista = carregarLista();
    lista.push(novoUsuario);

    salvarLista(lista);

    alert("Usuário cadastrado com sucesso!");
    
    exibirUsuarios();

    btnListar.textContent = "Fechar lista";
    listaAberta = true;

    form.reset();
});
    
// Gera quadros dos Usuários
function exibirUsuarios(listaPersonalizada = null) {
    const lista = listaPersonalizada ?? carregarLista();
    // const lista = carregarLista();
    const container = document.getElementById("lista-usuarios");

    // Limpa antes de recriar os quadros
    container.innerHTML = "";

    if (lista.length === 0) {
       container.innerHTML = `
            <div class="card-usuario">
                Nenhum usuário cadastrado.
            </div>
        `;
        return;
    }

    lista.forEach((u, i) => {
        const card = document.createElement("div");
        card.className = "card-usuario";

        card.innerHTML = `
            <h3>Usuário ${i + 1}</h3>
            <p><strong>Nome:</strong> ${u.nome}</p>
            <p><strong>Email:</strong> ${u.email}</p>
            <p><strong>Usuário:</strong> ${u.usuario}</p>
            <p><strong>Data de cadastro:</strong> ${u.data ?? "Não informado"}<p>
            
        `;

        container.appendChild(card);

    // Cria botão excluir e anexa diretamente o listener
        const btnExcluir = document.createElement("button");
        btnExcluir.className = "btn-excluir";
        btnExcluir.textContent = "Excluir";
        btnExcluir.setAttribute("data-index", i);

        // Listener único por botão — o índice "i" é capturado aqui pelo closure
        btnExcluir.addEventListener("click", (event) => {
            event.stopPropagation(); // evita bubbling indesejado
            const index = parseInt(btnExcluir.getAttribute("data-index"), 10);

            if (Number.isNaN(index)) return;

            if (confirm("Deseja excluir este usuário?")) {
                const listaAtual = carregarLista();
                // Segurança: verifica se índice ainda existe na lista atual
                if (index >= 0 && index < listaAtual.length) {
                    listaAtual.splice(index, 1);
                    salvarLista(listaAtual);
                    exibirUsuarios(); // Re-renderiza lista atualizada
                    alert("Usuário excluído!");
                }
            }
        });

        // Adiciona o botão ao card e o card ao container
        card.appendChild(btnExcluir);
        container.appendChild(card);
    });
}

// Listar Usuários
btnListar.addEventListener("click", () => {
    const container = document.getElementById("lista-usuarios");

    if (!listaAberta) {
        // Abrir Lista
        exibirUsuarios();              // Renderiza a Lista dentro de #lista
        btnListar.textContent = "Fechar lista";
        listaAberta = true;
    } else {
        // Fechar Lista
        container.innerHTML = "";      // Limpa área da Lista
        btnListar.textContent = "Listar";
        listaAberta = false;
    }
});

// Limpar lista do LocalStorage
btnLimparLista.addEventListener("click", () => {
   const lista = carregarLista();
    if(lista.length > 0){
        if (confirm("Deseja limpar todos os usuários cadastrados?")) {
        localStorage.removeItem(CHAVE);
        alert("Lista apagada!");
        exibirUsuarios();
        btnListar.textContent = "Fechar lista";
        listaAberta = true;
        form.reset();
        }
    }else{
        alert("ERRO: Lista vazia!");
    }
});

// Filtro de Usuários
function pesquisarUsuarios() {
    const termo = document.getElementById("pesquisa").value.toLowerCase().trim();
    const lista = carregarLista();

    const filtrados = lista.filter(u =>
        u.nome.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo) ||
        u.usuario.toLowerCase().includes(termo)
    );

    btnListar.textContent = "Fechar lista";
    listaAberta = true;

    exibirUsuarios(filtrados);
}
