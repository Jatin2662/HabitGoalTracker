

import React, { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

function Loader({ text }) {

    return (
        <section className="deleteHabit-overlay centered">
            <div className="loader">
                <h2>{text}</h2>
                <ClipLoader
                    color="#ffffff"
                    cssOverride={override}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </section>
    );
}

export default Loader;