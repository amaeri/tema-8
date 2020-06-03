<script>
	import {InfoIcon} from 'svelte-eva-icons'
	import {CloseCircleIcon} from 'svelte-eva-icons'

	let goal = '' 
	let savinggoal
	let cost = ''
	let savingcost

	let regGoal = false 

	let showTasklist = false
	let taskList = []
	let task
	let taskPrice = 10
	let savings = 0

	let showAnimation = false

	$: diff = cost - savings
	$: achieved = diff <= 0 ? true : false
	$: console.log(taskList)
		
	const startSaving = () => {
		if (savinggoal.value == '' && savingcost.value == 0) {
			savinggoal.placeholder = 'Du må fylle inn sparemål'
			savingcost.placeholder = 'Du må fylle inn kostnad'
			return
		}
		regGoal = true
	}

	const addTask = () => {
		if (task.value == '') {
			task.placeholder = 'Du må fylle inn arbeidsoppgave'
			return
		}
		showAnimation = true
		taskList = [{
			title: task.value,
			cost: taskPrice
		}, ...taskList]
		task.value = ''
	}

	const fillPiggybank = () => {
		showAnimation = false
		savings = savings + taskPrice
		taskPrice = 10
	}

	const reset = () => {
		regGoal = false
		goal = ''
		cost = ''
		savings = 0
		taskList = []
	}

</script>

<header><img id="logo" src="./assets/logo.png" alt="logo"></header>

<main>
<!-- Sparemål -->
		<div id="inputs">
		{#if !regGoal}
			<!-- Steg 1 -->
			<p>Registrer sparemål og kostnad</p>
			<input bind:this={savinggoal} bind:value={goal} placeholder='Sparemål' on:click={ event => event.target.value= ''}>

			<input type="number" bind:this={savingcost} bind:value={cost} placeholder="Kostnad" on:keydown={ event => event.key == 'Enter' ? startSaving() : ''} >

			<button class="next" on:click={startSaving}>Neste</button>
		{:else}
			{#if !achieved}
<!-- Arbeidsoppgaver -->
				<p>Registrer arbeidsoppgave og beløp</p>
				<input bind:this={task} placeholder='Arbeidsoppgave'/>
				<div id="coinbuttons" >
					<img class="coins" src="./assets/ti.png" alt="ti" on:click={()=>taskPrice=10} on:click={addTask}>
					<img class="coins" src="./assets/tyve.png" alt="tyve" on:click={()=>taskPrice=20} on:click={addTask}>
					<img class="coins" src="./assets/femti.png" alt="femti" on:click={()=>taskPrice=50} on:click={addTask}>
					<img class="coins" src="./assets/hundre.png" alt="hundre" on:click={()=>taskPrice=100} on:click={addTask}>

<!-- Animasjon -->	{#if showAnimation}
						<div on:animationend={fillPiggybank} id="animation"><img src="./assets/krone.png" alt="kronestykke"></div>
					{/if}
				</div>
			{:else}
<!-- Fullført -->
				<img id="balloons" src="./assets/balloons.png" alt="ballonger">
				<p>Hipp hurra! Du har nådd sparemålet!</p>
				<button on:click={ () => reset()}>Nytt sparemål</button>
			{/if}
		{/if}
		</div>
		
		<div class="piggybank">
			<div class='pig'>			
				{#if !showTasklist}
				<img src="./assets/piggybank.png" alt="Sparegris">
				<div class="savings">
					<div class="infoIcon" on:click={ () => showTasklist = true}> 
						<InfoIcon />
					</div>
					<p id="savingamount">{savings} kr</p>
				</div>
				{:else}
				<div class="tasks">
					<div class="closeIcon" on:click={ () => showTasklist = false}>
					<CloseCircleIcon />
					</div>
					<div class="taskList">
						<label>Arbeidsoppgaver</label>
						<label>Beløp</label>
						{#each taskList as item}
							<li>{item.title}</li>
							<li>{item.cost} kr</li>
						{/each}
					</div>
				</div>
				{/if}
			</div>

			<div id="goal">
				<p><label>Sparemål</label> {goal} </p>
				<p><label>Restbeløp</label> {diff} kr</p>
			</div>	
		</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');	

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Poppins', sans-serif;
		background-color: #D1E6FE;
	}

	/* HEADER */
	header {
		display: grid;
		place-items: center;
		position: fixed;
		top: 0;
		width: 100vw;
		height: 15vh;
	}

	#logo {
		width: 35vw;
	}

	/* GENERAL */
	main {
		display: grid;
		grid-template-columns: 1fr 1fr;
		place-items: center;
		position: relative;
		width: 100vw;
		height: 85vh;
		padding-top: 10vh;
	}

	label {
		font-weight: 600;
	}


	/* INPUTS */
	#inputs {
		display: grid;
		justify-items: center;
		align-content: center;
		background-color: #8AB8EF;
		color: white;
		width: 48vw;
		height: 60vh;
		border-radius: 20vw 1vw 20vw 1vw;
	}

	input {
		border-radius: 10px;
		border: 1px solid black;
		width: 35vw;
		outline: none;
	}

	/* INPUTS BUTTONS */
	button {
		place-items: center;
		border-radius: 50px;
		background-color: #D1E6FE;
		color: #8AB8EF;
		cursor: pointer;
		margin-top: 1rem;
		border: none;

	}

	button:hover {
		background: white;
		color: #8AB8EF;
	}

	#coinbuttons {
		display: grid;
		grid-auto-flow: column;
		width: 35vw;
		justify-content: space-evenly;
		cursor: pointer;
		margin-top: 1rem;
	}

	.coins {
		width: 4rem;
     	background-size: cover;
	}

	.coins:hover {
		transform: scale(1.2);
	}

	/* ANIMATION */
	#animation img {
		width: 4.5vw;
	}

	#animation {
		position: absolute;
		top: -10vh;
		right: 18vw;
		animation-name: fillPiggybank;
		animation-duration: 1.2s;
		animation-timing-function: linear;
		z-index: 1;
	}

	@keyframes fillPiggybank {
		to {
			transform: translateY(210px) rotate(1turn);
		}
	}

	/* GOAL COMPLETED */
	#balloons {
		width: 10vw;
	}

	/* PIGGYBANK */
	.piggybank {
		display: grid;
		position: relative;
		grid-template-rows: 3fr 1fr;
		width: 48vw;
		height: 60vh;
	}

	.pig{
		display:grid;
		position:relative;
		place-items:center;
	}

	.pig img {
		position: absolute;
		top: 0;
		width: auto;
		height: 42vh;
	}

	/* SAVINGS (PIGGYSCREEN) */
	.savings{
		display: grid;
		grid-template-rows: .5fr 1fr;
		position:absolute;
		place-items: center;
		background-color: white;
		border: 2px solid black;
		border-radius: 1rem;
		padding: .2rem;
		right: 12vw;
	}

	#savingamount {
		margin: 0;
		font-size: 3vw;
	}

	.tasks {
		display: grid;
		justify-content: space-between;
		background-color: white;
		border: 2px solid black;
		border-radius: 1rem;
		padding: 1rem;
	}

	.taskList {
		display: grid;
		grid-template-columns: 1fr 1fr;
		list-style-type: none;
	}

	/* PIGGYBANK BUTTONS */
	.infoIcon {
		width: 1.5rem;
		margin-left: 3.5rem;
		cursor: pointer;
		fill: #87ce90;
	}

	.infoIcon:hover {
		transform: scale(1.2);
	}

	.closeIcon {
		width: 1.5rem;
		cursor: pointer;
		margin-left: 20rem;
		fill: #87ce90;
	}

	.closeIcon:hover {
		transform: scale(1.2);
	}

	/* GOAL */
	#goal {
		display: grid;
		position: absolute;
		grid-template-columns: 1fr 1fr;
		justify-content: center;
		justify-items: center;
		background-color: #8AB8EF;
		color: white;
		height: 13vh;
		width: 48vw;
		border-radius: 1vw 20vw 1vw 20vw;
		bottom: 0;
	}


	/* MEDIA */
	@media (max-width:700px) {

		/* HEADER */
		header {
			height: 15vh;
		}

		#logo {
			width: 60vw;
		}

		/* GENERAL */
		main {
			grid-template-columns: none;
			grid-template-rows: 1fr 2fr;
			place-items: center;
		}

		/* INPUTS */
		#inputs {
			width: 100vw;
			height: 30vh;
			border-radius: 0;
			margin-top: 5vh;
		}

		input {
			width: 70vw;
		}

		/* INPUT BUTTONS */
		button {
			margin-top: 0;
		}

		.coins:hover {
		transform: none;
	}

		/* PIGGYBANK */

		.piggybank {
			height: 55vh;
			width: 100vw;
		}

		.pig img {
			height: 30vh;
			top: 2rem;
		}

		/* SAVINGS (PIGGYSCREEN) */
		.savings {
			right: 25vw;
		}

		#savingamount {
		font-size: 6vw;
	}

		/* GOAL */

		#goal {
			width: 100vw;
			height: 15vh;
			border-radius: 0;
		}


		/* ANIMATION */
		#animation img {
			width: 6vw;
		}

		#animation {
			top: 45vh;
			right: 39vw;
			animation-duration: .5s;
		}

		@keyframes fillPiggybank {
			to {
				transform: translateY(55px) rotate(.5turn);
			}
		}
	}
</style>