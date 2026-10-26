import { moedas } from "./moedas.js";

export const inputValor = document.querySelector("#valor");
export const botaoConverter = document.querySelector("#botao-converter");
export const divResultado = document.querySelector("#resultado");
export const selectOrigem = document.querySelector("#moeda-origem");
export const selectDestino = document.querySelector("#moeda-destino");
export const botaoInverter = document.querySelector("#botao-inverter");
export const dataCotacao = document.querySelector("#data-cotacao");

const mensagemErro = document.querySelector("#mensagem-erro");
const carregando = document.querySelector("#carregando");


export function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.hidden = false;
}

export function limparErro() {
    mensagemErro.textContent = "";
    mensagemErro.hidden = true;
}

export function definirCarregando(estaCarregando) {
    carregando.hidden = !estaCarregando;
    botaoConverter.disabled = estaCarregando;
}

export function inverterMoedas() {
    const temporario = selectOrigem.value;
    selectOrigem.value = selectDestino.value;
    selectDestino.value = temporario;
}

function preencherSelect(select) {
    moedas.forEach((moeda) => {
        const option = document.createElement("option");
        option.value = moeda.codigo;
        option.textContent = `${moeda.codigo} - ${moeda.nome}`;
        select.appendChild(option);
    });
}

export function iniciarSelects() {
    preencherSelect(selectOrigem);
    preencherSelect(selectDestino);

    selectOrigem.value = "USD";
    selectDestino.value = "BRL";
}