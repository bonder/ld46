import {
    BaseScene
} from "./baseScene";
import {
    Align
} from "../common/util/align";
import {FormUtil} from "../common/util/formUtil";
import {StarBurst} from "../common/effects/starBurst";
//
//
//
export class SceneMain extends BaseScene {
    constructor() {
        super('SceneMain');
    }
    preload() {}
    create() {
        //set up the base scene
        super.create();
        //set the grid for the scene
        this.makeAlignGrid(11, 11);
        //show numbers for layout and debugging 
        //
        //this.aGrid.showNumbers();
        //

        this.objGroup = this.physics.add.group();

        this.spawnPuppy();

        this.spawnSomething();
        this.time.addEvent({ 
            delay: 1000, 
            callback: this.spawnSomething.bind(this), 
            loop: true });

        window.scene = this;
        this.input.on("gameobjectdown", this.clickSomething.bind(this));
        this.makeUi();     
    }
   
    makeUi() {
        super.makeSoundPanel();
        super.makeGear();
    }
    update() {

        this.objGroup.children.entries.forEach(function(child) {
            if (child) {
                if (child.type === "face") {
                    if (child.x > (this.gw)) {
                        child.body.setVelocityX(-100);
                    }
                    if (child.x < 0) {
                        child.body.setVelocityX(100);
                    }
                }
            } 
            else {
                if (child.y > this.gh) {
                    child.destroy();
                }
            }    
        }.bind(this))
    }

    spawnPuppy() {
        let pup = this.placeImage("face", 115, .1, true);
        pup.type = "face";
        this.objGroup.add(pup);
        pup.body.setVelocityX(100);
    }

    spawnSomething() {
        let pos = Phaser.Math.Between(0,10);
        let which = Phaser.Math.Between(0,1);
        let cfg = this.configureIt(which);
        let obj = this.placeImage(cfg.img, pos, .1, true);
        obj.type = cfg.img;
        obj.setInteractive();
        this.objGroup.add(obj);
        obj.body.setVelocityY(cfg.velocityY);
    }

    configureIt(which) {
        let cfg = {};
        if (which === 0) {
            cfg = { img: "ghost0000", velocityY: 100};
        }
        else {
            cfg = { img: "glorp0000", velocityY: 50};
        }
        return cfg;
    }

    clickSomething(pointer, obj) {
        let stars = new StarBurst({
            scene: this,
            x: obj.x,
            y: obj.y,
            f: 1,
            tint: 0xffcc00
        });
        obj.destroy();
    }
}