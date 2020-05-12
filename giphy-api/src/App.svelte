<script>
	import {apikeys} from '/Users/amandaericsson/Documents/Amanda/Interaksjonsdesign/Grunnleggende\ programmering\ og\ ux-prosess/Tema\ 8/apikeys/apikeys.js'
	import { fade, fly, scale } from 'svelte/transition'
	import { HeartIcon } from 'svelte-eva-icons'

	let api_key = apikeys.giphy.api_key
	let q = ''
	const limit = '1'
	let gif
	let favorites = []
	let showFav = false

	const getImage = () => {
	gif = null
	fetch(`https://api.giphy.com/v1/gifs/search?q=${q}&limit=${limit}&api_key=${api_key}`)
		.then( res => res.json() )
			.then( json => {
				console.log(json)
				gif = json.data[0].images.downsized_medium.url
			})
	}

	const addToFav = (gif) => {
		if(!favorites.includes(gif)) {
			favorites = [gif, ...favorites]
		}else {
			favorites = favorites.filter( element => element != gif)
		}
		if(favorites.length == 0) showFav = false
	}

</script>


<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" />
</svelte:head> 

<main>
	<header>
		<input type="text" 
		placeholder="Search for a GIF" bind:value={q} 
		on:keydown={ event => event.key == 'Enter' ? getImage() : ''} 
		on:click={ event => event.target.value = ''} 
		on:focus={ event => event.target.value = ''}
		on:click={ () => showFav = false}>
		
		{#if favorites.length > 0}
			<button in:scale on:click={ () => showFav = !showFav }>
			{showFav ? 'Skjul favoritter' : 'Vis favoritter'}
			</button>
		{/if}
	</header>

	<div class="gif">
		{#if !showFav}
			{#if gif}
				<img 
				src="{gif}" 
				alt="{q}"
				in:fly={{ x:-1000}} 
				>
				<div class='heart' 
					on:click={()=>addToFav(gif)}
					style={favorites.includes(gif) ? 'fill: #9c00ff' : 'fill: white'}
					>
					<HeartIcon />
				</div>
			{:else}
				<h2>Search for a GIF and hit enter!</h2>
			{/if} 
		{:else}
			<div in:fly={{x:1000}} class="favorites">
				{#each favorites as gif}
				<div class="favorite">
					<img src='{gif}' alt='giffy'>
					<div class='heart' 
					on:click={()=>addToFav(gif)}
					style={favorites.includes(gif) ? 'fill: #9c00ff' : 'fill: white'}
					>
					<HeartIcon />
					</div>
				</div>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body, html){
		margin: 0;
		padding: 0;
	}

	:global(*){
		box-sizing: border-box;
	}

	main{
		display: grid;
		place-items: center;
		height: 100%;
		background: rgb(238,130,255);
		background: radial-gradient(circle, rgba(238,130,255,1) 0%, rgba(177,61,193,1) 46%, rgba(156,0,255,1) 100%);
		position: relative;
	}

	header{
		position: absolute;
		top: 2rem;
		width: 100%;
		display: grid;
		justify-content: center;
	}

	input {
		border-radius: 5px;
		outline: none;
	}

	button {
		color: white;
	}
	
	.gif {
		position: relative;
	}

	.heart {
		position: absolute;
		bottom: .5rem;
		left: .5rem;
		max-height: 6rem;
		width: 3rem;
		fill: white;
		cursor: pointer;
		transition: all .4 ease;
	}

	.heart:hover {
		transform: scale(1.2);
		fill: #9c00ff;
	}

	img {
		max-height: 40vh;
		width: 30vw;
		object-fit: cover;
	}

	.favorite {
		position: relative;
	}

	.favorites {
		max-height: 60vh;
		overflow: scroll;
		display: grid;
		gap: .2rem;
		grid-template-columns: repeat(4, 200px);
	}

	.favorites img {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

</style>