class Saucer {
	constructor({ position = { x: 0, y: 0} }) {
		this.position = position		
		this.width = 128
		this.height = 64
		this.waypointIndex = 0
		this.center = {
			x: this.width/2 + this.position.x,
			y: this.height/2 + this.position.y
		}
	}
	
	draw() {
		// Drawing enemies
		c.fillStyle = 'rgba(140, 127, 216, 1)'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	
	update() {
		this.draw()
		
		const currentWaypoint = waypoints1[this.waypointIndex]
		const yDistance = currentWaypoint.y - this.center.y 
		const xDistance = currentWaypoint.x - this.center.x 
		const targetAngle = Math.atan2(yDistance, xDistance)		
		this.position.x += Math.cos(targetAngle)		
		this.position.y += Math.sin(targetAngle)
		this.center = {
			x: this.width/2 + this.position.x,
			y: this.height/2 + this.position.y
		}
		
		if (Math.round(this.center.x) === Math.round(currentWaypoint.x) && Math.round(this.center.y) === Math.round(currentWaypoint.y) && this.waypointIndex < waypoints1.length - 1){
			this.waypointIndex++
		}
	}

}
