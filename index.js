import url from './src/assets/earth_atmos_2048.jpg'
import * as CHANGECHENG from './src/changcheng.js'
import gsap from 'gsap'

const canvas = document.getElementById('renderCanvas')

const textureLoader = new CHANGECHENG.TextureLoader()

const scene = new CHANGECHENG.Scene()

const light = new CHANGECHENG.DirectionLight()
light.position.set(2, 3, 2)
scene.add(light)

const camera = new CHANGECHENG.PerspectiveCamera(
  30,
  canvas.width / canvas.height,
  1,
  1000
)
camera.position.set(0, 1, 8)

const creator = new CHANGECHENG.Creator()

const planeMaterial = new CHANGECHENG.PhoneMaterial({
  envColor: new CHANGECHENG.Color(0, 0, 0),
})

const boxMaterial = new CHANGECHENG.PhoneMaterial({
  envColor: new CHANGECHENG.Color(0, 0, 0),
  color: new CHANGECHENG.Color(1, 0, 0),
})
const circleMaterial = new CHANGECHENG.PhoneMaterial({
  envColor: new CHANGECHENG.Color(0, 0, 0),
  color: new CHANGECHENG.Color(1, 0, 0),
  map: textureLoader.load(url),
})

const plane = creator.createPlane(
  {
    width: 10,
    height: 10,
  },
  planeMaterial
)
plane.position.set(0, -1, 0)
plane.rotateX(-Math.PI / 2)
scene.add(plane)

const box = creator.createBox({}, boxMaterial)
scene.add(box)
// box.position.set(-1, 0, 0)

const circle = creator.createSphere({}, circleMaterial)
// scene.add(circle)
// circle.position.set(2, 3, -1)

const renderer = new CHANGECHENG.Renderer(canvas)

const rotateObj = { props: 0 }
gsap.to(rotateObj, {
  duration: 5,
  props: Math.PI * 2,
  ease: 'none',
  repeat: -1,
  repeatDelay: 0,
  yoyo: false,
  onUpdate: function (a, b, c) {
    // console.log(rotateObj.props)
  },
  onComplete: function (a, b, c) {
    console.log('complete')
  },
})

// renderer.renderLoop(() => {
//   box.rotateY(rotateObj.props)
//   // circle.rotateY(rotateObj.props)

//   renderer.render(scene, camera)
// })

// plane.rotateY(Math.PI * 1.7)

renderer.render(scene, camera)
