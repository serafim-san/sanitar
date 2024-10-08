<script lang="ts">
  import { Chart } from "chart.js/auto";
  import type { Trade } from "./Metrics.svelte";

  const {
    prices,
    trades = [],
    color,
  }: {
    color: string;
    trades?: Trade[];
    prices: { d: string; v: number }[];
  } = $props();

  function mountChart(element: HTMLCanvasElement, data: any) {
    Chart.getChart(canvasElement)?.destroy();

    new Chart(element, {
      type: "line",
      options: {
        elements: {
          point: {
            radius: 0,
          },
        },
        animation: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const trade = trades?.[context.dataIndex];

                return trade?.text
                  ? `@${trade.account_name}: ${trade.text}`
                  : undefined;
              },
            },
          },
        },
      },
      data,
    });
  }

  let canvasElement: HTMLCanvasElement;

  const unifiedDateStr = (dateStr: string) =>
    new Date(dateStr.endsWith("Z") ? dateStr : dateStr + "Z").toISOString();

  $effect(() => {
    const labels = (prices || []).map((item) => unifiedDateStr(item.d));

    const datasets = [
      {
        label: "Opens",
        data: trades.map((trade) => ({
          x: unifiedDateStr(trade.date_open),
          y: parseFloat(trade.price_open),
        })),
        pointStyle: trades.map((trade) =>
          trade.direction === "long" ? "triangle" : "triangle"
        ),
        rotation: trades.map((trade) => (trade.direction === "long" ? 0 : 180)),
        pointBackgroundColor: trades.map((trade) =>
          trade.direction === "long" ? "#42fca5" : "red"
        ),
        borderColor: "rgba(0, 0, 0, 0)",
        pointRadius: 10,
        pointHoverRadius: 12,
        showLine: false,
      },
      {
        label: "Closes",
        data: trades.map((trade) => ({
          x: unifiedDateStr(trade.date_close),
          y: parseFloat(trade.price_close),
        })),
        pointStyle: "triangle",
        hitRadius: 4,
        rotation: trades.map((trade) => (trade.direction === "long" ? 180 : 0)),
        pointBackgroundColor: trades.map((trade) =>
          trade.direction === "long" ? "green" : "#910404"
        ),
        borderColor: "rgba(0, 0, 0, 0)",
        pointRadius: 10,
        pointHoverRadius: 12,
        showLine: false,
      },
      {
        label: "Price",
        data: (prices || []).map((item) => item.v),
        borderColor: color,
        borderWidth: 1,
        fill: false,
      },
    ];

    mountChart(canvasElement, { labels, datasets });
  });
</script>

<div style="width: 100%;"><canvas bind:this={canvasElement} /></div>
