const TruncateText = ({ text, limit }: { text: string; limit: number }) => {
  let value
  if (text.length > limit) {
    const firstPart = text.slice(0, limit / 2)
    const secondPart = text.slice(-limit / 2)
    value = `${firstPart}...${secondPart}`
  } else {
    value = text
  }

  return <span>{value}</span>
}

export default TruncateText
