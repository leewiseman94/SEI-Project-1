
function init() {

  // ! ********** VARIABLES **********
  
  const nextShapes = []
  let activeShape
  let activeShapeCells = []
  let fallInterval

  // Set shape colors
  const colors = ['red', 'blue', 'green', 'orange', 'purple']
  //   Set all 7 shapes and push to shapes array
  const shapes = []
  const square = {
    coordinates: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }]
  }
  const line = {
    coordinates: [{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
  }
  const sShape = {
    coordinates: [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
  }
  const zShape = {
    coordinates: [{ x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 1 }]
  }
  const lShape = {
    coordinates: [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
  }
  const jShape = {
    coordinates: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
  }
  const tShape = {
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



  // ! ********** GAME **********
  // * Methods -> start, pause, end, saveGame 
  // * Talks to grid to create

  class Game {
    constructor() {
      this.score = 0
      this.difficulty = 'medium'
    }

    start() {
      // Remove any previous grid
      // Create new grid
      console.log('new game ->', newGame)
      const grid = new Grid()
      grid.createGrid()

      // Push first 3 shapes to the nextShapes array
      nextShapes.push(new Shape())
      nextShapes.push(new Shape())
      nextShapes.push(new Shape())
      
      grid.play()
    }

    pause() {
      // pause interval?
    }

    end() {
      // show game over and reset board?
    }

  }


  // ! ********** GRID **********
  // * Methods -> createNewGrid, drawNextShape, moveActiveShape, collide
  //   If hits collide (hits.filled class) then stop shape and create new
  //   Grid size will depend on game difficulty

  const gridRows = []
  const gridCells = []
  const grid = document.querySelector('.grid')

  class Grid {
    constructor() {
      this.rows = 20
      this.cols = 10
      this.cellWidth = newGame.difficulty === 'easy' || newGame.difficulty === 'medium' ? 25 : 35
      this.borderWidth = 4
      this.borderColor = 'green'
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
    }

    play() {
      // Set active shape and draw on the grid and add
      //draw next shape and then start a loop for the shape to fall
      activeShape = nextShapes[0]
      console.log('activeShape ->', activeShape)
      nextShapes.push(new Shape())
      nextShapes.shift()
      this.drawShape(0, 0, 'active')
      
      fallInterval = setInterval(() => {
        // Move shape down 1 on the interval time
        this.moveShape(1, 0, 'active')
      }, this.gameSpeed)

    }

    drawShape(down, across, className) {
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
        console.log('active cell ->', activeCell[0])
        activeShapeCells.push(activeCell[0])
      })
      // Add required classes (to fill the correct cells for the shape)
      activeShapeCells.forEach(cell => {
        cell.classList.add(className)
        cell.classList.add(`${activeShape.color}`)
      })
    }

    removeShape() {
      //Remove class from current filled cells
      activeShapeCells.forEach(cell => {
        cell.classList.remove('active')
        cell.classList.remove(`${activeShape.color}`)
      })
      //Empty filledCells array
      activeShapeCells = []
    }

    moveShape(down, across, className) {
      // Will need conditions to check if hits wall or floor or other shape
      // If wall carry on
      // If floor or other shape then call change class to filled and call play function for next shape
      const hitFloor = this.hitFloor()
      console.log('hitFloor ->', hitFloor)
      if (!this.hitFloor()) {
        this.removeShape()
        this.drawShape(down, across, className)
      } else {
        clearInterval(fallInterval)
        this.play()
      }

    }

    collide() {
      // 
      
    }

    hitFloor() {
      return activeShapeCells.some(cell => {
        console.log('y === rows - 5 ->', cell.dataset.y + ' ' + (this.rows - 5))
        return parseInt(cell.dataset.y) === (parseInt(this.rows) - 1)
      })
    }

    hitShape() {
      
    }


  }

  
  
  // ****************** SHAPES ******************



  
  // Set shapes

  class Shape {
    constructor() {
      this.randomShapeIndex = Math.floor(Math.random() * shapes.length)
      this.coordinates = shapes[this.randomShapeIndex].coordinates
      this.centrePoint = { x: 0, y: 0 }
      this.location = newGame.difficulty === 'easy' || newGame.difficulty === 'medium' ? { x: 5, y: 0 } : { x: 4, y: 0 }
      this.randomColorIndex = Math.floor(Math.random() * colors.length)
      this.color = colors[this.randomColorIndex]
    }
    
  }




  // nextShapes[0].inPlay()
  // nextShapes[0].fall()



  const newGame = new Game()
  newGame.start()

}
window.addEventListener('DOMContentLoaded', init)
