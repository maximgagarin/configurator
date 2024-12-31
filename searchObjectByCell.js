import { allDrawers } from "./scene";
import { selectVal } from "./controls";
import { doors } from "./scene";
import { cells } from "./cells";

export function searchObjectByCellInfo(saveNumberOfCell){
 
let type

    cells.forEach(item=>{
        if (item.Number == saveNumberOfCell){
            type = item.type
            switch(type){
                case "drawer":
                selectVal.value = 2 
                break
                case "door":
                selectVal.value = 1
               
            }
        }
    })
}
            
