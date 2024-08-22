<script context="module" lang="ts">
  export type Trade = {
    date_open: string;
    date_close: string;
    price_open: string;
    price_close: string;
    account_name: string;
    direction: string;
    coin: string;
    pnl: string;
    text: string;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import Papa from "papaparse";
  import { GET_METRICS } from "$lib/api";
  import { merge, mergeMap, pipe, tap } from "rxjs";
  import { Fetcher } from "san-webkit-next/api";
  import { useObserveFnCall } from "san-webkit-next/utils";
  import Chart from "$lib/components/Chart.svelte";

  const queryMetrics = Fetcher(
    GET_METRICS,
    (gql: { getMetric: { data: { d: string; v: number }[] } }) =>
      gql.getMetric.data
  );

  const { accountName }: { accountName: string } = $props();

  const variables = {
    from: "2021-11-09T08:45:00.000Z",
    to: "2024-02-12T00:00:00.000Z",
    interval: "15m",
  };

  let metrics = $state.raw<{
    bitcoin?: { d: string; v: number }[];
    ethereum?: { d: string; v: number }[];
  }>({});

  let trades = $state.raw<Trade[]>([]);

  const fetchMetrics = useObserveFnCall(() =>
    pipe(
      mergeMap(() =>
        merge(
          queryMetrics()({ ...variables, slug: "bitcoin" }).pipe(
            tap((data) => {
              metrics = { ...metrics, bitcoin: data };
            })
          ),

          queryMetrics()({ ...variables, slug: "ethereum" }).pipe(
            tap((data) => {
              metrics = { ...metrics, ethereum: data };
            })
          )
        )
      )
    )
  );

  const loadTrades = () => {
    Papa.parse("/shilling_data3.csv", {
      download: true,
      header: true,
      complete: function (results: { data: Trade[] }) {
        trades = results.data;
      },
    });
  };

  const filterCoin = (trades: Trade[], coin: string) => {
    return trades.filter((trade) => trade.coin === coin);
  };

  const filterAuthor = (trades: Trade[], accountName?: string) => {
    return accountName
      ? trades.filter((trade) => trade.account_name === accountName)
      : trades;
  };

  onMount(() => {
    fetchMetrics();
    loadTrades();
  });
</script>

<div>
  <h3>Bitcoin</h3>
  <Chart
    color="rgba(75, 192, 192, 1)"
    trades={filterAuthor(filterCoin(trades, "bitcoin"), accountName)}
    prices={metrics?.bitcoin}
  />
</div>
<div>
  <h3>Ethereum</h3>
  <Chart
    color="rgba(236, 155, 250, 1)"
    trades={filterAuthor(filterCoin(trades, "ethereum"), accountName)}
    prices={metrics?.ethereum}
  />
</div>
