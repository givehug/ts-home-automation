# Simple JavaScript Home Automation
![alt text](/client/public/favicon.ico "logo")

[Demo video](https://youtu.be/lrV0SyhGV-c)

- NodeJS srver side (HTTP and WebSockets cloud server). MongoDB database.
- VueJS client side.
- Raspberry pi 3 running NodeJS and Nodemcu flashed with Espruino running es5 as home IOT devices.


![alt text](/docs/images/schema.png "schema")


Communication:
- Client <-> Server <-> Device - WebSockets.
- Client <-> Server <-> DB - REST HTTP.

Each device has independent power supply and is connected wirelessly to home WiFi network and further to cloud WebSockets server directly. This allows to control device outside of home, if it has internet access.

![alt text](/docs/images/ui.png "user interface")

### FEATURES
- email notifications with nodemailer
- JWT, bcrypt authorization
- motion detection
- track whether user is at home or not
- security camera (takes pictures)
- voice control (chrome only)

### TODO
- unit/e2e tests, test coverage
- save images on server
- video streaming
- face recognition (when motion detected, to differentiate between homie and intruder)
- replace web speach API with something cross platfrom
- enhance security
- migrate to TypeScript (nodemcu?)
- improve vue components composition
- lerna js project splitting
- add homie entrance sound and illumination introduction

### HELPFUL DOCS
- [Enable Raspberry Camera](/docs/enableRaspberryCamera.md)
- [Flash Nodemcu Microcontroller With Espruino JS Interpreter](/docs/flashNodemcuEspruino.md)
- [Mac Usb Drivers](/docs/macUsbDrivers.md)
- [Install Node JS On Raspberry Pi](/docs/nodeRaspberryInstalation.md)
- [Control Node Processes With Forver](/docs/nodeProcessWithForever.md)
- [Control Raspberry Pi From Mac With Remote Screen](/docs/raspberryMacRemoteScreen.md)
- [Run Node JS Script On Raspberry Pi Boot](/docs/raspberryRunNodeScriptOnBoot.md)
- [Control Raspberry Pi By SSH](/docs/raspberrySshControl.md)
