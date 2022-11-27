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

//function to spawn enemies, called for each wave with varying quantity, enemySpeed, and health
function spawnEnemies(spawnCount, speed, health) {
    for (let i = 1; i < spawnCount + 1; i ++) {
        const xOffset = i * 150;
        enemies.push(new Enemy({position: {x: waypoints[0].x - xOffset, y: waypoints[0].y}, speed, health}));
    }
}

//array to hold current buildings
const buildings = [];

/* bunch of game properties set to game start values
 * tile being hovered
 * enemy count
 * amount to increase enemy count by each wave
 * player lives
 * coins for purchasing/upgrading towers
 * cost of building a new tower
 * cost of upgrading a tower
 * speed of enemies
 * enemy speed increase per wave
 * enemy health
 * enemy health increase per wave
 * player kill count
 * current wave
*/
let activeTile = undefined;
let enemyCount = 4;
let enemyCountIncrease = 2;
let hearts = 10;
let coins = 125;
let buildingCost = 50;
let upgradeCost = 100;
let speed = 1;
let speedIncrease = 0.25;
let health = 90;
let healthIncrease = 5;
let killCount = 0;
let waveCount = 1;

//update html to game start values
document.querySelector(".enemy-count-value").innerHTML = enemyCount + enemyCountIncrease;
document.querySelector(".coins-value").innerHTML = coins;
document.querySelector(".enemy-speed-value").innerHTML = speed + speedIncrease;
document.querySelector(".enemy-health-value").innerHTML = health + healthIncrease;
document.querySelector(".kill-count-value").innerHTML = killCount;
document.querySelector(".wave-count-value").innerHTML = waveCount;

//function to determine suffix of wave count number
function ordinal_suffix_of(i) {
    let j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

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
                        document.querySelector(".coins-value").innerHTML = coins;
                        document.querySelector(".kill-count-value").innerHTML = killCount;
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
            document.querySelector(".hearts-value").innerHTML = hearts;

            //if lives <= 0, pause game, display game over text, play game over sound
            if (hearts <= 0) {
                cancelAnimationFrame(animationId);
                document.querySelector('.fade-in-text').style.display = 'flex';
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

    //if all enemies gone
    if (enemies.length <= 0) {
        
        //increase enemy count, speed, and health then spawn new wave
        enemyCount += enemyCountIncrease;
        speed += speedIncrease;
        health += healthIncrease;
        spawnEnemies(enemyCount, speed, health);

        //update next-wave html
        document.querySelector(".enemy-count-value").innerHTML = enemyCount + enemyCountIncrease;
        document.querySelector(".enemy-health-value").innerHTML = health + healthIncrease;
        document.querySelector(".enemy-speed-value").innerHTML = speed + speedIncrease;

        //increment wave count and update html
        waveCount++;
        document.querySelector(".wave-count-value").innerHTML = waveCount;

        //add interest gold and update html
        coins += Math.round(coins * 0.05);
        document.querySelector(".coins-value").innerHTML = coins;
    }
}

//mouse const
const mouse = {
    x: undefined,
    y: undefined
};

//event listener for clicking on canvas
canvas.addEventListener('click', (event) => {

    //if there is a tile hovered
    if (activeTile) {

        //if active tile is an unoccupied space, else has a building
        if (!activeTile.isOccupied  && coins >= buildingCost) {

            //remove coins, update html
            coins -= buildingCost;
            document.querySelector(".coins-value").innerHTML = coins;

            //add building, set tile to occupied
            buildings.push(new Building({
                position: {
                    x: activeTile.position.x,
                    y: activeTile.position.y
                }
            }));
            activeTile.isOccupied = true;
        }
        else if (activeTile.isOccupied && coins >= upgradeCost) {

            //upgrade building
            buildings.forEach(building => {
                if (building.position.x === activeTile.position.x && building.position.y === activeTile.position.y) {
                    if (building.upgradeLevel == 0 && coins >= upgradeCost) {
                        building.upgradeLevel++;
                        building.radius += 50;

                        //remove coins, update html
                        coins -= upgradeCost;
                        document.querySelector(".coins-value").innerHTML = coins;
                    }
                }
            });
        }
    }
})

//event listener for moving mouse in window
window.addEventListener('mousemove', (event) => {

    //update mouse position
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    //clear last hovered tile
    activeTile = null;

    //iterate through tiles, if mouse is on tile, set as active tile
    for (const tile of placementTiles) {
        if (mouse.x > tile.position.x - tile.size && mouse.x < tile.position.x + tile.size * 2 &&
            mouse.y > tile.position.y - tile.size && mouse.y < tile.position.y + tile.size * 2) {
            activeTile = tile;
            break;
        }
    }

    //if the tile has a building on it, set hovered flag to true
    if (activeTile != null) {

        //find hovered building
        buildings.forEach(building => {
            if (building.position.x === activeTile.position.x && building.position.y === activeTile.position.y) {
                building.hovered = true;        
            }
            else {
                building.hovered = false;
            }
        });
    }
    else {
        buildings.forEach(building => {
            building.hovered = false;
        });
    }
})

//event listener for clicking the begin button
let beginButton = document.querySelector(".begin-button");
beginButton.addEventListener('click', (event) => {

    //on click, hide button and start game loop
    beginButton.style.display = "none";
    animate();
})