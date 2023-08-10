import React from 'react'
import "./navBar.css";

const NavBar = ({address, handleConnectButton, btnText}) => {
  return (
    <nav>
        <div class="brand-name">Car Service</div>
        <div class="actionButtons">
            <p style={{display:"inline"}}>{address}</p>
            <button onClick={handleConnectButton} class="connectButton">{btnText}</button>
        </div>
    </nav>
  )
}

export default NavBar