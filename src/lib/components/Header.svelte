<script lang="ts">
    import {page} from '$app/stores';
    
    export let loggedIn: boolean = false;
</script>
<nav>
    <a aria-current={$page.url.pathname==='/order'} href="/order">Order</a>
    <a aria-current={$page.url.pathname==='/inventory'} href="/inventory">Inventory</a>
    {#if !loggedIn}
        <a aria-current={$page.url.pathname==='/login'} href="/login">Login</a>
    {:else}
        <a href="/logout">Logout</a>
        <a aria-current={$page.url.pathname==='/manage'} href="/manage">Manage</a>
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
        background-image: linear-gradient(45deg, var(--primary), var(--primary-light));
        border: 1px solid var(--accent);
        text-decoration: none;
        color: var(--neutral-dark);
        &:first-of-type{
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
        }
        &:last-of-type{
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
        }
        &[aria-current]:not([aria-current="false"]){
            text-decoration: underline;
            border-color: var(--secondary);
        }
    }
</style>