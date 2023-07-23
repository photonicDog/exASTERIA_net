class Cell {
	constructor(context, col, row, size) {
		this.context = context;
		this.column = col;
		this.row = row;
		this.size = size;

		this.state = 0;
		this.nextState = 0;
	}

	draw() {
		this.context.beginPath();
		this.context.roundRect(this.column * this.size, this.row * this.size, this.size, this.size, 0);
		this.context.fill();
		this.context.stroke();
	}

	transitionState() {
		this.state = this.nextState;
		this.nextState = 0;
		if (this.state == 1) {
			this.draw();
		}
	}
}

function main() {
	// init variables
	const root = document.querySelector(":root");
	var colCount = Number(getComputedStyle(root).getPropertyValue("--number-of-boxes-horizontal"));
	var rowCount = Math.floor((colCount*window.innerHeight)/window.innerWidth);
	var boxSize = (window.innerWidth/colCount);
	var aliveColour = getComputedStyle(root).getPropertyValue("--alive-colour");
	var deadColour = getComputedStyle(root).getPropertyValue("--dead-colour");
	var canvasOffset = (window.innerHeight - (rowCount*boxSize))/2;


	const bgCanvas = document.createElement("canvas");
	bgCanvas.id = "bg";
	bgCanvas.width = window.innerWidth;
	bgCanvas.height = window.innerHeight - canvasOffset;
	bgCanvas.style["top"] = canvasOffset+"px";
	document.getElementsByTagName('body')[0].appendChild(bgCanvas);
	var bgcxt = bgCanvas.getContext("2d");
	bgcxt.fillStyle = deadColour;
	bgcxt.lineWidth = 0;

	// create HTML5 canvas
	const aliveCanvas = document.createElement("canvas");
	aliveCanvas.id = "bg";
	aliveCanvas.width = window.innerWidth;
	aliveCanvas.height = window.innerHeight - canvasOffset;
	aliveCanvas.style["top"] = canvasOffset+"px";
	document.getElementsByTagName('body')[0].appendChild(aliveCanvas);
	var cxt = aliveCanvas.getContext("2d");
	cxt.fillStyle = aliveColour;
	cxt.lineWidth = 0;
	cxt.filter = "drop-shadow(0px 0px 10px "+ aliveColour+")";


	// create js grid of cell objects
	var jsGrid = new Array(colCount);
	for (var col = 0; col < colCount; col++) {
		jsGrid[col] = new Array(rowCount);
		for (var row = 0; row < rowCount; row++) {
			jsGrid[col][row] = new Cell(cxt, col, row, boxSize);
			bgcxt.beginPath();
			bgcxt.roundRect(col * boxSize, row * boxSize, boxSize, boxSize, 0);
			bgcxt.fill();
			bgcxt.stroke();
		}
	}

	randomNums = Array(10);
	for (i = 0; i < 10; i++) {
		randomNums[i] = Math.random();
	}
	placeGlider(jsGrid, Math.floor(colCount*randomNums[0]), Math.floor(rowCount*randomNums[1]));
	placeLWSpaceship(jsGrid, Math.floor(colCount*randomNums[2]), Math.floor(rowCount*randomNums[3]));
	placeMWSpaceship(jsGrid, Math.floor(colCount*randomNums[4]), Math.floor(rowCount*randomNums[5]));
	placeAngel(jsGrid, Math.floor(colCount*randomNums[6]), Math.floor(colCount*randomNums[7]));
	placeHershel(jsGrid, Math.floor(colCount*randomNums[8]), Math.floor(rowCount*randomNums[9]));
	
	jsGrid.forEach(col => {
		col.forEach(cell => {
			cell.transitionState();
		})
	});

	window.addEventListener("resize", function() {
		var newRowCount = Math.floor((colCount*window.innerHeight)/window.innerWidth);
		boxSize = (window.innerWidth/colCount);
		bgcxt.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
		cxt.clearRect(0, 0, aliveCanvas.width, aliveCanvas.height);
		canvasOffset = (window.innerHeight - (newRowCount*boxSize))/2;
		bgCanvas.width = window.innerWidth;
		bgCanvas.height = window.innerHeight - canvasOffset;
		bgCanvas.style["top"] = canvasOffset+"px";
		aliveCanvas.width = window.innerWidth;
		aliveCanvas.height = window.innerHeight - canvasOffset;
		aliveCanvas.style["top"] = canvasOffset+"px";
		bgcxt = bgCanvas.getContext("2d");
		bgcxt.fillStyle = deadColour;
		bgcxt.lineWidth = 0;
		cxt = aliveCanvas.getContext("2d");
		cxt.fillStyle = aliveColour;
		cxt.lineWidth = 0;
		cxt.filter = "drop-shadow(0px 0px 10px "+ aliveColour+")";
		
		// create js grid of cell objects
		var newGrid = new Array(colCount);
		for (var col = 0; col < colCount; col++) {
			newGrid[col] = new Array(newRowCount);
			for (var row = 0; row < newRowCount; row++) {
				if (row < rowCount) {
					newGrid[col][row] = jsGrid[col][row];
					newGrid[col][row].size = boxSize;
					newGrid[col][row].context = cxt;
				} else {
					newGrid[col][row] = new Cell(cxt, col, row, boxSize);
				}
				bgcxt.beginPath();
				bgcxt.roundRect(col * boxSize, row * boxSize, boxSize, boxSize, 0);
				bgcxt.fill();
				bgcxt.stroke();
			}
		}
		jsGrid = newGrid;
		rowCount = newRowCount;
	}, true);

	setInterval(function() {
		jsGrid.forEach(col => {
			col.forEach(cell => {
				cell.nextState = checkNeighbours(jsGrid, cell);
			})
		});

		cxt.clearRect(0, 0, aliveCanvas.width, aliveCanvas.height);
		
		jsGrid.forEach(col => {
			col.forEach(cell => {
				cell.transitionState();
			})
		});
	}, 100);
}

function checkNeighbours(grid, cell) {
	var col = cell.column;
	var row = cell.row;
	var total = 0;
	for (i = -1; i < 2; i++) {
		for (j = -1; j < 2; j++) {
			total += getCellState(grid, col+i, row+j);
		}
	}
	total -= grid[col][row].state;

	if (total == 3 || (total == 2 && grid[col][row].state == 1)) {
		return 1;
	} else {
		return 0;
	}
}

function getCellState(grid, col, row) {
	if (col < 0) {
		col = grid.length + col;
	}
	if (col > grid.length - 1) {
		col = col % (grid.length);
	}
	
	if (row < 0) {
		row = grid[0].length + row;
	}
	if (row > grid[0].length - 1) {
		row = row % (grid[0].length);
	}

	return grid[col][row].state;
}

function setNextCellState(grid, col, row, value) {
	if (col < 0) {
		col = grid.length + col;
	}
	if (col > grid.length - 1) {
		col = col % (grid.length);
	}
	
	if (row < 0) {
		row = grid[0].length + row;
	}
	if (row > grid[0].length - 1) {
		row = row % (grid[0].length);
	}

	grid[col][row].nextState = value;
}

function placeGlider(grid, x, y) {
	setNextCellState(grid, x, y+1, 1);
	setNextCellState(grid, x+1, y+2, 1);
	setNextCellState(grid, x+2, y, 1);
	setNextCellState(grid, x+2, y+1, 1);
	setNextCellState(grid, x+2, y+2, 1);
}

function placeLWSpaceship(grid, x, y) {
	setNextCellState(grid, x, y+1, 1);
	setNextCellState(grid, x, y+2, 1);
	setNextCellState(grid, x, y+3, 1);
	setNextCellState(grid, x+1, y, 1);
	setNextCellState(grid, x+1, y+3, 1);
	setNextCellState(grid, x+2, y+3, 1);
	setNextCellState(grid, x+3, y+3, 1);
	setNextCellState(grid, x+4, y, 1);
	setNextCellState(grid, x+4, y+2, 1);
}

function placeMWSpaceship(grid, x, y) {
	setNextCellState(grid, x, y+2, 1);
	setNextCellState(grid, x, y+3, 1);
	setNextCellState(grid, x, y+4, 1);
	setNextCellState(grid, x+1, y+1, 1);
	setNextCellState(grid, x+1, y+4, 1);
	setNextCellState(grid, x+2, y+4, 1);
	setNextCellState(grid, x+3, y, 1);
	setNextCellState(grid, x+3, y+4, 1);
	setNextCellState(grid, x+4, y+4, 1);
	setNextCellState(grid, x+5, y+1, 1);
	setNextCellState(grid, x+5, y+3, 1);
}

function placeAngel(grid, x, y) {
	setNextCellState(grid, x, y+1, 1);
	setNextCellState(grid, x+1, y+1, 1);
	setNextCellState(grid, x+1, y+2, 1);
	setNextCellState(grid, x+2, y, 1);
	setNextCellState(grid, x+2, y+3, 1);
	setNextCellState(grid, x+3, y+1, 1);
	setNextCellState(grid, x+3, y+2, 1);
	setNextCellState(grid, x+4, y+1, 1);
}

function placeHershel(grid, x, y) {
	setNextCellState(grid, x, y, 1);
	setNextCellState(grid, x, y+1, 1);
	setNextCellState(grid, x, y+2, 1);
	setNextCellState(grid, x+1, y+1, 1);
	setNextCellState(grid, x+2, y+1, 1);
	setNextCellState(grid, x+2, y+2, 1);
	setNextCellState(grid, x+2, y+3, 1);
}

window.onload = main();