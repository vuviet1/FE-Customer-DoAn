/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import Topbar from "./components/topbar";
import Footer from "./components/footer";
// import { Link } from "react-router-dom";

function HomeAdmin() {

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    {/* Topbar */}
                    <Topbar />
                    {/* Topbar */}

                    {/* Container Fluid*/}

                    {/* Container Fluid*/}

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
            {/* Scroll to top */}
            <a href="#page-top" className="scroll-to-top rounded" onClick={handleScrollToTop}>
                    <i className="fas fa-angle-up" />
                </a>
        </div>
    );
}
export default HomeAdmin;
