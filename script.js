const API = "https://analise-demografica-ibge.onrender.com"; // ajuste se necessário

const nomeInput = document.getElementById("nome");
const idadeInput = document.getElementById("idade");
const cidadeInput = document.getElementById("cidade");
const lista = document.getElementById("lista");
const btnSalvar = document.getElementById("btnSalvar");
const mensagem = document.getElementById("mensagem");

// ===============================
// EVENTOS
// ===============================

// Clique no botão
btnSalvar.addEventListener("click", cadastrarPessoa);

// ENTER no campo idade ou cidade
[nomeInput, idadeInput, cidadeInput].forEach(input => {
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            cadastrarPessoa();
        }
    });
});

// ===============================
// MENSAGEM VISUAL
// ===============================
function mostrarMensagem(texto, tipo = "sucesso") {
    mensagem.innerHTML = `<div class="msg ${tipo}">${texto}</div>`;

    setTimeout(() => {
        mensagem.innerHTML = "";
    }, 2500);
}

// ===============================
// CARREGAR PESSOAS
// ===============================
function carregarPessoas() {
    fetch(`${API}/pessoas`)
        .then(res => res.json())
        .then(data => {
            lista.innerHTML = "";

            data.forEach(pessoa => {
                const li = document.createElement("li");
                li.classList.add("item");
                li.dataset.id = pessoa.id;

                li.innerHTML = `
                    <span>
                        <strong>${pessoa.nome}</strong> - 
                        ${pessoa.idade} anos - 
                        ${pessoa.cidade}
                    </span>
                    <div>
                        <button class="btn-editar">Editar</button>
                        <button class="btn-excluir">Excluir</button>
                    </div>
                `;

                lista.appendChild(li);
            });

            adicionarEventos();
        });
}

// ===============================
// CADASTRAR
// ===============================
function cadastrarPessoa() {
    const nome = nomeInput.value.trim();
    const idade = idadeInput.value.trim();
    const cidade = cidadeInput.value.trim();

    if (!nome || !idade || !cidade) {
        mostrarMensagem("Preencha todos os campos!", "erro");
        return;
    }

    fetch(`${API}/pessoas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, idade, cidade })
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao cadastrar");
        return res.json();
    })
    .then(() => {
        nomeInput.value = "";
        idadeInput.value = "";
        cidadeInput.value = "";
        carregarPessoas();
        mostrarMensagem("Pessoa cadastrada com sucesso!");
    })
    .catch(() => {
        mostrarMensagem("Erro ao cadastrar!", "erro");
    });
}

// ===============================
// EVENTOS DOS BOTÕES
// ===============================
function adicionarEventos() {
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", editarPessoa);
    });

    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", excluirPessoa);
    });
}

// ===============================
// EDITAR
// ===============================
function editarPessoa(e) {
    const item = e.target.closest(".item");
    const id = item.dataset.id;

    const texto = item.querySelector("span").innerText.split(" - ");
    const nomeAtual = texto[0];
    const idadeAtual = texto[1].replace(" anos", "");
    const cidadeAtual = texto[2];

    item.innerHTML = `
        <input type="text" value="${nomeAtual}" class="edit-nome">
        <input type="number" value="${idadeAtual}" class="edit-idade">
        <input type="text" value="${cidadeAtual}" class="edit-cidade">
        <button class="btn-salvar-edicao">Salvar</button>
    `;

    const inputNome = item.querySelector(".edit-nome");

    inputNome.focus();

    item.addEventListener("keydown", function handler(event) {
        if (event.key === "Enter") {
            confirmarEdicao(id, item);
            item.removeEventListener("keydown", handler);
        }
    });

    item.querySelector(".btn-salvar-edicao")
        .addEventListener("click", () => confirmarEdicao(id, item));
}

// ===============================
// CONFIRMAR EDIÇÃO
// ===============================
function confirmarEdicao(id, item) {
    const nome = item.querySelector(".edit-nome").value.trim();
    const idade = item.querySelector(".edit-idade").value.trim();
    const cidade = item.querySelector(".edit-cidade").value.trim();

    if (!nome || !idade || !cidade) {
        mostrarMensagem("Campos inválidos!", "erro");
        return;
    }

    fetch(`${API}/pessoas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, idade, cidade })
    })
    .then(() => {
        carregarPessoas();
        mostrarMensagem("Edição salva com sucesso!");
    });
}

// ===============================
// EXCLUIR
// ===============================
function excluirPessoa(e) {
    const item = e.target.closest(".item");
    const id = item.dataset.id;

    if (!confirm("Deseja realmente excluir?")) return;

    fetch(`${API}/pessoas/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        carregarPessoas();
        mostrarMensagem("Pessoa removida!");
    });
}

// ===============================
carregarPessoas();
