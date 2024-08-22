<script lang="ts">
  import { page } from "$app/stores";
  import Metrics from "$lib/components/Metrics.svelte";

  const accountName = $page.url.searchParams.get("accountName");
</script>

<Metrics {accountName} />
