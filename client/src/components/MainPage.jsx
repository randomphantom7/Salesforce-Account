import React, { useEffect, useState } from "react";
import axios from 'axios';



function MainPage() {
    const [accounts, setAccounts] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [token, setAccessToken] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        stateProvince: "",
        type: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert("Enter a Name");
            return;
        }
      
        const isDuplicate = accounts && accounts.some(account => account.Name === formData.name);
      
        if (isDuplicate) {
          alert("Account with the same name already exists. Please enter a unique name.");
        } else {
          if (token) {
            console.log("Form submitted:", formData);
            const insertResponse = await axios.post("http://localhost:5000/addaccount", formData, { headers: { Authorization: token } });
          }
          closePopup();
        }
      };
      

    

    const getAccounts = async () => {
        console.log("getting accounts");
        if(token){
            let accounts = await axios.get("http://localhost:5000/getaccounts", { headers: { Authorization: token } });
            accounts = accounts && accounts.data && accounts.data.records;
            setAccounts(accounts);
            console.log(accounts);
        }
    }

    const login = async () => {
        console.log("able to login");
        const payload = {
          grant_type: "password",
          client_id: "3MVG9cHH2bfKACZZCm1rU4HlRaQxMrst1ONLX_7HgipBHgV38xTipEUfh7G6NSx6eQnvpxclPerlsLo3Ke0T3",
          client_secret: "0002B7152FCC8DC593F0DC18E3CD5648A4202CF891E1EE752BF68128E42D6265",
          username: "intervieworg@xceedesorg.com",
          password: "40AdZ%25tzHMmIiCsC"
        };
        let loginToken = await axios.post("http://localhost:5000/login", payload);
        console.log(loginToken.data.access_token);
        const accessToken = `Bearer ${loginToken.data.access_token}`;
        setAccessToken(accessToken);
      };
      
      useEffect(() => {
        if (token) {
          getAccounts();
        }
      }, [token]);
      

    const openPopup = () => {
        console.log("clicked");
        setShowPopup(true);
    }

    const closePopup = () => {
        setShowPopup(false);
    }

    

    useEffect(() => {
        getAccounts();
    }, []);
    
    return (
        <>
            <div className="mainPage">
                <header>
                    <h1>XCEEDE SOLUTIONS</h1>
                    <button className="token-btn btn-style" onClick={login}>Login</button>
                </header>
                <section>
                    <div className="top-section row">
                        <div className="top-title col-sm-6">
                            <h1>Accounts</h1>
                        </div>
                        <div className="top-btn col-sm-6">
                            <button id="refreshBtn" className="btn-style top-btn" onClick={getAccounts}>Refresh</button>
                            <button id="newAccountBtn" className="btn-style top-btn" onClick={() => openPopup()}>Add New</button>
                        </div>
                    </div>
                    <div id="newAccountModal" className={showPopup ? "modal show" : "modal"}>
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <div className="popup-heading-div">
                            <h3 className="popup-heading">Account Information</h3>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col-sm-6">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <br></br>
                            <div className="col-sm-6">
                                <label htmlFor="stateProvince">State/Province</label>
                                <input
                                    type="text"
                                    id="stateProvince"
                                    name="stateProvince"
                                    value={formData.stateProvince}
                                    onChange={handleChange}
                                />

                                <label htmlFor="type">Type</label>
                                <input
                                    type="text"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                        <button className="popup-btn col-sm-6" type="submit">Submit</button>
                        <button className="popup-btn col-sm-6" id="cancelBtn" onClick={closePopup}>Cancel</button>
                        </div>
                        
                    </form>
                    </div>
                    <table id="accountsTable">
                        <thead>
                            <tr>
                                <th className="table-heading"><b>S.NO</b></th>
                                <th className="table-heading"><b>ACCOUNT NAME</b></th>
                                <th className="table-heading"><b>PHONE</b></th>
                                <th className="table-heading"><b>BILLING STATE/PROVINCE</b></th>
                                <th className="table-heading"><b>TYPE</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts &&
                                accounts.map((row, i) => (
                                    <tr key={row.Id}>
                                        <th>{i + 1}</th>
                                        <th>{row.Name}</th>
                                        <th>{row.Phone}</th>
                                        <th>{row.BillingState}</th>
                                        <th>{row.Type}</th>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </section>

                <section></section>
            </div>
        </>
    )
}

export default MainPage;
