import "../../assets/styles/PrimaryButton.css";
function PrimaryButton({
    text,
    loading = false,
    type = "button",
    onClick,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`btn btn-primary banking-btn ${className}`}
        >
            {loading ? (
                <>
                    <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                    ></span>

                    Processing...
                </>
            ) : (
                text
            )}
        </button>
    );
}

export default PrimaryButton;