const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
		
		
// Game Map Import
canvas.width = 1280
canvas.height = 640
		
		
// temp fill Style
c.fillStyle = '#1d6bc2'
// delete this when done
c.fillRect(0, 0, canvas.width, canvas.height)

// Load the map image
const map = new Image()
map.src = 'img/Map1.png'

map.onload = () => {
	animation()
}

// Array of enemies
const enemies = []

// Enemy spawning
for (let i = 0; i < 10; i++){
	const positionOffset = 150 + (i * 150)
	enemies.push(new Saucer({ position: {x: waypoints1[0].x - positionOffset, y: waypoints1[0].y} }))
}

// Emplacement generation
const emplacements = []

placementData1.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 1) {
			emplacements.push(new Emplacement({
				position: {
					x: (j + 1) * 64,
					y: ((i + 1) * 32) - 5
				}
			}))
		}
	})
})

// listener to determine where the mouse is hovering over

window.addEventListener('mousemove', (event) => {
	mouse.x = event.clientX
	mouse.y = event.clientY
	
	activePlacement = null
	for (const element of emplacements) {
		const placement = element
		if (mouse.x > placement.position.x - placement.radius * 2 && 
			mouse.x < placement.position.x + placement.radius * 2 && 
			mouse.y > placement.position.y - placement.radius * 2 && 
			mouse.y < placement.position.y + placement.radius * 2) {
			activePlacement = placement
			break }
	}
})

// listener to determine if an activePlacement space has been clicked

canvas.addEventListener('click', (event) => {
	if(activePlacement) {
		turrets.push(new Turret ({
			position: {
				x: activePlacement.position.x,
				y: activePlacement.position.y
			}
		}))
	}
})

const turrets = []
let activePlacement = undefined 


// Animation sequences
function animation() {
	requestAnimationFrame(animation)
	
	c.drawImage(map, 0 , 0)
	emplacements.forEach(placement => {
		placement.update(mouse)
	})
	
	enemies.forEach(Saucer => {
		Saucer.update()
	})
	
	turrets.forEach(Turret => {
		Turret.draw()

		Turret.projectiles.forEach(projectile => {
			projectile.update();
		})
	})
}

const mouse = {
	x: undefined,
	y: undefined
}
	





