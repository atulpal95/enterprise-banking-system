import "./WithdrawReceiptModal.css";
import { FaPrint} from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
function DepositReceiptModal({

    open,
    onClose,
    receipt

}){

    if(!open || !receipt) return null;
    const handlePrint = () => {

    window.print();
    };

    const downloadReceipt = () => {

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.setTextColor(37, 99, 235);

    doc.text("PAL Bank", 105, 20, { align: "center" });

    doc.setFontSize(16);

    doc.setTextColor(0, 0, 0);

    doc.text("Deposit Receipt", 105, 30, { align: "center" });

    doc.line(30, 36, 180, 36);

    doc.setFontSize(12);

    let y = 50;

    doc.text(`Status : Successful`, 20, y);

    y += 12;

    doc.text(`Reference : ${receipt.reference}`, 20, y);

    y += 12;


    doc.text(
    "Amount : Rs. " +
    receipt.amount.toLocaleString(),
    30,
    y
);

    y += 12;

    doc.text(
    "Updated Balance : Rs. " +
    receipt.balance.toLocaleString(),
    30,
    y
 );
    y += 12;

    doc.text(
    "Date : " +
    new Date(receipt.transactionTime).toLocaleString(),
    30,
    y
);

    y += 25;

    doc.line(30, y, 190, y);

    y += 12;

    doc.setFontSize(11);

    doc.setTextColor(120);

    doc.text(

        "Thank you for banking with PAL Bank.",

        105,

        y,

        { align: "center" }

    );

    y += 8;

    doc.text(

        "This is a computer-generated receipt.",

        105,

        y,

        { align: "center" }

    );

    doc.save(

        `PALBANK_Receipt_${receipt.reference}.pdf`

    );

};


    return(

        <div className="modal-overlay">

            <div className="receipt-modal">

                <div className="receipt-header">

    <div className="bank-logo">

        🏦

    </div>

    <h3 className="bank-name">

        PAL Bank

    </h3>

    <p className="bank-tagline">

        Enterprise Banking

    </p>

    <div className="success-icon">

        ✓

    </div>

    <h2>

        Withdrawal Successful

    </h2>

    <p className="receipt-title">

        Withdrawal Successful
    </p>

</div>      

             <div className="receipt-row">

                <span>

                  Status

                </span>

                <strong style={{ color: "green" }}>

                  Successful

                </strong>

             </div>

                <div className="receipt-row">

                    <span>

                        Reference

                    </span>

                    <strong>

                        {receipt.reference}

                    </strong>

                </div>

                <div className="receipt-row">

                  <span>

                  Withdrawal Amount

                  </span>

                 <strong>

                ₹ {receipt.amount?.toLocaleString()}

               </strong>

            </div>

            <div className="receipt-row">

                    <span>

                      Update Balance

                    </span>

                    <strong>

                        ₹ {receipt.balance?.toLocaleString()}

                    </strong>

                </div>

                <div className="receipt-row">

                    <span>

                        Date

                    </span>

                    <strong>

                        {
                            new Date(
                                receipt.transactionTime
                            ).toLocaleString()
                        }

                    </strong>

                </div>

                <div className="receipt-buttons">

                <button
                 className="print-btn"
                 onClick={handlePrint}
                >

         <FaPrint />

         Print

         </button>

         <button
             className="download-btn"
              onClick={downloadReceipt}
          >

        <FaDownload />

        PDF

    </button>

    <button
        className="done-btn"
        onClick={onClose}
    >

        Done

    </button>

</div>

            </div>

        </div>

    );

}

export default DepositReceiptModal;