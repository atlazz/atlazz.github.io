import { ui } from "./../../ui/layaMaxUI";
import GameScene from "./GameScene";
import * as Const from "../Const";
import wx from "../util/wx";
import ws from "../util/ws.js";
import Global from "../Global";
import * as Ad from "../util/Ad";
import * as Util from "../util/Util";
import Reward from "../component/Reward";

export default class HomeView extends ui.home.HomeViewUI {
    static instance: HomeView;

    /**
     * 打开该单例页面，触发onOpened
     * @param param  onOpened方法的传参
     */
    static openInstance(param?: any) {
        if (HomeView.instance) {
            Ad.posShowBanner(Const.BannerPos.HomeView);
            HomeView.instance.onOpened(param);
        } else {
            Laya.Scene.open(Const.URL_HomeView, false, param);
        }
    }

    onOpened(param?: any) {
        console.log("HomeView onOpened()");
        this.visible = true;
    }

    /**首页图标列表*/
    private iconInfosList: any[] = [];
    /**当前显示首页图标*/
    private currentIconInfoList: any[] = [];

    private isGameDataLoaded: boolean = false;

    constructor() {
        super();
        console.log("HomeView constructor()");
        GameScene.openInstance();
        HomeView.instance = this;
    }

    onEnable() {
        console.log("HomeView onEnable()");
        this.bindButtons();
        if (Laya.Browser.onMiniGame) {
            this.initWeixin();
        } else {
            this.onGameDataLoaded();
        }
    }

    /**绑定按钮 */
    private bindButtons() {
        //开始按钮
        this.startButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            if (GameScene.instance) {
                ws.traceEvent("Click_Startgame");
                this.hide();
                GameScene.openInstance();
            }
        });
        //皮肤切换按钮
        this.skinButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.moreSkinOpenAni.play(undefined, false);
            this.initMoreSkinIcons();
        });
        //更多皮肤关闭
        this.moreSkinCloseButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.moreSkinCloseAni.play(undefined, false);
        });
        //抽屉打开
        this.drawerOpenButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.drawerOpenAni.play(undefined, false);
            this.initDrawerIcons("game_drawer");
        });
        //抽屉关闭
        this.drawerCloseButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.drawerCloseAni.play(undefined, false);
            ws.hideGameAd("game_drawer");
        });
        //更多游戏打开
        this.moreGameOpenButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.moreGameOpenAni.play(undefined, false);
            this.initMoreGameIcons("game_more");
        });
        //更多游戏关闭
        this.moreGameCloseButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.moreGameCloseAni.play(undefined, false);
            ws.hideGameAd("game_more");
        });
    }

    private hide() {
        Ad.posHideBanner(Const.BannerPos.HomeView);
        this.visible = false;
    }

    /**微信环境初始化*/
    private initWeixin() {
        wx.showShareMenu({
            withShareTicket: true
        });
        wx.onShareAppMessage(() => {
            let option = ws.createShareOptions({ pos: 'ShareAppButton' });
            return {
                title: option.title,
                imageUrl: option.imageUrl,
                query: option.query,
            }
        });
        ws.init({
            host: 'ws.lesscool.cn', // 暂时用这个域名，后面会支持api.websdk.cn这个域名
            version: Const.VERSION, // 当前的小游戏版本号，只能以数字
            appid: 1093, // 此项目在云平台的appid
            secret: '91abf6fe5f824fa43e50c3a4e573ed19', // 此项目在云平台的secret, 用于与后端通信签名
            share: {
                title: '全民欢乐，天天游戏！', // 默认分享文案
                image: 'http://oss.lesscool.cn/fcdh/96d172496dbafa4ab9c8335a7133476c.png', // 默认分享图片
            },
        })
        this.loginWs();
    }

    /**登录ws后台*/
    private loginWs() {
        ws.traceEvent('WS_LOGINING');
        wx.showLoading({ title: '登录中', mask: true });
        ws.onLoginComplete(this.onLoginComplete.bind(this));
        ws.login();
    }

    /**登录ws后台完成*/
    private onLoginComplete(res) {
        if (ws.getLoginStatus() === 'success') {
            ws.traceEvent('WS_LOGINED');
            wx.hideLoading();
            console.log('ws.conf', ws.conf); // 通用配置
            console.log('ws.user', ws.user); // 用户信息
            console.log('ws.data', ws.data); // 本地保存的游戏数据
            this.loadConfig();
            this.loadGameData();

        } else if (ws.getLoginStatus() === 'fail') {
            ws.traceEvent('WS_LOGIN_FAIL');
            wx.hideLoading();
            wx.showModal({
                title: '登陆失败',
                content: '请允许授权',
                confirmText: '重新登陆',
                cancelText: '关闭',
                success(res) {
                    wx.showLoading({ title: '登录中', mask: true });
                    ws.login();
                }
            });
        }
    }

    /**后台配置加载完成*/
    private loadConfig() {
        (<any>Object).assign(Global.config, ws.conf);
    }

    /**加载后台游戏数据*/
    private loadGameData() {
        if (!ws.data || !ws.data.updateTimestamp) {
            ws.setAllData(Global.gameData, true);
        }
        Global.gameData = (<any>Object).assign(Global.gameData, ws.data);
        // 更新显示钻石数
        GameScene.instance && GameScene.instance.diamondLabel.changeText(Global.gameData.diamond + '');
        //关闭更新游戏数据
        wx.onHide(() => {
            this.updateGameData(true);
        });
        //刷新当前广告banner
        ws.onShow(() => {
            Ad.refreshCurrentBanner();
        });
        this.initHomeIcons(["home_icon_1", "home_icon_2", "home_icon_3", "home_icon_4", "home_icon_5", "home_icon_6", "home_icon_7", "home_icon_8", "home_icon_9", "home_icon_10"]);
        this.homeIconBox.visible = true;
        this.drawerBox.visible = true;
        this.moreGameOpenButton.visible = true;
        this.startButton.visible = true;
        this.onGameDataLoaded();
    }

    /**游戏数据加载完成*/
    private onGameDataLoaded() {
        console.log('onGameDataLoaded', Global.gameData);
        this.isGameDataLoaded = true;
        Ad.posShowBanner(Const.BannerPos.HomeView);
    }

    /**提交游戏数据*/
    updateGameData(post: boolean) {
        Global.gameData.updateTimestamp = Date.now();
        post && console.log('updateGameData', Global.gameData);
        Laya.Browser.onMiniGame && ws.setAllData(Global.gameData, post);
    }



    /**图标点击*/
    private onIconClick(pos: string, ad: any, redirect = true) {
        ws.tapGameAd({ pos, ad, redirect, });
    }

    /**抽屉图标*/
    private initDrawerIcons(pos: string) {
        this.drawerList.renderHandler = Laya.Handler.create(this, (cell: Laya.Box, index: number) => {
            let iconInfo = this.drawerList.array[index];
            if (iconInfo) {
                cell.visible = true;
                //注册点击
                cell.on(Laya.Event.MOUSE_DOWN, this, this.onIconClick, [pos, iconInfo]);
                //图片
                let iconImage = cell.getChildByName("iconImage") as Laya.Sprite;
                iconImage && iconImage.loadImage(iconInfo.icon);
                //名称
                let titleLabel = cell.getChildByName("titleLabel") as Laya.Label;
                titleLabel && titleLabel.changeText(iconInfo.title);
                //提示
                let tips = cell.getChildByName("tips");
                if (tips) {
                    let tipsLabel = tips.getChildByName("tipsLabel") as Laya.Label;
                    tipsLabel && tipsLabel.changeText(Math.random() > 0.5 ? "热门" : "NEW");
                }
            } else {
                cell.visible = false;
            }
        }, [], false);
        ws.getGameAd({
            pos: pos,
            count: Global.config.games[pos].length,
            success: (res: any) => {
                let iconInfoList = res.data;
                this.drawerList.array = iconInfoList;
                this.drawerList.refresh();
            }
        });
    }

    /**更多皮肤图标*/
    private initMoreSkinIcons() {
        this.moreSkinList.renderHandler = Laya.Handler.create(this, (cell: Laya.Box, index: number) => {
            let iconInfo = this.moreSkinList.array[index];
            if (iconInfo) {
                cell.visible = true;
                //注册点击
                cell.on(Laya.Event.MOUSE_DOWN, this, this.onSkinClick, [cell, iconInfo.idx]);
                //图片
                let iconImage = cell.getChildByName("iconImage") as Laya.Sprite;
                iconImage && iconImage.loadImage(Const.URL_PlayerIcon[iconInfo.idx], Laya.Handler.create(this, () => {
                    // 皮肤未解锁
                    if (Global.gameData.skinUnlock[index].state === false) {
                        // 未解锁蒙板
                        let iconMaskImage = cell.getChildByName("iconMaskImage") as Laya.Sprite;
                        iconMaskImage && (iconMaskImage.visible = true);
                        // 解锁条件信息
                        let unlockMsg = cell.getChildByName("unlockMsg") as Laya.Text;
                        if (Global.gameData.skinUnlock[index].cost === "diamond") {
                            unlockMsg && (unlockMsg.text = Global.gameData.skinUnlock[index].value + "钻解锁");
                        }
                        else if (Global.gameData.skinUnlock[index].cost === "score") {
                            unlockMsg && (unlockMsg.text = Global.gameData.skinUnlock[index].value + "分解锁");
                        }
                        else if (Global.gameData.skinUnlock[index].cost === "video") {
                            unlockMsg && (unlockMsg.text = "视频解锁");
                        }
                    }
                    // 皮肤已解锁
                    else {
                        // 清除蒙板
                        let iconMaskImage = cell.getChildByName("iconMaskImage") as Laya.Sprite;
                        iconMaskImage && (iconMaskImage.visible = false);
                        // 解锁信息
                        let unlockMsg = cell.getChildByName("unlockMsg") as Laya.Text;
                        unlockMsg && (unlockMsg.text = "已解锁");
                    }
                }));
            } else {
                cell.visible = false;
            }
        }, [], false);

        // 加载皮肤列表数据源
        let iconInfoList: Array<any> = [];
        for (let i: number = 0; i < Const.PlayerMeshTypeNum; i++) {
            iconInfoList.push({ idx: i });
        }
        this.moreSkinList.array = iconInfoList;
        this.moreSkinList.refresh();
    }

    /**皮肤点击事件 */
    private onSkinClick(cell: Laya.Box, idx: number) {
        // 皮肤已解锁
        if (Global.gameData.skinUnlock[idx].state) {
            // 改变选中位置
            let selected: Laya.Sprite = this.moreSkinPanel.getChildByName("panelImage").getChildByName("selected") as Laya.Sprite;
            selected.x = this.moreSkinList.spaceX + cell.x + cell.width - selected.width / 2;
            selected.y = this.moreSkinList.spaceY + cell.y + selected.height / 2;
            // 选中图片特效
            let iconImage = cell.getChildByName("iconImage") as Laya.Sprite;
            Laya.Tween.to(iconImage, { scaleX: 1.1, scaleY: 1.1 }, 100, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(iconImage, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearInOut);
            }));
            // 改变玩家皮肤
            GameScene.instance.playerCompo.changePlayer(idx);
        }
        // 皮肤未解锁
        else {
            // 钻石解锁
            if (Global.gameData.skinUnlock[idx].cost === "diamond" && Global.gameData.diamond >= Global.gameData.skinUnlock[idx].value) {
                Global.gameData.diamond -= Global.gameData.skinUnlock[idx].value;
                this.unlockSkin(cell, idx);
            }
            // 视频解锁  todo <=========== 视频位置需要后台新增位置配置
            else if (Global.gameData.skinUnlock[idx].cost === "video") {
                Reward.instance.video({
                    pos: Const.RewardPos.Revive,
                    success: () => {
                        this.unlockSkin(cell, idx);
                    }
                });
            }
        }
    }

    /**解锁皮肤 */
    unlockSkin(cell: Laya.Box, idx: number) {
        // 改变锁定状态
        Global.gameData.skinUnlock[idx].state = true;
        // 改变锁定文字
        let unlockMsg = cell.getChildByName("unlockMsg") as Laya.Text;
        unlockMsg && (unlockMsg.text = "已解锁");
        // 清除锁定蒙板
        let iconMaskImage = cell.getChildByName("iconMaskImage") as Laya.Sprite;
        iconMaskImage && (iconMaskImage.visible = false);
    }

    /**更多游戏图标*/
    private initMoreGameIcons(pos: string) {
        this.moreGameList.renderHandler = Laya.Handler.create(this, (cell: Laya.Box, index: number) => {
            let iconInfo = this.moreGameList.array[index];
            if (iconInfo) {
                cell.visible = true;
                //注册点击
                cell.on(Laya.Event.MOUSE_DOWN, this, this.onIconClick, [pos, iconInfo]);
                //图片
                let iconImage = cell.getChildByName("iconImage") as Laya.Sprite;
                iconImage && iconImage.loadImage(iconInfo.icon);
                //名称
                let titleLabel = cell.getChildByName("titleLabel") as Laya.Label;
                titleLabel && titleLabel.changeText(iconInfo.title);
                //提示
                let tips = cell.getChildByName("tips");
                if (tips) {
                    let tipsLabel = tips.getChildByName("tipsLabel") as Laya.Label;
                    tipsLabel && tipsLabel.changeText(Math.random() > 0.5 ? "热门" : "NEW");
                }
            } else {
                cell.visible = false;
            }
        }, [], false);
        ws.getGameAd({
            pos: pos,
            count: Global.config.games[pos].length,
            success: (res: any) => {
                let iconInfoList = res.data;
                this.moreGameList.array = iconInfoList;
                this.moreGameList.refresh();
            }
        });
    }

    /**主页图标*/
    private initHomeIcons(posList: string[]) {
        if (!posList || !posList.length) {
            return;
        }
        let fetchParams = [];
        for (let pos of posList) {
            let list = Global.config.games[pos];
            let count = list && list.length ? list.length : 1;
            fetchParams.push({ pos, count });
        }
        this.homeIconList.renderHandler = Laya.Handler.create(this, (cell: Laya.Box, index: number) => {
            let iconInfo = this.homeIconList.array[index];
            if (iconInfo) {
                cell.visible = true;
                //注册点击
                cell.on(Laya.Event.MOUSE_DOWN, this, this.onIconClick, [posList[index], iconInfo]);
                //图片
                let iconImage = cell.getChildByName("iconImage") as Laya.Sprite;
                iconImage && iconImage.loadImage(iconInfo.icon);
                //名称
                let titleLabel = cell.getChildByName("titleLabel") as Laya.Label;
                titleLabel && titleLabel.changeText(iconInfo.title);
                //抖动
                Util.shakeOnce(Math.random() * 1000, cell);
            } else {
                cell.visible = false;
            }
        }, [], false);
        ws.fetchGameAd({
            data: fetchParams,
            success: (res: any) => {
                let data = res.data;
                let iconInfosList = [];
                for (let pos of posList) {
                    iconInfosList.push(data[pos]);
                }
                this.iconInfosList = iconInfosList;
                //当前显示图标
                this.currentIconInfoList = [];
                this.scheduleRefreshHomeIcons();
            },
        });
    }

    /**每隔三秒刷新一次*/
    private scheduleRefreshHomeIcons() {
        this.refreshHomeIcons();
        Laya.timer.loop(3000, this, () => {
            if (this.visible) {
                this.refreshHomeIcons();
            }
        });
    }

    /**刷新首页图标*/
    private refreshHomeIcons() {
        for (let i = 0; i < this.iconInfosList.length; i++) {
            let iconInfos = this.iconInfosList[i];
            let iconInfo = Util.getRandom(iconInfos);
            this.currentIconInfoList[i] = iconInfo;
        }
        this.homeIconList.array = this.currentIconInfoList;
        this.homeIconList.refresh();
    }

}