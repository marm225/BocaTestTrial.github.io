import React from 'react';
import { Link } from 'react-router-dom';


const Navigation = () => {
    return ( <div>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/boca/new">BoCa</Link>
            </li>
        </ul>
    </div>);
};

export default Navigation;
