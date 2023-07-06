<script lang="ts">
    import {page} from '$app/stores';
    
    export let loggedIn: boolean = false;

    let showLiteratureDD = false;
</script>
<nav>
    <span class="dropdown-nav" 
        on:mouseenter={()=>showLiteratureDD=true} 
        on:mouseleave={()=>showLiteratureDD=false}
    >
        <a aria-current={$page.url.pathname.indexOf('literature')>=0} href="/literature/">Literature</a>
        {#if showLiteratureDD}
            <a aria-current={$page.url.pathname==='/literature/order'} href="/literature/order">Order</a>
            <a aria-current={$page.url.pathname==='/literature/inventory'} href="/literature/inventory">Inventory</a>
        {/if}
    </span>
    {#if !loggedIn}
        <span>
            <a aria-current={$page.url.pathname==='/login'} href="/login">Login</a>
        </span>
    {:else}
        <span>
            <a aria-current={$page.url.pathname==='/manage'} href="/manage">Manage</a>
        </span>
        <span>
            <a href="/logout">Logout</a>
        </span>
    {/if}
</nav>

<style lang="scss">
    nav{
        margin-left: -1.5rem;
        width: 100vw;
        display: flex;
        flex-direction: row;
        padding: 1rem 0rem;

        span{
            display: flex;
            flex-direction: column;
            flex-grow: 1;

            a:not(:first-child){
                padding: 0.5rem 1.5rem;
                position:relative
            }
        }

        a {
            padding: 1rem;
            background-image: linear-gradient(45deg, var(--primary), var(--primary-light));
            text-decoration: none;
            color: var(--neutral-dark);
            &[aria-current]:not([aria-current="false"]){
                text-decoration: underline;
                background-image: linear-gradient(45deg, var(--secondary), var(--secondary-light));
            }
        }
    }
</style>