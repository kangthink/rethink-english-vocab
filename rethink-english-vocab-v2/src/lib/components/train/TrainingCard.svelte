<script lang="ts">
	import { Play, Clock, Trophy, Star } from 'lucide-svelte';
	
	export let training: any;
	export let getDifficultyColor: (difficulty: string) => string;
	export let onStart: (training: any) => void;
	export let featured: boolean = false;
	
	function getIconComponent(iconType: string) {
		// Return appropriate icon based on training type
		return Play; // Default icon
	}
</script>

<div 
	class="training-card" 
	class:featured
	style="--card-color: {training.color}"
>
	{#if featured}
		<div class="featured-badge">
			<Star size={12} />
			Recommended
		</div>
	{/if}
	
	<div class="card-header">
		<div class="training-icon" style="background-color: {training.color}20; color: {training.color}">
			<svelte:component this={getIconComponent(training.icon)} size={24} />
		</div>
		
		<div class="training-info">
			<h3 class="training-name">{training.name}</h3>
			<p class="training-description">{training.description}</p>
		</div>
	</div>
	
	<div class="card-details">
		<div class="detail-row">
			<span class="detail-label">Difficulty:</span>
			<span class="difficulty-badge" style="color: {getDifficultyColor(training.difficulty)}">
				{training.difficulty}
			</span>
		</div>
		
		<div class="detail-row">
			<span class="detail-label">
				<Clock size={14} />
				Duration:
			</span>
			<span class="detail-value">{training.estimatedTime}</span>
		</div>
		
		<div class="detail-row">
			<span class="detail-label">Sessions:</span>
			<span class="detail-value">{training.sessions}</span>
		</div>
		
		<div class="detail-row">
			<span class="detail-label">
				<Trophy size={14} />
				Best Score:
			</span>
			<span class="detail-value best-score">{training.bestScore}%</span>
		</div>
	</div>
	
	<div class="card-footer">
		<button 
			class="start-button"
			on:click={() => onStart(training)}
		>
			<Play size={16} />
			Start Training
		</button>
	</div>
</div>

<style>
	.training-card {
		background: var(--dark-navy);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		box-shadow: var(--shadow-sm);
		transition: all 0.3s ease;
		position: relative;
		border: 1px solid rgba(0, 255, 65, 0.2);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		overflow: hidden;
	}
	
	.training-card::before {
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
	
	.training-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-md);
		border-color: var(--matrix-green);
	}
	
	.training-card.featured {
		border-color: var(--matrix-green);
		background: linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, var(--dark-navy) 100%);
	}
	
	.featured-badge {
		position: absolute;
		top: -8px;
		right: var(--spacing-md);
		background: var(--matrix-green);
		color: var(--deep-dark);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 4px;
		box-shadow: var(--shadow-sm);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.card-header {
		display: flex;
		gap: var(--spacing-md);
		align-items: flex-start;
	}
	
	.training-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		background: rgba(0, 255, 65, 0.1) !important;
		color: var(--matrix-green) !important;
		border: 1px solid rgba(0, 255, 65, 0.3);
	}
	
	.training-info {
		flex: 1;
	}
	
	.training-name {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--white);
		margin: 0 0 var(--spacing-xs) 0;
		line-height: 1.3;
		font-family: 'Space Mono', monospace;
	}
	
	.training-description {
		font-size: var(--text-sm);
		color: var(--light-gray);
		margin: 0;
		line-height: 1.4;
	}
	
	.card-details {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-md) 0;
		border-top: 1px solid rgba(0, 255, 65, 0.2);
		border-bottom: 1px solid rgba(0, 255, 65, 0.2);
	}
	
	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-sm);
	}
	
	.detail-label {
		color: var(--light-gray);
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		font-weight: 500;
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-size: var(--text-xs);
	}
	
	.detail-value {
		color: var(--white);
		font-weight: 600;
		font-family: 'Space Mono', monospace;
	}
	
	.difficulty-badge {
		font-weight: 700;
		text-transform: uppercase;
		font-size: var(--text-xs);
		letter-spacing: 0.5px;
		font-family: 'Space Mono', monospace;
	}
	
	.best-score {
		color: var(--matrix-green);
	}
	
	.card-footer {
		margin-top: auto;
	}
	
	.start-button {
		width: 100%;
		background: var(--matrix-green);
		color: var(--deep-dark);
		border: none;
		border-radius: var(--radius-md);
		padding: var(--spacing-md) var(--spacing-lg);
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		transition: all 0.2s ease;
		font-size: var(--text-base);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.start-button:hover {
		transform: translateY(-1px);
		background: var(--bright-green);
		box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
	}
	
	.start-button:active {
		transform: translateY(0);
	}
	
	@media (max-width: 768px) {
		.training-card {
			padding: var(--spacing-md);
		}
		
		.card-header {
			gap: var(--spacing-sm);
		}
		
		.training-icon {
			width: 40px;
			height: 40px;
		}
		
		.training-name {
			font-size: var(--text-base);
		}
	}
</style>