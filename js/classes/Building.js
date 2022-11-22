class Building extends Sprite {
    constructor({position= {x: 0, y: 0}}) {
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
        this.width = 64;
        this.height = 64;
        this.projectiles = [];
        this.radius = 150;
        this.target = null;
        this.elapsedSpawnTime = 0;
    }

    draw() {
        super.draw();

        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'rgba(0, 0, 255, 0.2)';
        c.fill();
    }

    update() {
        this.draw();

        if (this.elapsedSpawnTime % 100 === 0 && this.target) {
            
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

            this.projectiles.push(new Projectile({
                position: {
                    x: this.position.x - 8,
                    y: this.position.y - 32
                },
                enemy: this.target
            }));
        }
        this.elapsedSpawnTime++;
    }
}