const express = require("express");
const app = express();
const axios = require("axios");
const cors = require('cors');


global.__basedir = __dirname;

const PORT = process.env.PORT || 5000;
const tokenreqUrl = "https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9cHH2bfKACZZCm1rU4HlRaQxMrst1ONLX_7HgipBHgV38xTipEUfh7G6NSx6eQnvpxclPerlsLo3Ke0T3&client_secret=0002B7152FCC8DC593F0DC18E3CD5648A4202CF891E1EE752BF68128E42D6265&username=intervieworg@xceedesorg.com&password=40AdZ%25tzHMmIiCsC";
const getaccountUrl = "https://xceedesolutions2-dev-ed.my.salesforce.com/services/data/v59.0/query?q=SELECT+Id,Name,Phone,BillingState,Type+FROM+Account";
const addaccountUrl = "https://xceedesolutions2-dev-ed.my.salesforce.com/services/data/v59.0/sobjects/Account/";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.post("/login", async (req, res) => {
    const { grant_type, client_id, client_secret, username, password } = req.body;
    const tokenRes = await axios.post(tokenreqUrl, req.body);
    console.log(tokenRes);
    res.send(tokenRes.data);
})

app.get("/getaccounts", async (req,res) => {
    console.log(req.headers);
    const accountList = await axios.get(getaccountUrl, { headers: {"Authorization" : `${req.headers.authorization}`} });
    console.log(accountList.data);
    res.send(accountList.data);
})

app.post("/addaccount", async(req,res) => {
    console.log(req.body.name);
    const { name, phone, type, stateProvince } = req.body;
    const payload = { Name: name, Phone: phone, Type: type, BillingState: stateProvince };
    console.log(payload);
    const addAccount = await axios.post(addaccountUrl, payload, { headers: {"Authorization" : `${req.headers.authorization}`} });
    console.log(addAccount);
    res.send(addAccount.data);
   
})

app.listen(PORT, () => {
    console.log(`app is listening to port ${PORT}`);
})