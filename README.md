Edge proxy is an IoT Edge module that enables end-to-end connectivity to your Edge device using [device streams](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-device-streams-overview). Ensure your IoT Hub/edge is provisioned in one of the [supported regions](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-device-streams-overview#regional-availability).

To set up edge proxy for trial purposes, you need to:
* [Provision an IoT Edge device in a Vagrant VM](#to-set-up-iot-edge-in-a-vagrant-vm) (skip this step if you already have an IoT edge device)
* [Build the edge proxy](#to-build-the-edge-proxy-image) (skip this sptep if you would rather use the pre-built image published [here](https://hub.docker.com/r/rezas/edgeproxy))
* [Deploy edge proxy](#to-deploy-edge-proxy-to-iot-edge)
* [SSH using Azure CLI](#ssh-using-edge-proxy-and-azure-cli)

# To set up IoT edge in a Vagrant VM
Install [Vagrant](https://www.vagrantup.com/intro/getting-started/install.html) and use `Vagrantfile` in this repo to provision the VM by running:
```bash
# Provision and bring up your vagrant VM
vagrant up
```

Once the provisioning of the VM is complete, you need to create an IoT Edge device in IoT Hub (follow instructions [here](https://docs.microsoft.com/en-us/azure/iot-edge/quickstart-linux#register-an-iot-edge-device)).

To add your IoT Edge device credentials to your Edge runtime, SSH to your Edge device and update the IoT Edge daemon's configuration file. SSH to your vagrant VM using:
```bash
# SSH to you provisioned VM
vagrant ssh
```

Inside your VM, run the following commands:
```bash
# Update device_connection_string under provisioning section
sudo vim /etc/iotedge/config.yaml

# Restart IoT Edge daemon
sudo systemctl restart iotedge
```

Once done, check that IoT Edge runtime is up active and edgeAgent is running:
```bash
# Output of command below should show the daemon is in 'active (running)' state
sudo systemctl status iotedge

# Output of command below should show 'edgeAgent' module in 'running' state
# Note that it may take a few minutes for the module to be downloaded
sudo iotedge list
```

# To build the edge proxy image
```bash
docker build -t <image_name> .
```

# To deploy edge proxy to IoT edge

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

# SSH using edge proxy and Azure CLI

1. Follow [instructions](https://github.com/rezasherafat/edge-proxy/tree/master/azure-cli-iot-extension) to sideload the extension and login
1. Proxy the stream:

    ```
    az iot hub proxy -n [hub] -d [device created earlier] --port [port]
    ```

1. Open another terminal window
1. Use a valid username and credentials to SSH to your IoT edge device.

    ```
    ssh -p [port] username@localhost
    ```
    For the case of vagrant, use `ssh -i .vagrant/machines/default/virtualbox/private_key -p 2222 vagrant@localhost`. Note you need to use the private key of your Vagrant VM (this is usually stored in your provisioned VM folder under `.vagrant/machines/default/virtualbox/private_key`.

# Run edge proxy in docker
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
