import './Notification.css'

const Notification = ({message, type}) => {
  if (!message) return null;

  return (
    <div className={`notification ${type === 'error' ? 'error' : 'success'}`}>
      {message}
    </div>
  );
}

export default Notification;
