const Shopify = require('shopify-api-node');
require("dotenv").config();
const { HOST_NAME, API_VERSION, ACCESS_TOKEN } = process.env;

module.exports.Fetch = async (req, res) => {
  try {
    const accessToken = ACCESS_TOKEN;
    const shopName = HOST_NAME;
    const APIVersion = API_VERSION;

    //creating a shopify object to access the methods of shopify REST API
    const shopify = new Shopify({
      shopName: shopName,
      accessToken: accessToken,
      apiVersion: APIVersion,
    });

    let cursor = null;
    let pageNumber = req.query.page || 1;
    let next = true;
    let result;

    while (pageNumber && next) {
      //here the first fetches the number of nodes in the graphql DB
      // cursor is the string that points to the last index of each page, used to retrieve the next fromm there
      const query = `{
        collections(first: 5, query: "created_at:>=2022-12-12 AND created_at:<=2022-12-29", after:${cursor}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              description
            }
          }
        }
      }
    `;
      await shopify.graphql(query)
        .then(response => {
          // console.log(response.collections.edges.length);
          pageInfo = response.collections.pageInfo;
          result = response.collections.edges;
        });
      cursor = pageInfo.endCursor;
      next = pageInfo.hasNext;
      pageNumber -= 1;
    }
    if(pageNumber){
      res.status(201)
      .json({ message: "No orders present on this page", success: true});
    }
    else{
      res.status(201)
        .json({ message: "Successfully recieved order", success: true, orders: result });
    }

  } catch (error) {
    console.error(error);
  }
};
