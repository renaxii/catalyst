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

		return () => {
			themeMediaQuery?.removeEventListener('change', onThemeChange);
			reducedMotionMQ.removeEventListener('change', onMotionChange);
		};
	});
</script>

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

<main class="lab-grid overflow-x-hidden px-4 pb-16 pt-[calc(var(--nav-height)+2rem)] sm:px-6 md:pb-20 md:pt-[calc(var(--nav-height)+3rem)]">
	<Hero {prefersReducedMotion} onVisibilityChange={(v) => (showTopFlag = v)} />
	<Challenge />
	<Process />
	<Prizes />
	<Faq />
</main>

<Footer />
