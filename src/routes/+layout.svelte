<script>
    import '../app.scss';
    import Header from "$lib/components/Header.svelte";
  import { page } from '$app/stores';
</script>

<div id="main-container">
    <h1>
        <a href='/' class="home">
            Greater Danbury Area Literature
        </a>
    </h1>
    <Header bind:loggedIn={$page.data.admin}></Header>
    <div id="main-content">
        <slot></slot>
    </div>
</div>
    
<style>
    #main-container{
        padding: 0rem 1rem;
    }

    #main-content{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .home{
        color: black;
    }
</style>