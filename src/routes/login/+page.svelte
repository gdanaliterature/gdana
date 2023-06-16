<script lang="ts">
    import type { ActionData } from "./$types";

    export let form: ActionData;

</script>

<form method="POST" action="?/login">
    <h2>
        Login
    </h2>
    <p>For area use only</p>
    <div>
        <label for="username">
            Username:
        </label>
        <input type="text" name="username" id="username" placeholder="username">
    </div>
    <div>
        <label for="password">
            Password:
        </label>
        <input type="password" name="password" id="password" placeholder="password">
    </div>
    <div class="buttons">
        <button type="submit">
            Login
        </button>
        <!-- <button formaction="?/register">
            Register
        </button> -->
    </div>
    {#if form?.invalid }
        <div class="error">
            Invalid username or password
        </div>
    {/if}
</form>

<style>
    p{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.7rem;
    }
</style>