
function init() {

  // ! ********** VARIABLES **********
  let tetris = null
  let inPlay = false
  let newGame
  let newGrid
  let nextShapes = []
  let activeShape
  let activeShapeCells = []
  let activeShapeRows = []
  let fallInterval
  let nextActiveShapeCells = []
  let filledCells = []
  let filledRows = []
  let cellClasses = []
  let startButton
  let pauseButton
  let endGameButton
  let playAgainButton

  let animationInterval
  let upAnimationInterval
  let downAnimationInterval

  // * Grid Variables
  let gridRows = []
  let gridCells = []
  let grid = document.querySelector('.grid')
  let allGridRows = document.querySelectorAll('.grid-row')
  let allGridRowsArray

  // Set shape colors
  const colors = ['red', 'grey', 'green', 'orange', 'purple']
  //   Set all 7 shapes and push to shapes array
  const shapes = []
  const square = {
    name: 'square',
    coordinates: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }]
  }
  const line = {
    name: 'line',
    coordinates: [{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
  }
  const sShape = {
    name: 's',
    coordinates: [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
  }
  const zShape = {
    name: 'z',
    coordinates: [{ x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 1 }]
  }
  const lShape = {
    name: 'l',
    coordinates: [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
  }
  const jShape = {
    name: 'j',
    coordinates: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
  }
  const tShape = {
    name: 't',
    coordinates: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]
  }
  shapes.push(square)
  shapes.push(line)
  shapes.push(sShape)
  shapes.push(zShape)
  shapes.push(lShape)
  shapes.push(jShape)
  shapes.push(tShape)



  // ! ********** TETRIS **********
  // * All games -> Saved highscores etc

  class Tetris {
    constructor() {
      this.highscore = localStorage.highscore ? parseInt(localStorage.highscore) : 0
      this.highscoreTime
    }

    load() {
      // Load Game history
      // * Left Wrapper 
      const highscoreWrapper = document.querySelector('.highscore-wrapper')
      highscoreWrapper.innerHTML = ''
      const controlsWrapper = document.querySelector('.controls-wrapper')
      controlsWrapper.innerHTML = ''
      // * Right Wrapper reset
      // Reset next shapes
      const nextShapesWrapper = document.querySelector('.next-shapes-wrapper')
      nextShapesWrapper.innerHTML = '<div id="next-shapes-overlay"><div class="next-shapes"></div></div>'
      const nextShapesOverlay = document.querySelector('#next-shapes-overlay')
      nextShapesOverlay.style.backgroundColor = 'rgba(0,0,0,0.8)'
      const nextShapesContainer = document.querySelector('.next-shapes')
      nextShapesContainer.style.border = '0px'
      nextShapesContainer.innerHTML = ''
      //Reset Scoreboard
      const scoreboardWrapper = document.querySelector('.scoreboard-wrapper')
      scoreboardWrapper.innerHTML = ''
      
      // * Center Wrapper Reset
      // Reset Controls buttons
      const buttonsWrapper = document.querySelector('.buttons-wrapper')
      buttonsWrapper.innerHTML = ''
      // Reset Grid
      const gridTextOverlay = document.querySelector('.grid-text-overlay')
      gridTextOverlay.innerText = ''
      const mainWrapper = document.querySelector('.grid')
      mainWrapper.innerHTML = ''
      mainWrapper.style.border = '0px solid white'
      // Set Loading
      const loadingText = document.createElement('h2')
      loadingText.innerText = 'LOADING'
      loadingText.style.color = 'white'
      const loadingIcon = document.createElement('img')
      loadingIcon.src = './images/loading.gif'
      mainWrapper.appendChild(loadingIcon)
      mainWrapper.appendChild(loadingText)

      setTimeout(() => {
        startButton = document.createElement('button')
        startButton.innerText = 'Start Game'
        startButton.classList.add('controls-btn')
        startButton.id = 'start-btn'
        startButton.addEventListener('click', this.startNewGame)
        buttonsWrapper.appendChild(startButton)

        newGame = new Game('hard')
        newGame.resetGrid()
        newGrid.startGridAnimation()
      }, 3000)
    }

    saveGame() {
      if (newGame.score > this.highscore) {
        this.highscore = newGame.score
        localStorage.setItem('highscore', this.highscore)
      }
    }

    startNewGame() {
      newGrid.stopGridAnimation()
      // Push first 3 shapes to the nextShapes array
      nextShapes.push(new Shape())
      nextShapes.push(new Shape())
      nextShapes.push(new Shape())

      // Create scoreboard
      const scoreboardWrapper = document.querySelector('.scoreboard-wrapper')
      const scoreTitle = document.createElement('h3')
      scoreTitle.innerText = 'Score'
      scoreTitle.id = 'score-title'
      scoreboardWrapper.appendChild(scoreTitle)
      const score = document.createElement('h5')
      score.innerText = newGame.score
      score.id = 'current-score'
      scoreboardWrapper.appendChild(score)
      
      const nextShapesOverlay = document.querySelector('#next-shapes-overlay')
      nextShapesOverlay.style.backgroundColor = 'rgba(0,0,0,0)'
      
      newGrid.drawNextShapes()
      const buttonsWrapper = document.querySelector('.buttons-wrapper')
      buttonsWrapper.innerHTML = ''

      let countdown = 3
      const countdownTimer = document.querySelector('.grid-text-overlay')
      countdownTimer.innerText = countdown
      const countdownInterval = setInterval(() => {
        if (countdown > 1) {
          countdown--
          countdownTimer.innerText = countdown
        } else {
          countdownTimer.innerText = ''
          clearInterval(countdownInterval)
        }
      }, 1000)


      setTimeout(() => {
        newGame.start()
      }, 3000)
      
    }
    
  }
  

  // ! ********** GAME **********
  // * Methods -> start, pause, end, saveGame 
  // * Talks to grid to create

  class Game {
    constructor(difficulty) {
      this.score = 0
      this.difficulty = difficulty
    }

    resetGrid() {
      // Remove any previous grid
      grid.innerHTML = ''
      // Create new grid
      console.log('new game ->', newGame)
      newGrid = new Grid(20, 10, 'white')
      newGrid.createGrid()
      grid = document.querySelector('.grid')   
    }

    start() {
      const buttonsWrapper = document.querySelector('.buttons-wrapper')
      buttonsWrapper.innerHTML = ''
      //Create Pause Button and add underneath the grid
      pauseButton = document.createElement('button')
      pauseButton.innerText = '| |'
      pauseButton.id = 'pause-btn'
      pauseButton.classList.add('controls-btn')
      pauseButton.addEventListener('click', newGame.pause)
      buttonsWrapper.appendChild(pauseButton)
      // Create End Game button and add underneath the grid
      endGameButton = document.createElement('button')
      endGameButton.innerText = 'End Game'
      endGameButton.id = 'end-game-btn'
      endGameButton.classList.add('controls-btn')
      endGameButton.addEventListener('click', this.end)
      buttonsWrapper.appendChild(endGameButton)
      //Add Event listeners to the pause and end game buttons
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      // Play the game
      inPlay = true
      newGrid.play()
    }
    
    pause() {
      if (pauseButton.innerText === '| |' || (pauseButton.innerText === '>' && inPlay === false)) {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
        pauseButton.innerText = '>'
        newGrid.stopActiveInterval()
      } else if (pauseButton.innerText === '>') {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        pauseButton.innerText = '| |'
        newGrid.setActiveInterval()
      }
    }
    
    gameOver() {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      inPlay = false
      let newHighscore = false
      if (this.score > tetris.highscore) {
        newHighscore = true
      }
      tetris.saveGame()
      const buttonsWrapper = document.querySelector('.buttons-wrapper')
      buttonsWrapper.innerHTML = ''
      const nextShapesOverlay = document.querySelector('#next-shapes-overlay')
      nextShapesOverlay.style.backgroundColor = 'rgba(0,0,0,0.8)'
      //Create Play again Button and add under the grid
      playAgainButton = document.createElement('button')
      playAgainButton.innerText = 'Play Again?'
      playAgainButton.id = 'play-again-btn'
      playAgainButton.classList.add('controls-btn')
      playAgainButton.addEventListener('click', this.end)
      buttonsWrapper.appendChild(playAgainButton)

      nextShapes = []
      newGrid.drawNextShapes()

      allGridRows = document.querySelectorAll('.grid-row')
      allGridRows.forEach(row => {
        row.childNodes.forEach(cell => {
          cell.classList.remove('filled')
        })
      })

      const gridTextOverlay = document.querySelector('.grid-text-overlay')
      // Game Over Text on grid
      const gameOverText = document.createElement('h3')
      gameOverText.innerText = 'GAME\nOVER'
      gameOverText.style.fontSize = '50px'
      gameOverText.style.textAlign = 'center'

      const highscoreText = document.createElement('h5')
      highscoreText.innerText = `*** NEW HIGHSCORE ***`
      highscoreText.style.fontSize = '40px'
      highscoreText.style.textAlign = 'center'

      const scoreText = document.createElement('h5')
      scoreText.innerText = `Score: ${newGame.score}`
      scoreText.style.fontSize = '30px'
      scoreText.style.textAlign = 'center'

      gridTextOverlay.appendChild(gameOverText)
      // if (newHighscore === true) {
      //   gridTextOverlay.appendChild(highscoreText)
      // }
      gridTextOverlay.appendChild(scoreText)
    }

    end() {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      inPlay = false
      newGame.pause()
      // Reset Variables
      nextShapes = []
      activeShapeCells = []
      activeShapeRows = []
      fallInterval = null
      nextActiveShapeCells = []
      filledCells = []
      cellClasses = []
      gridRows = []
      gridCells = []

      tetris.load()
    }

  }

  // ! ********** GRID **********
  // * Methods -> createGrid, startGridAnimation, stopGridAnimation, play, drawNextShapes, setActiveInterval, stopActiveInterval, drawShape, removeActiveShape, collide
  // *            checkLine, removeLines, dropLinesAbove
  //   If hits collide (hits.filled class) then stop shape and create new
  //   Grid size will depend on game difficulty
  class Grid {
    constructor(rows = 20, cols = 10, color = 'white') {
      this.rows = rows
      this.cols = cols
      this.cellWidth = newGame.difficulty === 'easy' || newGame.difficulty === 'medium' ? 25 : 35
      this.borderWidth = 4
      this.borderColor = color
      this.gameSpeed = newGame.difficulty === 'easy' ? 2000 : newGame.difficulty === 'medium' ? 1000 : 500
    }

    createGrid() {

      //Set Next shapes grid and title
      const nextShapesWrapper = document.querySelector('.next-shapes-wrapper')
      const nextShapesContainer = document.querySelector('.next-shapes')
      const nextShapesTitle = document.createElement('h3')
      nextShapesTitle.innerText = 'Next Shapes'
      nextShapesTitle.id = 'next-shapes-title'
      nextShapesWrapper.appendChild(nextShapesTitle)
      nextShapesContainer.style.border = `${this.borderWidth}px solid ${this.borderColor}`
      //Set Highscore and title
      const highscoreWrapper = document.querySelector('.highscore-wrapper')
      const highscoreTitle = document.createElement('h3')
      highscoreTitle.innerText = 'Highscore'
      highscoreTitle.id = 'highscore-title'
      highscoreWrapper.appendChild(highscoreTitle)
      const highscore = document.createElement('h5')
      highscore.innerText = tetris.highscore
      highscore.id = 'highscore'
      highscoreWrapper.appendChild(highscore)
      // Set left wrapper controls 
      const controlsWrapper = document.querySelector('.controls-wrapper')
      const controlsTitle = document.createElement('h3')
      controlsTitle.innerText = 'Game Controls'
      controlsTitle.id = 'controls-title'
      controlsWrapper.appendChild(controlsTitle)
      // Create images and title and add to game controls wrapper
      const upArrow = document.createElement('img')
      const downArrow = document.createElement('img')
      const leftArrow = document.createElement('img')
      const rightArrow = document.createElement('img')
      const rotate = document.createElement('h5')
      const accelerate = document.createElement('h5')
      const moveLeft = document.createElement('h5')
      const moveRight = document.createElement('h5')
      rotate.innerText = 'Rotate'
      accelerate.innerText = 'Accelerate'
      moveLeft.innerText = 'Move Left'
      moveRight.innerText = 'Move Right'
      rotate.classList.add('controls-action')
      accelerate.classList.add('controls-action')
      moveLeft.classList.add('controls-action')
      moveRight.classList.add('controls-action')
      upArrow.src = './images/up-arrow.png'
      downArrow.src = './images/down-arrow.png'
      leftArrow.src = './images/left-arrow.png'
      rightArrow.src = './images/right-arrow.png'
      upArrow.classList.add('controls-img')
      downArrow.classList.add('controls-img')
      leftArrow.classList.add('controls-img')
      rightArrow.classList.add('controls-img')
      controlsWrapper.appendChild(upArrow)
      controlsWrapper.appendChild(rotate)
      controlsWrapper.appendChild(downArrow)
      controlsWrapper.appendChild(accelerate)
      controlsWrapper.appendChild(leftArrow)
      controlsWrapper.appendChild(moveLeft)
      controlsWrapper.appendChild(rightArrow)
      controlsWrapper.appendChild(moveRight)

      // Set border colour
      grid.style.border = `${this.borderWidth}px solid ${this.borderColor}`
      // Create x number of rows
      for (let y = 0; y < this.rows; y++) {
        const gridRow = document.createElement('div')
        gridRow.classList.add('grid-row')
        gridRow.classList.add(`grid-row-${y}`)
        gridRow.dataset.row = y
        gridRow.style.width = `${this.cellWidth}px)`
        grid.appendChild(gridRow)
        gridRows.push(gridRow)
      }
      // Create x number of columns per row
      gridRows.forEach(row => {
        for (let x = 0; x < this.cols; x++) {
          const gridCell = document.createElement('div')
          gridCell.classList.add('grid-cell')
          gridCell.classList.add(`grid-cell-${x}`)
          gridCell.dataset.x = x
          gridCell.dataset.y = row.dataset.row
          gridCell.style.width = `${this.cellWidth}px)`
          row.appendChild(gridCell)
          gridCells.push(gridCell)
        }   
      })
      // * Create the next shapes grid
      const nextShapesRows = []
      //Set Next shapes grid and title
      let nextShapesCell

      // Create x number of rows
      for (let y = 0; y < 14; y++) {
        const nextShapesRow = document.createElement('div')
        nextShapesRow.classList.add('next-shapes-row')
        nextShapesRow.classList.add(`next-shapes-${y}`)
        nextShapesRow.dataset.row = y
        nextShapesRow.style.width = `${this.cellWidth}px)`
        nextShapesContainer.appendChild(nextShapesRow)
        nextShapesRows.push(nextShapesRow)
      }
      // Create x number of columns per row
      nextShapesRows.forEach(row => {
        for (let x = 0; x < 6; x++) {
          nextShapesCell = document.createElement('div')
          nextShapesCell.classList.add('next-shapes-cell')
          nextShapesCell.classList.add(`next-shapes-cell-${x}`)
          nextShapesCell.dataset.x = x
          nextShapesCell.dataset.y = row.dataset.row
          nextShapesCell.style.width = `${this.cellWidth}px)`
          row.appendChild(nextShapesCell)
          // gridCells.push(nextShapesCell)
        }   
      })
    }

    // * Grid Animation for before the game begins
    startGridAnimation() {
      allGridRows = document.querySelectorAll('.grid-row')
      allGridRows.forEach(row => {
        row.childNodes.forEach(cell => {
          cell.classList.remove('filled')
        })
      })
      let countRowsAnimated = 0
      // Set interval to decide whether to go up or down
      animationInterval = setInterval(() => {
        const randomColorIndex = Math.floor(Math.random() * colors.length)
        const randomColor = colors[randomColorIndex]
        // const animatedRows = document.querySelectorAll('.animated')
        // Count how many rows are animated
        countRowsAnimated = 0
        allGridRowsArray = []
        allGridRows = document.querySelectorAll('.grid-row')
        allGridRows.forEach(row => {
          if (row.classList.contains('animated')) {
            countRowsAnimated += 1
          }
          allGridRowsArray.push(row)
        })
        // If count rows animated = 0 
        if (countRowsAnimated === 0) {
          upAnimationInterval = setInterval(() => {
            if (allGridRowsArray.length > 0) {
              const nextRowUp = allGridRowsArray[allGridRowsArray.length - 1]
              nextRowUp.classList.add('animated')
              nextRowUp.classList.add(randomColor)
              // nextRowUp.style.backgroundColor = randomColor
              allGridRowsArray.pop()
            } else {
              clearInterval(upAnimationInterval)
            }
          }, 75)
        } else {
          downAnimationInterval = setInterval(() => {
            if (allGridRowsArray.length > 0) {
              const nextRowDown = allGridRowsArray[0]
              nextRowDown.classList.remove('animated')
              nextRowDown.classList.remove('filled')
              colors.forEach(color => nextRowDown.classList.remove(color))
              // nextRowDown.style.backgroundColor = 'transparent'
              allGridRowsArray.shift()
            } else {
              clearInterval(downAnimationInterval)
            }
          }, 75)
        }
      }, 1750)
    }

    stopGridAnimation() {
      clearInterval(animationInterval)
      clearInterval(upAnimationInterval)
      clearInterval(downAnimationInterval)
      allGridRows = document.querySelectorAll('.grid-row')
      allGridRows.forEach(row => {
        row.classList.remove('animated')
      })
    }

    play() {
      if (inPlay) {
        // Set active shape and draw on the grid and add
        //draw next shape and then start a loop for the shape to fall
        activeShape = nextShapes[0]
        nextShapes.push(new Shape())
        nextShapes.shift()
        this.drawNextShapes()
        this.drawShape(0, 0)
        // If able to draw the shape on the grid then continue - if not then game over.
        if (this.drawShape(0, 0)) {
          this.setActiveInterval()
        } else {
          this.stopActiveInterval()
          newGame.gameOver()
        }
      }
    }

    // * Draw the next shapes on the Next shape grid
    drawNextShapes() {
      const nextShapesCells = document.querySelectorAll('.next-shapes-cell')
      const nextShapesCellsArray = []
      const activeShapeCells = []
      nextShapesCells.forEach(cell => {
        nextShapesCellsArray.push(cell)
        cell.classList.remove('filled')
        colors.forEach(color => cell.classList.remove(color))
      })
      // Draw each shape on the next shapes grid
      for (let i = 0; i < nextShapes.length; i++) {
        nextShapes[i].coordinates.forEach(coordinate => {
          const nextShapeCell = nextShapesCellsArray.filter(cell => {
            return parseInt(cell.dataset.x) === (coordinate.x + 3) && parseInt(cell.dataset.y) === (coordinate.y + 1 + (5 * i))
          })
          activeShapeCells.push([nextShapeCell[0], nextShapes[i].color])
        })
      }
      activeShapeCells.forEach(arr => {
        arr[0].classList.add('filled')
        arr[0].classList.add(arr[1])
      })
    }

    setActiveInterval() {
      fallInterval = setInterval(() => {
        // Move shape down 1 on the interval time
        activeShape.move(1, 0)
      }, this.gameSpeed)
    }

    stopActiveInterval() {
      clearInterval(fallInterval)
    }

    drawShape(down, across) {
      // Check if shape is going to hit another shape so we can end the game if it does
      nextActiveShapeCells = []
      activeShape.coordinates.forEach(coord => {
        nextActiveShapeCells.push({ x: (coord.x + activeShape.location.x), y: (coord.y + activeShape.location.y) })
      })
      // Across === 0  captures rotate as well
      if (this.collide() && across === 0) {
        allGridRows = document.querySelectorAll('.grid-row')
        return false
      } else {
        // * Draw next shape that it is waiting onto the grid and remove from nextShapes and then add another shape to the nextShapes array
        // Move shape left or right
        activeShape.location.x = activeShape.location.x + across
        // Drop shape down one
        activeShape.location.y = activeShape.location.y + down
        activeShapeCells = []
        // For each ordinate of the shape, get the cell it should be in - and push to an array for later use
        activeShape.coordinates.forEach(coordinate => {
          const activeCell = gridCells.filter(cell => {
            return parseInt(cell.dataset.x) === (coordinate.x + activeShape.location.x) && parseInt(cell.dataset.y) === (coordinate.y + activeShape.location.y)
          })
          activeShapeCells.push(activeCell[0])
        })
        // Add required classes (to fill the correct cells for the shape)
        activeShapeCells.forEach(cell => {
          cell.classList.add('active')
          cell.classList.add(`${activeShape.color}`)
        })
        return true
      }
    }

    removeActiveShape() {
      //Remove class from current filled cells
      activeShapeCells.forEach(cell => {
        cell.classList.remove('active')
        cell.classList.remove(`${activeShape.color}`)
      })
      //Empty activeShapeCells array
      activeShapeCells = []
    }

    collide() {
      // Get all the filled cells in the grid
      let filledCells = []
      filledCells = gridCells.filter(cell => cell.classList.contains('filled'))
      //return true or false if next shape cells are hitting the floor or another shape
      return nextActiveShapeCells.some(cell => {
        // If next shape x is < that 0 - if next shape x is >= than width - if nxt shape y === height(cols) --- if any of the cells hit a .filled cell
        return parseInt(cell.x) < 0 || parseInt(cell.x) >= this.cols || parseInt(cell.y) === parseInt(this.rows) || filledCells.some(filledCell => {
          return parseInt(filledCell.dataset.x) === parseInt(cell.x) && parseInt(filledCell.dataset.y) === parseInt(cell.y)
        })
      })
    }

    checkLine() {
      activeShapeRows = []
      activeShapeCells.forEach(activeCell => {
        if (!activeShapeRows.includes(activeCell.parentNode)) {
          activeShapeRows.push(activeCell.parentNode)
        } 
      })
      filledRows = []
      activeShapeRows.forEach(activeRow => {
        let rowCellsFilled = 0
      
        activeRow.childNodes.forEach(activeRowCell => {
          if (activeRowCell.classList.contains('filled')) {
            rowCellsFilled += 1
          }
        })
        if (rowCellsFilled === this.cols) {
          filledRows.push(activeRow)
        }
      })
      filledRows.sort((a, b) => {
        if (a.dataset.row > b.dataset.row) {
          return 1
        } else if (b.dataset.row > a.dataset.row) {
          return -1
        } else {
          return 0
        }
      })
      return filledRows
    }

    removeLines(row) {
      row.childNodes.forEach(rowCell => {
        // Remove filled/active and the color class and remove all from filledCells array
        rowCell.classList.remove('filled')
        rowCell.classList.remove('active')
        colors.forEach(color => {
          rowCell.classList.remove(color)
        })
        const indexOfCell = filledCells.indexOf(rowCell)
        if (indexOfCell > -1) {
          filledCells.splice(indexOfCell, 1)
        }
      })
    }

    dropLinesAbove(row) {
      const coordinatesUnderneath = []
      const allGridCells = document.querySelectorAll('.grid-cell')
      const gridCellsArray = []
      allGridCells.forEach(cell => gridCellsArray.push(cell))
      // For each cell above current row - move down 1 place / remove class and add to one below
      gridCellsArray.reverse().forEach(cell => {
        if (parseInt(cell.dataset.y) < parseInt(row.dataset.row)) {
          // Get current cell classes
          cellClasses = []
          cell.classList.forEach(classItem => {
            if (!classItem.includes('grid-cell')) {
              cellClasses.push(classItem)
            }
          })
          // Remove the classes
          if (cellClasses.length > 0) {
            cellClasses.forEach(classItem => {
              cell.classList.remove(classItem)
            })
            coordinatesUnderneath.push({ x: parseInt(cell.dataset.x), y: parseInt(cell.dataset.y) + 1, classes: cellClasses })
          }
        }
      })

      coordinatesUnderneath.forEach(item => {
        gridCellsArray.forEach(cell => {
          if (item.x === parseInt(cell.dataset.x) && item.y === parseInt(cell.dataset.y)) {
            item.classes.forEach(className => {
              cell.classList.add(className)
            })
          }
        })
      })
    }
  }

  // ! ****************** SHAPES ******************
  class Shape {
    constructor() {
      this.randomShapeIndex = Math.floor(Math.random() * shapes.length)
      this.name = shapes[this.randomShapeIndex].name
      this.coordinates = shapes[this.randomShapeIndex].coordinates
      this.centrePoint = { x: 0, y: 0 }
      this.location = newGame.difficulty === 'easy' || newGame.difficulty === 'medium' ? { x: 5, y: 0 } : { x: 5, y: 0 }
      this.randomColorIndex = Math.floor(Math.random() * colors.length)
      this.color = colors[this.randomColorIndex]
    }

    move(down, across) {
      //  Define score element
      const currentScore = document.querySelector('#current-score')
      // Will need conditions to check if hits wall or floor or other shape
      // If wall carry on
      // If floor or other shape then call change class to filled and call play function for next shape
      nextActiveShapeCells = []
      activeShapeCells.forEach(activeCell => {
        nextActiveShapeCells.push({ x: parseInt(activeCell.dataset.x) + parseInt(across), y: parseInt(activeCell.dataset.y) + down })
      })

      if (!newGrid.collide()) {
        // If doesn't collide
        newGrid.removeActiveShape()
        newGrid.drawShape(down, across)
      } else {
        // If collides
        // Find out if shape has filled a line
        // If it was moving down then stop // If it was moving across then continue
        if (down === 1) {
          this.stop()
          newGame.score += 10
          currentScore.innerText = newGame.score

          const rowCount = newGrid.checkLine().length
          if (rowCount > 0) {

            if (rowCount === 1) {
              newGame.score += 100
            } else if (rowCount === 2) {
              newGame.score += 200
            } else if (rowCount === 3) {
              newGame.score += 400
            } else if (rowCount === 4) {
              newGame.score += 800
            }

            currentScore.innerText = newGame.score            
            newGrid.checkLine().forEach(row => {
              console.log(row)
              newGrid.removeLines(row)
              newGrid.dropLinesAbove(row)
            }) 
          }
          newGrid.play()
        }

      }
    }

    rotate() {
      // Get the shape rotation coordinated
      const rotatedShapeCoordinates = []
      activeShape.coordinates.forEach(coordinate => {
        rotatedShapeCoordinates.push({ x: parseInt(coordinate.y), y: 0 - parseInt(coordinate.x) })
      })      
      // Get the shape grid position coordinated
      nextActiveShapeCells = []
      activeShapeCells.forEach(activeCell => {
        nextActiveShapeCells.push({ x: (parseInt(activeCell.dataset.y) + parseInt(activeShape.location.x) - parseInt(activeShape.location.y)), y: (parseInt(activeShape.location.x) + parseInt(activeShape.location.y) - parseInt(activeCell.dataset.x)) })
      })
      const hitLeftWall = nextActiveShapeCells.some(rotatedNextCell => {
        return parseInt(rotatedNextCell.x) < 0
      })
      const hitLeftWallByTwo = nextActiveShapeCells.some(rotatedNextCell => {
        return parseInt(rotatedNextCell.x) < -1
      })
      const hitRightWall = nextActiveShapeCells.some(rotatedNextCell => {
        return parseInt(rotatedNextCell.x) >= this.cols
      })
      const hitRightWallByTwo = nextActiveShapeCells.some(rotatedNextCell => {
        return parseInt(rotatedNextCell.x) > this.cols
      })
      const hitCeiling = nextActiveShapeCells.some(rotatedNextCell => {
        return parseInt(rotatedNextCell.y) < 0
      })
      const hitFloor = nextActiveShapeCells.some(rotatedNextCell => {
        return parseInt(rotatedNextCell.y) >= this.rows
      })
      // If square dont rotate - if hits a wall then ajust accordingly = if collides with another shape or floor then don't rotate
      if (activeShape.name !== 'square') {
        if (hitLeftWall) {
          if (hitLeftWallByTwo) {
            this.coordinates = rotatedShapeCoordinates
            this.move(0, 2)
          } else {
            this.coordinates = rotatedShapeCoordinates
            this.move(0, 1)
          }
        } else if (hitRightWall) {
          if (hitRightWallByTwo) {
            this.coordinates = rotatedShapeCoordinates
            this.move(0, -2)
          } else {
            this.coordinates = rotatedShapeCoordinates
            this.move(0, -1)
          }
        } else if (hitCeiling) {
          this.coordinates = rotatedShapeCoordinates
          this.move(1, 0)
        } else if (hitFloor || newGrid.collide()) {
          this.move(0, 0)
        } else {
          this.coordinates = rotatedShapeCoordinates
          this.move(0, 0)
        }
        
      }
    }

    accelerate() {
      newGrid.stopActiveInterval()
      fallInterval = setInterval(() => {
        // Move shape down 1 on the interval time
        this.move(1, 0)
      }, 50)      
    }

    decelerate() {
      newGrid.stopActiveInterval()
      newGrid.setActiveInterval()
    }

    stop() {
      newGrid.stopActiveInterval()
      activeShapeCells.forEach(cell => {
        cell.classList.remove('active')
        cell.classList.add('filled')
        filledCells.push(cell)
      })
    }
  }

  // ! ****************** STARTING GAME AND CALLING FUNCTIONS ******************
  function handleKeyDown(event) {
    const key = event.keyCode
    if (key === 39 ) { 
      activeShape.move(0, 1)
    } else if (key === 37) {
      activeShape.move(0, -1)
    } else if (key === 38) {
      activeShape.rotate()
    } else if (key === 40) {
      activeShape.accelerate()
    }
  }

  function handleKeyUp(event) {
    const key = event.keyCode
    if (key === 40) {
      activeShape.decelerate()
    }
  }

  tetris = new Tetris()
  tetris.load()

}
window.addEventListener('DOMContentLoaded', init)


