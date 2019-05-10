import { ui } from "./../../ui/layaMaxUI";
import GameScene from "./GameScene";
import * as Const from "../Const";
import wx from "../util/wx";
import ws from "../util/ws.js";
import Global from "../Global";
import HomeView from "./HomeView";
import Reward from "../component/Reward";
import * as Ad from "../util/Ad";
import * as Util from "../util/Util";

export default class OverView extends ui.over.OverViewUI {
    static instance: OverView;

    /**
     * 打开该单例页面，触发onOpened
     * @param param  onOpened方法的传参
     */
    static openInstance(param?: any) {
        if (OverView.instance) {
            OverView.instance.onOpened(param);
        } else {
            Laya.Scene.open(Const.URL_OverView, false, param);
        }
    }

    onOpened({ score = 0 }) {
        console.log("OverView onOpened()");

        if (Laya.Browser.onMiniGame && ws.isIPhoneX()) {
            this.bottomButtonBox.bottom = 215 + Global.config.distance_iphonex || 0;
        }

        if (!this.isInitIcons && Laya.Browser.onMiniGame) {
            this.isInitIcons = true;
            this.initOverIcons(["Restart_icon5", "Restart_icon6", "Restart_icon7", "Restart_icon8", "Restart_icon9", "Restart_icon10"]);
            this.initGuessLikeIcons(["Restart_icon1", "Restart_icon2", "Restart_icon3", "Restart_icon4"]);
        }
        this.scoreLabel.changeText(score + "");
        //广告延迟弹出
        this.visible = true;
        if (Global.config.online && Math.random() < Global.config.banner_delay_ratio) {
            this.buttonsDownAni.play(undefined, false);
            Laya.timer.once((Global.config.banner_delay - 1 / 6) * 1000, this, () => {
                Ad.posShowBanner(Const.BannerPos.OverView);
                this.buttonsUpAni.play(undefined, false);
            });
        } else {
            Ad.posShowBanner(Const.BannerPos.OverView);
        }
    }

    /**是否初始化图标*/
    private isInitIcons: boolean = false;
    /**结束页图标列表*/
    private iconInfosList: any[] = [];
    /**当前显示结束页图标*/
    private currentIconInfoList: any[] = [];
    /**猜你喜欢图标列表*/
    private guessLikeIconInfosList: any[] = [];
    /**当前显示猜你喜欢图标*/
    private currentGuessLikeIconInfoList: any[] = [];

    constructor() {
        super();
        console.log("OverView constructor()");
        OverView.instance = this;
    }

    onEnable() {
        this.bindButtons();
    }

    /**绑定按钮 */
    private bindButtons() {
        this.restartButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.restartGame();
        });
        this.homeButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.toHome();
        });
        this.shareButton.on(Laya.Event.MOUSE_DOWN, this, () => {
            ws.share({ pos: Const.RewardPos.OverShare });
        });
    }

    /**重新开始游戏 */
    private restartGame() {
        ws.traceEvent('Click_Restart');
        this.hide();
        GameScene.instance.resetGame();
        GameScene.openInstance();
    }

    /**回到首页 */
    private toHome() {
        this.hide();
        GameScene.instance.resetGame();
        HomeView.openInstance();
    }

    /**隐藏页面 */
    private hide() {
        Ad.posHideBanner(Const.BannerPos.OverView);
        this.visible = false;
    }

    /**图标点击*/
    private onIconClick(pos: string, ad: any, redirect = true) {
        ws.tapGameAd({ pos, ad, redirect });
    }

    /**猜你喜欢图标*/
    private initGuessLikeIcons(posList: string[]) {
        if (!posList || !posList.length) {
            return;
        }
        let fetchParams = [];
        for (let pos of posList) {
            let list = Global.config.games[pos];
            let count = list && list.length ? list.length : 1;
            fetchParams.push({ pos, count });
        }
        this.guessLikeList.renderHandler = Laya.Handler.create(this, (cell: Laya.Box, index: number) => {
            let iconInfo = this.guessLikeList.array[index];
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
                Util.jumpeOnce(index * 150, cell);
            } else {
                cell.visible = false;
            }
        }, [], false);
        ws.fetchGameAd({
            data: fetchParams,
            success: (res: any) => {
                let data = res.data;
                let guessLikeIconInfosList = [];
                for (let pos of posList) {
                    guessLikeIconInfosList.push(data[pos]);
                }
                this.guessLikeIconInfosList = guessLikeIconInfosList;
                //当前显示图标
                this.currentGuessLikeIconInfoList = [];
                this.scheduleRefreshGuessLikeIcons();
            },
        });
    }

    /**每隔三秒刷新一次*/
    private scheduleRefreshGuessLikeIcons() {
        this.refreshGuessLikeIcons();
        Laya.timer.loop(3000, this, () => {
            if (this.visible) {
                this.refreshGuessLikeIcons();
            }
        });
    }

    /**刷新猜你喜欢图标*/
    private refreshGuessLikeIcons() {
        for (let i = 0; i < this.guessLikeIconInfosList.length; i++) {
            let iconInfos = this.guessLikeIconInfosList[i];
            let iconInfo = Util.getRandom(iconInfos);
            this.currentGuessLikeIconInfoList[i] = iconInfo;
        }
        this.guessLikeList.array = this.currentGuessLikeIconInfoList;
        this.guessLikeList.refresh();
    }

    /**结束页图标*/
    private initOverIcons(posList: string[]) {
        if (!posList || !posList.length) {
            return;
        }
        let fetchParams = [];
        for (let pos of posList) {
            let list = Global.config.games[pos];
            let count = list && list.length ? list.length : 1;
            fetchParams.push({ pos, count });
        }
        this.overIconList.renderHandler = Laya.Handler.create(this, (cell: Laya.Box, index: number) => {
            let iconInfo = this.overIconList.array[index];
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
                this.scheduleRefreshOverIcons();
            },
        });
    }

    /**每隔三秒刷新一次*/
    private scheduleRefreshOverIcons() {
        this.refreshOverIcons();
        Laya.timer.loop(3000, this, () => {
            if (this.visible) {
                this.refreshOverIcons();
            }
        });
    }

    /**刷新结束页图标*/
    private refreshOverIcons() {
        for (let i = 0; i < this.iconInfosList.length; i++) {
            let iconInfos = this.iconInfosList[i];
            let iconInfo = Util.getRandom(iconInfos);
            this.currentIconInfoList[i] = iconInfo;
        }
        this.overIconList.array = this.currentIconInfoList;
        this.overIconList.refresh();
    }

}