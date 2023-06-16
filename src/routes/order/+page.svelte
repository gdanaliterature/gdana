<script lang="ts">
  import type { literature } from '@prisma/client';
    import type { ActionData, PageData } from './$types.js';

    export let data: PageData;
    export let form: ActionData;

    const days: string[] = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    let orderItems: Partial<literature>[] = [];
    let bookMax: number[] = [];

    const addItem = ()=> {
        orderItems = [
            ...orderItems,
            {}
        ];
        bookMax = [
            ...bookMax, 10
        ]
    };

    const handleSelectChange = (event: Event, index: number)=> {
        console.log(orderItems);
        let book = data.books.find(book=> book.id == orderItems[index].id);
        if(book && book.quantity < 10){
            bookMax[index] = book.quantity;
        }
    }

    const deleteItem = (itemIter: number)=> {
        bookMax.splice(itemIter, 1);
        orderItems.splice(itemIter, 1);

        orderItems = orderItems;
    }

    const getBook = (itemId: number): literature =>{
        let book = data.books.find(book=>book.id == itemId);
        return book!;
    }

    const getOrderTotal = ()=> {
        let total = 0.0;
        form?.items?.forEach(item => {
            total += getBook(item.itemId)!.price * item.quantity;
        });
        return total;
    }

    const alreadySelected = (itemIdx: number, bookId: number)=> {
        let item = orderItems.find(it => it.id == bookId);
        let itemIndex = orderItems.findIndex(it => it.id == bookId)

        return item && itemIndex !== itemIdx;
    }

</script>

<form method="POST">
    <h2>Literature Order</h2>
    {#if !form?.order && !form?.items}
        <div>
            <label for="name">Name:</label>
            <input type="text" name="name" id="name" placeholder="John S" required>
        </div>
        <div>
            <label for="phone">Phone:</label>
            <input type="tel" id="phone" name="phone" title="format: 203 123 4567 OR 203-123-4567" pattern="^\d&#123;3&#125(\s|-)\d&#123;3&#125(-|\s)\d&#123;4&#125$" placeholder="203 123 4567" required>
        </div>
        <div>
            <label for="meeting">Meeting:</label>
            <select name="meeting" id="meeting" required>
                <option value="" selected disabled>Select Meeting</option>
                {#each data.meetings as meeting}
                    <option value={meeting.id}>
                        {days[meeting.day]}: {meeting.name}
                    </option>
                {/each}
            </select>
        </div>
        <div class="buttons">
            <button formaction="?/begin">Next</button>
        </div>
    {:else if !form?.items}
        <input type="hidden" name="order" value={JSON.stringify(form.order)}>
        {#each orderItems as item, itemIter}
            <div>
                <button class="x-btn" type="button" id={'delete'+itemIter} on:click={()=>deleteItem(itemIter)}>X</button>
                <label for={'item' + itemIter}>Item {itemIter+1}:</label>
                <input type="number" min=1 max=10 bind:value={orderItems[itemIter].quantity} name={'quantity' + itemIter} id={'quantity' + itemIter} required>
                <p>x</p>
                <select on:change={(ev)=>handleSelectChange(ev, itemIter)} bind:value={orderItems[itemIter].id} name={'item' + itemIter} id={'item' + itemIter} required>
                    <option value="" disabled selected>Select Item</option>
                    {#each data.books as book}
                        {#if !alreadySelected(itemIter, book.id) }
                            <option id={'item' + itemIter + 'opt' + book.id} value={book.id}>
                                {book.title}
                            </option>
                        {/if}
                    {/each}
                </select>
                {#if bookMax[itemIter] < 10 }
                    <p class="error">
                        Left in stock: {bookMax[itemIter]}
                    </p>
                {/if}
            </div>
        {/each}
        
        <div class="buttons">
            <button type="button" on:click={()=>addItem()}>+ Add Item</button>
            <button disabled={!orderItems || orderItems.length==0} formaction="?/submit">Submit Order</button>
        </div>
    {:else}
        <div class="receipt">
            <div>Order #{form.order.id}</div>
            {#each form.items as item}
                <div>{item.quantity} x {getBook(item.itemId)?.title}: ${(item.quantity* (getBook(item.itemId).price || 0)).toFixed(2)}</div>
            {/each}
        </div>
        <h3>
            Total: ${getOrderTotal().toFixed(2)}
        </h3>
    {/if}
</form>

<style>
    input[type=number]{
        width: 2rem;
    }
    p{
        margin: 0 0.25rem;
    }

    .x-btn{
        margin-right: 1rem;
    }

    h3{
        display: flex;
        justify-content: center;
    }

    .receipt{
        flex-direction: column;
    }
</style>