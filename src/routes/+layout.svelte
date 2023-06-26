<script>
    import '../app.scss';
    import Header from "$lib/components/Header.svelte";
    import logo from '$lib/static/logo.jpg';
    import { page } from '$app/stores';
</script>

<div id="main-container">
    <a href='/' class="home">
    <img src={logo} alt="NA logo">
    <h1>
            Greater Danbury Area Literature
        </h1>
    </a>
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