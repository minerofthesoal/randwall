//% color="#FF8800" weight=100 icon="\uf1b2" block="Smart Walls"
namespace smartWalls {
    export enum WallDirection {
        //% block="all"
        All,
        //% block="left only"
        Left,
        //% block="right only"
        Right,
        //% block="up only"
        Up,
        //% block="down only"
        Down,
        //% block="left or right"
        LeftRight,
        //% block="up or down"
        UpDown
    }

    let currentDirection: WallDirection = WallDirection.All;
    let wallProtection: boolean = false;

    /**
     * Set the wall direction to control where random walls can appear
     */
    //% block="set wall direction to %dir"
    export function setWallDirection(dir: WallDirection) {
        currentDirection = dir;
    }

    /**
     * Create a wall not in the given direction around the sprite
     */
    //% block="create wall not in direction of %sprite using %wallSprite"
    export function createWallNotInDirection(sprite: Sprite, wallSprite: Image) {
        if (wallProtection) return;
        wallProtection = true;

        let dx = 0;
        let dy = 0;

        switch (currentDirection) {
            case WallDirection.Left: dx = 1; break;
            case WallDirection.Right: dx = -1; break;
            case WallDirection.Up: dy = 1; break;
            case WallDirection.Down: dy = -1; break;
            case WallDirection.LeftRight: dx = Math.randomRange(0, 1) == 0 ? -1 : 1; break;
            case WallDirection.UpDown: dy = Math.randomRange(0, 1) == 0 ? -1 : 1; break;
            case WallDirection.All:
            default:
                dx = Math.randomRange(-1, 1);
                dy = Math.randomRange(-1, 1);
                break;
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
     * Create a wall not in direction using default wall sprite
     */
    //% block="create wall not in direction of %sprite using default wall"
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
        createWallNotInDirection(sprite, defaultWall);
    }

    /**
     * Demo setup: spawn default walls when player overlaps tile
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
