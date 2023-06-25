function main() {
	const root = document.querySelector(":root");
	var colCount = Number(getComputedStyle(root).getPropertyValue("--number-of-boxes-horizontal"));
	var rowCount = Math.floor((colCount*window.innerHeight)/window.innerWidth);
	var bgcolor = getComputedStyle(root).getPropertyValue("--bg-color");
	var boxcolor = getComputedStyle(root).getPropertyValue("--box-color");
	var boxSize = (window.innerWidth/colCount);

	const cssGrid = document.createElement("header");
	cssGrid.className = "grid";
	cssGrid.style["grid-template-columns"] = "repeat(" + colCount + ", minmax(" + boxSize + "px, 1fr))";
	cssGrid.style["grid-template-rows"] = "repeat(" + rowCount + ", minmax(" + boxSize + "px, 1fr))";
	document.getElementsByTagName('body')[0].appendChild(cssGrid);

	populateCSSGrid(cssGrid, bgcolor, boxSize, colCount, rowCount);

	randomNums = Array(10);
	for (i = 0; i < 10; i++) {
		randomNums[i] = Math.random();
	}
	var jsGrid = createGrid(colCount, rowCount);
	jsGrid = placeGlider(jsGrid, Math.floor(colCount*randomNums[0]), Math.floor(rowCount*randomNums[1]));
	jsGrid = placeLWSpaceship(jsGrid, Math.floor(colCount*randomNums[2]), Math.floor(rowCount*randomNums[3]));
	jsGrid = placeMWSpaceship(jsGrid, Math.floor(colCount*randomNums[4]), Math.floor(rowCount*randomNums[5]));
	jsGrid = placeAngel(jsGrid, Math.floor(colCount*randomNums[6]), Math.floor(colCount*randomNums[7]));
	jsGrid = placeHershel(jsGrid, Math.floor(colCount*randomNums[8]), Math.floor(rowCount*randomNums[9]));
	var gridItems = document.getElementsByClassName("box");

	// apply js grid to css grid
	for (i = 0; i < gridItems.length; i++) {
		var state = jsGrid[i % colCount][Math.floor(i / colCount)];
		if (state == 0) {
			gridItems[i].style["background-color"] = bgcolor;
			gridItems[i].style["border-radius"] = "0";
		} else {
			gridItems[i].style["background-color"] = boxcolor;
			gridItems[i].style["border-radius"] = "1.5px";
		}
	}

	window.addEventListener("resize", function() {
		rowCount = Math.floor((colCount*window.innerHeight)/window.innerWidth);
		boxSize = (window.innerWidth/colCount);
		cssGrid.style["grid-template-columns"] = "repeat(" + colCount + ", minmax(" + boxSize + "px, 1fr))";
		cssGrid.style["grid-template-rows"] = "repeat(" + rowCount + ", minmax(" + boxSize + "px, 1fr))";
		var items = cssGrid.querySelectorAll("box");
		items.forEach(box => { box.style["width"] = boxSize; box.style["height"] = boxSize} );
		jsGrid.length += colCount - jsGrid.length;
		jsGrid.forEach(col => col.length += rowCount - jsGrid[0].length);
	}, true);

	var newGrid;

	const newFrame = (jsGrid, colCount, rowCount) => () => {
		newGrid = structuredClone(jsGrid);

		// update js grid data structure
		for (var col = 0; col < colCount; col++) {
			for (var row = 0; row < rowCount; row++) {
				var state = newGrid[col][row] = checkNeighbours(jsGrid, col, row);
				var i = row*colCount + col;
				if (state == 0 && jsGrid[col][row] == 1) {
					gridItems[i].style["background-color"] = bgcolor;
					gridItems[i].style["border-radius"] = "0";
				} else if (state == 1 && jsGrid[col][row] == 0) {
					gridItems[i].style["background-color"] = boxcolor;
					gridItems[i].style["border-radius"] = "1.5px";
				}
			}
		}
		jsGrid = newGrid;
	};

	setInterval(newFrame(jsGrid, colCount, rowCount), 100);
}

function populateCSSGrid(cssGrid, bgcolor, boxSize, colCount, rowCount) {
	
	for (i = 0; i < colCount; i++) {
		for (j = 0; j < rowCount; j++) {
			var box = document.createElement("div");
			box.className = "box";
			box.style["width"] = boxSize;
			box.style["height"] = boxSize;
			box.style["background-color"] = bgcolor;
			//box.textContent = (i*rowCount)+j; //+ " (" + ((j+i*rowCount) % colCount) +","+ Math.floor((j+i*rowCount)/colCount)+")";
			cssGrid.appendChild(box);
		}
	}
}


function getCSSGridElementPosition(index) {

	let offset = -1;

	if (isNaN(offset)) {
		offset = 0;
	}
	const colCount = document.querySelectorAll(".box").length;

	const rowPos = Math.floor((index + offset) / colCount);
	const colPos = (index + offset) % colCount;

	return { x: rowPos, y: colPos };
}

function createGrid(x, y) {
	var grid = new Array(x);
	for (var row = 0; row < x; row++) {
		var newRow = new Array(y);
		for (var col = 0; col < y; col++) {
			newRow[col] = 0;
		}
		grid[row] = newRow;
	}

	return grid;
}

function checkNeighbours(grid, col, row) {
	var total = 0;
	for (i = -1; i < 2; i++) {
		for (j = -1; j < 2; j++) {
			total += returnValue(grid, col+i, row+j);
		}
	}
	total -= grid[col][row];

	if (total == 3 || (total == 2 && grid[col][row] == 1)) {
		return 1;
	} else {
		return 0;
	}
}

function returnValue(grid, col, row) {
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

	return grid[col][row];
}

function setValue(grid, col, row, value) {
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

	grid[col][row] = value;
	return grid;
}

function placeGlider(grid, x, y) {
	grid = setValue(grid, x, y+1, 1);
	grid = setValue(grid, x+1, y+2, 1);
	grid = setValue(grid, x+2, y, 1);
	grid = setValue(grid, x+2, y+1, 1);
	grid = setValue(grid, x+2, y+2, 1);

	return grid;
}

function placeLWSpaceship(grid, x, y) {
	grid = setValue(grid, x, y+1, 1);
	grid = setValue(grid, x, y+2, 1);
	grid = setValue(grid, x, y+3, 1);
	grid = setValue(grid, x+1, y, 1);
	grid = setValue(grid, x+1, y+3, 1);
	grid = setValue(grid, x+2, y+3, 1);
	grid = setValue(grid, x+3, y+3, 1);
	grid = setValue(grid, x+4, y, 1);
	grid = setValue(grid, x+4, y+2, 1);

	return grid;
}

function placeMWSpaceship(grid, x, y) {
	grid = setValue(grid, x, y+2, 1);
	grid = setValue(grid, x, y+3, 1);
	grid = setValue(grid, x, y+4, 1);
	grid = setValue(grid, x+1, y+1, 1);
	grid = setValue(grid, x+1, y+4, 1);
	grid = setValue(grid, x+2, y+4, 1);
	grid = setValue(grid, x+3, y, 1);
	grid = setValue(grid, x+3, y+4, 1);
	grid = setValue(grid, x+4, y+4, 1);
	grid = setValue(grid, x+5, y+1, 1);
	grid = setValue(grid, x+5, y+3, 1);

	return grid;
}

function placeAngel(grid, x, y) {
	grid = setValue(grid, x, y+1, 1);
	grid = setValue(grid, x+1, y+1, 1);
	grid = setValue(grid, x+1, y+2, 1);
	grid = setValue(grid, x+2, y, 1);
	grid = setValue(grid, x+2, y+3, 1);
	grid = setValue(grid, x+3, y+1, 1);
	grid = setValue(grid, x+3, y+2, 1);
	grid = setValue(grid, x+4, y+1, 1);

	return grid;
}

function placeHershel(grid, x, y) {
	grid = setValue(grid, x, y, 1);
	grid = setValue(grid, x, y+1, 1);
	grid = setValue(grid, x, y+2, 1);
	grid = setValue(grid, x+1, y+1, 1);
	grid = setValue(grid, x+2, y+1, 1);
	grid = setValue(grid, x+2, y+2, 1);
	grid = setValue(grid, x+2, y+3, 1);

	return grid;
}

main();