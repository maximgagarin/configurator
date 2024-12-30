export let configurationObject = {
    length:null,
    height:null,
    VerticalPartitionCount:null,
    HorisontalPartitionCount:null,
    cellsDrawers: [
     
    ],
    cellsDoors: [
        
    ],

    addDrawers:function(){
        this.cellsDrawers.forEach(item => {
            addDrawer( item.cell,  item.numDrawers );
        });
    },
    addDoors:function(){
        this.cellsDoors.forEach(item => {
            addDoor( item.cell );
        });
    }
};