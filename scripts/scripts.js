
function init() {

  const gridRows = []
  const gridCells = []

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
          console.log(gridCell.dataset)
          gridCell.style.width = `${this.cellWidth}px)`
          row.appendChild(gridCell)
          gridCells.push(gridCell)
        }   
      })
    }
  }

  const grid = new Grid(20, 10, 30, 2, 'blue')
  grid.createGrid()

  const shape = [[1, 1], [1, 2], [1, 3]]
  const fallingShapeCell = []

  shape.forEach(coordinate => {
    const activeCell = gridCells.filter(cell => {
      return parseInt(cell.dataset.x) === coordinate[0] && parseInt(cell.dataset.y) === coordinate[1]
    })
    fallingShapeCell.push(activeCell)
  })
  console.log(fallingShapeCell)
  fallingShapeCell.forEach(cell => {
    cell[0].style.backgroundColor = 'red'
  })



  

}
window.addEventListener('DOMContentLoaded', init)
