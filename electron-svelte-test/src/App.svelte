<script>
	const { remote } = require('electron')
	const { Menu, MenuItem } = remote
	
	let info = 'Nothing happening yet'

	const showNotification = (title) => {
		let myNotification = new Notification(title, {
			body: 'You are now officially part of the system OS'
		})
		myNotification.onclick = () => {
			info = 'Notification clicked'
		}
	}

	const amIOnline = () => {
		window.alert(navigator.onLine ? 'You\'re online honey' : 'You\'re offline')
		info	 = 'Alert accepted'
	}

	const menu = new Menu()
	menu.append(new MenuItem({ label: 'Meny 1', click() { info = 'Item 1 klikket' } }))
	menu.append(new MenuItem({ type: 'separator' }))
	menu.append(new MenuItem ({ label: 'Meny 2', click() { info = 'Item 2 klikket' } }))

	const context = e => {
		e.preventDefault() //hindrer høyreklikk på vanlig måte
		menu.popup({ window: remote.getCurrentWindow() }) //henter menyfunksjon i Electron
	}

</script>

<main>
	<h1>Handleliste	</h1>
	<p>{info}</p>

	<button on:click={ () => showNotification('Heisann')}>Klikk her</button>

	<button on:click={ () => amIOnline() }>Online?</button>

	<hr>
	<div class="stuff" on:contextmenu={context}></div>

</main>

<style>
	* {
		box-sizing: border-box;
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.stuff {
		width: 100%;
		height: 200px;
		background-color: slategray;
	}
	
</style>