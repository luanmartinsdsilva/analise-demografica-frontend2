const API = "https://analise-demografica-ibge.onrender.com";

const nomeInput = document.getElementById("nome");
const idadeInput = document.getElementById("idade");
const lista = document.getElementById("lista");

// ===============================
// CARREGAR
// ===============================
function carregarPessoas() {
    fetch(`${API}/pessoas`)
        .then(res => res.json())
        .then(data => {
            lista.innerHTML = "";

            data.forEach(pessoa => {
                const div = criarItem(pessoa);
                lista.appendChild(div);
            });
        });
}

// ===============================
// CRIAR ITEM
// ===============================
function criarItem(pessoa) {
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

    div.querySelector(".btn-editar").addEventListener("click", iniciarEdicao);
    div.querySelector(".btn-excluir").addEventListener("click", excluirPessoa);

    return div;
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
    .then(res => res.json())
    .then(novaPessoa => {
        const novoItem = criarItem(novaPessoa);
        lista.prepend(novoItem);
        novoItem.classList.add("success");

        nomeInput.value = "";
        idadeInput.value = "";
    });
}

idadeInput.addEventListener("keydown", e => {
    if (e.key === "Enter") cadastrarPessoa();
});

// ===============================
// EDIÇÃO INLINE
// ===============================
function iniciarEdicao(e) {
    const item = e.target.closest(".item");
    const id = item.dataset.id;

    const nomeAtual = item.querySelector(".nome").textContent;
    const idadeAtual = item.querySelector(".idade").textContent;

    item.innerHTML = `
        <input type="text" class="edit-nome" value="${nomeAtual}">
        <input type="number" class="edit-idade" value="${idadeAtual}">
    `;

    const inputNome = item.querySelector(".edit-nome");
    const inputIdade = item.querySelector(".edit-idade");

    inputNome.focus();

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
function confirmarEdicao(id, nome, idade) {
    fetch(`${API}/pessoas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, idade })
    })
    .then(() => carregarPessoas());
}

// ===============================
// EXCLUIR COM ANIMAÇÃO
// ===============================
function excluirPessoa(e) {
    const item = e.target.closest(".item");
    const id = item.dataset.id;

    if (confirm("Deseja realmente excluir?")) {
        item.style.animation = "slideOut 0.3s forwards";

        setTimeout(() => {
            fetch(`${API}/pessoas/${id}`, {
                method: "DELETE"
            })
            .then(() => item.remove());
        }, 300);
    }
}

carregarPessoas();
