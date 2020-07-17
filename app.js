const express = require('express');
const app = express();
require('dotenv').config();

var AWS = require('aws-sdk');

app.get('/', (req, res) => {

    let cliente = req.query.usuario.replace("-", " ");
    let servicio = req.query.servicioNombre.replace("-", " ");
    let empresa = req.query.nombreAppSMS.replace("-", " ");

    //templateMessage = `Hola ${req.query.usuario}, dale seguimiento a tu servicio de ${req.query.servicioNombre} de ${req.query.nombreAplicacion} en este link: ${req.query.url}`
    //templateMessage = `Hola ${cliente}, dale seguimiento a tu servicio de ${servicio} de ${empresa} en este link: https://master.d1iqbgwhu8ecbq.amplifyapp.com/#/location/${req.query.url}`
    templateMessage = `Hola ${cliente}, dale seguimiento a tu servicio de ${servicio} de ${empresa} en este link: https://master.d3mwjqmagifpkr.amplifyapp.com/#/location/${req.query.url}`
    var params = {
        Message: templateMessage,
        PhoneNumber: '+' + req.query.phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': 'Servicio'
            }
        }
    };

    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    publishTextPromise.then(
        function(data) {
            res.end(JSON.stringify({ MessageID: data.MessageId }));
        }).catch(
        function(err) {
            res.end(JSON.stringify({ Error: err }));
        });

});
const port = process.env.port || 3000
app.listen(port, () => console.log('SMS Service Listening on PORT' + port))