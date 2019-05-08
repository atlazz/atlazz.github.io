import { ui } from "./../ui/layaMaxUI";
import Maze from "./Maze";

export default class MazeGenerator extends ui.test.TestSceneUI {
    private camera: Laya.Camera;

    private outData: Array<Array<boolean>>;

    // 迷宫
    private maze: Maze;
    // 迷宫矩阵
    private outMaze: Array<Array<boolean>>;
    // 迷宫节点
    private mazeSprite: Array<Array<Laya.Sprite>> = new Array<Array<Laya.Sprite>>();
    // 迷宫单元图片尺寸
    private unitWidth: number = 30;
    // 迷宫参数
    public width: number = 7;
    public height: number = 7;
    private diff: number = 5;
    private maxTryTimes: number = 100000;

    // 玩家模型
    private player: Laya.Sprite;
    // 玩家坐标
    private idx_x: number;
    private idx_y: number;

    // 图片路径
    private url_player: string = "res/player.png";
    private url_empty: string = "res/empty.png";
    private url_wall: string = "res/wall.png";
    private url_passed: string = "res/passed.png";

    // 障碍物资源列表组
    private barriersComboBox: Array<Array<Laya.ComboBox>> = new Array<Array<Laya.ComboBox>>();
    // 障碍物标识列表
    private barriersList: string[] = ["null", "Bush_11", "Sponge", "ElecBox_11", "Mail_11", "Plate_11", "Pod_11", "Pod_21", "Went_11", "Wall_Wo_Hor", "Wall_Wo_Ver", "Brick_Hor_1", "Wall_Wo_Ver", "Brick_Hor_2", "Brick_Ver_1", "Wall_Hor_1", "Wall_Hor_2", "Wall_Hor_3", "Wall_Bot_B_1", "Wall_Bot_W_1", "Wall_Bot_W_2", "Window_11", "Window_12", "Window_21", "Window_22", "Window_23", "Window_C11", "Window_C12", "Window_C21", "Window_C22", "Window_C23", "Window_G11", "Window_G12", "Window_G21", "Window_G22", "Window_G23", "Window_B11", "Window_B12", "Window_B21", "Window_B22", "Window_B23", "Window_W11", "Window_W12", "Window_W21", "Window_W22", "Window_W23", "Door_24", "Door_G24", "Door_B24", "Door_C24", "Door_W24"];
    private barriersNum: number = 48;

    constructor() {
        super();

        // 初始化场景
        this.initScene();

        // 键盘操作监听
        this.keyboardListen();
    }

    // 初始化场景
    private initScene() {
        //添加场景
        let scene: Laya.Scene = Laya.stage.addChild(new Laya.Scene()) as Laya.Scene;
        Laya.stage.bgColor = "#d5d7f4";
        Laya.stage.width = 1000;
        Laya.stage.height = 1000;

        //添加迷宫盒
        this.mazeBox.x = 100;
        this.mazeBox.y = 100;
    }

    // 迷宫生成
    private generateMaze() {
        // 设置迷宫参数
        this.unitWidth = (this.stage.width - this.mazeBox.x * 2) / this.width;
        this.unitWidth = this.unitWidth > 100 ? 100 : this.unitWidth;

        // 生成迷宫矩阵
        this.maze = new Maze(this.width, this.height, this.diff);
        let x: number = Math.floor(Math.random() * this.width);
        let y: number = Math.floor(Math.random() * this.height);
        let tryTimes: number = 0;

        console.log("Maze generating...");
        while (!this.maze.generate(x, y) && tryTimes < this.maxTryTimes) {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
            tryTimes++;
        }
        if (tryTimes >= this.maxTryTimes) {
            console.log("Failed. Try again");
            return;
        }
        console.log("Done. Try times: " + tryTimes);
        this.outMaze = this.maze.getMaze();

        // 渲染迷宫及玩家
        this.renderMaze();
    }

    // 渲染迷宫及玩家
    private renderMaze() {
        this.mazeBox.visible = true;

        let barriersLabel: string = "";
        let flag = false;
        for (let item of this.barriersList) {
            if (flag) { barriersLabel += ","; }
            flag = true;
            barriersLabel += item;
        }

        // 渲染迷宫
        this.mazeSprite = new Array<Array<Laya.Sprite>>();
        this.barriersComboBox = new Array<Array<Laya.ComboBox>>();
        // 初始化迷宫单元
        for (let i: number = 0; i < this.width; i++) {
            this.mazeSprite.push(new Array<Laya.Sprite>());
            this.barriersComboBox.push(new Array<Laya.ComboBox>());
            for (let j: number = 0; j < this.height; j++) {
                let unit: Laya.Sprite = new Laya.Sprite();
                unit.texture = new Laya.Texture();
                this.mazeBox.addChild(unit);
                if (this.outMaze[i][j]) {
                    unit.texture.load(this.url_wall);
                }
                else {
                    unit.texture.load(this.url_empty);
                }
                unit.texture.height = this.unitWidth;
                unit.width = this.unitWidth;
                unit.height = this.unitWidth;
                unit.x = i * this.unitWidth;
                unit.y = j * this.unitWidth;
                this.mazeSprite[i].push(unit);

                // 资源下拉表
                let comboBox: Laya.ComboBox = new Laya.ComboBox("comp/combobox.png", barriersLabel);
                comboBox.width = 120;
                comboBox.height = 25;
                comboBox.x = i * this.unitWidth;
                comboBox.y = j * this.unitWidth;
                // comboBox.zOrder = 1;
                comboBox.visibleNum = 20;
                comboBox.visible = false;
                // 下拉列表内滚动条
                comboBox.scrollBarSkin = "comp/vscroll.png";
                comboBox.scrollBar.scaleX /= 2;

                this.mazeBox.addChild(comboBox);
                this.barriersComboBox[i].push(comboBox);

                // 鼠标监听
                this.mazeSprite[i][j].on(Laya.Event.MOUSE_UP, this, () => {
                    this.posLabel.changeText("坐标: (" + i + "," + j + ")");
                    if (this.outMaze[i][j]) {
                        this.barriersComboBox[i][j].visible = true;
                        // 切换层级
                        let flag_zOrder: number = this.mazeSprite[i][j].zOrder - this.barriersComboBox[i][j].zOrder;
                        this.mazeSprite[i][j].zOrder = 0;
                        this.barriersComboBox[i][j].zOrder = 1;
                        let urlString: string = this.barriersComboBox[i][j].selectedLabel;
                        if (urlString && flag_zOrder < 0) {
                            if (urlString === "null") {
                                this.mazeSprite[i][j].texture.load(this.url_wall);
                                this.mazeSprite[i][j].width = this.unitWidth;
                                this.mazeSprite[i][j].height = this.unitWidth;
                                // 切换层级
                                this.mazeSprite[i][j].zOrder = 1;
                                this.barriersComboBox[i][j].zOrder = 0;
                                return;
                            }

                            let x: number = +urlString[urlString.length - 2];
                            let y: number = +urlString[urlString.length - 1];
                            let cntX: number = 0;
                            let cntY: number = 0;
                            let flag: boolean = true;
                            if (x > 1 || y > 1) {
                                while (cntX < x) {
                                    cntY = 0;
                                    while (cntY < y) {
                                        // invalid
                                        if (i + cntX >= this.width || j + cntY >= this.height || !this.outMaze[i + cntX][j + cntY]) {
                                            this.barriersComboBox[i][j].selectedLabel = null;
                                            this.mazeSprite[i][j].texture.load(this.url_wall);
                                            flag = false;
                                            break;
                                        }
                                        if (!flag) { break; }
                                        cntY++;
                                    }
                                    if (!flag) { break; }
                                    cntX++;
                                }
                            }
                            else {
                                cntX = 1;
                                cntY = 1;
                            }

                            urlString = "res/barriers_texture/" + urlString + ".png";
                            if (flag) {
                                this.mazeSprite[i][j].texture.load(urlString);
                                this.mazeSprite[i][j].width = this.unitWidth * cntX;
                                this.mazeSprite[i][j].height = this.unitWidth * cntY;
                                // 切换层级
                                this.mazeSprite[i][j].zOrder = 1;
                                this.barriersComboBox[i][j].zOrder = 0;
                            }
                        }
                    }
                });
            }
        }

        // 渲染玩家
        this.player = new Laya.Sprite();
        this.player.width = this.unitWidth;
        this.player.height = this.unitWidth;
        this.player.texture = new Laya.Texture();
        this.player.texture.load(this.url_player);
        this.player.x = this.maze.startX * this.unitWidth;
        this.player.y = this.maze.startY * this.unitWidth;
        this.mazeBox.addChild(this.player);

        // 玩家位置记录
        this.idx_x = this.maze.startX;
        this.idx_y = this.maze.startY;

        // 玩家所在位置涂色
        this.mazeSprite[this.idx_x][this.idx_y].texture.load(this.url_passed);
    }

    // 键盘操作监听
    private keyboardListen() {
        // 键盘按下处理
        Laya.stage.on(Laya.Event.KEY_DOWN, this, (e) => {
            // generate maze
            if (e["keyCode"] === 71) {
                if (!this.widthInput.text || !this.heightInput.text || !this.diffInput.text) {
                    return;
                }
                this.maxTryTimes = 1000000;
                if (this.trytimesInput.text) {
                    this.maxTryTimes *= (+this.trytimesInput.text);
                }

                // 重置
                if (this.mazeSprite.length !== 0) {
                    for (let i: number = 0; i < this.width; i++) {
                        for (let j: number = 0; j < this.height; j++) {
                            this.mazeBox.removeChild(this.mazeSprite[i][j]);
                            this.mazeBox.removeChild(this.barriersComboBox[i][j]);
                        }
                    }
                    this.mazeBox.removeChild(this.player);
                }

                this.width = +this.widthInput.text;
                this.height = +this.heightInput.text;
                this.diff = +this.diffInput.text;
                this.generateMaze();
            }
            if (this.outMaze) {
                // left
                if (e["keyCode"] === 37) {
                    while (this.idx_x > 0 && !this.outMaze[this.idx_x - 1][this.idx_y]) {
                        this.idx_x--;
                        // 改变玩家位置
                        this.player.x -= this.unitWidth;
                        // 玩家位置涂色
                        if (this.mazeSprite[this.idx_x][this.idx_y].texture.url != this.url_passed) {
                            this.mazeSprite[this.idx_x][this.idx_y].texture.load(this.url_passed);
                        }
                    }
                }
                // up
                else if (e["keyCode"] === 38) {
                    while (this.idx_y > 0 && !this.outMaze[this.idx_x][this.idx_y - 1]) {
                        this.idx_y--;
                        // 改变玩家位置
                        this.player.y -= this.unitWidth;
                        // 玩家位置涂色
                        if (this.mazeSprite[this.idx_x][this.idx_y].texture.url != this.url_passed) {
                            this.mazeSprite[this.idx_x][this.idx_y].texture.load(this.url_passed);
                        }
                    }
                }
                // right
                else if (e["keyCode"] === 39) {
                    while (this.idx_x < this.width - 1 && !this.outMaze[this.idx_x + 1][this.idx_y]) {
                        this.idx_x++;
                        // 改变玩家位置
                        this.player.x += this.unitWidth;
                        // 玩家位置涂色
                        if (this.mazeSprite[this.idx_x][this.idx_y].texture.url != this.url_passed) {
                            this.mazeSprite[this.idx_x][this.idx_y].texture.load(this.url_passed);
                        }
                    }
                }
                // down
                else if (e["keyCode"] === 40) {
                    while (this.idx_y < this.height - 1 && !this.outMaze[this.idx_x][this.idx_y + 1]) {
                        this.idx_y++;
                        // 改变玩家位置
                        this.player.y += this.unitWidth;
                        // 玩家位置涂色
                        if (this.mazeSprite[this.idx_x][this.idx_y].texture.url != this.url_passed) {
                            this.mazeSprite[this.idx_x][this.idx_y].texture.load(this.url_passed);
                        }
                    }
                }
                // restart
                else if (e["keyCode"] === 82) {
                    // 重置迷宫单元
                    for (let i: number = 0; i < this.width; i++) {
                        for (let j: number = 0; j < this.height; j++) {
                            if (!this.outMaze[i][j]) {
                                if (this.mazeSprite[i][j].texture.url != this.url_empty) {
                                    this.mazeSprite[i][j].texture.load(this.url_empty);
                                }
                            }
                        }
                    }
                    // 重置玩家
                    this.idx_x = this.maze.startX;
                    this.idx_y = this.maze.startY;
                    this.player.x = this.idx_x * this.unitWidth;
                    this.player.y = this.idx_y * this.unitWidth;
                    this.mazeSprite[this.idx_x][this.idx_y].texture.load(this.url_passed);
                }
                // print data
                else if (e["keyCode"] === 80) {
                    this.print();
                }
            }
        });
    }

    // 输出迷宫数据
    private print() {
        this.outData = new Array<Array<boolean>>();
        for (let i: number = 0; i < this.width; i++) {
            this.outData.push(new Array<boolean>());
            for (let j: number = 0; j < this.height; j++) {
                this.outData[i].push(this.outMaze[i][j]);
            }
        }

        let data: string = "{";
        data += "\n\tx:" + this.width + ",\n\ty:" + this.height + ",";

        let flag = false;
        data += "\n\tbarriersArr:[";
        for (let i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.outData[i][j]) {
                    if (flag) { data += ", " }
                    flag = true;
                    // 是否多单元格连体
                    let str = this.barriersComboBox[i][j].selectedLabel;
                    if (str) {
                        let x: number = +str[str.length - 2];
                        let y: number = +str[str.length - 1];
                        let cntX: number = 0;
                        let cntY: number = 0;
                        let isHuge: boolean = true;

                        if (x > 1 || y > 1) {
                            let flag1 = false;
                            while (cntX < x) {
                                cntY = 0;
                                while (cntY < y) {
                                    // invalid
                                    if (i + cntX >= this.width || j + cntY >= this.height || !this.outData[i + cntX][j + cntY]) {
                                        isHuge = false;
                                        break;
                                    }
                                    if (!flag1) {
                                        data += "\"" + (i + cntX) + "," + (j + cntY);
                                    }
                                    else {
                                        data += "|" + (i + cntX) + "," + (j + cntY);
                                        this.outData[i + cntX][j + cntY] = false;
                                    }
                                    flag1 = true;
                                    cntY++;
                                }
                                if (!isHuge) { break; }
                                cntX++;
                            }
                        }
                        else {
                            data += "\"" + i + "," + j;
                        }
                    }
                    else {
                        data += "\"" + i + "," + j;
                    }
                    data += "\"";
                }
            }
        }
        data += "],";

        flag = false;
        data += "\n\tbarriersTyp:[";
        for (let i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.outData[i][j]) {
                    if (flag) { data += ", " }
                    flag = true;
                    data += "\"" + this.barriersComboBox[i][j].selectedLabel + "\"";
                }
            }
        }
        data += "],";

        data += "\n\tplayer_pos:\"" + this.maze.startX + "," + this.maze.startY + "\",";
        data += "\n}";

        console.log(data);
    }
}