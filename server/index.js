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

      // await client.db('ancorpData').collection("ordersCollector").drop()
      const query = { name: "ordersCollected" };
      const updateDocument = { $set: { "data": dataToPush.theOrders, "timestamping": new Date() } }

      const result = await client.db("ancorpData").collection("ordersCollector").updateOne(query, updateDocument)
      // const result = await client.db("ancorpData").collection("ordersCollector").insertOne({
      //   name: "ordersCollected",
      //   timestamping: new Date(),
      //   data: dataToPush.theOrders
      // })
      if (result) {
        console.log(`New orders Inserted`, result)
        res.json(
          {
            status: 1,
            Message: `New orders Inserted`,
            results: result,
            dataSent: dataToPush
          })
      } else {
        console.log(`no orders inserted`, result)
        res.json(
          {
            status: 2,
            Message: `No orders Inserted`,
            results: result
          })
      }

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

app.post('/wooComerceContactsPushing', (req, res) => {
  // console.log(req)
  const dataToPush = req.body
  const nameToSearch = "nameLast"
  async function pushWoocommerce(client) {
    await mongoClient.connect();
    try {
      await mongoClient.connect();

      // await client.db('ancorpData').collection("ordersCollector").drop()
      const query = { name: "wooComerceContactsCollection" };
      const updateDocument = { $set: { "data": dataToPush.wooComerceContacts, "timestamping": new Date() } }

      const result = await client.db("ancorpData").collection("wooComerceContactsCollection").updateOne(query, updateDocument)
      // const result = await client.db("ancorpData").collection("ordersCollector").insertOne({
      //   name: "ordersCollected",
      //   timestamping: new Date(),
      //   data: dataToPush.theOrders
      // })
      if (result) {
        console.log(`New Customer Contacts Inserted`, result)
        res.json(
          {
            status: 1,
            Message: `New Customer Contacts Inserted`,
            results: result,
            dataSent: dataToPush
          })
      } else {
        console.log(`no Customer Contacts inserted`, result)
        res.json(
          {
            status: 2,
            Message: `No Customer Contacts Inserted`,
            results: result
          })
      }

    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: `Error adding Customer Contacts: ${e}`
        }
      )
    } finally {
      await mongoClient.close()
    }
  }
  pushWoocommerce(mongoClient)
})

app.get('/wooCommerceContacts', (req, res) => {
  async function findOrders(client) {
    try {
      await mongoClient.connect();

      const result = await client.db("ancorpData")
        .collection("wooComerceContactsCollection")
        .findOne({ name: "wooComerceContactsCollection" }, { _id: 0, data: true })
      if (result) {
        const r2esult = await client.db("ancorpData").collection("wooComerceContactsCollection").findOneAndUpdate({ name: "wooComerceContactsCollection" }, { $set: { data: [] } })
        res.json(result)
      } else {
        res.json({ Message: "No WooCommerce Contacts Found" })
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

// POST CREATED CUSTOMERS

app.post('/createCustomers', (req, res) => {
  const dataToPush = req.body
  async function pushWoocommerce(client) {
    try {
      await mongoClient.connect();

      const query = { name: "wooCommerceCreated" };
      const updateDocument = { $push: { data: dataToPush }, $set: { "timestamping": new Date() } }

      const result = await client.db("ancorpData").collection("createdCustomers").updateOne(query, updateDocument)

      if (result) {
        res.json(
          {
            status: 1,
            Message: `New Customer Contacts Inserted`,
          })
      } else {
        res.json(
          {
            status: 2,
            Message: `No Customer Contacts Inserted`,
            results: result
          })
      }

    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: `Error adding Customer Contacts: ${e}`
        }
      )
    } finally {
      await mongoClient.close()
    }
  }
  pushWoocommerce(mongoClient)
})

app.get('/getCreateCustomers', (req, res) => {
  const dataToPush = req.body
  async function pushWoocommerce(client) {
    try {
      await mongoClient.connect();

      const query = { name: "wooCommerceCreated" };

      const result = await client.db("ancorpData").collection("createdCustomers").findOne(query)
      const result2 = await client.db("ancorpData")
        .collection("createdCustomers")
        .findOneAndUpdate(query, { $set: { data: [] } })

      if (result) {
        res.json(
          {
            status: 1,
            data: result.data
          })
      } else {
        res.json(
          {
            status: 2,
            Message: `No Customer Contacts Inserted`,
            results: result
          })
      }

    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: `Error adding Customer Contacts: ${e}`
        }
      )
    } finally {
      await mongoClient.close()
    }
  }
  pushWoocommerce(mongoClient)
})

app.get('/getWooCreatedCustomers', (req, res) => {
  async function pushWoocommerce(client) {
    try {
      await mongoClient.connect();

      const query = { name: "customersUpdated" };

      const result = await client.db("ancorpData").collection("wooCustomersUpdated").findOne(query)
      const result2 = await client.db("ancorpData")
        .collection("wooCustomersUpdated")
        .findOneAndUpdate(query, { $set: { data: [] } })

      if (result) {
        res.json(
          {
            status: 1,
            data: result.data
          })
      } else {
        res.json(
          {
            status: 2,
            Message: `No Customer Contacts Inserted`,
            results: result
          })
      }

    } catch (e) {
      console.log(e)
      res.json(
        {
          status: 0,
          Message: `Error adding Customer Contacts: ${e}`
        }
      )
    } finally {
      await mongoClient.close()
    }
  }
  pushWoocommerce(mongoClient)
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
        let theResult = result.data
        let finalArr = []
        theResult.forEach(prices => {
          if (prices.update.length === 0) {

          } else {
            finalArr.push(prices)
          }
        });

        const r2esult = await client.db("ancorpData").collection("priceUpdateCollec").findOneAndUpdate({ name: "priceData" }, { $set: { data: [] } })
        res.json(finalArr)

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
        let theResult = result.data
        let finalArr = []

        theResult.forEach(quantities => {
          if (quantities.update.length === 0) {

          } else {
            finalArr.push(quantities)
          }
        });
        const r2esult = await client.db("ancorpData").collection("quantityUpdateCollec").findOneAndUpdate({ name: "quantityData" }, { $set: { data: [] } })
        res.json(finalArr)
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

app.get('/getCustMetaData', (req, res) => {
  async function findCustomerData(client) {
    try {
      await mongoClient.connect();

      const result = await client.db("ancorpData").collection("customerMetaData").findOne({ name: "customerData" });
      if (result) {
        console.log(`Found the Data.`)
        let theResult = result.data
        let finalArr = []

        theResult.forEach(custMeta => {
          if (custMeta.update.length === 0) {

          } else {
            finalArr.push(custMeta)
          }
        });
        const r2esult = await client.db("ancorpData").collection("customerMetaData").findOneAndUpdate({ name: "customerData" }, { $set: { data: [] } })
        res.json(finalArr)
      } else {
        console.log(`No Data Found`)
        res.json({ Message: "No Data Found" })
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
  findCustomerData(mongoClient)
})

app.post('/postContacts', (req, res) => {
  const dataToPush = req.body.contacts
  async function postContacts(client) {
    await mongoClient.connect();
    try {
      await mongoClient.connect();
      const query = { name: "EpicorPostContacts" };
      const updateDocument = { $set: { "data": dataToPush, "timestamping": new Date() } }

      // await client.db('ancorpData').collection("EpicorPostContacts").drop()
      const result = await client.db("ancorpData").collection("EpicorPostContacts").updateOne(query, updateDocument)

      console.log(`New Contacts Inserted`)
      res.json(
        {
          status: 1,
          Message: `New Contatcs Inserted`,
          dataSent: dataToPush
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

app.get('/getDiscount', (req, res) => {

  const CustNumber = req.query.CustNum
  const PartNumber = req.query.PartNum

  async function searchDiscount(client) {
    try {
      await mongoClient.connect();
      const CustomersListCodes = client.db("ancorpData").collection("CustomersListCodes")
      const PriceListDiscounts = client.db("ancorpData").collection("PriceListDiscounts")

      const getListCodes = await CustomersListCodes.findOne({ CustNum: parseInt(CustNumber) });

      if (getListCodes) {
        const listcode = getListCodes.ListCode
        const getPricLstDis = await PriceListDiscounts.find({
          ListCode: listcode,
          PartNum: PartNumber
        }).toArray()

        if (getPricLstDis) {
          res.json({
            status: 1,
            data: getPricLstDis,
          })
        } else {
          res.json({
            status: 0,
            Message: 'No Discount Found.',
          })
        }
      } else {
        console.log(`No ListCode Found`)
        res.json({
          status: 0,
          Message: `No discount for this`,
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
  searchDiscount(mongoClient)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});