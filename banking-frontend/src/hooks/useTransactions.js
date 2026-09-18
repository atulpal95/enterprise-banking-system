import { useEffect, useState } from "react";
import customerService from "../services/customerService";

export default function useTransactions() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTransactions();
    }, []);

    async function loadTransactions() {

        try {

            setLoading(true);
            setError("");

            const response = await customerService.getTransactions();

            setTransactions(response.data);

        } catch (err) {

            console.error(err);

            setError("Failed to load transactions.");

        } finally {

            setLoading(false);

        }

    }

    return {

        transactions,
        loading,
        error,
        refresh: loadTransactions,

    };

}