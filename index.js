import * as CHANGECHENG from './src/changcheng'
import gsap from 'gsap'

const canvas = document.getElementById('renderCanvas')

const scene = new CHANGECHENG.Scene()

const light = new CHANGECHENG.StandardLight()
light.position.set(10, 10, 0)

const camera = new CHANGECHENG.PerspectiveCamera(
  30,
  canvas.width / canvas.height,
  1,
  100
)
camera.position.set(0, 2, 10)

const creator = new CHANGECHENG.Creator()

const material = new CHANGECHENG.StandardMaterial()

const circleObject = creator.createTest(material)
// const circleObject = creator.createSphere({},material)

// circleObject.position.set(0,0,0)

scene.add(circleObject)
scene.add(light)

const renderer = new CHANGECHENG.Renderer(canvas)

const rotateObj = { props: 0 }
gsap.to(rotateObj, {
  duration: 10,
  props: Math.PI * 2,
  ease: 'none',
  repeat: 0,
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
//   circleObject.rotateY(rotateObj.props)

// })
renderer.render(scene, camera)
