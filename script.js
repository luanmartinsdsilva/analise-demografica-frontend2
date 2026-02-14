const API_URL = "https://analise-demografica-ibge.onrender.com";

const lista = document.getElementById("lista");
const btnSalvar = document.getElementById("btnSalvar");

btnSalvar.addEventListener("click", salvarPessoa);

async function listarPessoas() {
    const response = await fetch(`${API_URL}/pessoas`);
    const pessoas = await response.json();

    lista.innerHTML = "";

    pessoas.forEach(p => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span><strong>${p.nome}</strong> - ${p.idade} anos - ${p.cidade}</span>
            <div class="actions">
                <button onclick="editarPessoa(${p.id}, '${p.nome}', ${p.idade}, '${p.cidade}')">Editar</button>
                <button onclick="deletarPessoa(${p.id})">Excluir</button>
            </div>
        `;

        lista.appendChild(li);
    });
}

function editarPessoa(id, nome, idade, cidade) {
    document.getElementById("pessoaId").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("idade").value = idade;
    document.getElementById("cidade").value = cidade;
    btnSalvar.innerText = "Atualizar";
}

async function salvarPessoa() {
    const id = document.getElementById("pessoaId").value;
    const nome = document.getElementById("nome").value;
    const idade = parseInt(document.getElementById("idade").value);
    const cidade = document.getElementById("cidade").value;

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/pessoas/${id}` : `${API_URL}/pessoas`;

    await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, idade, cidade })
    });

    limparFormulario();
    listarPessoas();
}

async function deletarPessoa(id) {
    await fetch(`${API_URL}/pessoas/${id}`, { method: "DELETE" });
    listarPessoas();
}

function limparFormulario() {
    document.getElementById("pessoaId").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("cidade").value = "";
    btnSalvar.innerText = "Cadastrar";
}

listarPessoas();
