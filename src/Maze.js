class maze{
    constructor(x,y){
        this.width =x;
        this.height =y;
        this.cells,this.maze;
    }

    createCells(){
        //이중 배열
        this.cells = new Array(this.height).fill(new Array(this.width).fill(0))
        this.maze = new Array(2*this.height+1).fill(new Array(2*this.width+1))
        
        cells.map((c)=>{
            c.push(new Array(this.width).fill(0))
        })
        maze =new Array()

    }

    createRoot(){
        //대괄호 없는 거랑 있는 거 차이?
        let randomDirection =[0,1,2,3].sort(()=>Math.random()-0.5)
    
    }

}