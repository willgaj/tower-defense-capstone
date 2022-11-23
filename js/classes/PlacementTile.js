//class for building placement locations
class PlacementTile {

    //constructor is passed the tile location
    constructor({position = {x: 0, y: 0}}) {

        //tile properties
        //position of tile
        //size of tile (for mouse hover detection)
        //color of tile marker
        //occupied (by building) flag
        this.position = position;
        this.size = 10;
        this.color = 'rgba(255, 255, 255, .15)';
        this.occupied = false;
    }

    //draw tile marker
    draw() {
        c.beginPath()
		c.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
		c.fillStyle = this.color
		c.fill()
    }

    //draw and update tile, passed the current mouse location
    update(mouse) {
        this.draw();

        //if mouse is hovering over a tile, highlight, otherwise reset marker to semi-transparent
        if (mouse.x > this.position.x - this.size && mouse.x < this.position.x + this.size * 2 &&
            mouse.y > this.position.y - this.size && mouse.y < this.position.y + this.size * 2) {
            this.color = 'white';

            //if the tile has a building on it, show turret range
            if (this.isOccupied) {
                c.beginPath();
                const turretRadius = 150; //this value needs to match the fire-radius of the turrets
                c.arc(this.position.x, this.position.y, turretRadius, 0, Math.PI * 2);
                c.fillStyle = 'rgba(0, 0, 255, 0.1)';
                c.fill();
            }
        }
        else {
            this.color = 'rgba(255, 255, 255, .15)';
        }
    }
}