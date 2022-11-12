import * as THREE from 'three'

const mouse= new THREE.Vector2()
window.addEventListener('mouseenter',(e)=>{
    mouse.x= e.clientX/window.innerWidth *2 -1
    mouse.y= -(e.clientY/window.innerHeight *2) +1
})
const rayCaster = new THREE.Raycaster()
class RayCsting{
    constructor(
        


    )


}