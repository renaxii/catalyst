<script>
	import { reveal } from '$lib/actions.js';
</script>

<section
	use:reveal
	class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl py-12 sm:py-14 md:py-16"
>
	<div class="section-divider reveal-item mb-10 sm:mb-12 md:mb-14" style="--reveal-order: 0;" aria-hidden="true">
		<span class="section-divider__line"></span>
		<span class="section-divider__triangle">△</span>
		<span class="section-divider__line"></span>
	</div>
	<p
		id="challenge"
		class="reveal-item lab-marker scroll-mt-24 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500 sm:scroll-mt-26 md:scroll-mt-28"
		style="--reveal-order: 0;"
	>
		[ CHALLENGE ]
	</p>
	<h2 class="reveal-item mt-4 font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl" style="--reveal-order: 1;">
		A simple rule:
		<span class="block">interface becomes interaction</span>
	</h2>
	<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
		Take something people already know and transform it into something completely new.
	</p>
	<p class="reveal-item mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500" style="--reveal-order: 3;">
		Examples
	</p>
	<ul class="mt-3 space-y-3 text-base leading-relaxed text-gray-600 md:text-lg">
		<li class="challenge-example reveal-item" style="--reveal-order: 4;">Spotify → puzzle game</li>
		<li class="challenge-example reveal-item" style="--reveal-order: 5;">Notes app → visual novel</li>
		<li class="challenge-example reveal-item" style="--reveal-order: 6;">Calendar → survival sim</li>
	</ul>
	<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 7;">
		The more unexpected the transformation, the better.
	</p>
</section>

<style>
	.challenge-example {
		position: relative;
		border: 1px solid transparent;
		border-radius: 0.6rem;
		padding: 0.34rem 0.72rem;
		margin-left: -0.72rem;
		margin-right: -0.72rem;
		transition: transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease, opacity 220ms ease;
	}

	.challenge-example::after {
		content: '△';
		position: absolute;
		right: 0.55rem;
		top: 50%;
		transform: translateY(-50%) scale(0.9);
		font-size: 0.63rem;
		line-height: 1;
		color: rgba(30, 144, 255, 0.58);
		opacity: 0;
		transition: opacity 220ms ease, transform 220ms ease;
	}

	.challenge-example:hover {
		transform: translateY(-2px) scale(1.02);
		border-color: rgba(30, 144, 255, 0.22);
		box-shadow: 0 10px 24px -20px rgba(30, 144, 255, 0.45);
		opacity: 0.98;
	}

	.challenge-example:hover::after {
		opacity: 0.78;
		transform: translateY(-50%) scale(1.05);
	}

	:global(html[data-theme='dark'] .challenge-example) {
		border-color: transparent;
	}

	:global(html[data-theme='dark'] .challenge-example:hover) {
		border-color: rgba(96, 165, 250, 0.28);
		box-shadow: 0 10px 24px -20px rgba(96, 165, 250, 0.45);
	}

	:global(html[data-theme='dark'] .challenge-example::after) {
		color: rgba(147, 197, 253, 0.76);
	}

	@media (prefers-reduced-motion: reduce) {
		.challenge-example {
			transition: none !important;
			animation: none !important;
		}

		.challenge-example::after {
			opacity: 0.62;
			transform: translateY(-50%) scale(1);
		}
	}
</style>
