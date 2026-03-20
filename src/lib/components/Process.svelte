<script>
	import { reveal } from '$lib/actions.js';

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
			description: "what worked, what didn't?",
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

	let openProcessSteps = $state([]);
	let hoverProcessStep = $state(null);

	function isProcessStepOpen(index) {
		return openProcessSteps.includes(index);
	}

	function isProcessStepActive(index) {
		return isProcessStepOpen(index) || hoverProcessStep === index;
	}

	function hoverStep(index) {
		hoverProcessStep = index;
	}

	function unhoverStep(index) {
		if (hoverProcessStep === index) hoverProcessStep = null;
	}

	function toggleProcessStep(index) {
		const isOpen = isProcessStepOpen(index);
		if (isOpen) {
			openProcessSteps = openProcessSteps.filter((i) => i !== index);
			if (hoverProcessStep === index) hoverProcessStep = null;
			return;
		}
		openProcessSteps = [...openProcessSteps, index];
		hoverProcessStep = index;
	}
</script>

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
		Here's how it works:
	</h2>
	<p class="reveal-item mt-7 text-base leading-relaxed text-gray-600 md:text-lg" style="--reveal-order: 2;">
		Take an idea and build on it.
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
					onmouseenter={() => hoverStep(index)}
					onmouseleave={() => unhoverStep(index)}
					onfocus={() => hoverStep(index)}
					onblur={() => unhoverStep(index)}
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

<style>
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
		0% { opacity: 0; transform: translate(-50%, -50%) scale(0.86); }
		20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
		100% { opacity: 0; transform: translate(-50%, -50%) scale(1.08); }
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
		align-items: flex-start;
		justify-content: flex-start;
		gap: 0.75rem;
		opacity: 0;
		transform: translateY(24px);
	}

	.process-chip-icon {
		flex: 0 0 1rem;
		width: 1rem;
		height: 1rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: 1.05rem;
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
		min-width: 0;
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
		max-width: 100%;
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
		0% { opacity: 0; transform: translateY(20px); }
		100% { opacity: 1; transform: translateY(0); }
	}

	@media (max-width: 720px) {
		.process-chip-stack {
			gap: 0.75rem;
		}

		.process-chip-row {
			gap: 0.65rem;
		}

		.process-chip-icon {
			margin-top: 0.85rem;
		}

		.process-chip-hit {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.45rem;
			min-width: 0;
		}

		.process-chip-explanation {
			white-space: normal;
			padding-left: 0.1rem;
			padding-top: 0.6rem;
		}

		.process-chip-pill {
			width: 100%;
			min-height: 2.7rem;
			padding: 0.6rem 1.05rem;
			font-size: 0.95rem;
		}
	}

	:global(html[data-theme='dark'] .process-chip-pill) {
		background: rgba(15, 23, 42, 0.56);
		border-color: rgba(59, 130, 246, 0.32);
		color: #e5e7eb;
		box-shadow: inset 0 0 0 1px rgba(30, 144, 255, 0.08);
	}

	:global(html[data-theme='dark'] .process-chip-hit:hover .process-chip-pill),
	:global(html[data-theme='dark'] .process-chip-hit:focus-visible .process-chip-pill),
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

	:global(html[data-theme='dark'] .process-reaction__svg path) {
		stroke: rgba(147, 197, 253, 0.08);
	}

	@media (prefers-reduced-motion: reduce) {
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

		.process-reaction {
			display: none;
		}
	}
</style>
