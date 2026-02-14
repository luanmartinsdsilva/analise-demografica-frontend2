const API = "https://analise-demografica-ibge.onrender.com"; // ajuste se necessário

const nomeInput = document.getElementById("nome");
const idadeInput = document.getElementById("idade");
const lista = document.getElementById("lista");

// ===============================
// CARREGAR PESSOAS
// ===============================
function carregarPessoas() {
    fetch(`${API}/pessoas`)
        .then(res => res.json())
        .then(data => {
            lista.innerHTML = "";

            data.forEach(pessoa => {
                const div = document.createElement("div");
                div.classList.add("item");
                div.dataset.id = pessoa.id;

                div.innerHTML = `
                    <span class="info">
                        <strong class="nome">${pessoa.nome}</strong> - 
                        <span class="idade">${pessoa.idade}</span> anos
                    </span>

                    <div class="botoes">
                        <button class="btn-editar">Editar</button>
                        <button class="btn-excluir">Excluir</button>
                    </div>
                `;

                lista.appendChild(div);
            });

            adicionarEventos();
        });
}

// ===============================
// ADICIONAR EVENTOS NOS BOTÕES
// ===============================
function adicionarEventos() {
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", iniciarEdicao);
    });

    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", excluirPessoa);
    });
}

// ===============================
// CADASTRAR
// ===============================
function cadastrarPessoa() {
    const nome = nomeInput.value.trim();
    const idade = idadeInput.value.trim();

    if (!nome || !idade) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch(`${API}/pessoas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, idade })
    })
    .then(() => {
        nomeInput.value = "";
        idadeInput.value = "";
        carregarPessoas();
    });
}

// ENTER para cadastrar
idadeInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        cadastrarPessoa();
    }
});

// ===============================
// INICIAR EDIÇÃO INLINE
// ===============================
function iniciarEdicao(e) {
    const item = e.target.closest(".item");
    const id = item.dataset.id;

    const nomeEl = item.querySelector(".nome");
    const idadeEl = item.querySelector(".idade");

    const nomeAtual = nomeEl.textContent;
    const idadeAtual = idadeEl.textContent;

    item.querySelector(".info").innerHTML = `
        <input type="text" class="edit-nome" value="${nomeAtual}">
        <input type="number" class="edit-idade" value="${idadeAtual}" min="0">
    `;

    const inputNome = item.querySelector(".edit-nome");
    const inputIdade = item.querySelector(".edit-idade");

    inputNome.focus();

    // ENTER confirma
    item.addEventListener("keydown", function handler(event) {
        if (event.key === "Enter") {
            confirmarEdicao(id, inputNome.value, inputIdade.value);
            item.removeEventListener("keydown", handler);
        }

        if (event.key === "Escape") {
            carregarPessoas();
            item.removeEventListener("keydown", handler);
        }
    });
}

// ===============================
// CONFIRMAR EDIÇÃO
// ===============================
function confirmarEdicao(id, novoNome, novaIdade) {
    if (!novoNome || !novaIdade) {
        alert("Campos inválidos.");
        return;
    }

    fetch(`${API}/pessoas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: novoNome,
            idade: novaIdade
        })
    })
    .then(() => carregarPessoas());
}

// ===============================
// EXCLUIR
// ===============================
function excluirPessoa(e) {
    const item = e.target.closest(".item");
    const id = item.dataset.id;

    if (confirm("Tem certeza que deseja excluir?")) {
        fetch(`${API}/pessoas/${id}`, {
            method: "DELETE"
        })
        .then(() => carregarPessoas());
    }
}

// ===============================
carregarPessoas();
