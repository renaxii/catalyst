<script>
	import { reveal } from '$lib/actions.js';
</script>

<section
	use:reveal
	class="prizes-section reveal-section scroll-mt-24 mx-auto w-full max-w-4xl py-8 sm:py-9 md:py-10"
>
	<div class="section-divider reveal-item mb-6 sm:mb-7 md:mb-8" style="--reveal-order: 0;" aria-hidden="true">
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
	<div class="prizes-header mt-3 md:mt-4">
		<div class="prizes-copy">
			<h2 class="reveal-item font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl" style="--reveal-order: 1;">
				Win epic prizes!
			</h2>
			<p class="reveal-item mt-3 text-sm leading-relaxed text-gray-600 md:text-base" style="--reveal-order: 2;">
				Ship your experiment to earn shards, then use shards to get rewards of your choice, such as game grants, console grants, and
				useful software tools (subject to change).
			</p>
		</div>
		<div class="shards-card reveal-item" style="--reveal-order: 2.2;">
			<p class="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gray-500">
				how to earn shards
			</p>
			<div class="shard-pairs mt-2.5">
				<div class="shard-pair" style="--pair-order: 0;">
					<p class="shard-action">ship something playable</p>
					<p class="shard-outcome">→ bigger rewards for stronger ideas</p>
				</div>
				<div class="shard-pair" style="--pair-order: 1;">
					<p class="shard-action">document your process</p>
					<p class="shard-outcome">→ smaller, consistent rewards</p>
				</div>
				<div class="shard-pair" style="--pair-order: 2;">
					<p class="shard-action">keep experimenting</p>
					<p class="shard-outcome">→ bonus over time</p>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3.5 md:mt-4 md:gap-4">
		<div class="reveal-item prize-card lab-entry rounded-lg border border-gray-200 bg-white overflow-hidden" style="--reveal-order: 3;">
			<div class="prize-card-img-wrap h-24 overflow-hidden bg-gray-100 md:h-28">
				<img
					src="https://cdn.fastly.steamstatic.com/store/home/store_home_share.jpg"
					alt="Steam storefront"
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
			</div>
			<div class="p-3 sm:p-3.5">
				<p class="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-dodger">Game Grants</p>
				<p class="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">Win Steam, Nintendo, or other game grants to inspire your next experiment.</p>
			</div>
		</div>
		<div class="reveal-item prize-card lab-entry rounded-lg border border-gray-200 bg-white overflow-hidden" style="--reveal-order: 4;">
			<div class="prize-card-img-wrap h-24 overflow-hidden bg-gray-100 md:h-28">
				<img
					src="https://assets.nintendo.com/image/upload/q_auto/f_auto/c_fill,w_1200/ncom/en_US/articles/2025/nintendo-switch-2-to-be-released-in-2025/1920x1080_WN_PR01162025"
					alt="Nintendo Switch 2"
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
			</div>
			<div class="p-3 sm:p-3.5">
				<p class="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-dodger">Console Grants</p>
				<p class="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">Nintendo Switch or similar console rewards for shipping a great project.</p>
			</div>
		</div>
		<div class="reveal-item prize-card lab-entry rounded-lg border border-gray-200 bg-white overflow-hidden" style="--reveal-order: 5;">
			<div class="prize-card-img-wrap h-24 overflow-hidden bg-gray-100 md:h-28">
				<img
					src="https://cdn.prod.website-files.com/6640f16222f995bdbeda98c8/6764328deb4eec9c082baebf_adobe%20creative%20cloud%20apps%20-%20Copy.png"
					alt="Adobe Creative Cloud apps"
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
			</div>
			<div class="p-3 sm:p-3.5">
				<p class="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-dodger">Software Licenses</p>
				<p class="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">Professional tools for development and design to level up your workflow.</p>
			</div>
		</div>
	</div>
</section>

<style>
	.prizes-header {
		display: block;
		gap: 1rem;
	}

	.prizes-copy {
		min-width: 0;
	}

	.shards-card {
		padding: 1rem 1.1rem;
		border-radius: 14px;
		background: rgba(248, 251, 255, 0.72);
		border: 1px solid rgba(148, 163, 184, 0.24);
		opacity: 0;
		transform: translateY(10px);
	}

	:global(.reveal-section.is-visible) .shards-card {
		animation: shards-card-in 460ms ease-out both;
	}

	@keyframes shards-card-in {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (min-width: 900px) {
		.prizes-header {
			display: grid;
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
			gap: clamp(1.5rem, 3vw, 2.25rem);
			align-items: start;
		}
	}

	.shard-pairs {
		display: flex;
		flex-direction: column;
		gap: 0.74rem;
	}

	.shard-pair {
		opacity: 1;
		transform: none;
	}

	.shard-action {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.4;
		font-weight: 400;
		color: #4b5563;
	}

	.shard-outcome {
		margin: 0.08rem 0 0;
		font-size: 0.82rem;
		line-height: 1.35;
		font-weight: 400;
		color: rgba(75, 85, 99, 0.78);
	}

	:global(html[data-theme='dark'] .prize-card) {
		background-color: rgba(15, 23, 42, 0.6) !important;
		border-color: rgba(148, 163, 184, 0.3) !important;
	}

	:global(html[data-theme='dark'] .prize-card-img-wrap) {
		background-color: rgba(15, 23, 42, 0.8) !important;
	}

	:global(html[data-theme='dark'] .shard-action) {
		color: #d1d9e6;
	}

	:global(html[data-theme='dark'] .shard-outcome) {
		color: rgba(209, 217, 230, 0.78);
	}

	:global(html[data-theme='dark'] .shards-card) {
		background: rgba(15, 23, 42, 0.5);
		border-color: rgba(148, 163, 184, 0.28);
	}

	@media (max-width: 640px) {
		.prizes-section {
			padding-top: 1.6rem;
			padding-bottom: 1.7rem;
		}

		.prizes-header {
			gap: 1rem;
		}

		.shards-card {
			padding: 0.9rem 1rem;
		}

		.shard-pairs {
			gap: 0.68rem;
		}

		.shard-action {
			font-size: 0.88rem;
		}

		.shard-outcome {
			font-size: 0.8rem;
		}
	}
</style>
