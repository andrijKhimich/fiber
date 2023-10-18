const showMoreText = () => {
	let buttons = document.querySelectorAll(".btn-more");
	buttons.forEach(button => {
		button.addEventListener("click", () => {
			console.log("show");
			button.classList.toggle("active");
			let text = button.parentElement.previousElementSibling; // before select parent with max-height
			if (text.style.maxHeight) {
				text.style.maxHeight = null;
			} else {
				text.style.maxHeight = text.scrollHeight + "px";
			}
		});
	});
};
showMoreText();
