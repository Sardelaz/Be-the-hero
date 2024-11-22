import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

import api from "../../services/api";
import "./styles.css";

import logoImg from "../../assets/logo.svg"; // Verifique se o caminho está correto
import heroesImg from "../../assets/heroes.png"; // Verifique se o caminho está correto

export default function Logon() {

    const [id, setId] = useState('')
    const navigate  = useNavigate()

    async function handleLogin(e){
        e.preventDefault();

        try{
            const response = await api.post('sessions', { id });

            localStorage.setItem('ongId', id)
            localStorage.setItem('ongName', response.data.name)

            navigate('/profile')

        }catch(err){
            alert('Falha no login, tente novamente')
        }
    }

    return (
        <div className="logon-container">
            {/* Formulário de login */}
            <section className="form">
                <img src={logoImg} alt="Be The Hero" />

                <form onSubmit={handleLogin}>
                    <h1>Faça seu login</h1>

                    {/* Input para a ID */}
                    <input 
                    placeholder="Sua ID"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    />

                    {/* Botão para entrar */}
                    <button className="button" type="submit">
                        Entrar
                    </button>

                    {/* Link para a página de registro */}
                    <Link className="back-link" to="/register">
                        <FiLogIn size={16} color="#E02041" />
                        Não tenho cadastro
                    </Link>
                </form>
            </section>

            {/* Imagem de destaque */}
            <img src={heroesImg} alt="Heroes" />
        </div>
    );
}
