var stage;

var _stagex = 800;
var _stagey = 500;

var gridLayer = new Kinetic.Layer();
var playerLayer = new Kinetic.Layer();

function drawinit() {
    stage = new Kinetic.Stage({
        container: 'container',
        width: _stagex,
        height: _stagey
      });
}


function drawGrid(_nx,_ny,_w,_h){
    //Draw grid
    
    
    gridLayer.destroy();
    gridLayer = new Kinetic.Layer();
    
    var r = {
        x: 1,
        y: 1,
        width: _w,
        height: _h,
        fill: 'white',
        stroke: '0x000000',
        strokeWidth: 2,
    }
    
    // add the shape to the layer
    
    for(var i=0;i<_ny;i++){
        for(var j=0;j<_nx;j++){
            var rect = new Kinetic.Rect(r);
            gridLayer.add(rect);
            r.x+=_w;
        }
        r.x = 1;
        r.y+=_h;
    }
    
    // add the layer to the stage
    stage.add(gridLayer);
}

function drawPlayer(_nx,_ny,_w,_h,_state){
    //Draw player
    playerLayer.destroy();
    playerLayer = new Kinetic.Layer();
    
    var r = {
        x: 1,
        y: 1,
        width: _w-2,
        height: _h-2,
        fill: 'red',
        //stroke: '0x000000',
        //strokeWidth: 0,
        cornerRadius: _w/5
    }
    
    // add the shape to the layer
    for(var i=0 ; i<_state.player_array.length ; i++){
        for(var j=0 ; j<_state.player_array[i].body.length ; j++){
            console.log(1+_nx*_state.player_array[i].body[j][0]+" "+1+_ny*_state.player_array[i].body[j][1]);
            r.x = 1+_w*_state.player_array[i].body[j][0];
            r.y = 1+_h*_state.player_array[i].body[j][1];
            var rect = new Kinetic.Rect(r);
            rect.setFill("hsl("+((360/_state.num_players)*i).toString()+",100%,50%)");
            //rect.setFill("hsl(120,100%,75%)");
            
            //rect.setFill("rgb("+(255-100).toString()+",0,0)");
            playerLayer.add(rect);
        }
    }
    
    /*
    for(var i=0;i<_ny;i++){
        for(var j=0;j<_nx;j++){
            var rect = new Kinetic.Rect(r);
            playerLayer.add(rect);
            r.x+=_w;
        }
        r.x = 1;
        r.y+=_h;
    }*/
    
    // add the layer to the stage
    stage.add(playerLayer);
}

function draw(_state) {
    
    //var _size = _state.board_x;
    
    
    var _size = 10;//<<size of grid./cols,rows
    var _gridSize = (_stagey-2)/_size;
    
    
    //Draw Grid
    drawGrid(_size,_size,_gridSize,_gridSize);
    
    //Draw players
    if(_state!=null)
    drawPlayer(_size,_size,_gridSize,_gridSize,_state);
    
    //_state.player_array
    
    
    //Draw objects
    
}
