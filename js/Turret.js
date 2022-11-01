class Turret {
	constructor({position = { x:0, y: 0} }) {
		this.position = position
		this.color = 'rgba(255, 110, 110, 1)'
		this.radius = 10
	}
	
	draw() {
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		c.fillStyle = this.color
		c.fill()
	}
}