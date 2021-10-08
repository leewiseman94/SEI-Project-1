
const shapes = []

const square = [[0, 0], [0, 1], [1, 0], [1, 1]]
const sShape = [[2, 0], [1, 0], [1, 1], [1, 2], [0, 2]]
const zShape = [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]]
const tShape = [[1, 0], [0,1], [1,1],[2,1]]
const line = [[0, 0], [0, 1], [0, 2], [0, 3]]
const lShape = [[2,0], [0, 1], [1, 1], [2,1]]
const jShape = [[0, 0], [1, 0] ,[2, 0], [2, 1]]

shapes.push(sShape)
shapes.push(zShape)
shapes.push(tShape)
shapes.push(line)
shapes.push(square)
shapes.push(lShape)



class Shape {
  constructor() {
    this.shape = shape
    this.color = color
    this.location = []
  }

  

  create() {
    console.log(shapes)    
    const colors = ['blue', 'green', 'black']
    const randomShape = Math.floor(Math.random() * shapes.length)

  }


}

const nextShape = new Shape()
nextShape.create()
console.log(nextShape)

var other = [[1, 0], [0,1], [1,1],[2,1]]; // 't' shape
var line = [[0, 0], [0, 1], [0, 2], [0, 3]]; // line
var square = [[0, 0], [0, 1], [1, 0], [1, 1]]; // 4 x 4 square
var l = [[2,0], [0, 1], [1, 1], [2,1]]; // 'L' shape
