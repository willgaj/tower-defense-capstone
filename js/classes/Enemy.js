//2.02: class for enemy saucers
class Enemy extends Sprite {

    //constructor is passed a position, speed, and health of the enemy
    constructor({position = {x: 0, y: 0}, speed, health}) {
        
        //2.02.a: super (Sprite) sets position, imageSrc, and frames of animation
        super({position, imageSrc: 'img/saucer.png', frames: {max: 4}});

        //2.02.b-h: 
        //enemy properties
        //width & height of the enemy
        //current waypoint index for navigating map
        //center of enemy position
        //radius of enemy hit-box
        //health and maxHealth of enemy
        //velocity and speed of enemy
        this.width = 100;
        this.height = 100;
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };
        this.radius = 10;
        this.health = health;
        this.maxHealth = health;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.speed = speed;
    }

    //2.02.i: draw the enemy (called through Sprite) and health bar
    draw() {
        super.draw();

        //health bar rendering based on health / maxHealth
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y - 15, this.width, 10);
        c.fillStyle = 'green';
        c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / this.maxHealth, 10);
    }

    //2.02.j: draw and update enemy values
    update() {
        this.draw();

        //set target waypoint, distance to, and angle to waypoint
        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        //determine x and y velocity to next waypoint
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        //update position based on velocities
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //set center based on new position
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };

        //check if enemy has reached waypoint, and set next wayoint if so
        if (Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) && 
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints.length - 1) {
            this.waypointIndex++;
        }
    }
}