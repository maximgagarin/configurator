export let configurationObject = {
    length:null,
    height:null,
    VerticalPartitionsCount:null,
    HorisontalPartitionsCount:null,
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