const kc9531b = require("kc9531b");

const {serial, SerialPort} = require("web-serial-polyfill");

const navigatorSerial = navigator.serial || serial;

const powerSpan = document.querySelector("#power");

const openPort = port => {
	port.open({
		baudRate: 115200
	}).then(() => {
		const reader = port.readable.getReader();
		const writer = port.writable.getWriter();

		const callbacks = [];

		const device = kc9531b({
			on: (name, callback) => {
				if(name === "data") {
					callbacks.push(callback);
				}
			},

			write: data => {
				return writer.write(data);
			}
		});

		const read = () => {
			reader.read().then(data => {
				callbacks.forEach(callback => callback(data.value));

				if(data.done) {
					setTimeout(() => {
						read();
					}, 10);
				} else {
					read();
				}
			});
		};

		read();

		setInterval(() => {
			device.getPowerdBm().then(power => {
				powerSpan.innerHTML = `${power} dBm`;
			});
		}, 100);
	});
};

navigatorSerial.addEventListener("connect", (e) => {
	console.log(e);
});

navigatorSerial.addEventListener("disconnect", (e) => {
	console.log(e);
});

navigatorSerial.getPorts().then((ports) => {
	const port = ports[0];

	if(port) {
		openPort(port);
	}
});

const button = document.querySelector("button");

button.addEventListener("click", () => {
	navigatorSerial
		.requestPort({ filters: [] })
		.then((port) => {
			openPort(port);
		})
		.catch((e) => {
			// The user didn't select a port.
		});
});
