import { useState } from "react";
import customerService from "../../services/customerService";
import "../../assets/styles/Statement.css";

function Statement() {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateStatement = async () => {

        setError("");

        // Validation
        if (!fromDate || !toDate) {
            setError("Please select both From Date and To Date.");
            return;
        }

        if (fromDate > toDate) {
            setError("From Date cannot be after To Date.");
            return;
        }

        try {

            setLoading(true);

            const response =
                await customerService.generateStatement(
                    fromDate,
                    toDate
                );

            // Create PDF blob
            const file = new Blob(
                [response.data],
                {
                    type: "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(file);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `PALBANK_Statement_${fromDate}_to_${toDate}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Statement generation error:",
                error
            );

            if (
                error.response?.data instanceof Blob
            ) {

                try {

                    const text =
                        await error.response.data.text();

                    const data =
                        JSON.parse(text);

                    setError(
                        data.message ||
                        "Unable to generate statement."
                    );

                } catch {

                    setError(
                        "Unable to generate statement."
                    );

                }

            } else {

                setError(
                    error.response?.data?.message ||
                    "Unable to generate statement."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="statement-page">


            {/* =========================
                Generate Statement
            ========================= */}

            <div className="statement-card">

                <div className="statement-card-header">

                    <div>

                        <h3>
                            Generate Statement
                        </h3>

                        <p>
                            Select the date range for your statement.
                        </p>

                    </div>

                </div>


                <div className="statement-form">

                    {/* From Date */}

                    <div className="form-group">

                        <label htmlFor="fromDate">
                            From Date
                        </label>

                        <input
                            id="fromDate"
                            type="date"
                            value={fromDate}
                            max={toDate || undefined}
                            onChange={(e) =>
                                setFromDate(e.target.value)
                            }
                        />

                    </div>


                    {/* To Date */}

                    <div className="form-group">

                        <label htmlFor="toDate">
                            To Date
                        </label>

                        <input
                            id="toDate"
                            type="date"
                            value={toDate}
                            min={fromDate || undefined}
                            onChange={(e) =>
                                setToDate(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* Error */}

                {error && (

                    <div className="statement-error">

                        {error}

                    </div>

                )}


                {/* Generate Button */}

                <button
                    className="generate-btn"
                    onClick={handleGenerateStatement}
                    disabled={loading}
                >

                    {loading
                        ? "Generating Statement..."
                        : "Generate & Download Statement"
                    }

                </button>

            </div>


            {/* =========================
                Statement Information
            ========================= */}

            <div className="statement-history">

                <div className="history-header">

                    <div>

                        <h3>
                            Statement Information
                        </h3>

                        <p>
                            Your statement will be downloaded
                            as a PDF after generation.
                        </p>

                    </div>

                </div>


                <div className="statement-info-grid">

                    <div className="statement-info-item">

                        <span>
                            Format
                        </span>

                        <strong>
                            PDF
                        </strong>

                    </div>


                    <div className="statement-info-item">

                        <span>
                            Date Range
                        </span>

                        <strong>
                            Custom
                        </strong>

                    </div>


                    <div className="statement-info-item">

                        <span>
                            Download
                        </span>

                        <strong>
                            Automatic
                        </strong>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Statement;