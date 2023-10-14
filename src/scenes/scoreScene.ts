import { Scene } from "phaser"
import { Text } from "../types"

const textColor = "#FBFBAC"
export class ScoreScene extends Scene {
    score!: number
    result!: Text
    hint!: Text

    constructor() {
        super({
            key: "ScoreScene"
        })
    }

    init(params: any): void {
        this.score = params.starsCaught
    }

    create(): void {
        let resultText = `Your score is ${this.score}!`
        this.result = this.add.text(200, 250, resultText, {
            font: "48px Arial Bold",
            color: textColor,
        })
        let hintText = "Click to restart"
        this.hint = this.add.text(300, 350, hintText, {
            font: "24px Arial Bold",
            color: "#FBFBAC"
        })
        this.input.on("pointerdown", () => {
            this.scene.start("WelcomeScene")
        })
    }
}