
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

  const grid = new Grid(10, 5, 25, 4, 'blue')
  grid.createGrid()





}
window.addEventListener('DOMContentLoaded', init)

