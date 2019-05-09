import Board from "../component/Board";
import * as Const from "../Const";
import GameScene from "../runtime/GameScene";
import * as Util from "../util/Util";

export default class BoardBox extends Laya.Script {
    /** 跳板容器盒 */
    private boardBox: Laya.MeshSprite3D;
    /** 跳板数组 */
    private boardList: Board[] = [];
    /** 钻石数组 */
    public diamondSprintList: Laya.MeshSprite3D[] = [];
    /** 钻石X中轴位置 */
    private diamondCenterX: number;

    constructor() {
        super();
        console.log("BoardBox constructor()");
    }

    onAwake() {
        console.log("BoardBox onAwake()");
        this.boardBox = this.owner as Laya.MeshSprite3D;
    }

    onEnable() {
        console.log("BoardBox onEnable()");
        this.init();
    }

    private init() {
        this.initBoard();
        this.initDiamond();
    }

    /** 初始化钻石组 */
    private initBoard() {
        // Laya.Mesh.load(Const.URL_BoardMesh, Laya.Handler.create(this, (mesh) => {
        //     let boardMesh: Laya.MeshSprite3D = new Laya.MeshSprite3D(mesh);
        //     // 加载材质
        //     Laya.loader.create(Const.URL_BoardMaterial, Laya.Handler.create(this, (res) => {
        //         let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        //         material.albedoTexture = res;
        //         material.specularColor = new Laya.Vector4(0, 0, 0, 0);
        //         boardMesh.meshRenderer.material = material;
        //     }));

        //     let boardCompo: Board;
        //     for (let i = 0; i < Const.BoardNum; i++) {
        //         let board: Laya.MeshSprite3D = boardMesh.clone();
        //         this.boardBox.addChild(board);
        //         boardCompo = board.addComponent(Board);
        //         this.boardList.push(boardCompo);
        //     }
        //     this.reset();
        // }))
        for (let i = 0; i < Const.BoardNum; i++) {
            let boardMesh: Laya.MeshSprite3D = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(Const.BoardRadius, Const.BoardHeight));
            this.boardBox.addChild(boardMesh);
            let boardCompo: Board = boardMesh.addComponent(Board);
            this.boardList.push(boardCompo);
        }
        this.reset();
    }

    /** 初始化钻石组 */
    private initDiamond() {
        // 设置钻石
        let diamond: Laya.MeshSprite3D;
        Laya.Mesh.load(Const.URL_DiamondMesh, Laya.Handler.create(this, (mesh) => {
            diamond = new Laya.MeshSprite3D(mesh);
            // 重置尺寸
            diamond.transform.localScale = new Laya.Vector3(1, 1, 1);
            // 设置材质
            let material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
            let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
            material.albedoColor = Const.DiamondColor[idx];
            //material.specularColor = new Laya.Vector4(0, 0, 0, 0);
            material.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
            diamond.meshRenderer.material = material;

            for (let i: number = 0; i < Const.DiamondNum; i++) {
                this.diamondSprintList[i] = diamond.clone();
                this.boardBox.addChild(this.diamondSprintList[i]);
                this.diamondSprintList[i].active = false;
            }
        }));
    }

    /** 重置跳板 */
    reset() {
        let type = Const.BoardType.NORMAL;
        let pos: Laya.Vector3 = Const.BoardInitPos.clone();
        let diffLevel = 1;

        let boardCompo: Board;
        let preType: number = type;
        for (let i = 0; i < Const.BoardNum; i++) {
            boardCompo = this.boardList[i];

            // 材质设置
            let material = new Laya.BlinnPhongMaterial();
            let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
            material.albedoColor = Const.BoardColor[idx];
            // 不高光
            material.specularColor = new Laya.Vector4(0, 0, 0, 0);
            boardCompo.board.meshRenderer.material = material;

            boardCompo.reset(type, pos, diffLevel);

            // 设置下个跳板位置
            pos = this.getNextPos(boardCompo, diffLevel);
            preType = boardCompo.getType();
        }

        // 激活游戏场景第一个跳板
        boardCompo = this.boardList[0];
        boardCompo.isActive = true;
        GameScene.instance.playerCompo.currBoard = boardCompo;

        // 隐藏第一个跳板钻石
        if (boardCompo.hasDiamond) {
            for (let i: number = 0; i < 5; i++) {
                boardCompo.hideDiamond(i);
            }
        }

        // 重置钻石
        if (this.diamondSprintList[0]) {
            for (let i: number = 0; i < Const.DiamondNum; i++) {
                this.diamondSprintList[i].active = false;
                // 设置材质
                let idx: number = GameScene.instance.skyCount % GameScene.instance.skyNum;
                (this.diamondSprintList[i].meshRenderer.material as Laya.BlinnPhongMaterial).albedoColor = Const.DiamondColor[idx];
            }
        }

        // // 重置钻石碎片粒子
        // if (this.diamondParticle) {
        //     this.diamondParticle.active = false;
        // }
    }

    /** 根据当前跳板参数生成下一跳板位置 */
    getNextPos(currBoard: Board, diffLevel: number): Laya.Vector3 {
        let pos: Laya.Vector3 = currBoard.getPos();
        // 难度曲线输出区间[1,10]
        let diffCoeff: number = Util.getDiffCoeff(diffLevel, 1, 2);
        pos.x = (Math.random() - 0.5) * Const.SceneMaxOffsetX * diffCoeff;
        if (currBoard.getType() === Const.BoardType.SUPERMAN) {
            pos.y += Const.BoardGapSprint;
            // 冲刺跳板下一跳板的X偏移置0
            pos.x = currBoard.getPos().x;
        }
        if (currBoard.getType() === Const.BoardType.SPRING) {
            pos.y += Const.BoardGapSpring;
        }
        else {
            pos.y += Const.BoardGap;
        }
        return pos;
    }

    /** 设置新跳板 */
    newBoard(newType: number, diffLevel: number) {
        // 获取新跳板位置
        let newPos: Laya.Vector3 = this.getNextPos(this.boardList[Const.BoardNum - 1], diffLevel);
        let preType: number = this.boardList[Const.BoardNum - 1].getType();
        // 从跳板列表取出第一个跳板对象
        let first = this.boardList.shift();
        // 当前为冲刺跳板
        if (newType === Const.BoardType.SUPERMAN) {
            // 设置钻石X中轴
            this.diamondCenterX = newPos.x;
            // 布置钻石
            this.setDiamond(newPos);
        }
        // 前一个为冲刺跳板
        if (preType === Const.BoardType.SUPERMAN) {
            // 冲刺跳板后一跳板特殊处理，降低难度
            first.reset(newType, newPos, 0);
        }
        else {
            // 重新配置跳板
            first.reset(newType, newPos, diffLevel);
        }
        // 重新推入楼梯列表
        this.boardList.push(first);
    }

    /** 布置钻石组位置 */
    private setDiamond(pos: Laya.Vector3) {
        let posDiamond: Laya.Vector3 = pos.clone();
        posDiamond.y += Const.PlayerJumpStepSprint * Const.DiamondStartFrame;
        for (let i: number = 0; i < Const.DiamondNum; i++) {
            this.setNextDiamondPos(posDiamond);
            this.diamondSprintList[i].transform.localPosition = posDiamond.clone();
            this.diamondSprintList[i].active = true;
        }
    }

    /** 设置新钻石 */
    newDiamond() {
        // 取出第一个钻石
        let pos: Laya.Vector3 = this.diamondSprintList[Const.DiamondNum - 1].transform.localPosition.clone();
        this.setNextDiamondPos(pos);
        let first = this.diamondSprintList.shift();
        first.transform.localPosition = pos;
        first.active = true;
        // 重新推入钻石列表
        this.diamondSprintList.push(first);
    }

    /** 去激活钻石 */
    clearDiamond() {
        for (let i: number = 0; i < Const.DiamondNum; i++) {
            this.diamondSprintList[i].active = false;
        }
    }

    /** 获取钻石组下一钻石位置 */
    setNextDiamondPos(pos: Laya.Vector3) {
        pos.y += Const.DiamondSprintStepY;
        pos.x += (Math.random() - 0.5) * 1.5;
        // 修正X位置，不超出屏幕
        if (pos.x > this.diamondCenterX + Const.SceneMaxOffsetX) {
            pos.x = this.diamondCenterX + Const.SceneMaxOffsetX;
        }
        else if (pos.x < this.diamondCenterX - Const.SceneMaxOffsetX) {
            pos.x = this.diamondCenterX - Const.SceneMaxOffsetX;
        }
    }

    getBoardBox(): Laya.MeshSprite3D {
        return this.boardBox;
    }

    getBoardList(): Board[] {
        return this.boardList;
    }

    getDiamondSprintList(): Laya.MeshSprite3D[] {
        return this.diamondSprintList;
    }
}