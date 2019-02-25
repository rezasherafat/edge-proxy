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
