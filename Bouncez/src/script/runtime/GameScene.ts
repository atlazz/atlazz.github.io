import { ui } from "./../../ui/layaMaxUI";
import * as Const from "../Const";
import Global from "../Global";
import CameraBox from "../component/CameraBox";
import BoardBox from "../component/BoardBox";
import Player from "../component/Player";
import GameConfig from "../../GameConfig";
import OverView from "./OverView";
import ReviveView from "./ReviveView";
import * as Ad from "../util/Ad";
import ws from "../util/ws.js";

export default class GameScene extends ui.game.GameSceneUI {
    static instance: GameScene;

    /**
     * 打开该单例页面，触发onOpened
     * @param param  onOpened方法的传参
     */
    static openInstance(param?: any) {
        if (GameScene.instance) {
            GameScene.instance.onOpened(param);
            GameScene.instance.showTutorial();
        } else {
            Laya.Scene.open(Const.URL_GameScene, false, param);
        }
    }

    onOpened(param?: any) {
        console.log("GameScene onOpened()");
        this.visible = true;
        this.state = Const.GameState.READY;
    }

    private scene3D: Laya.Scene3D;

    private _score: number = 0;

    private scoreStep: number = 10;

    public cameraBoxCompo: CameraBox;

    public boardBoxCompo: BoardBox;

    public playerCompo: Player;

    public state: Const.GameState;

    private startTimestamp: number;

    /**复活次数 */
    private reviveCount: number = 0;

    /**天空背景计数器 */
    public skyCount: number = 0;
    /**天空背景总数 */
    public skyNum: number = 2;

    /**音乐对象 */
    private sound;

    constructor() {
        super();
        console.log("GameScene constructor()");

        this.hideTutorial(); // to add
        // this.showTutorial(); // to delete
        // this.bindButtons(); // to delete
        
        this.initScene3D();

        GameScene.instance = this;

        // 加载BGM
        if (Laya.Browser.onMiniGame) {
            this.sound = new wx.createInnerAudioContext();
            this.sound.src = Const.URL_BGM;
        } 
    }

    onEnable() {
        this.bindButtons();
    }

    private bindButtons() {
        this.tutorialBox.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.gameStart();
        });
    }

    /**初始化3D场景 */
    private initScene3D() {
        this.scene3D = this.scene3DBox.addChild(new Laya.Scene3D()) as Laya.Scene3D;

        // 初始化方向光
        let directionLight: Laya.DirectionLight = this.scene3D.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.transform.localPosition = Const.DirectionLightPos.clone();
        directionLight.transform.localRotationEuler = Const.DirectionLightRot.clone();
        directionLight.color = Const.DirectionLightColor.clone();
        
        // 初始化摄像机
        let cameraBox: Laya.Sprite3D = this.scene3D.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;
        this.cameraBoxCompo = cameraBox.addComponent(CameraBox);

        // 初始化玩家, 位置与摄像机局部绑定
        let player_type: string = "cat";

        // 根据类型字段创建玩家模型
        if (player_type == "cat") {
            Laya.Mesh.load(Const.URL_PlayerModelCat, Laya.Handler.create(this, (mesh) => {
                // 模型
                let player: Laya.MeshSprite3D = cameraBox.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
                this.playerCompo = player.addComponent(Player);
                // 材质设置
                Laya.loader.create(Const.URL_PlayerMaterialCat, Laya.Handler.create(this, (res) => {
                    let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
                    material.albedoTexture = res;
                    material.specularColor = new Laya.Vector4(0, 0, 0, 0);
                    player.meshRenderer.material = material;
                }));
                // 设置尺寸
                player.transform.localScale = new Laya.Vector3(1.5, 1.5, 1.5);
                
                // 初始化跳板
                let boardBox: Laya.MeshSprite3D = this.scene3D.addChild(new Laya.MeshSprite3D()) as Laya.MeshSprite3D;
                this.boardBoxCompo = boardBox.addComponent(BoardBox);
            }));
        }
        else {
            let player: Laya.MeshSprite3D = cameraBox.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(Const.PlayerRadius))) as Laya.MeshSprite3D;
            this.playerCompo = player.addComponent(Player);
            // 材质设置
            let url_material: string;
            if (Global.config.online && !Global.config.skin_block) {
                url_material = Const.URL_PlayerTexture1;
            }
            else {
                url_material = Const.URL_PlayerTexture2;
            }
            Laya.loader.create(url_material, Laya.Handler.create(this, (res) => {
                let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
                material.albedoTexture = res;
                material.specularColor = new Laya.Vector4(0, 0, 0, 0);
                player.meshRenderer.material = material;
            }));
    
            // 初始化跳板
            let boardBox: Laya.MeshSprite3D = this.scene3D.addChild(new Laya.MeshSprite3D()) as Laya.MeshSprite3D;
            this.boardBoxCompo = boardBox.addComponent(BoardBox);
        }

        // 初始化顶部分数尺寸
        this.scoreLabel.scale(0.8, 0.8);
    }

    /**重置游戏 */
    resetGame() {
        // 播放背景音乐
        if (this.sound) {
            this.sound.play();
        }
        // 切换天空背景
        this.skyCount++;
        let idx: number = this.skyCount % this.skyNum;
        this.background.loadImage(Const.URL_Background[idx]);
        this.bg_bottom.loadImage(Const.URL_BG_Bottom[idx]);
        this.front_top.loadImage(Const.URL_Front_Top[idx]);
        this.front_bottom.loadImage(Const.URL_Front_bottom[idx]);
        // 重置背景X坐标
        this.front_top.x = -270;
        this.front_bottom.x = -270;
        this.bg_bottom.x = -270;
        
        this.state = Const.GameState.READY;
        this.score = 0;
        this.scoreLabel.visible = false;
        this.cameraBoxCompo.reset();
        this.boardBoxCompo.reset();
        this.playerCompo.reset();
    }

    /**游戏开始 */
    gameStart() {
        // 播放背景音乐
        if (this.sound) {
            this.sound.play();
        }
        // // 播放背景音乐
        // Laya.timer.once(380, this, () => {
        //     //Laya.SoundManager.playbackRate = 1.14;
        //     Laya.SoundManager.playMusic(Const.URL_BGM, 0);
        // })

        this.state = Const.GameState.PLAYING;
        this.hideTutorial();
        ws.traceEvent('Start_Move');
        if (this.reviveCount === 0) {
            this.startTimestamp = Date.now();
        }
    }

    /**玩家死亡 */
    gameDie() {
        // 暂停播放背景音乐
        if (this.sound) {
            this.sound.pause();
        }
        // Laya.SoundManager.stopMusic();

        this.state = Const.GameState.PAUSE;
        this.playerCompo.hide();
        Laya.timer.once(500, this, () => {
            if (Global.config.allow_revive && this.reviveCount < 2) {
                ReviveView.openInstance();
            } else {
                this.gameOver();
            }
        });
    }

    /**游戏结束 */
    gameOver() {
        // 停止播放背景音乐
        if (this.sound) {
            this.sound.stop();
        }
        // Laya.SoundManager.destroySound(Const.URL_BGM);

        this.state = Const.GameState.OVER;
        this.scoreLabel.visible = false;
        let score = this.score;
        if (Laya.Browser.onMiniGame) {
            ws.postGameScore({
                id: Date.now() + "",
                score: score,
                time: Date.now() - this.startTimestamp,
            });
        }
        OverView.openInstance({ score }); // to add
        
        //this.resetGame(); // to delete
        //GameScene.openInstance(); // to delete
    }

    /**玩家复活 */
    gameRevive() {
        ws.traceEvent('Revive');
        this.reviveCount++;
        this.state = Const.GameState.READY;
        this.scoreLabel.visible = false;
        this.playerCompo.revive();
        this.showTutorial();
    }
    
    get score(): number {
        return this._score;
    }

    set score(v) {
        this._score = v;
        this.scoreLabel.changeText(v + '');
    }

    /**加分 */
    addScore(score: number) {
        this.score = this.score + score;
        // 每10分颤动一下
        if (this.score >= this.scoreStep) {
            Laya.Tween.to(this.scoreLabel, {scaleX: 1.5, scaleY: 1.5}, 100, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.scoreLabel, {scaleX: 1, scaleY: 1}, 100, Laya.Ease.linearInOut);
            }));
            this.scoreStep += 10;
        }
    }

    /**显示教程 */
    private showTutorial() {
        Ad.posShowBanner(Const.BannerPos.GameScene, true);
        this.tutorialBox.visible = true;
        this.scoreLabel.visible = true;
    }

    /**隐藏教程 */
    private hideTutorial() {
        Ad.posHideBanner(Const.BannerPos.GameScene);
        this.tutorialBox.visible = false;
    }

}