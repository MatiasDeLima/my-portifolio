import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.createPerspectiveCamera();
        this.createOrthographicCamera();
        // usado para mover o objeto
        this.setOrbitControls();
    }

    createPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35, 
            this.sizes.aspect,
            0.1,
            1000,
        );
        this.scene.add(this.perspectiveCamera);
        this.perspectiveCamera.position.x = 29;
        this.perspectiveCamera.position.y = 14;
        this.perspectiveCamera.position.z = 12;
    };

    createOrthographicCamera() {
        // camera centra distante eixo z
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum) / 2,
            (this.sizes.aspect * this.sizes.frustrum) / 2,
            this.sizes.frustrum / 2,
            -this.sizes.frustrum / 2,
            // Tamanho da camera
            -50,
            50,
        );
        
        // Posiciona a camera principal
        this.orthographicCamera.position.y = 5.5;
        this.orthographicCamera.position.z = 10;
        this.orthographicCamera.rotation.x = -Math.PI / 6;
        
        //camera lateral //
        // this.orthographicCamera = new THREE.PerspectiveCamera(
        //     35, 
        //     this.sizes.aspect,
        //     0.1,
        //     1000,
        // );
        this.scene.add(this.orthographicCamera);

        // camera Helper
        // this.helper = new THREE.CameraHelper(this.orthographicCamera);
        // this.scene.add(this.helper);

        // Grid Helper
        // const size = 20;
        // const divisions = 20;

        // const gridHelper = new THREE.GridHelper(size, divisions);
        // this.scene.add(gridHelper);

        // Axes Helper
        // const axesHelper = new THREE.AxesHelper(10);
        // this.scene.add(axesHelper);
    };

    setOrbitControls() {
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
    }

    resize() {
        // Update Resize Perspective Camera
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        // Update Resize Orthographic Camera
        this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustrum) / 2;
        this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustrum) / 2;
        this.orthographicCamera.top = this.sizes.frustrum / 2;
        this.orthographicCamera.bottom = -this.sizes.frustrum / 2;
        this.orthographicCamera.updateProjectionMatrix();
    }

    update() {
        // console.log(this.perspectiveCamera.position);
        this.controls.update();


        // camera helper
        // this.helper.matrixWorldNeedsUpdate = true;
        // this.helper.update();
        // this.helper.position.copy(this.orthographicCamera.position);
        // this.helper.rotation.copy(this.orthographicCamera.rotation);
    }
}