!(function () {
	setTimeout(() => {
		const blocks = document.querySelectorAll('.in-view-detect');

		[].forEach.call(blocks, ($item) => {
			function onScroll() {
				if (
					$item.getBoundingClientRect().top - window.innerHeight <=
						($item.offsetHeight * -1) / 4 &&
					!$item.classList.contains('in-view')
				) {
					$item.classList.remove('in-view-detect');
					$item.classList.add('in-view');
				}
			}
			document.addEventListener('scroll', onScroll);
			onScroll();
			// }
		});
	}, 700);
})();
const testimonials = document.querySelector('.testimonials');
if (testimonials) {
	function resizeGridItem(item) {
		let grid = document.getElementsByClassName('testimonials__content')[0];
		let rowHeight = parseInt(
			window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')
		);
		let rowGap = parseInt(
			window.getComputedStyle(grid).getPropertyValue('grid-row-gap')
		);
		let rowSpan = Math.ceil(
			(item.querySelector('.testimonials-card').getBoundingClientRect().height +
				rowGap) /
				(rowHeight + rowGap)
		);
		item.style.gridRowEnd = 'span ' + rowSpan;
	}

	function resizeAllGridItems() {
		let allItems = document.querySelectorAll('.testimonials__col');
		for (let x = 0; x < allItems.length; x++) {
			resizeGridItem(allItems[x]);
		}
	}

	function resizeInstance(instance) {
		let item = instance.elements[0];
		resizeGridItem(item);
	}

	if (window.innerWidth >= 769) {
		resizeAllGridItems();
	}
	window.addEventListener('resize', () => {
		if (window.innerWidth >= 769) {
			resizeAllGridItems();
		}
	});
}

let hero = document.querySelector('.hero');
if (hero) {
	document.addEventListener('mousemove', parallax);
	function parallax(event) {
		this.querySelectorAll('.parallax').forEach((shift) => {
			const position = shift.getAttribute('data-value');
			const x = (window.innerWidth - event.pageX * position) / 90;
			const y = (window.innerHeight - event.pageY * position) / 90;
			shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
		});
	}
}
