import {
    BaseScene
} from "./baseScene";
import {
    FlatButton
} from "../common/ui/flatButton";


//
//
//
export class SceneTitle extends BaseScene {
    constructor() {
        super('SceneTitle');
    }
    preload() {
        super.preload();
    }
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

        this.placeImage("puppy_peril", 49, .5, false);
        //
        //
        //
      //  let buttonStyle = this.textStyles.getStyle(TextStyles.BUTTON_STYLE);
        let btnNext = new FlatButton({
            scene: this,
            textStyle: 'BUTTON_STYLE',
            key: "button",
            text: "START GAME",
            callback: this.startGame.bind(this)
        });
        this.aGrid.placeAtIndex(104, btnNext);
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
    }
    startGame() {
        this.scene.start("SceneMain");
    }
    update() {}
}