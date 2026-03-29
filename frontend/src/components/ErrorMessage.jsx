const ErrorMessage = ({ message }) => (
  <div className="text-center py-20">
    <p className="text-red-500 text-sm">{message || 'Something went wrong'}</p>
  </div>
)

export default ErrorMessage