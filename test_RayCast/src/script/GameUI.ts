import { ui } from "./../ui/layaMaxUI";

export default class GameUI extends ui.test.TestSceneUI {
    constructor() {
        super();

        //添加3D场景
        var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;

        //添加照相机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0, 3));
        camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);

        //添加方向光
        var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));

        //添加自定义模型
        let box: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1))) as Laya.MeshSprite3D;
        box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex: Laya.Texture2D) {
            material.albedoTexture = tex;
        }));
        box.meshRenderer.material = material;
        box.name = "super box";

        let boxCollider: Laya.PhysicsCollider = box.addComponent(Laya.PhysicsCollider);
        let boxColliderShape: Laya.MeshColliderShape = new Laya.MeshColliderShape();
        boxColliderShape.mesh = box.meshFilter.sharedMesh;
        boxCollider.colliderShape = boxColliderShape;
        boxCollider.canCollideWith = 1;

        let point: Laya.Vector2 = new Laya.Vector2();
        let ray: Laya.Ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));

        let hitResult: Laya.HitResult = new Laya.HitResult();

        let physicsSet: Laya.PhysicsSettings = new Laya.PhysicsSettings();
        let physicsSim: Laya.PhysicsSimulation = new Laya.PhysicsSimulation(physicsSet);

        Laya.timer.frameLoop(1, this, () => {
            point.x = Laya.MouseManager.instance.mouseX;
            point.y = Laya.MouseManager.instance.mouseY;
            camera.viewportPointToRay(point, ray);
            physicsSim.rayCast(ray, hitResult, 100, 1, 1);
            if (hitResult.succeeded) {
                console.log(hitResult.collider.owner.name);
            }
        });

        Laya.stage.on(Laya.Event.CLICK, this, function (): void {
            console.log(box)

            let bullet: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.02))) as Laya.MeshSprite3D;
            let mat: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
            mat.albedoColor = new Laya.Vector4(1, 0, 0, 1);
            bullet.meshRenderer.material = mat;
            bullet.name = "bullet";

            let bulletCollider: Laya.PhysicsCollider = bullet.addComponent(Laya.PhysicsCollider);
            let bulletColliderShape: Laya.MeshColliderShape = new Laya.MeshColliderShape();
            bulletColliderShape.mesh = bullet.meshFilter.sharedMesh;
            bulletCollider.colliderShape = bulletColliderShape;
            // bullet.addComponent(Laya.Rigidbody3D);

            bullet.transform.localPosition = ray.origin.clone();
            let direction: Laya.Vector3 = ray.direction.clone();
            bullet.frameLoop(1, bullet, () => {
                bullet.transform.localPositionX += direction.x * 3 / 60;
                bullet.transform.localPositionY += direction.y * 3 / 60;
                bullet.transform.localPositionZ += direction.z * 3 / 60;
                if (bullet.transform.localPositionZ < -3) {
                    bullet.timer.clearAll(bullet);
                    bullet.destroy();
                }
            });
        });
    }
}