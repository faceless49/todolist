import React from "react";

function Header(props:any) {
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
        </div>
    )
}

export default Header;
