import './style.css'
import * as THREE from 'three'
import { Camera, CameraHelper, DoubleSide, Material, Matrix3 } from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {CarMovement,CarStop,CarMove} from './CarMovement.js'
import CANNON, { Quaternion } from 'cannon'
import CreateRock from './Rock.js'
let start = false
let move = false
import TexturesSrc from './TexturesSrc.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#83B9F5')


//Objects - terrain
const segmentsX =40
const segmentsZ =40
const planeGeo = new THREE.PlaneGeometry(200,200,segmentsX,segmentsZ)
//const material = new THREE.MeshStandardMaterial()

const material = new THREE.MeshStandardMaterial()
material.color.set('#FAAD81')
material.side = DoubleSide

const terrain = new THREE.Mesh(planeGeo, material)

terrain.rotation.x = Math.PI *0.5
terrain.position.y =-1


/**
 * TextureLoader
 */

const textureLoader = new THREE.TextureLoader()

//const matcapTexture = textureLoader.load('/texture/matcaps/01.png')
//const gradientTexture = textureLoader.load('/texture/gradients/5.jpg')


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 600)
camera.rotation.x =Math.PI * 0.02
camera.position.y =3.5
scene.add(camera)

/**
 * Updating Terrain Hills
 */
let terrainYArray=[]

for(let i=0;i<segmentsZ+1;i++){
    for(let j=0;j<segmentsX+1;j++){
        const index = 3 * (i * (segmentsX+1) + j);
        terrain.geometry.attributes.position.array[index+2]=Math.random()*5
        terrainYArray.push(terrain.geometry.attributes.position.array[index+2])
    }
}
scene.add(terrain)


/**
 * Physics World
 */
 const world = new CANNON.World()
 world.gravity.set(0,-9.92,0)
 
 let objectsToUpdate=[]
 
 //THREE.JS
 const boxGeo = new THREE.BoxGeometry(4.8,2,10)
 const boxMaterial = new THREE.MeshStandardMaterial()
 const boxMesh = new THREE.Mesh(
     boxGeo,boxMaterial
 )
 boxMesh.position.set(0,0,0)
 
 //PHYSICS

 const floorShape = new CANNON.Plane()
 const floor = new CANNON.Body({
    mass: 0,
    position:new CANNON.Vec3(0,0,0),
    shape: floorShape,
 })
 floor.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI /2
)
console.log(floor.position.y,"입ㄴ디ㅏ")
world.addBody(floor)

 const boxShape= new CANNON.Box(new CANNON.Vec3(4.8/2,1,5));
 const defaultMaterial = new CANNON.Material('default')
 const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,defaultMaterial,
    {
        friction: 2,
        restitution: 0
 })
 world.addContactMaterial(defaultContactMaterial)
 const boxBody = new CANNON.Body({
     mass:1,
     position:new CANNON.Vec3(0,0,0),
     shape: boxShape,
     material: defaultMaterial
 })
 boxBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0,1,0),
    Math.PI 
)
 boxBody.position.copy({x:0,y:0,z:0})
 world.addBody(boxBody)
 let colliding =false
 let collideClock;
 boxBody.addEventListener("collide",()=>{
    collideClock = new THREE.Clock()
    colliding = true
    console.log("collided")
 }) 

/**
 * Rock 3D
 */ 

const updateObjects =[];
const rock = new CreateRock()
rock.randomNum =Math.floor(Math.random()*10)

const rockGeo = new THREE.SphereGeometry(rock.randomNum,4,4)
const rockMaterial = new THREE.MeshStandardMaterial()
rockMaterial.map = textureLoader.load(TexturesSrc.Rock.BaseColorMap)
rockMaterial.roughnessMap = textureLoader.load(TexturesSrc.Rock.RoughnessMap)
rockMaterial.displacementMap = textureLoader.load(TexturesSrc.Rock.HeightMap)


/**
 * Rock Physics
 */

const sphereGeometryPhysics = new CANNON.Sphere(rock.randomNum)
const rockPhysics=rock.createPhysics(sphereGeometryPhysics,defaultMaterial)



/**
 * model
 */
let car = new THREE.Object3D();
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/asset/classic_Car/scene.gltf',
    (gltf) =>
    {   
        gltf.scene.rotation.y =Math.PI *1
        objectsToUpdate.unshift({mesh:gltf.scene,body:boxBody})
        gltf.scene.castShadow = true
        gltf.scene.scale.set(0.2,0.2,0.2)
        
        window.addEventListener('keydown',(e)=>{if(move){CarMovement(e,gltf.scene)}})
        window.addEventListener('keyup',(e)=>{if(move){CarStop(e)}})
        //jump
        window.addEventListener('keydown',(e)=>{
        if(e.key==' '){
        gltf.scene.applyQuaternion(
            gltf.scene.quaternion
        )}})

        car= gltf.scene
        car.name = 'car'
        
        gltf.scene.position.set(0,0,98) 
        scene.add(gltf.scene)
       
        
        camera.position.x=gltf.scene.position.x
        camera.position.y =gltf.scene.position.y+4
        camera.position.z =-10
        camera.rotation.y = Math.PI

        gltf.scene.add(camera)
        
        }
)

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster()
const mouse= new THREE.Vector2()
window.addEventListener('mousemove',(e)=>{
    mouse.x= e.clientX/window.innerWidth *2 -1
    mouse.y= -(e.clientY/window.innerHeight *2) +1
})


/**
 * Debugger
 */
 const gui = new GUI()
 /* gui
     .add(material,'wireframe')
     .name('wire')
 gui
     .add(material,'side')
 gui.add(material.normalScale,'x').min(1).max(8).step(0.1)
 gui.add(material.normalScale,'y').min(1).max(8).step(0.1)
 gui.add(ambientLight,'intensity').min(0.1).max(3).step(0.0001).name('ambientLight-Internsity')
 gui.add(pointLight,'intensity').min(0.1).max(3).step(0.0001).name('PointLight-Internsity')
 gui.add(camera.rotation,'x').min(-Math.PI).max(Math.PI).step(0.1)
 gui.add(terrain.position,'z').min(-10).max(10).step(1).name("terrainPositionZ")
 gui.add(terrain.position,'x').min(-10).max(10).step(1).name("terrainPositionX")
 gui.add(terrain.position,'y').min(-10).max(10).step(1).name("terrainPositionY")
 gui.add(terrain,'visible')
  *//* gui.add(material, 'metalness').min(0).max(1).step(0.0001)
 gui.add(material, 'roughness').min(0).max(1).step(0.0001)
  */
 /* gui.add(pointLight.position,'z').min(-100).max(100).step(1)
 gui.add(pointLight.position,'y').min(-100).max(100).step(1)
 gui.add(pointLight,'castShadow').name('pointLightShadow')
 gui.add(rockMaterial,'wireframe')
 gui.add(rockMaterial,'roughness')
 gui.add(rockMaterial,'metalness')
 
  */
/**
 * Font
 */
const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json',
    (font)=>{
        const textGeometry = new TextGeometry(
            'START',
            {
                font: font ,
                size : 3,
                height: 1,
                curveSegments: 5,
                bevelEnabled:true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset:0,
                bevelSegments:4
            }
        )
        const textMaterial = new THREE.MeshNormalMaterial()
        const text = new THREE.Mesh(textGeometry,textMaterial)
        textGeometry.center()
        text.position.set(0,2,93)
        text.castShadow = true
        console.log(text.position,car.position)
        textGeometry.computeBoundingBox()
        window.addEventListener('click',()=>{
            const intersects = raycaster.intersectObjects([text])
            console.log(intersects,"음?")

            if(intersects.length){
                text.visible = false
                start = true
            }
        })
        scene.add(text)
    }
)


//light

const ambientLight = new THREE.AmbientLight(0xffffff,0.8)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,1)
pointLight.position.x =0
pointLight.position.z =-100
pointLight.position.y =24
pointLight.castShadow = true
pointLight.shadow.mapSize.width =1024 
pointLight.shadow.mapSize.height=1024 
scene.add(pointLight)
 


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()


    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

//Inside the terrain
const terrainSize={
    width: terrain.geometry.parameters.width,
    height: terrain.geometry.parameters.height
}
// Animate
const clock = new THREE.Clock()
let oldElaspedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime- oldElaspedTime
    oldElaspedTime = elapsedTime
    world.step(1/60,deltaTime,3)

    const playAble =true
    
    
    //Car Movement
    CarMove(scene.getObjectByName(car.name),terrainSize)
    
    
    // Update controls
    //controls.update()

    //raycasting 
    raycaster.setFromCamera(mouse,camera)
    
    if(start===true){
        camera.rotation.x = Math.PI *elapsedTime *0.02
    }
    
    if(camera.rotation.x >=Math.PI *0.06){
            start = false
            move = true
            boxBody.mass=1;
            world.addBody(boxBody)
            objectsToUpdate[0].body = boxBody
     }
    if(colliding){
        if(scene.getObjectByName(car.name).position.y <1&&collideClock.getElapsedTime()>0.5){
        colliding = false
        }
    }
    
    if(colliding){
    for(const object of objectsToUpdate){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
        //object.body.position.copy(object.mesh.position)
        //object.body.quaternion.copy(object.mesh.quaternion)
    }
    }else{
        for(const object of objectsToUpdate){
            //object.mesh.position.copy(object.body.position)
            //object.mesh.quaternion.copy(object.body.quaternion)
            object.body.position.copy(object.mesh.position)
            object.body.quaternion.copy(object.mesh.quaternion)
        }    
    }
    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)
    
    //throw rock randomly
    if(move){
    if(Math.random()*10>9.3){
        rock.randomNum =Math.random()*30
        const rock3D = rock.create3D(rockGeo,rockMaterial)
        scene.add(rock3D)
        const rockPhysics=rock.createPhysics(sphereGeometryPhysics,defaultMaterial)
        rockPhysics.position.set(Math.random()*200-100,Math.random()*50,Math.random()*200-100)
        world.addBody(rockPhysics)
        updateObjects.push({mesh:rock3D,body:rockPhysics})
    }

    }
    updateObjects.map((object)=>{
        object.mesh.position.copy(object.body.position)
    })
    // Render
    renderer.render(scene, camera)
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()