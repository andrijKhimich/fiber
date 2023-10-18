// faq accordion
const accordions = document.querySelectorAll(".accordion__item");

const openAccordion = accordion => {
	const content = accordion.querySelector(".accordion__panel");
	accordion.classList.add("active");
	content.style.maxHeight = content.scrollHeight + "px";
	content.style.opacity = 1;
};

const closeAccordion = accordion => {
	const content = accordion.querySelector(".accordion__panel");
	accordion.classList.remove("active");
	content.style.maxHeight = null;
	content.style.opacity = 0;
};

accordions.forEach(accordion => {
	const intro = accordion.querySelector(".accordion__btn");
	const content = accordion.querySelector(".accordion__panel");

	intro.onclick = () => {
		if (content.style.maxHeight) {
			closeAccordion(accordion);
		} else {
			accordions.forEach(accordion => closeAccordion(accordion));
			openAccordion(accordion);
		}
	};
});
