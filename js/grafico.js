import { buscarHistoricoPar } from "./api.js";
import { formatarCotacao } from "./formatar.js";

const areaGrafico = document.querySelector("#area-grafico");
const tituloGrafico = document.querySelector("#titulo-grafico");
const canvasGrafico = document.querySelector("#grafico");

let grafico = null;

function desenharGrafico(historico, origem, destino) {
    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(canvasGrafico, {
        type: "line",
        data: {
            labels: historico.map((item) => item.data.slice(0, 5)),
            datasets: [
                {
                    label: `1 ${origem} em ${destino}`,
                    data: historico.map((item) => item.valor),
                    borderColor: "#171717",
                    backgroundColor: "rgba(23, 23, 23, 0.08)",
                    borderWidth: 2,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (contexto) =>
                            `1 ${origem} = ${formatarCotacao(contexto.parsed.y)} ${destino}`,
                    },
                },
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    ticks: { callback: (valor) => formatarCotacao(valor) },
                },
            },
        },
    });
}

export function esconderGrafico() {
    areaGrafico.hidden = true;
}

export async function atualizarGrafico(origem, destino) {
    if (origem === destino) {
        areaGrafico.hidden = true;
        return;
    }

    try {
        const historico = await buscarHistoricoPar(origem, destino);

        if (historico.length < 2) {
            areaGrafico.hidden = true;
            return;
        }

        tituloGrafico.textContent = `${origem} → ${destino}, últimas ${historico.length} cotações diárias`;
        desenharGrafico(historico, origem, destino);
        areaGrafico.hidden = false;
    } catch (erro) {
        console.error(erro);
        areaGrafico.hidden = true;
    }
}