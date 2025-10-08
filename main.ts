//% color="#FF6600" weight=100 icon="\uf1b2" block="Smart Walls"
namespace smartWalls {

    type Dir = "N" | "E" | "S" | "W";

    let allowedDirections: Dir[] = ["N", "E", "S", "W"];
    let wallProtection: boolean = false;

    /**
     * Set allowed wall directions using an array of directions
     */
    //% block="set allowed wall directions to %dirs"
    //% dirs.shadow="lists_create_with"
    //% dirs.defl="N,E,S,W"
    export function setAllowedDirections(dirs: string[]) {
        let filtered: Dir[] = [];
        for (let i = 0; i < dirs.length; i++) {
            let d = dirs[i].trim().toUpperCase() as Dir;
            if (d == "N" || d == "E" || d == "S" || d == "W") {
                filtered.push(d);
            }
        }
        allowedDirections = filtered.length > 0 ? filtered : ["N", "E", "S", "W"];
    }

    /**
     * Create a wall around the sprite using allowed directions array
     */
    //% block="create wall around %sprite using %wallSprite"
    export function createWall(sprite: Sprite, wallSprite: Image) {
        if (wallProtection) return;
        wallProtection = true;

        // Pick a random allowed direction
        let dir: Dir = allowedDirections._pickRandom();
        let dx = 0, dy = 0;
        switch (dir) {
            case "N": dy = -1; break;
            case "E": dx = 1; break;
            case "S": dy = 1; break;
            case "W": dx = -1; break;
        }

        let x = sprite.x + dx * 16;
        let y = sprite.y + dy * 16;

        let wall = sprites.create(wallSprite.clone(), SpriteKind.Projectile);
        wall.setPosition(x, y);
        wall.setFlag(SpriteFlag.GhostThroughWalls, true);

        // Flash red
        let original = wall.image.clone();
        let flashImage = original.clone();
        flashImage.fill(2);
        wall.setImage(flashImage);
        pause(250);
        wall.setImage(original);

        pause(100);
        wallProtection = false;
    }

    /**
     * Create a wall with default wall sprite
     */
    //% block="create wall around %sprite using default wall"
    export function createWallDefault(sprite: Sprite) {
        let defaultWall = img`
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
            8888888888888888
        `;
        createWall(sprite, defaultWall);
    }

    /**
     * Demo: spawn default walls on tile overlap
     */
    //% block="setup demo for tile overlap example"
    export function setupDemo() {
        scene.setBackgroundColor(9);
        let player = sprites.create(img`
            . . . . . . . .
            . . 2 2 2 2 . .
            . 2 2 2 2 2 2 .
            . 2 2 2 2 2 2 .
            . . 2 2 2 2 . .
            . . . 2 2 . . .
            . . . 2 2 . . .
            . . . . . . . .
        `, SpriteKind.Player);
        controller.moveSprite(player);
        scene.cameraFollowSprite(player);

        scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.floorLight0, function (sprite, location) {
            createWallDefault(sprite);
        });
    }
}
