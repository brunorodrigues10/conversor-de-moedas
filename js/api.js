const URL_BASE = "https://economia.awesomeapi.com.br/json";

export async function obterValorEmReais(codigo) {
    if (codigo === "BRL") {
        return { valor: 1, timestamp: null };
    }

    const url = `${URL_BASE}/last/${codigo}-BRL`;
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

async function buscarHistorico(codigo, dias = 15) {
    const url = `${URL_BASE}/daily/${codigo}-BRL/${dias}`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status} ao buscar histórico de ${codigo}`);
    }

    const dados = await resposta.json();

    dados.reverse();

    return dados.map((item) => ({
        data: new Date(Number(item.timestamp) * 1000).toLocaleDateString("pt-BR"),
        valor: Number(item.bid),
    }));
}

export async function buscarHistoricoPar(origem, destino, dias = 15) {
    const [historicoOrigem, historicoDestino] = await Promise.all([
        origem === "BRL" ? null : buscarHistorico(origem, dias),
        destino === "BRL" ? null : buscarHistorico(destino, dias),
    ]);

    // Origem é BRL: 1 real vale (1 ÷ cotação da moeda de destino)
    if (!historicoOrigem) {
        return historicoDestino.map((item) => ({
            data: item.data,
            valor: 1 / item.valor,
        }));
    }

    // Destino é BRL: o histórico da origem já está em reais
    if (!historicoDestino) {
        return historicoOrigem;
    }

    // Nenhuma é BRL: divide dia a dia, só nas datas que existem nas duas
    const valoresDestino = new Map(
        historicoDestino.map((item) => [item.data, item.valor]),
    );

    return historicoOrigem
        .filter((item) => valoresDestino.has(item.data))
        .map((item) => ({
            data: item.data,
            valor: item.valor / valoresDestino.get(item.data),
        }));
}