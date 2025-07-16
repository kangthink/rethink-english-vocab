<script lang="ts">
	import { Clock, BookOpen, TrendingUp } from 'lucide-svelte';
	
	export let threads: any[] = [];
	
	function handleThreadClick(thread: any) {
		console.log('Opening thread:', thread);
		// Navigate to thread detail
	}
	
	function getProgressColor(progress: number): string {
		if (progress >= 80) return 'var(--lime-green)';
		if (progress >= 50) return 'var(--matrix-green)';
		return 'var(--warning-orange)';
	}
</script>

<div class="recent-threads">
	{#if threads.length === 0}
		<div class="empty-state">
			<BookOpen size={48} />
			<h3>No recent explorations</h3>
			<p>Start exploring words to see your recent threads here</p>
		</div>
	{:else}
		<div class="threads-grid">
			{#each threads as thread}
				<div 
					class="thread-card hover-lift" 
					on:click={() => handleThreadClick(thread)}
					role="button" 
					tabindex="0"
					on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleThreadClick(thread)}
				>
					<div class="thread-header">
						<h3 class="thread-name">{thread.name}</h3>
						<div class="thread-stats">
							<span class="word-count">
								<BookOpen size={14} />
								{thread.wordCount} words
							</span>
							<span class="last-visited">
								<Clock size={14} />
								{thread.lastVisited}
							</span>
						</div>
					</div>
					
					<div class="progress-section">
						<div class="progress-header">
							<span class="progress-label">Progress</span>
							<span class="progress-value">{thread.progress}%</span>
						</div>
						<div class="progress-bar">
							<div 
								class="progress-fill" 
								style="width: {thread.progress}%; background-color: {getProgressColor(thread.progress)}"
							></div>
						</div>
					</div>
					
					<div class="thread-footer">
						<div class="continue-action">
							<TrendingUp size={16} />
							<span>Continue Exploring</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.recent-threads {
		width: 100%;
	}
	
	.empty-state {
		text-align: center;
		padding: var(--spacing-3xl) var(--spacing-lg);
		color: var(--light-gray);
	}
	
	.empty-state h3 {
		margin: var(--spacing-lg) 0 var(--spacing-sm);
		color: var(--matrix-green);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.threads-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--spacing-lg);
	}
	
	.thread-card {
		background: var(--dark-navy);
		border: 1px solid rgba(0, 255, 65, 0.2);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		overflow: hidden;
	}
	
	.thread-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--matrix-green), transparent);
		animation: scan 3s infinite;
	}
	
	@keyframes scan {
		0% { left: -100%; }
		100% { left: 100%; }
	}
	
	.thread-card:hover {
		border-color: var(--matrix-green);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}
	
	.thread-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
	
	.thread-name {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--white);
		margin: 0;
		line-height: 1.3;
		font-family: 'Space Mono', monospace;
	}
	
	.thread-stats {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}
	
	.word-count,
	.last-visited {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		font-size: var(--text-sm);
		color: var(--light-gray);
	}
	
	.progress-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
	
	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.progress-label {
		font-size: var(--text-sm);
		color: var(--light-gray);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: 'Space Mono', monospace;
	}
	
	.progress-value {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--matrix-green);
		font-family: 'Space Mono', monospace;
	}
	
	.progress-bar {
		height: 6px;
		background: rgba(0, 255, 65, 0.1);
		border: 1px solid rgba(0, 255, 65, 0.2);
		border-radius: 3px;
		overflow: hidden;
	}
	
	.progress-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0.3s ease;
		position: relative;
		overflow: hidden;
	}
	
	.progress-fill::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.3),
			transparent
		);
		animation: shimmer 2s infinite;
	}
	
	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}
	
	.thread-footer {
		margin-top: auto;
		padding-top: var(--spacing-sm);
	}
	
	.continue-action {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--matrix-green);
		font-weight: 600;
		font-size: var(--text-sm);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
		opacity: 0;
		transition: opacity 0.2s ease;
	}
	
	.thread-card:hover .continue-action {
		opacity: 1;
	}
	
	@media (max-width: 768px) {
		.threads-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
		}
		
		.thread-card {
			padding: var(--spacing-md);
		}
		
		.continue-action {
			opacity: 1;
		}
		
		.thread-stats {
			flex-direction: row;
			gap: var(--spacing-md);
		}
	}
	
	@media (max-width: 480px) {
		.thread-stats {
			flex-direction: column;
			gap: var(--spacing-xs);
		}
	}
</style>