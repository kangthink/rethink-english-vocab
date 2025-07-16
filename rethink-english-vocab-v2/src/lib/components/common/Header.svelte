<script lang="ts">
	import { Menu, User, Search } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	
	export let toggleMobileMenu: () => void;
	
	function handleSearchClick() {
		goto('/search');
	}
	
	function handleProfileClick() {
		goto('/profile');
	}
</script>

<header class="header">
	<div class="header-content">
		<div class="header-left">
			<button 
				class="mobile-menu-btn" 
				on:click={toggleMobileMenu}
				aria-label="Toggle menu"
			>
				<Menu size={24} />
			</button>
		</div>
		
		<div class="header-center">
			<div class="logo">
				<span class="logo-text">RETHINK</span>
				<span class="logo-accent">VOCAB</span>
			</div>
		</div>
		
		<div class="header-right">
			<button class="icon-btn search-btn" on:click={handleSearchClick} aria-label="Search">
				<Search size={20} />
			</button>
			<button class="icon-btn profile-btn" on:click={handleProfileClick} aria-label="Profile">
				<User size={20} />
			</button>
		</div>
	</div>
</header>

<style>
	.header {
		background: var(--dark-navy);
		border-bottom: 1px solid rgba(0, 255, 65, 0.2);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
		position: sticky;
		top: 0;
		z-index: 100;
		backdrop-filter: blur(10px);
	}
	
	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-md) var(--spacing-lg);
		max-width: 100%;
		margin: 0;
	}
	
	.header-left {
		display: flex;
		align-items: center;
		min-width: 60px;
	}
	
	.mobile-menu-btn {
		background: none;
		border: 1px solid rgba(0, 255, 65, 0.3);
		cursor: pointer;
		color: var(--matrix-green);
		display: block;
		padding: var(--spacing-sm);
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
	}
	
	.mobile-menu-btn:hover {
		background: rgba(0, 255, 65, 0.1);
		border-color: var(--matrix-green);
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
	}
	
	.header-center {
		flex: 1;
		display: flex;
		justify-content: center;
	}
	
	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		line-height: 1;
	}
	
	.logo-text {
		font-size: var(--text-lg);
		color: var(--white);
		letter-spacing: 2px;
	}
	
	.logo-accent {
		font-size: var(--text-sm);
		color: var(--matrix-green);
		letter-spacing: 1px;
		margin-top: -2px;
	}
	
	.header-right {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		min-width: 60px;
		justify-content: flex-end;
	}
	
	.icon-btn {
		background: none;
		border: 1px solid rgba(0, 255, 65, 0.3);
		cursor: pointer;
		color: var(--matrix-green);
		padding: var(--spacing-sm);
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
	}
	
	.icon-btn:hover {
		background: rgba(0, 255, 65, 0.1);
		border-color: var(--matrix-green);
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
	}
	
	@media (max-width: 768px) {
		.header-content {
			padding: var(--spacing-md);
		}
		
		.logo-text {
			font-size: var(--text-base);
		}
		
		.logo-accent {
			font-size: var(--text-xs);
		}
	}
</style>