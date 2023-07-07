<script lang="ts">
    import type { literature } from '@prisma/client';

    export let data;
    export let form;

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

    const updateLineTotal= (itemNum: number)=> {
        const quantity = orderItems[itemNum].quantity;
        const itemId = orderItems[itemNum].id;
        let priceField = document.getElementById('item'+itemNum+'Price');

        if(!itemId || quantity === undefined){
            priceField!.innerText = '$?.??';
            return
        }
        
        const price = getBook(itemId).price;

        priceField!.innerText = '$'+(quantity*price).toFixed(2);

        updateWorkingOrderTotal();
    }

    const updateWorkingOrderTotal = ()=> {
        let total = 0;
        orderItems.forEach(item => {
            if(item.id === undefined || item.quantity === undefined){
                return;
            }
            const itemPrice = getBook(item.id).price;
            const quantity = item.quantity;
            total += (itemPrice*quantity)
        })

        let totalField = document.getElementById('orderTotal');
        totalField!.innerText = total.toFixed(2);
    }

    const getSubmittedOrderTotal = ()=> {
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
                <input type="number" min=1 max=10 bind:value={orderItems[itemIter].quantity} on:change={()=>updateLineTotal(itemIter)} name={'quantity' + itemIter} id={'quantity' + itemIter} required>
                <p>x</p>
                <select on:change={(ev)=>handleSelectChange(ev, itemIter)} bind:value={orderItems[itemIter].id} on:change={()=>updateLineTotal(itemIter)} name={'item' + itemIter} id={'item' + itemIter} required>
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
                <span class="price" id={"item"+itemIter+"Price"}></span>
            </div>
        {/each}
        {#if orderItems.length}
            <div>
                Total: $<span id="orderTotal"></span>
            </div>
        {/if}
        
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
            Total: ${getSubmittedOrderTotal().toFixed(2)}
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
    .price{
        margin-left: 1rem;
    }
</style>