/* --------------- Variáveis --------------- */
const inputValor = document.querySelector("#valor");
const botaoConverter = document.querySelector("#botao-converter");
const divResultado = document.querySelector("#resultado");
const selectOrigem = document.querySelector("#moeda-origem");
const selectDestino = document.querySelector("#moeda-destino");
const botaoInverter = document.querySelector("#botao-inverter");

const moedas = [
    { codigo: "BRL", nome: "Real Brasileiro" },
    { codigo: "USD", nome: "Dólar Americano" },
    { codigo: "EUR", nome: "Euro" },
    { codigo: "GBP", nome: "Libra Esterlina" },
    { codigo: "BTC", nome: "Bitcoin" },
    { codigo: "JPY", nome: "Iene Japonês" },
];

/* --------------- Variáveis --------------- */

/* --------------- Funções --------------- */

async function obterValorEmReais(codigo) {
    if (codigo === "BRL") {
        return 1;
    }

    const url = `https://economia.awesomeapi.com.br/json/last/${codigo}-BRL`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    return Number(dados[`${codigo}BRL`].bid);
}

function formatarMoeda(valor, codigo) {
    const casasMaximas = codigo === "BTC" ? 8 : 2;

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: codigo,
        maximumFractionDigits: casasMaximas,
    }).format(valor);
}

function preencherSelect(select) {
    moedas.forEach((moeda) => {
        const option = document.createElement("option");
        option.value = moeda.codigo;
        option.textContent = `${moeda.codigo} - ${moeda.nome}`;
        select.appendChild(option);
    });
}

preencherSelect(selectOrigem);
preencherSelect(selectDestino);

selectOrigem.value = "USD";
selectDestino.value = "BRL";
/* --------------- Funções --------------- */

/* --------------- Botões --------------- */

botaoConverter.addEventListener("click", async () => {
    const valor = Number(inputValor.value);
    const origem = selectOrigem.value;
    const destino = selectDestino.value;

    // const origemEmReais = await obterValorEmReais(origem);
    // const destinoEmReais = await obterValorEmReais(destino);

    const [origemEmReais, destinoEmReais] = await Promise.all([
        obterValorEmReais(origem),
        obterValorEmReais(destino)
    ]);

    const resultado = (valor * origemEmReais) / destinoEmReais;

    divResultado.textContent = `${formatarMoeda(valor, origem)} = ${formatarMoeda(resultado, destino)}`;
});

botaoInverter.addEventListener("click", () => {
    const temporario = selectOrigem.value;
    selectOrigem.value = selectDestino.value;
    selectDestino.value = temporario;
});

/* --------------- Botões --------------- */
