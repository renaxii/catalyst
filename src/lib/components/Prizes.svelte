<script>
	import { reveal } from '$lib/actions.js';
	const stages = [
		{
			label: 'participate',
			description: 'show up and stay consistent',
			prizes: [
				{ item: 'stickers' },
				{ item: 'caffeine grant', result: 'unfocused → focused' },
				{ item: 'nfc tags', result: 'programmable to change phone interface' }
			]
		},
		{
			label: 'build',
			description: 'iterate on your ideas',
			prizes: [
				{ item: 'reusable smart notebook', result: 'notes can be erased and rewritten' },
				{ item: 'macropad', result: 'can be customized to perform (an) action(s)' },
				{ item: 'camera', result: 'intangible code on phone → physical output' }
			]
		},
		{
			label: 'ship',
			description: 'make it real',
			prizes: [
				{
					item: 'framework 12 laptop grant',
					result: 'upgradable',
					image: 'https://images.prismic.io/frameworkmarketplace/Z7yh2p7c43Q3gJei_FW12-Blog-Hero.png?auto=format,compress',
					imageAlt: 'framework laptop'
				},
				{
					item: '3d printer (bambu lab a1 mini) grant',
					result: 'filament → something physical',
					image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiI4qZOwRyMtlKSZrSRszBmD4BxfO_c6gWyA&s',
					imageAlt: 'bambu lab a1 mini'
				},
				{
					item: 'vr headset grant',
					result: 'physical space → digital world',
					image: 'https://dgschool.lv/wp-content/uploads/2024/07/feature2.jpg',
					imageAlt: 'vr headset'
				}
			]
		}
	];

	function stageOrder(index) {
		return 2.1 + index * 1.25;
	}
</script>

<section
	use:reveal
	class="prizes-section reveal-section mx-auto w-full max-w-4xl py-7 sm:py-8 md:py-9"
>
	<div class="section-divider reveal-item mb-5 sm:mb-6 md:mb-7" style="--reveal-order: 0;" aria-hidden="true">
		<span class="section-divider__line"></span>
		<span class="section-divider__triangle">▽̶</span>
		<span class="section-divider__line"></span>
	</div>
	<div class="mt-1 grid gap-8 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center md:gap-10">
		<div class="reveal-item" style="--reveal-order: 0;">
			<p
				class="lab-marker scroll-mt-24 font-mono text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-gray-500 sm:scroll-mt-26 md:scroll-mt-28"
			>
				[ PRIZES ]
			</p>
		</div>
		<div>
			<h2 id="prizes" class="reveal-item mt-1 scroll-mt-[calc(var(--nav-height)+0.9rem)] font-heading text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-[2.7rem]" style="--reveal-order: 1;">
				Win epic prizes!
			</h2>

			<div class="stages mt-6 sm:mt-7">
		{#each stages as stage, stageIndex}
			<section class="stage reveal-item" style={`--reveal-order: ${stageOrder(stageIndex)};`}>
				<div class="stage-head">
					<p class="stage-label">{stage.label}</p>
					<p class="stage-description">{stage.description}</p>
				</div>
				<div class="stage-grid" aria-label={`${stage.label} prizes`}>
					{#each stage.prizes as prize}
						<article class={`stage-card ${prize.image ? 'is-image' : ''}`}>
							{#if prize.image}
								<div class="stage-card-image-wrap">
									<img src={prize.image} alt={prize.imageAlt} class="stage-card-image" loading="lazy" />
								</div>
							{/if}
							<p class="stage-card-item">{prize.item}</p>
							{#if prize.result}
								<p class="stage-card-result">{prize.result}</p>
							{/if}
						</article>
					{/each}
				</div>
			</section>
		{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.stages {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.stage {
		display: flex;
		flex-direction: column;
		gap: 0.64rem;
		padding-top: 0.2rem;
	}

	.stage-head {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.stage-label {
		margin: 0;
		min-width: 5.2rem;
		font-size: clamp(0.95rem, 0.35vw + 0.86rem, 1.08rem);
		font-weight: 600;
		line-height: 1.2;
		color: rgba(15, 118, 220, 0.92);
		text-transform: lowercase;
	}

	.stage-description {
		margin: 0;
		font-size: clamp(0.84rem, 0.22vw + 0.78rem, 0.94rem);
		line-height: 1.2;
		color: rgba(75, 85, 99, 0.82);
		text-transform: lowercase;
	}

	.stage-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.56rem;
	}

	@media (min-width: 660px) {
		.stage-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.58rem;
		}
	}

	@media (min-width: 920px) {
		.stage-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.stage-card {
		border-radius: 11px;
		padding: 0.62rem 0.74rem;
		border: 1px solid rgba(148, 163, 184, 0.28);
		background: rgba(248, 251, 255, 0.62);
		transition: transform 180ms ease-out, border-color 180ms ease-out, background-color 180ms ease-out;
	}

	.stage-card:hover {
		transform: translateY(-2px);
		border-color: rgba(30, 144, 255, 0.36);
	}

	.stage-card-item {
		margin: 0;
		font-size: clamp(0.88rem, 0.25vw + 0.8rem, 0.98rem);
		line-height: 1.25;
		font-weight: 400;
		color: #4b5563;
		text-transform: lowercase;
	}

	.stage-card-result {
		margin: 0.14rem 0 0;
		font-size: clamp(0.78rem, 0.2vw + 0.72rem, 0.88rem);
		line-height: 1.2;
		font-weight: 400;
		color: rgba(75, 85, 99, 0.78);
		letter-spacing: 0.03em;
		text-transform: lowercase;
		transition: color 180ms ease-out;
	}

	.stage-card:hover .stage-card-result {
		color: rgba(75, 85, 99, 0.95);
	}

	.stage-card-image-wrap {
		width: 100%;
		height: 4rem;
		margin-bottom: 0.45rem;
		border-radius: 8px;
		overflow: hidden;
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stage-card-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: transform 220ms ease-out;
	}

	.stage-card.is-image {
		padding-top: 0.52rem;
	}

	.stage-card.is-image:hover .stage-card-image {
		transform: scale(1.02);
	}


	:global(html[data-theme='dark'] .stage-label) {
		color: #e5e7eb;
	}

	:global(html[data-theme='dark'] .stage-description) {
		color: rgba(209, 217, 230, 0.8);
	}

	:global(html[data-theme='dark'] .stage-card-item) {
		color: #d1d9e6;
	}

	:global(html[data-theme='dark'] .stage-card-result) {
		color: rgba(209, 217, 230, 0.78);
	}

	:global(html[data-theme='dark'] .stage-card) {
		background: rgba(15, 23, 42, 0.5);
		border-color: rgba(148, 163, 184, 0.28);
	}

	:global(html[data-theme='dark'] .stage-card:hover) {
		border-color: rgba(96, 165, 250, 0.46);
	}

	:global(html[data-theme='dark'] .stage-card:hover .stage-card-result) {
		color: rgba(209, 217, 230, 0.95);
	}

	@media (max-width: 640px) {
		.prizes-section {
			padding-top: 1.4rem;
			padding-bottom: 1.55rem;
		}

		.stages {
			gap: 0.78rem;
		}

		.stage-card-image-wrap {
			height: 3.55rem;
		}

		.stage {
			gap: 0.58rem;
		}
	}
</style>
