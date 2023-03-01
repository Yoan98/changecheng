import * as CHANGECHENG from './src/changcheng'
import gsap from 'gsap'
import url from './src/textures/earth_atmos_2048.jpg'

const canvas = document.getElementById('renderCanvas')

const scene = new CHANGECHENG.Scene()

const light = new CHANGECHENG.DirectionLight()
light.position.set(10, 13, 10)
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
  map: url,
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
// scene.add(plane)

// const box = creator.createBox({}, boxMaterial)
// scene.add(box)

const circle = creator.createSphere({}, circleMaterial)
scene.add(circle)

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
//   // box.rotateY(rotateObj.props)
//   // circle.rotateY(rotateObj.props)

//   renderer.render(scene, camera)
// })

// plane.rotateY(Math.PI * 1.7)

renderer.render(scene, camera)
