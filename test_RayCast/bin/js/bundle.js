var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var GameUI_1 = require("./script/GameUI");
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
        var reg = Laya.ClassUtils.regClass;
        reg("script/GameUI.ts", GameUI_1.default);
    };
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    return GameConfig;
}());
exports.default = GameConfig;
GameConfig.init();
},{"./script/GameUI":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("./GameConfig");
var Main = /** @class */ (function () {
    function Main() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig_1.default.scaleMode;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    };
    Main.prototype.onConfigLoaded = function () {
        //加载IDE指定的场景
        GameConfig_1.default.startScene && Laya.Scene.open(GameConfig_1.default.startScene);
    };
    return Main;
}());
//激活启动类
new Main();
},{"./GameConfig":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("./../ui/layaMaxUI");
var GameUI = /** @class */ (function (_super) {
    __extends(GameUI, _super);
    function GameUI() {
        var _this = _super.call(this) || this;
        //添加3D场景
        var scene = Laya.stage.addChild(new Laya.Scene3D());
        //添加照相机
        var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
        camera.transform.translate(new Laya.Vector3(0, 0, 3));
        camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
        //添加方向光
        var directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        //添加自定义模型
        var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
        box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        var material = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex) {
            material.albedoTexture = tex;
        }));
        box.meshRenderer.material = material;
        box.name = "super box";
        var boxCollider = box.addComponent(Laya.PhysicsCollider);
        var boxColliderShape = new Laya.MeshColliderShape();
        boxColliderShape.mesh = box.meshFilter.sharedMesh;
        boxCollider.colliderShape = boxColliderShape;
        var point = new Laya.Vector2();
        var ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        var hitResult = new Laya.HitResult();
        // let physicsSet: Laya.PhysicsSettings = new Laya.PhysicsSettings();
        // let physicsSim: Laya.PhysicsSimulation = new Laya.PhysicsSimulation(physicsSet);
        // Laya.timer.frameLoop(1, this, () => {
        //     point.x = Laya.MouseManager.instance.mouseX;
        //     point.y = Laya.MouseManager.instance.mouseY;
        //     camera.viewportPointToRay(point, ray);
        //     physicsSim.rayCast(ray, hitResult, 30, 1, 1);
        //     if (hitResult.succeeded) {
        //         console.log(hitResult.collider.owner.name);
        //     }
        // });
        Laya.stage.on(Laya.Event.CLICK, _this, function () {
            // console.log(box)
            var bullet = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.02)));
            var mat = new Laya.BlinnPhongMaterial();
            mat.albedoColor = new Laya.Vector4(1, 0, 0, 1);
            bullet.meshRenderer.material = mat;
            bullet.name = "bullet";
            var bulletCollider = bullet.addComponent(Laya.PhysicsCollider);
            var bulletColliderShape = new Laya.MeshColliderShape();
            bulletColliderShape.mesh = bullet.meshFilter.sharedMesh;
            bulletCollider.colliderShape = bulletColliderShape;
            // bullet.addComponent(Laya.Rigidbody3D);
            point.x = Laya.MouseManager.instance.mouseX;
            point.y = Laya.MouseManager.instance.mouseY;
            camera.viewportPointToRay(point, ray);
            bullet.transform.localPosition = ray.origin.clone();
            var direction = ray.direction.clone();
            var destPoint = new Laya.Vector3();
            destPoint.x = ray.origin.x + ray.direction.x * 3;
            destPoint.y = ray.origin.y + ray.direction.y * 3;
            destPoint.z = ray.origin.z + ray.direction.z * 3;
            // let flag = physicsSim.shapeCast(bulletColliderShape, ray.origin.clone(), destPoint.clone(), hitResult);
            scene.physicsSimulation.rayCast(ray, hitResult, 30);
            if (hitResult.succeeded) {
                console.log(hitResult.collider.owner.name);
            }
            bullet.frameLoop(1, bullet, function () {
                bullet.transform.localPositionX += direction.x * 3 / 60;
                bullet.transform.localPositionY += direction.y * 3 / 60;
                bullet.transform.localPositionZ += direction.z * 3 / 60;
                if (bullet.transform.localPositionZ < -3) {
                    bullet.timer.clearAll(bullet);
                    bullet.destroy();
                }
            });
        });
        return _this;
    }
    return GameUI;
}(layaMaxUI_1.ui.test.TestSceneUI));
exports.default = GameUI;
},{"./../ui/layaMaxUI":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene = Laya.Scene;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
    var test;
    (function (test) {
        var TestSceneUI = /** @class */ (function (_super) {
            __extends(TestSceneUI, _super);
            function TestSceneUI() {
                return _super.call(this) || this;
            }
            TestSceneUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadScene("test/TestScene");
            };
            return TestSceneUI;
        }(Scene));
        test.TestSceneUI = TestSceneUI;
        REG("ui.test.TestSceneUI", TestSceneUI);
    })(test = ui.test || (ui.test = {}));
})(ui = exports.ui || (exports.ui = {}));
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6L0xheWFBaXJJREVfYmV0YS9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9NYWluLnRzIiwic3JjL3NjcmlwdC9HYW1lVUkudHMiLCJzcmMvdWkvbGF5YU1heFVJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBLGdHQUFnRztBQUNoRywwQ0FBb0M7QUFDcEM7O0VBRUU7QUFDRjtJQWFJO0lBQWMsQ0FBQztJQUNSLGVBQUksR0FBWDtRQUNJLElBQUksR0FBRyxHQUFhLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQzdDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBQyxnQkFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQWhCTSxnQkFBSyxHQUFRLEdBQUcsQ0FBQztJQUNqQixpQkFBTSxHQUFRLElBQUksQ0FBQztJQUNuQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLE1BQU0sQ0FBQztJQUN6QixpQkFBTSxHQUFRLEtBQUssQ0FBQztJQUNwQixpQkFBTSxHQUFRLE1BQU0sQ0FBQztJQUNyQixxQkFBVSxHQUFLLHNCQUFzQixDQUFDO0lBQ3RDLG9CQUFTLEdBQVEsRUFBRSxDQUFDO0lBQ3BCLGdCQUFLLEdBQVMsS0FBSyxDQUFDO0lBQ3BCLGVBQUksR0FBUyxLQUFLLENBQUM7SUFDbkIsdUJBQVksR0FBUyxLQUFLLENBQUM7SUFDM0IsNEJBQWlCLEdBQVMsSUFBSSxDQUFDO0lBTTFDLGlCQUFDO0NBbEJELEFBa0JDLElBQUE7a0JBbEJvQixVQUFVO0FBbUIvQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7QUN4QmxCLDJDQUFzQztBQUN0QztJQUNDO1FBQ0MsZ0JBQWdCO1FBQ2hCLElBQUksTUFBTSxDQUFDLFFBQVEs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LElBQUksQ0FBQyxXQUFXLEdBK0Z0RDs7Ozs7QUM5RkQsSUFBTyxLQUFLLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN4QixJQUFJLEdBQUcsR0FBYSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztBQUM3QyxJQUFjLEVBQUUsQ0FTZjtBQVRELFdBQWMsRUFBRTtJQUFDLElBQUEsSUFBSSxDQVNwQjtJQVRnQixXQUFBLElBQUk7UUFDakI7WUFBaUMsK0JBQUs7WUFDbEM7dUJBQWUsaUJBQU87WUFBQSxDQUFDO1lBQ3ZCLG9DQUFjLEdBQWQ7Z0JBQ0ksaUJBQU0sY0FBYyxXQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBQ0wsa0JBQUM7UUFBRCxDQU5BLEFBTUMsQ0FOZ0MsS0FBSyxHQU1yQztRQU5ZLGdCQUFXLGNBTXZCLENBQUE7UUFDRCxHQUFHLENBQUMscUJBQXFCLEVBQUMsV0FBVyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxFQVRnQixJQUFJLEdBQUosT0FBSSxLQUFKLE9BQUksUUFTcEI7QUFBRCxDQUFDLEVBVGEsRUFBRSxHQUFGLFVBQUUsS0FBRixVQUFFLFFBU2YiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXHJcbmltcG9ydCBHYW1lVUkgZnJvbSBcIi4vc2NyaXB0L0dhbWVVSVwiXHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj02NDA7XHJcbiAgICBzdGF0aWMgaGVpZ2h0Om51bWJlcj0xMTM2O1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJub25lXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25WOnN0cmluZz1cInRvcFwiO1xyXG4gICAgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJsZWZ0XCI7XHJcbiAgICBzdGF0aWMgc3RhcnRTY2VuZTphbnk9XCJ0ZXN0L1Rlc3RTY2VuZS5zY2VuZVwiO1xyXG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHN0YXQ6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgdmFyIHJlZzogRnVuY3Rpb24gPSBMYXlhLkNsYXNzVXRpbHMucmVnQ2xhc3M7XHJcbiAgICAgICAgcmVnKFwic2NyaXB0L0dhbWVVSS50c1wiLEdhbWVVSSk7XHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5jbGFzcyBNYWluIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxyXG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSkgTGF5YTNELmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQpO1xyXG5cdFx0ZWxzZSBMYXlhLmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQsIExheWFbXCJXZWJHTFwiXSk7XHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBHYW1lQ29uZmlnLnNjYWxlTW9kZTtcclxuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcclxuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cclxuXHRcdExheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2FtZUNvbmZpZy5leHBvcnRTY2VuZVRvSnNvbjtcclxuXHJcblx0XHQvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcclxuXHRcdGlmIChHYW1lQ29uZmlnLmRlYnVnIHx8IExheWEuVXRpbHMuZ2V0UXVlcnlTdHJpbmcoXCJkZWJ1Z1wiKSA9PSBcInRydWVcIikgTGF5YS5lbmFibGVEZWJ1Z1BhbmVsKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcclxuXHRcdExheWEuYWxlcnRHbG9iYWxFcnJvciA9IHRydWU7XHJcblxyXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcclxuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XHJcblx0fVxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxyXG5cdFx0TGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcclxuXHR9XHJcblxyXG5cdG9uQ29uZmlnTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0Ly/liqDovb1JREXmjIflrprnmoTlnLrmma9cclxuXHRcdEdhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcclxuXHR9XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVVSSBleHRlbmRzIHVpLnRlc3QuVGVzdFNjZW5lVUkge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy/mt7vliqAzROWcuuaZr1xyXG4gICAgICAgIHZhciBzY2VuZTogTGF5YS5TY2VuZTNEID0gTGF5YS5zdGFnZS5hZGRDaGlsZChuZXcgTGF5YS5TY2VuZTNEKCkpIGFzIExheWEuU2NlbmUzRDtcclxuXHJcbiAgICAgICAgLy/mt7vliqDnhafnm7jmnLpcclxuICAgICAgICB2YXIgY2FtZXJhOiBMYXlhLkNhbWVyYSA9IChzY2VuZS5hZGRDaGlsZChuZXcgTGF5YS5DYW1lcmEoMCwgMC4xLCAxMDApKSkgYXMgTGF5YS5DYW1lcmE7XHJcbiAgICAgICAgY2FtZXJhLnRyYW5zZm9ybS50cmFuc2xhdGUobmV3IExheWEuVmVjdG9yMygwLCAwLCAzKSk7XHJcbiAgICAgICAgY2FtZXJhLnRyYW5zZm9ybS5yb3RhdGUobmV3IExheWEuVmVjdG9yMygwLCAwLCAwKSwgdHJ1ZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAvL+a3u+WKoOaWueWQkeWFiVxyXG4gICAgICAgIHZhciBkaXJlY3Rpb25MaWdodDogTGF5YS5EaXJlY3Rpb25MaWdodCA9IHNjZW5lLmFkZENoaWxkKG5ldyBMYXlhLkRpcmVjdGlvbkxpZ2h0KCkpIGFzIExheWEuRGlyZWN0aW9uTGlnaHQ7XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuY29sb3IgPSBuZXcgTGF5YS5WZWN0b3IzKDAuNiwgMC42LCAwLjYpO1xyXG4gICAgICAgIGRpcmVjdGlvbkxpZ2h0LnRyYW5zZm9ybS53b3JsZE1hdHJpeC5zZXRGb3J3YXJkKG5ldyBMYXlhLlZlY3RvcjMoMSwgLTEsIDApKTtcclxuXHJcbiAgICAgICAgLy/mt7vliqDoh6rlrprkuYnmqKHlnotcclxuICAgICAgICBsZXQgYm94OiBMYXlhLk1lc2hTcHJpdGUzRCA9IHNjZW5lLmFkZENoaWxkKG5ldyBMYXlhLk1lc2hTcHJpdGUzRChMYXlhLlByaW1pdGl2ZU1lc2guY3JlYXRlQm94KDEsIDEsIDEpKSkgYXMgTGF5YS5NZXNoU3ByaXRlM0Q7XHJcbiAgICAgICAgYm94LnRyYW5zZm9ybS5yb3RhdGUobmV3IExheWEuVmVjdG9yMygwLCA0NSwgMCksIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsOiBMYXlhLkJsaW5uUGhvbmdNYXRlcmlhbCA9IG5ldyBMYXlhLkJsaW5uUGhvbmdNYXRlcmlhbCgpO1xyXG4gICAgICAgIExheWEuVGV4dHVyZTJELmxvYWQoXCJyZXMvbGF5YWJveC5wbmdcIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZShudWxsLCBmdW5jdGlvbiAodGV4OiBMYXlhLlRleHR1cmUyRCkge1xyXG4gICAgICAgICAgICBtYXRlcmlhbC5hbGJlZG9UZXh0dXJlID0gdGV4O1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICBib3gubWVzaFJlbmRlcmVyLm1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcbiAgICAgICAgYm94Lm5hbWUgPSBcInN1cGVyIGJveFwiO1xyXG5cclxuICAgICAgICBsZXQgYm94Q29sbGlkZXI6IExheWEuUGh5c2ljc0NvbGxpZGVyID0gYm94LmFkZENvbXBvbmVudChMYXlhLlBoeXNpY3NDb2xsaWRlcik7XHJcbiAgICAgICAgbGV0IGJveENvbGxpZGVyU2hhcGU6IExheWEuTWVzaENvbGxpZGVyU2hhcGUgPSBuZXcgTGF5YS5NZXNoQ29sbGlkZXJTaGFwZSgpO1xyXG4gICAgICAgIGJveENvbGxpZGVyU2hhcGUubWVzaCA9IGJveC5tZXNoRmlsdGVyLnNoYXJlZE1lc2g7XHJcbiAgICAgICAgYm94Q29sbGlkZXIuY29sbGlkZXJTaGFwZSA9IGJveENvbGxpZGVyU2hhcGU7XHJcblxyXG4gICAgICAgIGxldCBwb2ludDogTGF5YS5WZWN0b3IyID0gbmV3IExheWEuVmVjdG9yMigpO1xyXG4gICAgICAgIGxldCByYXk6IExheWEuUmF5ID0gbmV3IExheWEuUmF5KG5ldyBMYXlhLlZlY3RvcjMoMCwgMCwgMCksIG5ldyBMYXlhLlZlY3RvcjMoMCwgMCwgMCkpO1xyXG5cclxuICAgICAgICBsZXQgaGl0UmVzdWx0OiBMYXlhLkhpdFJlc3VsdCA9IG5ldyBMYXlhLkhpdFJlc3VsdCgpO1xyXG5cclxuICAgICAgICAvLyBsZXQgcGh5c2ljc1NldDogTGF5YS5QaHlzaWNzU2V0dGluZ3MgPSBuZXcgTGF5YS5QaHlzaWNzU2V0dGluZ3MoKTtcclxuICAgICAgICAvLyBsZXQgcGh5c2ljc1NpbTogTGF5YS5QaHlzaWNzU2ltdWxhdGlvbiA9IG5ldyBMYXlhLlBoeXNpY3NTaW11bGF0aW9uKHBoeXNpY3NTZXQpO1xyXG5cclxuICAgICAgICAvLyBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLCB0aGlzLCAoKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIHBvaW50LnggPSBMYXlhLk1vdXNlTWFuYWdlci5pbnN0YW5jZS5tb3VzZVg7XHJcbiAgICAgICAgLy8gICAgIHBvaW50LnkgPSBMYXlhLk1vdXNlTWFuYWdlci5pbnN0YW5jZS5tb3VzZVk7XHJcbiAgICAgICAgLy8gICAgIGNhbWVyYS52aWV3cG9ydFBvaW50VG9SYXkocG9pbnQsIHJheSk7XHJcbiAgICAgICAgLy8gICAgIHBoeXNpY3NTaW0ucmF5Q2FzdChyYXksIGhpdFJlc3VsdCwgMzAsIDEsIDEpO1xyXG4gICAgICAgIC8vICAgICBpZiAoaGl0UmVzdWx0LnN1Y2NlZWRlZCkge1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coaGl0UmVzdWx0LmNvbGxpZGVyLm93bmVyLm5hbWUpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5DTElDSywgdGhpcywgZnVuY3Rpb24gKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhib3gpXHJcblxyXG4gICAgICAgICAgICBsZXQgYnVsbGV0OiBMYXlhLk1lc2hTcHJpdGUzRCA9IHNjZW5lLmFkZENoaWxkKG5ldyBMYXlhLk1lc2hTcHJpdGUzRChMYXlhLlByaW1pdGl2ZU1lc2guY3JlYXRlU3BoZXJlKDAuMDIpKSkgYXMgTGF5YS5NZXNoU3ByaXRlM0Q7XHJcbiAgICAgICAgICAgIGxldCBtYXQ6IExheWEuQmxpbm5QaG9uZ01hdGVyaWFsID0gbmV3IExheWEuQmxpbm5QaG9uZ01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIG1hdC5hbGJlZG9Db2xvciA9IG5ldyBMYXlhLlZlY3RvcjQoMSwgMCwgMCwgMSk7XHJcbiAgICAgICAgICAgIGJ1bGxldC5tZXNoUmVuZGVyZXIubWF0ZXJpYWwgPSBtYXQ7XHJcbiAgICAgICAgICAgIGJ1bGxldC5uYW1lID0gXCJidWxsZXRcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCBidWxsZXRDb2xsaWRlcjogTGF5YS5QaHlzaWNzQ29sbGlkZXIgPSBidWxsZXQuYWRkQ29tcG9uZW50KExheWEuUGh5c2ljc0NvbGxpZGVyKTtcclxuICAgICAgICAgICAgbGV0IGJ1bGxldENvbGxpZGVyU2hhcGU6IExheWEuTWVzaENvbGxpZGVyU2hhcGUgPSBuZXcgTGF5YS5NZXNoQ29sbGlkZXJTaGFwZSgpO1xyXG4gICAgICAgICAgICBidWxsZXRDb2xsaWRlclNoYXBlLm1lc2ggPSBidWxsZXQubWVzaEZpbHRlci5zaGFyZWRNZXNoO1xyXG4gICAgICAgICAgICBidWxsZXRDb2xsaWRlci5jb2xsaWRlclNoYXBlID0gYnVsbGV0Q29sbGlkZXJTaGFwZTtcclxuICAgICAgICAgICAgLy8gYnVsbGV0LmFkZENvbXBvbmVudChMYXlhLlJpZ2lkYm9keTNEKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwb2ludC54ID0gTGF5YS5Nb3VzZU1hbmFnZXIuaW5zdGFuY2UubW91c2VYO1xyXG4gICAgICAgICAgICBwb2ludC55ID0gTGF5YS5Nb3VzZU1hbmFnZXIuaW5zdGFuY2UubW91c2VZO1xyXG4gICAgICAgICAgICBjYW1lcmEudmlld3BvcnRQb2ludFRvUmF5KHBvaW50LCByYXkpO1xyXG5cclxuICAgICAgICAgICAgYnVsbGV0LnRyYW5zZm9ybS5sb2NhbFBvc2l0aW9uID0gcmF5Lm9yaWdpbi5jbG9uZSgpO1xyXG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uOiBMYXlhLlZlY3RvcjMgPSByYXkuZGlyZWN0aW9uLmNsb25lKCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVzdFBvaW50OiBMYXlhLlZlY3RvcjMgPSBuZXcgTGF5YS5WZWN0b3IzKCk7XHJcbiAgICAgICAgICAgIGRlc3RQb2ludC54ID0gcmF5Lm9yaWdpbi54ICsgcmF5LmRpcmVjdGlvbi54ICogMztcclxuICAgICAgICAgICAgZGVzdFBvaW50LnkgPSByYXkub3JpZ2luLnkgKyByYXkuZGlyZWN0aW9uLnkgKiAzO1xyXG4gICAgICAgICAgICBkZXN0UG9pbnQueiA9IHJheS5vcmlnaW4ueiArIHJheS5kaXJlY3Rpb24ueiAqIDM7XHJcblxyXG4gICAgICAgICAgICAvLyBsZXQgZmxhZyA9IHBoeXNpY3NTaW0uc2hhcGVDYXN0KGJ1bGxldENvbGxpZGVyU2hhcGUsIHJheS5vcmlnaW4uY2xvbmUoKSwgZGVzdFBvaW50LmNsb25lKCksIGhpdFJlc3VsdCk7XHJcbiAgICAgICAgICAgIHNjZW5lLnBoeXNpY3NTaW11bGF0aW9uLnJheUNhc3QocmF5LCBoaXRSZXN1bHQsIDMwKTtcclxuICAgICAgICAgICAgaWYgKGhpdFJlc3VsdC5zdWNjZWVkZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGhpdFJlc3VsdC5jb2xsaWRlci5vd25lci5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnVsbGV0LmZyYW1lTG9vcCgxLCBidWxsZXQsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGJ1bGxldC50cmFuc2Zvcm0ubG9jYWxQb3NpdGlvblggKz0gZGlyZWN0aW9uLnggKiAzIC8gNjA7XHJcbiAgICAgICAgICAgICAgICBidWxsZXQudHJhbnNmb3JtLmxvY2FsUG9zaXRpb25ZICs9IGRpcmVjdGlvbi55ICogMyAvIDYwO1xyXG4gICAgICAgICAgICAgICAgYnVsbGV0LnRyYW5zZm9ybS5sb2NhbFBvc2l0aW9uWiArPSBkaXJlY3Rpb24ueiAqIDMgLyA2MDtcclxuICAgICAgICAgICAgICAgIGlmIChidWxsZXQudHJhbnNmb3JtLmxvY2FsUG9zaXRpb25aIDwgLTMpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXQudGltZXIuY2xlYXJBbGwoYnVsbGV0KTtcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXQuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xuaW1wb3J0IFZpZXc9TGF5YS5WaWV3O1xyXG5pbXBvcnQgRGlhbG9nPUxheWEuRGlhbG9nO1xyXG5pbXBvcnQgU2NlbmU9TGF5YS5TY2VuZTtcbnZhciBSRUc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xuZXhwb3J0IG1vZHVsZSB1aS50ZXN0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBUZXN0U2NlbmVVSSBleHRlbmRzIFNjZW5lIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwidGVzdC9UZXN0U2NlbmVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUkVHKFwidWkudGVzdC5UZXN0U2NlbmVVSVwiLFRlc3RTY2VuZVVJKTtcclxufVxyIl19
