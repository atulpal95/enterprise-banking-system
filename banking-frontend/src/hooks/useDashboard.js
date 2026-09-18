import { useEffect, useState } from "react";
import customerService from "../services/customerService";

export default function useDashboard() {

    const [profile, setProfile] = useState(null);
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            setLoading(true);
            setError("");

            const [
                profileRes,
                accountRes,
                transactionRes,
                chartRes,
                statsRes
            ] = await Promise.all([

                customerService.getProfile(),

                customerService.getAccount(),

                customerService.getMiniStatement(),

                customerService.getMonthlySpending(),

                customerService.getDashboardStats()

            ]);

            setProfile(profileRes.data);

            setAccount(accountRes.data);

            setTransactions(transactionRes.data);

            setChartData(chartRes.data);

            setStats(statsRes.data);

        } catch (err) {

            console.error(err);

            setError("Failed to load dashboard.");

        } finally {

            setLoading(false);

        }

    }

    return {

        profile,

        account,

        transactions,

        chartData,

        stats,

        loading,

        error,

        refresh: loadDashboard

    };

}