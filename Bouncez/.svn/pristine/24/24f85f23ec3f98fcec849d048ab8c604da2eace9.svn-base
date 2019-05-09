import * as Const from "../Const";
import GameScene from "../runtime/GameScene";
import * as Util from "../util/Util";
import HomeView from "../runtime/HomeView";

export default class Board extends Laya.Script {
    /**跳板模型 */
    public board: Laya.MeshSprite3D;
    /**跳板类型 */
    private type: number;
    /**是否曾被碰撞激活 */
    public isActive: boolean = false;

    /**中心区圆片模型 */
    private center: Laya.MeshSprite3D;
    /**冲击波模型 */
    private wave: Laya.MeshSprite3D;
    /**内圈冲击波模型 */
    private waveInner: Laya.MeshSprite3D;
    /**弹簧螺旋模型 */
    private springHelix: Laya.MeshSprite3D;
    /**弹簧顶盖模型 */
    private springTop: Laya.MeshSprite3D;
    /**得分钻石模型 */
    private diamondList: Laya.MeshSprite3D[] = [];

    /**下沉特效帧坐标 */
    private currBumpFrame: number;
    /**冲击特效帧坐标 */
    private currWaveFrame: number;
    /**弹簧特效帧坐标 */
    private currSpringFrame: number;
    /**掉落特效帧坐标 */
    private currDropFrame: number;
    /**是否开启左右移动 */
    private isMoving: boolean = false;
    /**是否处于向右移动 */
    private isMovingRight: boolean = true;
    /**是否存在显示中的钻石 */
    public hasDiamond: boolean = false;

    /**掉落前位置：用于复活重置 */
    public posBeforeDrop: Laya.Vector3;

    constructor() {
        super();
        this.type = Const.BoardType.NORMAL;
        this.currBumpFrame = Const.BoardBumpFrames;
        this.currDropFrame = Const.BoardDropFrames;
    }

    onAwake() {
        // 初始化跳板
        this.board = this.owner as Laya.MeshSprite3D;
        // 初始化中心区
        this.initCenter();
        // 初始化冲击波
        this.initWave();
        // 初始化弹簧
        this.initSpring();
        // 初始化钻石
        this.initDiamond();
    }

    /**初始化中心区 */
    private initCenter() {
        this.center = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(Const.BoardRadiusCenter, 0.005));
        this.board.parent.addChild(this.center);
        this.center.active = false;

        let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        material.specularColor = new Laya.Vector4(0, 0, 0, 0);
        material.albedoColor = new Laya.Vector4(1, 1, 1, 0.8);
        material.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
        this.center.meshRenderer.material = material;
    }

    /**初始化冲击波 */
    private initWave() {
        this.wave = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(Const.WaveRadius, Const.WaveHeight));
        this.board.parent.addChild(this.wave);
        this.wave.active = false;
        // 设置内圈
        this.waveInner = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(Const.WaveRadius, Const.WaveHeight));
        this.board.parent.addChild(this.waveInner);
        this.waveInner.active = false;
        // 初始化帧数
        this.currWaveFrame = Const.BoardWaveFrames;
        // 加载材质
        Laya.loader.create(Const.URL_WaveTexture, Laya.Handler.create(this, this.setWaveMat));
    }

    /**设置冲击波材质 */
    private setWaveMat(res: Laya.Texture2D) {
        let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        material.albedoTexture = res;
        material.albedoColor = new Laya.Vector4(1, 1, 1, 1);
        material.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
        this.wave.meshRenderer.material = material;
        this.waveInner.meshRenderer.material = material.clone();
    }

    /**初始化弹簧 */
    private initSpring() {
        // 设置弹簧螺旋
        Laya.Mesh.load(Const.URL_HelixMesh, Laya.Handler.create(this, (mesh) => {
            this.springHelix = new Laya.MeshSprite3D(mesh);
            // 设置材质
            let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
            material.albedoColor = new Laya.Vector4(1, 1, 1, 0.3);
            material.specularColor = new Laya.Vector4(0, 0, 0, 0);
            material.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
            this.springHelix.meshRenderer.material = material;
            // 设置角度, 尺寸
            this.springHelix.transform.localRotationEuler = new Laya.Vector3(-90, 0, 0);
            this.springHelix.transform.localScale = new Laya.Vector3(1.5, 1.5, 1);
            // 设置位置
            this.setSpringPos();
            this.board.parent.addChild(this.springHelix);
            this.springHelix.active = false;
            this.currSpringFrame = Const.BoardSpringFrames * 2;
        }));

        // 设置弹簧顶盖
        this.springTop = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(Const.SpringRadius, Const.SpringHeight));
        this.board.parent.addChild(this.springTop);
        this.springTop.active = false;
        // 设置位置
        this.springTop.transform.localPosition = this.getPos();
        this.springTop.transform.localPositionY += (Const.BoardHeight + Const.SpringHeight) / 2;
        // 设置材质
        let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
        material.albedoColor = Const.BoardColor[idx];
        material.specularColor = new Laya.Vector4(0, 0, 0, 0);
        this.springTop.meshRenderer.material = material;
    }

    /**初始化钻石 */
    private initDiamond() {
        Laya.Mesh.load(Const.URL_DiamondMesh, Laya.Handler.create(this, (mesh) => {
            let diamond: Laya.MeshSprite3D = new Laya.MeshSprite3D(mesh);
            // 重置尺寸
            diamond.transform.localScale = new Laya.Vector3(1, 1, 2);
            // 设置材质
            let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
            let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
            material.albedoColor = Const.DiamondColor[idx];
            //material.specularColor = new Laya.Vector4(0, 0, 0, 0);
            material.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
            diamond.meshRenderer.material = material;

            for (let i: number = 0; i < 5; i++) {
                this.diamondList[i] = diamond.clone();
                this.board.parent.addChild(this.diamondList[i]);
                // 默认不激活
                this.diamondList[i].active = false;
            }
        }));
    }

    /**重新配置跳板 */
    reset(newType: number, pos: Laya.Vector3, diffLevel: number) {
        // 重置为未碰撞激活
        this.isActive = false;

        // 重置特效状态
        this.currWaveFrame = Const.BoardWaveFrames;
        this.currSpringFrame = Const.BoardSpringFrames * 2;
        this.currBumpFrame = Const.BoardBumpFrames;
        this.currDropFrame = Const.BoardDropFrames;

        // 更新类型
        this.type = newType;

        // 位置设置
        this.board.transform.localPosition = pos.clone();

        // 移动设置
        this.isMoving = false;
        if (this.type === Const.BoardType.NORMAL || this.type === Const.BoardType.DROP || this.type === Const.BoardType.SPRING) {
            this.isMoving = this.setMove(diffLevel);
        }

        // 按照类型缩放半径
        if (this.type === Const.BoardType.GIANT) {
            this.board.transform.localScaleX = Const.BoardRadiusScaleGiant;
            this.board.transform.localScaleZ = Const.BoardRadiusScaleGiant;
        }
        else if (this.type === Const.BoardType.DWRAF) {
            this.board.transform.localScaleX = Const.BoardRadiusScaleDWRAF;
            this.board.transform.localScaleZ = Const.BoardRadiusScaleDWRAF;
        }
        else {
            this.board.transform.localScaleX = Const.BoardRadiusScale;
            this.board.transform.localScaleZ = Const.BoardRadiusScale;
        }
        // 按照类型缩放高度
        if (this.type === Const.BoardType.DROP) {
            this.board.transform.localScaleY = Const.BoardHeightScaleDROP;
            this.posBeforeDrop = this.getPos();
        }
        else {
            this.board.transform.localScaleY = Const.BoardHeightScale;
        }

        // 中心区布置
        if (this.type != Const.BoardType.GIANT) {
            this.center.active = true;
            this.setCenterPos();
        }
        else {
            this.center.active = false;
        }

        // 设置颜色
        let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
        (this.board.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = Const.BoardColor[idx];

        this.springTop.active = false;
        // 弹簧跳板布置
        if (this.type === Const.BoardType.SPRING) {
            this.springHelix.active = true;
            this.springTop.active = true;
            this.setSpringPos();
            let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
            (this.springTop.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = Const.BoardColor[idx];
        }

        // 跳跃跳板布置
        if (this.type === Const.BoardType.SUPERMAN) {
            this.springHelix.active = true;
            this.springTop.active = true;
            this.setSpringPos();
            (this.board.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(0.536453, 0.4103774, 1, 1);
            (this.springTop.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(0.536453, 0.4103774, 1, 1);
        }

        // 钻石布置
        this.hasDiamond = false;
        if (this.diamondList[0]) {
            // 重置钻石
            for (let i: number = 0; i < 5; i++) {
                this.diamondList[i].active = false;
                // 设置颜色
                let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
                (this.diamondList[i].meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = Const.DiamondColor[idx];
            }
            // 巨型跳板必定布置钻石
            if (this.type === Const.BoardType.GIANT) {
                for (let i: number = 0; i < 5; i++) {
                    this.diamondList[i].active = true;
                    this.hasDiamond = true;
                }
            }
            // 常规和掉落跳板随机布置钻石
            else if (this.type === Const.BoardType.NORMAL || this.type === Const.BoardType.DROP) {
                let rand_diamond: number = Math.random();
                if (rand_diamond > 0.7) {
                    this.diamondList[2].active = true;
                    this.hasDiamond = true;
                }
            }
            // 设置钻石位置
            if (this.hasDiamond) {
                this.setDiamondPos();
            }
        }
    }

    onUpdate() {
        // 撞击特效
        this.effectBump();

        // 冲击波特效
        this.effectWave();

        // 弹簧特效
        if (this.type === Const.BoardType.SPRING || this.type === Const.BoardType.SUPERMAN) {
            this.effectSpring();
        }

        // 掉落特效
        this.effectDrop();

        // 左右移动
        this.effectMove();

        // 钻石转动
        if (this.hasDiamond) {
            this.effectDiamondRotate();
        }
    }

    /**设置撞击特效 */
    setBump() {
        // 重置下沉特效帧坐标
        this.currBumpFrame = 0;
    }

    /**撞击特效播放 */
    private effectBump() {
        if (this.currBumpFrame < Const.BoardBumpFrames) {
            this.board.transform.localPositionY += Const.BoardBumpStep[this.currBumpFrame];
            this.setCenterPos();
            this.currBumpFrame++;
        }
    }

    /**设置中心区位置 */
    setCenterPos() {
        this.center.transform.localPosition = this.getPos();
        this.center.transform.localPositionY += Const.BoardHeight / 2;
    }

    /**设置钻石位置 */
    setDiamondPos() {
        for (let i: number = 0; i < 5; i++) {
            if (this.diamondList[i].active) {
                this.diamondList[i].transform.localPosition = this.getPos();
                this.diamondList[i].transform.localPositionX += (i - 2) * 1.4;
                this.diamondList[i].transform.localPositionY += Const.BoardHeight;
            }
        }
    }

    /**设置冲击波 */
    setWave() {
        if (this.type != Const.BoardType.GIANT) {
            // 重置冲击波特效帧坐标
            this.currWaveFrame = 0;
            // 重置冲击波模型
            this.wave.transform.localPosition = this.getPos();
            this.wave.transform.localPositionY += Const.WaveOffsetY;
            this.wave.transform.localScale = new Laya.Vector3(1, 1, 1);
            this.wave.active = true;
            // 设置缓动渐隐
            (this.wave.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColorA = 0.5;
            Laya.Tween.to(this.wave.meshRenderer.material, { albedoColorR: 1, albedoColorG: 1, albedoColorB: 1, albedoColorA: 0 }, Const.BoardWaveFrames / 60 * 1000, Laya.Ease.linearInOut);

            this.waveInner.transform.localPosition = this.getPos();
            this.waveInner.transform.localPositionY += Const.WaveOffsetY;
            this.waveInner.transform.localScale = new Laya.Vector3(1, 1, 1);
        }
    }

    /**冲击波特效 */
    private effectWave() {
        if (this.currWaveFrame < Const.BoardWaveFrames) {
            if (this.currWaveFrame >= Const.BoardWaveInnerStartFrames) {
                if (!this.waveInner.active) {
                    // 设置缓动渐隐
                    (this.waveInner.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColorA = 0.3;
                    Laya.Tween.to(this.waveInner.meshRenderer.material, { albedoColorR: 1, albedoColorG: 1, albedoColorB: 1, albedoColorA: 0 }, (Const.BoardWaveFrames - Const.BoardWaveInnerStartFrames) / 60 * 1000, Laya.Ease.linearInOut);
                }
                this.waveInner.active = true;
                this.waveInner.transform.localScaleX += Const.BoardWaveInnerStep;
                this.waveInner.transform.localScaleZ += Const.BoardWaveInnerStep;
            }
            this.wave.transform.localScaleX += Const.BoardWaveStep;
            this.wave.transform.localScaleZ += Const.BoardWaveStep;
            this.currWaveFrame++;
        }
        else {
            this.wave.active = false;
            this.waveInner.active = false;
        }
    }

    /**设置弹簧 */
    setSpring() {
        // 重置弹簧特效帧坐标
        this.currSpringFrame = 0;
        // 重置弹簧模型
        this.setSpringPos();
        this.springHelix.transform.localScale = new Laya.Vector3(1.5, 1.5, 1);
        this.springHelix.active = true;
        this.springTop.active = true;
    }

    /**设置弹簧位置 */
    setSpringPos() {
        this.springHelix.transform.localPosition = this.getPos();
        this.springHelix.transform.localPositionY += Const.BoardHeight / 2;
        this.springTop.transform.localPosition = this.getPos();
        this.springTop.transform.localPositionY += (Const.BoardHeight + Const.SpringHeight) / 2;
    }

    /**弹簧特效 */
    private effectSpring() {
        let stepHelix: number = (this.type === Const.BoardType.SUPERMAN) ? Const.SpringHelixStepSprint : Const.SpringHelixStep;
        let stepTop: number = (this.type === Const.BoardType.SUPERMAN) ? Const.SpringTopStepSprint : Const.SpringTopStep;
        if (this.currSpringFrame < Const.BoardSpringFrames) {
            this.springHelix.transform.localScaleZ += stepHelix;
            this.springTop.transform.localPositionY += stepTop;
            this.currSpringFrame++;
        }
        else if (this.currSpringFrame >= Const.BoardSpringFrames && this.currSpringFrame < (Const.BoardSpringFrames * 2)) {
            this.springHelix.transform.localScaleZ -= stepHelix;
            this.springTop.transform.localPositionY -= stepTop;
            this.currSpringFrame++;
        }
        else {
            this.springHelix.active = false;
        }
    }

    /**设置掉落特效 */
    setDrop() {
        // 重置掉落特效帧坐标
        this.currDropFrame = 0;
        // 记录跳板掉落前位置，用于复活
        this.posBeforeDrop = this.getPos();
    }

    /**掉落特效播放 */
    private effectDrop() {
        if (this.currDropFrame < Const.BoardDropFrames) {
            for (let i: number = 0; i < 5; i++) {
                this.diamondList[i].active = false;
            }
            if (this.springTop.active) {
                this.springHelix.active = false;
                this.springTop.transform.localPositionY -= Const.BoardDropStep;
            }
            this.board.transform.localPositionY -= Const.BoardDropStep;
            this.setCenterPos();
            this.currDropFrame++;
        }
    }

    /**随机设置左右移动 */
    private setMove(diffLevel: number): boolean {
        // 难度曲线输出区间[1,10]
        let diffCoeff: number = Util.getDiffCoeff(diffLevel, 1, 10);
        let rand_moving: number = Math.random() * diffCoeff;
        return (rand_moving > 5 ? true : false);
    }

    /**左右移动 */
    private effectMove() {
        if (this.isMoving) {
            let posX: number = this.board.transform.localPositionX;
            // 向右移动
            if (this.isMovingRight && posX <= Const.SceneMaxOffsetX) {
                this.board.transform.localPositionX += Const.BoardMovingStep;
            }
            else if (this.isMovingRight && posX > Const.SceneMaxOffsetX) {
                // 转向
                this.isMovingRight = false;
            }
            // 向左移动
            else if (!this.isMovingRight && posX >= -Const.SceneMaxOffsetX) {
                this.board.transform.localPositionX -= Const.BoardMovingStep;
            }
            else if (!this.isMovingRight && posX < -Const.SceneMaxOffsetX) {
                // 转向
                this.isMovingRight = true;
            }
            // 弹簧跟随跳板
            if (this.type === Const.BoardType.SPRING) {
                this.springHelix.transform.localPositionX = this.getPos().x;
                this.springTop.transform.localPositionX = this.getPos().x;
            }
            // 跳板上组件跟随移动
            this.setCenterPos();
            if (this.hasDiamond) {
                this.setDiamondPos();
            }
        }
    }

    /**钻石转动效果 */
    private effectDiamondRotate() {
        for (let i: number = 0; i < 5; i++) {
            this.diamondList[i].transform.localRotationEulerY += Const.DiamondRotateStepY;
        }
    }

    /**隐藏钻石 */
    hideDiamond(idx_diamond: number) {
        this.diamondList[idx_diamond].active = false;
        // 粒子
        let particle: Laya.ShuriKenParticle3D = GameScene.instance.playerCompo.diamondParticle;
        // 设置位置
        particle.transform.localPosition = this.diamondList[idx_diamond].transform.localPosition.clone();
        // 发射粒子
        particle.particleSystem.play();
    }

    /**钻石玩家拾取判断 */
    checkDiamond(posX: number) {
        if (this.hasDiamond) {
            let flag: boolean = true;
            for (let idx_diamond: number = 0; idx_diamond < 5; idx_diamond++) {
                if (this.diamondList[idx_diamond].active) {
                    flag = false;
                    if (Math.abs(posX - this.diamondList[idx_diamond].transform.localPositionX) <= Const.DiamondScoreArea) {
                        // 隐藏钻石
                        this.hideDiamond(idx_diamond);
                        // 加分
                        // GameScene.instance.addScore(Const.DiamondScore);
                        // GameScene.instance.playerCompo.showScore(Const.DiamondScore);
                        GameScene.instance.addDiamond(1);
                        // GameScene.instance.playerCompo.showScoreDiamond(1);
                        // 钻石击碎特效 todo <=================
                    }
                }
            }
            if (flag) {
                this.hasDiamond = false;
            }
        }
    }

    /**获取跳板位置 */
    getPos(): Laya.Vector3 {
        return this.board.transform.localPosition.clone();
    }

    /**获取跳板类型 */
    getType(): number {
        return this.type;
    }

    /**获取跳板高度 */
    getHeight(): number {
        if (this.type === Const.BoardType.DROP) {
            return Const.BoardHeight * Const.BoardHeightScaleDROP;
        }
        else {
            return Const.BoardHeight * Const.BoardHeightScale;
        }
    }

    /**获取跳板半径 */
    getRadius(): number {
        if (this.type === Const.BoardType.GIANT) {
            return Const.BoardRadius * Const.BoardRadiusScaleGiant;
        }
        else {
            return Const.BoardRadius * Const.BoardRadiusScale;
        }
    }

    /**复活 */
    revive() {
        // 设置未激活
        this.isActive = false;
        // 停止移动
        this.isMoving = false;
        // 重置掉落跳板
        if (this.type === Const.BoardType.DROP) {
            this.currDropFrame = Const.BoardDropFrames;
            this.board.transform.localPosition = this.posBeforeDrop.clone();
        }
    }
}