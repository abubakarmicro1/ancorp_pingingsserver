const https = require('https')
const httpsAgent = require('https-agent')
const token = Buffer.from(`Vendor.Webconnect:A7uop14`, 'utf8').toString('base64')

// TEST
// const wooClientKey = 'ck_4c5ff566e6369faa3512561ae3fa60ed9731a28d';
// const wooClientSecret = 'cs_9ecb5ec44750ae8dbc7901bbc17720114e6519ef';
// const wooCommerceUrl = "https://ancorp-sandbox.opt7dev.com/wp-json/wc/v3"
// const theHost = "https://ANC-WIL-APP03.ancorp.com/KineticTest"
// const productionHost = "https://ANC-WIL-APP03.ancorp.com/Production"
// const theTestHost = "https://ANC-WIL-APP03.ancorp.com/KineticTest"


// PRODUCTION
const wooClientKey = 'ck_cae826124bddf2b1a3d8d1bc6fbae5787e30deeb';
const wooClientSecret = 'cs_e56757445d9e0b1c00f84644e811c36987467077';
const wooCommerceUrl = "https://ancorp.com/wp-json/wc/v3"
const theHost = "https://ANC-WIL-APP03.ancorp.com/Production"
const productionHost = "https://ANC-WIL-APP03.ancorp.com/Production"
const theTestHost = "https://ANC-WIL-APP03.ancorp.com/Production"

const wiseUrl = "https://www.wiseoption.com.ng/ancorp"
const herokuUrl = "https://ancorppingingserver.vercel.app"

const { MongoClient } = require("mongodb")

const mongoUrl = "mongodb+srv://abubakarMicro1:klfhbughreuigert@ancorpdata.opkex0f.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(mongoUrl);

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': '1qDrPHzstU8GwoTyDVucjcIhon8ta0hBxj1GWK2Inraur',
        'Authorization': `Basic ${token}`
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
}

function basicAuth(key, secret) {
  let hash = btoa(key + ':' + secret);
  return "Basic " + hash;
}

let auth = basicAuth(wooClientKey, wooClientSecret);


const wooCommerceConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'x-api-key': 'ck_4c5ff566e6369faa3512561ae3fa60ed9731a28d',
    'Authorization': auth
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
}

module.exports = {mongoUrl, herokuUrl, mongoClient, theHost, productionHost, config, token, wooCommerceUrl, wooCommerceConfig, wiseUrl }

