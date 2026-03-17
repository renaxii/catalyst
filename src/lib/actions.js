// use:reveal — fires once when the element enters the viewport
export function reveal(node) {
	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('is-visible');
		return;
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			node.classList.add('is-visible');
			observer.unobserve(node);
		},
		{ threshold: 0.2 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
