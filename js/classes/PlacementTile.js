class PlacementTile {
    constructor({position = {x: 0, y: 0}}) {
        this.position = position;
        this.size = 10;
        this.color = 'rgba(255, 255, 255, .15)';
        this.occupied = false;
    }

    draw() {
        c.beginPath()
		c.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
		c.fillStyle = this.color
		c.fill()
    }

    update(mouse) {
        this.draw();

        if (mouse.x > this.position.x - this.size && mouse.x < this.position.x + this.size * 2 &&
            mouse.y > this.position.y - this.size && mouse.y < this.position.y + this.size * 2) {
            this.color = 'white';
            c.beginPath();
            const turretRadius = 150; //this value needs to match the fire-radius of the turrets
            c.arc(this.position.x, this.position.y, turretRadius, 0, Math.PI * 2);
            c.fillStyle = 'rgba(0, 0, 255, 0.1)';
            c.fill();
        }
        else {
            this.color = 'rgba(255, 255, 255, .15)';
        }
    }
}