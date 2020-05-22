<script>
	import {fade,fly,scale} from 'svelte/transition'
	import {InfoIcon} from 'svelte-eva-icons'
	import {CloseCircleIcon} from 'svelte-eva-icons'

	let goal = 'Lego' //tøm for å restarte
	let cost = 200 //bytt til 0 for å restarte
	let savings = 0

	$: diff = cost - savings
	$: achieved = diff <= 0 ? true : false
	$: console.log(taskList)

	let regGoal = true //bytt til false for å restarte

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
	<section>
		<div class="inputs">
			{#if !regGoal}
			<!-- Steg 1 -->
			<h3>Registrer sparemål og kostnad</h3>
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
				<h3>Registrer arbeidsoppgave og beløp</h3>
				<input bind:this={task} placeholder='Arbeidsoppgave'/>
				<div id="verdiknapper">
					<div id="ti" class="knapper" on:click={()=>taskPrice=10} on:click={addTask}></div>
					<div id="tyve" class="knapper" on:click={()=>taskPrice=20} on:click={addTask}></div>
					<div id="femti" class="knapper" on:click={()=>taskPrice=50} on:click={addTask}></div>
					<div id="hundre" class="knapper" on:click={()=>taskPrice=100} on:click={addTask}></div>
<!-- Animasjon -->
					<!-- <div on:animationstart={addTask} on:animationend={piggyFilled} class="animation"><img src="./assets/krone.png" alt="kronestykke"></div> -->
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
						<h4>Arbeidsoppgaver</h4>
						<h4>Beløp</h4>
						{#each taskList as item}
							<p>{item.title}</p>
							<p>{item.cost} kr</p>
						{/each}
					</div>
				</div>
				{/if}
			</div>

			<div id="goal">
				<p><label><b>Sparemål</b></label> {goal}</p>
				<p><label><b>Gjenstående beløp</b></label> {diff} kr</p>
			</div>	
		</div>

		
	</section>
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
		place-items: center;
		width: 100%;
		height: 100%;
		position: relative;
	}

	#logo {
		width: 25vw;
		position: absolute;
		top: 4rem;	
	}

	section {
		display: grid;
		place-items: center;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		width: 100%;
		height: 100%;
	}

	.inputs {
		display: grid;
		padding: 2rem;
		border-radius: 20px;
		background-color: #8AB8EF;
		color: white;
		width: 35vw;
		place-items: center;
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

	.pig{
		position:relative;
		display:grid;
		place-items:center;
	}

	.piggybank {
		display: grid;
		gap: 2rem;
	}

	.piggybank img {
		width: 35vw;
	}

	.savings{
		display: grid;
		grid-template-columns: 2fr 1fr;
		place-items: center;
		position:absolute;
		background-color: white;
		border: 2px solid black;
		border-radius: 20px;
		padding: .5rem .5rem .5rem 1rem;
		right: 7rem;
		font-size: 2vw;
	}

	.infoIcon {
		max-width: 1.5rem;
		cursor: pointer;
		margin-bottom: 3rem;
	}

	.tasks {
		display: grid;
		grid-template-rows: 1fr 10fr;
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
		text-align: center;
	}

	/* .animation img {
		background-size: cover;
		width: 3vw;
	}

	.animation {
		position: absolute;
		top: 0;
		right: 17rem;
		animation: coinFalling 1s linear forwards;
		z-index: 1;
	} */

	@keyframes coinFalling {
		to {
			transform: translateY(250px);
		}
	}

	#goal {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-radius: 20px;
		padding: 0 1rem 0 1rem;
		background-color: #8AB8EF;
		color: white;
		place-items: center;
		text-align: center;
	}

	/* Oppgaveside */
	#verdiknapper {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		padding-top: 1rem;
		gap: 2.4vw;
		cursor: pointer;
	}

	.knapper {
		width: 4.5vw;
    	height: 4.5vw; /* hvorfor blir det rart med vh? */
     	background-size: cover;
	}

	#ti {
		background-image: url('../assets/ti.png')
	}

	#tyve {
		background-image: url('../assets/tyve.png')
	}

	#femti {
		background-image: url('../assets/femti.png')
	}

	#hundre {
		background-image: url('../assets/hundre.png')
	}

	/* Fullført sparing */
	#balloons {
		width: 10vw;
	}

	@media (max-width:700px) {


	}

</style>