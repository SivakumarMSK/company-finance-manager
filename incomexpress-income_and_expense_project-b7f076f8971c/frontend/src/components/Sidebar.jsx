import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaTachometerAlt, FaUserGraduate, FaUsers, FaMoneyBillWave, FaChartBar,
    FaHistory, FaSignOutAlt, FaPlus, FaListAlt, FaMoneyCheckAlt, FaFileInvoice 
} from "react-icons/fa"; // Added FaMoneyCheckAlt for Income
import "./ComponentStyles/Sidebar.css";
import sidebar_logo from "../assets/sidebar_logo.jpeg";

const Sidebar = ({ sidebar, setSidebar }) => {
    const [studentMenuOpen, setStudentMenuOpen] = useState(false);
    const [clientMenuOpen, setClientMenuOpen] = useState(false);
    const [reportMenuOpen, setReportMenuOpen] = useState(false);
    const location = useLocation();
    const hideSidebar = location.pathname === "/";

    const handleSidebarClose = () => {
        setSidebar(false);
    };

    // Prevent scroll from affecting menu state
    const handleSidebarScroll = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            <div className={`sidebar ${hideSidebar ? "hidden" : ""}`} onScroll={handleSidebarScroll}>
                <ul className="sidebar-links">
                    <li>
                        <Link to="/dashboard">
                            <img src={sidebar_logo} alt="logo" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" onClick={handleSidebarClose}>
                            <FaTachometerAlt className="sidebar-icon" /> Dashboard
                        </Link>
                    </li>

                    {/* Student Details */}
                    <li>
                        <button
                            className="submenu-toggle"
                            onClick={(e) => {
                                e.stopPropagation();
                                setStudentMenuOpen(!studentMenuOpen);
                            }}
                        >
                            <FaUserGraduate className="sidebar-icon" /> Student Details
                        </button>
                        {studentMenuOpen && (
                            <ul className="submenu">
                                <li>
                                    <Link to="/student" onClick={handleSidebarClose}>
                                        <FaPlus className="submenu-icon" /> Add Student
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/displaystudent" onClick={handleSidebarClose}>
                                        <FaListAlt className="submenu-icon" /> Display Student
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Client Details */}
                    <li>
                        <button
                            className="submenu-toggle"
                            onClick={(e) => {
                                e.stopPropagation();
                                setClientMenuOpen(!clientMenuOpen);
                            }}
                        >
                            <FaUsers className="sidebar-icon" /> Client Details
                        </button>
                        {clientMenuOpen && (
                            <ul className="submenu">
                                <li>
                                    <Link to="/client" onClick={handleSidebarClose}>
                                        <FaPlus className="submenu-icon" /> Add Client
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/displayclient" onClick={handleSidebarClose}>
                                        <FaListAlt className="submenu-icon" /> Display Client
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Income Page */}
                    <li>
                        <Link to="/income" onClick={handleSidebarClose}>
                            <FaMoneyCheckAlt className="sidebar-icon" /> Income  {/* Added the income icon here */}
                        </Link>
                    </li>

                    {/* Expense Page */}
                    <li>
                        <Link to="/expense" onClick={handleSidebarClose}>
                            <FaMoneyBillWave className="sidebar-icon" /> Expense
                        </Link>
                    </li>

                    {/* Report Section */}
                    <li>
                        <button
                            className="submenu-toggle"
                            onClick={(e) => {
                                e.stopPropagation();
                                setReportMenuOpen(!reportMenuOpen);
                            }}
                        >
                            <FaChartBar className="sidebar-icon" /> Report
                        </button>
                        {reportMenuOpen && (
                            <ul className="submenu">
                                <li>
                                    <Link to="/studentreport" onClick={handleSidebarClose}>
                                        <FaUserGraduate className="submenu-icon" /> Student
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/clientreport" onClick={handleSidebarClose}>
                                        <FaUsers className="submenu-icon" /> Client
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Payment History */}
                    <li>
                        <Link to="/paymenthistory" onClick={handleSidebarClose}>
                            <FaHistory className="sidebar-icon" /> Payment History
                        </Link>
                    </li>
                    <li>
    <Link to="/invoice" onClick={handleSidebarClose}>
        <FaFileInvoice className="sidebar-icon" /> Invoice
    </Link>
</li>

                    {/* Logout */}
                    <li>
                        <Link to="/" onClick={handleSidebarClose}>
                            <FaSignOutAlt className="sidebar-icon" /> Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
