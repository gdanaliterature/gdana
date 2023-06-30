<script lang="ts">
    import type { order_item } from "@prisma/client";

    export let data;

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

    const categories: string[] = [
		'Book',
		'Booklet',
		'Small Booklet',
		'Pamphlet',
		'Keytag',
		'Medallion',
		'Service Product'
	];
</script>

{#if data.orders.length}
    <div id="orders">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <form class="order" method="POST">
            <div class="collapse" on:click={()=> { showOpenOrders = !showOpenOrders}}>
                <h2><u>Open Orders</u></h2>
            </div>
            {#if showOpenOrders}
                {#each data.orders as order}
                    <div>
                        Order #{order.id} - 
                        <span class="meetingName" title={getMeeting(order.meetingId)?.name} >
                            {getMeeting(order.meetingId)?.name} 
                        </span>
                        - ${getOrderTotal(getOrderItems(order.id)).toFixed(2)}
                    </div>
                    {#if data.admin}
                        <div>
                            {order.name} - {order.phone}
                        </div>
                    {/if}
                    <ul>
                        {#each getOrderItems(order.id) as item}
                        <li>{item.quantity} x {getBook(item.itemId)?.title}</li>
                        {/each}
                    </ul>
                    <input type="hidden" name={'order'} id={"order"+order.id} value={order.id}>
                    {#if data.admin}
                        <button formaction="?/complete">Complete Order</button>
                    {/if}
                {/each}
            {/if}
        </form>
    </div>
{/if}
    <form id="inventory" method="POST">
        <h2>Inventory</h2>
        <div class="cols">
            {#each categories as cat}
                <div class="category">
                    <div>
                        <h3>{cat}</h3>
                    </div>
                    <br>

                    {#each data.literature.filter(lit=>lit.category == cat) as item, itemIter}
                        <div>
                            {#if data.admin}
                                <input type="hidden" name={'item'+itemIter} id={'item'+itemIter} value={item.id}>
                                <input type='number' min=0 id={'quantity'+itemIter} name={'quantity'+itemIter} class="quantity" value={item.quantity} required>
                            {:else}
                                {item.quantity}
                            {/if}
                            <p>x</p>
                            {item.title}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
        {#if data.admin}
            <div class="buttons">
                <button formaction="?/update">Update Inventory</button>
            </div>
        {/if}
    </form>

<style lang='scss'>

    form{
        margin: 1rem 0rem;
    }
    #orders{
        display: flex;
        flex-direction: column;
        justify-content: center;

        .order{
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

    .collapse{
        cursor: pointer;
        width: 100%;
        &:hover{
            background-color: rgba(0,0,0,0.1);
        }
    }

    .cols{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        .category{
            display: flex;
            flex-direction: column;
            flex-basis: 1rem;
            align-self: flex-start;
            align-items: flex-start;
        }
        h3{
            width: max-content;
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