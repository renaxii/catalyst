<script>
	import favicon from '$lib/assets/favicon.svg';

	let { isDark, toggleTheme } = $props();

	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleAnchorClick(event) {
		const href = event.currentTarget.getAttribute('href');
		if (!href?.startsWith('#')) return;

		event.preventDefault();
		closeMobileMenu();

		const targetId = href.substring(1);
		const targetElement = document.getElementById(targetId);

		if (!targetElement) return;

		// Use requestAnimationFrame to ensure layout is ready
		requestAnimationFrame(() => {
			const navHeight = 4; // 4rem in units of 16px
			const navHeightPx = navHeight * 16;
			const gapPx = 0.9 * 16; // 0.9rem gap
			const totalOffset = navHeightPx + gapPx;

			const elementRect = targetElement.getBoundingClientRect();
			const scrollTop = window.scrollY + elementRect.top - totalOffset;

			window.scrollTo({
				top: scrollTop,
				behavior: 'smooth'
			});
		});
	}
</script>

	<nav class="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
	<a
		href="#page-top"
		onclick={handleAnchorClick}
		aria-label="Back to hero section"
		class="micro-interactive absolute left-3 top-1/2 z-10 inline-flex -translate-y-1/2 items-center gap-2.5 font-heading text-[1.02rem] font-bold leading-none tracking-tight text-gray-900 no-underline hover:text-gray-900 sm:left-4 md:left-6"
	>
		<img src={favicon} alt="" class="h-5 w-5 rounded-[0.35rem] bg-white p-0.5 sm:h-6 sm:w-6" />
		<span>Catalyst</span>
	</a>
	<div class="mx-auto flex h-(--nav-height) w-full max-w-5xl items-center justify-end px-4 sm:px-6 md:px-8">
		<ul class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex lg:gap-9">
				{#each [['#challenge', 'Challenge'], ['#process', 'Process'], ['#prizes', 'Prizes'], ['#faq', 'FAQ']] as [href, label]}
					<li>
						<a
							{href}
							onclick={handleAnchorClick}
							class="micro-interactive group relative inline-block translate-y-0 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:text-dodger"
						>
							{label}
							<span
								class="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-dodger transition-transform duration-300 ease-out group-hover:scale-x-100"
							></span>
						</a>
					</li>
				{/each}
		</ul>
		<div class="hidden items-center md:flex md:pr-0.5">
			<button
				type="button"
				onclick={toggleTheme}
				class={`micro-interactive inline-flex h-8 w-21 items-center justify-center rounded-full border px-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-all duration-200 sm:w-[5.4rem] sm:px-3 ${
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
				class={`micro-interactive inline-flex h-10 w-20 items-center justify-center rounded-full border px-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 sm:w-[5.35rem] sm:px-3 ${
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
		class={`absolute inset-x-0 top-full border-t border-gray-200 bg-white shadow-lg transition-all duration-220 md:hidden ${mobileMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
	>
		<ul class="space-y-1 px-4 py-3 text-center sm:px-6">
			{#each [['#challenge', 'Challenge'], ['#process', 'Process'], ['#prizes', 'Prizes'], ['#faq', 'FAQ']] as [href, label]}
				<li>
					<a
						{href}
						onclick={(e) => { handleAnchorClick(e); closeMobileMenu(); }}
						class="micro-interactive block rounded-md px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-gray-600 transition-colors duration-200 hover:text-dodger"
					>
						{label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>
