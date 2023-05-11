// returns money in $xx.xx form
const MoneyConverter = (money: string | number | undefined) => {
  if (!money || money === 'N/A') {
    return 'N/A'
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(money))
}

export default MoneyConverter
