<script>
    import '../app.scss';
    import Header from "$lib/components/Header.svelte";
    import logo from '$lib/static/logo.jpg';
    import { page } from '$app/stores';
</script>

<div id="main-container">
    <a href='/' class="home">
        <img id="logo" src={logo} alt="NA logo">
        <h1>
            Greater Danbury Area Literature
        </h1>
    </a>
    <Header bind:loggedIn={$page.data.admin}></Header>
    <div id="main-content">
        <slot></slot>
    </div>
</div>
    
<style lang="scss">
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
        display: inline-flex;
        align-items: center;
        border-radius: 4rem;;
        padding: 0 1rem 0 0;
        &:hover{
            background-color: rgba(0,0,0,0.2);
        }
        img{
            margin: 0 1rem 0 0;
        }
    }

    #logo{
        border-radius: 4rem;
    }
</style>