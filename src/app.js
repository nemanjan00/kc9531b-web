navigator.serial.addEventListener("connect", (e) => {
	console.log(e);
});

navigator.serial.addEventListener("disconnect", (e) => {
	console.log(e);
});

navigator.serial.getPorts().then((ports) => {
	console.log(ports);
});

const button = document.querySelector("button");

button.addEventListener("click", () => {
	const usbVendorId = 0x2541;

	navigator.serial
		.requestPort({ filters: [{ usbVendorId }] })
		.then((port) => {
			console.log(port);
		})
		.catch((e) => {
			// The user didn't select a port.
		});
});
