import { BaseScene } from './baseScene';
import { Align } from '../common/util/align';
import { FormUtil } from '../common/util/formUtil';
import { StarBurst } from '../common/effects/starBurst';

//
//
//
export class SceneMain extends BaseScene {
  constructor() {
    super('SceneMain');
  }
  preload() {
    super.preload();
    console.log('main preload');
  }

  create() {
    //set up the base scene
    super.create();

    console.log('main create');

    this.createWalkAnimation("plant", 7);
    this.createWalkAnimation("ghost", 7);
    this.createWalkAnimation("glorp", 7);
    this.createWalkAnimation("skull", 7);
    this.createWalkAnimation("puppy", 7);
    
    this.configureWaves();
    this.currentWave = 0;
    console.log("currentWave:", this.currentWave);
    this.enemiesLeft = this.waves[this.currentWave].total_enemies;

    this.setBackground('tile_background');

    this.objGroup = this.physics.add.group();

    this.spawnPuppy();

    console.log("Total enemies:",this.waves[this.currentWave].total_enemies);

    this.showGetReady();

    this.time.addEvent({
        delay: this.waves[this.currentWave].spawnRate,
        callback: this.spawnSomething.bind(this),
        repeat: this.waves[this.currentWave].total_enemies-1
    });


    window.scene = this;
    this.input.on('gameobjectdown', this.clickSomething.bind(this));
    this.makeUi();
  }

  makeUi() {
    super.makeSoundPanel();
    super.makeGear();
    super.makeScoreBox();
  }

  configureWaves() {
    this.waves =
        [
            { total_enemies: 3, 
              tip1: "Plants take root.",
              tip2: "Tap to pull the weeds!",
              spawnRate: 2000,
              table: ["plant"]
            },
            { total_enemies: 3,
              tip1: "Glorps are tough.",
              tip2: "Tap them twice!",
              spawnRate: 2000,
              table: ["glorp"]
            },
            { total_enemies: 3,
              tip1: "Skulls are wicked fast.",
              tip2: "Tap them if you can!",
              spawnRate: 2000,
              table: ["skull"]
            },
            {
              total_enemies: 3,
              tip1: "Ghosts are invincible.",
              tip2: "Tap Puppy to avoid!",
              spawnRate: 2000,
              table: ["ghost"]
            },
            { total_enemies: 10,
              tip1: "Okay, here we go...",
              tip2: "It's a monster mash!",
              spawnRate: 2500,
              table: ["plant", "glorp", "ghost", "skull"]
            },
            { total_enemies: 10,
              tip1: "Survived that?",
              tip2: "A little bit faster, then...",
              spawnRate: 2000,
              table: ["plant", "glorp", "ghost", "skull"]
            },
            { total_enemies: 20,
              tip1: "Oh, you're still here?",
              tip2: "Let's add a little heat...",
              spawnRate: 1500,
              table: ["plant", "glorp", "ghost", "skull", "skull",]
            },
            { total_enemies: 10,
              tip1: "How about a...",
              tip2: "SKULL STORM!",
              spawnRate: 500,
              table: ["skull"]
            },
            { total_enemies: 25,
              tip1: "Okay, that was unfair.",
              tip2: "Back to 'normal.'",
              spawnRate: 750,
              table: ["plant", "glorp", "ghost", "skull"]
            },
            { total_enemies: 25,
              tip1: "",
              tip2: "'",
              spawnRate: 500,
              table: ["plant", "glorp", "ghost", "skull"]
            }
        ];
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
              this.removeSomething(child);
              this.emitter.emit("UP_POINTS", -1);
              if (this.enemiesLeft < this.waves[this.currentWave].total_enemies 
                && this.sb.model.score < 0) {
                  this.gameOver();
              }
            }
        }
      }.bind(this)
    );
  }

  showGetReady() {
    this.getReady = this.placeImage("get_ready", 49, .5, false);

    this.waveTip1 = this.placeText(this.waves[this.currentWave].tip1, 60, "mystyle");
    this.waveTip2 = this.placeText(this.waves[this.currentWave].tip2, 82, "mystyle");
   }

  hideGetReady() {
    this.getReady.destroy();
    this.waveTip1.destroy();
    this.waveTip2.destroy();
  }

  showWaveSurvived() {
    this.waveSurvived = this.placeImage("wave_survived", 60, .5, false);
    this.mm.playSound("PUPPY2");
    this.time.addEvent({
      delay: this.waves[this.currentWave].spawnRate,
      callback: this.hideWaveSurvived.bind(this),
      loop: false
  });
  }

  hideWaveSurvived() {
    this.waveSurvived.destroy();
    this.startNextWave();
  }

  spawnPuppy() {
    let pup = this.placeImage('puppy', 115, 0.1, true);
    this.bottomY = pup.y;
    pup.type = 'puppy';
    pup.setInteractive();
    this.objGroup.add(pup);
    pup.body.setVelocityX(100);
    pup.setSize(8,8, true);
    this.physics.add.collider(pup, this.objGroup, this.gameOver, null, this);
    this.mm.playSound("PUPPY2");
  }

  spawnSomething() {
    if (this.getReady) {
      this.hideGetReady();
    }
    let pos = Phaser.Math.Between(0, 10);
    let howMany = this.waves[this.currentWave].table.length;
    let which = this.waves[this.currentWave].table[Phaser.Math.Between(0, howMany-1)];
    let cfg = this.configureIt(which);
    let obj = this.placeImage(cfg.img, pos, 0.1, true);
    obj.type = cfg.img;
    obj.hp = cfg.hp;
    obj.cfg = cfg;
    obj.setInteractive();
    this.objGroup.add(obj);
    obj.body.setVelocityY(cfg.velocityY);
    obj.setSize(24,24,true);
  }

  configureIt(which) {
    let cfg = {};
    if (which === "ghost") {
      cfg = {
        img: 'ghost',
        velocityY: 100,
        hp: -1,
        hit: function () {
        },
      };
    }
    if (which === "plant") {
      cfg = { img: 'plant', velocityY: 50, hp: 1 };
    }
    if (which === "glorp") {
      cfg = { img: 'glorp', velocityY: 75, hp: 2 };
    }
    if (which === "skull") {
      cfg = { img: "skull", velocityY: 200, hp: 1};
    }
    return cfg;
  }

  clickSomething(pointer, obj) {
    if (obj.type === 'puppy') {
      obj.setVelocityX(obj.body.velocity.x * -1);
      obj.flipX = !obj.flipX;
      this.mm.playSound("s11");
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
      this.removeSomething(obj);

    } else {
      if (obj.cfg.hit) {
        obj.cfg.hit();
      }
    }
  }

  removeSomething(obj) {
    obj.destroy();
    this.enemiesLeft--;
    if (this.enemiesLeft === 0) {
      this.showWaveSurvived();
    }
  }

  startNextWave() {
    if (this.currentWave < this.waves.length-1) {
      this.currentWave++;
    }
    this.showGetReady();
    this.mm.playSound("PUPPY2");

    console.log(this.waves[this.currentwave]);
    this.enemiesLeft = this.waves[this.currentWave].total_enemies;

    this.time.addEvent({
      delay: this.waves[this.currentWave].spawnRate,
      callback: this.spawnSomething.bind(this),
      repeat: this.waves[this.currentWave].total_enemies-1
  });

  }

  createWalkAnimation(sheetName, framesPerSecond, MaxFrames) {
    let walk = this.anims.create({
        key: sheetName+'walk',
        frames: this.anims.generateFrameNumbers(sheetName),
        frameRate: framesPerSecond,
        repeat: -1
    });

    if (sheetName === "ghost" || sheetName === "glorp" || sheetName === "skull") {
        walk.removeFrameAt(8);
    }
  }

  gameOver() {
    this.mm.playSound("whimper");
    window.localStorage.setItem('score', this.sb.model.score);
    console.log("score", this.sb.model.score, "ls", window.localStorage.getItem("score"));
    this.scene.switch("SceneOver");
  }

}
