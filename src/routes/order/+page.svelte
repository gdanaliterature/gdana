<script lang="ts">
    import type { ActionData, PageData } from './$types.js';

    export let data: PageData;
    export let order: ActionData

    const days: string[] = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const to12Hours = (time: string) => {
        let hours: number = Number(time.substring(0,2));
        if(hours > 12){
            return hours-12 + time.substring(2) + 'PM';
        } else {
            return time + 'AM';
        }
    }
</script>

<form action="order//?createOrder">
    <h2>Order Info</h2>
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
                    {meeting.name}: {days[meeting.day]}
                </option>
            {/each}
        </select>
    </div>
    <div class="buttons">
        <button formaction="?/begin">Next</button>
    </div>
</form>