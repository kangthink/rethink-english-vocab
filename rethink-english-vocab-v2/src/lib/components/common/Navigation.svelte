<script lang="ts">
	import { page } from '$app/stores';
	import { Search, Zap, Clock, Trophy, User } from 'lucide-svelte';
	
	export let isMobileMenuOpen = false;
	
	const navItems = [
		{
			href: '/',
			label: 'Explore',
			icon: Search,
			description: 'Discover new words'
		},
		{
			href: '/train',
			label: 'Train',
			icon: Zap,
			description: 'Practice & improve'
		},
		{
			href: '/history',
			label: 'History',
			icon: Clock,
			description: 'View your progress'
		},
		{
			href: '/rank',
			label: 'Rank',
			icon: Trophy,
			description: 'Compare with others'
		},
		{
			href: '/profile',
			label: 'Profile',
			icon: User,
			description: 'Your account'
		}
	];
	
	$: currentPath = $page.url.pathname;
	
	function isActive(href: string): boolean {
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}
	
	function closeMenu() {
		isMobileMenuOpen = false;
	}
</script>

<!-- Desktop Navigation -->
<nav class="navigation desktop-nav" class:open={isMobileMenuOpen}>
	<div class="nav-content">
		<ul class="nav-list">
			{#each navItems as item}
				<li class="nav-item">
					<a 
						href={item.href}
						class="nav-link"
						class:active={isActive(item.href)}
						on:click={closeMenu}
					>
						<div class="nav-icon">
							<svelte:component this={item.icon} size={20} />
						</div>
						<div class="nav-text">
							<span class="nav-label">{item.label}</span>
							<span class="nav-description">{item.description}</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>

<!-- Mobile Bottom Navigation -->
<nav class="bottom-navigation">
	<div class="bottom-nav-content">
		{#each navItems as item}
			<a 
				href={item.href}
				class="bottom-nav-item"
				class:active={isActive(item.href)}
			>
				<div class="bottom-nav-icon">
					<svelte:component this={item.icon} size={20} />
				</div>
				<span class="bottom-nav-label">{item.label}</span>
			</a>
		{/each}
	</div>
</nav>

{#if isMobileMenuOpen}
	<div class="overlay" on:click={closeMenu} role="button" tabindex="0"></div>
{/if}

<style>
	/* Desktop Navigation */
	.desktop-nav {
		width: 280px;
		background: var(--dark-navy);
		border-right: 1px solid rgba(0, 255, 65, 0.2);
		height: calc(100vh - 70px);
		position: sticky;
		top: 70px;
		overflow-y: auto;
		transition: transform 0.3s ease;
	}
	
	.nav-content {
		padding: var(--spacing-lg);
	}
	
	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	
	.nav-item {
		margin-bottom: var(--spacing-sm);
	}
	
	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--light-gray);
		transition: all 0.2s ease;
		position: relative;
		border-left: 3px solid transparent;
		font-family: 'Space Mono', monospace;
	}
	
	.nav-link:hover {
		background: rgba(0, 255, 65, 0.1);
		border-left-color: var(--matrix-green);
		color: var(--matrix-green);
	}
	
	.nav-link.active {
		background: rgba(0, 255, 65, 0.2);
		border-left-color: var(--matrix-green);
		color: var(--matrix-green);
	}
	
	.nav-link.active .nav-description {
		color: rgba(0, 255, 65, 0.8);
	}
	
	.nav-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.nav-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	
	.nav-label {
		font-weight: 600;
		font-size: var(--text-base);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.nav-description {
		font-size: var(--text-xs);
		color: var(--medium-gray);
		transition: color 0.2s ease;
		text-transform: none;
		letter-spacing: normal;
	}
	
	/* Mobile Bottom Navigation */
	.bottom-navigation {
		display: none;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--dark-navy);
		border-top: 1px solid rgba(0, 255, 65, 0.2);
		z-index: 1000;
		backdrop-filter: blur(10px);
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
	}
	
	.bottom-nav-content {
		display: flex;
		justify-content: space-around;
		padding: var(--spacing-sm) 0;
		max-width: 500px;
		margin: 0 auto;
	}
	
	.bottom-nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: var(--medium-gray);
		transition: all 0.2s ease;
		min-width: 60px;
		position: relative;
	}
	
	.bottom-nav-item:hover {
		color: var(--matrix-green);
	}
	
	.bottom-nav-item.active {
		color: var(--matrix-green);
	}
	
	.bottom-nav-item.active::before {
		content: '';
		position: absolute;
		top: -1px;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 2px;
		background: var(--matrix-green);
		border-radius: 1px;
	}
	
	.bottom-nav-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2px;
	}
	
	.bottom-nav-label {
		font-size: 10px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Mono', monospace;
	}
	
	.overlay {
		display: none;
	}
	
	@media (max-width: 768px) {
		.desktop-nav {
			position: fixed;
			top: 70px;
			left: 0;
			z-index: 200;
			transform: translateX(-100%);
			box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
		}
		
		.desktop-nav.open {
			transform: translateX(0);
		}
		
		.bottom-navigation {
			display: block;
		}
		
		.overlay {
			display: block;
			position: fixed;
			top: 70px;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.7);
			z-index: 150;
		}
	}
	
	@media (max-width: 480px) {
		.desktop-nav {
			width: 100vw;
		}
		
		.bottom-nav-content {
			padding: var(--spacing-xs) 0;
		}
		
		.bottom-nav-item {
			min-width: 50px;
		}
		
		.bottom-nav-label {
			font-size: 9px;
		}
	}
</style>