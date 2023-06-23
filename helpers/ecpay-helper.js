const showIdGenerator = (userId) => {
  const d = new Date().getTime().toString()
  const n = (Math.random() + 1).toString(36).substring(2)
  let showId = d + userId + n
  if (showId.length > 20) {
    showId = showId.slice(0, 20)
  }
  return showId
}

module.exports = { showIdGenerator }
