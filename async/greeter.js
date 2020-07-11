let input = document.getElementById("name");
let btn = document.getElementById("btn");

btn.onclick = function () {
	let greeter = setTimeout(function (name) {
		alert(`Hola ${name}`);
	}, 1000, input.value);
}

//TODO cancel button using clearTimeout()
