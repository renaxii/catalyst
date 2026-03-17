<script>
	import { reveal } from '$lib/actions.js';
</script>

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

<style>
	:global(html[data-theme='dark'] .prize-card) {
		background-color: rgba(15, 23, 42, 0.6) !important;
		border-color: rgba(148, 163, 184, 0.3) !important;
	}

	:global(html[data-theme='dark'] .prize-card-img-wrap) {
		background-color: rgba(15, 23, 42, 0.8) !important;
	}
</style>
