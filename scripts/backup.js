
function init() {

  // ********** GRID **********


  const gridRows = []
  const gridCells = []
  console.log(gridCells)
  // Create Grid
  class Grid {
    constructor(rows, cols, cellWidth, borderWidth, borderColor) {
      this.rows = rows
      this.cols = cols
      this.cellWidth = cellWidth
      this.borderWidth = borderWidth
      this.borderColor = borderColor
    }

    createGrid() {
      
      const grid = document.querySelector('.grid')
      // Set border colour
      grid.style.border = `${this.borderWidth}px solid ${this.borderColor}`

      // Create x number of rows
      for (let y = 0; y < this.rows; y++) {
        const gridRow = document.createElement('div')
        gridRow.classList.add('grid-row')
        gridRow.classList.add(`grid-row-${y}`)
        gridRow.dataset.row = y
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
          // console.log(gridCell.dataset)
          gridCell.style.width = `${this.cellWidth}px)`
          row.appendChild(gridCell)
          gridCells.push(gridCell)
        }   
      })
    }
  }

  const grid = new Grid(20, 10, 30, 2, 'blue')
  grid.createGrid()
  
  // ****************** SHAPES ******************


  // Set shape colors
  const colors = ['red', 'blue', 'green', 'yellow', 'purple']
  
  // Set shapes
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

  class Shape {
    constructor(shape, color) {
      this.coordinates = shape.coordinates
      this.centrePoint = { x: 0, y: 0 }
      this.location = { x: 5, y: 0 }
      this.color = color
    }

    inPlay() {
      this.drawShape(0, 0, 'active')
      
      fallInterval = setInterval(() => {
        this.fall()
      }, 1000)
      
    }

    drawShape(across, down, className) {
      // Move shape left or right
      this.location.x = this.location.x + across
      // Drop shape down one
      this.location.y = this.location.y + down
      // For each ordinate of the shape, get the cell it should be in - and push to an array for later use
      this.coordinates.forEach(coordinate => {
        const activeCell = gridCells.filter(cell => {
          return parseInt(cell.dataset.x) === (coordinate.x + this.location.x) && parseInt(cell.dataset.y) === (coordinate.y + this.location.y)
        })
        console.log(activeCell)
        filledCells.push(activeCell[0])
      })
      // Add required classes (to fill the correct cells for the shape)
      filledCells.forEach(cell => {
        cell.classList.add(className)
        cell.classList.add(`${this.color}`)
      })
    }

    removeShape() {
      //Remove class from current filled cells
      filledCells.forEach(cell => {
        cell.classList.remove('active')
        cell.classList.remove(`${this.color}`)
      })
      //Empty filledCells array
      filledCells = []
    }

    fall() {
      //Check if block hits the floor of the grid
      const hitFloor = filledCells.some(cell => {
        console.log('y === rows - 5 ->', cell.dataset.y + ' ' + (grid.rows - 5))
        return parseInt(cell.dataset.y) === (parseInt(grid.rows) - 1)
      })
      console.log(hitFloor)
      if (!hitFloor) {

        this.removeShape()
        
        this.drawShape(0, 1, 'active')

        // Clear next cells
        nextCells = []
        // Get next cells so its possible to check whether it has hit something 
        this.coordinates.forEach(coordinate => {
          const nextCell = gridCells.filter(cell => {
            return parseInt(cell.dataset.x) === (coordinate.x + this.location.x + 1) && parseInt(cell.dataset.y) === (coordinate.y + this.location.y + 1)
          })
          nextCells.push(nextCell)
        })
      } else {
        clearInterval(fallInterval)
      }
    }

    
  }

  const nextShapes = []

  function addRandomShape() {
    const randomShapeIndex = Math.floor(Math.random() * shapes.length)
    const randomColorIndex = Math.floor(Math.random() * colors.length)
    const newShape = new Shape(shapes[randomShapeIndex], colors[randomColorIndex])
    nextShapes.push(newShape)
  }

  let filledCells = []
  let nextCells = []
  let fallInterval
  addRandomShape()
  addRandomShape()
  addRandomShape()
  nextShapes[0].inPlay()
  // nextShapes[0].fall()





}
window.addEventListener('DOMContentLoaded', init)
