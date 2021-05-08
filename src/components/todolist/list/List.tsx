import React from "react";

function List() {
    return (
        <div>
            <ul>
                <li><input type="checkbox" checked={true}/> <span>HTML&CSS</span></li>
                <li><input type="checkbox" checked={true}/> <span>JS</span></li>
                <li><input type="checkbox" checked={false}/> <span>React</span></li>
            </ul>
        </div>
    );
}

export default List;
