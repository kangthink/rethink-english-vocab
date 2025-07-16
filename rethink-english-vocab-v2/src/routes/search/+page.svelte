<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, X, Clock, TrendingUp } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	
	let searchQuery = '';
	let searchResults: any[] = [];
	let recentSearches = ['algorithm', 'machine learning', 'artificial intelligence', 'quantum computing'];
	let trendingWords = ['blockchain', 'metaverse', 'sustainability', 'innovation'];
	let isSearching = false;
	
	function handleBack() {
		goto('/');
	}
	
	async function handleSearch() {
		if (!searchQuery.trim()) return;
		
		isSearching = true;
		
		// Simulate API call
		setTimeout(() => {
			searchResults = [
				{
					word: searchQuery,
					definition: 'A sample definition for the searched word',
					concept: 'core concept',
					examples: ['Example sentence 1', 'Example sentence 2'],
					relevance: 95
				}
			];
			isSearching = false;
		}, 1000);
	}
	
	function handleQuickSearch(word: string) {
		searchQuery = word;
		handleSearch();
	}
	
	function clearSearch() {
		searchQuery = '';
		searchResults = [];
	}
	
	onMount(() => {
		// Auto-focus search input
		const searchInput = document.querySelector('.search-input') as HTMLInputElement;
		if (searchInput) {
			searchInput.focus();
		}
	});
</script>

<svelte:head>
	<title>Search - Rethink English Vocab</title>
</svelte:head>

<div class="search-page">
	<div class="search-header">
		<button class="back-btn" on:click={handleBack}>
			<X size={24} />
		</button>
		
		<div class="search-container">
			<div class="search-box">
				<Search size={20} class="search-icon" />
				<input 
					type="text" 
					class="search-input"
					placeholder="Search for words..."
					bind:value={searchQuery}
					on:input={handleSearch}
					on:keydown={(e) => e.key === 'Enter' && handleSearch()}
				/>
				{#if searchQuery}
					<button class="clear-btn" on:click={clearSearch}>
						<X size={16} />
					</button>
				{/if}
			</div>
		</div>
	</div>
	
	<div class="search-content">
		{#if isSearching}
			<div class="loading-state">
				<div class="loader"></div>
				<p>Searching...</p>
			</div>
		{:else if searchResults.length > 0}
			<div class="results-section">
				<h2>Search Results</h2>
				<div class="results-list">
					{#each searchResults as result}
						<div class="result-card">
							<div class="result-header">
								<h3 class="word-title">{result.word}</h3>
								<span class="relevance-badge">{result.relevance}% match</span>
							</div>
							<p class="word-definition">{result.definition}</p>
							<div class="word-concept">
								<span class="concept-label">Concept:</span>
								<span class="concept-value">{result.concept}</span>
							</div>
							<div class="examples-section">
								<h4>Examples:</h4>
								<ul class="examples-list">
									{#each result.examples as example}
										<li>{example}</li>
									{/each}
								</ul>
							</div>
							<button class="explore-btn">
								<TrendingUp size={16} />
								Start Exploring
							</button>
						</div>
					{/each}
				</div>
			</div>
		{:else if searchQuery}
			<div class="no-results">
				<p>No results found for "{searchQuery}"</p>
				<p class="suggestion">Try searching for a different word or check your spelling.</p>
			</div>
		{:else}
			<div class="search-suggestions">
				<div class="suggestions-section">
					<h3>
						<Clock size={20} />
						Recent Searches
					</h3>
					<div class="suggestions-grid">
						{#each recentSearches as word}
							<button class="suggestion-chip" on:click={() => handleQuickSearch(word)}>
								{word}
							</button>
						{/each}
					</div>
				</div>
				
				<div class="suggestions-section">
					<h3>
						<TrendingUp size={20} />
						Trending Words
					</h3>
					<div class="suggestions-grid">
						{#each trendingWords as word}
							<button class="suggestion-chip trending" on:click={() => handleQuickSearch(word)}>
								{word}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.search-page {
		min-height: 100vh;
		background: var(--deep-dark);
		display: flex;
		flex-direction: column;
	}
	
	.search-header {
		background: var(--dark-navy);
		border-bottom: 1px solid rgba(0, 255, 65, 0.2);
		padding: var(--spacing-md);
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		position: sticky;
		top: 0;
		z-index: 100;
	}
	
	.back-btn {
		background: none;
		border: 1px solid rgba(0, 255, 65, 0.3);
		color: var(--matrix-green);
		padding: var(--spacing-sm);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 40px;
		height: 40px;
	}
	
	.back-btn:hover {
		background: rgba(0, 255, 65, 0.1);
		border-color: var(--matrix-green);
	}
	
	.search-container {
		flex: 1;
	}
	
	.search-box {
		position: relative;
		display: flex;
		align-items: center;
		background: var(--navy-blue);
		border: 1px solid rgba(0, 255, 65, 0.3);
		border-radius: var(--radius-md);
		padding: var(--spacing-sm) var(--spacing-md);
		transition: all 0.2s ease;
	}
	
	.search-box:focus-within {
		border-color: var(--matrix-green);
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
	}
	
	.search-icon {
		color: var(--matrix-green);
		margin-right: var(--spacing-sm);
	}
	
	.search-input {
		flex: 1;
		background: none;
		border: none;
		color: var(--white);
		font-size: var(--text-base);
		font-family: 'Space Mono', monospace;
		outline: none;
	}
	
	.search-input::placeholder {
		color: var(--medium-gray);
	}
	
	.clear-btn {
		background: none;
		border: none;
		color: var(--medium-gray);
		cursor: pointer;
		padding: 2px;
		border-radius: 2px;
		transition: color 0.2s ease;
	}
	
	.clear-btn:hover {
		color: var(--matrix-green);
	}
	
	.search-content {
		flex: 1;
		padding: var(--spacing-lg);
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
	}
	
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		padding: var(--spacing-3xl);
		color: var(--light-gray);
	}
	
	.loader {
		width: 40px;
		height: 40px;
		border: 3px solid rgba(0, 255, 65, 0.2);
		border-top: 3px solid var(--matrix-green);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.results-section h2 {
		color: var(--matrix-green);
		margin-bottom: var(--spacing-lg);
		font-size: var(--text-xl);
	}
	
	.result-card {
		background: var(--dark-navy);
		border: 1px solid rgba(0, 255, 65, 0.2);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		margin-bottom: var(--spacing-md);
		transition: all 0.2s ease;
	}
	
	.result-card:hover {
		border-color: var(--matrix-green);
		box-shadow: 0 0 15px rgba(0, 255, 65, 0.1);
	}
	
	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-md);
	}
	
	.word-title {
		color: var(--white);
		font-size: var(--text-xl);
		margin: 0;
	}
	
	.relevance-badge {
		background: rgba(0, 255, 65, 0.2);
		color: var(--matrix-green);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: 600;
	}
	
	.word-definition {
		color: var(--light-gray);
		margin-bottom: var(--spacing-md);
		line-height: 1.6;
	}
	
	.word-concept {
		margin-bottom: var(--spacing-md);
	}
	
	.concept-label {
		color: var(--medium-gray);
		font-size: var(--text-sm);
		margin-right: var(--spacing-sm);
	}
	
	.concept-value {
		color: var(--matrix-green);
		font-weight: 600;
	}
	
	.examples-section h4 {
		color: var(--white);
		font-size: var(--text-sm);
		margin-bottom: var(--spacing-sm);
	}
	
	.examples-list {
		list-style: none;
		margin-bottom: var(--spacing-lg);
	}
	
	.examples-list li {
		color: var(--light-gray);
		font-size: var(--text-sm);
		margin-bottom: var(--spacing-xs);
		padding-left: var(--spacing-md);
		position: relative;
	}
	
	.examples-list li::before {
		content: '▸';
		color: var(--matrix-green);
		position: absolute;
		left: 0;
	}
	
	.explore-btn {
		background: transparent;
		border: 1px solid var(--matrix-green);
		color: var(--matrix-green);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-md);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-family: 'Space Mono', monospace;
		font-weight: 600;
		transition: all 0.2s ease;
	}
	
	.explore-btn:hover {
		background: var(--matrix-green);
		color: var(--deep-dark);
	}
	
	.no-results {
		text-align: center;
		padding: var(--spacing-3xl);
		color: var(--light-gray);
	}
	
	.suggestion {
		color: var(--medium-gray);
		font-size: var(--text-sm);
		margin-top: var(--spacing-md);
	}
	
	.search-suggestions {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2xl);
	}
	
	.suggestions-section h3 {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--matrix-green);
		font-size: var(--text-lg);
		margin-bottom: var(--spacing-md);
	}
	
	.suggestions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--spacing-sm);
	}
	
	.suggestion-chip {
		background: var(--navy-blue);
		border: 1px solid rgba(0, 255, 65, 0.3);
		color: var(--light-gray);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-family: 'Space Mono', monospace;
		font-size: var(--text-sm);
		transition: all 0.2s ease;
		text-align: center;
	}
	
	.suggestion-chip:hover {
		border-color: var(--matrix-green);
		color: var(--matrix-green);
		background: rgba(0, 255, 65, 0.05);
	}
	
	.suggestion-chip.trending {
		border-color: var(--electric-blue);
		color: var(--electric-blue);
	}
	
	.suggestion-chip.trending:hover {
		background: rgba(0, 212, 255, 0.05);
	}
	
	@media (max-width: 768px) {
		.search-content {
			padding: var(--spacing-md);
		}
		
		.suggestions-grid {
			grid-template-columns: 1fr 1fr;
		}
		
		.result-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-sm);
		}
	}
</style>