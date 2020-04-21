import {
    BaseScene
} from "./baseScene";
import {
    FlatButton
} from "../common/ui/flatButton";
export class SceneOver extends BaseScene {
    constructor() {
        super('SceneOver');
    }
    preload() {}
    create() {
        super.create();
        //
        //
        // uncomment to turn on music
        // this.mm.setBackgroundMusic("backgroundMusic");
        //
        this.setBackground('tile_background');
        //
        //
        this.makeAlignGrid(11, 11);
        // this.aGrid.showNumbers();
        //
        //
        //
        //  this.placeImage('title', 27, .8);
        this.placeImage("game_over_screen", 60, .75, false);
        //
        //
        //
        //  let buttonStyle = this.textStyles.getStyle(TextStyles.BUTTON_STYLE);
        let btnNext = new FlatButton({
            scene: this,
            textStyle: 'BUTTON_STYLE',
            key: "button",
            text: "Play Again",
            callback: this.playAgain.bind(this)
        });
        this.aGrid.placeAtIndex(104, btnNext);
        
        this.mm.background.stop();
        this.mm.setBackgroundMusic("game_over_song");
        //
        //
        //
        //
        //
        //
        this.makeUi();
        // this.placeText("Test Me!!",49,"frost");
    }
    makeUi() {
        super.makeSoundPanel();
        super.makeGear();

        let score = window.localStorage.getItem('score');
        this.scoreText = this.placeText("SCORE: " + score, 2, "SCORE");
    }
    playAgain() {
        this.mm.background.stop();
        //this.mm.setBackgroundMusic("ludam_dare_better_maybe");
        this.scene.start('SceneTitle');
    }
    update() {}
}