# ecoflow_mqtt_credentials

[![NPM Version](https://img.shields.io/npm/v/ecoflow_mqtt_credentials.svg)](https://www.npmjs.com/package/ecoflow_mqtt_credentials)
[![Downloads](https://img.shields.io/npm/dt/ecoflow_mqtt_credentials.svg)](https://www.npmjs.com/package/ecoflow_mqtt_credentials)
[![License](https://img.shields.io/npm/l/ecoflow_mqtt_credentials.svg)](https://github.com/energychain/ecoflow_mqtt_credentials/blob/master/LICENSE)


**Node JS module to retrieve login credentials for an MQTT client via ecoflow API.**

The Ecoflow PowerStations come with an excellent APP for SmartPhones, which allows to read the status of the storage, consumption of the connections and make configurations. In the background, this app uses the MQTT protocol known from IOT communication, whereby the communication always runs via the Ecoflow servers. For the connection to a smart-home system or an energy management system, the MQTT broker can be used. Unfortunately, this requires access data that are not identical to those that were originally specified in the APP. _


This node module performs exactly the same steps that are used by the APP to use any MQTT client to access the Ecoflow PowerStation. 

## Install (to use in your module/project)
```shell
npm install --save ecoflow_mqtt_credentials
```

## Usage (in your code)
```javascript

const ecoflowmqttcredentials = require("ecoflow_mqtt_credentials");

// Define a settings object
let settings = {
    email:"user@yourdomain.com",
    password:"APP Password",
    serial_number:"R611ZEB1AB1234567" // this is optional - but gives you some topics to use in MQTT if given
}

ecoflowmqttcredentials.retrieve(settings).then(function(mqttsettings) {
        console.log(mqttsettings);
});

// Alternative if in async function :
// let mqttsettings = await ecoflowmqttcredentials.retrieve(settings)
```

## Output
If successfull it returns a quite large JSON object you could use in your code.

```javascript
{
  api_userid: '1234567890',
  api_token: 'eyJ...long....JWT-Token...',     
  mqtt_protocol: 'mqtts',
  mqtt_server: 'mqtt-e.ecoflow.com',
  mqtt_port: '8883',
  mqtt_username: 'app-12345678901235567',
  mqtt_password: 'abcd12345677890abcdef',
  mqtt_client_ids: [
    'ANDROID_4a1f9208-2fa4-485f-9c5f-04845778db97_1234567890',
    'ANDROID_fbbc69d0-8e45-42f0-99b1-22af756d67b7_11234567890',
    'ANDROID_afd7925f-1a7d-4dae-bdfa-9e5c0cde9c35_1234567890'
  ],
  mqtt_topics: [
    { topic: '/app/device/property/R611ZEB1AB1234567', subject: 'status' },
    {
      topic: '/app/1234567890/R611ZEB1AB1234567/thing/property',
      subject: 'get/set configuration'
    }
  ]
}
```

### Hints
Ecoflow MQTT servers require you to set your MQTT client library to use a `clientId` that follows a schema. Samples are given in the `mqttclient_ids` array of the result.

Catch execptions and handle them. This module throws exceptions that are human readable and could be handled.

## Credit
Based on the great work of @mmiller7 at https://github.com/mmiller7/ecoflow-withoutflow/blob/main/cloud-mqtt/ecoflow_get_mqtt_login.sh

## Maintainer / Imprint

<addr>
STROMDAO GmbH  <br/>
Gerhard Weiser Ring 29  <br/>
69256 Mauer  <br/>
Germany  <br/>
 <br/>
+49 6226 968 009 0  <br/>
 <br/>
dev@stromdao.com  <br/>
</addr>

## LICENSE
[Apache-2.0](./LICENSE)
