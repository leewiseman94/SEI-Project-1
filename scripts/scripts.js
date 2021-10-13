
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
  let cellClasses = []
  let startButton
  let pauseButton
  let endGameButton

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
      this.gameHistory = []
    }

    load() {
      const nextShapesContainer = document.querySelector('.next-shapes')
      nextShapesContainer.style.border = '0px'
      nextShapesContainer.innerHTML = ''
      const controlsWrapper = document.querySelector('.controls-wrapper')
      controlsWrapper.innerHTML = ''
      const mainWrapper = document.querySelector('.grid')
      mainWrapper.innerHTML = ''
      mainWrapper.style.border = '0px solid white'
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
        controlsWrapper.appendChild(startButton)

        newGame = new Game('hard')
        newGame.resetGrid()
        newGrid.startGridAnimation()
      }, 3000)
    }

    saveGame() {
      this.gameHistory.push(newGame)
      console.log(this.gameHistory)
    }

    startNewGame() {
      newGame.start()
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

      newGrid.stopGridAnimation()
      // Push first 3 shapes to the nextShapes array
      nextShapes.push(new Shape())
      nextShapes.push(new Shape())
      nextShapes.push(new Shape())
     
      //Create Pause Button and add under the grid
      const controlsWrapper = document.querySelector('.controls-wrapper')
      controlsWrapper.innerHTML = ''

      pauseButton = document.createElement('button')
      pauseButton.innerText = '| |'
      pauseButton.id = 'pause-btn'
      pauseButton.classList.add('controls-btn')
      pauseButton.addEventListener('click', newGrid.pause)
      controlsWrapper.appendChild(pauseButton)

      endGameButton = document.createElement('button')
      endGameButton.innerText = 'End Game'
      endGameButton.id = 'end-game-btn'
      endGameButton.classList.add('controls-btn')
      endGameButton.addEventListener('click', this.end)
      controlsWrapper.appendChild(endGameButton)

      inPlay = true
      newGrid.play()

    }    

    end() {
      inPlay = false
      newGrid.pause()
      clearInterval(fallInterval)
      tetris.saveGame()
      
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
      console.log('End')
    }

  }

  // ! ********** GRID **********
  // * Methods -> createNewGrid, drawNextShape, moveActiveShape, collide
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

      const nextShapesRows = []
      let nextShapesCell
      const nextShapesWrapper = document.querySelector('.next-shapes-wrapper')
      const nextShapesContainer = document.querySelector('.next-shapes')
      // Set border colour
      const nextShapesTitle = document.createElement('h3')
      nextShapesTitle.innerHTML = 'Next Shapes'
      nextShapesTitle.id = 'next-shapes-title'
      nextShapesWrapper.appendChild(nextShapesTitle)
      nextShapesContainer.style.border = `${this.borderWidth}px solid ${this.borderColor}`

      // Create x number of rows
      for (let y = 0; y < 18; y++) {
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

    // ! Grid Animation
    startGridAnimation() {
      console.log('interval')
      
      let countRowsAnimated = 0
      // allGridRowsArray.for
      // Set interval to decide whether to go up or down
      animationInterval = setInterval(() => {
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
        // newGame = new Game('hard')

        // Set active shape and draw on the grid and add
        //draw next shape and then start a loop for the shape to fall
        activeShape = nextShapes[0]
        nextShapes.push(new Shape())
        nextShapes.shift()
        this.drawShape(0, 0)

        this.setActiveInterval()
      }
    }

    setActiveInterval() {
      fallInterval = setInterval(() => {
        // Move shape down 1 on the interval time
        this.moveShape(1, 0, 'active')
      }, this.gameSpeed)
    }

    pause() {
      if (pauseButton.innerText === '| |' || (pauseButton.innerText === '>' && inPlay === false)) {
        pauseButton.innerText = '>'
        clearInterval(fallInterval)
      } else if (pauseButton.innerText === '>') {
        pauseButton.innerText = '| |'
        newGrid.setActiveInterval()
      }
    }

    drawShape(down, across) {
      // Check if shape is going to hit another shape so we can end the game if it does
      nextActiveShapeCells = []
      activeShape.coordinates.forEach(coord => {
        nextActiveShapeCells.push({ x: (coord.x + activeShape.location.x), y: (coord.y + activeShape.location.y) })
      })
      

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
    }

    removeShape() {
      //Remove class from current filled cells
      activeShapeCells.forEach(cell => {
        cell.classList.remove('active')
        cell.classList.remove(`${activeShape.color}`)
      })
      //Empty activeShapeCells array
      activeShapeCells = []
    }

    moveShape(down, across) {
      // Will need conditions to check if hits wall or floor or other shape
      // If wall carry on
      // If floor or other shape then call change class to filled and call play function for next shape
      nextActiveShapeCells = []
      activeShapeCells.forEach(activeCell => {
        nextActiveShapeCells.push({ x: parseInt(activeCell.dataset.x) + parseInt(across), y: parseInt(activeCell.dataset.y) + down })
      })

      if (!this.collide()) {
        // If doesn't collide
        this.removeShape()
        this.drawShape(down, across)
      } else {
        // If collides
        // Find out if shape has filled a line
        // If it was moving down then stop // If it was moving across then continue
        if (down === 1) {
          this.stopShape()
          this.checkLine()

          if (this.checkLine().length > 0) {
            this.checkLine().forEach(row => {
              this.removeLines(row)
              this.dropLinesAbove(row)
            }) 
          }

          this.play()
        }

      }
    }

    rotateShape() {
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
            activeShape.coordinates = rotatedShapeCoordinates
            this.moveShape(0, 2)
          } else {
            activeShape.coordinates = rotatedShapeCoordinates
            this.moveShape(0, 1)
          }
        } else if (hitRightWall) {
          if (hitRightWallByTwo) {
            activeShape.coordinates = rotatedShapeCoordinates
            this.moveShape(0, -2)
          } else {
            activeShape.coordinates = rotatedShapeCoordinates
            this.moveShape(0, -1)
          }
        } else if (hitCeiling) {
          activeShape.coordinates = rotatedShapeCoordinates
          this.moveShape(1, 0)
        } else if (hitFloor || this.collide()) {
          this.moveShape(0, 0)
        } else {
          activeShape.coordinates = rotatedShapeCoordinates
          this.moveShape(0, 0)
        }
        
      }
    }

    speedUp() {
      clearInterval(fallInterval)
      fallInterval = setInterval(() => {
        // Move shape down 1 on the interval time
        this.moveShape(1, 0, 'active')
      }, 50)      
    }

    slowDown() {
      clearInterval(fallInterval)
      fallInterval = setInterval(() => {
        // Move shape down 1 on the interval time
        this.moveShape(1, 0, 'active')
      }, this.gameSpeed)
    }

    stopShape() {
      clearInterval(fallInterval)
      activeShapeCells.forEach(cell => {
        cell.classList.remove('active')
        cell.classList.add('filled')
        filledCells.push(cell)
      })
    }

    collide() {
      // Get all the filled cells in the grid
      let filledCells = []
      filledCells = gridCells.filter(cell => {
        return cell.classList.contains('filled')
      })

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

      const filledRows = []

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
      // For each cell above current row - move down 1 place / remove class and add to one below
      gridCells.reverse().forEach(cell => {
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
        gridCells.forEach(cell => {
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

  // Set shapes

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
  }



  // ! ****************** STARTING GAME AND CALLING FUNCTIONS ******************

  function handleKeyDown(event) {
    // if (pauseBtn.innerText === 'Pause') {
    const key = event.keyCode //store key in a variable
    if (key === 39 ) { 
      // if the right arrow is pressed and the cat is not on the right edge
      newGrid.moveShape(0, 1)
    } else if (key === 37) {
      newGrid.moveShape(0, -1)
    } else if (key === 38) {
      newGrid.rotateShape()
    } else if (key === 40) {
      newGrid.speedUp()
    }
    // }   
  }

  function handleKeyUp(event) {
    const key = event.keyCode //store key in a variable
    if (key === 40) {
      newGrid.slowDown()
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  tetris = new Tetris()
  tetris.load()

}
window.addEventListener('DOMContentLoaded', init)


