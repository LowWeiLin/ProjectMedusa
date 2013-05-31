
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

function drawBoard (matrix) {

    if(project.activeLayer.hasChildren()) project.activeLayer.removeChildren();

    var positions = drawGrid(70, 70, 10, 70);
    for (var i=0; i<positions.length; i++) {
        for (var j=0; j<positions[0].length; j++) {
            if (!matrix[i][j]) continue;
            var p = positions[i][j];
            var rectangle = new Rectangle(p.x, p.y, 70, 70);
            var cornerSize = new Size(20, 20);
            var path = new Path.RoundRectangle(rectangle, cornerSize);
            path.fillColor = 'black';
        }
    }
    paper.view.draw();
}

function drawGrid (x, y, side, cellSide) {
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