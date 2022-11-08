const https = require('https')
const httpsAgent = require('https-agent')
const token = Buffer.from(`Vendor.Webconnect:A7uop14`, 'utf8').toString('base64')
const wooCommerceUrl = "https://ancorp-sandbox.opt7dev.com/wp-json/wc/v3"

const theHost = "https://anc-wil-app03/KineticTest"
const productionHost = "https://anc-wil-app03/KineticProduction"
const wiseUrl = "https://www.wiseoption.com.ng/ancorp"
const herokuUrl = "https://calm-reef-52400.herokuapp.com"

const { MongoClient } = require("mongodb")

const mongoUrl = "mongodb+srv://abubakarMicro1:GlGO0HTkM17tFzol@ancorpdata.opkex0f.mongodb.net/?retryWrites=true&w=majority";
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

const wooClientKey = 'ck_4c5ff566e6369faa3512561ae3fa60ed9731a28d';
const wooClientSecret = 'cs_9ecb5ec44750ae8dbc7901bbc17720114e6519ef';

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

