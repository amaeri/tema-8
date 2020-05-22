<script>
	import {fade,fly,scale} from 'svelte/transition'
	import {InfoIcon} from 'svelte-eva-icons'
	import {CloseCircleIcon} from 'svelte-eva-icons'

	let goal = '' //tøm for å restarte
	let cost = 0 //bytt til 0 for å restarte
	let savings = 0

	$: diff = cost - savings
	$: achieved = diff <= 0 ? true : false
	$: console.log(taskList)

	let regGoal = false //bytt til false for å restarte

	let showTasklist = false
	let taskList = []
	let task
	let taskPrice = 10

	// let fillPiggybank = true
		
	const startSaving = () => {
		regGoal = true
	}

	const addTask = () => {
		if (task.value == '') {
			task.placeholder = 'Du må fylle inn arbeidsoppgave'
			return
		}
		savings = savings + taskPrice
		taskList = [{
			title: task.value,
			cost: taskPrice
		}, ...taskList]
		task.value = ''
		taskPrice = 10
	}

	// const piggyFilled = () => {
	// 	fillPiggybank = false
	// }

</script>


<!-- <main on:keydown={keyDown}> -->
<main>
	<img id="logo" src="./assets/logo.png" alt="logo">
	<!-- Sparemål -->
		<div class="inputs">
		{#if !regGoal}
			<!-- Steg 1 -->
			<p>Registrer sparemål og kostnad</p>
			<input 
			type="text"
			bind:value={goal} 
			placeholder='Sparemål'
			on:click={ event => event.target.value= ''}>

			<input
			type="number"
			bind:value={cost}  
			placeholder="Kostnad">

			<button class="next" on:click={startSaving}>Neste</button>
		{:else}
			{#if !achieved}
<!-- Arbeidsoppgaver -->
				<p>Registrer arbeidsoppgave og beløp</p>
				<input bind:this={task} placeholder='Arbeidsoppgave'/>
				<div id="verdiknapper">
					<img src="./assets/ti.png" alt="ti" on:click={()=>taskPrice=10} on:click={addTask}>
					<img src="./assets/tyve.png" alt="tyve" on:click={()=>taskPrice=20} on:click={addTask}>
					<img src="./assets/femti.png" alt="femti" on:click={()=>taskPrice=50} on:click={addTask}>
					<img src="./assets/hundre.png" alt="hundre" on:click={()=>taskPrice=100} on:click={addTask}>
<!-- Animasjon -->
					<!-- <div id="animation"><img src="./assets/krone.png" alt="kronestykke"></div> -->
				</div>
			{:else}
<!-- Fullført -->
				<img id="balloons" src="./assets/balloons.png" alt="ballonger">
				<p>Hipp hurra! Du har nådd sparemålet!</p>
				<button on:click={ () => regGoal = false}>Nytt sparemål</button>
			{/if}
		{/if}
		</div>
		
		<div class="piggybank">
			<div class='pig'>			
				{#if !showTasklist}
				<img src="./assets/piggybank.png" alt="Sparegris">
				<div class="savings">
					{savings} kr
					<div class="infoIcon"
					on:click={ () => showTasklist = true}> 
					<InfoIcon />
					</div>
				</div>
				{:else}
				<div class="tasks">
					<div class="closeIcon"
					on:click={ () => showTasklist = false}>
					<CloseCircleIcon />
					</div>
					<div class="taskList">
						<label><b>Arbeidsoppgaver</b></label>
						<label><b>Beløp</b></label>
						{#each taskList as item}
							<li>{item.title}</li>
							<li>{item.cost} kr</li>
						{/each}
					</div>
				</div>
				{/if}
			</div>

			<div id="goal">
				<p><label><b>Sparemål</b></label> {goal} </p>
				<p><label><b>Gjenstående beløp</b></label> {diff} kr</p>
			</div>	
		</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: Poppins;
		background-color: #D1E6FE;
	}

	main {
		display: grid;
		position: relative;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		place-items: center;
		width: 100vw;
		height: 100vh;
	}

	#logo {
		width: 30vw;
		position: absolute;
		top: 4rem;	
	}

	.inputs {
		display: grid;
		place-items: center;
		width: 35vw;
		padding: 1rem;
		border-radius: 20px;
		background-color: #8AB8EF;
		color: white;
	}

	input {
		border-radius: 10px;
		border: 1px solid black;
		width: 25vw;
		outline: none;
	}

	button {
		place-items: center;
		border-radius: 50px;
		background-color: #D1E6FE;
		border: 1px solid white;
		color: #8AB8EF;
	}

	button:hover {
		background: white;
		color: #8AB8EF;
	}

	.piggybank img {
		width: 35vw;
	}

	.pig{
		display:grid;
		position:relative;
		place-items:center;
	}

	.savings{
		display: grid;
		position:absolute;
		grid-template-columns: 2fr 1fr;
		place-items: center;
		background-color: white;
		border: 2px solid black;
		border-radius: 1rem;
		padding: 0 .5rem .5rem 1rem;
		right: 7rem;
		font-size: 2vw;
	}

	.infoIcon {
		max-width: 1.5rem;
		cursor: pointer;
		margin-bottom: 5vh;
	}

	.tasks {
		display: grid;
		justify-content: space-between;
		background-color: white;
		border: 2px solid black;
		border-radius: 20px;
		padding: 1rem;
	}

	.closeIcon {
		max-width: 1.5rem;
		cursor: pointer;
		margin-left: 20rem;
	}

	.taskList {
		display: grid;
		grid-template-columns: 1fr 1fr;
		list-style-type: none;
	}

	#goal {
		display: grid;
		width: 35vw;
		grid-template-columns: 1fr 1fr;
		justify-items: center;
		justify-content: space-between;
		margin-top: 2rem;
		padding: 0 1rem 0 1rem;
		border-radius: 20px;
		background-color: #8AB8EF;
		color: white;
	}

	/* Oppgaveside */
	#verdiknapper {
		display: grid;
		grid-auto-flow: column;
		width: 25vw;
		justify-content: space-between;
		cursor: pointer;
		margin-top: 1rem;
	}

	#verdiknapper img {
		width: 5vw;
     	background-size: cover;
	}

	/* Fullført sparing */
	#balloons {
		width: 10vw;
	}

	/* #animation img {
		width: 3vw;
	}

	#animation {
		position: absolute;
		top: 0;
		right: 17rem;
		animation: coinFalling 1s linear forwards;
		z-index: 1;
	}

	@keyframes coinFalling {
		to {
			transform: translateY(250px);
		}
	} */

	@media (max-width:800px) {
		main {
			grid-auto-flow: row;
			padding-top: 3rem;
			grid-template-rows: 1fr 1fr;
		}

		#logo {
			top: 2rem;
			width: 15rem;
		}

		.inputs {
			width: 100vw;
			border-radius: 0;
		}

		input {
			width: 20rem;
		}

		#verdiknapper {
			width: 20rem;
		}

		#verdiknapper img {
			width: 4rem;
		}

		.piggybank {
			display: grid;
			place-items: center;
		}

		.piggybank img {
			width: 20rem;
		}

		.savings {
			right: 3.3rem;
			font-size: 1.2rem;
		}

		.tasks {
			grid-auto-flow: row;
		}

		#goal {
			width: 100vw;
			border-radius: 0;
			bottom: 0;
		}

		/* #animation img {
			width: 8vw;
		}

		#animation {
			top: 42vh;
			right: 9.2rem;
		}

		@keyframes coinFalling {
		to {
			transform: translateY(93px);
			}
		} */
	}
</style>