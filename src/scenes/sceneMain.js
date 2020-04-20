import { BaseScene } from './baseScene';
import { Align } from '../common/util/align';
import { FormUtil } from '../common/util/formUtil';
import { StarBurst } from '../common/effects/starBurst';
import { ScoreBox } from "../common/comps/scoreBox";
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
    this.aGrid.showNumbers();
    //

    this.sb = new ScoreBox({
        scene: this
    });
    this.placeAtIndex(2, this.sb);
    //
    //set the score
    //
    this.emitter.emit("SET_SCORE", 0);

    this.createWalkAnimation("plant", 7);
    this.createWalkAnimation("ghost", 7);
    this.createWalkAnimation("glorp", 7);
    this.createWalkAnimation("puppy", 7);

    this.enemies = ['ghost', 'plant', 'glorp'];
    
    this.configureWaves();
    this.currentWave = 1;

    this.objGroup = this.physics.add.group();

    this.spawnPuppy();

    console.log("Total enemies:",this.waves[this.currentWave-1].total_enemies);

    //this.spawnSomething();
    
    this.time.addEvent({
        delay: this.waves[this.currentWave-1].spawnRate,
        callback: this.spawnSomething.bind(this),
        repeat: this.waves[this.currentWave-1].total_enemies-1
    });


    window.scene = this;
    this.input.on('gameobjectdown', this.clickSomething.bind(this));
    this.makeUi();
  }

  makeUi() {
    super.makeSoundPanel();
    super.makeGear();
  }

  configureWaves() {
    this.waves =
        [
            { total_enemies: 3, 
              tip: "Plants take 1 hit. Don't let them touch puppy!",
              spawnRate: 3000,
              table: ["plant", "glorp"]
            }
        ]
  }

  update() {
    this.objGroup.children.entries.forEach(
      function (child) {
        if (child) {
          if (child.type === 'puppy') {
            if (child.x > this.gw) {
              child.body.setVelocityX(-100);
              child.flipX = true;
            }
            if (child.x < 0) {
              child.body.setVelocityX(100);
              child.flipX = false;
            }
            return;
          }
          if (child.type === "plant") {
            if (child.y < this.gh && child.y > this.bottomY && child.body.velocity.y != 0) {
                child.body.y = this.bottomY;
                child.body.setVelocityX(0);
                return;
            }
        }
        if (child.y > this.gh) {
              child.destroy();
            }
        }
      }.bind(this)
    );
  }

  spawnPuppy() {
    let pup = this.placeImage('puppy', 115, 0.1, true);
    this.bottomY = pup.y;
    pup.type = 'puppy';
    pup.setInteractive();
    this.objGroup.add(pup);
    pup.body.setVelocityX(100);
  }

  spawnSomething() {
    let pos = Phaser.Math.Between(0, 10);
    let howMany = this.waves[this.currentWave-1].table.length;
    console.log("How many to choose from:", howMany-1);
    let which = this.waves[this.currentWave-1].table[Phaser.Math.Between(0, howMany-1)];
    let cfg = this.configureIt(which);
    let obj = this.placeImage(cfg.img, pos, 0.1, true);
    obj.type = cfg.img;
    obj.hp = cfg.hp;
    obj.cfg = cfg;
    obj.setInteractive();
    this.objGroup.add(obj);
    obj.body.setVelocityY(cfg.velocityY);
  }

  configureIt(which) {
    let cfg = {};
    if (which === "ghost") {
      cfg = {
        img: 'ghost',
        velocityY: 100,
        hp: -1,
        hit: function () {
          console.log('hit!', this.hp);
          console.log("frame", this.frame)
        },
      };
    }
    if (which === "plant") {
      cfg = { img: 'plant', velocityY: 50, hp: 1 };
    }
    if (which === "glorp") {
      cfg = { img: 'glorp', velocityY: 75, hp: 2 };
    }
    return cfg;
  }

  clickSomething(pointer, obj) {
    if (obj.type === 'puppy') {
      obj.setVelocityX(obj.body.velocity.x * -1);
      obj.flipX = !obj.flipX;
      return;
    }

    if (obj.hp > 0) {
      obj.hp = obj.hp - 1;
    }

    if (obj.hp === 0) {
      let stars = new StarBurst({
        scene: this,
        x: obj.x,
        y: obj.y,
        f: 1,
        tint: 0xffcc00,
      });
      this.emitter.emit("UP_POINTS", 1);
      obj.destroy();
    } else {
      if (obj.cfg.hit) {
        obj.cfg.hit();
      }
    }
  }

  createWalkAnimation(sheetName, framesPerSecond, MaxFrames) {
    let walk = this.anims.create({
        key: sheetName+'walk',
        frames: this.anims.generateFrameNumbers(sheetName),
        frameRate: framesPerSecond,
        repeat: -1
    });

    if (sheetName === "ghost" || sheetName === "glorp") {
        walk.removeFrameAt(8);
    }
  }

}
