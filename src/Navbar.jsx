import { Link, useNavigate } from 'react-router';
import {SITE_TITLE} from '../config';
import { useState } from 'react';
import LogoImage from './assets/logo.png';
import { API_URL } from '../config';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();

    async function handleSearch() {
        if (!search.trim()) return;
        
        // Try to match player puuid
        let res = await fetch(`${API_URL}/api/player/${search.trim()}`);
        if (res.ok) {
            navigate(`/player/${search.trim()}`);
            return;
        }

        // Try again to match player name
        res = await fetch(`${API_URL}/api/players`);
        if (res.ok) {
            const players = await res.json();
            const found = players.find(p => p.current_name.toLowerCase() === search.trim().toLowerCase());
            if (found) {
                navigate(`/player/${found._id}`);
                return;
            }
        }

        alert("User not found!");
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const [search, setSearch] = useState('');
    return (
    <div className='navbar'>
        <div className='navbar-left'>
            <img className='navbar-logo' src={LogoImage} />
            <span className='navbar-title'>{SITE_TITLE}</span>
            <input
                className="navbar-search"
                type="text"
                placeholder="Search for players"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
        <div className='navbar-links'>
            <Link to="/">Home</Link>
            <Link to="/players">Stats</Link>
        </div>
    </div>
    );
}

export default Navbar;