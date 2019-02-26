FROM microsoft/dotnet
MAINTAINER "Reza Sherafat (rezas@microsoft.com)"

ENV TARGET_IP=127.0.0.1
ENV TARGET_PORT=22
ENV CONNECTIONSTRING=""

WORKDIR /edgeproxy
RUN git clone -b devicestreams-sample-fixes https://github.com/rezasherafat/azure-iot-samples-csharp.git proxy 
RUN cd proxy/iot-hub/Quickstarts/device-streams-proxy/device && dotnet build .

CMD cd proxy/iot-hub/Quickstarts/device-streams-proxy/device && dotnet run $CONNECTIONSTRING $TARGET_IP $TARGET_PORT
