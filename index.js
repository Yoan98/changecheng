import * as CHANGECHENG from "./src/changcheng";
import gsap from "gsap";

const canvas = document.getElementById("renderCanvas");

const scene = new CHANGECHENG.Scene();

const light = new CHANGECHENG.DirectionLight();
light.position.set(10, 10, 10);

const camera = new CHANGECHENG.PerspectiveCamera(
  30,
  canvas.width / canvas.height,
  1,
  200
);
camera.position.set(0, 1, 10);

const creator = new CHANGECHENG.Creator();

const material = new CHANGECHENG.PhoneMaterial({
  envColor: new CHANGECHENG.Color(0.4, 0.4, 0.4),
});

// const circleObject = creator.createTest(material)
const circleObject = creator.createPlane({}, material);

// circleObject.position.set(0,0,0)
scene.add(circleObject);
scene.add(light);

const renderer = new CHANGECHENG.Renderer(canvas);

const rotateObj = { props: 0 };
gsap.to(rotateObj, {
  duration: 5,
  props: Math.PI * 2,
  ease: "none",
  repeat: -1,
  repeatDelay: 0,
  yoyo: false,
  onUpdate: function (a, b, c) {
    // console.log(rotateObj.props)
  },
  onComplete: function (a, b, c) {
    console.log("complete");
  },
});

renderer.renderLoop(() => {
  circleObject.rotateY(rotateObj.props);

  renderer.render(scene, camera);
});

// circleObject.rotateY(Math.PI * 1.7)

// renderer.render(scene, camera)
