import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import GUI from "lil-gui";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // modal para ajustar a cor do thema dark
        // this.gui = new GUI({ container: document.querySelector('.hero-main')});
        this.object = {
            colorObj: { r: 0, g: 0, b: 0},
            intensity: 3,
        }

        this.setSunlight();
        // this.setGUI();
    }

    // modal para ajustar a cor do thema dark
    setGUI() {
        this.gui.addColor(this.object, "colorObj").onChange(() => {
            this.sunlight.color.copy(this.object.colorObj);
            this.ambientLight.color.copy(this.object.colorObj);
        });
        this.gui.add(this.object, "intensity", 0, 10).onChange(() => {
            this.sunlight.intensity = this.object.intensity;
            this.sunlight.ambientLight = this.object.intensity;
        })
    }

    setSunlight() {
        // add room Lights and scene shadow and light
        this.sunlight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.camera.far = 20;
        this.sunlight.shadow.mapSize.set(2048, 2048);
        this.sunlight.shadow.normalBias = 0.05;
        this.sunlight.position.set(1.5, 7, 3);
        this.scene.add(this.sunlight);

        // Ambient light
        this.ambientLight = new THREE.AmbientLight("#ffffff", 1)
        this.scene.add(this.ambientLight);
    }

    // Theme System color and Lights
    switchTheme(theme) {
        // console.log(this.sunlight);
        if(theme === "dark") {
            GSAP.to(this.sunlight.color, {
                r: 0.17254901960784313,
                g: 0.23137254901960785,
                b: 0.6862745098039216,
            });

            GSAP.to(this.ambientLight.color, {
                r: 0.17254901960784313,
                g: 0.23137254901960785,
                b: 0.6862745098039216,
            });

            GSAP.to(this.sunlight, {
                intensity: 0.78,
            })

            GSAP.to(this.ambientLight, {
                intensity: 0.78,
            })
        } else {
            GSAP.to(this.sunlight.color, {
                r: 255 / 255,
                g: 255 / 255,
                b: 255 / 255,
            });

            GSAP.to(this.ambientLight.color, {
                r: 255 / 255,
                g: 255 / 255,
                b: 255 / 255,
            });

            GSAP.to(this.sunlight, {
                intensity: 1,
            })

            GSAP.to(this.ambientLight, {
                intensity: 1,
            })
        }
    }

    resize() {};

    update() {}
}