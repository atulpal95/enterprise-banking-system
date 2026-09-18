import axiosInstance from "./axiosInstance";

// =====================================================
// ADMIN AUTHENTICATION
// =====================================================

export const adminLogin = (data) =>
    axiosInstance.post("/admin/login", data);

// =====================================================
// ADMIN FORGOT PASSWORD
// =====================================================

export const forgotAdminPassword = (email) =>
    axiosInstance.post(
        "/admin/forgot-password",
        null,
        {
            params: {
                email,
            },
        }
    );

    // =====================================================
// ADMIN VERIFY OTP
// =====================================================

export const verifyAdminOtp = (email, otp) =>
    axiosInstance.post(
        "/admin/verify-otp",
        null,
        {
            params: {
                email,
                otp,
            },
        }
    );


// =====================================================
// ADMIN RESET PASSWORD
// =====================================================

export const resetAdminPassword = (data) =>
    axiosInstance.post(
        "/admin/reset-password",
        data
    );

// =====================================================
// ADMIN PROFILE
// =====================================================

export const getAdminProfile = () =>
    axiosInstance.get("/admin/profile");

export const updateAdminProfile = (data) =>
    axiosInstance.put("/admin/profile", data);

export const uploadAdminProfilePicture = (formData) =>
    axiosInstance.post(
        "/admin/profile/picture",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

export const changeAdminPassword = (data) =>
    axiosInstance.put("/admin/change-password", data);


// =====================================================
// ADMIN DASHBOARD
// =====================================================

export const getAdminDashboard = () =>
    axiosInstance.get("/admin/dashboard");

export const getAdminAnalytics = () =>
    axiosInstance.get("/admin/dashboard/analytics");


// =====================================================
// CUSTOMER MANAGEMENT
// =====================================================

export const getAllCustomers = () =>
    axiosInstance.get("/admin/customers");
export const getCustomerDetails = (id) =>
    axiosInstance.get(`/admin/customers/${id}/details`);

export const approveCustomer = (id) =>
    axiosInstance.put(`/admin/customers/${id}/approve`);

export const rejectCustomer = (id) =>
    axiosInstance.put(`/admin/customers/${id}/reject`);

export const blockCustomer = (id) =>
    axiosInstance.put(`/admin/block/${id}`);

export const unblockCustomer = (id) =>
    axiosInstance.put(`/admin/unblock/${id}`);


// =====================================================
// KYC MANAGEMENT
// =====================================================

export const getAllKYC = () =>
    axiosInstance.get("/admin/kyc");

export const getPendingKYC = () =>
    axiosInstance.get("/admin/kyc/pending");

export const verifyKYC = (id, data) =>
    axiosInstance.put(`/admin/kyc/${id}/verify`, data);

export const rejectKYC = (id, data) =>
    axiosInstance.put(`/admin/kyc/${id}/reject`, data);

// =====================================================
// SECURE KYC DOCUMENT ACCESS
// =====================================================

export const getKYCDocument = (url) => {

    const backendBaseUrl =
        axiosInstance.defaults.baseURL.replace(/\/api\/?$/, "");

    return axiosInstance.get(
        `${backendBaseUrl}${url}`,
        {
            responseType: "blob",
        }
    );
};

// =====================================================
// ATM CARD MANAGEMENT
// =====================================================

export const getATMRequests = () =>
    axiosInstance.get("/admin/atm-cards");

export const approveATMCard = (id) =>
    axiosInstance.put(`/admin/atm-cards/${id}/approve`);

export const rejectATMCard = (id, data) =>
    axiosInstance.put(`/admin/atm-cards/${id}/reject`, data);

export const blockATMCard = (email) =>
    axiosInstance.put(`/admin/atm-card/block/${email}`);

export const unblockATMCard = (email) =>
    axiosInstance.put(`/admin/atm-card/unblock/${email}`);


// =====================================================
// CHEQUE BOOK MANAGEMENT
// =====================================================

export const getChequeBookRequests = () =>
    axiosInstance.get("/admin/cheque-book");

export const approveChequeBook = (id) =>
    axiosInstance.put(`/admin/cheque-book/approve/${id}`);

export const rejectChequeBook = (id, data) =>
    axiosInstance.put(`/admin/cheque-book/reject/${id}`, data);

export const dispatchChequeBook = (id) =>
    axiosInstance.put(`/admin/cheque-book/dispatch/${id}`);

export const deliverChequeBook = (id) =>
    axiosInstance.put(`/admin/cheque-book/deliver/${id}`);


// =====================================================
// LOAN MANAGEMENT
// =====================================================

export const getAllLoans = () =>
    axiosInstance.get("/admin/loans");

export const approveLoan = (id) =>
    axiosInstance.put(`/admin/loan/approve/${id}`);

export const rejectLoan = (id, data) =>
    axiosInstance.put(`/admin/loan/reject/${id}`, data);

export const disburseLoan = (id) =>
    axiosInstance.put(`/admin/loan/disburse/${id}`);

export const closeLoan = (id) =>
    axiosInstance.put(`/admin/loan/close/${id}`);


// =====================================================
// FIXED DEPOSIT MANAGEMENT
// =====================================================

export const getAllFixedDeposits = () =>
    axiosInstance.get("/admin/fixed-deposits");

export const approveFixedDeposit = (id) =>
    axiosInstance.put(`/admin/fixed-deposits/approve/${id}`);

export const rejectFixedDeposit = (id, data) =>
    axiosInstance.put(`/admin/fixed-deposits/reject/${id}`, data);

export const closeFixedDeposit = (id) =>
    axiosInstance.put(`/admin/fixed-deposits/close/${id}`);


// =====================================================
// RECURRING DEPOSIT MANAGEMENT
// =====================================================

export const getAllRecurringDeposits = () =>
    axiosInstance.get("/admin/recurring-deposits");

export const approveRecurringDeposit = (id) =>
    axiosInstance.put(`/admin/recurring-deposits/approve/${id}`);

export const rejectRecurringDeposit = (id, data) =>
    axiosInstance.put(`/admin/recurring-deposits/reject/${id}`, data);

export const closeRecurringDeposit = (id) =>
    axiosInstance.put(`/admin/recurring-deposits/close/${id}`);


// =====================================================
// REPORTS
// =====================================================

export const getDailyReport = () =>
    axiosInstance.get("/admin/reports/daily");

export const getMonthlyReport = () =>
    axiosInstance.get("/admin/reports/monthly");

export const getReportBetweenDates = (startDate, endDate) =>
    axiosInstance.get("/admin/reports", {
        params: {
            startDate,
            endDate,
        },
    });


// =====================================================
// REPORT DOWNLOADS
// =====================================================

export const downloadCustomerExcel = () =>
    axiosInstance.get("/admin/reports/customers/excel", {
        responseType: "blob",
    });

export const downloadCustomerPdf = () =>
    axiosInstance.get("/admin/reports/customers/pdf", {
        responseType: "blob",
    });

export const downloadLoanExcel = () =>
    axiosInstance.get("/admin/reports/loans/excel", {
        responseType: "blob",
    });

export const downloadFixedDepositExcel = () =>
    axiosInstance.get("/admin/reports/fixed-deposits/excel", {
        responseType: "blob",
    });

export const downloadFixedDepositPdf = () =>
    axiosInstance.get("/admin/reports/fixed-deposits/pdf", {
        responseType: "blob",
    });

export const downloadRecurringDepositExcel = () =>
    axiosInstance.get("/admin/reports/recurring-deposits/excel", {
        responseType: "blob",
    });

export const downloadRecurringDepositPdf = () =>
    axiosInstance.get("/admin/reports/recurring-deposits/pdf", {
        responseType: "blob",
    });

export const downloadTransactionExcel = () =>
    axiosInstance.get("/admin/reports/transactions/excel", {
        responseType: "blob",
    });

export const downloadTransactionPdf = () =>
    axiosInstance.get("/admin/reports/transactions/pdf", {
        responseType: "blob",
    });