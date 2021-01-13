# Easy Xiaomi Tokens

This is a NodeJS application that simplifies the process of obtaining Xiaomi device tokens. You can use the extracted tokens to control your Xiaomi device by means of alternative apps like Apple Homekit via [Homebridge](https://homebridge.io), [Hoobs](https://hoobs.org) or [Home Assistant](https://www.home-assistant.io).

The application works for all types of Xiaomi devices like the Air Purifier, Mi Smart Plug (WiFi), Roborock S6, Philips Wi-Fi bulb E27 White, Da Fang camera or Mi LED Desk Lamp. 

This is based on the [instructions](https://github.com/Maxmudjon/com.xiaomi-miio/blob/master/docs/obtain_token.md) provided by Jelger Haanstra on the [com.xiaomi-miio](https://github.com/Maxmudjon/com.xiaomi-miio) project.

**NOTE**: This application has only been tested on macOS.

## Dependencies

Make sure you have NodeJS installed:

- NodeJS (Instructions at https://nodejs.org)



## How to use

1. Add your Xiaomi devices with the Mi Home app on iOS
2. Create an unencrypted backup of your iOS device on your computer using iTunes/Finder. In case you are unable to disable encryption you probably have a profile preventing this that enforces certain security policies (like work related accounts). Delete these profiles or use another iOS device.
3. Download this project from Github then run the following commands:

```bash
npm install # install node modules (only required once)
npm start
```

## Error: EPERM: operation not permitted

If you receive an error when trying to list backups, then it is possible Terminal does not have permission to access the folder where backups are stored. Read the error message for the location, otherwise try to just list the backups manually:

```
ls "/Users/$(whoami)/Library/Application Support/MobileSync/Backup"
```

You will see ls: Operation not permitted and know that Terminal does not have permission. Fix by allowing Terminal in Full Disk Access under Security & Privacy. First, close Terminal, and then:

```
System Preferences -> Security & Privacy -> Privacy -> Full Disk Access -> + -> tick Terminal
```

Restart Terminal and try again.

More information about this issue at [https://www.npmjs.com/package/ibackuptool#terminal-permissions-macos
](https://www.npmjs.com/package/ibackuptool#terminal-permissions-macos)

## Output

The output should be something on the lines of:

```json
[
  {
    "encryptedToken": "9bf2cab9aaaef038bbc42a762fbda4dc6572ed0242853cbbb94e8ab0edefb1450143db63ee66b0cdff9f69917680151e",
    "name": "Mi Smart Plug (WiFi)",
    "address": "192.168.1.15",
    "token": "123aaaa674396a635ffff26e466f744d"
  },
  {
    "encryptedToken": "cc0798772d37750241e1f5ae11ffff533b8e851dbaf0bbd778e65d5ea8dfbda40143db63ee66b0cdff9f69917680151e",
    "name": "Roborock S6",
    "address": "192.168.1.44",
    "token": "123aaaa67439e6a635ffff6e466f744d"
  },
  {
    "encryptedToken": "a3fb152c3919c2e93ae1bc0490638ffff02eb06b5ce2afa5a3ae8715aac5b880143db63ee66b0cdff9f69917680151e",
    "name": "Philips Wi-Fi bulb E27 White",
    "address": "192.168.1.47",
    "token": "123aaaa674ff6a635aa2326e466f744d"
  },
  {
    "encryptedToken": "9c03169b05d8f6c0b229199eb44c3e683747098af4fd1216d5295fb55b2c3a590143db63ee66b0cdff9f69917680151e",
    "name": "Exterminator",
    "address": "192.168.1.24",
    "token": "123aaaa674396a635aa23263366f744d"
  }
]
```
