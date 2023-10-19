import '../App.css'

const Notification = ({ errorMessage, successMessage }) => {
    if (errorMessage) {
      return (
        <div className="error">
        {errorMessage}
      </div>
      )
    }

    if (successMessage) {
        return (
            <div className="success">
            {successMessage}
          </div>
        )
    }

    else {
        return null
    }

  }

  export default Notification