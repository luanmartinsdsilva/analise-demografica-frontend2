const API = "https://analise-demografica-ibge.onrender.com";

const nomeInput = document.getElementById("nome");
const idadeInput = document.getElementById("idade");
const cidadeInput = document.getElementById("cidade");
const btnSalvar = document.getElementById("btnSalvar");
const lista = document.getElementById("lista");

const filtroNome = document.getElementById("filtroNome");
const filtroCidade = document.getElementById("filtroCidade");

const totalEl = document.getElementById("totalPessoas");
const mediaEl = document.getElementById("mediaIdade");
const maisVelhaEl = document.getElementById("maisVelha");
const maisNovaEl = document.getElementById("maisNova");

let grafico;

// EVENTOS
btnSalvar.addEventListener("click", cadastrarPessoa);
filtroNome.addEventListener("input", carregarPessoas);
filtroCidade.addEventListener("input", carregarPessoas);

function cadastrarPessoa() {
    const nome = nomeInput.value.trim();
    const idade = idadeInput.value.trim();
    const cidade = cidadeInput.value.trim();

    if (!nome || !idade || !cidade) return;

    fetch(`${API}/pessoas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, idade, cidade })
    }).then(() => {
        nomeInput.value = "";
        idadeInput.value = "";
        cidadeInput.value = "";
        carregarPessoas();
    });
}

function carregarPessoas() {
    fetch(`${API}/pessoas`)
        .then(res => res.json())
        .then(data => {

            const nomeFiltro = filtroNome.value.toLowerCase();
            const cidadeFiltro = filtroCidade.value.toLowerCase();

            const filtrados = data.filter(p =>
                p.nome.toLowerCase().includes(nomeFiltro) &&
                p.cidade.toLowerCase().includes(cidadeFiltro)
            );

            atualizarDashboard(filtrados);
            atualizarGrafico(filtrados);

            lista.innerHTML = "";

            filtrados.forEach(pessoa => {
                const li = document.createElement("li");
                li.classList.add("item");
                li.innerHTML = `
                    <span><strong>${pessoa.nome}</strong> - ${pessoa.idade} anos - ${pessoa.cidade}</span>
                `;
                lista.appendChild(li);
            });
        });
}

function atualizarDashboard(data) {
    if (data.length === 0) {
        totalEl.innerText = 0;
        mediaEl.innerText = 0;
        maisVelhaEl.innerText = "-";
        maisNovaEl.innerText = "-";
        return;
    }

    let soma = 0;
    let maisVelha = data[0];
    let maisNova = data[0];

    data.forEach(p => {
        soma += Number(p.idade);
        if (p.idade > maisVelha.idade) maisVelha = p;
        if (p.idade < maisNova.idade) maisNova = p;
    });

    totalEl.innerText = data.length;
    mediaEl.innerText = (soma / data.length).toFixed(1);
    maisVelhaEl.innerText = `${maisVelha.nome} (${maisVelha.idade})`;
    maisNovaEl.innerText = `${maisNova.nome} (${maisNova.idade})`;
}

function atualizarGrafico(data) {
    const ctx = document.getElementById("graficoIdades");

    const labels = data.map(p => p.nome);
    const idades = data.map(p => p.idade);

    if (grafico) grafico.destroy();

    grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Idade",
                data: idades
            }]
        },
        options: {
            animation: {
                duration: 1000
            }
        }
    });
}

carregarPessoas();
