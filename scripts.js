/* --------------- Variáveis --------------- */
const inputValor = document.querySelector("#valor");
const botaoConverter = document.querySelector("#botao-converter");
const divResultado = document.querySelector("#resultado");
const selectOrigem = document.querySelector("#moeda-origem");
const selectDestino = document.querySelector("#moeda-destino");
const botaoInverter = document.querySelector("#botao-inverter");
const mensagemErro = document.querySelector("#mensagem-erro");
const carregando = document.querySelector("#carregando");
const dataCotacao = document.querySelector("#data-cotacao");


const moedas = [
    { codigo: "BRL", nome: "Real Brasileiro" },
    { codigo: "USD", nome: "Dólar Americano" },
    { codigo: "EUR", nome: "Euro" },
    { codigo: "GBP", nome: "Libra Esterlina" },
    { codigo: "BTC", nome: "Bitcoin" },
    { codigo: "CHF", nome: "Franco Suíço" },
];


/* --------------- Funções --------------- */

async function converter() {
    limparErro();
    divResultado.textContent = "";
    dataCotacao.hidden = true;

    const valor = Number(inputValor.value);
    const origem = selectOrigem.value;
    const destino = selectDestino.value;

    const erroValidacao = validarValor(valor);
    if (erroValidacao) {
        mostrarErro(erroValidacao);
        return;
    }

    definirCarregando(true);

    try {
        const [origemCotacao, destinoCotacao] = await Promise.all([
            obterValorEmReais(origem),
            obterValorEmReais(destino),
        ]);

        const resultado = (valor * origemCotacao.valor) / destinoCotacao.valor;

        divResultado.textContent = `${formatarMoeda(valor, origem)} = ${formatarMoeda(resultado, destino)}`;

        const timestamp = origemCotacao.timestamp ?? destinoCotacao.timestamp;

        if (timestamp) {
            dataCotacao.textContent = `Cotação de ${new Date(timestamp * 1000).toLocaleString("pt-BR")}`;
            dataCotacao.hidden = false;
        }
    } catch (erro) {
        console.error(erro);
        mostrarErro("Não foi possível obter a cotação. Verifique sua conexão e tente novamente");
    } finally {
        definirCarregando(false);
    }






}

async function obterValorEmReais(codigo) {
    if (codigo === "BRL") {
        return { valor: 1, timestamp: null };
    }

    const url = `https://economia.awesomeapi.com.br/json/last/${codigo}-BRL`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status} ao buscar ${codigo}-BRL`);
    }

    const dados = await resposta.json();
    const cotacao = dados[`${codigo}BRL`];

    if (!cotacao) {
        throw new Error(`Cotação de ${codigo} não encontrada na resposta`);
    }

    return { valor: Number(cotacao.bid), timestamp: Number(cotacao.timestamp) };
}

function inverterMoedas() {
    const temporario = selectOrigem.value;
    selectOrigem.value = selectDestino.value;
    selectDestino.value = temporario;
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

function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.hidden = false;
}

function limparErro() {
    mensagemErro.textContent = "";
    mensagemErro.hidden = true;
}

function definirCarregando(estaCarregando) {
    carregando.hidden = !estaCarregando;
    botaoConverter.disabled = estaCarregando;
}

function validarValor(valor) {
    if (inputValor.value.trim() === "") {
        return "Digite um valor para converter";
    }

    if (Number.isNaN(valor)) {
        return "O valor digitado não é um número válido";
    }

    if (valor <= 0) {
        return "O valor precisa ser maior que zero";
    }

    return null;
}

/* --------------- Inicialização --------------- */

preencherSelect(selectOrigem);
preencherSelect(selectDestino);

selectOrigem.value = "USD";
selectDestino.value = "BRL";


/* --------------- Botões --------------- */

botaoConverter.addEventListener("click", converter);

botaoInverter.addEventListener("click", inverterMoedas);
