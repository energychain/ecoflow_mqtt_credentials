const axios = require("axios");
const base64 = require('base-64');
const { v4: uuidv4 } = require('uuid');

const retrieve = async function(settings) {
    if(typeof settings.email == 'undefined') throw "Email not defined in settings object";
    if(typeof settings.password == 'undefined') throw "Password not defined in settings object";

    try {
        const loginRequest = await axios.post("https://api.ecoflow.com/auth/login",{
            "os": "linux",
            "scene": "IOT_APP",
            "appVersion": "1.0.0",
            "osVersion": "5.15.90.1-kali-fake",
            "password": base64.encode(settings.password),
            "oauth": {
            "bundleId": "com.ef.EcoFlow"
            },
            "email": settings.email,
            "userType": "ECOFLOW"
        });


        if((typeof loginRequest.data.data == 'undefined') || (typeof loginRequest.data.data.token == 'undefined')) {
            console.error(loginRequest.data);
            throw "Login Error - Token not in responds of api.ecoflow.com call";
        }  
        
        let res =  {
            api_userid:loginRequest.data.data.user.userId,
            api_token:loginRequest.data.data.token
        }

        const certificateRequest = await axios.get("https://api.ecoflow.com/iot-auth/app/certification",{
            "headers":{
                "Accept":"application/json",
                "Authorization":"Bearer "+res.api_token
            }
        });
        if(typeof certificateRequest.data.data == 'undefined') throw "Certification Error "+certificateRequest.data.message;
        
        res.mqtt_protocol=certificateRequest.data.data.protocol;
        res.mqtt_server=certificateRequest.data.data.url;
        res.mqtt_port=certificateRequest.data.data.port;
        res.mqtt_username=certificateRequest.data.data.certificateAccount;
        res.mqtt_password=certificateRequest.data.data.certificatePassword;
        
        res.mqtt_client_ids= [];

        for(let i=0;i<3;i++) {
             res.mqtt_client_ids.push("ANDROID_"+uuidv4()+"_"+res.api_userid);
        }

        if(typeof settings.serial_number !== 'undefined') {
            res.mqtt_topics = [];
            res.mqtt_topics.push({topic:"/app/device/property/"+settings.serial_number,subject:"status"});
            res.mqtt_topics.push({topic:"/app/"+res.api_userid+"/"+settings.serial_number+"/thing/property",subject:"get/set configuration"});
        } else {
            res.hint="Specify serial_number in settings to get a list of sample MQTT topics.";
        }
        return res;

    } catch(e) {
        throw e;
    }
}


module.exports = {
    retrieve: retrieve
};