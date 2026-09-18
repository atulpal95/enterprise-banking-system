import axiosInstance from "../api/axiosInstance";

const customerService = {

    login(data) {
        return axiosInstance.post("/customers/login", data);
    },

    register(data) {
        return axiosInstance.post("/customers/register", data);
    },

    getProfile() {
        return axiosInstance.get("/customers/profile");
    },

    updateProfile(data) {
        return axiosInstance.put("/customers/profile", data);
    },

    uploadProfilePicture(formData) {
    return axiosInstance.post(
        "/customers/profile-picture",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
},

    getAccount() {
        return axiosInstance.get("/customers/account");
    },

    getMiniStatement() {
        return axiosInstance.get("/customers/ministatement");
    },

    getTransactions() {
        return axiosInstance.get("/customers/transactions");
    },

    deposit(data) {
        return axiosInstance.post("/customers/deposit", data);
    },

    withdraw(data) {
        return axiosInstance.post("/customers/withdraw", data);
    },

    transfer(data) {
        return axiosInstance.post("/customers/transfer", data);
    },
    transferToBeneficiary(data) {

    return axiosInstance.post(

        "/customers/transfer/beneficiary",

        data

    );

},

    verifyAccount(data) {
    return axiosInstance.post(
        "/customers/verify-account",
        data
    );
},

    getBeneficiaries() {
        return axiosInstance.get("/customers/beneficiaries");
    },

    addBeneficiary(data) {
        return axiosInstance.post("/customers/beneficiaries", data);
    },

    deleteBeneficiary(id) {
        return axiosInstance.delete(`/customers/beneficiaries/${id}`);
    },

    updateBeneficiary(id, data) {
        return axiosInstance.put(`/customers/beneficiaries/${id}`, data);
    },

    getATMCard() {
        return axiosInstance.get("/customers/atm-card");
    },

    getATMStatus() {
        return axiosInstance.get("/customers/atm-card/status");
    },

    requestATMCard() {
        return axiosInstance.post("/customers/atm-card/request");
    },

    blockATMCard() {
    return axiosInstance.put("/customers/atm-card/block");
    },

    unblockATMCard() {
    return axiosInstance.put("/customers/atm-card/unblock");
    },
    changeATMPin(data) {
    return axiosInstance.put(
        "/customers/atm-card/change-pin",
        data
    );
   },

    getChequeBookHistory() {
        return axiosInstance.get("/customers/cheque-book/history");
    },

    requestChequeBook(data) {

    return axiosInstance.post(

        "/customers/cheque-book/request",

        data

    );

   },

    applyLoan(data) {
        return axiosInstance.post("/customers/loan/apply", data);
    },
    getLoans() {
    return axiosInstance.get("/customers/loans");
    },
    payEmi(loanId) {
    return axiosInstance.post(
        `/customers/loan/pay-emi/${loanId}`
    );
    },

    openFixedDeposit(data) {
    return axiosInstance.post(
        "/customers/fixed-deposits/open",
        data
    );
     },

     getFixedDeposits() {
    return axiosInstance.get(
        "/customers/fixed-deposits"
    );
    },
    openRecurringDeposit(data) {
    return axiosInstance.post(
        "/customers/recurring-deposits/open",
        data
    );
    },


    getRecurringDeposits() {
        return axiosInstance.get("/customers/recurring-deposits");
    },
    payRecurringDepositInstallment: (id) =>
    axiosInstance.post(`/customers/recurring-deposits/${id}/installment`),

    getMonthlySpending() {
    return axiosInstance.get(
        "/customers/dashboard/spending"
    );
},

generateStatement: (fromDate, toDate) => {

    return axiosInstance.get(
        `/customers/statement/pdf`,
        {
            params: {
                fromDate,
                toDate,
            },

            responseType: "blob",
        }
    );

},

changePassword(data) {
    return axiosInstance.put(
        "/customers/change-password",
        data
    );
},

forgotPassword(data) {
    return axiosInstance.post(
        "/customers/forgot-password",
        data
    );
},

verifyOtp(data) {
    return axiosInstance.post(
        "/customers/verify-otp",
        data
    );
},

resetPassword(data) {
    return axiosInstance.post(
        "/customers/reset-password",
        data
    );
},
        // ================================
    // KYC
    // ================================

    getKYC() {
        return axiosInstance.get("/customers/kyc");
    },

    getKYCStatus() {
        return axiosInstance.get("/customers/kyc/status");
    },

    submitKYC(formData) {
        return axiosInstance.post(
            "/customers/kyc/submit",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
    getDashboardStats() {
    return axiosInstance.get(
        "/customers/dashboard/stats"
    );
},


};

export default customerService;