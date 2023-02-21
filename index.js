import * as CHANGECHENG from './src/changcheng'

const canvas = document.getElementById('renderCanvas')

const scene = new CHANGECHENG.Scene()
const light = new CHANGECHENG.StandardLight()

const camera = new CHANGECHENG.PerspectiveCamera(30, 1, 1, 1000)
camera.position.set(0,2,10)
// camera.rotateY(Math.PI / 9)

const creator = new CHANGECHENG.Creator()

const material = new CHANGECHENG.StandardMaterial()

const circleObject = creator.createTest(material)
// const circleObject = creator.createSphere({},material)

// circleObject.position.set(5,0,-10)
// circleObject.rotateY(Math.PI / 6)

scene.add(circleObject)
scene.add(light)

const renderer = new CHANGECHENG.Renderer(canvas)


renderer.render(scene, camera)
