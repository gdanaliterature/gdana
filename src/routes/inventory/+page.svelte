<script lang="ts">
    import type { order_item } from "@prisma/client";
    import type { PageData } from "./$types";

    export let data: PageData;

    let showOpenOrders: boolean = true;

    const getMeeting = (meetingId: number)=> {
        return data.meetings.find(meeting => meeting.id == meetingId);
    }

    const getOrderItems = (orderId: number)=> {
        let items: order_item[] = [];
        data.order_items?.forEach(item=> {
            if(item.orderId == orderId){
                items.push(item)
            };
        })
        return items;
    }

    const getBook = (itemId: number)=>{
        return data.literature.find(book=>book.id == itemId);
    }

    const getOrderTotal = (items: order_item[])=> {
        let total = 0.0;
        items?.forEach(item => {
            total += getBook(item.itemId)!.price * item.quantity;
        });
        return total;
    }
</script>

{#if data.orders.length}
    <div id="orders">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <h2><u style="cursor: pointer" on:click={()=> { showOpenOrders = !showOpenOrders}}>Open Orders</u></h2>
        {#if showOpenOrders}
            {#each data.orders as order}
            <form class="order" method="POST">
                <div>
                    Order #{order.id} - 
                    <span class="meetingName" title={getMeeting(order.meetingId)?.name} >
                        {getMeeting(order.meetingId)?.name} 
                    </span>
                    - ${getOrderTotal(getOrderItems(order.id)).toFixed(2)}
                </div>
                <ul>
                    {#each getOrderItems(order.id) as item}
                    <li>{item.quantity} x {getBook(item.itemId)?.title}</li>
                    {/each}
                </ul>
                <input type="hidden" name={'order'} id={"order"+order.id} value={order.id}>
                {#if data.admin}
                    <button formaction="?/complete">Complete Order</button>
                {/if}
            </form>
            {/each}
        {/if}
    </div>
{/if}
    <h2>Inventory</h2>
    <form id="inventory" method="POST">
        {#each data.literature as item}
            <div>
                {#if data.admin}
                    <input type='number' min=0 name={'quantity'+item.id} class="quantity" value={item.quantity}>
                {:else}
                    {item.quantity}
                {/if}
                <p>x</p>
                {item.title}
            </div>
        {/each}
        {#if data.admin}
        <div class="buttons">
            <button formaction="?/update">Update Inventory</button>
        </div>
        {/if}
    </form>

<style lang='scss'>
    #orders{
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0rem 1rem;

        .order{
            border: 2px solid var(--accent);
            border-radius: 0.5rem;
            margin: 0.25rem;
            padding: 1rem;
            display: flex;
            flex-direction: column;

            @media only screen and (max-width: 480px) {
                .meetingName{
                display: inline-flex; 
                max-width: 8rem; 
                overflow-x: hidden; 
                text-wrap: nowrap;
            }
                
            }
            @media only screen and (min-width: 600px) {
                align-items: center;
            }
        }

    }
    h2{
        display: flex;
        justify-content: center;
    }

    #inventory{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        div{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex: 1 1 20rem;
        }
        p{
            display: flex;
            align-items: center;
            padding: 0.5rem;
        }
        .quantity{
            width: 3rem;
        }
    }
        
</style>