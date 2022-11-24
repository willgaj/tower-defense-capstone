//class for user placeable towers
class Building extends Sprite {

    //constructor is passed a postion
    constructor({position= {x: 0, y: 0}}) {

        //super (Sprite) sets various properties for image/animations
        super({
            position, 
            imageSrc: 'img/canonSW.png', 
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
        //upgrade level of the building
        this.width = 64;
        this.height = 64;
        this.projectiles = [];
        this.radius = 150;
        this.target = null;
        this.elapsedSpawnTime = 0;
        this.upgradeLevel = 0;
        this.imagePath = 'img/canonSW.png'

        //building image paths
        this.canonNW = 'img/canonNW.png';
        this.canonNE = 'img/canonNE.png';
        this.canonSW = 'img/canonSW.png';
        this.canonSE = 'img/canonSE.png';
        this.towerNW = 'img/towerNW.png';
        this.towerNE = 'img/towerNE.png';
        this.towerSW = 'img/towerSW.png';
        this.towerSE = 'img/towerSE.png';
    }

    //draw building (called through Sprite)
    draw() {
        super.draw(this.imagePath);
    }

    //draw and update building values
    update() {
        
        //if the building has a target
        if (this.target) {

            //set building image based on target location relative to building (NW, NE, SW, SE)
            if (this.target.position.x < this.position.x && this.target.position.y < this.position.y) {
                
                if (this.upgradeLevel === 0) {
                    this.imagePath = this.canonNW;
                }
                else if (this.upgradeLevel === 1) {
                    this.imagePath = this.towerNW;
                }
            }
            else if (this.target.position.x > this.position.x && this.target.position.y < this.position.y) {
                
                if (this.upgradeLevel === 0) {
                    this.imagePath = this.canonNE;
                }
                else if (this.upgradeLevel === 1) {
                    this.imagePath = this.towerNE;
                }
            }
            else if (this.target.position.x < this.position.x && this.target.position.y > this.position.y) {
                
                if (this.upgradeLevel === 0) {
                    this.imagePath = this.canonSW;
                }
                else if (this.upgradeLevel === 1) {
                    this.imagePath = this.towerSW;
                }
            }
            else {

                if (this.upgradeLevel === 0) {
                    this.imagePath = this.canonSE;
                }
                else if (this.upgradeLevel === 1) {
                    this.imagePath = this.towerSE;
                }
            }

            //if elapsed time has occured
            if (this.elapsedSpawnTime % 100 === 0) {
                
                //create and push projectile to projectiles array with building's target
                this.projectiles.push(new Projectile({
                    position: {
                        x: this.position.x - 8,
                        y: this.position.y - 32
                    },
                    enemy: this.target
                }));
            }
        }
        else if (this.upgradeLevel === 1) {
            this.imagePath = this.towerSW;
        }
        
        //draw image
        this.draw();

        //increment elapsed time
        this.elapsedSpawnTime++;
    }
}