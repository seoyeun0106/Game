import * as THREE from 'three'

let keyMap = new Array(5).fill(0)
        /* switch(e.key){
            case 'ArrowUp': 
            car.translateZ(0.7)
            break;
            case 'ArrowDown':
            car.translateZ(-0.7) 
            break;
            case 'ArrowLeft':
            car.rotateY(Math.PI *0.05)
            //car.rotation.y += Math.PI *0.05;
            break;
            case 'ArrowRight':
            car.rotateY(-Math.PI *0.05)
            //car.rotation.y -=Math.PI * 0.05;
        }
     
            */

function CarMovement(e,car){
    if(e.key ==='ArrowUp'){keyMap[0]= 1}
    if(e.key ==='ArrowDown'){keyMap[1] =1}
    if(e.key ==='ArrowLeft'){keyMap[2] =1}
    if(e.key ==='ArrowRight'){keyMap[3]=1}
}

function CarStop(e){
    if(e.key ==='ArrowUp'){keyMap[0]= 0}
    if(e.key ==='ArrowDown'){keyMap[1] =0}
    if(e.key ==='ArrowLeft'){keyMap[2] =0}
    if(e.key ==='ArrowRight'){keyMap[3]=0}
}

function CarMove(car,size){
    if(keyMap[0]){
            car.translateZ(0.7)                
    }
    if(keyMap[1]){
        car.translateZ(-0.7)                
    }
    if(keyMap[2]){
        car.rotateY(Math.PI *0.01)
    }
    if(keyMap[3]){
        car.rotateY(-Math.PI *0.01)
    }
}
export {CarMovement,CarStop,CarMove}