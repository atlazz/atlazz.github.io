import * as Const from "../Const";
import GameScene from "../runtime/GameScene";
import BoardBox from "../component/BoardBox";
import Board from "../component/Board";
import * as Util from "../util/Util";
import HomeView from "../runtime/HomeView";

export default class Player extends Laya.Script {
    /**玩家 */
    private player: Laya.Sprite3D;
    /**玩家模型 */
    private playerMesh: Laya.MeshSprite3D;
    /**玩家模型类型 */
    private playerMeshType: number;
    /**玩家拖尾 */
    private playerTrail: Laya.TrailSprite3D;
    // /** 钻石碎片组 */
    // public diamondPieceList: Laya.MeshSprite3D[] = [];
    /** 钻石粒子 */
    private diamondParticleList: Laya.ShuriKenParticle3D[] = [];
    /** 当前粒子 */
    public diamondParticle: Laya.ShuriKenParticle3D;
    /** 冲刺钻石粒子 */
    private diamondParticleSprintList: Laya.ShuriKenParticle3D[] = [];
    /** 当前冲刺粒子 */
    public diamondParticleSprint: Laya.ShuriKenParticle3D;

    /** 分数模型组 */
    private scoreMeshList: Laya.MeshSprite3D[] = [];
    /** 分数模型池 */
    private scoreMeshPool = {
        1: new Array<Laya.MeshSprite3D>(),
        2: new Array<Laya.MeshSprite3D>(),
        3: new Array<Laya.MeshSprite3D>(),
        4: new Array<Laya.MeshSprite3D>(),
        5: new Array<Laya.MeshSprite3D>(),
    };

    /**当前跳板 */
    public currBoard: Board;
    /**当前跳板 */
    public currBoardIdx: number = 0;

    /**玩家跳跃状态 */
    private jumpState: number;
    /**玩家是否弹簧跳跃 */
    private isJumpSpring: boolean = false;
    /**玩家跳跃周期坐标 */
    private currJumpFrame: number = 0;

    /**新建跳板类型 */
    private boardNewType: number = Const.BoardType.NORMAL;
    /**跳板联动计数 */
    private boardGroupCount: number = 0;

    /**手指是否按下 */
    private isTouch: boolean = false;
    /**手指X位置 */
    private touchPosX: number;
    /**难度等级 */
    private diffLevel: number = 1;
    /**避免两个冲刺跳板在同一数组内 */
    private hasSprint: boolean = false;

    /**是否触发钻石掉落 */
    private isPieceDrop: boolean = false;

    /**前一跳板类型 */
    private preType: number = Const.BoardType.NORMAL;

    constructor() {
        super();
        console.log("Player constructor()");
    }

    onAwake() {
        console.log("Player onAwake()");
        this.player = this.owner as Laya.Sprite3D;
        this.init();
    }

    /**注册监听 */
    private registerListener() {
        GameScene.instance.on(Laya.Event.MOUSE_DOWN, this, this.onTouchDown);
        GameScene.instance.on(Laya.Event.MOUSE_UP, this, this.onTouchUp);
    }

    /**手指按下 */
    onTouchDown() {
        this.isTouch = true;
        this.touchPosX = Laya.stage.mouseX;
    }

    /**手指离开 */
    onTouchUp() {
        this.isTouch = false;
    }

    /**初始化 */
    private init() {
        // 注册监听
        this.registerListener();

        // 初始化拖尾
        this.initTrail();

        // 初始化玩家模型
        this.playerMeshType = Const.PlayerMeshType.CAT;
        this.loadPlayerMesh();

        // 初始化玩家配置
        this.reset();

        // 初始化粒子
        this.initDiamondParticle();

        // 初始化分数
        this.initScore();
    }

    /**初始化拖尾 */
    private initTrail() {
        Laya.TrailSprite3D.load(Const.URL_Trail, Laya.Handler.create(this, (res) => {
            this.playerTrail = res as Laya.TrailSprite3D;
            // 设置拖尾颜色
            this.playerTrail.trailFilter.colorGradient.updateColorRGB(0, 0, Const.TrailColor[this.playerMeshType]);
            this.playerTrail.trailFilter.colorGradient.updateColorRGB(1, 1, Const.TrailColor[this.playerMeshType]);
            // 位置与玩家绑定
            this.player.addChild(this.playerTrail);
        }));
    }

    /** 初始化钻石碎片粒子 */
    private initDiamondParticle() {
        for (let i: number = 0; i < GameScene.instance.skyNum; i++) {
            Laya.Sprite3D.load(Const.URL_Particle[i], Laya.Handler.create(this, (res) => {
                this.diamondParticleList[i] = res;
                this.player.parent.addChild(this.diamondParticleList[i]);
                this.diamondParticle = this.diamondParticleList[0];
            }));
            Laya.Sprite3D.load(Const.URL_ParticleSprint[i], Laya.Handler.create(this, (res) => {
                this.diamondParticleSprintList[i] = res;
                this.player.parent.addChild(this.diamondParticleSprintList[i]);
                this.diamondParticleSprint = this.diamondParticleSprintList[0];
            }));
        }
    }

    /**加载玩家模型 */
    private loadPlayerMesh() {
        // 加载
        Laya.Mesh.load(Const.URL_PlayerModel[this.playerMeshType], Laya.Handler.create(this, (mesh) => {
            // 模型
            this.playerMesh = this.owner.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            // 材质设置
            Laya.loader.create(Const.URL_PlayerMaterial[this.playerMeshType], Laya.Handler.create(this, (mat) => {
                let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
                material.albedoTexture = mat;
                material.specularColor = new Laya.Vector4(0, 0, 0, 0);
                this.playerMesh.meshRenderer.material = material;
            }));
            // 设置尺寸
            this.playerMesh.transform.localScale = new Laya.Vector3(1.5, 1.5, 1.5);
        }));
    }

    /**改变玩家模型 */
    changePlayer(newPlayerMeshType: number) {
        // 改变玩家模型
        if (this.playerMeshType !== newPlayerMeshType) {
            // 一样的模型不重新加载
            if (Const.URL_PlayerModel[this.playerMeshType] === Const.URL_PlayerModel[newPlayerMeshType]) {
                this.playerMeshType = newPlayerMeshType;
                // 改变材质
                Laya.loader.create(Const.URL_PlayerMaterial[this.playerMeshType], Laya.Handler.create(this, (mat) => {
                    (this.playerMesh.meshRenderer.material as Laya.BlinnPhongMaterial).albedoTexture = mat;
                }));
            }
            // 重新加载模型
            else {
                this.playerMeshType = newPlayerMeshType;
                // 销毁
                this.playerMesh.destroy(true);
                // 加载模型: 球体用Laya原生创建
                if (Const.URL_PlayerModel[this.playerMeshType] === "ball") {
                    // 模型
                    this.playerMesh = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(Const.PlayerRadius));
                    this.owner.addChild(this.playerMesh);
                    // 材质设置
                    Laya.loader.create(Const.URL_PlayerMaterial[this.playerMeshType], Laya.Handler.create(this, (mat) => {
                        let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
                        material.albedoTexture = mat;
                        material.specularColor = new Laya.Vector4(0, 0, 0, 0);
                        this.playerMesh.meshRenderer.material = material;
                    }));
                }
                // 其余特殊模型, 加载读取
                else {
                    this.loadPlayerMesh();
                }
            }
            // 设置拖尾颜色
            this.playerTrail.trailFilter.colorGradient.updateColorRGB(0, 0, Const.TrailColor[this.playerMeshType]);
            this.playerTrail.trailFilter.colorGradient.updateColorRGB(1, 1, Const.TrailColor[this.playerMeshType]);
        }
    }

    reset() {
        // 重置玩家位置
        let initPos: Laya.Vector3 = Const.BoardInitPos.clone();
        initPos.y += Const.PlayerRadius + Const.BoardHeight / 2 - 0.001;
        this.player.transform.localPosition = initPos;
        this.player.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
        // 激活玩家
        this.show();

        // 重置难度
        this.diffLevel = 1;
        // 重置跳跃周期
        this.currJumpFrame = 0;
        // 重置跳跃类型
        this.jumpState = Const.PlayerJumpState.FALLDOWN;
        this.hasSprint = false;
        // 重置当前跳板索引
        this.currBoardIdx = 0;

        // 切换粒子
        if (this.diamondParticleList[0]) {
            let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
            this.diamondParticle = this.diamondParticleList[idx];
            this.diamondParticleSprint = this.diamondParticleSprintList[idx];
            this.diamondParticle.active = true;
            this.diamondParticleSprint.active = true;
            this.diamondParticle.particleSystem.stop();
            this.diamondParticleSprint.particleSystem.stop();
        }
    }

    /** 玩家复活 */
    revive() {
        // 重置死亡前最后跳板
        this.currBoardIdx--;
        if (this.currBoard.getType() === Const.BoardType.SUPERMAN) {
            this.currBoardIdx++;
            this.currBoard = GameScene.instance.boardBoxCompo.getBoardList()[this.currBoardIdx];
        }
        this.currBoard.revive();

        // 重置位置
        let initPos: Laya.Vector3 = this.currBoard.getPos();
        initPos.y += Const.PlayerRadius + this.currBoard.getHeight() / 2 - 0.001;
        this.player.transform.localPosition = initPos;
        this.player.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
        // 重置跳跃周期
        this.currJumpFrame = 0;
        // 激活玩家
        this.show();

        // 摄像机位置重置
        let camPosY = this.currBoard.getPos().y + Const.CameraOffsetY;
        GameScene.instance.cameraBoxCompo.setDesPosX(initPos.x);
        GameScene.instance.cameraBoxCompo.setDesPosY(camPosY);
    }

    getPlayer(): Laya.Sprite3D {
        return this.player;
    }

    show() {
        this.player.active = true;
    }

    hide() {
        this.player.active = false;
    }


    onUpdate() {
        // 正在游戏中
        if (GameScene.instance.state === Const.GameState.PLAYING) {

            let boardBoxCompo: BoardBox = GameScene.instance.boardBoxCompo;
            let boardList: Board[] = boardBoxCompo.getBoardList();

            // 是否冲刺类型
            if (this.jumpState === Const.PlayerJumpState.SPRINT) {
                // 是否冲刺结束
                if (this.currJumpFrame > Const.PlayerJumpFramesSprint) {
                    // 重置
                    this.jumpState = Const.PlayerJumpState.JUMPUP;
                    this.isJumpSpring = false;
                    this.currJumpFrame = 0;
                    this.hasSprint = false;
                    // 重置玩家Y角度
                    this.player.transform.localRotationEulerY = -Const.PlayerSprintStepY;
                    // 去激活钻石
                    boardBoxCompo.clearDiamond();
                }
                this.currJumpFrame++;

                // 冲刺钻石得分判定
                let diamondList: Laya.MeshSprite3D[] = boardBoxCompo.getDiamondSprintList();
                for (let i: number = 0; i < Const.DiamondNum; i++) {
                    if (Math.abs(this.player.transform.localPositionY - diamondList[i].transform.localPositionY) <= Const.DiamondSprintScoreArea) {
                        if (Math.abs(this.player.transform.localPositionX - diamondList[i].transform.localPositionX) <= Const.DiamondSprintScoreArea) {
                            // GameScene.instance.addScore(Const.DiamondScore);
                            // this.showScore(Const.DiamondScore);
                            GameScene.instance.addDiamond(1);
                            // this.showScoreDiamond(1);
                            diamondList[i].active = false;
                            // 发射粒子
                            this.diamondParticleSprint.particleSystem.play();
                        }
                    }
                }

                // 更新玩家Y位置
                this.setPosY();
                // 更新玩家X位置：跟随横向触摸幅度
                this.setPosX();
                // 更新玩家Y角度：自转
                this.setRotY();
                // 更新鼠标位置
                this.touchPosX = Laya.stage.mouseX;
                // 更新钻石粒子位置：绑定玩家
                this.diamondParticleSprint.transform.localPosition = this.player.transform.localPosition.clone();

                // 更新镜头Y位置：冲刺过程中与玩家Y位置绑定
                let camPosY = this.player.transform.localPositionY + Const.CameraOffsetYSprint;
                GameScene.instance.cameraBoxCompo.setDesPosY(camPosY);
                // let camera: Laya.Camera = GameScene.instance.cameraBoxCompo.camera;
                // camera.transform.localPositionY = this.player.transform.localPositionY + Const.CameraOffsetYSprint;
            }

            else {
                /** 1.跳板碰撞判断 */
                // 仅当前跳板以及其前后跳板，自上而下
                for (let idx_board: number = this.currBoardIdx + 1; idx_board >= 0; idx_board--) {

                    // 处于钻石判定范围内
                    let playerPos: Laya.Vector3 = this.player.transform.localPosition.clone();
                    let boardPos: Laya.Vector3 = boardList[idx_board].getPos();
                    if (Math.abs(playerPos.x - boardPos.x) <= boardList[idx_board].getRadius()) {
                        if (Math.abs(playerPos.y - (boardPos.y + Const.BoardHeight)) <= Const.DiamondScoreArea) {
                            // 跳板上钻石得分判断
                            boardList[idx_board].checkDiamond(this.player.transform.localPositionX);
                        }
                    }

                    // 玩家是否处于下落周期
                    if (this.jumpState === Const.PlayerJumpState.FALLDOWN) {

                        // 玩家死亡判断: 根据下落时间判断是否移出镜头
                        if (this.currJumpFrame > Const.PlayerMaxDownFrames || (this.currBoard.getPos().y - this.player.transform.localPositionY) > (Const.BoardGap + Const.BoardHeight)) {
                            this.diamondParticle.active = false;
                            this.diamondParticleSprint.active = false;
                            GameScene.instance.gameDie();
                            return;
                        }

                        // 处于跳板碰撞判定范围内
                        if (this.isOnBoard(boardList[idx_board])) {
                            // 存储当前跳板
                            this.currBoard = boardList[idx_board];
                            this.currBoardIdx = idx_board;
                            // 激活跳板
                            this.activeCurrBoard();
                            // 结束判断
                            break;
                        }
                    }
                }

                /** 2.钻石碰撞判断：遍历钻石列表 */

                /** 3.玩家状态更新：位置、角度、形变、跳跃周期 */
                // 更新跳跃周期
                this.currJumpFrame++;
                if (this.jumpState === Const.PlayerJumpState.JUMPUP) {
                    if (this.isJumpSpring && this.currJumpFrame >= Const.PlayerJumpFramesSpring) {
                        this.jumpState = Const.PlayerJumpState.FALLDOWN;
                        this.currJumpFrame = 0;
                    }
                    else if (!this.isJumpSpring && this.currJumpFrame >= Const.PlayerJumpFrames) {
                        this.jumpState = Const.PlayerJumpState.FALLDOWN;
                        this.currJumpFrame = 0;
                    }
                }
                // 更新Y位置：跟随跳跃周期坐标
                this.setPosY();
                // 更新X位置：跟随横向触摸幅度
                this.setPosX();
                // 更新Z角度：跟随横向触摸幅度
                this.setRotZ();
                // 更新鼠标位置
                this.touchPosX = Laya.stage.mouseX;
                // 更新形变：根据跳跃周期坐标 todo <=================


                /** 4.镜头X位置更新：与玩家X位置绑定 */
                if (this.currBoard.getType() !== Const.BoardType.SUPERMAN) {
                    let camPosX = this.player.transform.localPositionX;
                    GameScene.instance.cameraBoxCompo.setDesPosX(camPosX);
                }

                /** 5.触摸位置更新 */
                if (this.isTouch) {
                    this.touchPosX = Laya.stage.mouseX;
                }
            }
        }
    }

    /** 跳板碰撞判断 */
    private isOnBoard(board: Board): boolean {
        let playerPos: Laya.Vector3 = this.player.transform.localPosition.clone();
        let boardPos: Laya.Vector3 = board.getPos();

        let x: number = Math.abs(playerPos.x - boardPos.x);
        let y: number = playerPos.y - boardPos.y;
        // X方向判断
        if (x <= board.getRadius()) {
            // Y方向判断
            if (y >= 0 && y <= (Const.PlayerRadius + board.getHeight() / 2)) {
                return true;
            }
            // 弹簧跳跃, 低于当前跳板
            else if (this.isJumpSpring && this.currJumpFrame >= Const.PlayerJumpFramesSpring) {
                if (Math.abs(y) < Const.PlayerJumpStepSpring[0]) {
                    return true;
                }
            }
            // 常规跳跃, 低于当前跳板
            else if (!this.isJumpSpring && this.currJumpFrame >= Const.PlayerJumpFrames) {
                if (Math.abs(y) < Const.PlayerJumpStep[0]) {
                    return true;
                }
            }
        }
        return false;
    }


    /** 激活跳板 */
    private activeCurrBoard() {
        // 获取玩家位置
        let playerPos: Laya.Vector3 = this.player.transform.localPosition.clone();
        // 获取当前跳板位置
        let boardPos: Laya.Vector3 = this.currBoard.getPos();
        // 获取当前跳板种类
        let boardType: number = this.currBoard.getType();

        // 重置玩家Y位置
        this.player.transform.localPositionY = boardPos.y + Const.PlayerRadius + this.currBoard.getHeight() / 2 - 0.01;
        // 重置玩家跳跃周期
        this.currJumpFrame = 0;
        // 重置玩家跳跃状态
        if (boardType === Const.BoardType.SUPERMAN) {
            // 冲刺上升
            this.jumpState = Const.PlayerJumpState.SPRINT;

            // 摆正玩家角度
            this.player.transform.localRotationEulerZ = 0;
            // 更新镜头X位置，与冲刺跳板X位置绑定，此后冲刺过程中X位置不变
            let camPosX = boardPos.x;
            GameScene.instance.cameraBoxCompo.setDesPosX(camPosX);
        }
        else {
            this.jumpState = Const.PlayerJumpState.JUMPUP;
        }

        // 判断玩家是否跳到新跳板
        if (this.currBoard.isActive === false) {
            // 设置当前跳板已碰撞激活
            this.currBoard.isActive = true;

            // 玩家得分判断
            let score: number = Const.ScoreBoardNotCenter;
            if (boardType === Const.BoardType.NORMAL || boardType === Const.BoardType.DROP) {
                if (Math.abs(playerPos.x - boardPos.x) <= Const.BoardRadiusCenter) {
                    score = Const.ScoreBoardCenter;
                    // 跳板中心区撞击特效 todo <=================
                    //currBoard.bumpCenterEffect();
                }
            }
            // 加分
            GameScene.instance.addScore(score);
            this.showScore(score);
            // 根据分数进行难度调整
            this.diffLevel += score / 2;

            // 创建新跳板
            for (let i: number = this.currBoardIdx - Const.BoardNewIndex; i > 0; i--) {
                this.newBoard();
            }
        }

        // 根据种类调整玩家跳跃幅度
        this.isJumpSpring = (boardType === Const.BoardType.SPRING) ? true : false;

        // 跳板撞击特效（下沉抖动、冲击波）
        this.currBoard.setBump();
        this.currBoard.setWave();

        if (boardType === Const.BoardType.SPRING || boardType === Const.BoardType.SUPERMAN) {
            this.currBoard.setSpring();
        }

        let boardBoxCompo: BoardBox = GameScene.instance.boardBoxCompo;
        let boardList: Board[] = boardBoxCompo.getBoardList();
        if (boardType === Const.BoardType.DROP) {
            for (let i: number = 0; i < this.currBoardIdx; i++) {
                boardList[i].setDrop();
            }
        }

        // // 更新镜头Y位置：与当前跳板Y位置绑定
        // let camera: Laya.Camera = GameScene.instance.cameraBoxCompo.camera;
        // let camPosY = boardPos.y + Const.CameraOffsetY;
        // if (boardType !== Const.BoardType.SUPERMAN) {
        //     if (this.preType === Const.BoardType.SPRING) {
        //         Laya.Tween.to(camera.transform, {localPositionY: camPosY}, Const.CameraMoveYFramesSpring / 60 * 1000, Laya.Ease.linearInOut);
        //     }
        //     else {
        //         Laya.Tween.to(camera.transform, {localPositionY: camPosY}, Const.CameraMoveYFrames / 60 * 1000, Laya.Ease.linearInOut);
        //     }
        // }

        // 更新镜头Y位置：与当前跳板Y位置绑定
        let camPosY = boardPos.y + Const.CameraOffsetY;
        GameScene.instance.cameraBoxCompo.setDesPosY(camPosY);

        // 记录前一个跳板状态
        GameScene.instance.cameraBoxCompo.preType = boardType;
    }

    /** 创建新跳板 */
    private newBoard() {
        // 跳板联动结束，则重新设置联动类型
        if (this.boardGroupCount <= 0) {
            // 难度曲线输出区间[1,10]
            let diffCoeff: number = Util.getDiffCoeff(this.diffLevel, 1, 10);
            let rand_type: number = Math.random() * diffCoeff;
            /** 常规跳板 */
            if (rand_type <= 4.2) {
                this.boardNewType = Const.BoardType.NORMAL;
                // 开启联动
                this.boardGroupCount = 2;
            }
            /** 巨型跳板 */
            else if (rand_type <= 5.5) {
                this.boardNewType = Const.BoardType.GIANT;
                // 开启联动
                this.boardGroupCount = 3;
            }
            /** 弹簧跳板 */
            else if (rand_type <= 6.2) {
                this.boardNewType = Const.BoardType.SPRING;
                // 开启联动
                if (Math.random() > 0.5) {
                    this.boardGroupCount = 2;
                }
            }
            /** 掉落跳板 */
            else if (rand_type <= 7) {
                this.boardNewType = Const.BoardType.DROP;
                // 开启联动
                this.boardGroupCount = 3;
            }
            /** 冲刺跳板 */
            else if (rand_type <= 7.5) {
                if (this.hasSprint === false) {
                    this.boardNewType = Const.BoardType.SUPERMAN;
                    this.hasSprint = true;
                    // // 一旦冲刺，重置难度
                    // this.diffLevel = 10;
                }
                else {
                    this.boardNewType = Const.BoardType.NORMAL;
                }
            }
            /** 小型跳板 */
            else if (rand_type <= 8) {
                this.boardNewType = Const.BoardType.DWRAF;
                // 开启联动
                if (Math.random() > 0.4) {
                    if (Math.random() > 0.7) {
                        this.boardGroupCount = 3;
                    }
                    else {
                        this.boardGroupCount = 2;
                    }
                }
            }
            else {
                this.boardNewType = Const.BoardType.NORMAL;
            }
        }
        // 更新计数
        this.boardGroupCount--;

        // 设置新跳板位置
        let boardBoxCompo: BoardBox = GameScene.instance.boardBoxCompo;
        boardBoxCompo.newBoard(this.boardNewType, this.diffLevel);
    }

    /** 加载分数模型 */
    private initScore() {
        for (let i = 1; i <= 5; i++) {
            // 创建分数
            Laya.Mesh.load("res/model/" + i + "-Text001.lm", Laya.Handler.create(this, (mesh: Laya.Mesh) => {
                let model = new Laya.MeshSprite3D(mesh);
                let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
                material.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
                material.albedoColor = new Laya.Vector4(1, 1, 1, 1);
                model.meshRenderer.material = material;
                model.transform.rotate(new Laya.Vector3(-10, 0, 0), true, false);
                model.transform.scale = new Laya.Vector3(1, 1, 1);
                model.active = false;
                this.scoreMeshList[i - 1] = model;
            }));
        }
    }

    /** 显示分数 */
    showScore(idx_score: number) {
        let scoreMesh: Laya.MeshSprite3D;
        let pos: Laya.Vector3 = this.player.transform.localPosition.clone();
        // 分数池
        if (!this.scoreMeshPool[idx_score].length) {
            scoreMesh = this.scoreMeshList[idx_score - 1].clone() as Laya.MeshSprite3D;
            this.player.parent.addChild(scoreMesh);
        } else {
            scoreMesh = this.scoreMeshPool[idx_score].pop();
        }
        // 设置坐标
        pos.y += 0.75;
        scoreMesh.transform.position = pos;

        // 动画
        scoreMesh.transform.localScale = new Laya.Vector3(1, 1, 1);
        let SCL: number = 1.5;
        Laya.Tween.to(scoreMesh.transform, { localScaleX: SCL * 1.2, localScaleY: SCL * 1.2, localScaleZ: SCL * 1.2 }, 100, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(scoreMesh.transform, { localScaleX: SCL, localScaleY: SCL, localScaleZ: SCL }, 100, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(scoreMesh.transform, { localScaleX: SCL * 0.9, localScaleY: SCL * 0.9, localScaleZ: SCL * 0.9 }, 200, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    scoreMesh.active = false;
                    scoreMesh.transform.localScale = new Laya.Vector3(1, 1, 1);
                    this.scoreMeshPool[idx_score].push(scoreMesh);
                }));
            }));
        }));
        (scoreMesh.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(1, 1, 1, 0.8);
        Laya.timer.once(150, this, () => {
            Laya.Tween.to(scoreMesh.meshRenderer.material, { albedoColorR: 1, albedoColorG: 1, albedoColorB: 1, albedoColorA: 0, }, 250, Laya.Ease.linearInOut);
        });
        scoreMesh.active = true;
    }

    /** 显示钻石加一 */
    showScoreDiamond(idx_score: number) {
        let scoreMesh: Laya.MeshSprite3D;
        // 分数池
        if (!this.scoreMeshPool[idx_score].length) {
            scoreMesh = this.scoreMeshList[idx_score - 1].clone() as Laya.MeshSprite3D;
            this.player.parent.addChild(scoreMesh);
        } else {
            scoreMesh = this.scoreMeshPool[idx_score].pop();
        }
        // 设置坐标
        let pos: Laya.Vector3 = new Laya.Vector3();
        pos.x = GameScene.instance.diamondBox.x + 0;
        pos.y = GameScene.instance.diamondBox.y - 0;
        scoreMesh.transform.position = pos;

        // 动画
        scoreMesh.transform.localScale = new Laya.Vector3(0.8, 0.8, 0.8);
        Laya.Tween.to(scoreMesh.transform, { localPositionY: pos.y - 30, localScaleX: 0.3, localScaleY: 0.3, localScaleZ: 0.3 }, 400, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
            scoreMesh.active = false;
            scoreMesh.transform.localScale = new Laya.Vector3(1, 1, 1);
            this.scoreMeshPool[idx_score].push(scoreMesh);
        }));
        (scoreMesh.meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(1, 1, 1, 0.8);
        Laya.timer.once(150, this, () => {
            Laya.Tween.to(scoreMesh.meshRenderer.material, { albedoColorR: 1, albedoColorG: 1, albedoColorB: 1, albedoColorA: 0, }, 250, Laya.Ease.linearInOut);
        });
        scoreMesh.active = true;
    }

    /** 设置Y位置：跟随跳跃周期坐标 */
    private setPosY() {
        // 向上跳跃
        if (this.jumpState === Const.PlayerJumpState.JUMPUP) {
            // 弹簧跳跃
            if (this.isJumpSpring) {
                this.player.transform.localPositionY += Const.PlayerJumpStepSpring[Math.floor(this.currJumpFrame / 3)];
            }
            // 常规跳跃
            else {
                this.player.transform.localPositionY += Const.PlayerJumpStep[Math.floor(this.currJumpFrame / 2)];
            }
        }
        // 下落
        else if (this.jumpState === Const.PlayerJumpState.FALLDOWN) {
            // 弹簧跳跃,
            if (this.currBoard.getType() === Const.BoardType.SPRING) {
                // 当前跳板水平线以上, 原速返回
                if (this.currJumpFrame < Const.PlayerJumpFramesSpring) {
                    this.player.transform.localPositionY -= Const.PlayerJumpStepSpring[Math.floor((Const.PlayerJumpFramesSpring - this.currJumpFrame - 1) / 3)];
                }
                // 水平线以下, 保持最高下降速度
                else {
                    this.player.transform.localPositionY -= Const.PlayerJumpStepSpring[0];
                }
            }
            // 常规跳跃, 当前跳板水平线以上, 原速返回
            else if (this.currJumpFrame < Const.PlayerJumpFrames) {
                this.player.transform.localPositionY -= Const.PlayerJumpStep[Math.floor((Const.PlayerJumpFrames - this.currJumpFrame - 1) / 2)];
            }
            // 常规跳跃, 水平线以下, 保持最高下降速度
            else {
                this.player.transform.localPositionY -= Const.PlayerJumpStep[0];
            }
        }
        // 冲刺跳跃
        else if (this.jumpState === Const.PlayerJumpState.SPRINT) {
            this.player.transform.localPositionY += Const.PlayerJumpStepSprint;
            if (this.currJumpFrame >= Const.DiamondStartFrame + 20 && this.currJumpFrame <= Const.PlayerJumpFramesSprint - 50) {
                if (this.currJumpFrame % Math.floor(Const.DiamondSprintStepY / Const.PlayerJumpStepSprint) === 0) {
                    let boardBoxCompo: BoardBox = GameScene.instance.boardBoxCompo;
                    boardBoxCompo.newDiamond();
                }
            }
        }
    }

    /** 设置Y角度：冲刺时玩家自转 */
    private setRotY() {
        this.player.transform.localRotationEulerY += Const.PlayerSprintStepY;
    }

    /** 设置Z角度：跟随横向触摸幅度 */
    private setRotZ() {
        if (this.isTouch && this.touchPosX != Laya.stage.mouseX) {
            let rotZ: number = (Laya.stage.mouseX - this.touchPosX) * Const.CoeffRotPlayer;
            this.player.transform.localRotationEulerZ += rotZ;
        }
    }

    /** 设置X位置：跟随横向触摸幅度 */
    private setPosX() {
        if (this.isTouch && this.touchPosX != Laya.stage.mouseX) {
            // 冲刺跳跃
            if (this.jumpState === Const.PlayerJumpState.SPRINT) {
                let posX: number = (Laya.stage.mouseX - this.touchPosX) * Const.CoeffPosPlayer;
                this.player.transform.localPositionX += posX;

                // 修正玩家X位置，不超出屏幕
                let playerPosX: number = this.player.transform.localPositionX;
                let boundary: number = Const.SceneMaxOffsetX * 1.3;
                if (playerPosX > this.currBoard.getPos().x + boundary) {
                    this.player.transform.localPositionX = this.currBoard.getPos().x + boundary;
                }
                else if (playerPosX < this.currBoard.getPos().x - boundary) {
                    this.player.transform.localPositionX = this.currBoard.getPos().x - boundary;
                }
            }
            // 常规非冲刺跳跃
            else {
                let posX: number = (Laya.stage.mouseX - this.touchPosX) * Const.CoeffPosPlayer;
                this.player.transform.localPositionX += posX;
            }
        }
    }

    // /** 设置钻石碎片位置 */
    // private newDiamondPiece() {
    //     let first = this.diamondPieceList.shift();
    //     first.transform.localPosition = this.player.transform.localPosition.clone();
    //     first.transform.localPositionX += (Math.random() - 0.5);
    //     first.transform.localRotationEuler = new Laya.Vector3(Math.random() * 180, Math.random() * 180, Math.random() * 180);
    //     first.active = true;
    //     this.diamondPieceList.push(first);
    // }

    // /** 设置钻石碎片位置 */
    // private effectDiamondPiece() {
    //     if (this.isPieceDrop) {
    //         for (let i: number = 0; i < Const.DiamondPieceNum; i++) {
    //             this.diamondPieceList[i].transform.localPosition = this.player.transform.localPosition.clone();
    //             if (this.diamondPieceList[i].transform.localPositionX < this.player.transform.localPositionX) {
    //                 this.diamondPieceList[i].transform.localPositionX -= Math.random() * 10;
    //             }
    //             else {
    //                 this.diamondPieceList[i].transform.localPositionX += Math.random() * 10;
    //             }
    //             //this.diamondPieceList[i].transform.localPositionY -= 1 ;
    //             this.diamondPieceList[i].transform.localRotationEulerZ += 5;
    //         }
    //     }
    // }
}