class Emplacement {
	constructor({ position = { x: 0, y: 0} }) {
		this.position = position
		this.color = 'rgba(255, 220, 220, .15)'
		this.radius = 10
	}
	
	draw() {
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		c.fillStyle = this.color
		c.fill()
	}
	
	update(mouse) {
		this.draw()
		
		 if (mouse.x > this.position.x - this.radius * 2 && 
			mouse.x < this.position.x + this.radius * 2 && 
			mouse.y > this.position.y - this.radius * 2 && 
			mouse.y < this.position.y + this.radius * 2) {
				this.color = 'rgba(255, 255, 255, 1)'
		}
		
		else {
			this.color = 'rgba(255, 220, 220, .15)'
		}
	}
}