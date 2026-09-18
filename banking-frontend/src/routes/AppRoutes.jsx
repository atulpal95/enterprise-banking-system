import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";

// Auth Pages
import Login from "../pages/auth/Login";

import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";
import Register from "../pages/auth/Register";

// Admin Pages
import AdminLogin from "../pages/admin/AdminLogin";

// Customer Pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Deposit from "../pages/customer/Deposit";
import Withdraw from "../pages/customer/Withdraw";
import Transfer from "../pages/customer/Transfer";
import Beneficiary from "../pages/customer/Beneficiary";
import Transactions from "../pages/customer/Transactions";
import Statement from "../pages/customer/Statement";
import Profile from "../pages/customer/Profile";
import Loan from "../pages/customer/Loan";
import EMI from "../pages/customer/EMI";
import KYC from "../pages/customer/KYC";
import AtmCard from "../pages/customer/AtmCard";
import ChequeBook from "../pages/customer/ChequeBook";
import FixedDeposit from "../pages/customer/FixedDeposit";
import RecurringDeposit from "../pages/customer/RecurringDeposit";
import Settings from "../pages/customer/Settings";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import Customers from "../pages/admin/Customers";
import KYCManagement from "../pages/admin/KYCManagement";
import AdminTransactions from "../pages/admin/AdminTransactions";
import AdminATMCards from "../pages/admin/AdminATMCards";
import AdminChequeBooks from "../pages/admin/AdminChequeBooks";
import AdminLoans from "../pages/admin/AdminLoans";
import AdminFixedDeposits from "../pages/admin/AdminFixedDeposits";
import AdminRecurringDeposits from "../pages/admin/AdminRecurringDeposits";
import AdminReports from "../pages/admin/AdminReports";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminRegister from "../pages/admin/AdminRegister";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminForgotPassword from "../pages/admin/AdminForgotPassword";
import AdminVerifyOtp from "../pages/admin/AdminVerifyOtp";
import AdminResetPassword from "../pages/admin/AdminResetPassword";

function AppRoutes() {
  return (
    <Routes>
      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPassword />}
        />
        <Route path="/admin/verify-otp" element={<AdminVerifyOtp />} />

        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/profile" element={<AdminProfile />} />

        <Route path="/admin/customers" element={<Customers />} />

        <Route path="/admin/kyc" element={<KYCManagement />} />

        <Route path="/admin/atm-cards" element={<AdminATMCards />} />

        <Route path="/admin/cheque-book" element={<AdminChequeBooks />} />

        <Route path="/admin/loans" element={<AdminLoans />} />

        <Route path="/admin/reports" element={<AdminReports />} />

        <Route path="/admin/fixed-deposits" element={<AdminFixedDeposits />} />

        <Route
          path="/admin/recurring-deposits"
          element={<AdminRecurringDeposits />}
        />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        <Route path="/admin/transactions" element={<AdminTransactions />} />
      </Route>

      {/* Customer */}
      <Route element={<DashboardLayout />}>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />

        <Route path="/customer/deposit" element={<Deposit />} />

        <Route path="/customer/withdraw" element={<Withdraw />} />

        <Route path="/customer/transfer" element={<Transfer />} />

        <Route path="/customer/beneficiary" element={<Beneficiary />} />

        <Route path="/customer/transactions" element={<Transactions />} />

        <Route path="/customer/statement" element={<Statement />} />

        <Route path="/customer/profile" element={<Profile />} />

        <Route path="/customer/loan" element={<Loan />} />

        <Route path="/customer/emi" element={<EMI />} />

        <Route path="/customer/atm-card" element={<AtmCard />} />

        <Route path="/customer/cheque-book" element={<ChequeBook />} />

        <Route path="/customer/fixed-deposit" element={<FixedDeposit />} />

        <Route
          path="/customer/recurring-deposit"
          element={<RecurringDeposit />}
        />

        <Route path="/customer/settings" element={<Settings />} />

        <Route path="/customer/kyc" element={<KYC />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
