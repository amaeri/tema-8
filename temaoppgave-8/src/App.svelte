<script>
	let goal = ''
	let cost = ''
	let overskrift = 'Registrer sparemål og kostnad'
	let placeholder = 'Sparemål'
	let regGoal = true

	const regChores = () => {
		
	}

	const startSaving = () => {
		if(regGoal) {
			regChores()
			overskrift = 'Registrer oppgave og verdi'
			placeholder = 'Oppgave'
		}

	}

</script>


<main>
	<img id="logo" src="./assets/logo.png" alt="logo">

	<section>
		<div class="inputs">
			<h3>{overskrift}</h3>
			<input id="inp1" 
			type="text"
			bind:value={goal} 
			placeholder={placeholder}
			on:click={ event => event.target.value= ''}>

			<input id="inp2" 
			bind:value={cost} 
			type="number" 
			placeholder="Kostnad">

			<button class="next" on:click={startSaving}>Neste</button>
		</div>

		<div class="piggybank">
			<img src="./assets/piggybank.png" alt="Sparegris">
			<div id="goal">
				<p>{goal || 'Sparemål'}</p>
				<p>{cost} kr</p>
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
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		width: 100%;
		height: 100%;
	}

	.inputs {
		display: grid;
		padding: 2rem;
		border-radius: 20px;
		background-color: #8AB8EF;
		color: white;
		width: 30vw;
		place-items: center;
	}

	input {
		border-radius: 10px;
		border: 1px solid black;
		width: 30vw;
		outline: none;
	}

	button {
		place-items: center;
		border-radius: 50px;
		background: transparent linear-gradient(180deg, #FFFFFF 0%, #8AB8EF 49%, #FFFFFF 100%) 0% 0% no-repeat padding-box;
		border: 1px solid white;
		color: white;
	}

	button:hover {
		background: white;
		color: #8AB8EF;
	}

	.piggybank {
		display: grid;
		gap: 3rem;
	}

	.piggybank img {
		width: 30vw;
	}

	#goal {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-radius: 20px;
		padding: 0 1rem 0 1rem;
		background-color: #8AB8EF;
		color: white;
	}
</style>