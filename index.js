import * as CHANGECHENG from './src/changcheng'

const canvas = document.getElementById('renderCanvas')

const scene = new CHANGECHENG.Scene()
const light = new CHANGECHENG.StandardLight()

const camera = new CHANGECHENG.PerspectiveCamera(20, canvas.width / canvas.height, 0.5, 2000)
camera.position.set(0,0,10)
// camera.rotateY(Math.PI / 9)

const creator = new CHANGECHENG.Creator()

const material = new CHANGECHENG.StandardMaterial()

const circleObject = creator.createTest(material)

circleObject.position.set(5,0,-10)
// circleObject.rotateY(Math.PI / 2)

scene.add(circleObject)
scene.add(light)

const renderer = new CHANGECHENG.Renderer(canvas)


renderer.render(scene, camera)
