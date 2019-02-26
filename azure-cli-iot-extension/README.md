# To sideload with the azure extension
```bash
az extension add --source <path_to_whl>
```

Note: if you already have IoT CLI extensions already installed, you will need to remove it first by `az extension remove --name azure-cli-iot-ext`

# To run
```bash
az iot edge proxy -h

az iot edge proxy -n [hub] -d [device] --port [port]
```
