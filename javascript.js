(function() {
	var board, turn;
	var counter = ['0', '1', '2']
	var boardElem = document.getElementById('board');
	
	var positions = counter.reduce(function(acc, r) {
	  return acc.concat(counter.map(function(c) { return r + c; }));
	}, []);

	var lines = counter.map(function(r) {
		return counter.map(function(c) {
			return r + c;
		})
	}).concat(['0', '1', '2'].map(function(r) {
		return ['0', '1', '2'].map(function(c) {
			return c + r;
		})
	})).concat([['00', '11', '22'],['20', '11', '02']])

	function emptyCell(coord) {
		board[coord] = '';
		return coord;
	}

	function newBoard(positions) {
		board = new Object();
		positions = positions.map(emptyCell);
	}

	function renderHTML(coord) {
		return '<div id = "' + coord + '">' + board[coord] + '</div>' 
	};

	function renderBoard(b) {
		var boardString = positions.reduce(function(acc, coord) {return acc + renderHTML(coord)},'');
		boardElem.innerHTML = boardString;
	};

	function reset() {
		turn = 'X';
		newBoard(positions);		
		renderBoard(board);
	}

	function makeMove(move){
		board[move] = turn;
		renderBoard(board);
		turn = turn === 'X' ? 'O' : 'X';

		if (gameOver() === true) {
			alert(turn === 'X' ? 'YOU LOSE' : 'YOU WIN');
			reset();
		}
		else if (turn === 'O') {
			computerMove();
		}
	}

	function check(value) {
		return function(c) {
			return board[c] === value
		}
	}

	function checkLines(line) {
		return line.every(check('X')) || line.every(check('O'));
	}

	function gameOver() {
		return lines.some(checkLines);
	}

	function computerMove() {
		//move = win() || block() || firstMove() || setup() || anyMove();
		move = win() || block() || firstMove() || oneAhead() || setup() || anyMove();
		if (move) {
			makeMove(move);	
		}
		else {
			alert('Draw');
			reset();
		}
		testp.innerHTML = oneAhead();
	}

	function anyMove() {
		return positions.find(function(pos) {return board[pos] === ''})
	}

	function firstMove() {
		if (board['11'] === '') {
			return '11';
		}
	}

	function checkWinOpp(line) {
		var lineConfig = checkScenario(line, 'O');
		if (lineConfig[0] === 2 && lineConfig[1] === 1) {
			return true;
		}
	}	

	function checkBlock(line) {
		var lineConfig = checkScenario(line, 'X');
		if (lineConfig[0] === 2 && lineConfig[1] === 1) {
			return true;
		}
		else {
			return false;
		}
	}

	function checkOneAhead(tempBoard) {
		return function(line) {
			var myMoves = line.reduce(function(acc, c){return tempBoard[c] === 'X' ? acc + 1 : acc}, 0);
			var blankMoves = line.reduce(function(acc, c){return tempBoard[c] === '' ? acc + 1 : acc}, 0);	

			if (myMoves === 2 && blankMoves === 1) {
				return true;
			}
			else {
				return false;
			}
		};
	}

	function checkClear(line) {
		var lineConfig = checkScenario(line, 'O');
		if (lineConfig[0] === 1 && lineConfig[1] === 2) {
			return true;
		}
	}

	function checkScenario(line, value) {
		var myMoves = line.reduce(function(acc, c){return board[c] === value ? acc + 1 : acc}, 0);
		var blankMoves = line.reduce(function(acc, c){return board[c] === '' ? acc + 1 : acc}, 0);
		return [myMoves, blankMoves];
	}

	function win(){
		var line = lines.find(checkWinOpp);
		if (line !== undefined) {
			var linesData = line.map(function(c) {return board[c]});
			return line[linesData.indexOf("")]
		}
		else {
			return false
		}
	}

	function block() {
		var line = lines.find(checkBlock);
		if (line !== undefined) {
			var linesData = line.map(function(c) {return board[c]});
			return line[linesData.indexOf("")]
		}
		else {
			return false
		}		
	}

	function setup() {
		var line = lines.find(checkClear);
		if (line !== undefined) {
			var linesData = line.map(function(c) {return board[c]});
			return line[linesData.indexOf("")]
		}
		else {
			return false
		}		
	}

	Array.prototype.getDuplicates = function () {
    var duplicates = {};
    for (var i = 0; i < this.length; i++) {
      if(duplicates.hasOwnProperty(this[i])) {
          duplicates[this[i]].push(i);
      } else if (this.lastIndexOf(this[i]) !== i) {
          duplicates[this[i]] = [i];
      }
    }
    return duplicates;
	};

	function oneAhead() {
		var line = lines.find(checkClear);
		if (line !== undefined) {
			var linesData = line.map(function(c) {return board[c]});
			var blankCells = linesData.getDuplicates();
			var xMove = line[blankCells[''][1]]			
			if (thinkAhead(xMove)) {
				return thinkAhead(xMove);
			}
			else {
				return false
			};
		}
		else {
			return false
		}
	};

	function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    var temp = obj.constructor(); 
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
    return temp;
	}	

	function thinkAhead(xMove) {
		debugger;
		var tempBoard = cloneObject(board);
		tempBoard[xMove] = 'X';
		var winLines = lines.map(checkOneAhead(tempBoard));
		var numWinLines = winLines.reduce(function(acc, value){return value ? acc + 1 : acc}, 0);
		if (numWinLines > 1) {
			return xMove;
		}
		else {
			return false;
		}
	}

	function win(){
		var line = lines.find(checkWinOpp);
		if (line !== undefined) {
			var linesData = line.map(function(c) {return board[c]});
			return line[linesData.indexOf("")]
		}
		else {
			return false
		}
	}

	function handleClick(e) {
		var move = e.target.id;
		if (board[move] === '') {
			makeMove(move);	
		}	
	}

	function listen() {
		boardElem.addEventListener('click', handleClick);
	}
	
	listen();
	reset();
})();
;