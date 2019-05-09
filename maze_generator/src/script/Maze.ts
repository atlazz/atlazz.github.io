export default class Maze {
    /** 迷宫尺寸 */
    private width: number;
    private height: number;
    /** 记录迷宫状态，每个单元格状态有 empty, wall, undefined 三种 */
    private maze: Array<Array<string>> = new Array<Array<string>>();
    /** 输出迷宫矩阵, 每个单元格两种状态: true 为墙, false 为空 */
    private outMaze: Array<Array<boolean>> = new Array<Array<boolean>>();

    /** 迷宫起点 */
    public startX: number;
    public startY: number;
    /** 迷宫解法路径 */
    private solution: string[] = [];

    /** 迷宫中未定义单元格计数 */
    private count: number;
    /** 最小未定义单元格数, 用于结束迷宫生成，结束时未定义皆填补为墙, 数值体现难度 */
    private minCount: number = 3;
    /** 无效 randomMove 计数 */
    private unchangeCnt: number = 0;
    private maxUnchangeCnt: number = 3;

    /** 空单元格数 */
    private emptyCnt: number = 0;
    /** 重要墙单元格数 */
    private wallCnt: number = 0;
    /** 检验模式计数 */
    private checkCnt: number = 0;
    private maxUnchangeCntCheck: number = 100;

    /** 方向数组 */
    private directionList: string[] = [];

    constructor(width: number, height: number, minCount?: number) {
        this.width = width;
        this.height = height;
        this.count = width * height;
        this.minCount = minCount;

        // 生成初始迷宫
        for (let x: number = 0; x < this.width; x++) {
            this.maze.push(new Array<string>());
            this.outMaze.push(new Array<boolean>());
            for (let y: number = 0; y < this.height; y++) {
                this.maze[x].push("undefined");
                this.outMaze[x].push(true);
            }
        }
    }

    /** 重置并随机生成新迷宫
     *  Input - 起点坐标(x,y)
     *  Output - 生成状态：生成成功为 true
     * */
    generate(x: number, y: number): boolean {
        // 记录起点
        this.startX = x;
        this.startY = y;

        // 重置迷宫所有单元格状态
        for (let i: number = 0; i < this.width; i++) {
            for (let j: number = 0; j < this.height; j++) {
                this.maze[i][j] = "undefined";
                this.outMaze[i][j] = true;
            }
        }
        // 重置计数器
        this.count = this.width * this.height;
        this.emptyCnt = 0;

        // 设置当前位置为空
        if (this.setState(x, y, "empty")) {
            return true;
        }

        // 递归随机行走
        if (this.randomMove(x, y, this.count, false)) {
            for (let i: number = 0; i < this.width; i++) {
                for (let j: number = 0; j < this.height; j++) {
                    if (this.maze[i][j] === "empty") {
                        this.outMaze[i][j] = false;
                    }
                }
            }
            // 检验地图难度，使得玩家前几步骤操作有高容错率
            if (this.check()) {
                return true;
            }
        }
        return false;
    }

    /** 随机选择方向生成路径
     *  Input - 起点坐标(x,y)
     *          验证模式标记: true 为验证模式
     *  Output - 生成状态：成功为 true
     * */
    private randomMove(x: number, y: number, preCount: number, isCheck: boolean = false): boolean {
        // 判断四个方向是否可达
        this.directionList.length = 0;
        if (x > 0 && this.maze[x - 1][y] !== "wall") {
            if (this.solution && !(this.solution[this.solution.length - 1] === "right" && this.solution[this.solution.length - 2] === "left"))
            this.directionList.push("left");
        }
        if (x < this.width - 1 && this.maze[x + 1][y] !== "wall") {
            if (this.solution && !(this.solution[this.solution.length - 1] === "left" && this.solution[this.solution.length - 2] === "right"))
            this.directionList.push("right");
        }
        if (y > 0 && this.maze[x][y - 1] !== "wall") {
            if (this.solution && !(this.solution[this.solution.length - 1] === "down" && this.solution[this.solution.length - 2] === "up"))
            this.directionList.push("up");
        }
        if (y < this.height - 1 && this.maze[x][y + 1] !== "wall") {
            if (this.solution && !(this.solution[this.solution.length - 1] === "up" && this.solution[this.solution.length - 2] === "down"))
            this.directionList.push("down");
        }
        // 若四面皆为墙，则生成失败，该情况理应不存在
        if (!this.directionList) {
            return false;
        }

        // 随机选择方向
        let direction: string = this.directionList[Math.floor(Math.random() * this.directionList.length)];
        // 记录
        this.solution.push(direction);

        if (direction === "left") {
            // 最大可达路径长度: 本位置出发最长连续无墙单元格数
            let maxPathLength: number = 1;
            while (x - maxPathLength > 0 && this.maze[x - maxPathLength - 1][y] !== "wall") {
                maxPathLength++;
            }
            // 最小可达路径长度: 本位置出发最长连续空单元格数
            let minPathLength: number = 1;
            while (x - minPathLength > 0 && this.maze[x - minPathLength - 1][y] === "empty") {
                minPathLength++;
            }
            // 随机选择路径长度
            let pathLength: number = Math.ceil(Math.random() * (maxPathLength - minPathLength) + minPathLength);
            // 修正路径，末端不能为空
            while (x - pathLength - 1 >= 0 && this.maze[x - pathLength - 1][y] === "empty") {
                pathLength--;
            }
            // 验证模式额外处理
            pathLength = isCheck ? maxPathLength : pathLength;

            // 设置路径上单元格为空
            for (let i: number = 1; i <= pathLength; i++) {
                x--;
                if (this.setState(x, y, "empty", isCheck)) {
                    return true;
                }
            }
            // 设置路径末端(已不可能为空)为墙
            if (x > 0) {
                if (this.setState(x - 1, y, "wall", isCheck)) {
                    return true;
                }
            }
        }

        else if (direction === "right") {
            // 最大可达路径长度: 本位置出发最长连续无墙单元格数
            let maxPathLength: number = 1;
            while (x + maxPathLength < this.width - 1 && this.maze[x + maxPathLength + 1][y] !== "wall") {
                maxPathLength++;
            }
            // 最小可达路径长度: 本位置出发最长连续空单元格数
            let minPathLength: number = 1;
            while (x + minPathLength < this.width - 1 && this.maze[x + minPathLength + 1][y] === "empty") {
                minPathLength++;
            }
            // 随机选择路径长度
            let pathLength: number = Math.ceil(Math.random() * (maxPathLength - minPathLength) + minPathLength);
            // 修正路径，末端不能为空
            while (x + pathLength + 1 < this.width && this.maze[x + pathLength + 1][y] === "empty") {
                pathLength--;
            }
            // 验证模式额外处理
            pathLength = isCheck ? maxPathLength : pathLength;

            // 设置路径上单元格为空
            for (let i: number = 1; i <= pathLength; i++) {
                x++;
                if (this.setState(x, y, "empty", isCheck)) {
                    return true;
                }
            }
            // 设置路径末端(已不可能为空)为墙
            if (x < this.width - 1) {
                if (this.setState(x + 1, y, "wall", isCheck)) {
                    return true;
                }
            }
        }

        else if (direction === "up") {
            // 最大可达路径长度: 本位置出发最长连续无墙单元格数
            let maxPathLength: number = 1;
            while (y - maxPathLength > 0 && this.maze[x][y - maxPathLength - 1] !== "wall") {
                maxPathLength++;
            }
            // 最小可达路径长度: 本位置出发最长连续空单元格数
            let minPathLength: number = 1;
            while (y - minPathLength > 0 && this.maze[x][y - minPathLength - 1] === "empty") {
                minPathLength++;
            }
            // 随机选择路径长度
            let pathLength: number = Math.ceil(Math.random() * (maxPathLength - minPathLength) + minPathLength);
            // 修正路径，末端不能为空
            while (y - pathLength - 1 >= 0 && this.maze[x][y - pathLength - 1] === "empty") {
                pathLength--;
            }
            // 验证模式额外处理
            pathLength = isCheck ? maxPathLength : pathLength;

            // 设置路径上单元格为空
            for (let i: number = 1; i <= pathLength; i++) {
                y--;
                if (this.setState(x, y, "empty", isCheck)) {
                    return true;
                }
            }
            // 设置路径末端(已不可能为空)为墙
            if (y > 0) {
                if (this.setState(x, y - 1, "wall", isCheck)) {
                    return true;
                }
            }
        }

        else if (direction === "down") {
            // 最大可达路径长度: 本位置出发最长连续无墙单元格数
            let maxPathLength: number = 1;
            while (y + maxPathLength < this.height - 1 && this.maze[x][y + maxPathLength + 1] !== "wall") {
                maxPathLength++;
            }
            // 最小可达路径长度: 本位置出发最长连续空单元格数
            let minPathLength: number = 1;
            while (y + minPathLength < this.height - 1 && this.maze[x][y + minPathLength + 1] === "empty") {
                minPathLength++;
            }
            // 随机选择路径长度
            let pathLength: number = Math.ceil(Math.random() * (maxPathLength - minPathLength) + minPathLength);
            // 修正路径，末端不能为空
            while (y + pathLength + 1 < this.height && this.maze[x][y + pathLength + 1] === "empty") {
                pathLength--;
            }
            // 验证模式额外处理
            pathLength = isCheck ? maxPathLength : pathLength;

            // 设置路径上单元格为空
            for (let i: number = 1; i <= pathLength; i++) {
                y++;
                if (this.setState(x, y, "empty", isCheck)) {
                    return true;
                }
            }
            // 设置路径末端(已不可能为空)为墙
            if (y < this.height - 1) {
                if (this.setState(x, y + 1, "wall", isCheck)) {
                    return true;
                }
            }
        }

        // 生成模式
        if (!isCheck) {
            // 若计数无变化，判断生成路径重复，生成失败
            if (this.count === preCount) {
                this.unchangeCnt++;
                if (this.unchangeCnt >= this.maxUnchangeCnt) {
                    return false;
                }
            }
            else {
                this.unchangeCnt = 0;
            }

            // 递归：随机选择下一方向
            return this.randomMove(x, y, this.count);
        }
        // 检验模式
        else {
            // 若检验计数无变化
            if (this.checkCnt === preCount) {
                this.unchangeCnt++;
                if (this.unchangeCnt >= this.maxUnchangeCntCheck) {
                    return false;
                }
            }
            else {
                this.unchangeCnt = 0;
            }

            // 递归：随机选择下一方向
            return this.randomMove(x, y, this.checkCnt, true);
        }
    }

    /** 单元格状态赋值，并更新未定义计数
     *  Input - (x,y): 单元格坐标
     *          state: 单元格目标状态( empty, wall )
     *          验证模式标记: true 为验证模式
     *  Output - 迷宫生成结束标志：结束为 true
     * */
    private setState(x: number, y: number, state: string, isCheck: boolean = false): boolean {
        let preState: string = this.maze[x][y];
        // 检验模式
        if (isCheck) {
            if (preState === "empty") {
                this.maze[x][y] = "passed";
                this.checkCnt++;
                if (this.checkCnt === this.emptyCnt) {
                    // 迷宫检验结束，检验成功
                    return true;
                }
            }
            return false;
        }
        // 生成模式
        else {
            this.maze[x][y] = state;
            if (preState === "undefined") {
                this.count--;
                if (state === "empty") {
                    this.emptyCnt++;
                }
                else if (state === "wall") {
                    this.wallCnt++;
                }
                if (this.count <= this.minCount) {
                    // 迷宫生成结束，生成成功
                    return true;
                }
            }
            return false;
        }
    }

    /** 检验迷宫，目标使得玩家前几步骤操作有高容错率 */
    private check() {

        this.maxUnchangeCntCheck = 10 * this.width * this.height;

        // 起点
        let x: number;
        let y: number;

        // // 遍历每个空节点
        // for (let i: number = 0; i < this.width; i++) {
        //     for (let j: number = 0; j < this.height; j++) {
        //         if (!this.outMaze[i][j]) {
        //             // 尝试多次
        //             for (let times: number = 0; times < 3; times++) {
        //                 // 重置迷宫参数
        //                 this.resetCheck();
        //                 this.setState(i, j, "passed", true);
        //                 if (!this.randomMove(i, j, this.emptyCnt, true)) {
        //                     console.log("check failed.");
        //                     return false;
        //                 }
        //                 console.log("check seccessed.");
        //                 console.log("start: (" + i + "," + j + ")");
        //                 console.log(this.solution);
        //             }
        //         }
        //     }
        // }
        // // 验证成功
        // return true;

        // 遍历四个方向是否均可解
        for (let times: number = 0; times < 10; times++) {
            // left
            this.resetCheck();
            // 重置起点
            x = this.startX;
            y = this.startY;
            this.setState(x, y, "passed", true);
            while (x > 0 && this.maze[x - 1][y] === "empty") {
                x--;
                this.setState(x, y, "passed", true);
            }
            // 递归随机行走
            if (!this.randomMove(x, y, this.emptyCnt, true)) {
                // console.log("check left failed.");
                return false;
            }

            // right
            this.resetCheck();
            // 重置起点
            x = this.startX;
            y = this.startY;
            this.setState(x, y, "passed", true);
            while (x < this.width - 1 && this.maze[x + 1][y] === "empty") {
                x++;
                this.setState(x, y, "passed", true);
            }
            // 递归随机行走
            if (!this.randomMove(x, y, this.emptyCnt, true)) {
                // console.log("check right failed.");
                return false;
            }

            // up
            this.resetCheck();
            // 重置起点
            x = this.startX;
            y = this.startY;
            this.setState(x, y, "passed", true);
            while (y > 0 && this.maze[x][y - 1] === "empty") {
                y--;
                this.setState(x, y, "passed", true);
            }
            // 递归随机行走
            if (!this.randomMove(x, y, this.emptyCnt, true)) {
                // console.log("check up failed.");
                return false;
            }

            // down
            this.resetCheck();
            // 重置起点
            x = this.startX;
            y = this.startY;
            this.setState(x, y, "passed", true);
            while (y < this.height - 1 && this.maze[x][y + 1] === "empty") {
                y++;
                this.setState(x, y, "passed", true);
            }
            // 递归随机行走
            if (!this.randomMove(x, y, this.emptyCnt, true)) {
                // console.log("check down failed.");
                return false;
            }

            // console.log("check seccessed. times: " + times + "/9");
        }
        // 检验成功
        return true;
    }

    private resetCheck() {
        // 重置计数
        this.checkCnt = 0;
        // 重置迷宫
        for (let i: number = 0; i < this.width; i++) {
            for (let j: number = 0; j < this.height; j++) {
                if (this.outMaze[i][j]) {
                    this.maze[i][j] = "wall";
                }
                else {
                    this.maze[i][j] = "empty";
                }
            }
        }
        // 重置解法
        this.solution.length = 0;
    }

    /** 输出迷宫矩阵, 每个单元格两种状态: true 为墙, false 为空 */
    getMaze(): Array<Array<boolean>> {
        return this.outMaze;
    }
}
