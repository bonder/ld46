 import {
     SceneMain
 } from "./scenes/sceneMain";
 import {
     SceneLoad
 } from "./scenes/sceneLoad";
 import {
     SceneTitle
 } from "./scenes/sceneTitle";
 import {
     SceneOver
 } from "./scenes/sceneOver";
 //
 //VERSION 3.1.2
 //
 var isMobile = navigator.userAgent.indexOf("Mobile");
 if (isMobile == -1) {
     isMobile = navigator.userAgent.indexOf("Tablet");
 }
 var w = 480;
 var h = 640;
 //
 //
 if (isMobile != -1) {
     w = window.innerWidth;
     h = window.innerHeight;
 }
 var config = {
     type: Phaser.AUTO,
     width: w,
     height: h,
     parent: 'phaser-game',
     physics:{
        default:'arcade',
        arcade:{
             debug:true
        }
     },
     scene: [SceneLoad, SceneTitle, SceneMain, SceneOver]
 };
 /* physics:{
           default:'arcade',
           arcade:{
                debug:true
           }
      },*/
 let game = new Phaser.Game(config);