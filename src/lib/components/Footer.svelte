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
			<div class="concept-header">
				<p class="concept-kicker">behind the concept</p>
				<button
					type="button"
					onclick={closeConceptPopup}
					aria-label="Close concept popup"
					class="concept-close-btn"
				>
					<svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M4 4L12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
						<path d="M12 4L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
					</svg>
				</button>
			</div>
			<h3 class="concept-title">my inspiration</h3>
			<div class="concept-content">
				<p class="concept-copy">
					Science has always been among my favorite subjects, especially chemistry, so that was a big part of my inspiration for this project. I tried to include several alchemy and chemistry references. For example, the section dividers are meant to resemble the alchemical symbols for air, water, fire, and earth.
					<br><br>
					You may be wondering how this is related to chemistry or alchemy at all. Well, my main inspiration was the concept of "transmutation," which is basically changing base metals (lead, iron) into noble metals (gold, silver). Anyway, I'm really bad at explaining but I think this is pretty self-explanatory, so I'll leave it at that. If you'd like to know more, feel free to look it up!
					<br><br>
					I also really like the color blue, as well as the concept of minimalism (especially the Swiss editorial design style), so I tried to balance those features. 
				</p>
			</div>
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
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 1.2rem;
		border: 1px solid rgba(30, 144, 255, 0.3);
		background: rgba(255, 255, 255, 0.98);
		padding: 1.7rem 1.85rem 1.8rem;
		box-shadow: 0 26px 80px -42px rgba(30, 144, 255, 0.55);
	}

	.concept-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.concept-close-btn {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: 1px solid rgba(148, 163, 184, 0.3);
		border-radius: 0.5rem;
		color: #64748b;
		cursor: pointer;
		transition: all 200ms ease;
	}

	.concept-close-btn:hover,
	.concept-close-btn:focus-visible {
		border-color: rgba(30, 144, 255, 0.46);
		background: rgba(239, 246, 255, 0.9);
		color: #1e3a8a;
	}

	.concept-content {
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		padding-right: 0.65rem;
		margin-top: 0.9rem;
		scrollbar-gutter: stable;
		-webkit-overflow-scrolling: touch;
	}

	.concept-content::-webkit-scrollbar {
		width: 6px;
	}

	.concept-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.concept-content::-webkit-scrollbar-thumb {
		background: rgba(30, 144, 255, 0.4);
		border-radius: 3px;
	}

	.concept-content::-webkit-scrollbar-thumb:hover {
		background: rgba(30, 144, 255, 0.6);
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

	:global(html[data-theme='dark'] .concept-close-btn) {
		border-color: rgba(148, 163, 184, 0.4);
		color: #94a3b8;
	}

	:global(html[data-theme='dark'] .concept-close-btn:hover),
	:global(html[data-theme='dark'] .concept-close-btn:focus-visible) {
		border-color: rgba(147, 197, 253, 0.6);
		background: rgba(30, 64, 175, 0.24);
		color: #dbeafe;
	}

	@media (max-width: 640px) {
		.concept-overlay {
			padding: 0.85rem;
		}

		.concept-dialog {
			max-height: 90vh;
			padding: 1rem 1rem 1.1rem;
			border-radius: 0.95rem;
		}

		.concept-close-btn {
			width: 2.15rem;
			height: 2.15rem;
		}

		.concept-title {
			margin-top: 0.4rem;
		}

		.concept-content {
			padding-right: 0.45rem;
			margin-top: 0.7rem;
		}

		.concept-copy {
			font-size: 0.97rem;
			line-height: 1.65;
		}
	}
</style>
