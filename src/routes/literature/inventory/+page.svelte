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

    const completeOrder = (orderNum: number) => {
        document.getElementById('completedOrder')?.setAttribute('value', data.orders[orderNum].id.toString());
        document.getElementById('completeOrderBtn')?.click();
    }

    const cancelOrder = (orderNum: number) => {
        document.getElementById('canceledOrder')?.setAttribute('value', data.orders[orderNum].id.toString());
        document.getElementById('cancelOrderBtn')?.click();
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
                <h1><u>Open Orders</u></h1>
            </div>
            <input type="hidden" name='completedOrder' id="completedOrder">
            <input type="hidden" name='canceledOrder' id="canceledOrder">
            {#if showOpenOrders}
                {#each data.orders as order, orderIter}
                    {#if orderIter>0}
                    <hr>
                    {/if}
                    <div class="order-entry">
                        <div>
                            <span class="meetingName" title={getMeeting(order.meetingId)?.name} >
                                {getMeeting(order.meetingId)?.name} 
                            </span>
                            &nbsp- ${getOrderTotal(getOrderItems(order.id)).toFixed(2)}
                        </div>
                        {#if data.admin}
                            <div>
                                {order.name} - {order.phone}
                            </div>
                        {/if}
                        <div>
                            <ul>
                                {#each getOrderItems(order.id) as item}
                                    <li>{item.quantity} x {getBook(item.itemId)?.title}</li>
                                {/each}
                            </ul>
                        </div>
                            {#if data.admin}
                                <div>
                                    <button type="button" on:click={()=>completeOrder(orderIter)}>Complete</button>
                                    <button type="button" on:click={()=>cancelOrder(orderIter)}>Cancel</button>
                                </div>
                            {/if}
                        </div>
                    {/each}
                {/if}
            <button style="display:none;" formaction="?/complete" id="completeOrderBtn"></button>
            <button style="display:none;" formaction="?/cancel" id="cancelOrderBtn"></button>
        </form>
    </div>
{/if}
    <form id="inventory" method="POST">
        <h1>Inventory</h1>
        <div class="literature">
            {#each categories as cat, catIter}
                {#if data.literature.filter(lit=>lit.category == cat).length}
                    {#if catIter>0}
                    <hr>
                    {/if}
                    <div>
                        <h3>{cat}</h3>
                    </div>
                    <div class="category">
                        {#each data.literature.filter(lit=>lit.category == cat) as item, itemIter}
                            <div class='cat-item'>
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
                {/if}
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
            margin: 0.25rem;
            padding: 1rem;
            .order-entry{
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

    }
    h1{
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

    .literature{
        display: flex;
        flex-direction: column;
        .category{
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-self: flex-start;
            align-items: flex-start;
            @media only screen and (max-width: 800px){
                flex-direction: column;
            }
            @media only screen and (min-width: 800px){
                .cat-item{
                    flex-basis: 40%;
                    justify-content: flex-start;
                }
            }
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