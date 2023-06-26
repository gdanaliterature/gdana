<script lang="ts">
    import type {literature, meeting} from '@prisma/client';
  	export let data;

 	let meetings: Partial<meeting>[] = data.meetings;
  	let literature: Partial<literature>[] = data.literature;

    const addMeeting = ()=> {
        meetings = [
            ...meetings,
            {}
        ];
    };

    const deleteMeeting = (meetingIter: number)=> {
        meetings.splice(meetingIter, 1);
        meetings = meetings;
    }
  
    const addLiterature = ()=> {
        literature = [
            ...literature,
            {}
        ];
    };

    const deleteLiterature = (litIter: number)=> {
        literature.splice(litIter, 1);
        literature = literature;
    }

    const daysOfTheWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

	const hours: string[] = [];
	const minutes: string[] = ['00', '15', '30', '45'];

	for(let hour=1; hour<13; hour++){
		let hourString: string = hour.toLocaleString('en-US', {minimumIntegerDigits: 2});
		hours.push(hourString);
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

	let showMeetings = false;
	let showLiterature = true;
</script>

<form method="POST" action="?/updateMeetings">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="collapse" style="cursor: pointer" on:click={()=>showMeetings = !showMeetings}>
		<h2>Meetings</h2>
	</div>
	{#if showMeetings}
		<input type="hidden" name="deleteMeeting" id='deleteMeeting'>
		{#each meetings as meeting, meetingIter}
			<input type="hidden" id={"meeting"+meetingIter} name={"meeting"+meetingIter} value={meeting.id?? ''}/>
			<div>
				<button class="x-btn" type="button" on:click={()=>{
						deleteMeeting(meetingIter);
						if(meeting.id){
							let deleteInput = document.getElementById('deleteMeeting');
							deleteInput?.setAttribute('value', ''+meeting.id);
							document.getElementById('deleteMeeting'+meetingIter)?.click();
						}
					}} id={'deleteMeeting'+meetingIter+'btn'}>X</button>
				<button id={'deleteMeeting'+meetingIter} style="display: none" type="submit" formaction={'?/deleteMeeting'}></button>
				<h3> Meeting {meetingIter+1}</h3>
			</div>
			<div>
				<label for={"meeting"+meetingIter+"name"}>
					Name: 
				</label>
				<input type="text" id={"meeting"+meetingIter+"name"} name={"meeting"+meetingIter+"name"} value={meeting.name?? ''} required>
			</div>
			<div>
				<label for={"meeting"+meetingIter+"day"}>
					Day: 
				</label>
				<select id={"meeting"+meetingIter+"day"} name={"meeting"+meetingIter+"day"} value={meeting.day} required>
					{#each daysOfTheWeek as day, dayIter}
						<option value={dayIter}>{day}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for={"meeting"+meetingIter+"time"}>
					Time: 
				</label>
				<select id={"meeting"+meetingIter+"hour"} name={"meeting"+meetingIter+"hour"} required>
					{#each hours as time}
						<option 
							selected={ time == meeting.time?.substring(0,2) } 
							value={time}>{time}</option>
					{/each}
				</select>
				:
				<select id={"meeting"+meetingIter+"minute"} name={"meeting"+meetingIter+"minute"} required>
					{#each minutes as time}
						<option 
							selected={ time == meeting.time?.substring(3,5) } 
							value={ time }>
								{ time }
							</option>
					{/each}
				</select>
				<select id={"meeting"+meetingIter+"meridian"} name={"meeting"+meetingIter+"meridian"}>
					<option selected={'AM' == meeting.time?.substring(5)} value="AM">AM</option>
					<option selected={'PM' == meeting.time?.substring(5)} value="PM">PM</option>
				</select>
			</div>
		{/each}

		<div class="buttons">
			<button type="button" on:click={()=>addMeeting()} id={'addMeeting'}>+ Add Meeting</button>
			<button disabled={!meetings || meetings.length==0} type="submit">Update Meetings</button>
		</div>
	{/if}
</form>
<form method="POST" action="?/updateLiterature">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="collapse" style="cursor: pointer" on:click={()=>showLiterature = !showLiterature}>
		<h2>Literature</h2>
	</div>
	{#if showLiterature}
		<div class="litList">
			<input type="hidden" name="deleteLiterature" id='deleteLiterature'>
			{#each literature as literature, litIter}
				<div class="litItem">
					<input type="hidden" id={"literature"+litIter} name={"literature"+litIter} value={literature.id?? ''}/>
					<div>
						<button class="x-btn" type="button" on:click={()=>{
								deleteLiterature(litIter);
								if(literature.id){
									let deleteInput = document.getElementById('deleteLiterature');
									deleteInput?.setAttribute('value', ''+literature.id);
									document.getElementById('deleteLiterature'+litIter)?.click();
								}
							}} id={'deleteLiterature'+litIter+'btn'}>X</button>
						<button id={'deleteLiterature'+litIter} style="display: none" type="submit" formaction={'?/deleteLiterature'}></button>
						<h3> Item {litIter+1}</h3>
					</div>
					<div>
						<label for={"literature"+litIter+"title"}>
							Title: 
						</label>
						<input type="text" id={"literature"+litIter+"title"} name={"literature"+litIter+"title"} value={literature.title?? ''} required>
					</div>
					<div>
						<label for={"literature"+litIter+"price"}>
							Price: 
						</label>
						<input type="number" min=0 id={"literature"+litIter+"price"} step=0.01 name={"literature"+litIter+"price"} value={literature.price?? ''} required>
					</div>
					<div>
						<label for={"literature"+litIter+"category"}>
							Category: 
						</label>
						<select id={"literature"+litIter+"category"} name={"literature"+litIter+"category"} required>
							{#each categories as category}
								<option selected={literature.category == category} value={category}>{category}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for={"literature"+litIter+"quantity"}>
							Quantity: 
						</label>
						<input type="number" min=0 id={"literature"+litIter+"quantity"} name={"literature"+litIter+"quantity"} value={literature.quantity?? ''} required />
					</div>
				</div>
			{/each}

		</div>
		<div class="buttons">
			<button type="button" on:click={()=>addLiterature()} id={'addLiterature'}>+ Add Item</button>
			<button disabled={!literature || literature.length==0} type="submit">Update Literature</button>
		</div>
	{/if}
</form>

<style lang='scss'>
    .collapse:hover{
		background-color: rgba(0,0,0,.1);
	}

	.litList{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.litItem{
			display: flex;
			flex-direction: column;
		}
	}

	.x-btn{
        margin-right: 1rem;
    }

    form{
        margin-bottom: 1rem;
        
		select{
			width: auto;
			margin: 0 0.5rem;
		}
        label{
            width: 6rem;
        }
    }
</style>