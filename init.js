import { addDrawer } from "./addDrawer";


let configuration = {
    cells:[
    {cellX:0, cellY:0, numDrawers: 3},
    {cellX:1, cellY:1, numDrawers: 2},
    {cellX:0, cellY:2, numDrawers: 3},
    ],
}



configuration.cells.forEach(item =>{
    addDrawer({cellX:item[cellX], cellY:item[cellY], numDrawers:item[numDrawers]})
})
