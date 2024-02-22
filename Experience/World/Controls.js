import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.sizes = this.experience.sizes;
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        })

        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        // this.progress = 0;
        // this.dummyCurve = new THREE.Vector3(0, 0, 0);

        // this.lerp = {
        //     current: 0,
        //     target: 0,
        //     ease: 0.1,
        // }

        // this.position = new THREE.Vector3(0, 0, 0);
        // this.lookAtPosition = new THREE.Vector3(0, 0, 0);

        // this.directionalVector = new THREE.Vector3(0, 0, 0);
        // this.staticVector = new THREE.Vector3(0, 1, 0);
        // this.crossVector = new THREE.Vector3(0, 0, 0);

        // this.setPath();
        // this.onWheel();
        this.setSmoothScroll();
        // this.setupASScroll();
        this.setScrollTrigger();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.1,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }


    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }

    // Scroll room animation old
    // setScrollTrigger() {
    //     // console.log(this.room);
    //     this.timeline = new GSAP.timeline();
    //     this.timeline.to(this.room.position, {
    //         x: () => {
    //             return this.sizes.width * 0.0012;
    //         },
    //         scrollTrigger: {
    //             trigger: ".first-move",
    //             markers: true,
    //             start: "top top",
    //             end: "bottom bottom",
    //             scrub: 0.6,
    //             invalidateOnRefresh: true,
    //         }
    //     });
    // }
    setScrollTrigger() {
        // scrolll trigger com media queries
        ScrollTrigger.matchMedia({
            // Desktop
            "(min-width: 969px)": () => {
                console.log("Fired desktop");

                // seta tamanho do rom nessa media query
                this.room.scale.set(0.11, 0.11, 0.11);
                this.rectLight.width = 0.5;
                this.rectLight.height = 0.7;

                // First Section ------------------------------------------//
                this.firstMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        markers: true,
                        invalidateOnRefresh: true,
                    },
                });

                this.firstMoveTimeLine.to(this.room.position, {
                    x: () => {
                        return this.sizes.width * 0.0012;
                    },
                });

                // Second Section ------------------------------------------//
                // tem como fazer com o .to() encadeado
                this.secondMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        markers: true,
                        invalidateOnRefresh: true,
                    },
                })

                    // Position
                    .to(this.room.position, {
                        x: () => {
                            return 1;
                        },
                        z: () => {
                            return this.sizes.height * 0.0032;
                        }
                    }, "same")

                    // Scale
                    .to(this.room.scale, {
                        x: 0.4,
                        y: 0.4,
                        z: 0.4,
                    }, "same")

                    // Reclight aumenta a luz do aquario quando aumenta o quarto
                    .to(
                        this.rectLight, {
                        width: 0.5 * 4,
                        height: 0.7 * 4,
                    },
                        "same"
                    )

                // Third Section ------------------------------------------//
                this.thirdMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        // markers: true,
                        invalidateOnRefresh: true,
                    },
                }).to(this.camera.orthographicCamera.position, {
                    y: 1.5,
                    x: -4.1,
                })
            },

            // Mobile
            "(max-width: 968px)": () => {
                // console.log("Fired mobile");

                // Resets set tamanho para mobile
                this.room.scale.set(0.07, 0.07, 0.07);
                this.room.position.set(0, 0, 0);
                this.rectLight.width = 0.3;
                this.rectLight.height = 0.4;

                // First Section ------------------------------------------//
                this.firstMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        markers: true,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.scale, {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1
                })

                // Second Section ------------------------------------------//
                this.secondMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        markers: true,
                        invalidateOnRefresh: true,
                    },
                }
                ).to(this.room.scale, {
                    x: 0.25,
                    y: 0.25,
                    z: 0.25,
                },
                    "same"
                ).to(this.rectLight, {
                    widthL: 0.3 * 3.4,
                    height: 0.4 * 3.4,
                },
                    "same"
                ).to(this.room.position, {
                    x: 1.5,
                },
                    "same"
                )

                // Third Section ------------------------------------------//
                this.thirdMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        // markers: true,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.position, {
                    z: -4.5,
                })
            },

            all: () => {
                // progress bar scroll animation
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach((section) => {
                    this.progressWrapper = section.querySelector(".progress-wrapper");
                    this.progressBar = section.querySelector(".progress-bar");

                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,

                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                // markers: true,
                                scrub: 0.6,
                            }
                        });

                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,

                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                // markers: true,
                                scrub: 0.6,
                            }
                        });
                    } else {
                        GSAP.to(section, {
                            borderTopRightRadius: 10,

                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                // markers: true,
                                scrub: 0.6,
                            }
                        });

                        GSAP.to(section, {
                            borderBottomRightRadius: 700,

                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                // markers: true,
                                scrub: 0.6,
                            }
                        });
                    }

                    // Progress Bar Scroll Animation
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        }
                    })
                })

                // Cricles scroll animation
                // First Section ------------------------------------------//
                this.firstMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        markers: true,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                })

                // Second Section ------------------------------------------//
                this.secondMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        markers: true,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleSecond.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                },
                    "same"
                ).to(this.room.position, {
                    y: 0.7,
                },
                    "same"
                )

                // Third Section ------------------------------------------//
                this.thirdMoveTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        // markers: true,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                })


                // console.log(this.room.children);
                // min platform animations
                this.secondPartTimeLine = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "center center",
                    },
                })

                // Mini Floor Animation
                this.room.children.forEach((child) => {
                    if (child.name === "Mini_Floor") {
                        this.first = GSAP.to(child.position, {
                            x: -5.44055,
                            z: 13.6135,
                            duration: 0.3,
                        })
                    }
                })

                // Email Box Animation
                this.room.children.forEach((child) => {
                    if (child.name === "Mailbox") {
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                })

                this.room.children.forEach((child) => {
                    if (child.name === "Lamp") {
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                })

                this.room.children.forEach((child) => {
                    if (child.name === "FloorFirst") {
                        this.fourth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                })

                this.room.children.forEach((child) => {
                    if (child.name === "FloorSecond") {
                        this.fifthin = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                })

                this.room.children.forEach((child) => {
                    if (child.name === "FloorThird") {
                        this.sixthird = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                })

                this.room.children.forEach((child) => {
                    if (child.name === "Dirt") {
                        this.seventhird = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                })

                this.room.children.forEach((child) => {
                    if (child.name === "Flower1") {
                        this.eitin = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                })

                this.room.children.forEach((child) => {
                    if (child.name === "Flower2") {
                        this.ninethin = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                })
                // "-=0.2 is a delay animation"
                this.secondPartTimeLine.add(this.first);
                this.secondPartTimeLine.add(this.second);
                this.secondPartTimeLine.add(this.third);
                this.secondPartTimeLine.add(this.fourth, "-=0.2");
                this.secondPartTimeLine.add(this.fifthin, "-=0.2");
                this.secondPartTimeLine.add(this.sixthird, "-=0.2");
                this.secondPartTimeLine.add(this.seventhird, "-=0.2");
                this.secondPartTimeLine.add(this.eitin);
                this.secondPartTimeLine.add(this.ninethin, "-=0.1");

            }

        })
    }

    // responsavel pelo controle do mundo, room , as curvas do objeto
    // essa parte que vai dizer a rota na camera no site de acordo com os scroll
    // setPath() {
    //     this.curve = new THREE.CatmullRomCurve3([
    //         // Left point
    //         new THREE.Vector3(-5, 0, 0), // Point
    //         new THREE.Vector3(0, 0, -5), // Curve

    //         // new THREE.Vector3(0, 0, 0), // Center Curver

    //         // Right point
    //         new THREE.Vector3(5, 0, 0),
    //         new THREE.Vector3(0, 0, 5),
    //     ], 
    //     // Junta as duas linhas em uma so
    //     true
    //     );

    //     // curver setup
    //     const points = this.curve.getPoints(50);
    //     const geometry = new THREE.BufferGeometry().setFromPoints(points);
    //     const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    //     // create the final object to add to the scene
    //     const curveObject = new THREE.Line(geometry, material);
    //     this.scene.add(curveObject);
    // }

    // onWheel() {
    //     // Quando faz escroll com o mause mexe a camera
    //     window.addEventListener("wheel", (e) => {
    //         console.log(e)

    //         if(e.deltaY > 0) {
    //             this.lerp.target += 0.01;
    //             this.back = false;
    //         } else {
    //             this.lerp.target -= 0.01;
    //             this.back = true;
    //         }
    //     })
    // }

    resize() { };

    update() {
        // Animacao da camera se movendo ao rendor do room
        // this.lerp.current = GSAP.utils.interpolate(
        //     this.lerp.current,
        //     this.lerp.target,
        //     this.lerp.ease,
        // );

        // this.curve.getPointAt(this.lerp.current % 1, this.position);
        // this.camera.orthographicCamera.position.copy(this.position);

        // this.directionalVector.subVectors(
        //     this.curve.getPointAt((this.lerp.current % 1) + 0.000001), 
        //     this.position
        // );

        // this.directionalVector.normalize();
        // this.crossVector.crossVectors(
        //     this.directionalVector,
        //     this.staticVector,
        // );

        // this.crossVector.multiplyScalar(100000);
        // this.camera.orthographicCamera.lookAt(0, 0, 0);
    }
}