const Lifx = require('node-lifx-lan');
const Cap = require('cap').Cap;
const decoders = require('cap').decoders;
const PROTOCOL = decoders.PROTOCOL;

const cap = new Cap();
const device = Cap.findDevice('192.168.1.18');
const buffer = Buffer.alloc(65536);

const doritosMac = '78:e1:03:1e:cb:42';

cap.open(
  device,
  'arp and ether src ' + doritosMac, // filter
  10 * 1024 * 1024,                       // bufferSize
  buffer);

cap.setMinBytes && c.setMinBytes(0);

Lifx.discover()
  .then((devices) =>
  {
    if(devices.length != 1)
    {
      console.log('Expected exactly 1 device, but got ' + devices.length);
      process.exit(1);
    }

    cap.on('packet', () => {
      const data = decoders.Ethernet(buffer);
      switch(data.info.srcmac)
      {
        case doritosMac:
          console.log('doritos');
          devices[0].getLightState()
            .then((lightState) =>
            {
              if(lightState.power)
              {
                devices[0].turnOff();
              }
              else
              {
                devices[0].turnOn();
              }
            });
          break;
      }
    });
  });
