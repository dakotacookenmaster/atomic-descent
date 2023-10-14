import { GameScene } from "./scenes/gameScene"
import { GameConfig } from "./types"
import { Scale } from "phaser"

const config: GameConfig = {
    title: "Atomic Descent",
    fullscreenTarget: "app",
    scene: [GameScene],
    parent: "app",
    backgroundColor: "#18216D",
    antialias: false,
    antialiasGL: false,
    scale: {
        width: 864,
        height: 624,
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: {
                y: 1350,
            }
        }
    }
}

export class AtomicDescentGame extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config)
    }
}

window.onload = () => {
    new AtomicDescentGame(config)
}