const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

for (let i = 0; i < 5; i++) {
	const newImage = document.createElement('img');
	newImage.setAttribute('src', `images/pic${i+1}.jpg`);
	thumbBar.appendChild(newImage);

	newImage.onclick = function () {
		displayedImage.src = newImage.src;
	}
}

btn.onclick = function () {
	if (btn.getAttribute('class') === 'dark') {
		btn.setAttribute('class','light')
		btn.textContent = 'Lighten'
		overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'
	} else if (btn.getAttribute('class') === 'light') {
		btn.setAttribute('class','dark')
		btn.textContent = 'Darken'
		overlay.style.backgroundColor = 'rgba(0,0,0,0)'
	}
}
