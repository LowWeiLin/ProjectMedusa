
paper.install(window);

$(function () {

    // paper setup

    paper.setup($("#display")[0]);

    // initialize a 10x10 matrix to test drawing

    // var matrix = [];
    // for (var i=0; i<10; i++) {
    //     var row = [];
    //     for (var j=0; j<10; j++) {
    //         row.push(false);
    //     }
    //     matrix.push(row/ }

    // matrix[0][0] = true;
    // matrix[0][1] = true;

    // drawBoard(matrix);
});

var dotsize = 50;

function drawBoard (matrix,num_players) {

    if(project.activeLayer.hasChildren()) project.activeLayer.removeChildren();

    var positions = drawGrid(0, 0, 10, dotsize);
    
    
    for (var i=0; i<positions.length; i++) {
        for (var j=0; j<positions[0].length; j++) {
            if (matrix[i][j] == -1) continue;//empty cell
            
            if(matrix[i][j]>=0){//is a player
                var p = positions[i][j];
                var rectangle = new Rectangle(p.x, p.y, dotsize, dotsize);
                var cornerSize = new Size(20, 20);
                var path = new Path.RoundRectangle(rectangle, cornerSize);
            
                path.fillColor = 'red';
                path.fillColor.hue += matrix[i][j]*(360/num_players);
            }
            
            
        }
    }
    paper.view.draw();
}

function drawGrid (x, y, side, cellSide) {
    
    //Draws Grid
    //side = number of cells per side
    //x,y = top left corner coords of the grid
    //cellSide = width/height of each cell
    for (var i=0; i<=side; i++) {
        var line = new Path.Line(new Point(x, y + i * cellSide), new Point(x + side * cellSide, y + i * cellSide));
        line.strokeColor = 'black';
        line = new Path.Line(new Point(x + i * cellSide, y), new Point(x + i * cellSide, y + side * cellSide));
        line.strokeColor = 'black';
    }

    var cellData = [];
    for (i=0; i<side; i++) {
        var row = [];

        for (var j=0; j<side; j++) {
            row.push(new Point(x + cellSide * j, y + cellSide * i));
        }

        cellData.push(row);
    }

    return cellData;
}