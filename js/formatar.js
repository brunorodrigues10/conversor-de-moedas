export function formatarMoeda(valor, codigo) {
    const casasMaximas = codigo === "BTC" ? 8 : 2;

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: codigo,
        maximumFractionDigits: casasMaximas,
    }).format(valor);
}

export function formatarCotacao(valor) {
    return valor.toLocaleString("pt-BR", { maximumSignificantDigits: 6 });
}