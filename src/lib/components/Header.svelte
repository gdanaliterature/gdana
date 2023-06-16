<script lang="ts">
    export let loggedIn: Boolean = false;
</script>
<nav>
    <a href="/order">Order</a>
    <a href="/inventory">Inventory</a>
    {#if !loggedIn}
        <a href="/login">Login</a>
    {:else}
        <a href="/logout">Logout</a>
    {/if}
</nav>

<style lang="scss">
    nav{
        display: flex;
        flex-direction: row;
        padding: 1rem 0rem;
    }
    a{
        padding: 1rem;;
        background-image: linear-gradient(45deg, var(--secondary), var(--secondary-light));
        border: 1px solid var(--accent);
        text-decoration: none;
        color: black;
        &:first-of-type{
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
        }
        &:last-of-type{
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
        }
    }
</style>