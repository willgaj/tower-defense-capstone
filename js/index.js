//initializing canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//setting canvas size
canvas.width = 1280;
canvas.height = 640;

const placementTiles = [];

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

const image = new Image();
image.src = 'img/map.png';
image.onload = () => {
    c.drawImage(image, 0, 0);
}

const youDiedAudio = new Audio();
youDiedAudio.src = 'sound/youDied.mp3';
youDiedAudio.muted = false;

const enemies = [];

function spawnEnemies(spawnCount, speed, health) {
    for (let i = 1; i < spawnCount + 1; i ++) {
        const xOffset = i * 150;
        enemies.push(new Enemy({position: {x: waypoints[0].x - xOffset, y: waypoints[0].y}, speed, health}));
    }
}

const buildings = [];
let activeTile = undefined;
let enemyCount = 3;
let hearts = 10;
let coins = 100;
let buildingCost = 50;
let speed = 1;
let health = 90;
let killCount = 0;

const explosions = [];

spawnEnemies(enemyCount, speed, health);

function animate() {
    const animationId = requestAnimationFrame(animate);
    
    c.drawImage(image, 0, 0);

    placementTiles.forEach(tile => {
        tile.update(mouse);
    });

    buildings.forEach(building => {
        building.update();
        building.target = null;
        const validEnemies = enemies.filter(enemy => {
            const xDifference = enemy.center.x - building.position.x;
            const yDifference = enemy.center.y - building.position.y;
            const distance = Math.hypot(xDifference, yDifference);
            return distance < enemy.radius + building.radius;
        });
        building.target = validEnemies[0];

        for (let i = building.projectiles.length - 1; i >= 0; i --) {
            const projectile = building.projectiles[i];

            projectile.update();

            const xDifference = projectile.enemy.center.x - projectile.position.x;
            const yDifference = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(xDifference, yDifference);
            
            //projectile hits enemy
            if (distance < projectile.enemy.radius + projectile.radius) {
                //enemy health and removal
                projectile.enemy.health -= 20;
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy;
                    })

                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1);
                        coins += 10;
                        killCount++;
                        document.querySelector("#coins").innerHTML = coins;
                        document.querySelector("#killCount").innerHTML = killCount;
                    }
                }
                explosions.push(new Sprite({position: {x: projectile.position.x, y: projectile.position.y}, 
                                            imageSrc: 'img/explosion.png', 
                                            frames: {max: 10}, 
                                            offset: {x: -64, y: -64}}));
                building.projectiles.splice(i, 1);
            }
        }
    });

    for (let i = enemies.length - 1; i >= 0; i --) {
        const enemy = enemies[i];
        enemy.update();

        if (enemy.position.x > canvas.width) {
            hearts -= 1;
            enemies.splice(i, 1);
            document.querySelector("#hearts").innerHTML = hearts;

            if (hearts === 0) {
                cancelAnimationFrame(animationId);
                document.querySelector('#gameOver').style.display = 'flex';
                youDiedAudio.play();
            }
        }
    }

    for (let i = explosions.length - 1; i >= 0; i --) {
        const explosion = explosions[i];
        explosion.draw();

        if (explosion.frames.current >= explosion.frames.max - 1) {
            explosions.splice(i, 1);
        }
    }

    //track total amount of enemies
    if (enemies.length === 0) {
        enemyCount += 2;
        speed += 0.25;
        health += 5;
        spawnEnemies(enemyCount, speed, health);
    }
}

const mouse = {
    x: undefined,
    y: undefined
};

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