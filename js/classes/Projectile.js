//2.04: class for projectiles
class Projectile extends Sprite {

    //constructor passed projectile position and target enemy
    constructor({position = {x: 0, y: 0}, enemy, power = 5}) {

        //2.04.a: super (Sprite) sets position and imageSrc
        super({position, imageSrc: 'img/projectile.png'});

        //2.04.b-e
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
        this.power = power;
    }

    //2.04.f: draw and update projectile
    update() {
        this.draw();

        //determine angle to target
        const angle = Math.atan2(this.enemy.center.y - this.position.y, this.enemy.center.x - this.position.x);
        
        //set velocities
        this.velocity.x = Math.cos(angle) * this.power;
        this.velocity.y = Math.sin(angle) * this.power;

        //update projectile position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}