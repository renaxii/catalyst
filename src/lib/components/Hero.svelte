<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { prefersReducedMotion, onVisibilityChange } = $props();

	let heroSectionEl;
	let heroMouseX = $state(50);
	let heroMouseY = $state(50);
	let heroTargetMouseX = 50;
	let heroTargetMouseY = 50;
	let heroTriangleEnergy = $state(0);
	let heroTargetTriangleEnergy = 0;
	let heroTitleReactionKey = $state(0);
	let cursorCatalysts = $state([]);
	let particles = $state([]);
	let nextPid = 0;
	let nextCid = 0;
	let lastCatalystMs = 0;
	let heroCursorRafId;

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
		if (now - lastCatalystMs < 120) return; // throttle so the DOM doesn't get hammered
		lastCatalystMs = now;

		const angle = Math.random() * Math.PI * 2;
		const radius = Math.random() * 120;
		const x = Math.max(0, Math.min(width, localX + Math.cos(angle) * radius));
		const y = Math.max(0, Math.min(height, localY + Math.sin(angle) * radius));
		const duration = 560 + Math.random() * 80;
		const scale = 1.05 + Math.random() * 0.05;
		const item = { id: nextCid++, x, y, duration, scale };

		cursorCatalysts = [...cursorCatalysts, item].slice(-6);
		setTimeout(() => {
			cursorCatalysts = cursorCatalysts.filter((c) => c.id !== item.id);
		}, duration + 80);
	}

	function spawnParticles(e) {
		e.preventDefault();
		const x = e.clientX;
		const y = e.clientY;
		const count = 11;
		const batch = Array.from({ length: count }, (_, i) => {
			const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
			const dist = 42 + Math.random() * 34;
			return { id: nextPid++, x, y, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
		});
		particles = [...particles, ...batch];
		const ids = new Set(batch.map((p) => p.id));
		setTimeout(() => {
			particles = particles.filter((p) => !ids.has(p.id));
		}, 980);
	}

	$effect(() => {
		if (prefersReducedMotion) cursorCatalysts = [];
	});

	onMount(() => {
		const animate = () => {
			const factor = prefersReducedMotion ? 0.22 : 0.14;
			heroMouseX += (heroTargetMouseX - heroMouseX) * factor;
			heroMouseY += (heroTargetMouseY - heroMouseY) * factor;
			heroTriangleEnergy += (heroTargetTriangleEnergy - heroTriangleEnergy) * factor;
			heroCursorRafId = requestAnimationFrame(animate);
		};
		heroCursorRafId = requestAnimationFrame(animate);

		if (!heroSectionEl || typeof IntersectionObserver === 'undefined') {
			return () => cancelAnimationFrame(heroCursorRafId);
		}

		const heroObserver = new IntersectionObserver(
			([entry]) => onVisibilityChange?.(entry.isIntersecting),
			{ threshold: 0.08, rootMargin: '-88px 0px 0px 0px' }
		);
		heroObserver.observe(heroSectionEl);

		return () => {
			cancelAnimationFrame(heroCursorRafId);
			heroObserver.disconnect();
		};
	});
</script>

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

<section
	id="hero"
	bind:this={heroSectionEl}
	role="banner"
	onmousemove={handleHeroMouseMove}
	class="hero-grid relative mx-auto flex min-h-[calc(100svh-var(--nav-height))] w-full max-w-5xl flex-col items-start justify-center px-4 pb-14 pt-8 pl-8 text-left sm:px-6 sm:pb-18 sm:pt-10 sm:pl-10 md:pb-22 md:pt-12 md:pl-16"
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
		onmouseenter={() => heroTitleReactionKey++}
		class="hero-title relative max-w-[12ch] font-heading text-[clamp(2.25rem,8.2vw,7.1rem)] font-black uppercase leading-[0.86] tracking-[-0.04em] text-gray-900"
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
		class="micro-interactive relative mt-6 inline-flex items-center rounded-full bg-dodger px-10 py-4 text-[1.04rem] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-dodger/90 hover:shadow-md active:translate-y-0"
	>
		RSVP
	</a>
	<p in:fade={{ duration: 520, delay: 440 }} class="hero-meta pointer-events-none mt-7 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-gray-500 md:mt-8">
		Summer 2026<br />
		Hack Club YSWS
	</p>
	<div
		in:fade={{ duration: 520, delay: 440 }}
		class="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-gray-400 md:bottom-16"
	>
	</div>
</section>

<style>
	.hero-grid {
		min-height: calc(100dvh - var(--nav-height));
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
		mask-image: radial-gradient(ellipse 82% 70% at 50% 46%, black 10%, transparent 68%);
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
		top: 50%;
		width: clamp(13rem, 33vw, 24rem);
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
		0% { opacity: 0; transform: translate(-50%, -54%) scale(0.97) rotate(-8deg); }
		20% { opacity: 1; transform: translate(-50%, -54%) scale(1) rotate(2deg); }
		50% { opacity: 1; transform: translate(-50%, -54%) scale(1) rotate(0deg); }
		100% { opacity: 0; transform: translate(-50%, -54%) scale(1.01) rotate(0deg); }
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
		0% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
		20% { opacity: 1; transform: translate(-50%, -50%) scale(1.02); }
		100% { opacity: 0; transform: translate(-50%, -50%) scale(var(--catalyst-scale, 1.08)); }
	}

	.particles-container {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 9998;
		overflow: hidden;
	}

	.rsvp-particle {
		position: absolute;
		width: 6px;
		height: 6px;
		background: #1e90ff;
		border-radius: 1px;
		transform: translate(-50%, -50%);
		animation: particle-burst 820ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
	}

	@keyframes particle-burst {
		0% { opacity: 0.95; transform: translate(-50%, -50%) translate(0px, 0px) scale(1.45); }
		70% { opacity: 0.5; }
		100% { opacity: 0; transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.2); }
	}

	:global(html[data-theme='dark'] .hero-title-reaction__svg path) {
		stroke: rgba(147, 197, 253, 0.1);
	}

	:global(html[data-theme='dark'] .cursor-catalyst-triangle__svg path) {
		stroke: rgba(147, 197, 253, 0.07);
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

	@media (prefers-reduced-motion: reduce) {
		.hero-title-reaction { display: none; }
		.cursor-catalyst-layer { display: none; }
		.particles-container { display: none; }
		.rsvp-particle { display: none; }
		.hero-grid::after { opacity: 0; }
		.hero-catalyst-triangle {
			opacity: 0.54;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@media (max-width: 640px) {
		.hero-grid::before { opacity: 0.6; }
	}
</style>
