<script>
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Challenge from '$lib/components/Challenge.svelte';
	import Process from '$lib/components/Process.svelte';
	import Prizes from '$lib/components/Prizes.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let isDark = $state(false);
	let showTopFlag = $state(true);
	let prefersReducedMotion = $state(false);
	let manualThemeSet = false;
	const THEME_KEY = 'catalyst-theme';
	let themeMediaQuery;
	let clickSparks = $state([]);
	let nextSparkId = 0;

	function spawnClickSparks(event) {
		if (prefersReducedMotion) return;
		const x = event.clientX;
		const y = event.clientY;
		const count = 5;
		const batch = Array.from({ length: count }, (_, i) => {
			const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
			const dist = 14 + Math.random() * 20;
			return { id: nextSparkId++, x, y, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
		});
		clickSparks = [...clickSparks, ...batch];
		const ids = new Set(batch.map((p) => p.id));
		setTimeout(() => {
			clickSparks = clickSparks.filter((p) => !ids.has(p.id));
		}, 460);
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

	onMount(() => {
		const stored = localStorage.getItem(THEME_KEY);
		themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = reducedMotionMQ.matches;
		manualThemeSet = stored === 'light' || stored === 'dark';
		applyTheme(manualThemeSet ? stored === 'dark' : themeMediaQuery.matches);

		const onThemeChange = (e) => { if (!manualThemeSet) applyTheme(e.matches); };
		const onMotionChange = (e) => { prefersReducedMotion = e.matches; };

		themeMediaQuery.addEventListener('change', onThemeChange);
		reducedMotionMQ.addEventListener('change', onMotionChange);
		window.addEventListener('pointerdown', spawnClickSparks, { passive: true });

		return () => {
			themeMediaQuery?.removeEventListener('change', onThemeChange);
			reducedMotionMQ.removeEventListener('change', onMotionChange);
			window.removeEventListener('pointerdown', spawnClickSparks);
		};
	});
</script>

{#if clickSparks.length}
	<div class="tap-sparks-layer" aria-hidden="true">
		{#each clickSparks as p (p.id)}
			<span class="tap-spark" style="left: {p.x}px; top: {p.y}px; --dx: {p.dx.toFixed(2)}px; --dy: {p.dy.toFixed(2)}px;"></span>
		{/each}
	</div>
{/if}

<div id="page-top" aria-hidden="true"></div>

<Nav {isDark} {toggleTheme} />

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

<main class="lab-grid overflow-x-hidden px-4 pb-12 pt-[calc(var(--nav-height)+1.25rem)] sm:px-6 md:pb-14 md:pt-[calc(var(--nav-height)+1.75rem)]">
	<Hero {prefersReducedMotion} onVisibilityChange={(v) => (showTopFlag = v)} />
	<Challenge />
	<Process />
	<Prizes />
	<Faq />
</main>

<Footer />

<style>
	.tap-sparks-layer {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 9997;
		overflow: hidden;
	}

	.tap-spark {
		position: absolute;
		width: 3px;
		height: 3px;
		border-radius: 999px;
		background: rgba(30, 144, 255, 0.9);
		transform: translate(-50%, -50%);
		animation: tap-spark-burst 440ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
	}

	@keyframes tap-spark-burst {
		0% { opacity: 0.88; transform: translate(-50%, -50%) translate(0px, 0px) scale(1.2); }
		100% { opacity: 0; transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.2); }
	}
</style>
