import { allDrawers } from "./scene";
import { selectVal } from "./controls";
import { doors } from "./scene";

export function searchObjectByCellInfo(cellInfo){
    const doorKey = `${cellInfo.cellX}-${cellInfo.cellY}`;
    if (allDrawers[doorKey]){
        selectVal.value = 2
        console.log('its drawer')
    }

    if (doors[doorKey]){
        selectVal.value = 1
        console.log('its doors')
    }
}