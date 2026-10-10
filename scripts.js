const inputValor = document.querySelector("#valor");
const botaoConverter = document.querySelector("#botao-converter");
const divResultato = document.querySelector("#resultado");

const formatadorReal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const formatadorDolar = new Intl.NumberFormat("USD", {
    style: "currency",
    currency: "USD",
});


async function buscarCotacao() {
    const resposta = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
    const dados = await resposta.json();
    const cotacao = Number(dados.USDBRL.bid);
    return cotacao;
}

botaoConverter.addEventListener("click", async () => {
    const valor = Number(inputValor.value);
    const cotacao = await buscarCotacao();
    const resultado = valor * cotacao;

    divResultato.textContent = `${formatadorDolar.format(valor)} = ${formatadorReal.format(resultado)}`;
});


// buscarCotacao().then(valor => console.log("Cotação ", valor));