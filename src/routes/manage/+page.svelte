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

	let showMeetings = true;
	let showLiterature = true;

	const meetingMarkDirty = (iter: number)=> {
		document.getElementById("meeting"+iter+"dirty")?.setAttribute("value", "true")
	}
	
	const literatureMarkDirty = (iter: number)=> {
		document.getElementById("literature"+iter+"dirty")?.setAttribute("value", "true")
	}
</script>
<div class="formContainer">
	<form method="POST" action="?/updateMeetings">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="collapse" on:click={()=>showMeetings = !showMeetings}>
			<h2>Meetings</h2>
		</div>
		<div style="display: flex; flex-direction: column; align-items: center;">
			{#if showMeetings}
				<input type="hidden" name="deleteMeeting" id='deleteMeeting'>
				<table class="meetingList">
					<tr class="meeting">
						<td></td>
						<td>
							Name
						</td>
						<td>
							Day
						</td>
						<td>
							Time
						</td>
					</tr>
					{#each meetings as meeting, meetingIter}
						<tr class="meeting">
							<input type="hidden" id={"meeting"+meetingIter+"dirty"} name={"meeting"+meetingIter+"dirty"} value="false">
							<input type="hidden" id={"meeting"+meetingIter} name={"meeting"+meetingIter} value={meeting.id?? ''}/>
							<td>
								<button class="x-btn" type="button" on:click={()=>{
										deleteMeeting(meetingIter);
										if(meeting.id){
											let deleteInput = document.getElementById('deleteMeeting');
											deleteInput?.setAttribute('value', ''+meeting.id);
											document.getElementById('deleteMeeting'+meetingIter)?.click();
										}
									}} id={'deleteMeeting'+meetingIter+'btn'}>X</button>
								<button id={'deleteMeeting'+meetingIter} style="display: none" type="submit" formaction={'?/deleteMeeting'}></button>
							</td>
							<td>
								<input on:change={()=>meetingMarkDirty(meetingIter)} type="text" id={"meeting"+meetingIter+"name"} name={"meeting"+meetingIter+"name"} value={meeting.name?? ''} required>
							</td>
							<td>
								<select on:change={()=>meetingMarkDirty(meetingIter)} id={"meeting"+meetingIter+"day"} name={"meeting"+meetingIter+"day"} value={meeting.day} required>
									{#each daysOfTheWeek as day, dayIter}
										<option value={dayIter}>{day}</option>
									{/each}
								</select>
							</td>
							<td>
								<select on:change={()=>meetingMarkDirty(meetingIter)} id={"meeting"+meetingIter+"hour"} name={"meeting"+meetingIter+"hour"} required>
									{#each hours as time}
										<option 
											selected={ time == meeting.time?.substring(0,2) } 
											value={time}>{time}</option>
									{/each}
								</select>
								:
								<select on:change={()=>meetingMarkDirty(meetingIter)} id={"meeting"+meetingIter+"minute"} name={"meeting"+meetingIter+"minute"} required>
									{#each minutes as time}
										<option 
											selected={ time == meeting.time?.substring(3,5) } 
											value={ time }>
												{ time }
											</option>
									{/each}
								</select>
								<select on:change={()=>meetingMarkDirty(meetingIter)} id={"meeting"+meetingIter+"meridian"} name={"meeting"+meetingIter+"meridian"}>
									<option selected={'AM' == meeting.time?.substring(5)} value="AM">AM</option>
									<option selected={'PM' == meeting.time?.substring(5)} value="PM">PM</option>
								</select>
							</td>
						</tr>
					{/each}
				</table>

				<div class="buttons">
					<button type="button" on:click={()=>addMeeting()} id={'addMeeting'}>+ Add Meeting</button>
					<button disabled={!meetings || meetings.length==0} type="submit">Update Meetings</button>
				</div>
			{/if}
		</div>
	</form>
</div>
<div class="formContainer">
	<form method="POST" action="?/updateLiterature">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="collapse" on:click={()=>showLiterature = !showLiterature}>
			<h2>Literature</h2>
		</div>
		<div style="display: flex; flex-direction: column; align-items: center;">
			{#if showLiterature}
				<table class="litList">
					<input type="hidden" name="deleteLiterature" id='deleteLiterature'>
					<tr class="meeting">
						<td></td>
						<td>
							Title
						</td>
						<td>
							Price
						</td>
						<td>
							Catgeory
						</td>
						<td>
							Quantity
						</td>
					</tr>
					{#each literature as literature, litIter}
						<tr class="litItem">
							<input type="hidden" id={"literature"+litIter+"dirty"} name={"literature"+litIter+"dirty"} value="false"/>
							<input type="hidden" id={"literature"+litIter} name={"literature"+litIter} value={literature.id?? ''}/>
							<td>
								<button class="x-btn" type="button" on:click={()=>{
										deleteLiterature(litIter);
										if(literature.id){
											let deleteInput = document.getElementById('deleteLiterature');
											deleteInput?.setAttribute('value', ''+literature.id);
											document.getElementById('deleteLiterature'+litIter)?.click();
										}
									}} id={'deleteLiterature'+litIter+'btn'}>X</button>
								<button id={'deleteLiterature'+litIter} style="display: none" type="submit" formaction={'?/deleteLiterature'}></button>
							</td>
							<td>
								<input type="text" on:change={()=>literatureMarkDirty(litIter)} id={"literature"+litIter+"title"} name={"literature"+litIter+"title"} value={literature.title?? ''} required>
							</td>
							<td>
								<input type="number" on:change={()=>literatureMarkDirty(litIter)} min=0 id={"literature"+litIter+"price"} step=0.01 name={"literature"+litIter+"price"} value={literature.price?? ''} required>
							</td>
							<td>
								<select on:change={()=>literatureMarkDirty(litIter)} id={"literature"+litIter+"category"} name={"literature"+litIter+"category"} required>
									{#each categories as category}
										<option selected={literature.category == category} value={category}>{category}</option>
									{/each}
								</select>
							</td>
							<td>
								<input type="number" on:change={()=>literatureMarkDirty(litIter)} min=0 id={"literature"+litIter+"quantity"} name={"literature"+litIter+"quantity"} value={literature.quantity?? ''} required />
							</td>
						</tr>
					{/each}
					</table>
				<div class="buttons">
					<button type="button" on:click={()=>addLiterature()} id={'addLiterature'}>+ Add Item</button>
					<button disabled={!literature || literature.length==0} type="submit">Update Literature</button>
				</div>
			{/if}
		</div>
	</form>
</div>

<style lang='scss'>
	.formContainer{
		display: flex;
        flex-direction: column;
        justify-content: center;
	}
    .collapse{
		cursor:pointer;
		&:hover{
			background-color: rgba(0,0,0,.1);
		}
	}

	.litList, .meetingList{
		.litItem, .meeting{
			text-align: center;
		}
	}

	.x-btn{
        margin-right: 1rem;
    }

    form{
        margin-bottom: 1rem;
		padding: 1rem 0rem;
        
		select{
			width: auto;
			margin: 0 0.5rem;
		}
        label{
            width: 6rem;
        }
    }
</style>