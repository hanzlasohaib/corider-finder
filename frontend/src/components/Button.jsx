function Button({
    children,
    type = "button",
    variant = "primary",
    onClick,
    className = "",
  }) {
    const base =
      "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  
    const styles = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700",
      secondary:
        "border border-gray-300 text-gray-700 hover:bg-gray-100",
      danger:
        "bg-red-600 text-white hover:bg-red-700",
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${base} ${styles[variant]} ${className}`}
      >
        {children}
      </button>
    );
  }
  
  export default Button;
  