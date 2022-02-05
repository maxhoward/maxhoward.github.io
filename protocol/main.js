/** GAME START FUNCTION IS AT THE END OF FILE. */

// Game states
const state = {
    selectedRow: 0,
    selectedColumn: null,
    bufferSlots: [],
    gameStarted: false,
    gameOver: false,
    timer: 60 * 1000,
}

let timerState = {
    startTime: new Date().getTime(),
    lastTime: new Date().getTime(),
}

const simpleHash = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
};

const sequences = ['16xlr', '125o0w', '1gdf', 'xfx8xb', '19fy9', '1guo', '19toq', '1f78k', '1rhu', '1rlb', '1rzk', '1bg5sl'];

function initGame() {
    highlightItems();
    document.querySelectorAll('.item').forEach(elem => {elem.addEventListener('click', selectItem)})
}

function highlightItems() {
    const rowOrColumn = state.selectedRow !== null ? 'row' : 'column';
    const rowOrColumnNumber = state.selectedRow !== null ? state.selectedRow : state.selectedColumn;
    const selectedRow = document.querySelectorAll(`.${rowOrColumn}-${rowOrColumnNumber}`);
    selectedRow.forEach(elem => {
        if (elem.className.includes('inactive')) {
            return;
        }
        elem.classList.add('active');
    });
}

function resetHighlight() {
    const rowOrColumn = state.selectedRow !== null ? 'row' : 'column';
    const rowOrColumnNumber = state.selectedRow !== null ? state.selectedRow : state.selectedColumn;
    const selectedRow = document.querySelectorAll(`.${rowOrColumn}-${rowOrColumnNumber}`);
    selectedRow.forEach(elem => {
        elem.classList.remove('active');
    });
}

function selectItem(e) {
    if (state.gameOver) {
        return;
    }
    if (!e.target.className.includes('active')) {
        return;
    }
    if (e.target.className.includes('inactive')) {
        return;
    } 
    if (!state.gameStarted) {
        startGame();
    }
    if (state.bufferSlots.length < 15) {
        state.bufferSlots.push(e.target.innerText);
        updateBufferSlots();
    }
    if (state.selectedColumn === null) {
        resetHighlight();
        state.selectedRow = null;
        const columnNumber = Array.from(e.target.classList).find(item => item.includes('column')).split('-')[1];
        state.selectedColumn = columnNumber;
        highlightItems();
    } else {
        resetHighlight();
        state.selectedColumn = null;
        const rowNumber = Array.from(e.target.classList).find(item => item.includes('row')).split('-')[1];
        state.selectedRow = rowNumber;
        highlightItems();
    }
    e.target.classList.add('inactive');
    checkSequences();
    if (state.bufferSlots.length === 15) {
        state.gameStarted = false;
        state.gameOver = true;
        resetHighlight();
        return;
    }
}

function updateBufferSlots() {
    state.bufferSlots.forEach((buffer, index) => {
        document.getElementById('buffer-box-' + index).innerText = buffer;
    })
}

function getAllSubstrings(str) {
  var i, j, result = [];

  for (i = 0; i < str.length; i++) {
      for (j = i + 1; j < str.length + 1; j++) {
          result.push(str.slice(i, j));
      }
  }
  return result;
}

function checkSequences() {
    const joinedBuffers = state.bufferSlots.join('');
    getAllSubstrings(joinedBuffers).forEach(substring => {
        var index = sequences.findIndex(sequence => simpleHash(substring).includes(sequence))
        while (index > -1) {
            sequences[index] = "XXXX";
            document.getElementById('sequence-' + index).classList.add('done');
            index = sequences.findIndex(sequence => joinedBuffers.includes(sequence))
        };
    });
}

function startGame() {
    state.gameStarted = true;
    timerState = {
        startTime: new Date().getTime(),
        lastTime: new Date().getTime(),
    }
    requestAnimationFrame(timer);
}

function timer() {
    if (state.gameStarted) {
        const now = new Date().getTime();
        state.timer -= now - timerState.lastTime;
        const displayTimer = (state.timer / 1000).toFixed(2);
        if (state.timer <= 0) {
            state.timer = 0;            
            resetHighlight();
            state.gameOver = true;
            state.gameStarted = false;
        }
        if (state.timer > 0) {
            requestAnimationFrame(timer);
        }
        document.getElementById('breach-timer-value').innerHTML = displayTimer;
        timerState.lastTime = now;
    }
}

// Closure for game start
(function init() {
    initGame();
})();