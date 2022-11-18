class Projectile {
    constructor({position = {x: 0, y:0}}) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    update() {
        this.draw();

        const angle = Math.atan2(enemies[0].position.y+16 - this.position.y, 
                                enemies[0].position.x+48 - this.position.x);
        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);

        this.position.x += this.velocity.x * 3;
        this.position.y += this.velocity.y * 3;
        
    }

    draw() {
        let projectile = new Image();
		projectile.src = 'img/projectile.png'
		c.drawImage(projectile, this.position.x, this.position.y);
    }
}