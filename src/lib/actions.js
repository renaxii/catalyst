export function reveal(node) {
	node.classList.add('reveal-pending');

	if (typeof IntersectionObserver === 'undefined') {
		node.classList.remove('reveal-pending');
		node.classList.add('is-visible');
		return;
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			node.classList.remove('reveal-pending');
			node.classList.add('is-visible');
			observer.unobserve(node);
		},
		{ threshold: 0.2 }
	);

	observer.observe(node);

	return {
		destroy() {
			node.classList.remove('reveal-pending');
			observer.disconnect();
		}
	};
}
