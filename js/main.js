/* --------------- Importações --------------- */
import { formatarMoeda, formatarCotacao } from "./formatar.js";
import { obterValorEmReais, buscarHistoricoPar } from "./api.js";
import {
    inputValor, botaoConverter, divResultado, selectOrigem, selectDestino,
    botaoInverter, dataCotacao, mostrarErro, limparErro, definirCarregando, inverterMoedas, iniciarSelects
} from "./ui.js";
import { esconderGrafico, atualizarGrafico } from "./grafico.js";


/* --------------- Funções --------------- */

async function converter() {
    limparErro();
    divResultado.textContent = "";
    dataCotacao.hidden = true;
    esconderGrafico();

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

        atualizarGrafico(origem, destino);
    } catch (erro) {
        console.error(erro);
        mostrarErro("Não foi possível obter a cotação. Verifique sua conexão e tente novamente");
    } finally {
        definirCarregando(false);
    }
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

iniciarSelects();


/* --------------- Botões --------------- */

botaoConverter.addEventListener("click", converter);
botaoInverter.addEventListener("click", inverterMoedas);