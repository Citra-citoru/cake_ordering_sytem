"use strict";

const AWS = require("aws-sdk");
const ses = new AWS.SES({
  region: process.env.region,
});
const CAKE_PRODUCER_EMAIL = process.env.cake_producer_email;
const ORDERING_SYSTEM_EMAIL = process.env.ordering_system_email;

module.exports.handlePlacedOrders = (ordersPlaced) => {
  var ordersPlacedPromises = [];
  for (let order of ordersPlaced) {
    const temp = notifyCakeProducerByEmail(order);
    ordersPlacedPromises.push(temp);
  }
  return Promise.all(ordersPlacedPromises);
};

function notifyCakeProducerByEmail(order) {
  const params = {
    Destination: {
      ToAddresses: [CAKE_PRODUCER_EMAIL],
      Message: {
        Body: {
          Text: {
            Data: JSON.stringify(order),
          },
        },
        Subject: {
          Data: "New cake order",
        },
      },
      Source: ORDERING_SYSTEM_EMAIL,
    },
  };
  return ses.sendEmail(params).promise().then((data) => {
      return data;
  });
}
