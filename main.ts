/**
 * Tile Wall Spawner++
 * Spawns random walls when specific tiles are overlapped by a sprite kind.
 * Supports MakeCode Blocks.
 */
//% color=#FF8800 icon="\uf1b3" block="Tile Wall Spawner++"
namespace tileWallSpawnerPlus {

    let spawnedWalls: number[] = []

    /**
     * Direction options for wall spawning
     */
    export enum WallDirection {
        //% block="left"
        Left,
        //% block="right"
        Right,
        //% block="up"
        Up,
        //% block="down"
        Down,
        //% block="any side"
        Any
    }

    /**
     * Trigger a random wall spawn when a sprite overlaps a target tile.
     * @param kind the sprite kind to detect
     * @param targetTile the tile image that triggers the event
     * @param wallTile the tile image to use as the wall
     * @param dir direction to spawn wall
     */
    //% block="when %kind overlaps %targetTile make random %wallTile around it direction %dir"
    //% kind.shadow=spritekind blockExternalInputs=1
    //% targetTile.shadow=tileset_tile
    //% wallTile.shadow=tileset_tile
    export function spawnWallOnTileOverlap(
        kind: number,
        targetTile: Image,
        wallTile: Image,
        dir: WallDirection
    ) {
        scene.onOverlapTile(kind, targetTile, function (sprite, location) {
            let id = location.col * 100 + location.row
            if (spawnedWalls.indexOf(id) >= 0) return

            let possible: tiles.Location[] = []
            switch (dir) {
                case WallDirection.Left:
                    possible.push(tiles.getTileLocation(location.col - 1, location.row))
                    break
                case WallDirection.Right:
                    possible.push(tiles.getTileLocation(location.col + 1, location.row))
                    break
                case WallDirection.Up:
                    possible.push(tiles.getTileLocation(location.col, location.row - 1))
                    break
                case WallDirection.Down:
                    possible.push(tiles.getTileLocation(location.col, location.row + 1))
                    break
                case WallDirection.Any:
                    possible = [
                        tiles.getTileLocation(location.col - 1, location.row),
                        tiles.getTileLocation(location.col + 1, location.row),
                        tiles.getTileLocation(location.col, location.row - 1),
                        tiles.getTileLocation(location.col, location.row + 1)
                    ]
                    break
            }

            // Filter valid map positions
            possible = possible.filter(loc =>
                loc.col >= 0 && loc.row >= 0 &&
                loc.col < tiles.tilemapColumns() &&
                loc.row < tiles.tilemapRows()
            )

            let pick = possible._pickRandom()
            if (!pick) return

            tiles.setTileAt(pick, wallTile)
            tiles.setWallAt(pick, true)

            // Remember wall
            spawnedWalls.push(pick.col * 100 + pick.row)

            // Flash red effect
            flashWallEffect(pick)
        })
    }

    /**
     * Visual flash for spawned walls
     */
    function flashWallEffect(loc: tiles.Location) {
        const flash = sprites.create(img`
            f f f f f f f f
            f 2 2 2 2 2 2 f
            f 2 2 2 2 2 2 f
            f 2 2 2 2 2 2 f
            f 2 2 2 2 2 2 f
            f 2 2 2 2 2 2 f
            f 2 2 2 2 2 2 f
            f f f f f f f f
        `, SpriteKind.Food)
        tiles.placeOnTile(flash, loc)
        flash.setFlag(SpriteFlag.Ghost, true)
        flash.z = 1000
        flash.startEffect(effects.fountain)
        pause(randint(250, 400))
        flash.destroy()
    }
}

