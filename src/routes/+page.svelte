<script>
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let openFaq = $state(null);
	let isDark = $state(false);
	let showTopFlag = $state(true);
	let mobileMenuOpen = $state(false);
	let manualThemeSet = false;
	let heroSectionEl;
	const THEME_KEY = 'catalyst-theme';
	let themeMediaQuery;
	let heroMouseX = $state(50);
	let heroMouseY = $state(50);

	function handleHeroMouseMove(event) {
		const rect = heroSectionEl?.getBoundingClientRect();
		if (!rect) return;
		heroMouseX = ((event.clientX - rect.left) / rect.width) * 100;
		heroMouseY = ((event.clientY - rect.top) / rect.height) * 100;
	}

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
		manualThemeSet = true;
		applyTheme(next);
		localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
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
		themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		manualThemeSet = stored === 'light' || stored === 'dark';
		applyTheme(manualThemeSet ? stored === 'dark' : themeMediaQuery.matches);

		const handleThemeChange = (event) => {
			if (manualThemeSet) return;
			applyTheme(event.matches);
		};

		themeMediaQuery.addEventListener('change', handleThemeChange);

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
			themeMediaQuery?.removeEventListener('change', handleThemeChange);
		};
	});
</script>

<nav class="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
	<div class="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
		<span class="font-heading text-lg font-bold tracking-tight text-gray-900">Catalyst</span>
		<div class="hidden items-center gap-7 md:flex md:gap-9">
			<ul class="hidden items-center gap-8 md:flex">
				{#each [['#challenge', 'Challenge'], ['#experiment', 'Experiment'], ['#gallery', 'Gallery'], ['#rewards', 'Rewards'], ['#faq', 'FAQ']] as [href, label]}
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
		<div class="flex items-center gap-3 md:hidden">
			<button
				type="button"
				onclick={toggleTheme}
				aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
				class={`inline-flex h-10 w-[5.35rem] items-center justify-center rounded-full border px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
					isDark
						? 'border-dodger/40 bg-dodger/15 text-dodger'
						: 'border-gray-200 bg-white text-gray-600 hover:border-dodger/40 hover:text-dodger'
				}`}
			>
				{isDark ? 'Light' : 'Dark'}
			</button>
			<button
				type="button"
				onclick={toggleMobileMenu}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-nav-menu"
				aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors duration-200 hover:border-dodger/40 hover:text-dodger"
			>
				<svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					{#if mobileMenuOpen}
						<path d="M4 4L12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
						<path d="M12 4L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
					{:else}
						<path d="M2.5 4H13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
						<path d="M2.5 8H13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
						<path d="M2.5 12H13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
					{/if}
				</svg>
			</button>
		</div>
	</div>
	<div
		id="mobile-nav-menu"
		class={`overflow-hidden border-t border-gray-200 bg-white transition-all duration-300 md:hidden ${mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
	>
		<ul class="space-y-1 px-4 py-3 sm:px-6">
			{#each [['#challenge', 'Challenge'], ['#experiment', 'Experiment'], ['#gallery', 'Gallery'], ['#rewards', 'Rewards'], ['#faq', 'FAQ']] as [href, label]}
				<li>
					<a
						{href}
						onclick={closeMobileMenu}
						class="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-dodger/10 hover:text-dodger"
					>
						{label}
					</a>
				</li>
			{/each}
		</ul>
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

<main class="lab-grid overflow-x-hidden px-6 pt-24 pb-24 md:pt-28 md:pb-32">
	<section
		bind:this={heroSectionEl}
		role="banner"
		onmousemove={handleHeroMouseMove}
		class="hero-grid relative mx-auto flex min-h-[calc(100svh-4.5rem)] w-full max-w-5xl flex-col items-center justify-center pb-16 text-center sm:pb-20 md:pb-28"
		style="--grid-ox: {((heroMouseX - 50) * 0.1).toFixed(2)}px; --grid-oy: {((heroMouseY - 50) * 0.1).toFixed(2)}px; --mx: {heroMouseX.toFixed(1)}%; --my: {heroMouseY.toFixed(1)}%;"
	>
		<h1
			in:fade={{ duration: 520 }}
			class="relative font-heading text-[clamp(2.4rem,10vw,9rem)] font-black uppercase leading-[0.86] tracking-[-0.04em] text-gray-900"
		>
			{#each 'CATALYST'.split('') as char}
				<span class="inline-block transition-transform duration-200 ease-out hover:-translate-y-1">{char}</span>
			{/each}
		</h1>
		<p
			in:fade={{ duration: 520, delay: 120 }}
			class="relative mt-9 max-w-xl text-balance text-base leading-relaxed text-gray-600 sm:mt-10 sm:text-lg md:mt-12 md:max-w-2xl md:text-2xl"
		>
			turn a familiar interface into a playable experiment
		</p>
		<p
			in:fade={{ duration: 520, delay: 220 }}
			class="relative mt-10 inline-flex items-center gap-2 rounded-full border border-dodger/20 bg-dodger/10 px-5 py-2 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-dodger sm:mt-12 md:mt-14"
		>
			<span class="inline-block h-2 w-2 rounded-full bg-dodger [animation:pulse_2.8s_ease-in-out_infinite]"></span>
			Coming Soon
		</p>
		<a
			in:fade={{ duration: 520, delay: 340 }}
			href="#"
			aria-label="RSVP for Catalyst"
			class="relative mt-5 inline-flex items-center rounded-full bg-dodger px-9 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-dodger/90 hover:shadow-md active:translate-y-0"
		>
			RSVP
		</a>
		<div
			in:fade={{ duration: 520, delay: 440 }}
			class="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-gray-400 md:bottom-16"
		>
			<div class="[animation:bounce_2s_ease-in-out_infinite]">scroll ↓</div>
		</div>
	</section>

	<section
		id="challenge"
		use:reveal
		class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl border-t border-gray-200 py-16 sm:py-20 md:py-28"
	>
		<p
			class="reveal-item lab-marker font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500"
			style="--reveal-order: 0;"
		>
			[ CHALLENGE ]
		</p>
		<h2 class="reveal-item mt-4 font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl" style="--reveal-order: 1;">
			A simple rule:
			<span class="block">interface becomes gameplay.</span>
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Take something people already know and reframe it as gameplay.
		</p>
		<p class="reveal-item mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500" style="--reveal-order: 3;">
			Examples
		</p>
		<ul class="mt-3 space-y-3 text-base leading-relaxed text-gray-600 md:text-lg">
			<li class="reveal-item rounded-md px-3 -mx-3 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 4;">Spotify -> rhythm puzzle game</li>
			<li class="reveal-item rounded-md px-3 -mx-3 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 5;">Notes app -> visual novel</li>
			<li class="reveal-item rounded-md px-3 -mx-3 transition-colors duration-200 hover:bg-dodger/5" style="--reveal-order: 6;">Calendar -> survival sim</li>
		</ul>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 7;">
			The more unexpected the transformation, the better.
		</p>
	</section>

	<section
		id="experiment"
		use:reveal
		class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl border-t border-gray-200 py-16 sm:py-20 md:py-28"
	>
		<p
			class="reveal-item lab-marker font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500"
			style="--reveal-order: 0;"
		>
			[ DOCUMENT ]
		</p>
		<h2 class="reveal-item mt-4 font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl" style="--reveal-order: 1;">
			Document your process.
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Treat each project like an experiment report. Describe the interface you studied, the
			hypothesis you explored, and what happened after testing your mechanics.
		</p>
		<div
			class="reveal-item lab-note lab-entry mt-8 rounded-xl border border-gray-200 bg-[#F8FBFF] px-5 py-5 text-[0.95rem] leading-relaxed md:px-6 md:py-6"
			style="--reveal-order: 3;"
		>
			<p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Experiment #001</p>
			<dl class="mt-5 font-mono text-sm md:text-[0.92rem]">
				<div class="py-3 first:pt-0">
					<dt class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gray-500">Subject</dt>
					<dd class="mt-1 text-gray-600">Spotify</dd>
				</div>
				<div class="field-divider py-3">
					<dt class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gray-500">Hypothesis</dt>
					<dd class="mt-1 text-gray-600">What if music discovery worked like a puzzle?</dd>
				</div>
				<div class="field-divider py-3">
					<dt class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gray-500">Experiments</dt>
					<dd class="mt-1 text-gray-600">Rhythm mechanics</dd>
					<dd class="text-gray-600">Playlist challenges</dd>
				</div>
				<div class="field-divider py-3 pb-0">
					<dt class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gray-500">Result</dt>
					<dd class="mt-1 text-gray-600">Playable rhythm puzzle prototype</dd>
				</div>
			</dl>
		</div>
	</section>

	<section
		id="gallery"
		use:reveal
		class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl border-t border-gray-200 py-16 sm:py-20 md:py-28"
	>
		<p
			class="reveal-item lab-marker font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500"
			style="--reveal-order: 0;"
		>
			[ GALLERY ]
		</p>
		<h2 class="reveal-item mt-4 font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl" style="--reveal-order: 1;">
			Look at other people's work. 
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Completed experiments will appear here once Catalyst launches and projects are submitted.
		</p>
		<div class="reveal-item mt-8 grid grid-cols-1 gap-3 md:grid-cols-2" style="--reveal-order: 3;">
			<div class="rounded-lg border border-gray-200 bg-white/70 p-4">
				<p class="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-500">Gallery feed</p>
				<p class="mt-2 text-sm text-gray-600 md:text-base">Experiments will appear here after submissions open.</p>
			</div>
			<div class="rounded-lg border border-gray-200 bg-white/70 p-4">
				<p class="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-500">Submission status</p>
				<p class="mt-2 text-sm text-gray-600 md:text-base">Your project can be featured after review once Catalyst launches.</p>
			</div>
			<div class="md:col-span-2">
			<p class="inline-flex items-center gap-2 rounded-full border border-dodger/20 bg-dodger/10 px-3 py-1 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-dodger">
				<span class="inline-block h-1.5 w-1.5 rounded-full bg-dodger [animation:pulse_2.8s_ease-in-out_infinite]"></span>
				Gallery coming soon
			</p>
			</div>
		</div>
	</section>

	<section
		id="rewards"
		use:reveal
		class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl border-t border-gray-200 py-16 sm:py-20 md:py-28"
	>
		<p
			class="reveal-item lab-marker font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500"
			style="--reveal-order: 0;"
		>
			[ REWARDS ]
		</p>
		<h2 class="reveal-item mt-4 font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl" style="--reveal-order: 1;">
			Win epic prizes!
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Ship your experiment to receive rewards such as game grants, console grants, and
			useful software tools ().
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
		class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl border-t border-gray-200 py-16 sm:py-20 md:py-28"
	>
		<p
			class="reveal-item lab-marker font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500"
			style="--reveal-order: 0;"
		>
			LAB NOTES
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
</main>

<footer class="mx-auto w-full max-w-5xl border-t border-gray-200 px-6 py-10 text-center text-sm text-gray-400">
	<p class="mt-3">
		Catalyst is an upcoming
		<a
			href="https://hackclub.com"
			target="_blank"
			rel="noreferrer"
			class="link-lift inline-block font-semibold text-dodger"
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
			class="link-lift inline-block"
		>
			source code on GitHub
		</a>
	</p>
</footer>

<style>
	:global(*) {
		box-sizing: border-box;
	}

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

	.lab-marker {
		font-family: 'DM Sans', 'Inter', sans-serif;
	}

	.lab-entry {
		transition: transform 260ms ease, border-color 260ms ease, box-shadow 260ms ease;
	}

	.lab-entry:hover {
		transform: translateY(-2px);
		border-color: rgba(30, 144, 255, 0.35);
		box-shadow: 0 10px 24px -18px rgba(30, 144, 255, 0.55);
	}

	.field-divider {
		border-top: 1px solid rgba(148, 163, 184, 0.22);
	}

	.link-lift {
		transition: transform 240ms ease, color 240ms ease, opacity 240ms ease;
	}

	.link-lift:hover {
		transform: translateY(-2px);
		color: #1e90ff;
	}

	.hero-grid::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(to right, rgba(30, 144, 255, 0.04) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(30, 144, 255, 0.04) 1px, transparent 1px);
		background-size: 60px 60px;
		background-position: calc(50% + var(--grid-ox, 0px)) calc(50% + var(--grid-oy, 0px));
		mask-image: radial-gradient(ellipse 80% 68% at 50% 42%, black 10%, transparent 68%);
		transition: background-position 600ms ease-out;
	}

	.hero-grid::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(to right, rgba(30, 144, 255, 0.09) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(30, 144, 255, 0.09) 1px, transparent 1px);
		background-size: 60px 60px;
		background-position: calc(50% + var(--grid-ox, 0px)) calc(50% + var(--grid-oy, 0px));
		mask-image: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 100%);
		transition: background-position 600ms ease-out;
	}

	:global(.reveal-section.is-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(a),
	:global(button) {
		outline: none;
	}

	:global(a:focus-visible),
	:global(button:focus-visible) {
		box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.22), 0 0 0 4px rgba(30, 144, 255, 0.4);
		border-radius: 0.45rem;
	}

	:global(.is-visible .reveal-item) {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}

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
		transition: background-color 340ms ease, color 340ms ease, border-color 340ms ease;
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
		color: #d1d9e6 !important;
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
		background-color: rgba(15, 23, 42, 0.92) !important;
		border-color: rgba(59, 130, 246, 0.32) !important;
		box-shadow: inset 0 0 0 1px rgba(30, 144, 255, 0.12);
	}

	:global(html[data-theme='dark'] .lab-entry) {
		background-color: rgba(15, 23, 42, 0.45) !important;
		border-color: rgba(148, 163, 184, 0.3) !important;
	}

	:global(html[data-theme='dark'] .lab-entry:hover) {
		border-color: rgba(30, 144, 255, 0.45) !important;
		box-shadow: 0 10px 24px -18px rgba(59, 130, 246, 0.7);
	}

	:global(html[data-theme='dark'] .field-divider) {
		border-color: rgba(148, 163, 184, 0.28) !important;
	}

	:global(html[data-theme='dark'] .lab-marker) {
		color: #94a3b8 !important;
	}

	:global(html[data-theme='dark'] .lab-note .text-gray-500) {
		color: #93c5fd !important;
	}

	:global(html[data-theme='dark'] .lab-note .text-gray-600) {
		color: #dbeafe !important;
	}

	:global(html[data-theme='dark'] #mobile-nav-menu) {
		background-color: rgba(15, 23, 42, 0.98) !important;
		border-color: rgba(148, 163, 184, 0.25) !important;
	}

	:global(html[data-theme='dark'] #mobile-nav-menu .text-gray-600) {
		color: #dbeafe !important;
	}

	:global(html[data-theme='dark'] #mobile-nav-menu .border-gray-200) {
		border-color: rgba(148, 163, 184, 0.3) !important;
	}

	:global(html[data-theme='dark'] .faq-item:hover) {
		background-color: rgba(30, 144, 255, 0.08) !important;
	}

	@media (max-width: 640px) {
		.hero-grid::before {
			opacity: 0.6;
		}
	}
</style>
