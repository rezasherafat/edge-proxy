# To sideload with the azure extension
```bash
az extension add --source <path_to_whl>
```

Note: if you already have IoT CLI extensions already installed, you will need to remove it first by `az extension remove --name azure-cli-iot-ext`

# To run
```bash
az iot hub proxy -h

az iot hub proxy -n [hub] -d [device] --port [port]
```
