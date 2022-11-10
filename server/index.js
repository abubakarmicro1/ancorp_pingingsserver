const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors')

const axios = require('axios');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const { theHost, config, productionHost } = require("./constants");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const { MongoClient } = require("mongodb")

const mongoUrl = "mongodb+srv://abubakarMicro1:GlGO0HTkM17tFzol@ancorpdata.opkex0f.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(mongoUrl);

function getErrors(error) {
  if (error.response) {
    console.log(error.response.data);
    return error.response.data
  } else if (error.request) {
    console.log(error.request);
    return error.request
  } else {
    console.log('Error', error.message);
    return error.message
  }
}

app.get('/allcontacts', (req, res) => {
  async function findContacts(client) {
    try {
      await mongoClient.connect();

      const result = await client.db("ancorpData").collection("contactsCollection").find().toArray();
      if (result) {
        console.log(`Found the contacts.`)
        res.json(result)
      } else {
        console.log(`No Contacts Found`)
        res.json({ Message: "No Contacts Found" })
      }
    } catch (e) {
      console.log(e)
      res.json(e)
    }

  }
  findContacts(mongoClient)
})

app.post('/orderPushing', (req, res) => {
  // console.log(req)
  const dataToPush = req.body
  const nameToSearch = "nameLast"
  async function pushOrder(client) {
    await mongoClient.connect();
    try {
      await mongoClient.connect();

      await client.db('ancorpData').collection("ordersCollector").drop()
      const result = await client.db("ancorpData").collection("ordersCollector").insertOne({
        name: "ordersCollected",
        timestamping: new Date(),
        data: dataToPush.theOrders
      })

      console.log(`New orders with the following id: ${result.insertedId}`)
      res.json(
        {
          status: 1,
          Message: `New orders with the following id: ${result.insertedId}`
        })
    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: `Error adding Order: ${e}`
        }
      )
    } finally {
      await mongoClient.close()
    }
  }
  pushOrder(mongoClient)
})

app.get('/gettingOrders', (req, res) => {
  async function findOrders(client) {
    try {
      await mongoClient.connect();

      const result = await client.db("ancorpData")
        .collection("ordersCollector")
        .find({}, { _id: 0, data: true }).toArray()
      if (result) {
        res.json(result)
      } else {
        res.json({ Message: "No Orders Found" })
      }

    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: e
        }
      )
    }

  }
  findOrders(mongoClient)
})

app.get('/getPriceData', (req, res) => {
  async function findPriceData(client) {
    try {
      await mongoClient.connect();

      const result = await client.db("ancorpData").collection("priceUpdateCollec").findOne({ name: "priceData" });
      if (result) {
        console.log(`Found the PriceData.`)
        res.json(result.data)
      } else {
        console.log(`No PriceData Found`)
        res.json({ Message: "No PriceData Found" })
      }
    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: e
        }
      )
    }

  }
  findPriceData(mongoClient)
})

app.get('/getQuantityData', (req, res) => {
  async function findQuantityData(client) {
    try {
      await mongoClient.connect();

      const result = await client.db("ancorpData").collection("quantityUpdateCollec").findOne({ name: "quantityData" });
      if (result) {
        console.log(`Found the quantityData.`)
        res.json(result.data)
      } else {
        console.log(`No quantityData Found`)
        res.json({ Message: "No quantityData Found" })
      }
    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: e
        }
      )
    }

  }
  findQuantityData(mongoClient)
})

app.post('/postContacts', (req, res) => {
  const dataToPush = req.body.contacts
  async function postContacts(client) {
    await mongoClient.connect();
    try {
      await mongoClient.connect();

      await client.db('ancorpData').collection("EpicorPostContacts").drop()
      const result = await client.db("ancorpData").collection("EpicorPostContacts").insertMany(dataToPush)

      console.log(`New Contacts with the following id: ${result.insertedId}`)
      res.json(
        {
          status: 1,
          Message: `New Contatcs Inserted`
        })
    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: `Error adding Contacts: ${e}`
        }
      )
    } finally {
      await mongoClient.close()
    }
  }
  postContacts(mongoClient)
})

app.get('/getContactsByEmail', (req, res) => {
  const email = req.query.email
  async function searchEmail(email, client) {
    try {
      await mongoClient.connect();

      const result = await client.db("ancorpData").collection("contactsCollection").findOne({ CustCnt_EMailAddress: email });
      if (result) {
        console.log(`Found the Contact.`)
        res.json({
          status: 1,
          data: result
        })
      } else {
        console.log(`No Contatc Found`)
        res.json({
          status: 0,
          Message: `Contact cannot be found - ${email}`,
        })
      }
    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 404,
          ErrMessage: getErrors(e)
        }
      )
    }
  }
  searchEmail(email, mongoClient)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});