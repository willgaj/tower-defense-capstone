//2.06: class for building placement locations
class PlacementTile {

    //2.06.a: constructor is passed the tile location
    constructor({position = {x: 0, y: 0}}) {

        //2.06.b-f: tile properties
        //position of tile
        //size of tile (for mouse hover detection)
        //color of tile marker
        //occupied (by building) flag
        this.position = position;
        this.size = 10;
        this.color = 'rgba(255, 255, 255, .15)';
        this.occupied = false;
		this.levelOne = false;
    }

    //2.06.g: draw tile marker
    draw() {
        c.beginPath();
		c.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
		c.fillStyle = this.color;
		c.fill();
    }

    //2.06.h: draw and update tile, passed the current mouse location
    update(mouse) {
        this.draw();

        //if mouse is hovering over a tile, highlight, otherwise reset marker to semi-transparent
        if (mouse.x > this.position.x - this.size && mouse.x < this.position.x + this.size * 2 &&
            mouse.y > this.position.y - this.size && mouse.y < this.position.y + this.size * 2) {
            this.color = 'white';
        }
        else {
            this.color = 'rgba(255, 255, 255, .15)';
        }
    }
}