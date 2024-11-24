import React, { useEffect, useState } from "react";
// import './ProfilePatient.css';
import './allcss.css';
import PopupModal from "./PopupModal";
import Web3 from "web3";
import { ABI, ADD } from "./AddAndAbi";
import PopupModalRating from "./PopupModalRating";
import PopupResetPassword from "./PopupResetPassword";
import PopupCrossCheck from "./PopupCrossCheck";
import Swal from "sweetalert2";


const ProfileDoctor = (prop) => {
    const id = prop.id;
    // const id = "1";

    let docArray = [];
    var notificationTrail = [];
    var reportsTrail = [];


    const [contributionStatus, setContributionStatus] = useState(false);
    const [addMore, setAddMoreStatus] = useState(false);
    const [clearButton, setClearButton] = useState(false);
    const [noti, setNoti] = useState(true);

    // const [patientId, setpatientId] = useState('');
    // const [problem, setProblem] = useState('');
    // const [desc, setdesc] = useState('');

    const [activeD, setActiveD] = useState('noti');
    // const [showNotification, setShowNotification] = useState([{ id: 'loading...', problem: 'Loading...', desc: 'Loading...' }]);
    const [showNotification, setShowNotification] = useState([]);

    const [showReports, setShowReports] = useState([]);

    // selected doctor id for rating
    const [raingDocId, setRaingDocId] = useState(0);
    const [doctorSelection, setDoctorSelection] = useState('');
    // const [doctorList, setDoctorList] = useState([
    //     { rating: "4.5", name: "Dr Berlin Pandey", spec: "cardiologist" },
    //     { rating: "4.3", name: "Dr Ayesha Khan", spec: "cardiologist" },
    //     { rating: "4.7", name: "Dr Rajesh Kapoor", spec: "cardiologist" },
    //     { rating: "4.6", name: "Dr Pooja Desai", spec: "cardiologist" },
    //     { rating: "4.4", name: "Dr Vikas Singh", spec: "cardiologist" },

    //     { rating: "4.0", name: "Dr Suresh Gupta", spec: "pulmonologist" },
    //     { rating: "4.1", name: "Dr Anil Mehta", spec: "pulmonologist" },
    //     { rating: "3.9", name: "Dr Sunita Sharma", spec: "pulmonologist" },
    //     { rating: "4.3", name: "Dr Vishal Rai", spec: "pulmonologist" },
    //     { rating: "4.2", name: "Dr Reena Joshi", spec: "pulmonologist" },

    //     { rating: "4.7", name: "Dr Anjali Mehta", spec: "neurologist" },
    //     { rating: "4.5", name: "Dr Rohan Nair", spec: "neurologist" },
    //     { rating: "4.6", name: "Dr Neha Kulkarni", spec: "neurologist" },
    //     { rating: "4.4", name: "Dr Arvind Patel", spec: "neurologist" },
    //     { rating: "4.3", name: "Dr Kiran Rao", spec: "neurologist" },

    //     { rating: "4.8", name: "Dr Preeti Sharma", spec: "dermatologist" },
    //     { rating: "4.6", name: "Dr Sanjay Verma", spec: "dermatologist" },
    //     { rating: "4.5", name: "Dr Anisha Roy", spec: "dermatologist" },
    //     { rating: "4.7", name: "Dr Shweta Aggarwal", spec: "dermatologist" },
    //     { rating: "4.4", name: "Dr Manish Gupta", spec: "dermatologist" },

    //     { rating: "4.2", name: "Dr Anil Menon", spec: "physician" },
    //     { rating: "4.3", name: "Dr Kavita Rao", spec: "physician" },
    //     { rating: "4.1", name: "Dr Vikram Singh", spec: "physician" },
    //     { rating: "4.5", name: "Dr Sneha Iyer", spec: "physician" },
    //     { rating: "4.0", name: "Dr Amit Sinha", spec: "physician" }
    // ]);

    // const [doctorList, setDoctorList] = useState([]);
    // setDoctorList(prop.docDetails);

    const [displayList, setDisplayList] = useState(false);
    const [selectedDoctorIndex, setSelectedDoctor] = useState('');

    const [popup, setpopup] = useState(false);
    const [selectedDoctorName, setSelectedDoctrName] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [selectedSpec, setSelectedSpec] = useState('');

    const [doctorFetchedDetails, setDoctorFetchedDetails] = useState([]);
    const [doctorAllRatingFetched, setDoctorAllRatingFetched] = useState([]);
    const [ratePopupStatus, setRatePopupStatus] = useState(false);

    const [finalDoctorMapping, setFinalDoctorMapping] = useState([]);
    const [finalRatingMapping, setFinalRatingMapping] = useState([]);
    const [topsisIndexProvider, setTopsisIndexProvider] = useState([]);

    const [resetPopupStatus, setResetPopupStatus] = useState(false);
    const [crossCheckStatus, setCrossCheckStatus] = useState(false);

    const [crossReport, setCrossReport] = useState();
    const [notificationIndex, setNotificationIndex] = useState(0);

    // for handling the checkbox states in filter section
    const [checkboxStates, setCheckboxStates] = useState({
        experience: false,
        certified: false,
        time: false,
        fees: false,
        perDay: false,
        overAll: false,
        contribution: false,
    });

    const clickhandler = () => {
        prop.setLoginStatus(false);
    }

    const addPatient = () => {
        onConnect(); // retrieving all doctor details
        setAddMoreStatus(true);
        setContributionStatus(false);
        setClearButton(true);
        setNoti(false);
        setActiveD('add');
    }

    const viewContri = async () => {
        setAddMoreStatus(false);
        setContributionStatus(true);
        setClearButton(true);
        setNoti(false);
        setActiveD('uploads');
        setDisplayList(false);
        reportHandler();
    }

    const reportHandler = async () => {
        try {
            const currProvider = detectProvider();
            if (currProvider) {
                await currProvider.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(currProvider);
                const userAccounts = await web3.eth.getAccounts();
                const ContractInstance = new web3.eth.Contract(ABI, ADD);

                setShowReports(reportsTrail);
                reportsTrail = await ContractInstance.methods.getReportPatient(id).call();
                if (!reportsTrail) {
                    reportsTrail = [];
                    console.log("nothing is found in reports section in Contract");
                }
                // console.log("after fwtching->", reportsTrail);
                setShowReports(reportsTrail);

            }
        } catch (error) {
            console.log("Error at blockchain Helper at patient profile");
            console.error(error);
        }
    }
    // const mixed = (rate, all) => {
    //     let res = all.map((element, i) => (
    //         { ...element, ...rate[i] }
    //     ));
    //     return res;
    // }
    /**
     * Handles the TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) method for ranking.
     * 
     * @param {Array} tempArrayRating - Array of objects containing rating information.
     * @param {Array} tempArrayAll - Array of objects containing all relevant information.
     * 
     * The function calculates the normalized decision matrix, determines the ideal and anti-ideal solutions,
     * computes the separation measures, and finally calculates the TOPSIS score for each alternative.
     * The results are sorted in descending order of the TOPSIS score and set using the setTopsisIndexProvider function.
     * 
     * Each object in tempArrayRating should have the following properties:
     * - fee: {string|number} The fee value.
     * - time: {string|number} The time value.
     * 
     * Each object in tempArrayAll should have the following properties:
     * - experience: {string|number} The experience value.
     * - hrPerDay: {string|number} The hours per day value.
     * - finalRating: {string|number} The final rating value.
     * - certified: {string|number} The certified value.
     * 
     * @returns {void}
     */
    const topsisHandler = (tempArrayRating, tempArrayAll) => {

        let F = 0, T = 0, E = 0, H = 0, R = 0, C = 0, Fees = 0;
        for (let i = 0; i < tempArrayRating.length; i++) {
            F += (parseFloat(tempArrayRating[i].fee) / 10) ** 2;
            T += (parseFloat(tempArrayRating[i].time) / 10) ** 2;
            E += (parseFloat(tempArrayAll[i].experience)) ** 2;
            H += (parseFloat(tempArrayAll[i].hrPerDay)) ** 2;
            R += (parseFloat(tempArrayAll[i].finalRating) / 10) ** 2;
            C += (parseFloat(tempArrayAll[i].certified)) ** 2;
            Fees += (parseFloat(tempArrayAll[i].fees)) ** 2;
        }

        F = Math.sqrt(F);
        T = Math.sqrt(T);
        E = Math.sqrt(E);
        H = Math.sqrt(H);
        R = Math.sqrt(R);
        C = Math.sqrt(C);
        Fees = Math.sqrt(Fees);

        let array2d = [];
        let idealMax = Array(7).fill(0);
        let idealMin = Array(7).fill(Infinity);

        for (let i = 0; i < tempArrayRating.length; i++) {
            let ele = [
                (parseFloat(tempArrayRating[i].fee) / 10) / F,
                (parseFloat(tempArrayRating[i].time) / 10) / T,
                (parseFloat(tempArrayAll[i].experience)) / E,
                (parseFloat(tempArrayAll[i].hrPerDay)) / H,
                (parseFloat(tempArrayAll[i].finalRating) / 10) / R,
                (parseFloat(tempArrayAll[i].certified)) / C,
                (parseFloat(tempArrayAll[i].fees)) / Fees
            ];

            array2d.push(ele.map((e, index) => index === 6 ? e * -0.25 : e * 0.25));

            for (let j = 0; j < 7; j++) {
                idealMax[j] = Math.max(idealMax[j], array2d[i][j]);
                idealMin[j] = Math.min(idealMin[j], array2d[i][j]);
            }
        }

        let finalScore = [];
        for (let i = 0; i < array2d.length; i++) {
            let pdistance = 0, ndistance = 0;
            for (let j = 0; j < 7; j++) {
                pdistance += (array2d[i][j] - idealMax[j]) ** 2;
                ndistance += (array2d[i][j] - idealMin[j]) ** 2;
            }
            pdistance = Math.sqrt(pdistance);
            ndistance = Math.sqrt(ndistance);
            let topsisScore = ndistance / (ndistance + pdistance);
            if (!topsisScore) topsisScore = 0;
            finalScore.push([topsisScore, i]);
        }
        finalScore.sort((a, b) => b[0] - a[0]);
        setTopsisIndexProvider(finalScore);
    }
    const onConnect = async () => {
        try {
            const currProvider = detectProvider();
            if (currProvider) {
                await currProvider.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(currProvider);
                // const userAccounts = await web3.eth.getAccounts();
                const ContractInstance = new web3.eth.Contract(ABI, ADD);
                const len = parseInt(await ContractInstance.methods.fetchAllDoctorLength().call());
                // console.log("length: ",len);

                for (let i = 0; i < len; i++) {
                    let doc = await ContractInstance.methods.fetchAllDoctorDetails(i).call();
                    docArray.push(doc);
                }
                // console.log("useEffefct: ",docArray);
                let tempRatingArray = [];
                for (let i = 0; i < len; i++) {
                    let rate = await ContractInstance.methods.fetchAllDoctorRating(i).call();
                    tempRatingArray.push(rate);
                }
                tempRatingArray = tempRatingArray.map((element, i) => (
                    { ...element, id: docArray[i].licenseId }
                ));
                // console.log("rating details", tempRatingArray);

                setDoctorAllRatingFetched(tempRatingArray);
                setDoctorFetchedDetails(docArray);
                /**
                    licenseId:"D1"
                    name:"Dr Berlin Pandey"
                    specialization:"cardiologist"
                    certified:1n 1->yes 0->NO
                    contribution:0n
                    experience:2n ->2years
                    finalRating:30n ->3star
                    gender:1n 1->male 0->female
                    fees:1500n ->1500rs
                    hrPerDay:6n ->hours
                 */
                // console.log("rating details", tempRatingArray);
                // console.log("details ->", docArray);
            }
        } catch (error) {
            console.log("Error at profile patient");
            console.error(error);
        }
    }
    // import { useState, useEffect } from 'react';

    function WSM(rating, docs, criteria) {

        let rankedDoctors = [];

        // Criteria ranges: [Min, Max] for each criterion
        const criteriaRanges = {
            experience: [0, 60],
            certified: [0, 1],
            time: [0, 5],
            fees: [0, 10000],
            perDay: [0, 24],
            overAll: [0, 5],
            contribution: [0, 1000]
        };
        // Weights for the 8 criteria (sum should ideally equal 1)
        const weights = {
            experience: 0.25,      // Experience is crucial for reliability.
            certified: 0.15,      // Certification ensures credibility.
            time: 0.1,            // Availability is moderately important.
            fees: 0.1,            // Cost should not overshadow quality.
            perDay: 0.1,          // Work hours matter but are less critical.
            overAll: 0.2,        // Overall rating is a major factor.
            contribution: 0.1,    // Contribution is valuable but secondary.
        };


        // Function to normalize scores
        function normalizeScores(doc, rate, criteriaRanges) {
            // console.log(doc);
            let experience = parseInt(doc.experience);
            let certified = parseInt(doc.certified);
            let fees = parseInt(doc.fees);
            let perDay = parseInt(doc.hrPerDay);
            let contribution = parseInt(doc.contribution);
            let time = parseInt(rate.time) / 10;
            let overAll = parseInt(rate.finalRating) / 10;

            // console.log(experience, certified, fees, perDay, contribution, time, overAll);

            if (criteria.experience) {
                experience = (experience - criteriaRanges.experience[0]) / (criteriaRanges.experience[1] - criteriaRanges.experience[0]);
            } else experience = 0;
            if (criteria.certified) {
                certified = (certified - criteriaRanges.certified[0]) / (criteriaRanges.certified[1] - criteriaRanges.certified[0]);
            } else certified = 0;
            if (criteria.fees) {
                fees = (criteriaRanges.fees[1] - fees) / (criteriaRanges.fees[1] - criteriaRanges.fees[0]);
            } else fees = 0;
            if (criteria.perDay) {
                perDay = (perDay - criteriaRanges.perDay[0]) / (criteriaRanges.perDay[1] - criteriaRanges.perDay[0]);
            } else perDay = 0;
            if (criteria.contribution) {
                contribution = (contribution - criteriaRanges.contribution[0]) / (criteriaRanges.contribution[1] - criteriaRanges.contribution[0]);
            } else contribution = 0;
            if (criteria.time) {
                time = (time - criteriaRanges.time[0]) / (criteriaRanges.time[1] - criteriaRanges.time[0]);
            } else time = 0;
            if (criteria.overAll) {
                overAll = (overAll - criteriaRanges.overAll[0]) / (criteriaRanges.overAll[1] - criteriaRanges.overAll[0]);
            } else overAll = 0;
            // console.log(experience, certified, fees, perDay, contribution, time, overAll);

            return {
                experience: experience,
                certified: certified,
                fees: fees,
                perDay: perDay,
                contribution: contribution,
                time: time,
                overAll: overAll
            }

        }

        // Function to calculate the weighted sum, ignoring missing criteria
        function calculateWeightedSum(normalizedScores) {
            let totalWeightedScore = 0;
            let totalWeight = 0;

            Object.keys(normalizedScores).forEach((key) => {
                if (normalizeScores[key] !== 0) {
                    totalWeightedScore += normalizedScores[key] * weights[key];
                    totalWeight += weights[key];
                }
            });

            // Avoid division by zero in case all scores are missing
            return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
        }

        // Function to rank doctors
        for(let i= 0;i<docs.length;i++){
            const normalizedScores = normalizeScores(docs[i], rating[i], criteriaRanges);
            rankedDoctors.push([calculateWeightedSum(normalizedScores), i]);
        }

        // Sort doctors by weighted sum in descending order
        rankedDoctors.sort((a, b) => b[0] - a[0]);
        // console.log(rankedDoctors);        
        setTopsisIndexProvider(rankedDoctors);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(doctorSelection);


        let tempdataDoc = [];
        let tempArrayForFilterRatings = [];
        // console.log("docArray ", docArray);
        // console.log("doctor fetched", doctorFetchedDetails); 
        // tempdataDoc = doctorFetchedDetails.filter(element => element.specialization === doctorSelection);
        tempdataDoc = doctorFetchedDetails.filter((element, index) => {
            if (element.specialization === doctorSelection) {
                tempArrayForFilterRatings.push(doctorAllRatingFetched[index]);
            }
            return element.specialization === doctorSelection;
        });
        // console.log("rating     ",tempArrayForFilterRatings);
        // console.log("tesing->",tempdataDoc);
        // setDoctorFetchedDetails(tempdataDoc);
        // console.log("all doctor list: ",doctorFetchedDetails);

        // adding licenseId to ratings to make it easier to map
        // tempArrayForFilterRatings =  tempArrayForFilterRatings.map((element, i) => (
        //     { ...element, id: tempdataDoc[i].licenseId }
        // ));
        let f = true;
        Object.keys(checkboxStates).forEach((key) => {
            if (checkboxStates[key]) {
                // console.log(key);
                f = false;
            }
        });
        if (f) {
            // here we used TOPSIS method
            topsisHandler(tempArrayForFilterRatings, tempdataDoc);
        } else {
            // here we have to use WSM method
            WSM(tempArrayForFilterRatings, tempdataDoc, checkboxStates);
        }
        setFinalRatingMapping(tempArrayForFilterRatings);
        setFinalDoctorMapping(tempdataDoc);
        // console.log("finalDoctor mapping-> ",finalDoctorMapping);

        setDisplayList(true);
    }

    const clearScreen = () => {
        setAddMoreStatus(false);
        setContributionStatus(false);
        setNoti(false);
        setClearButton(false);
        setDisplayList(false);
        // console.log(prop.docDetails);
    }

    const resetHandler = () => {
        setResetPopupStatus(true);
    }

    const notify = () => {
        setNoti(true);
        setAddMoreStatus(false);
        setContributionStatus(false);
        setClearButton(true);
        setActiveD('noti');
        setDisplayList(false);
        onConnectfetchNotification(id);
    }

    const ratingButtonHandler = (index) => {
        setRatePopupStatus(true);
        setRaingDocId(showReports[index].from_id);
        // console.log(showReports[index].from_id);
        // console.log(raingDocId);

    }

    const selectdoctorHandler = (e) => {
        setSelectedDoctor(e.target.value);
    }

    const bookAppointmentButton = () => {
        setpopup(true);
        console.log("index: " + selectedDoctorIndex);
        const tempDoctorList = doctorFetchedDetails.filter(element => element.specialization === doctorSelection);
        console.log(tempDoctorList);
        

        console.log(topsisIndexProvider[selectedDoctorIndex]);
        let finalIndex = topsisIndexProvider[selectedDoctorIndex][1];
        console.log("doctor details: " + tempDoctorList[finalIndex].finalRating, tempDoctorList[finalIndex].name, tempDoctorList[finalIndex].specialization);

        setSelectedDoctrName(tempDoctorList[finalIndex].name);
        setSelectedSpec(tempDoctorList[finalIndex].specialization);
        setSelectedDoctorId(tempDoctorList[finalIndex].licenseId);
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
        } else if (window.web3) {
            provider = window.web3.currentProvider;
        } else {
            console.log("non-ethereum browser");
            sweetAlertError("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
        return provider;
    }

    const onConnectfetchNotification = async (fetchId) => {
        try {
            const currProvider = detectProvider();
            if (currProvider) {
                await currProvider.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(currProvider);
                // const userAccounts = await web3.eth.getAccounts();
                const ContractInstance = new web3.eth.Contract(ABI, ADD);
                notificationTrail = [];
                setShowNotification(notificationTrail);
                notificationTrail = await ContractInstance.methods.getNotificationPatient(fetchId).call();
                if (!notificationTrail) {
                    notificationTrail = [];
                    console.log("nothing is found in notification section in Contract");
                }
                notificationTrail.reverse();
                // console.log("notification->", notificationTrail);
                setShowNotification(notificationTrail);
                // console.log("using state-> ", showNotification);

            }
        } catch (error) {
            console.log("Error at profile patient");
            console.error(error);
        }
    }

    const crossCheck = (index, input) => {
        setCrossReport(input);
        // console.log(crossReport);
        // console.log(input);
        // console.log("details->", doctorFetchedDetails);
        setCrossCheckStatus(true);
        setNotificationIndex(index);
    }

    // handling the checkbox states in filter section
    const handleCheckboxChange = (name, val) => {

        setCheckboxStates((prevStates) => ({
            ...prevStates,
            [name]: val,
        }));
        // console.log(checkboxStates); return;
    };

    // container for fetching ans storing all doctor details from blockchain
    useEffect(() => {
        // console.log("useEffect");
        // const detectProvider = () => {
        //     let provider;
        //     if (window.ethereum) {
        //         provider = window.ethereum;
        //     } else if (window.web3) {
        //         provider = window.web3.currentProvider;
        //     } else {
        //         console.log("non-ethereum browser");
        //     }
        //     return provider;
        // }
        // const onConnect = async () => {
        //     try {
        //         const currProvider = detectProvider();
        //         if (currProvider) {
        //             await currProvider.request({ method: 'eth_requestAccounts' });
        //             const web3 = new Web3(currProvider);
        //             // const userAccounts = await web3.eth.getAccounts();
        //             const ContractInstance = new web3.eth.Contract(ABI, ADD);
        //             const len = parseInt(await ContractInstance.methods.fetchAllDoctorLength().call());
        //             console.log("length: ",len);

        //             for (let i = 0; i < len; i++) {
        //                 let doc = await ContractInstance.methods.fetchAllDoctorDetails(i).call();
        //                 docArray.push(doc);
        //             }
        //             console.log("useEffefct: ",docArray);
        //             let tempRatingArray = [];
        //             for (let i = 0; i < len; i++) {
        //                 let rate = await ContractInstance.methods.fetchAllDoctorRating(i).call();
        //                 tempRatingArray.push(rate);
        //             }
        //             setDoctorAllRatingFetched(tempRatingArray);
        //             console.log(tempRatingArray);
        //             // console.log("details ->",docArray);
        //         }
        //     } catch (error) {
        //         console.log("Error at profile patient");
        //         console.error(error);
        //     }
        // }
        // onConnect();
        onConnectfetchNotification(id);
        // onConnect();
        // console.log("from useeffect",doctorFetchedDetails);
        // console.log(doctorFetchedDetails);
    }, []);



    return (
        <div className="profilePatWrapper">
            <div className="topRightDoctor">
                <div style={{ marginLeft: "2rem", fontSize: "1.4rem" }}>
                    Patient's Dash_Board
                </div>
                <div id="rightSide">
                    <div className="logOut" onClick={resetHandler}>Reset Password </div>
                    <div className="logOut" onClick={clickhandler}>Log out </div>
                </div>
            </div>
            {/* <hr /> */}
            <div className="profileNav">
                <div className="g1">Id:</div>
                <div id="g1-color" className="g1">{id}</div>
            </div>
            <div className="buttonKeeper">
                <button className="about" id={activeD === 'add' ? 'activeDiv' : ''} onClick={addPatient}>Seach Doctor</button>
                <button className="about" id={activeD === 'noti' ? 'activeDiv' : ''} onClick={notify}>Notifications</button>
                <button className="about" id={activeD === 'uploads' ? 'activeDiv' : ''} onClick={viewContri}>View Reports</button>
            </div>
            {/* show reports  */}
            <div>
                {
                    contributionStatus &&
                    <div className="notify">
                        <div className="contriHeading">
                            <div className="column">S.No.</div>
                            <div className="column">Doctor's Name</div>
                            <div className="column">Problem</div>
                            <div className="column">Report</div>
                            <div></div>
                            <div className="column">Cross Check</div>
                        </div>
                        {/* show reports */}
                        <div style={{ background: "#ecf0f3", height: "25rem" }}>
                            {
                                showReports.map((input, index) => {
                                    return (
                                        <div className="tupple" key={index}>
                                            <div className="column">{index + 1}</div>
                                            <div className="column">{input.from_name}</div>
                                            <div className="column">{input.problem}</div>
                                            <textarea className="column" disabled value={input.reports} />
                                            <button className="about" id="reportButton" onClick={() => ratingButtonHandler(index)}>Rate Doctor</button>
                                            <button className="about" id="reportButton" onClick={() => crossCheck(index, input)}>Cross Check</button>
                                        </div>
                                    );
                                })
                            }
                            {
                                ratePopupStatus && <PopupModalRating onClose={setRatePopupStatus} docId={raingDocId} />
                            }
                            {
                                crossCheckStatus && <PopupCrossCheck onClose={setCrossCheckStatus} crossReport={crossReport} notificationIndex={notificationIndex} pid={id} />
                            }
                        </div>
                    </div>

                }
                {
                    addMore &&
                    <div className="wrapperPatient">
                        <div className="signinDoctor ">
                            <form className="login-form" onSubmit={handleSubmit}>
                                <h2 className="formdoc">Enter Details</h2>
                                <div className="lookingFor">
                                    <label htmlFor="category">Looking for</label>
                                    <select className="category" id="category" onClick={e => setDoctorSelection(e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="cardiologist">Cardiologist</option>
                                        <option value="physician">Physician</option>
                                        <option value="dermatologist">Dermatologist</option>
                                        <option value="pulmonologist">Pulmonologist</option>
                                        <option value="neurologist">Neurologist</option>
                                    </select>
                                </div>
                                <div>
                                    <h4>Preference Criteria:</h4>
                                    <div className="filterOptions">
                                        <div className="checkStyle">
                                            <input type="checkbox" name="experience" className="checkboxStyle" checked={checkboxStates["experience"]} onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)} />
                                            <label htmlFor="">Experience</label>

                                        </div>
                                        <div className="checkStyle">
                                            <input type="checkbox" name="certified" className="checkboxStyle" checked={checkboxStates["certified"]} onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)} />
                                            <label htmlFor="">Certified</label>

                                        </div>
                                        <div className="checkStyle">
                                            <input type="checkbox" name="time" className="checkboxStyle" checked={checkboxStates["time"]} onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)} />
                                            <label htmlFor="">Time</label>

                                        </div>
                                        <div className="checkStyle">
                                            <input type="checkbox" name="fees" className="checkboxStyle" checked={checkboxStates["fees"]} onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)} />
                                            <label htmlFor="">Fees</label>

                                        </div>
                                        <div className="checkStyle">
                                            <input type="checkbox" name="perDay" className="checkboxStyle" checked={checkboxStates["perDay"]} onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)} />
                                            <label htmlFor="">Hrs/Day</label>

                                        </div>
                                        <div className="checkStyle">
                                            <input type="checkbox" name="overAll" className="checkboxStyle" checked={checkboxStates["overAll"]} onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)} />
                                            <label htmlFor="">Overall Rating</label>

                                        </div>
                                        <div className="checkStyle">
                                            <input type="checkbox" name="contribution" className="checkboxStyle" checked={checkboxStates["contribution"]} onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)} />
                                            <label htmlFor="">Contribution</label>

                                        </div>
                                    </div>
                                </div>
                                <div className="submitResetButton">
                                    <button className="submitDoc" type="submit" >Search</button>
                                    {/* <button className="submitDoc" onClick={resetHandler}>Reset Details</button> */}
                                </div>
                            </form>
                        </div>
                    </div>
                }
                {
                    noti &&
                    <div className="notify">
                        <div className="notifyHeader">
                            <div className="column">S.No.</div>
                            <div className="column">Status</div>
                            <div className="column">Rating</div>
                            <div className="column">Doctor's Name</div>
                            <div className="column">Issue</div>
                            <div className="column"> Description</div>
                        </div>
                        <div style={{ background: "#ecf0f3", height: "25rem" }}>
                            {
                                showNotification.map((value, index) => {
                                    return (
                                        <div className="nTupple" key={index}>
                                            <div className="column">{index + 1}</div>
                                            <div className="column" style={{ color: "blueviolet" }}>{value.status}</div>
                                            <div className="column">{parseInt(value.rating) / 10}</div>
                                            <div className="column">{value.from_name}</div>
                                            <div className="column">{value.problem}</div>
                                            <textarea className="column" disabled defaultValue={value.description} />
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                }
                <div style={{ background: "#ecf0f3", height: "auto", minHeight: "20rem" }}>
                    {
                        displayList &&
                        <div id="selectionCard" className="wrapperPatient">
                            <div className="signinDoctor">
                                {
                                    <div>
                                        <div className="headerDoc">
                                            <h3>Doctors: </h3>
                                            {/* <div className="form-label1">Selected</div> */}
                                            {/* <div className="form-label1">Ratings</div> */}
                                            {/* <div className="form-label1">Name</div> */}
                                            {/* <div className="form-label1">Specialization</div> */}
                                        </div>
                                        <div>
                                            {
                                                //licenseId: 'D1', 
                                                // name: 'Dr Berlin Pandey', 
                                                // specialization: 'cardiologist', 
                                                // contribution: 0n

                                                // doctorFetchedDetails.filter(element => element.specialization === doctorSelection).map((element, index) => {
                                                // finalDoctorMapping.map((element, index) => {

                                                topsisIndexProvider.map((element, index) => {
                                                    return (
                                                        <div className="option-container" key={index}>
                                                            <div className="option-section-1">
                                                                <input type="radio" className="radio" name="doctor" value={index} onChange={e => selectdoctorHandler(e)} />
                                                                <div className="nameCol">{finalDoctorMapping[element[1]].name}</div>
                                                                <div>{parseInt(finalDoctorMapping[element[1]].gender) === 1 ? "M" : "F"}</div>
                                                                <div className="specCol">{finalDoctorMapping[element[1]].specialization}</div>
                                                                <div className="finalRating">{parseInt(finalDoctorMapping[element[1]].finalRating) / 10}⭐</div>
                                                            </div>
                                                            <div className="option-section-2">
                                                                <div className="false"></div>
                                                                <div className="feeCol">Fees : Rs {parseInt(finalDoctorMapping[element[1]].fees)}</div>
                                                                <div>Contribution : {parseInt(finalDoctorMapping[element[1]].contribution)}</div>
                                                                <div>Hrs/Day : {parseInt(finalDoctorMapping[element[1]].hrPerDay)}</div>
                                                            </div>
                                                            <div className="option-section-3">
                                                                <div className="false"></div>
                                                                <div>Experience : {parseInt(finalDoctorMapping[element[1]].experience)}yrs</div>
                                                                <div>Certified : {parseInt(finalDoctorMapping[element[1]].certified) === 1 ? "Yes" : "No"}</div>
                                                            </div>
                                                            <div className="option-section-4">
                                                                <div className="false"></div>
                                                                <div className="timeCol">Time : {parseInt(finalRatingMapping[element[1]].time) / 10}⭐</div>
                                                                <div className="timeCol">Fee : {parseInt(finalRatingMapping[element[1]].fee) / 10}⭐</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                                <div className="doctorSubmit">
                                    <button onClick={bookAppointmentButton} className="submitDoc">Proceed to Book</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {
                    popup && <PopupModal onClose={setpopup} id={id} selectedDoc={selectedDoctorName} selectedSpec={selectedSpec} selectedDocId={selectedDoctorId} />
                }
                {
                    resetPopupStatus && <PopupResetPassword onClose={setResetPopupStatus} id={id} />
                }

                <div className="clearButton">
                    {
                        clearButton &&
                        <button className="about" onClick={clearScreen}>Clear Screen</button>
                    }
                </div>
            </div>
        </div>
    );
}

export default ProfileDoctor;
