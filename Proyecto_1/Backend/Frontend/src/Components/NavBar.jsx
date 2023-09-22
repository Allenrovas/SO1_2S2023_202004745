import React from "react";
import { Link } from "react-router-dom";


function NavBar() {
    
  return (
    <>
        <nav class="navbar navbar-dark navbar-expand bg-dark">
            <div class="container-fluid">
                <Link to="/" style={{textDecoration: "none"}}> <a  class="navbar-brand" aria-current="index">Módulos de Kernel</a>
                    </Link>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <Link to="/" style={{textDecoration: "none"}}> <a class="nav-link active" aria-current="/index">Tiempo Real</a>
                    </Link>
                    <Link to="/historial" style={{textDecoration: "none"}}> <a class="nav-link active" aria-current="historial">Historial</a>
                    </Link>
                </ul>
                </div>
            </div>
            <div className="container-fluid">
                <div class="collapse navbar-collapse ml-auto" id="navbarNav">
                    <ul class="navbar-nav"style={{ marginLeft: "auto", marginRight: "0" }}>
                    <li className="nav-item">
                    <a class="nav-link active" aria-current="page">Sistemas Operativos 1</a>
                    </li>
                    <li className="nav-item">
                    <a class="nav-link active" aria-current="page">Proyecto 1</a>
                    </li>
                    <li className="nav-item">
                    <a class="nav-link">Allen Giankarlo Román Vásquez</a>
                    </li>
                    <li className="nav-item">
                    <a class="nav-link">202004745</a>
                    </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
  );
}

export default NavBar;