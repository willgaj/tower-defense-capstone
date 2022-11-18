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
		this.animSpeed = 10;
		this.animCounter = 0;
		this.health = 5;
	}
	
	draw() {
		// Drawing enemies
		let saucerImage = new Image();
		saucerImage.src = 'img/Saucer.png'

		if (this.animCounter <= this.animSpeed) {
			c.drawImage(saucerImage, 0, 0, 128, 64, this.position.x, this.position.y, 128, 64);
			this.animCounter += 1;
		}
		else if (this.animCounter <= this.animSpeed*2) {
			c.drawImage(saucerImage, 128, 0, 128, 64, this.position.x, this.position.y, 128, 64);
			this.animCounter += 1;
		}
		else if (this.animCounter <= this.animSpeed*3) {
			c.drawImage(saucerImage, 256, 0, 128, 64, this.position.x, this.position.y, 128, 64);
			this.animCounter += 1;
		}
		else if (this.animCounter <= this.animSpeed*4) {
			c.drawImage(saucerImage, 384, 0, 128, 64, this.position.x, this.position.y, 128, 64);
			this.animCounter += 1;
		}
		else {
			c.drawImage(saucerImage, 384, 0, 128, 64, this.position.x, this.position.y, 128, 64);
			this.animCounter = 0;
		}
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
