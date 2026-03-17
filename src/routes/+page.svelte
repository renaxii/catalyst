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
	let heroTargetMouseX = 50;
	let heroTargetMouseY = 50;
	let heroTriangleEnergy = $state(0);
	let heroTargetTriangleEnergy = 0;
	let heroTitleReactionKey = $state(0);
	let cursorCatalysts = $state([]);
	let prefersReducedMotion = $state(false);
	let particles = $state([]);
	let openProcessSteps = $state([]);
	let hoverProcessStep = $state(null);
	let _particleId = 0;
	let _cursorCatalystId = 0;
	let lastCursorCatalystAt = 0;
	let heroCursorRafId;

	const processSteps = [
		{
			title: 'start with something familiar',
			description: 'a doc editor, wiki, music player',
			iconRotate: '-18deg',
			iconOpacity: 0.5,
			iconScale: 0.98
		},
		{
			title: 'reinterpret it',
			description: 'turn interactions into mechanics',
			iconRotate: '12deg',
			iconOpacity: 0.62,
			iconScale: 1
		},
		{
			title: 'keep track',
			description: 'what worked, what didn\'t?',
			iconRotate: '180deg',
			iconOpacity: 0.56,
			iconScale: 0.94
		},
		{
			title: 'make it real',
			description: 'build something playable',
			iconRotate: '28deg',
			iconOpacity: 0.68,
			iconScale: 1.02
		},
		{
			title: 'earn points',
			description: 'get rewards or start your next build',
			iconRotate: '-34deg',
			iconOpacity: 0.6,
			iconScale: 0.96
		}
	];

	function isProcessStepOpen(index) {
		return openProcessSteps.includes(index);
	}

	function isProcessStepActive(index) {
		return isProcessStepOpen(index) || hoverProcessStep === index;
	}

	function setProcessStepHover(index) {
		hoverProcessStep = index;
	}

	function clearProcessStepHover(index) {
		if (hoverProcessStep === index) hoverProcessStep = null;
	}

	function toggleProcessStep(index) {
		if (isProcessStepOpen(index)) {
			openProcessSteps = openProcessSteps.filter((stepIndex) => stepIndex !== index);
			if (hoverProcessStep === index) hoverProcessStep = null;
			return;
		}

		openProcessSteps = [...openProcessSteps, index];
		hoverProcessStep = index;
	}

	function handleHeroMouseMove(event) {
		const rect = heroSectionEl?.getBoundingClientRect();
		if (!rect) return;
		const localX = event.clientX - rect.left;
		const localY = event.clientY - rect.top;
		heroTargetMouseX = (localX / rect.width) * 100;
		heroTargetMouseY = (localY / rect.height) * 100;

		const triangleX = rect.width * 0.5;
		const triangleY = rect.height * 0.46;
		const distance = Math.hypot(localX - triangleX, localY - triangleY);
		const radius = Math.min(rect.width, rect.height) * 0.38;
		heroTargetTriangleEnergy = Math.max(0, 1 - distance / radius);
		triggerCursorCatalyst(localX, localY, rect.width, rect.height);
	}

	function triggerCursorCatalyst(localX, localY, width, height) {
		if (prefersReducedMotion) return;
		const now = performance.now();
		if (now - lastCursorCatalystAt < 120) return;
		lastCursorCatalystAt = now;

		const angle = Math.random() * Math.PI * 2;
		const radius = Math.random() * 120;
		const x = Math.max(0, Math.min(width, localX + Math.cos(angle) * radius));
		const y = Math.max(0, Math.min(height, localY + Math.sin(angle) * radius));
		const duration = 560 + Math.random() * 80;
		const scale = 1.05 + Math.random() * 0.05;
		const item = {
			id: _cursorCatalystId++,
			x,
			y,
			duration,
			scale
		};

		cursorCatalysts = [...cursorCatalysts, item].slice(-6);
		setTimeout(() => {
			cursorCatalysts = cursorCatalysts.filter((c) => c.id !== item.id);
		}, duration + 80);
	}

	function triggerHeroTitleReaction() {
		heroTitleReactionKey += 1;
	}

	function spawnParticles(e) {
		e.preventDefault();
		const x = e.clientX;
		const y = e.clientY;
		const count = 6;
		const batch = Array.from({ length: count }, (_, i) => {
			const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
			const dist = 28 + Math.random() * 20;
			return { id: _particleId++, x, y, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
		});
		particles = [...particles, ...batch];
		const ids = new Set(batch.map((p) => p.id));
		setTimeout(() => {
			particles = particles.filter((p) => !ids.has(p.id));
		}, 680);
	}

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
			a: 'Absolutely! Collaborating with others is encouraged. You can form teams of up to 3 people and work together on your projects. However, each person\'s contributions should be tracked seperately.'
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
		const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = reducedMotionMediaQuery.matches;
		manualThemeSet = stored === 'light' || stored === 'dark';
		applyTheme(manualThemeSet ? stored === 'dark' : themeMediaQuery.matches);

		const handleThemeChange = (event) => {
			if (manualThemeSet) return;
			applyTheme(event.matches);
		};

		const handleReducedMotionChange = (event) => {
			prefersReducedMotion = event.matches;
			if (event.matches) cursorCatalysts = [];
		};

		const animateHeroCursor = () => {
			const factor = prefersReducedMotion ? 0.22 : 0.14;
			heroMouseX += (heroTargetMouseX - heroMouseX) * factor;
			heroMouseY += (heroTargetMouseY - heroMouseY) * factor;
			heroTriangleEnergy += (heroTargetTriangleEnergy - heroTriangleEnergy) * factor;
			heroCursorRafId = requestAnimationFrame(animateHeroCursor);
		};

		heroCursorRafId = requestAnimationFrame(animateHeroCursor);

		themeMediaQuery.addEventListener('change', handleThemeChange);
		reducedMotionMediaQuery.addEventListener('change', handleReducedMotionChange);

		if (!heroSectionEl || typeof IntersectionObserver === 'undefined') {
			return () => {
				cancelAnimationFrame(heroCursorRafId);
				themeMediaQuery?.removeEventListener('change', handleThemeChange);
				reducedMotionMediaQuery.removeEventListener('change', handleReducedMotionChange);
			};
		}

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
			cancelAnimationFrame(heroCursorRafId);
			heroObserver.disconnect();
			themeMediaQuery?.removeEventListener('change', handleThemeChange);
			reducedMotionMediaQuery.removeEventListener('change', handleReducedMotionChange);
		};
	});
</script>

<div id="page-top" aria-hidden="true"></div>

{#if particles.length}
	<div class="particles-container" aria-hidden="true">
		{#each particles as p (p.id)}
			<span
				class="rsvp-particle"
				style="left: {p.x}px; top: {p.y}px; --dx: {p.dx.toFixed(2)}px; --dy: {p.dy.toFixed(2)}px;"
			></span>
		{/each}
	</div>
{/if}

<nav class="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
	<a
		href="#page-top"
		aria-label="Back to hero section"
		class="micro-interactive absolute left-2 top-1/2 -translate-y-1/2 font-heading text-lg font-bold tracking-tight text-gray-900 no-underline hover:text-gray-900 sm:left-3 md:left-4"
	>
		Catalyst
	</a>
	<div class="mx-auto flex w-full max-w-5xl items-center justify-end px-4 py-4 sm:px-6">
		<div class="hidden items-center gap-7 md:flex md:gap-9">
			<ul class="hidden items-center gap-8 md:flex">
				{#each [['#challenge', 'Challenge'], ['#process', 'Process'], ['#prizes', 'Prizes'], ['#faq', 'FAQ']] as [href, label]}
					<li>
						<a
							{href}
							class="micro-interactive group relative inline-block -translate-y-0 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:text-dodger"
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
				class={`micro-interactive inline-flex h-8 w-[5.35rem] items-center justify-center rounded-full border px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
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
				class={`micro-interactive inline-flex h-10 w-[5.35rem] items-center justify-center rounded-full border px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
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
				class="micro-interactive inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors duration-200 hover:border-dodger/40 hover:text-dodger"
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
			{#each [['#challenge', 'Challenge'], ['#process', 'Process'], ['#prizes', 'Prizes'], ['#faq', 'FAQ']] as [href, label]}
				<li>
					<a
						{href}
						onclick={closeMobileMenu}
						class="micro-interactive block rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-dodger"
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

	<main class="lab-grid overflow-x-hidden px-6 pt-24 pb-16 md:pt-28 md:pb-20">
	<section
		id="hero"
		bind:this={heroSectionEl}
		role="banner"
		onmousemove={handleHeroMouseMove}
		class="hero-grid relative mx-auto flex min-h-[calc(100svh-4.5rem)] w-full max-w-5xl flex-col items-center justify-center pb-16 text-center sm:pb-20 md:pb-28"
		style="--grid-ox: {((heroMouseX - 50) * 0.1).toFixed(2)}px; --grid-oy: {((heroMouseY - 50) * 0.1).toFixed(2)}px; --mx: {heroMouseX.toFixed(1)}%; --my: {heroMouseY.toFixed(1)}%; --triangle-energy: {heroTriangleEnergy.toFixed(3)}; --grid-boost: {prefersReducedMotion ? '0' : '1'};"
	>
		{#if cursorCatalysts.length}
			<div class="cursor-catalyst-layer" aria-hidden="true">
				{#each cursorCatalysts as catalyst (catalyst.id)}
					<span
						class="cursor-catalyst-triangle"
						style="left: {catalyst.x}px; top: {catalyst.y}px; --catalyst-duration: {catalyst.duration.toFixed(0)}ms; --catalyst-scale: {catalyst.scale.toFixed(2)};"
					>
						<svg viewBox="0 0 22 20" class="cursor-catalyst-triangle__svg" focusable="false">
							<path d="M11 2 L20 18 L2 18 Z" />
						</svg>
					</span>
				{/each}
			</div>
		{/if}
		<span class="hero-catalyst-triangle" aria-hidden="true"></span>
		<h1
			in:fade={{ duration: 520 }}
			onmouseenter={triggerHeroTitleReaction}
			class="hero-title relative font-heading text-[clamp(2.4rem,10vw,9rem)] font-black uppercase leading-[0.86] tracking-[-0.04em] text-gray-900"
		>
			{#if heroTitleReactionKey > 0}
				{#key heroTitleReactionKey}
					<span class="hero-title-reaction" aria-hidden="true">
						<svg viewBox="0 0 400 360" class="hero-title-reaction__svg" focusable="false">
							<path d="M200 32 L366 320 L34 320 Z" />
						</svg>
					</span>
				{/key}
			{/if}
			{#each 'CATALYST'.split('') as char}
				<span class="hero-title-letter inline-block transition-transform duration-200 ease-out hover:-translate-y-1">{char}</span>
			{/each}
		</h1>
		<p
			in:fade={{ duration: 520, delay: 120 }}
			class="relative mt-9 max-w-xl text-balance text-base leading-relaxed text-gray-600 sm:mt-10 sm:text-lg md:mt-12 md:max-w-2xl md:text-2xl"
		>
			turn a familiar interface into an interactive experience
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
			onclick={spawnParticles}
			class="micro-interactive relative mt-5 inline-flex items-center rounded-full bg-dodger px-9 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-dodger/90 hover:shadow-md active:translate-y-0"
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

	<section
		use:reveal
		class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl py-12 sm:py-14 md:py-16"
	>
		<div class="section-divider reveal-item mb-10 sm:mb-12 md:mb-14" style="--reveal-order: 0;" aria-hidden="true">
			<span class="section-divider__line"></span>
			<span class="section-divider__triangle">▽</span>
			<span class="section-divider__line"></span>
		</div>
		<p
			id="process"
			class="reveal-item lab-marker scroll-mt-24 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500 sm:scroll-mt-26 md:scroll-mt-28"
			style="--reveal-order: 0;"
		>
			[ PROCESS ]
		</p>
		<h2 class="reveal-item process-title mt-4 font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl" style="--reveal-order: 1;">
			<span class="process-reaction" aria-hidden="true">
				<svg viewBox="0 0 400 360" class="process-reaction__svg" focusable="false">
					<path d="M200 30 L365 320 L35 320 Z" />
				</svg>
			</span>
			Here's an outline of the process:
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Like a reaction chain, each stage transforms the idea and passes momentum to the next.
		</p>
		<div class="process-chip-stack mt-10" aria-label="Catalyst process steps">
			{#each processSteps as step, index}
				<div
					class={`process-chip-row ${isProcessStepActive(index) ? 'is-active' : ''}`}
					style={`--chip-order: ${index}; --icon-rotate: ${step.iconRotate}; --icon-opacity: ${step.iconOpacity}; --icon-scale: ${step.iconScale};`}
				>
					<span class="process-chip-icon" aria-hidden="true">
						<svg viewBox="0 0 20 18" class="process-chip-icon__svg" focusable="false">
							<path d="M10 2 L18 16 L2 16 Z" />
						</svg>
					</span>
					<button
						type="button"
						class={`process-chip-hit ${isProcessStepActive(index) ? 'is-active' : ''}`}
						onmouseenter={() => setProcessStepHover(index)}
						onmouseleave={() => clearProcessStepHover(index)}
						onfocus={() => setProcessStepHover(index)}
						onblur={() => clearProcessStepHover(index)}
						onclick={() => toggleProcessStep(index)}
						aria-expanded={isProcessStepOpen(index)}
						aria-label={`${step.title}: ${step.description}`}
					>
						<span class="process-chip-pill">{step.title}</span>
						<span class="process-chip-explanation" aria-hidden={!isProcessStepActive(index)}>{step.description}</span>
					</button>
				</div>
			{/each}
		</div>
	</section>

	<section
		use:reveal
		class="reveal-section scroll-mt-24 mx-auto w-full max-w-4xl py-12 sm:py-14 md:py-16"
	>
		<div class="section-divider reveal-item mb-10 sm:mb-12 md:mb-14" style="--reveal-order: 0;" aria-hidden="true">
			<span class="section-divider__line"></span>
			<span class="section-divider__triangle">▽̶</span>
			<span class="section-divider__line"></span>
		</div>
		<p
			id="prizes"
			class="reveal-item lab-marker scroll-mt-24 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-gray-500 sm:scroll-mt-26 md:scroll-mt-28"
			style="--reveal-order: 0;"
		>
			[ REWARDS ]
		</p>
		<h2 class="reveal-item mt-4 font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl" style="--reveal-order: 1;">
			Win epic prizes!
		</h2>
		<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
			Ship your experiment to get rewards of your choice, such as game grants, console grants, and
			useful software tools (subject to change).
		</p>
		<div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
			<div class="reveal-item prize-card lab-entry rounded-xl border border-gray-200 bg-white overflow-hidden" style="--reveal-order: 3;">
				<div class="prize-card-img-wrap h-40 overflow-hidden bg-gray-100">
					<img
						src="https://cdn.fastly.steamstatic.com/store/home/store_home_share.jpg"
						alt="Steam storefront"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
				</div>
				<div class="p-4">
					<p class="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-dodger">Game Grants</p>
					<p class="mt-1.5 text-sm leading-relaxed text-gray-600">Win Steam, Nintendo, or other game grants to inspire your next experiment.</p>
				</div>
			</div>
			<div class="reveal-item prize-card lab-entry rounded-xl border border-gray-200 bg-white overflow-hidden" style="--reveal-order: 4;">
				<div class="prize-card-img-wrap h-40 overflow-hidden bg-gray-100">
					<img
						src="https://assets.nintendo.com/image/upload/q_auto/f_auto/c_fill,w_1200/ncom/en_US/articles/2025/nintendo-switch-2-to-be-released-in-2025/1920x1080_WN_PR01162025"
						alt="Nintendo Switch 2"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
				</div>
				<div class="p-4">
					<p class="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-dodger">Console Grants</p>
					<p class="mt-1.5 text-sm leading-relaxed text-gray-600">Nintendo Switch or similar console rewards for shipping a great project.</p>
				</div>
			</div>
			<div class="reveal-item prize-card lab-entry rounded-xl border border-gray-200 bg-white overflow-hidden" style="--reveal-order: 5;">
				<div class="prize-card-img-wrap h-40 overflow-hidden bg-gray-100">
					<img
						src="https://cdn.prod.website-files.com/6640f16222f995bdbeda98c8/6764328deb4eec9c082baebf_adobe%20creative%20cloud%20apps%20-%20Copy.png"
						alt="Adobe Creative Cloud apps"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
				</div>
				<div class="p-4">
					<p class="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-dodger">Software Licenses</p>
					<p class="mt-1.5 text-sm leading-relaxed text-gray-600">Professional tools for development and design to level up your workflow.</p>
				</div>
			</div>
		</div>
	</section>

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
		Catalyst is possible future
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
		scrollbar-width: thin;
		scrollbar-color: var(--accent-blue) transparent;
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: var(--accent-blue);
		border-radius: 10px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: #3a82ff;
	}

	.reveal-section {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 560ms ease-out, transform 560ms ease-out;
	}

	.reveal-item {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 560ms ease-out, transform 560ms ease-out;
		transition-delay: calc(var(--reveal-order, 0) * 95ms);
	}

	.micro-interactive {
		transition: transform 230ms ease, opacity 230ms ease, filter 230ms ease, box-shadow 230ms ease, border-color 230ms ease, color 230ms ease;
	}

	.micro-interactive:hover,
	.micro-interactive:focus-visible {
		transform: translateY(-1px) scale(1.025);
		opacity: 0.98;
		filter: brightness(1.03);
		box-shadow: 0 10px 24px -20px rgba(30, 144, 255, 0.42);
	}

	.process-title {
		position: relative;
	}

	.process-reaction {
		position: absolute;
		left: 50%;
		top: 52%;
		width: clamp(15rem, 30vw, 22rem);
		pointer-events: none;
		transform: translate(-50%, -50%) scale(0.86);
		opacity: 0;
		z-index: 0;
	}

	.process-reaction__svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.process-reaction__svg path {
		fill: none;
		stroke: rgba(30, 144, 255, 0.07);
		stroke-width: 1.1;
		stroke-linejoin: round;
	}

	:global(.reveal-section.is-visible) .process-reaction {
		animation: process-reaction-burst 620ms ease-out 1 both;
	}

	@keyframes process-reaction-burst {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.86);
		}
		20% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1.08);
		}
	}

	.cursor-catalyst-layer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		z-index: 0;
	}

	.cursor-catalyst-triangle {
		position: absolute;
		width: 20px;
		height: 18px;
		transform: translate(-50%, -50%);
		opacity: 0;
		animation: cursor-catalyst-fade var(--catalyst-duration, 600ms) ease-out forwards;
	}

	.cursor-catalyst-triangle__svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.cursor-catalyst-triangle__svg path {
		fill: none;
		stroke: rgba(30, 144, 255, 0.06);
		stroke-width: 1.1;
		stroke-linejoin: round;
	}

	@keyframes cursor-catalyst-fade {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1);
		}
		20% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.02);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(var(--catalyst-scale, 1.08));
		}
	}

	.process-chip-stack {
		width: min(100%, 42rem);
		margin-left: auto;
		margin-right: auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.85rem;
	}

	.process-chip-row {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;
		opacity: 0;
		transform: translateY(24px);
	}

	.process-chip-icon {
		flex: none;
		width: 0.95rem;
		height: 0.95rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		opacity: var(--icon-opacity, 0.56);
		transform: rotate(var(--icon-rotate, 0deg)) scale(var(--icon-scale, 1));
		transform-origin: center;
		transition: opacity 220ms ease-out, transform 220ms ease-out;
	}

	.process-chip-icon__svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.process-chip-icon__svg path {
		fill: none;
		stroke: rgba(30, 144, 255, 0.72);
		stroke-width: 1.4;
		stroke-linejoin: round;
	}

	.process-chip-hit {
		padding: 0;
		border: 0;
		background: transparent;
		display: grid;
		grid-template-columns: minmax(15rem, 18.5rem) minmax(0, 1fr);
		align-items: center;
		justify-content: flex-start;
		gap: 1.5rem;
		outline: none;
		font: inherit;
		color: inherit;
		cursor: pointer;
		width: 100%;
		text-align: left;
	}

	.process-chip-pill {
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		min-height: 3rem;
		padding: 0.72rem 1.3rem;
		border: 1px solid rgba(148, 163, 184, 0.34);
		border-radius: 999px;
		background: rgba(248, 251, 255, 0.66);
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.2;
		letter-spacing: 0.01em;
		text-align: left;
		color: #111827;
		transition: transform 240ms ease, border-color 240ms ease, background-color 240ms ease, box-shadow 240ms ease;
		backdrop-filter: blur(4px);
		transform-origin: left center;
	}

	.process-chip-explanation {
		min-width: 0;
		white-space: nowrap;
		opacity: 0;
		transform: translateX(-8px);
		pointer-events: none;
		padding-top: 0.1rem;
		font-size: 0.9rem;
		line-height: 1.4;
		letter-spacing: 0.01em;
		color: #4b5563;
		transition: opacity 300ms ease-out, transform 300ms ease-out;
	}

	.process-chip-hit.is-active .process-chip-explanation {
		opacity: 1;
		transform: translateX(0);
	}

	.process-chip-hit:hover .process-chip-pill,
	.process-chip-hit:focus-visible .process-chip-pill,
	.process-chip-hit.is-active .process-chip-pill {
		transform: scale(1.025);
		border-color: rgba(30, 144, 255, 0.34);
		background: rgba(248, 251, 255, 0.88);
		box-shadow: 0 12px 28px -24px rgba(30, 144, 255, 0.38);
	}

	.process-chip-row.is-active .process-chip-icon,
	.process-chip-row:hover .process-chip-icon,
	.process-chip-row:focus-within .process-chip-icon {
		opacity: clamp(0, calc(var(--icon-opacity, 0.56) + 0.34), 0.98);
		transform: rotate(var(--icon-rotate, 0deg)) scale(calc(var(--icon-scale, 1) * 1.1));
	}

	:global(.reveal-section.is-visible) .process-chip-row {
		animation: process-chip-row-in 560ms ease-out both;
		animation-delay: calc(var(--chip-order) * 120ms);
	}

	@keyframes process-chip-row-in {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

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

	.lab-grid {
		position: relative;
		isolation: isolate;
	}

	@media (max-width: 720px) {
		.process-chip-hit {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.5rem;
		}

		.process-chip-explanation {
			white-space: normal;
			padding-left: 0.25rem;
			padding-top: 0.75rem;
		}

		.process-chip-pill {
			width: 100%;
		}
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

	.section-divider {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.section-divider__line {
		flex: 1;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(30, 144, 255, 0.14) 16%,
			rgba(30, 144, 255, 0.24) 50%,
			rgba(30, 144, 255, 0.14) 84%,
			transparent 100%
		);
	}

	.section-divider__triangle {
		flex: none;
		font-size: 0.78rem;
		line-height: 1;
		color: rgba(30, 144, 255, 0.56);
		opacity: 0;
		transform: rotate(-10deg) scale(0.88);
		transform-origin: center;
	}

	:global(.reveal-section.is-visible) .section-divider__triangle {
		animation: divider-triangle-settle 460ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms both;
	}

	@keyframes divider-triangle-settle {
		0% {
			opacity: 0;
			transform: rotate(-10deg) translateY(2px) scale(0.84);
		}
		65% {
			opacity: 0.9;
			transform: rotate(2deg) translateY(0) scale(1);
		}
		100% {
			opacity: 1;
			transform: rotate(0deg) translateY(0) scale(1);
		}
	}

	.hero-grid::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(to right, rgba(30, 144, 255, 0.085) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(30, 144, 255, 0.085) 1px, transparent 1px);
		background-size: 60px 60px;
		background-position: calc(50% + var(--grid-ox, 0px)) calc(50% + var(--grid-oy, 0px));
		mask-image: radial-gradient(ellipse 80% 68% at 50% 42%, black 10%, transparent 68%);
		transition: background-position 320ms ease-out;
	}

	.hero-grid::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(to right, rgba(30, 144, 255, 0.16) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(30, 144, 255, 0.16) 1px, transparent 1px);
		background-size: 60px 60px;
		background-position: calc(50% + var(--grid-ox, 0px)) calc(50% + var(--grid-oy, 0px));
		mask-image: radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 100%);
		opacity: calc(0.72 * var(--grid-boost, 1));
		transition: background-position 320ms ease-out, opacity 280ms ease-out;
	}

	.hero-catalyst-triangle {
		position: absolute;
		left: 50%;
		top: 46%;
		width: clamp(14rem, 35vw, 26rem);
		aspect-ratio: 1 / 0.87;
		pointer-events: none;
		transform: translate(-50%, -50%) scale(calc(1 + var(--triangle-energy, 0) * 0.04));
		clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
		background: rgba(30, 144, 255, calc(0.024 + var(--triangle-energy, 0) * 0.015));
		opacity: calc(0.56 + var(--triangle-energy, 0) * 0.16);
		transition: transform 280ms ease-out, opacity 260ms ease-out;
	}

	.hero-title-reaction {
		position: absolute;
		left: 50%;
		top: 50%;
		width: clamp(18rem, 34vw, 25rem);
		transform: translate(-50%, -54%);
		pointer-events: none;
		z-index: 0;
		animation: hero-title-reaction 1s ease-out forwards;
	}

	.hero-title-reaction__svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.hero-title-reaction__svg path {
		fill: none;
		stroke: rgba(30, 144, 255, 0.075);
		stroke-width: 1.2;
		stroke-linejoin: round;
	}

	.hero-title {
		cursor: default;
	}

	.hero-title-letter {
		position: relative;
		z-index: 1;
	}

	@keyframes hero-title-reaction {
		0% {
			opacity: 0;
			transform: translate(-50%, -54%) scale(0.97) rotate(-8deg);
		}
		20% {
			opacity: 1;
			transform: translate(-50%, -54%) scale(1) rotate(2deg);
		}
		50% {
			opacity: 1;
			transform: translate(-50%, -54%) scale(1) rotate(0deg);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -54%) scale(1.01) rotate(0deg);
		}
	}

	:global(.reveal-section.is-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	:global(html) {
		scroll-behavior: smooth;
		--accent-blue: #1e90ff;
		--gallery-card-bg: rgba(255, 255, 255, 0.76);
	}

	.gallery-info-card {
		background-color: var(--gallery-card-bg);
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

	/* ── RSVP burst particles ── */
	.particles-container {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 9998;
		overflow: hidden;
	}

	.rsvp-particle {
		position: absolute;
		width: 5px;
		height: 5px;
		background: #1e90ff;
		border-radius: 1px;
		transform: translate(-50%, -50%);
		animation: particle-burst 580ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
	}

	@keyframes particle-burst {
		0% {
			opacity: 0.9;
			transform: translate(-50%, -50%) translate(0px, 0px) scale(1.3);
		}
		70% {
			opacity: 0.5;
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.2);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}

		.micro-interactive,
		.challenge-example,
		.faq-item,
		.faq-item-label {
			transition: none !important;
			animation: none !important;
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

		.rsvp-particle {
			display: none;
		}

		.hero-title-reaction {
			display: none;
		}

		.process-reaction {
			display: none;
		}

		.cursor-catalyst-layer {
			display: none;
		}

		.process-chip-row {
			opacity: 1;
			transform: none;
			animation: none !important;
		}

		.process-chip-pill {
			transform: none !important;
			transition: none;
		}

		.process-chip-explanation {
			opacity: 1;
			transform: none;
			transition: none;
		}

		.process-chip-icon {
			opacity: 0.58;
			transform: rotate(var(--icon-rotate, 0deg)) scale(var(--icon-scale, 1));
			animation: none !important;
		}

		.section-divider__triangle {
			opacity: 1;
			transform: none;
			animation: none !important;
		}

		.challenge-example::after {
			opacity: 0.62;
			transform: translateY(-50%) scale(1);
		}

		.hero-grid::after {
			opacity: 0;
		}

		.hero-catalyst-triangle {
			opacity: 0.54;
			transform: translate(-50%, -50%) scale(1);
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
		--gallery-card-bg: rgba(30, 41, 59, 0.72);
	}

	:global(html[data-theme='dark'] .bg-white\/90) {
		background-color: rgba(15, 23, 42, 0.88) !important;
	}

	:global(html[data-theme='dark'] .bg-white) {
		background-color: #0f172a !important;
	}

	:global(html[data-theme='dark'] .hero-title-reaction__svg path) {
		stroke: rgba(147, 197, 253, 0.1);
	}

	:global(html[data-theme='dark'] .process-reaction__svg path) {
		stroke: rgba(147, 197, 253, 0.08);
	}

	:global(html[data-theme='dark'] .cursor-catalyst-triangle__svg path) {
		stroke: rgba(147, 197, 253, 0.07);
	}

	:global(html[data-theme='dark'] .process-chip-pill) {
		background: rgba(15, 23, 42, 0.56);
		border-color: rgba(59, 130, 246, 0.32);
		color: #e5e7eb;
		box-shadow: inset 0 0 0 1px rgba(30, 144, 255, 0.08);
	}

	:global(html[data-theme='dark'] .process-chip-hit:hover .process-chip-pill),
	:global(html[data-theme='dark'] .process-chip-hit:focus-visible .process-chip-pill) {
		background: rgba(15, 23, 42, 0.8);
		border-color: rgba(96, 165, 250, 0.42);
	}

	:global(html[data-theme='dark'] .process-chip-hit.is-active .process-chip-pill) {
		background: rgba(15, 23, 42, 0.8);
		border-color: rgba(96, 165, 250, 0.42);
	}

	:global(html[data-theme='dark'] .process-chip-icon__svg path) {
		stroke: rgba(147, 197, 253, 0.76);
	}

	:global(html[data-theme='dark'] .process-chip-explanation) {
		color: #d1d9e6;
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

	:global(html[data-theme='dark'] .hero-grid::before) {
		background-image:
			linear-gradient(to right, rgba(147, 197, 253, 0.125) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(147, 197, 253, 0.125) 1px, transparent 1px);
	}

	:global(html[data-theme='dark'] .hero-grid::after) {
		background-image:
			linear-gradient(to right, rgba(147, 197, 253, 0.2) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(147, 197, 253, 0.2) 1px, transparent 1px);
		opacity: calc(0.72 * var(--grid-boost, 1));
	}

	:global(html[data-theme='dark'] .hero-catalyst-triangle) {
		background: rgba(147, 197, 253, calc(0.03 + var(--triangle-energy, 0) * 0.014));
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

	:global(html[data-theme='dark'] .section-divider__line) {
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(96, 165, 250, 0.2) 16%,
			rgba(96, 165, 250, 0.32) 50%,
			rgba(96, 165, 250, 0.2) 84%,
			transparent 100%
		);
	}

	:global(html[data-theme='dark'] .section-divider__triangle) {
		color: rgba(147, 197, 253, 0.78);
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

	:global(html[data-theme='dark'] .gallery-info-card) {
		background-color: var(--gallery-card-bg) !important;
		border-color: rgba(148, 163, 184, 0.35) !important;
	}

	:global(html[data-theme='dark'] .gallery-info-card .text-gray-500) {
		color: #bfdbfe !important;
	}

	:global(html[data-theme='dark'] .gallery-info-card .text-gray-600) {
		color: #e2e8f0 !important;
	}

	:global(html[data-theme='dark'] .prize-card) {
		background-color: rgba(15, 23, 42, 0.6) !important;
		border-color: rgba(148, 163, 184, 0.3) !important;
	}

	:global(html[data-theme='dark'] .prize-card-img-wrap) {
		background-color: rgba(15, 23, 42, 0.8) !important;
	}

	:global(html[data-theme='dark'] .prize-card .text-gray-600) {
		color: #d1d9e6 !important;
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
