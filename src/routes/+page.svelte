<script>
	import { fade, slide } from 'svelte/transition';

	let openFaq = $state(null);

	const faqs = [
		{
			q: 'What is a YSWS?',
			a: 'YSWS stands for You Ship, We Ship. Build and publish a project, then receive a reward.'
		},
		{
			q: 'Do I need to build a full game?',
			a: 'No. A solid prototype or focused interactive idea is completely valid.'
		},
		{
			q: 'What tools can I use?',
			a: 'Anything you like — web frameworks, game engines, creative coding libraries, or your own stack.'
		},
		{
			q: 'Who can participate?',
			a: 'Hack Clubbers and teen makers interested in building playful, experimental projects.'
		},
		{
			q: 'When will Catalyst launch?',
			a: 'Catalyst is upcoming and not yet open for submissions. Watch this space.'
		}
	];

	function toggleFaq(i) {
		openFaq = openFaq === i ? null : i;
	}

	function reveal(node) {
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
</script>

<nav class="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
	<div class="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
		<span class="font-heading text-lg font-bold tracking-tight text-gray-900">Catalyst</span>
		<ul class="hidden items-center gap-8 md:flex">
			{#each [['#challenge', 'Challenge'], ['#experiment-log', 'Experiment Log'], ['#gallery', 'Gallery'], ['#faq', 'FAQ']] as [href, label]}
				<li>
					<a
						{href}
						class="group relative inline-block -translate-y-0 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:text-dodger"
					>
						{label}
						<span
							class="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-dodger transition-transform duration-300 ease-out group-hover:scale-x-100"
						></span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>

<main class="overflow-x-hidden px-6 pt-24 pb-24 md:pt-28 md:pb-32">
	<section class="relative mx-auto flex min-h-[78vh] w-full max-w-5xl flex-col items-center justify-center text-center">
		<h1
			in:fade={{ duration: 520 }}
			class="font-heading text-[clamp(4.5rem,20vw,21rem)] font-black uppercase leading-[0.85] tracking-[-0.04em] text-gray-900"
		>
			{#each 'CATALYST'.split('') as char}
				<span class="inline-block transition-transform duration-200 ease-out hover:-translate-y-1">{char}</span>
			{/each}
		</h1>
		<p
			in:fade={{ duration: 520, delay: 120 }}
			class="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-gray-600 md:text-2xl"
		>
			turn a familiar interface into a playable experiment
		</p>
		<p
			in:fade={{ duration: 520, delay: 220 }}
			class="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-dodger [animation:pulse_3.4s_ease-in-out_infinite]"
		>
			Coming Soon
		</p>
		<div
			in:fade={{ duration: 520, delay: 300 }}
			class="absolute bottom-7 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-gray-400"
		>
			<div class="[animation:bounce_2s_ease-in-out_infinite]">scroll ↓</div>
		</div>
	</section>

	<section
		id="challenge"
		use:reveal
		class="reveal-section mx-auto w-full max-w-4xl border-t border-gray-200 pt-20 md:pt-24"
	>
		<p class="text-xs font-semibold uppercase tracking-[0.22em] text-dodger">01 — Challenge</p>
		<h2 class="mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
			A simple rule:
			<span class="block">interface becomes gameplay.</span>
		</h2>
		<p class="mt-7 text-base leading-relaxed text-gray-600 md:text-lg">
			Pick a familiar digital product and transform its core interactions into mechanics. Your project
			should feel like the original interface, but behave like a game.
		</p>
		<ul class="mt-8 space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
			<li><span class="font-semibold text-gray-900">Spotify</span> becomes a rhythm puzzle.</li>
			<li><span class="font-semibold text-gray-900">Gmail</span> becomes a dungeon crawler.</li>
			<li><span class="font-semibold text-gray-900">Calendar</span> becomes a strategy game.</li>
			<li><span class="font-semibold text-gray-900">Notes</span> becomes a visual novel.</li>
		</ul>
	</section>

	<section
		id="experiment-log"
		use:reveal
		class="reveal-section mx-auto mt-20 w-full max-w-4xl border-t border-gray-200 pt-20 md:mt-24 md:pt-24"
	>
		<p class="text-xs font-semibold uppercase tracking-[0.22em] text-dodger">02 — Experiment Log</p>
		<h2 class="mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
			Document what you test.
		</h2>
		<p class="mt-7 text-base leading-relaxed text-gray-600 md:text-lg">
			Catalyst treats each project like an experiment report. Describe the interface you studied, the
			hypothesis you explored, and what happened after testing your mechanics.
		</p>
		<dl class="mt-8 space-y-4 text-base leading-relaxed md:text-lg">
			<div>
				<dt class="font-semibold text-gray-900">Subject</dt>
				<dd class="text-gray-600">Spotify</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Hypothesis</dt>
				<dd class="text-gray-600">What if music discovery worked like a puzzle?</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Experiments</dt>
				<dd class="text-gray-600">Rhythm mechanics, playlist challenges, and timing scores.</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Result</dt>
				<dd class="text-gray-600">A playable rhythm puzzle prototype.</dd>
			</div>
		</dl>
	</section>

	<section
		id="gallery"
		use:reveal
		class="reveal-section mx-auto mt-20 w-full max-w-4xl border-t border-gray-200 pt-20 md:mt-24 md:pt-24"
	>
		<p class="text-xs font-semibold uppercase tracking-[0.22em] text-dodger">03 — Gallery</p>
		<h2 class="mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
			Published Experiments
		</h2>
		<p class="mt-7 text-base leading-relaxed text-gray-600 md:text-lg">
			A curated stream of finished remixes and playable prototypes from participants.
		</p>
		<div class="mt-8 space-y-2 text-base leading-relaxed md:text-lg">
			<p class="font-semibold text-gray-900">Experiment #01</p>
			<p class="text-gray-600"><span class="font-semibold text-gray-900">Subject:</span> Spotify</p>
			<p class="text-gray-600">
				<span class="font-semibold text-gray-900">Transformation:</span> rhythm puzzle game
			</p>
			<a
				href="/"
				class="inline-flex items-center gap-1.5 font-semibold text-dodger transition-all duration-200 hover:-translate-y-0.5 hover:opacity-70"
			>
				Play demo <span aria-hidden="true">→</span>
			</a>
		</div>
	</section>

	<section
		id="faq"
		use:reveal
		class="reveal-section mx-auto mt-20 w-full max-w-4xl border-t border-gray-200 pt-20 md:mt-24 md:pt-24"
	>
		<p class="text-xs font-semibold uppercase tracking-[0.22em] text-dodger">04 — FAQ</p>
		<h2 class="mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
			Questions
		</h2>
		<div class="mt-10 border-t border-gray-200">
			{#each faqs as faq, i}
				<div class="border-b border-gray-200">
					<button
						onclick={() => toggleFaq(i)}
						class="group flex w-full items-center justify-between gap-6 rounded-sm py-5 text-left transition-colors duration-200 hover:bg-[#F7FBFF] active:scale-[0.995]"
						aria-expanded={openFaq === i}
					>
						<span class="text-lg font-medium text-gray-900 transition-colors duration-150 group-hover:text-dodger">
							{faq.q}
						</span>
						<span
							class="shrink-0 text-gray-400 transition-all duration-200 group-hover:text-dodger"
							class:rotate-180={openFaq === i}
							aria-hidden="true"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3 6L8 11L13 6"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
					</button>
					{#if openFaq === i}
						<div transition:slide={{ duration: 260 }} class="pb-5 text-base leading-relaxed text-gray-600">
							{faq.a}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</main>

<footer class="mx-auto w-full max-w-5xl border-t border-gray-200 px-6 py-10 text-center text-sm text-gray-400">
	Catalyst is an upcoming Hack Club YSWS.
</footer>

<style>
	.reveal-section {
		opacity: 0;
		transform: translateY(14px);
		transition: opacity 400ms ease, transform 400ms ease;
	}

	:global(.reveal-section.is-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal-section {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
