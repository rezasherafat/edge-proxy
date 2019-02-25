# To build
```
docker build -t <image_name> .
```

# To run
```
docker run \
    --env CONNECTIONSTRING="<connection_string>" \
    [--env TARGET_IP="<target_ip>"] \
    [--env TARGET_PORT="<target_port"] \
    -it \
    <image_name>
```

Use `TARGET_IP=$HOSTNAME` to connect to the host.
