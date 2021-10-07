
function init() {

  // Set Grid outer border color
  const gridBorderColor = 'black'
  const gridBorderThickness = '4px'



  const grid = document.querySelector('.grid')

  let cellCount
  const mainCells = []
  
  function createGrid(width, height) {
    cellCount = width * height
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.classList.add('main-grid-cell')
      cell.classList.add(`main-grid-${i + 1}`)
      
      if (i < width) {
        cell.style.borderTop = `${gridBorderThickness} solid ${gridBorderColor}`
        console.log(i % width )
      } else if (i % width === width - 1) {
        cell.style.borderRight = `${gridBorderThickness} solid ${gridBorderColor}`
      }

      grid.appendChild(cell)
      mainCells.push(cell)
    }
    console.log(mainCells)

  }
  
  createGrid(10, 20)




}
window.addEventListener('DOMContentLoaded', init)