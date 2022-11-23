//class for user placeable towers
class Building extends Sprite {

    //constructor is passed a postion
    constructor({position= {x: 0, y: 0}}) {

        //super (Sprite) sets various properties for image/animations
        super({
            position, 
            imageSrc: 'img/towerSW.png', 
            frames: {
                max: 1
            },
            offset: {
                x: -64,
                y: -49
            }
        });

        //class properties
        //width & height of tower
        //array of projectiles fired from tower
        //radius of turret range
        //target to fire projectiles at
        //elapsed spawn time for turret rate of fire
        this.width = 64;
        this.height = 64;
        this.projectiles = [];
        this.radius = 150;
        this.target = null;
        this.elapsedSpawnTime = 0;
    }

    //draw building (called through Sprite)
    draw() {
        super.draw();
    }

    //draw and update building values
    update() {
        this.draw();

        //building fires after set time and if a target exists
        if (this.elapsedSpawnTime % 100 === 0 && this.target) {
            
            //set building image based on target location relative to building
            if (this.target.position.x < this.position.x && this.target.position.y < this.position.y) {
                super.draw('img/towerNW.png');
            }
            else if (this.target.position.x > this.position.x && this.target.position.y < this.position.y) {
                super.draw('img/towerNE.png');
            }
            else if (this.target.position.x < this.position.x && this.target.position.y > this.position.y) {
                super.draw('img/towerSW.png');
            }
            else {
                super.draw('img/towerSE.png');
            }

            //create and push projectile to projectiles array with building's target
            this.projectiles.push(new Projectile({
                position: {
                    x: this.position.x - 8,
                    y: this.position.y - 32
                },
                enemy: this.target
            }));
        }

        //increment elapsed time
        this.elapsedSpawnTime++;
    }
}