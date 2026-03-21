<script>
	let showConceptPopup = $state(false);

	function openConceptPopup() {
		showConceptPopup = true;
	}

	function closeConceptPopup() {
		showConceptPopup = false;
	}

	function handleWindowKeydown(event) {
		if (event.key === 'Escape' && showConceptPopup) {
			closeConceptPopup();
		}
	}

	function handleOverlayClick(event) {
		if (event.currentTarget === event.target) {
			closeConceptPopup();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<footer class="mx-auto mt-10 w-full max-w-5xl border-t border-gray-200 px-6 py-10 text-sm text-gray-500">
	<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
		<div>
			<p class="max-w-xl leading-relaxed">
				Catalyst is an idea for a
				<a
					href="https://hackclub.com"
					target="_blank"
					rel="noreferrer"
					class="link-lift inline-block font-semibold text-dodger"
				>
					Hack Club
				</a>
				YSWS where you remix familiar interfaces into interactive ideas.
			</p>
		</div>
		<div class="flex flex-col items-start gap-4 md:items-end">
			<button
				type="button"
				onclick={openConceptPopup}
				class="concept-trigger inline-flex items-center gap-2 rounded-full border border-dodger/30 bg-white px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-600"
				aria-haspopup="dialog"
				aria-expanded={showConceptPopup}
				aria-controls="concept-popup"
			>
				<span class="concept-dot" aria-hidden="true"></span>
				Why this theme?
			</button>
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
		</div>
	</div>
</footer>

{#if showConceptPopup}
	<div class="concept-overlay" role="presentation" onclick={handleOverlayClick}>
		<div
			id="concept-popup"
			class="concept-dialog"
			role="dialog"
			aria-modal="true"
			aria-label="Catalyst concept background"
			tabindex="-1"
		>
			<p class="concept-kicker">behind the concept</p>
			<h3 class="concept-title">my inspiration</h3>
			<p class="concept-copy">
				Science has always been among my favorite subjects, especially chemistry, so that was a big part of my inspiration for this project. I tried to include several alchemy and chemistry references. For example, the section dividers are meant to resemble the alchemical symbols for air, water, fire, and earth.
				<br><br>
				You may be wondering how this is related to chemistry or alchemy at all. Well, my main inspiration was the concept of "transmutation," which is basically changing base metals (lead, iron) into noble metals (gold, silver). Anyway, I'm really bad at explaining but I think this is pretty self-explanatory, so I'll leave it at that. If you'd like to know more, feel free to look it up!
				<br><br>
				I also really like the color blue, as well as the concept of minimalism (especially the Swiss editorial design style), so I tried to balance those features. 
			</p>
		</div>
	</div>
{/if}

<style>
	.concept-trigger {
		transition: transform 200ms ease, border-color 200ms ease, background-color 200ms ease, color 200ms ease;
	}

	.concept-trigger:hover,
	.concept-trigger:focus-visible {
		transform: translateY(-1px);
		border-color: rgba(30, 144, 255, 0.52);
		background: rgba(248, 251, 255, 0.95);
		color: #374151;
	}

	.concept-dot {
		display: inline-block;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 999px;
		background: rgba(30, 144, 255, 0.86);
		box-shadow: 0 0 0 4px rgba(30, 144, 255, 0.15);
	}

	.concept-overlay {
		position: fixed;
		inset: 0;
		z-index: 10000;
		display: grid;
		place-items: center;
		padding: 1.2rem;
		background: rgba(15, 23, 42, 0.26);
		backdrop-filter: blur(4px);
	}

	.concept-dialog {
		width: min(100%, 44rem);
		border-radius: 1.2rem;
		border: 1px solid rgba(30, 144, 255, 0.3);
		background: rgba(255, 255, 255, 0.98);
		padding: 1.7rem 1.85rem 1.8rem;
		box-shadow: 0 26px 80px -42px rgba(30, 144, 255, 0.55);
	}

	.concept-kicker {
		margin: 0;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: rgba(15, 118, 220, 0.82);
	}

	.concept-title {
		margin: 0.55rem 0 0;
		font-family: 'Outfit', sans-serif;
		font-size: clamp(1.3rem, 0.85vw + 1rem, 1.75rem);
		line-height: 1.2;
		color: #111827;
	}

	.concept-copy {
		margin: 1rem 0 0;
		font-size: 1.02rem;
		line-height: 1.72;
		color: #374151;
	}

	.concept-close {
		margin-top: 1.15rem;
		border: 1px solid rgba(148, 163, 184, 0.4);
		border-radius: 0.55rem;
		background: #f8fafc;
		padding: 0.56rem 0.95rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: #334155;
		transition: border-color 200ms ease, background-color 200ms ease, color 200ms ease;
	}

	.concept-close:hover,
	.concept-close:focus-visible {
		border-color: rgba(30, 144, 255, 0.46);
		background: rgba(239, 246, 255, 0.9);
		color: #1e3a8a;
	}

	:global(html[data-theme='dark'] .concept-trigger) {
		background: rgba(15, 23, 42, 0.72);
		color: #cbd5e1;
		border-color: rgba(96, 165, 250, 0.34);
	}

	:global(html[data-theme='dark'] .concept-trigger:hover),
	:global(html[data-theme='dark'] .concept-trigger:focus-visible) {
		background: rgba(30, 41, 59, 0.9);
		border-color: rgba(147, 197, 253, 0.52);
		color: #e2e8f0;
	}

	:global(html[data-theme='dark'] .concept-dialog) {
		background: rgba(15, 23, 42, 0.97);
		border-color: rgba(96, 165, 250, 0.4);
	}

	:global(html[data-theme='dark'] .concept-kicker) {
		color: rgba(147, 197, 253, 0.84);
	}

	:global(html[data-theme='dark'] .concept-title) {
		color: #e5e7eb;
	}

	:global(html[data-theme='dark'] .concept-copy) {
		color: #cbd5e1;
	}

	:global(html[data-theme='dark'] .concept-close) {
		background: rgba(30, 41, 59, 0.84);
		border-color: rgba(148, 163, 184, 0.44);
		color: #e2e8f0;
	}

	:global(html[data-theme='dark'] .concept-close:hover),
	:global(html[data-theme='dark'] .concept-close:focus-visible) {
		border-color: rgba(147, 197, 253, 0.58);
		background: rgba(30, 64, 175, 0.24);
		color: #dbeafe;
	}
</style>
