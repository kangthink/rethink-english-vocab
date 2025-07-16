<script lang="ts">
	import { BookOpen, Clock, Tag } from 'lucide-svelte';
	
	export let articles: any[] = [];
	
	function handleArticleClick(article: any) {
		console.log('Creating thread from article:', article);
		// Navigate to thread creation from article
	}
	
	function getDifficultyColor(difficulty: string): string {
		switch (difficulty.toLowerCase()) {
			case 'basic': return 'var(--lime-green)';
			case 'intermediate': return 'var(--matrix-green)';
			case 'advanced': return 'var(--warning-orange)';
			default: return 'var(--medium-gray)';
		}
	}
</script>

<div class="article-list">
	{#each articles as article}
		<article 
			class="article-card hover-lift" 
			on:click={() => handleArticleClick(article)}
			role="button" 
			tabindex="0"
			on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleArticleClick(article)}
		>
			<div class="article-header">
				<h3 class="article-title">{article.title}</h3>
				<div class="article-meta">
					<span class="difficulty" style="color: {getDifficultyColor(article.difficulty)}">
						{article.difficulty}
					</span>
					<span class="vocab-count">
						<BookOpen size={14} />
						{article.vocabularyCount} words
					</span>
				</div>
			</div>
			
			<p class="article-excerpt">{article.excerpt}</p>
			
			<div class="article-footer">
				<div class="tags">
					{#each article.tags as tag}
						<span class="tag">
							<Tag size={12} />
							{tag}
						</span>
					{/each}
				</div>
				
				<div class="article-action">
					<span class="action-text">Start Exploring</span>
				</div>
			</div>
		</article>
	{/each}
</div>

<style>
	.article-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-lg);
	}
	
	.article-card {
		background: var(--dark-navy);
		border: 1px solid rgba(0, 255, 65, 0.2);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}
	
	.article-card::before {
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
	
	.article-card:hover {
		border-color: var(--matrix-green);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}
	
	.article-header {
		margin-bottom: var(--spacing-md);
	}
	
	.article-title {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--white);
		margin-bottom: var(--spacing-sm);
		line-height: 1.3;
		font-family: 'Space Mono', monospace;
	}
	
	.article-meta {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		font-size: var(--text-sm);
	}
	
	.difficulty {
		font-weight: 600;
		text-transform: uppercase;
		font-size: var(--text-xs);
		letter-spacing: 0.5px;
		font-family: 'Space Mono', monospace;
	}
	
	.vocab-count {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		color: var(--light-gray);
	}
	
	.article-excerpt {
		color: var(--light-gray);
		line-height: 1.6;
		margin-bottom: var(--spacing-lg);
		font-size: var(--text-sm);
	}
	
	.article-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
	}
	
	.tags {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}
	
	.tag {
		display: flex;
		align-items: center;
		gap: 2px;
		background: rgba(0, 255, 65, 0.1);
		color: var(--matrix-green);
		border: 1px solid rgba(0, 255, 65, 0.3);
		padding: 2px var(--spacing-xs);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: 500;
		font-family: 'Space Mono', monospace;
		transition: all 0.2s ease;
	}
	
	.tag:hover {
		background: rgba(0, 255, 65, 0.2);
		border-color: var(--matrix-green);
	}
	
	.article-action {
		opacity: 0;
		transition: opacity 0.2s ease;
	}
	
	.article-card:hover .article-action {
		opacity: 1;
	}
	
	.action-text {
		color: var(--matrix-green);
		font-weight: 600;
		font-size: var(--text-sm);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	@media (max-width: 768px) {
		.article-list {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
		}
		
		.article-card {
			padding: var(--spacing-md);
		}
		
		.article-footer {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-sm);
		}
		
		.article-action {
			opacity: 1;
		}
	}
</style>