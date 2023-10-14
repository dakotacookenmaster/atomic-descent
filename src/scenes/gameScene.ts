import { Scene } from "phaser"
import { Text, StaticGroup, CursorKeys, SpriteWithDynamicBody } from "../types"

export class GameScene extends Scene {
    delta!: number
    lastStarTime!: number
    starsCaught!: number
    starsFallen!: number
    sand!: StaticGroup
    info!: Text
    isJumping = false
    cursors!: CursorKeys | undefined
    person!: SpriteWithDynamicBody

    constructor() {
        super({
            key: "GameScene"
        })
    }

    init(): void { // on scene start
        this.delta = 1000
        this.lastStarTime = 0
        this.starsFallen = 0
        this.starsCaught = 0
    }

    preload(): void { // before scene objs created - contains loading assets
        this.load.setBaseURL("/assets")
        this.load.image("tiles", "sprites/Medieval_tiles_free_2.0.png")
        this.load.image("props", "sprites/Medieval_props_free.png")
        this.load.spritesheet("characters", "sprites/characters.png", {
            frameWidth: 16,
            frameHeight: 24
        })
        this.load.audio("retro-music", "/sounds/retro-music.mp3")
        this.load.tilemapTiledJSON("level-0", "/maps/level-0/tiled/Level_0.json")
    }

    create(): void { // once the assets are loaded
        const retroMusic = this.sound.add("retro-music", { loop: true })
        retroMusic.play()

        const map = this.make.tilemap({ key: "level-0", tileWidth: 48, tileHeight: 48 })
        console.log("Before")
        map.addTilesetImage("Medieval_tiles_free_2_0", "tiles")
        console.log("After")
        const groundLayer = map.createLayer(0, "Medieval_tiles_free_2_0", 0, 0)!
        const foreGround = map.createLayer(1, "Medieval_tiles_free_2_0", 0, 0)!

        foreGround.setCollisionBetween(0, 187)

        this.info = this.add.text(10, 10, '', {
            font: '24px Arial Bold',
            color: "#FBFBAC"
        })

        this.person = this.physics.add.sprite(80, 80, "characters", 0).setBounce(0)
        this.person.setCollideWorldBounds(true)

        this.cursors = this.input.keyboard?.createCursorKeys()

        this.person.setScale(2, 2)

        this.physics.add.collider(foreGround, this.person, () => {
            this.isJumping = false
            this.person.body.gravity.y = 0
        })

    }

    update(time: number): void { // every tick
        if (this.cursors) {
            this.person.setVelocityX(0)
            if (this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.person.setVelocityX(-200)
            } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
                this.person.setVelocityX(200)
            }

            if (this.cursors.up.isDown) {
                if (!this.isJumping && this.person.body.onFloor()) {
                    this.isJumping = true
                    this.person.setVelocityY(-460)
                    this.person.body.gravity.y = -(1 / 3) * this.physics.world.gravity.y
                }
            }

            if ((this.cursors.up.isUp || !this.person.body.onFloor()) && this.isJumping) {
                this.person.body.gravity.y = 0
            }
        }


        let diff: number = time - this.lastStarTime
        if (diff > this.delta) {
            this.lastStarTime = time
            if (this.delta > 500) {
                this.delta -= 20
            }
            // this.emitStar()
        }

        this.info.text = `${this.starsCaught} caught - ${this.starsFallen} fallen (max 3)`
    }

    // private onClick(star: Image): () => void {
    //     return () => {
    //         this.scale.startFullscreen()
    //         star.setTint(0x00ff00)
    //         star.setVelocity(0, 0)
    //         this.starsCaught += 1
    //         this.time.delayedCall(100, (star: Image) => {
    //             star.destroy()
    //         }, [star])
    //     }
    // }

    // private onFall(star: Image): () => void {
    //     return () => {
    //         star.setTint(0xff0000);
    //         this.starsFallen += 1;
    //         this.time.delayedCall(100, (star: Image) => {
    //             star.destroy();
    //             if (this.starsFallen > 2) {
    //                 this.scene.start("ScoreScene", {
    //                     starsCaught: this.starsCaught
    //                 })
    //             }
    //         }, [star]);
    //     }
    // }

    // private emitStar(): void {
    //     let star: Image;
    //     let x = Phaser.Math.Between(25, 775);
    //     let y = 26;
    //     star = this.physics.add.image(x, y, "props");
    //     star.setDisplaySize(50, 50);
    //     star.setVelocity(0, 200);
    //     star.setInteractive();
    //     star.on('pointerdown', this.onClick(star), this);
    //     this.physics.add.collider(
    //         star,
    //         this.sand,
    //         this.onFall(star),
    //         undefined,
    //         this
    //     );
    // }

}