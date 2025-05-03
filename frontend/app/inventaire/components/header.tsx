"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../main/assets/logo.png";
import logoInventaire from "../assets/logoInventaire.png";
import clocheNotification from "../assets/clocheNotification.png";
import clocheSansNotification from "../assets/clocheSansNotification.png";

import "../css/header.css";
type headerPros = {
    alertStock?: boolean;
    stockFaibleClick?: () => void;
}
const Header: React.FC<headerPros> = ({alertStock = false, stockFaibleClick}) => {
    const router = useRouter();
    
    const alert = alertStock ? clocheNotification : clocheSansNotification
    const alertAlt = alertStock ? 'clocheNotification':'clocheSansNotification'
    
    return (
        <header className="Header">
            <div className="left">
                <Image
                    src={logo}
                    alt="logo"
                    onClick={() => router.push("/")}
                    className="cursor-pointer"
                />
            </div>

            <h1 className="title">Inventaire</h1>

            <div className="right">
                <button className="boutonLogin" onClick={() => router.push("/listeprod")}>
                    Login
                </button>
                <Image
                    src={logoInventaire}
                    alt="logoInventaire"
                    onClick={() => router.push("/listeprod")}
                    className="cursor-pointer"
                />
                <div className="vertical-bar"></div>
                <Image
                    src={alert}
                    alt={alertAlt}
                    onClick={() => {alertStock && stockFaibleClick ? stockFaibleClick() : router.push("/listeprod")}}
                    className="cursor-pointer"
                />
            </div>
        </header>
    );
};

export default Header;
