const keyLayoutEng = [
	'1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace',
	'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
	'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Enter',
	'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
	'Space',
];
const keyLayoutRu = [
	'1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace',
	'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
	'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter',
	'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
	'Space',
];

const specialKeys = ['Backspace', 'CapsLock', 'Enter', 'Shift', 'Space'];
const lastKeysInRow = ['Backspace', 'p', 'Enter', '?', 'ъ'];

const keyboardNameKey = 'current-keyboard-name';

const savedKeyboardName = localStorage.getItem(keyboardNameKey);


let capsLock = false;

let currentKeyboard = savedKeyboardName === 'RU' ? keyLayoutRu : keyLayoutEng;


const textarea = document.createElement('textarea');
textarea.setAttribute('id', 'textarea');
document.body.appendChild(textarea);
createKeyboard(currentKeyboard);


function triggerAnimation(el) {
	const animation1 = setInterval(changeColor, 30);
	let color = 0.2;
	function changeColor() {
		el.style.backgroundColor = `rgba(255,255,255,${color + 0.1})`;
		color += 0.1;
		if (color >= 0.9) {
			clearInterval(animation1);
			const animation2 = setInterval(revertColor, 30);
			function revertColor() {
				el.style.backgroundColor = `rgba(255,255,255,${color - 0.1})`;
				color -= 0.1;
				if (color <= 0.3) {
					clearInterval(animation2);
				}
			}
		}
	}
}

function createKeyboard(array) {
	const keyboard = document.createElement('div');
	keyboard.classList.add('keyboard');
	document.querySelector('body')
		.appendChild(keyboard);
	array.forEach(createKeyboardButton);
}

function createKeyboardButton(el) {
	// create button
	const button = document.createElement('div');
	button.classList.add('keyboard__key');

	if (specialKeys.includes(el)) {
		button.classList.add('keyboard__wide');
	}
	if (!specialKeys.includes(el)) {
		button.innerHTML = capsLock ? el.toUpperCase() : el.toLowerCase();
	} else {
		button.innerHTML = el;
	}
	// add click functionality
	button.addEventListener('click', () => {
		const input = document.getElementById('textarea');
		switch (el) {
		case 'Backspace':
			input.value = input.value.slice(0, -1);
			triggerAnimation(button);
			break;

		case 'Space':
			input.value += ' ';
			triggerAnimation(button);
			break;

		case 'CapsLock':
			capsLock = !capsLock;
			document.querySelector('body')
				.removeChild(document.querySelector('.keyboard'));
			createKeyboard(currentKeyboard);
			triggerAnimation(button);
			break;

		case 'Enter':
			input.value += '\n';
			triggerAnimation(button);
			break;

		default:
			input.value += button.innerHTML;
			triggerAnimation(button);
		}
	});

	// append key
	document.querySelector('.keyboard')
		.appendChild(button);

	// brake after line
	if (lastKeysInRow.includes(el)) {
		const brTag = document.createElement('br');
		document.querySelector('.keyboard')
			.appendChild(brTag);
	}
}


function simulateClick(elem) {
	// Create our event (with options)
	const evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window,
	});
		// If cancelled, don't dispatch our event
	const canceled = !elem.dispatchEvent(evt);
}

const input = document.getElementById('textarea');
input.addEventListener('keydown', (e) => {
	if (e.shiftKey && e.altKey) {
		if (currentKeyboard === keyLayoutEng) {
			currentKeyboard = keyLayoutRu;
			localStorage.setItem(keyboardNameKey, 'RU');
		} else {
			currentKeyboard = keyLayoutEng;
			localStorage.setItem(keyboardNameKey, 'EN');
		}
		document.querySelector('body')
			.removeChild(document.querySelector('.keyboard'));
		createKeyboard(currentKeyboard);
	}

	// animate buttons on keypress
	const buttons = document.querySelectorAll('.keyboard__key');

	for (let i = 0; i < buttons.length; i += 1) {
		if (buttons[i].innerHTML.toLowerCase() === e.key.toLowerCase()) {
			triggerAnimation(buttons[i]);

			if (buttons[i].innerHTML === e.key && e.key === 'CapsLock') {
				simulateClick(buttons[i]);
			}
		}
	}
});
