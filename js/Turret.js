class Turret {
	constructor({position = { x:0, y: 0} }) {
		this.position = position
		this.delay = 100
		this.counter = 0
		this.projectiles = [new Projectile({
			position: {
				x: this.position.x,
				y: this.position.y
			}
		})]
			
	}
	
	draw() {
		let turretNE = new Image();
		turretNE.src = 'img/TNE.png'
		c.drawImage(turretNE, this.position.x-64, this.position.y-48);

		if(this.counter == this.delay) {
			this.projectiles.push(new Projectile({
				position: {
					x: this.position.x,
					y: this.position.y
				}
			}))
			this.counter = 0
		}
		this.counter++
	}
}