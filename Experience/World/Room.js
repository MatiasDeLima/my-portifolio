import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};
        // console.log(this.room);
        // console.log(this.actualRoom);

        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        // const cube = new THREE.Mesh(geometry, material);
        // this.scene.add(cube);

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.onMouseMove();
    }

    setModel() {
        // pesonalize o room shadow etc.
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Group) {
                child.children.forEach((groupChild) => {
                    groupChild.castShadow = true;
                    groupChild.receiveShadow = true;
                })
            }

            // console.log(child);

            // Aquario efeitos
            // adiciona o child e da console para ver o children
            // if(child.childre === Aquarium) console.log(child)
            if (child.name === "Aquarium") {
                // console.log(child);
                // glass efect
                child.children[0].material = new THREE.MeshPhysicalMaterial();
                child.children[0].material.roughness = 0;
                child.children[0].material.color.set(0x549dd2);
                child.children[0].material.ior = 3;
                child.children[0].material.transmission = 1;
                child.children[0].material.opacity = 1;
            }

            if (child.name === "Computer") {
                // seleciona o filho do child na posicao 1 do array
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
                // console.log(child.material);
            }

            // Mini Floor
            if (child.name === "Mini_Floor") {
                child.position.x = -0.289521;
                child.position.z = 8.83572;
            }

            // Mail Box 
            // Valor default antes da animacao
            // if (
            //     child.name === "Mailbox" ||
            //     child.name === "Lamp" ||
            //     child.name === "FloorFirst" ||
            //     child.name === "FloorSecond" ||
            //     child.name === "FloorThird" ||
            //     child.name === "Dirt" ||
            //     child.name === "Flower1" ||
            //     child.name === "Flower2"
            // ) {
            //     child.scale.set(0, 0, 0);
            // }

            child.scale.set(0, 0, 0);
            if(child.name === "Cube") {
                child.scale.set(1, 1, 1);
                child.position.set(0, -1.5, 0);
                child.rotation.y = Math.PI / 4;
            }

            this.roomChildren[child.name] = child;
        });

        // theme dark Lamp light
        const width = 0.5;
        const height = 0.7;
        const intensity = 1;
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        );
        // posicao da luz do aquario
        rectLight.position.set(7.68244, 7, 0.5);
        rectLight.rotation.x = -Math.PI / 2;
        rectLight.rotation.z = Math.PI / 4;
        this.actualRoom.add(rectLight);

        // this.roomChildren['rectLight'] = child;
        this.roomChildren['rectLight'] = this.child;

        const rectLightHelper = new RectAreaLightHelper(rectLight);
        // rectLight.add(rectLightHelper);

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.11, 0.11, 0.11);
    };

    // move room for mouse hover
    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            // console.log(e);
            this.rotation = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            // console.log(this.rotation);

            // controla a velcidade da rotacao do room
            this.lerp.target = this.rotation * 0.1;

        });
    }

    resize() { };

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease,
        );

        // rotate hover
        this.actualRoom.rotation.y = this.lerp.current;
    }
}