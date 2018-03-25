# Simple JavaScript Home Automation Example Project 
![alt text](/client/public/favicon.ico "logo")

[Demo video](https://youtu.be/lrV0SyhGV-c)

- NodeJS back end (http and websockets cloud server). MongoDB database.
- VueJS client side.
- Raspberry pi 3 running NodeJS and Nodemcu flashed with Espruino running es5 as home IOT devices.


![alt text](/assets/schema.png "schema")


Communication between devices, server and client is done via WebSockets.
Client - Server requests related to database are done via http.

Each device has independent power supply and is connected wirelessly to home wifi network and further to cloud websocket server directly.
(this allows to include devices outside of home to the dashboard, hey just have to connect to internet)

WS server handles communication between devices and client side.

![alt text](/assets/ui.png "user interface")

### FEATURES
- email notifications with nodemailer
- JWT, bcrypt authorization
- motion detection
- track whether user is home or not
- security camera (takes pictures)
- voice control (chrome only)

### TODO
- unit tests
- test coverage
- save images on server
- video streaming
- face recognition (what for?)
- replace web speach API with something cross platfrom
- enhance security

### HELPFUL DOCS
- [Enable Raspberry Camera](/docs/enableRaspberryCamera.md)
- [Flash Nodemcu Microcontroller With Espruino JS Interpreter](/docs/flashNodemcuEspruino.md)
- [Mac Usb Drivers](/docs/macUsbDrivers.md)
- [Install Node JS On Raspberry Pi](/docs/nodeRaspberryInstalation.md)
- [Control Node Processes With Forver](/docs/nodeProcessWithForever.md)
- [Control Raspberry Pi From Mac With Remote Screen](/docs/raspberryMacRemoteScreen.md)
- [Run Node JS Script On Raspberry Pi Boot](/docs/raspberryRunNodeScriptOnBoot.md)
- [Control Raspberry Pi By SSH](/docs/raspberrySshControl.md)
