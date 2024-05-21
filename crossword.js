document.addEventListener('DOMContentLoaded', (event) => {
    const wordList = ['HELLO', 'WORLD', 'FOOD', 'ODE', 'DOG', 'CAT', 'BIRD', 'FISH', 'TREE', 'ROSE', 'FROG', 'BOOK'];

    // Function to generate a random seed based on the current date
    function getDailySeed() {
        const now = new Date();
        return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    }

    // Function to shuffle an array using a seed
    function seededShuffle(array, seed) {
        const random = mulberry32(seed);
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Mulberry32 PRNG
    function mulberry32(seed) {
        return function() {
            seed |= 0; seed = seed + 0x6D2B79F5 | 0;
            let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    // Generate the daily crossword puzzle
    function generateCrossword() {
        const seed = getDailySeed();
        const shuffledWords = seededShuffle(wordList.slice(), seed);

        const grid = [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ];

        // Select random words for the puzzle
        const selectedWords = shuffledWords.slice(0, 4); // Select 4 words for the 5x5 grid

        // Place words in the grid
        const directions = ['across', 'down'];
        selectedWords.forEach((word, index) => {
            const direction = directions[index % 2];
            const startPos = { row: Math.floor(index / 2), col: (index % 2) * 2 };

            for (let i = 0; i < word.length; i++) {
                if (direction === 'across') {
                    grid[startPos.row][startPos.col + i] = word[i];
                } else if (direction === 'down') {
                    grid[startPos.row + i][startPos.col] = word[i];
                }
            }
        });

        return grid;
    }

    function createCrosswordTable(grid) {
        const crosswordTable = document.getElementById('crossword');
        crosswordTable.innerHTML = ''; // Clear any existing table content

        for (let r = 0; r < grid.length; r++) {
            const row = crosswordTable.insertRow();
            for (let c = 0; c < grid[r].length; c++) {
                const cell = row.insertCell();
                if (grid[r][c] !== '') {
                    const input = document.createElement('input');
                    input.setAttribute('maxlength', 1);
                    cell.appendChild(input);
                }
            }
        }
    }

    const grid = generateCrossword();
    createCrosswordTable(grid);

    window.checkSolution = function() {
        const crosswordTable = document.getElementById('crossword');
        const solution = generateCrossword();
        let isCorrect = true;

        for (let r = 0; r < solution.length; r++) {
            for (let c = 0; c < solution[r].length; c++) {
                const cell = crosswordTable.rows[r].cells[c];
                const input = cell.querySelector('input');
                if (input && input.value.toUpperCase() !== solution[r][c]) {
                    isCorrect = false;
                    cell.style.backgroundColor = 'red';
                } else if (input) {
                    cell.style.backgroundColor = 'white';
                }
            }
        }

        if (isCorrect) {
            alert('Congratulations! You solved the crossword puzzle!');
        } else {
            alert('Some answers are incorrect. Try again!');
        }
    };
});