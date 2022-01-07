function rand(n: number): number {
  return Math.floor(Math.random() * n)
}

function randomIndices(count: number, from: number): number[] {
  const entries: number[] = [...Array(from).keys()]
  const winners: number[] = []

  ;[...Array(count).keys()].forEach(i => {
    let idx = rand(entries.length)
    winners.push(entries.splice(idx, 1)[0])
  })

  return winners
}

function indicesToPerkPageString(indices: number[]): string {
  const ROWS = ['Top', 'Mid', 'Bot']
  const ROWS_PER_PAGE = ROWS.length
  const PERKS_PER_ROW = 5

  let sorted = indices.sort((a,b) => a - b)
  let groupedByRow = sorted.reduce((rows: Map<number,number[]>, value: number) => {
    let rowIndex = Math.floor(value / PERKS_PER_ROW)
    let colIndex = value % PERKS_PER_ROW

    let row = rows.get(rowIndex) ?? []
    row.push(colIndex)
    rows.set(rowIndex, row)

    return rows
  }, new Map<number,number[]>())

  let pages = new Map<number, string[]>()
  
  groupedByRow.forEach((row, rowNumber) => {
    let pageIndex = Math.floor(rowNumber / ROWS_PER_PAGE)
    let rowIndex = rowNumber % ROWS_PER_PAGE

    let numbersText = row.map(a => a + 1).join(' ')
    let text = `${ROWS[rowIndex]} row ${numbersText}`
    
    let page = pages.get(pageIndex) ?? []
    page.push(text)
    pages.set(pageIndex, page)
  })

  let stringParts: string[] = []
  pages.forEach((pageRows, pageNumber) => {
    let text = `Page ${pageNumber + 1}: ${pageRows.join(', ')}.`
    stringParts.push(text)
  })

  return stringParts.join(' ')
}

function exercise<T,U>(fn: (input: T) => U, input: T, expected: U): void {
  let actual = fn(input)
  if (actual != expected) {
    throw new Error(`assertion failed. expected: ${expected}, actual: ${actual}`)
  }
}

Deno.test('indicesToPerkPageString', () => {
  exercise(indicesToPerkPageString, [0,1,2,3], `Page 1: Top row 1 2 3 4.`)
  exercise(indicesToPerkPageString, [3,2,1,0], `Page 1: Top row 1 2 3 4.`)
  exercise(indicesToPerkPageString, [0,5,10,15], `Page 1: Top row 1, Mid row 1, Bot row 1. Page 2: Top row 1.`)
  exercise(indicesToPerkPageString, [20,2,3,11], `Page 1: Top row 3 4, Bot row 2. Page 2: Mid row 1.`)
})


export function makeRandomPerkPage(count: number, from: number): string {
  let indices = randomIndices(count, from)
  return indicesToPerkPageString(indices)
}
