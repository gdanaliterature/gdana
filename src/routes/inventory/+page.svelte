<script lang="ts">
  import type { PageData } from "./$types";

    export let data: PageData;
</script>

{#if data.orders.length}
    <h2>Open Orders</h2>
    {#each data.orders as order}
        <div>
            
        </div>
    {/each}
{/if}