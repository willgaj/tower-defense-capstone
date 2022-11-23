//class for projectiles
class Projectile extends Sprite {

    //constructor passed projectile position and target enemy
    constructor({position = {x: 0, y: 0}, enemy}) {

        //super (Sprite) sets position and imageSrc
        super({position, imageSrc: 'img/projectile.png'});

        //projectile properties
        //velocity of projectile
        //target enemy
        //radius of projectile hit-box
        this.velocity = {
            x: 0,
            y: 0
        };
        this.enemy = enemy;
        this.radius = 10;
    }

    //draw and update projectile
    update() {
        this.draw();

        //determine angle to target
        const angle = Math.atan2(this.enemy.center.y - this.position.y, this.enemy.center.x - this.position.x);
        
        //set power (velocity modifier) and set velocities
        const power = 5;
        this.velocity.x = Math.cos(angle) * power;
        this.velocity.y = Math.sin(angle) * power;

        //update projectile position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}