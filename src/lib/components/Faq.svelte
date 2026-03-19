<script>
	import { slide } from 'svelte/transition';
	import { reveal } from '$lib/actions.js';

	const faqs = [
		{
			q: 'What is a YSWS?',
			a: 'YSWS stands for You Ship, We Ship. Complete your project and share it with the world, and receive rewards for your work.'
		},
		{
			q: 'How much does it cost?',
			a: 'Everything is completely free!'
		},
		{
			q: 'Who can participate?',
			a: 'Anyone between the ages of 13 - 18 is welcome to participate. No experience is necessary, just a willingness to experiment and have fun!'
		},
		{
			q: 'What kind of projects are allowed?',
			a: 'Anything that reinterprets an interface and turns it into something interactive (not necessarily a game). Projects should be tracked on Hackatime and open-source on GitHub.'
		},
		{
			q: 'Can I work with other people?',
			a: "Absolutely! Collaborating with others is encouraged. You can form teams of up to 3 people and work together on your projects. However, each person's contributions should be tracked seperately."
		},
	];

	let openFaq = $state(null);

	function toggleFaq(i) {
		openFaq = openFaq === i ? null : i;
	}

	function handleFaqKeydown(event, i, total) {
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

		event.preventDefault();
		const triggers = Array.from(document.querySelectorAll('[data-faq-trigger="true"]'));
		if (!triggers.length) return;

		let nextIndex = i;
		if (event.key === 'ArrowDown') nextIndex = (i + 1) % total;
		if (event.key === 'ArrowUp') nextIndex = (i - 1 + total) % total;
		if (event.key === 'Home') nextIndex = 0;
		if (event.key === 'End') nextIndex = total - 1;

		triggers[nextIndex]?.focus();
	}
</script>

<section
	use:reveal
	class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl py-12 sm:py-14 md:py-16"
>
	<div class="section-divider reveal-item mb-10 sm:mb-12 md:mb-14" style="--reveal-order: 0;" aria-hidden="true">
		<span class="section-divider__line"></span>
		<span class="section-divider__triangle">✦</span>
		<span class="section-divider__line"></span>
	</div>
	<p
		id="faq"
		class="reveal-item lab-marker scroll-mt-24 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500 sm:scroll-mt-26 md:scroll-mt-28"
		style="--reveal-order: 0;"
	>
		[ FAQ ]
	</p>
	<h2 class="reveal-item mt-4 font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl" style="--reveal-order: 1;">
		Questions
	</h2>
	<div class="reveal-item mt-10 border-t border-gray-200" style="--reveal-order: 2;">
		{#each faqs as faq, i}
			<div class="border-b border-gray-200">
				<button
					onclick={() => toggleFaq(i)}
					onkeydown={(event) => handleFaqKeydown(event, i, faqs.length)}
					data-faq-trigger="true"
					id={`faq-${i}-button`}
					aria-controls={`faq-${i}-panel`}
					class="faq-item group flex w-full items-center justify-between gap-6 px-2 py-6 text-left"
					aria-expanded={openFaq === i}
				>
					<span class="faq-item-label text-lg font-medium text-gray-900 transition-colors duration-200 group-hover:text-dodger">
						{faq.q}
					</span>
					<span
						class="faq-item-icon shrink-0 text-gray-400 transition-all duration-300 group-hover:text-dodger"
						class:rotate-90={openFaq === i}
						class:translate-x-0.5={openFaq === i}
						aria-hidden="true"
					>
						<svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 6L8 11L13 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</span>
				</button>
				{#if openFaq === i}
					<div
						id={`faq-${i}-panel`}
						role="region"
						aria-labelledby={`faq-${i}-button`}
						transition:slide={{ duration: 280 }}
						class="px-4 pt-3 pb-8 text-base leading-relaxed text-gray-600"
					>
						<div class="ml-2 border-l border-dodger/30 pl-4 pr-1 pb-1">
							{faq.a}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.faq-item {
		position: relative;
		opacity: 0.82;
		transition: opacity 220ms ease;
	}

	.faq-item:hover,
	.faq-item:focus-visible {
		opacity: 1;
	}

	.faq-item-label {
		display: inline-block;
		transition: transform 220ms ease, opacity 220ms ease;
	}

	.faq-item-icon {
		transition: transform 260ms ease, opacity 220ms ease, color 220ms ease;
	}

	.faq-item:hover .faq-item-label,
	.faq-item:focus-visible .faq-item-label {
		transform: translateX(2px);
	}

	:global(html[data-theme='dark'] .faq-item:hover) {
		background-color: rgba(30, 144, 255, 0.08) !important;
	}

	@media (prefers-reduced-motion: reduce) {
		.faq-item,
		.faq-item-label {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
