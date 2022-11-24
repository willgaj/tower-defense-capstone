//class for sprite rendering
class Sprite {

    //constructor passed sprite position, imageSrc, animation frames, and image offset
    constructor({position = {x: 0, y: 0}, imageSrc, frames = {max: 1}, offset = {x: 0, y: 0}}) {

        //sprite properties
        //position of sprite
        //image of sprite
        //animation frames data
        //image offset
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.frames = {
            max: frames.max,
            current: 0,
            elapsed: 0,
            hold: 8
        };
        this.offset = offset;
    }

    //draw sprite passed by imageSrc (imageSrc is passed for unique building image switching)
    draw(imageSrc = this.image.src) {

        //crop image for animation processing
        const cropWidth = this.image.width / this.frames.max;
        const crop = {
            position: {
                x: cropWidth * this.frames.current,
                y: 0
            },
            width: cropWidth,
            height: this.image.height
        };

        //if passed value is different than current, replace (this is for buildings' unique images)
        if (imageSrc != this.image.src) {
            this.image.src = imageSrc;
        }

        //draw sprite
        c.drawImage(this.image, crop.position.x, crop.position.y, crop.width, crop.height, this.position.x + this.offset.x, this.position.y + this.offset.y, crop.width, crop.height);
        
        //animate sprite with a given delay (hold)
        this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.hold === 0) {
            this.frames.current++;
            if (this.frames.current >= this.frames.max) {
                this.frames.current = 0;
            }
        }
    }
}