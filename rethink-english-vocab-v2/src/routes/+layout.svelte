<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/common/Header.svelte';
	import Navigation from '$lib/components/common/Navigation.svelte';
	import { page } from '$app/stores';
	
	let isMobileMenuOpen = false;
	
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<div class="app">
	<Header {toggleMobileMenu} />
	
	<div class="main-content">
		<Navigation bind:isMobileMenuOpen />
		
		<main class="content-area">
			<slot />
		</main>
	</div>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.main-content {
		flex: 1;
		display: flex;
	}
	
	.content-area {
		flex: 1;
		padding: var(--spacing-lg);
		overflow-y: auto;
	}
	
	@media (max-width: 768px) {
		.content-area {
			padding: var(--spacing-md);
		}
	}
</style>