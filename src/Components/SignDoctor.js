import React, { useEffect } from "react";
import { useState } from "react";
// import "./SignDoctor.css";
import './allcss.css';
import Web3 from "web3";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ADD, ABI } from "./AddAndAbi";




const SignDoctor = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [special, setSpecial] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [user, setUser] = useState('');
    const [exp, setExp] = useState('');
    const [fee, setFee] = useState('');
    const [availability, setAvailability] = useState('');
    const [gender, setGender] = useState('');
    const [certify, setCertify] = useState('');

    const navigate = useNavigate();

    const sweetAlertSuccess = () => {
        Swal.fire({
            title: "Success",
            text: `${username} has been registered`,
            icon: "success"
        })
    }
    const sweetAlertError = (res = "Oops Error Occured. Please Try Again.") => {
        Swal.fire({
            title: "Error",
            text: res,
            icon: "error"
        })
    }
    const detectProvider = () => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
            // console.log("window.ethereum");
        } else if (window.web3) {
            provider = window.web3.currentProvider;
            // console.log("window.web3");
        } else {
            console.log("non-ethereum browser");
        }
        return provider;
    }

    const onConnect = async (userID, username, password, special, exp, fee, availability, gender, certify) => {
        try {
            const currProvider = detectProvider();
            if (currProvider) {
                await currProvider.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(currProvider);
                const userAccounts = await web3.eth.getAccounts();
                const ContractInstance = new web3.eth.Contract(ABI, ADD);
                const existingUser = await ContractInstance.methods.checkPasswordDoctor(userID).call();
                if (existingUser === '') {
                    const response = await ContractInstance.methods.newRegistrationDoctor(username, userID, password, special, parseInt(exp), parseInt(availability), parseInt(fee), parseInt(gender), parseInt(certify)).send({ from: userAccounts[0], gas: 3000000 });
                    console.log(`${username} has been registered`);
                    sweetAlertSuccess();
                    navigate('/logDoctor');
                } else {
                    sweetAlertError(`${username} already exists. Try loging in.`);
                    navigate('/logDoctor');
                }
            }
        } catch (error) {
            console.log("Error at signDoctor");
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(username, password, rePassword, special, exp, fee, availability, fee, gender, certify);
        // return;
        
        // if (!(username && password && special && rePassword && special && exp && fee && availability && gender && certify)) {
        //     sweetAlertError("Please fill all fields");
        //     return;
        // }
        // console.log("Username:", username);
        // console.log("Password:", password);
        // console.log("special:", special);
        // console.log("user:", user);
        if (rePassword === password) {
            await onConnect(username, user, password, special, exp, fee, availability, gender, certify);
        } else {
            console.log("Password do not match");
            sweetAlertError("Password do not match");
        }
    }

    const rePasswordHandler = (e) => {
        setRePassword(e.target.value);
        if (e.target.value !== password) { setPwdMsg("Password doesn't match."); }
        else setPwdMsg('');
    }
    const passwordHandler = (e) => {
        setPassword(e.target.value);
        if (password === "") setPwdMsg('');
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return (
        <>
            <h1 className="legal-siteTitle">
                <Link to="/">
                    Medicia <span className="legal-siteSign">+</span>
                </Link>
            </h1>
            <div className="innerDiv">
                <div className="signinDoc ">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2 className="form-title1">Register as a Doctor</h2>
                        <div className="signinDoc-grid">
                            {/* id */}
                            <div className="form-group">
                                <label htmlFor="username" className="form-label2">License ID</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="form-input"
                                    placeholder="Enter your ID"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            {/* name */}
                            <div className="form-group">
                                <label htmlFor="user" className="form-label2">Full Name</label>
                                <input
                                    type="text"
                                    id="user"
                                    className="form-input"
                                    placeholder="Enter your Name"
                                    value={user}
                                    onChange={e => setUser(e.target.value)}
                                    required />
                            </div>

                            {/* password */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label1">Create Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={passwordHandler}
                                    required
                                />
                            </div>

                            {/* repass */}
                            <div className="form-group">
                                <label htmlFor="rePassword" className="form-label1">Re-Enter Password</label>
                                <input
                                    type="password"
                                    id="rePassword"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={rePassword}
                                    onChange={rePasswordHandler}
                                    required
                                />
                            </div>

                            {/* error msg password !== repassword */}
                            <p className="passwordErrorMsg">{pwdMsg}</p>

                            {/* Gender */}
                            <div className="form-group-select">
                                <label htmlFor="gender" className="form-label2">Gender</label>
                                <select className="form-input" id="special1" onClick={e => setGender(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="1">Male</option>
                                    <option value="0">Female</option>
                                    <option value="2">Other</option>
                                </select>
                            </div>

                            {/* Certified */}
                            <div className="form-group-select">
                                <label htmlFor="certify" className="form-label2">Certified</label>
                                <select className="form-input" id="special2" onClick={e => setCertify(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>

                            {/* experience */}
                            <div className="form-group">
                                <label htmlFor="exp" className="form-label2">Experience</label>
                                <input
                                    type="number"
                                    id="exp"
                                    className="form-input"
                                    placeholder="Enter your exp in Years"
                                    value={exp}
                                    onChange={e => setExp(e.target.value)}
                                    required />
                            </div>

                            {/* fee */}
                            <div className="form-group">
                                <label htmlFor="fee" className="form-label2">Fee</label>
                                <input
                                    type="number"
                                    id="fee"
                                    className="form-input"
                                    placeholder="Enter your Fee"
                                    value={fee}
                                    onChange={e => setFee(e.target.value)}
                                    required />
                            </div>

                            {/* availability */}
                            <div className="form-group">
                                <label htmlFor="availability" className="form-label2">Availability</label>
                                <input
                                    type="number"
                                    id="availability"
                                    className="form-input"
                                    placeholder="Hours per day"
                                    value={availability}
                                    onChange={e => setAvailability(e.target.value)}
                                    required />
                            </div>

                            {/* specialization */}
                            <div className="form-group-select">
                                <label htmlFor="category" className="form-label2">Specialization</label>
                                <select className="form-input" id="special" onClick={e => setSpecial(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="cardiologist">Cardiologist</option>
                                    <option value="physician">Physician</option>
                                    <option value="dermatologist">Dermatologist</option>
                                    <option value="pulmonologist">Pulmonologist</option>
                                    <option value="neurologist">Neurologist</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-submit" id="submitloginDoc">Create an Account</button>
                        </div>
                    </form>
                    <div className="logDoc">
                        Already have an account?<Link to="/logDoctor" id=""> Log in</Link>
                    </div>
                </div>
            </div >
            <div className="legal-footer">
                <p>© 2024 Medicia+. All rights reserved.</p>
            </div>
        </>
    );
}

export default SignDoctor;