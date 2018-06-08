# ![alt text](/client/public/favicon.ico "logo") Simple ~~JavaScript~~ TypeScript Home Automation 

[Demo video](https://youtu.be/lrV0SyhGV-c)

### FEATURES
- voice control (chrome only)
- security: motion detection, camera (pictures), email notifications
- track whether user is at home or not
- JWT, bcrypt user authorization

![alt text](/docs/images/ui.png "user interface")

### TECH STACK
- Web server: NodeJS, MongoDB
- Web client: VueJS
- Security unit: Raspberry pi 3 (NodeJS)
- LED bulb: Nodemcu (Espruino)

![alt text](/docs/images/schema.png "schema")

### TODO
- PWA support
- keep all settings on server
- make docs readable
- gui components refactoring
- text commands similar to Jarvis
- save images on server
- network unit customization
- face recognition (when motion detected, to differentiate between homie and intruder)
- replace web speach API with something cross platfrom
- unit/e2e tests, test coverage
- video streaming
- enhance security
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
