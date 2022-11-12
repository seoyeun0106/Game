import * as THREE from 'three'
import CANNON  from 'cannon'
import { Mesh, Scene } from 'three'

//three.js
/*
const sphereGeometry = new THREE.SphereGeometry(5) 
const material = new THREE.MeshStandardMaterial({color:'#725A4C'})
const textureLoader = new THREE.TextureLoader()

material.map = textureLoader.load(TexturesSrc.Rock.baseColorMap)
material.roughnessMap = textureLoader.load(TexturesSrc.Rock.RoughnessMap)
material.displacementMap = textureLoader.load(TexturesSrc.Rock.HeightMap)

//physics
const sphereGeometryPhysics = new CANNON.Sphere(5,4,4)
const defaultMaterial = new CANNON.material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial
,{
        friction:0.1,
        restitution:0.5
})
 */ 
/* function createSphere(){
    //three.js
    const sphere = new Mesh(sphereGeometry,material)
    sphere.geometry.parameters.heightSegments = Math.random() *2.5
    sphere.geometry.parameters.widthSegments = Math.random() *2.5
    sphere.scale.set(Math.random()*5)
    
    //physics

} */

class CreateRock{
    constructor(){
        
    }
    randomNum=1;
    create3D(geometry,material){
        const object = new THREE.Mesh(geometry,material)
        object.geometry.parameters.heightSegments *= Math.floor(Math.random()*7) 
        object.geometry.parameters.widthSegments *= Math.floor(Math.random()*7)
        console.log(object.geometry.parameters.heightSegments,object.geometry.parameters.widthSegments)
        object.position.set(0,0,0)
        return object;    
    }

    createPhysics(geometry,material){
        
        const object = new CANNON.Body({
            mass:1,
            position:new CANNON.Vec3(0,0,0),
            shape: geometry,
            material: material
        })
        object.position.set(0,1,-13)
        return object
    }

}

export default CreateRock 