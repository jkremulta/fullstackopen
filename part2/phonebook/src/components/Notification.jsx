
const Notification = ({message, type}) => {
  const base = {
    backgroundColor: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const errorStyle = {
    color: 'red'
  }

  const successStyle = {
    color: 'green'
  }

  const styles = {
    ...base,
    ...(type =='error' ? errorStyle: successStyle)
  }

  if (message == null) {
    return null
  }

  return (
    <div style={styles}>
      {message}
    </div>
  )
}

export default Notification