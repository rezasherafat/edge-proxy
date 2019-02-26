# To deploy to IoT Edge

1. Register a **regular** IoT device and remember the device name and the connection string
1. Register and create IoT Edge device, make sure it's running ok
1. Add a deployment module using **Set modules**
1. In **Image URI**, fill in `rezas/edgeproxy:0.40_mqtt`
1. In **Environment Variables**, add these three fields

    | Name | Value | Comment |
    |------------------|----------------------------------------------------------|----------------------------------------------------------------------------------|
    | TARGET_IP | 172.17.0.1 | This is the local IP address of the host as seen by an IoT Edge module/container |
    | TARGET_PORT | 22 | Port for SSH |
    | CONNECTIONSTRING | *<Connection string of the regular device your created in step 1>* | This module has its own connection to IoT Hub for the Hackathon |

1. Click next, next, next, then **Submit**
1. It'll take a while to pull the image, so wait a while till you see the module is running

# To SSH

1. Follow [instructions](https://github.com/rezasherafat/edge-proxy/tree/master/azure-cli-iot-extension) to sideload the extension and login
1. Proxy the stream:

    ```
    az iot edge proxy -n [hub] -d [device created earlier] --port [port]
    ```

1. Open another terminal window
1. Run

    ```
    ssh -p [port] username@localhost
    ```

# To build
```bash
docker build -t <image_name> .
```

# To run
```bash

# Use a valid device connection string
CONNECTIONSTRING=""

# Default value is localhost (container itself)
export TARGET_IP=$HOSTNAME

# Default value is 22
export TARGET_PORT=22

docker run \
    --env CONNECTIONSTRING="$CONNECTIONSTRING" \
    --env TARGET_IP="$TARGET_IP" \
    --env TARGET_PORT="$TARGET_IP" \
    -it \
    <image_name>
```

# To run Vagrant Edge
```bash

# Add your Edge device connection string: device_connection_string
vim edge-config.yaml

# Provision and bring up your vagrant
vagrant up
```
