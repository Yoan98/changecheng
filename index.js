import * as CHANGECHENG from './src/changcheng'

const canvas = document.getElementById('renderCanvas')

const scene = new CHANGECHENG.Scene()
const light = new CHANGECHENG.StandardLight()
const camera = new CHANGECHENG.PerspectiveCamera()

const creator = new CHANGECHENG.Creator()

const material = new CHANGECHENG.StandardMaterial()

const circleObject = creator.createSphere({}, material)

scene.add(circleObject)
scene.add(light)

const renderer = new CHANGECHENG.Renderer(canvas)

renderer.render(scene, camera)
