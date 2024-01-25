export function formattedDate(timestamp: number): string {
  const date = new Date(timestamp*1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  console.log(timestamp)
  return `${year}-${month}-${day}`
}