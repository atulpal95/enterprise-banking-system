import { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import customerService from "../../services/customerService";

import BeneficiaryCard from "../../components/beneficiary/BeneficiaryCard";
import AddBeneficiaryModal from "../../components/beneficiary/AddBeneficiaryModal";
import EditBeneficiaryModal from "../../components/beneficiary/EditBeneficiaryModal";
import DeleteBeneficiaryModal from "../../components/beneficiary/DeleteBeneficiaryModal";

import "../../assets/styles/Beneficiary.css";

function Beneficiary() {

    const [beneficiaries, setBeneficiaries] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selected, setSelected] = useState(null);


    const loadBeneficiaries = async () => {

        try {

            const response =
                await customerService.getBeneficiaries();

            setBeneficiaries(response.data);
            setFiltered(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadBeneficiaries();

    }, []);


    useEffect(() => {

        const keyword = search.toLowerCase().trim();

        setFiltered(

            beneficiaries.filter((item) =>

                item.beneficiaryName
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                item.beneficiaryEmail
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                item.nickname
                    ?.toLowerCase()
                    .includes(keyword)

            )

        );

    }, [search, beneficiaries]);


    return (

        <div className="beneficiary-page">

            {/* =================================================
                BLUE BENEFICIARY HERO
            ================================================= */}

            <section className="beneficiary-hero">

                {/* HERO HEADER */}

                <div className="beneficiary-header">

                    <div className="beneficiary-title">

                        <span className="beneficiary-eyebrow">
                            BANKING SERVICES
                        </span>

                        <h2>
                            Beneficiary Management
                        </h2>

                        <p>
                            Manage your saved beneficiaries.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="add-beneficiary-btn"
                        onClick={() => setAddOpen(true)}
                    >

                        <FaPlus />

                        <span>
                            Add Beneficiary
                        </span>

                    </button>

                </div>


                {/* SEARCH */}

                <div className="beneficiary-search">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search beneficiary..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* BENEFICIARY CARDS */}

                {loading ? (

                    <div className="loading">
                        Loading beneficiaries...
                    </div>

                ) : filtered.length === 0 ? (

                    <div className="empty-beneficiary">

                        <div className="empty-icon">
                            <FaSearch />
                        </div>

                        <h3>
                            No beneficiaries found
                        </h3>

                        <p>
                            Try a different search or add a new beneficiary.
                        </p>

                        <button
                            type="button"
                            className="empty-add-btn"
                            onClick={() => setAddOpen(true)}
                        >

                            <FaPlus />

                            Add Beneficiary

                        </button>

                    </div>

                ) : (

                    <div className="beneficiary-grid">

                        {filtered.map((item) => (

                            <BeneficiaryCard

                                key={item.id}

                                beneficiary={item}

                                onEdit={() => {

                                    setSelected(item);
                                    setEditOpen(true);

                                }}

                                onDelete={() => {

                                    setSelected(item);
                                    setDeleteOpen(true);

                                }}

                            />

                        ))}

                    </div>

                )}

            </section>


            {/* =================================================
                MODALS
            ================================================= */}

            <AddBeneficiaryModal

                open={addOpen}

                onClose={() =>
                    setAddOpen(false)
                }

                onSuccess={loadBeneficiaries}

            />


            <EditBeneficiaryModal

                open={editOpen}

                beneficiary={selected}

                onClose={() =>
                    setEditOpen(false)
                }

                onSuccess={loadBeneficiaries}

            />


            <DeleteBeneficiaryModal

                open={deleteOpen}

                beneficiary={selected}

                onClose={() =>
                    setDeleteOpen(false)
                }

                onSuccess={loadBeneficiaries}

            />

        </div>

    );

}

export default Beneficiary;