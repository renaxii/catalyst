<script>
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let openFaq = $state(null);
	let isDark = $state(false);
	let showTopFlag = $state(true);
	let heroSectionEl;
	const THEME_KEY = 'catalyst-theme';

	const faqs = [
		{
			q: 'What is a YSWS?',
			a: 'YSWS stands for You Ship, We Ship. Complete your project and share it with the world, and receive rewards for your work.'
		},
		{
			q: 'What kind of projects are allowed?',
			a: 'Almost anything, as long as it transforms a familiar system into a game or interactive experience. Creative reinterpretations are encouraged.'
		},
		{
			q: 'Who can participate?',
			a: 'Any teen makers interested in building playful, experimental projects.'
		},
		{
			q: 'When will Catalyst launch?',
			a: 'Catalyst is currently in development. Possibly launching mid to late 2026.'
		}
	];

	function toggleFaq(i) {
		openFaq = openFaq === i ? null : i;
	}

	function applyTheme(value) {
		isDark = value;
		document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
	}

	function toggleTheme() {
		const next = !isDark;
		applyTheme(next);
		localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
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

	onMount(() => {
		const stored = localStorage.getItem(THEME_KEY);
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyTheme(stored ? stored === 'dark' : prefersDark);

		if (!heroSectionEl || typeof IntersectionObserver === 'undefined') return;

		const heroObserver = new IntersectionObserver(
			([entry]) => {
				showTopFlag = entry.isIntersecting;
			},
			{
				threshold: 0.08,
				rootMargin: '-88px 0px 0px 0px'
			}
		);

		heroObserver.observe(heroSectionEl);

		return () => {
			heroObserver.disconnect();
		};
	});
</script>

<nav class="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
	<div class="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
		<span class="font-heading text-lg font-bold tracking-tight text-gray-900">Catalyst</span>
		<div class="flex items-center gap-7 md:gap-9">
			<ul class="hidden items-center gap-8 md:flex">
				{#each [['#challenge', 'Challenge'], ['#experiment-log', 'Experiment Log'], ['#gallery', 'Gallery'], ['#prizes', 'Prizes'], ['#faq', 'FAQ']] as [href, label]}
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
			<button
				type="button"
				onclick={toggleTheme}
				class={`inline-flex h-8 w-[5.35rem] items-center justify-center rounded-full border px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
					isDark
						? 'border-dodger/40 bg-dodger/15 text-dodger'
						: 'border-gray-200 bg-white text-gray-600 hover:border-dodger/40 hover:text-dodger'
				}`}
			>
				{isDark ? 'Light' : 'Dark'}
			</button>
		</div>
	</div>
</nav>

<a
	href="https://hackclub.com"
	target="_blank"
	rel="noreferrer"
	aria-label="Hack Club"
	class={`group fixed left-[-0.75rem] top-[4.6rem] z-40 inline-flex transition-all duration-300 md:left-[-0.6rem] ${
		showTopFlag ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
	}`}
>
	<img
		src="https://assets.hackclub.com/flag-orpheus-left.svg"
		alt="Hack Club flag"
		class="h-auto w-[7rem] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.02] sm:w-[7.5rem] md:w-[8.25rem]"
	/>
</a>

<main class="overflow-x-hidden px-6 pt-24 pb-24 md:pt-28 md:pb-32">
	<section
		bind:this={heroSectionEl}
		class="relative mx-auto flex min-h-[84vh] w-full max-w-5xl flex-col items-center justify-center pb-24 text-center md:min-h-[88vh] md:pb-28"
	>
		<h1
			in:fade={{ duration: 520 }}
			class="whitespace-nowrap font-heading text-[clamp(3.2rem,15vw,18rem)] font-black uppercase leading-[0.86] tracking-[-0.04em] text-gray-900"
		>
			{#each 'CATALYST'.split('') as char}
				<span class="inline-block transition-transform duration-200 ease-out hover:-translate-y-1">{char}</span>
			{/each}
		</h1>
		<p
			in:fade={{ duration: 520, delay: 120 }}
			class="mt-12 max-w-2xl text-balance text-lg leading-relaxed text-gray-600 md:text-2xl"
		>
			turn a familiar interface into a playable experiment
		</p>
		<p
			in:fade={{ duration: 520, delay: 220 }}
			class="mt-14 text-xs font-semibold uppercase tracking-[0.26em] text-dodger [animation:pulse_3.4s_ease-in-out_infinite]"
		>
			Coming Soon
		</p>
		<div
			in:fade={{ duration: 520, delay: 300 }}
			class="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-gray-400 md:bottom-16"
		>
			<div class="[animation:bounce_2s_ease-in-out_infinite]">scroll ↓</div>
		</div>
	</section>

	<section
		id="challenge"
		use:reveal
		class="reveal-section mx-auto w-full max-w-4xl border-t border-gray-200 py-24 md:py-28"
	>
		<p class="reveal-item text-xs font-semibold uppercase tracking-[0.22em] text-dodger" style="--reveal-order: 0;">
			01 - Challenge
		</p>
		<h2 class="reveal-item mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl" style="--reveal-order: 1;">
			A simple rule:
			<span class="block">interface becomes gameplay.</span>
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Take something people already know - an app, a tool, a system - and transform it into a playable game or interactive experience.
		</p>
		<ul class="mt-8 space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
			<li class="reveal-item rounded-md px-3 -mx-3 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 3;">Turn <span class="font-semibold text-gray-900">Spotify</span> into a puzzle game.</li>
            <li class="reveal-item rounded-md px-3 -mx-3 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 6;">Make <span class="font-semibold text-gray-900">Notes</span> into a visual novel.</li>
		</ul>
        <p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 5;">
        Think of it like running an experiment:<br><br>
        - Subject: the original system<br>
        - Hypothesis: what game could it become?<br>
        - Experiment: build it<br>
        - Result: a playable experience<br><br>
        The more unexpected the transformation, the better.
        </p>
	</section>

	<section
		id="experiment-log"
		use:reveal
		class="reveal-section mx-auto w-full max-w-4xl border-t border-gray-200 py-24 md:py-28"
	>
		<p class="reveal-item text-xs font-semibold uppercase tracking-[0.22em] text-dodger" style="--reveal-order: 0;">
			02 - Experiment Log
		</p>
		<h2 class="reveal-item mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl" style="--reveal-order: 1;">
			Document what you test.
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Catalyst treats each project like an experiment report. Describe the interface you studied, the
			hypothesis you explored, and what happened after testing your mechanics.
		</p>
		<div
			class="reveal-item lab-note mt-8 rounded-xl border border-gray-200 bg-[#F8FBFF] px-5 py-5 text-[0.95rem] leading-relaxed md:px-6 md:py-6"
			style="--reveal-order: 3;"
		>
			<p class="font-mono text-sm font-semibold tracking-wide text-gray-900">Experiment Log</p>
			<dl class="mt-4 space-y-2.5 font-mono text-sm md:text-[0.92rem]">
				<div class="grid grid-cols-[8.5rem_1fr] gap-x-4">
					<dt class="font-semibold text-gray-900">Subject:</dt>
					<dd class="text-gray-600">Spotify</dd>
				</div>
				<div class="grid grid-cols-[8.5rem_1fr] gap-x-4">
					<dt class="font-semibold text-gray-900">Hypothesis:</dt>
					<dd class="text-gray-600">what if music discovery worked like a puzzle?</dd>
				</div>
				<div class="grid grid-cols-[8.5rem_1fr] gap-x-4">
					<dt class="font-semibold text-gray-900">Experiments:</dt>
					<dd class="text-gray-600">rhythm mechanics, playlist challenges</dd>
				</div>
				<div class="grid grid-cols-[8.5rem_1fr] gap-x-4">
					<dt class="font-semibold text-gray-900">Result:</dt>
					<dd class="text-gray-600">playable puzzle prototype</dd>
				</div>
			</dl>
		</div>
	</section>

	<section
		id="gallery"
		use:reveal
		class="reveal-section mx-auto w-full max-w-4xl border-t border-gray-200 py-24 md:py-28"
	>
		<p class="reveal-item text-xs font-semibold uppercase tracking-[0.22em] text-dodger" style="--reveal-order: 0;">
			03 - Gallery
		</p>
		<h2 class="reveal-item mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl" style="--reveal-order: 1;">
			Published Experiments
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Completed experiments will be featured in the gallery.
		</p>
		<div class="mt-8 space-y-2 text-base leading-relaxed md:text-lg">
			<p class="reveal-item rounded-md px-3 -mx-3 font-semibold text-gray-900 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 3;">Experiment #01</p>
			<p class="reveal-item rounded-md px-3 -mx-3 text-gray-600 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 4;"><span class="font-semibold text-gray-900">Subject:</span> Spotify</p>
			<p class="reveal-item rounded-md px-3 -mx-3 text-gray-600 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 5;">
				<span class="font-semibold text-gray-900">Transformation:</span> rhythm puzzle game
			</p>
		</div>
	</section>

	<section
		id="prizes"
		use:reveal
		class="reveal-section mx-auto w-full max-w-4xl border-t border-gray-200 py-24 md:py-28"
	>
		<p class="reveal-item text-xs font-semibold uppercase tracking-[0.22em] text-dodger" style="--reveal-order: 0;">
			04 - Prizes
		</p>
		<h2 class="reveal-item mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl" style="--reveal-order: 1;">
			Prizes
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			If you ship your experiment, you may receive rewards such as game grants, console grants, and
			useful software tools.
		</p>
		<ul class="mt-8 space-y-3 text-base leading-relaxed text-gray-600 md:text-lg">
			<li class="reveal-item rounded-md px-3 -mx-3 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 3;">game grants</li>
			<li class="reveal-item rounded-md px-3 -mx-3 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 4;">console grants</li>
			<li class="reveal-item rounded-md px-3 -mx-3 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 5;">software licenses</li>
		</ul>
	</section>

	<section
		id="faq"
		use:reveal
		class="reveal-section mx-auto w-full max-w-4xl border-t border-gray-200 py-24 md:py-28"
	>
		<p class="reveal-item text-xs font-semibold uppercase tracking-[0.22em] text-dodger" style="--reveal-order: 0;">
			05 — FAQ
		</p>
		<h2 class="reveal-item mt-4 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-6xl" style="--reveal-order: 1;">
			Questions
		</h2>
		<div class="reveal-item mt-10 border-t border-gray-200" style="--reveal-order: 2;">
			{#each faqs as faq, i}
				<div class="border-b border-gray-200">
					<button
						onclick={() => toggleFaq(i)}
						class="faq-item group flex w-full items-center justify-between gap-6 rounded-md px-4 -mx-4 py-6 text-left transition-colors duration-200 hover:bg-dodger/10 active:scale-[0.992]"
						aria-expanded={openFaq === i}
					>
						<span class="text-lg font-medium text-gray-900 transition-colors duration-150 group-hover:text-dodger">
							{faq.q}
						</span>
						<span
							class="shrink-0 text-gray-400 transition-all duration-300 group-hover:text-dodger"
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
						<div
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
</main>

<footer class="mx-auto w-full max-w-5xl border-t border-gray-200 px-6 py-10 text-center text-sm text-gray-400">
	<p class="mt-3">
		Catalyst is an upcoming
		<a
			href="https://hackclub.com"
			target="_blank"
			rel="noreferrer"
			class="font-semibold text-dodger transition-opacity duration-200 hover:opacity-75"
		>
			Hack Club
		</a>
		YSWS.
	</p><br>
    <p class="text-xs uppercase tracking-[0.18em] text-gray-400">
		<a
			href="https://github.com/renaxii/catalyst"
			target="_blank"
			rel="noreferrer"
			class="inline-block transition-all duration-200 hover:-translate-y-0.5 hover:text-dodger"
		>
			source code on GitHub
		</a>
	</p>
</footer>

<style>
	.reveal-section {
		opacity: 0;
		transform: translateY(14px);
		transition: opacity 400ms ease, transform 400ms ease;
	}

	.reveal-item {
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 380ms ease, transform 380ms ease;
		transition-delay: calc(var(--reveal-order, 0) * 70ms);
	}

	:global(.reveal-section.is-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	:global(.is-visible .reveal-item) {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal-section {
			opacity: 1;
			transform: none;
			transition: none;
		}

		.reveal-item {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}

	:global(html),
	:global(body),
	:global(nav),
	:global(main),
	:global(section),
	:global(footer) {
		transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
	}

	:global(html[data-theme='dark']) {
		background-color: #0f172a;
	}

	:global(html[data-theme='dark'] body) {
		background-color: #0f172a;
		color: #e5e7eb;
	}

	:global(html[data-theme='dark'] .bg-white\/90) {
		background-color: rgba(15, 23, 42, 0.88) !important;
	}

	:global(html[data-theme='dark'] .bg-white) {
		background-color: #0f172a !important;
	}

	:global(html[data-theme='dark'] .text-gray-900) {
		color: #e5e7eb !important;
	}

	:global(html[data-theme='dark'] .text-gray-600) {
		color: #cbd5e1 !important;
	}

	:global(html[data-theme='dark'] .text-gray-500),
	:global(html[data-theme='dark'] .text-gray-400) {
		color: #94a3b8 !important;
	}

	:global(html[data-theme='dark'] .border-gray-100),
	:global(html[data-theme='dark'] .border-gray-200) {
		border-color: rgba(148, 163, 184, 0.3) !important;
	}

	:global(html[data-theme='dark'] .lab-note) {
		background-color: rgba(30, 41, 59, 0.7) !important;
		border-color: rgba(148, 163, 184, 0.35) !important;
	}

	:global(html[data-theme='dark'] .faq-item:hover) {
		background-color: rgba(30, 144, 255, 0.08) !important;
	}
</style>
