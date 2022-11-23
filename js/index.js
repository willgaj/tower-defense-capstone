//initializing canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//setting canvas size
canvas.width = 1280;
canvas.height = 640;

//array to hold all tower placement positions
const placementTiles = [];

//determining valid placement positons on grid
placements.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 1) {
            placementTiles.push(new PlacementTile({
                position: {
                    x: (x + 1) * 64,
					y: ((y + 1) * 32) - 3
                }
            }));
        }
    })
})

//loading map image
const image = new Image();
image.src = 'img/map.png';
image.onload = () => {
    c.drawImage(image, 0, 0);
}

//loading game over "you died" audio
const youDiedAudio = new Audio();
youDiedAudio.src = 'sound/youDied.mp3';

//array to hold current enemies
const enemies = [];

//function to spawn enemies, called for each wave with varying quantity, speed, and health
function spawnEnemies(spawnCount, speed, health) {
    for (let i = 1; i < spawnCount + 1; i ++) {
        const xOffset = i * 150;
        enemies.push(new Enemy({position: {x: waypoints[0].x - xOffset, y: waypoints[0].y}, speed, health}));
    }
}

//array to hold current buildings
const buildings = [];

//bunch of game values
let activeTile = undefined;
let enemyCount = 3;
let hearts = 10;
let coins = 100;
let buildingCost = 50;
let speed = 10;
let health = 90;
let killCount = 0;

//array to hold active explosions
const explosions = [];

//spawns first wave of enemies
spawnEnemies(enemyCount, speed, health);

//main game (animation) loop
function animate() {
    //recursive call, keeps game looping
    const animationId = requestAnimationFrame(animate);
    
    //drawing game map
    c.drawImage(image, 0, 0);

    //update and draw valid placement tiles
    placementTiles.forEach(tile => {
        tile.update(mouse);
    });

    //update and draw buildings
    buildings.forEach(building => {
        building.update();
        
        //by default, building has no target
        building.target = null;

        //determines if enemies are in range, and sets target as the first in range
        const validEnemies = enemies.filter(enemy => {
            const xDifference = enemy.center.x - building.position.x;
            const yDifference = enemy.center.y - building.position.y;
            const distance = Math.hypot(xDifference, yDifference);
            return distance < enemy.radius + building.radius;
        });
        building.target = validEnemies[0];

        //update and draw the building's projectiles
        for (let i = building.projectiles.length - 1; i >= 0; i --) {
            const projectile = building.projectiles[i];

            projectile.update();

            //finding distance to target
            const xDifference = projectile.enemy.center.x - projectile.position.x;
            const yDifference = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(xDifference, yDifference);
            
            //projectile hits enemy
            if (distance < projectile.enemy.radius + projectile.radius) {
                
                //enemy health damaged
                projectile.enemy.health -= 20;
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy;
                    })

                    //enemy removal if health is <= 0
                    //add coins, kill count, update html
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1);
                        coins += 10;
                        killCount++;
                        document.querySelector("#coins").innerHTML = coins;
                        document.querySelector("#killCount").innerHTML = killCount;
                    }
                }

                //create explosion at projectile and remove projectile
                explosions.push(new Sprite({position: {x: projectile.position.x, y: projectile.position.y}, 
                                            imageSrc: 'img/explosion.png', 
                                            frames: {max: 10}, 
                                            offset: {x: -64, y: -64}}));
                building.projectiles.splice(i, 1);
            }
        }
    });

    //update and draw enemies
    for (let i = enemies.length - 1; i >= 0; i --) {
        const enemy = enemies[i];
        enemy.update();

        //if they made it off screen, reduce lives (hearts), remove enemy, update html
        if (enemy.position.x > canvas.width) {
            hearts -= 1;
            enemies.splice(i, 1);
            document.querySelector("#hearts").innerHTML = hearts;

            //if lives <= 0, pause game, display game over text, play game over sound
            if (hearts <= 0) {
                cancelAnimationFrame(animationId);
                document.querySelector('#gameOver').style.display = 'flex';
                youDiedAudio.play();
            }
        }
    }

    //update and draw explosions
    for (let i = explosions.length - 1; i >= 0; i --) {
        const explosion = explosions[i];
        explosion.draw();

        //remove explosion after animation completes
        if (explosion.frames.current >= explosion.frames.max - 1) {
            explosions.splice(i, 1);
        }
    }

    //if all enemies gone, new wave with increased enemy count, speed, and health
    if (enemies.length <= 0) {
        enemyCount += 2;
        speed += 0.25;
        health += 5;
        spawnEnemies(enemyCount, speed, health);
    }
}

//mouse const
const mouse = {
    x: undefined,
    y: undefined
};

//event listener for clicking on canvas
canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied && coins >= buildingCost) {
        coins -= buildingCost;
        document.querySelector("#coins").innerHTML = coins;
        buildings.push(new Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        }));
        activeTile.isOccupied = true;
    }
})

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    activeTile = null;
    for (const tile of placementTiles) {
        if (mouse.x > tile.position.x - tile.size && mouse.x < tile.position.x + tile.size * 2 &&
            mouse.y > tile.position.y - tile.size && mouse.y < tile.position.y + tile.size * 2) {
            activeTile = tile;
            break;
        }
    }
})

let beginButton = document.querySelector("#beginButton");
beginButton.addEventListener('click', (event) => {
    beginButton.style.display = "none";
    animate();
})