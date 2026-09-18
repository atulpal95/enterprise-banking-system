function Logo({
    size = 80,
    showText = true,
    textColor = "#FFFFFF",
}) {
    return (
        <div className="text-center">

            <div
                style={{
                    width: size,
                    height: size,
                    margin: "0 auto",
                    borderRadius: "18px",
                    background: "linear-gradient(135deg, #0D6EFD, #1E3A5F)",
                    border: "3px solid #F4B400",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: size / 3,
                    boxShadow: "0 12px 30px rgba(0,0,0,.25)",
                }}
            >
                PEB
            </div>

            {showText && (
                <>
                    <h3
                        className="mt-3 mb-1 fw-bold"
                        style={{ color: textColor }}
                    >
                        PAL Enterprise Bank
                    </h3>

                    <small
                        style={{
                            color: textColor,
                            opacity: 0.85,
                        }}
                    >
                        Secure • Smart • Trusted
                    </small>
                </>
            )}

        </div>
    );
}

export default Logo;