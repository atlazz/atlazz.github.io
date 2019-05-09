import * as Const from "../Const";
import GameScene from "../runtime/GameScene";

export default class CameraBox extends Laya.Script {
    /** 摄像机盒子 */
    private cameraBox: Laya.Sprite3D;
    /** 摄像机模型 */
    public camera: Laya.Camera;
    /** 摄像机Y方向缓动帧坐标 */
    private currMoveFrame: number = 0;
    /** 摄像机目标位置 */
    private destinationPos: Laya.Vector2;
    /** 前一跳板类型 */
    public preType: number = Const.BoardType.NORMAL;

    constructor() {
        super();
        console.log("CameraBox constructor()");
    }

    onAwake() {
        console.log("CameraBox onAwake()");
        this.cameraBox = this.owner as Laya.Sprite3D;
        this.init();
    }

    init() {
        // 添加摄像机
        let camera: Laya.Camera = this.cameraBox.addChild(new Laya.Camera(0, 0.3, 100)) as Laya.Camera;
        camera.transform.localPosition = Const.CameraInitPos.clone();
        camera.transform.localRotationEuler = Const.CameraInitRot.clone();
        // // 天空背景色
        // Laya.TextureCube.load(Const.URL_Background, Laya.Handler.create(this, (res) => {
        //     let skyMat: Laya.SkyBoxMaterial = new Laya.SkyBoxMaterial();
        //     skyMat.textureCube = res;
        //     camera.skyRenderer.material = skyMat;
        // }));
        
        //camera.clearColor = Const.SkyColor.clone();

        //清除标记，使用天空（必须设置，否则无法显示天空）
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        let mat: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        mat.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
        mat.albedoColor = new Laya.Vector4(1, 1, 1, 0);
        camera.skyRenderer.material = mat;

        // 调整fov
        let num = 720 / 1280;
        let num2 = Laya.Browser.width / Laya.Browser.height;
        if (num2 < num) {
            let num3 = 60 * 0.01745329;
            let num4 = 2 * Math.atan(Math.tan(num3 / 2) * num);
            camera.fieldOfView = (2 * Math.atan(Math.tan(num4 / 2) / num2)) * 57.29578;
        }
        this.camera = camera;

        // 初始化缓动目标位置
        this.destinationPos = new Laya.Vector2();
        this.destinationPos.x = this.camera.transform.localPositionX;
        this.destinationPos.y = this.camera.transform.localPositionY;
    }

    /** 重置摄像机 */
    reset() {
        this.camera.transform.localPosition = Const.CameraInitPos.clone();
        this.destinationPos = Const.CameraInitPos.clone();
    }   

    onUpdate() {
        // 缓动到目标X位置
        if (Math.abs(this.camera.transform.localPositionX - this.destinationPos.x) <= Const.CameraMoveXMinErr) {
            this.camera.transform.localPositionX = this.destinationPos.x;
        }
        else {
            let deltaX: number = this.destinationPos.x - this.camera.transform.localPositionX;
            this.camera.transform.localPositionX += deltaX / Const.CameraMoveXFrames;

            // 背景移动
            GameScene.instance.front_top.x += deltaX * 10 / Const.CameraMoveXFrames;
            GameScene.instance.front_bottom.x += deltaX * 20 / Const.CameraMoveXFrames;
            GameScene.instance.bg_bottom.x += deltaX * 10 / Const.CameraMoveXFrames;
        }
        // 缓动到目标Y位置
        if (Math.abs(this.camera.transform.localPositionY - this.destinationPos.y) <= Const.CameraMoveYMinErr) {
            this.camera.transform.localPositionY = this.destinationPos.y;
        }
        else {
            let deltaY: number = this.destinationPos.y - this.camera.transform.localPositionY;
            if (this.preType === Const.BoardType.SPRING) {
                this.camera.transform.localPositionY += deltaY / Const.CameraMoveYFramesSpring;
            }
            else {
                this.camera.transform.localPositionY += deltaY / Const.CameraMoveYFrames;
            }
        }
    }

    /** 设置摄像机X位置 */
    setPosX(posX: number) {
        this.camera.transform.localPositionX = posX;
        // 重置
        this.destinationPos.x = posX;
    }
    
    /** 设置摄像机目标X位置：缓动 */
    setDesPosX(posX: number) {
        this.destinationPos.x = posX;
    }
        
    /** 设置摄像机目标Y位置：缓动 */
    setDesPosY(posY: number) {
        this.destinationPos.y = posY;
    }
}