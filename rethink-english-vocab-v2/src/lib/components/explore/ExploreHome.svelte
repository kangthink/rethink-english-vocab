<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, BookOpen, Clock, Plus } from 'lucide-svelte';
	import ArticleList from './ArticleList.svelte';
	import RecentThreads from './RecentThreads.svelte';
	
	let searchQuery = '';
	let articles: any[] = [];
	let recentThreads: any[] = [];
	
	// Mock data - replace with API calls
	const mockArticles = [
		{
			id: 1,
			title: "The Art of Persuasion",
			excerpt: "Explore the nuances of rhetoric and compelling arguments...",
			vocabularyCount: 12,
			difficulty: "Intermediate",
			tags: ["rhetoric", "communication", "language"]
		},
		{
			id: 2,
			title: "Climate Change Terminology",
			excerpt: "Understanding the scientific vocabulary behind environmental discussions...",
			vocabularyCount: 8,
			difficulty: "Advanced",
			tags: ["science", "environment", "technical"]
		},
		{
			id: 3,
			title: "Digital Age Expressions",
			excerpt: "Modern idioms and phrases that emerged from technology...",
			vocabularyCount: 15,
			difficulty: "Basic",
			tags: ["technology", "modern", "idioms"]
		}
	];
	
	const mockRecentThreads = [
		{
			id: 1,
			name: "Emotional Intelligence",
			wordCount: 6,
			lastVisited: "2 hours ago",
			progress: 75
		},
		{
			id: 2,
			name: "Business Terminology",
			wordCount: 12,
			lastVisited: "1 day ago",
			progress: 45
		},
		{
			id: 3,
			name: "Literary Devices",
			wordCount: 9,
			lastVisited: "3 days ago",
			progress: 90
		}
	];
	
	onMount(() => {
		articles = mockArticles;
		recentThreads = mockRecentThreads;
	});
	
	function handleSearch() {
		if (searchQuery.trim()) {
			// Navigate to search results or create new thread
			console.log('Creating thread from search:', searchQuery);
		}
	}
	
	function handleQuickStart() {
		// Start with a random article or popular topic
		console.log('Starting quick exploration session');
	}
</script>

<div class="explore-home">
	<div class="hero-section">
		<div class="hero-content">
			<h1 class="hero-title">Discover Your Vocabulary Universe</h1>
			<p class="hero-subtitle">
				Explore words through AI-powered connections and build your personal vocabulary map
			</p>
			
			<div class="search-section">
				<div class="main-search">
					<input 
						type="text" 
						class="search-input" 
						placeholder="Enter a word to start exploring..."
						bind:value={searchQuery}
						on:keydown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button class="search-submit" on:click={handleSearch}>
						<Search size={20} />
						<span>Explore</span>
					</button>
				</div>
				
				<div class="quick-actions">
					<button class="quick-action" on:click={handleQuickStart}>
						<Plus size={16} />
						Quick Start
					</button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="content-sections">
		<div class="section">
			<div class="section-header">
				<h2 class="section-title">
					<BookOpen size={24} />
					Featured Articles
				</h2>
				<p class="section-subtitle">Curated content to expand your vocabulary</p>
			</div>
			
			<ArticleList {articles} />
		</div>
		
		<div class="section">
			<div class="section-header">
				<h2 class="section-title">
					<Clock size={24} />
					Recent Explorations
				</h2>
				<p class="section-subtitle">Continue where you left off</p>
			</div>
			
			<RecentThreads threads={recentThreads} />
		</div>
		
		<div class="stats-section">
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-number">247</div>
					<div class="stat-label">Words Explored</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-number">18</div>
					<div class="stat-label">Threads Created</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-number">5</div>
					<div class="stat-label">Articles Read</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.explore-home {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--spacing-lg);
	}
	
	.hero-section {
		text-align: center;
		margin-bottom: var(--spacing-3xl);
	}
	
	.hero-content {
		max-width: 600px;
		margin: 0 auto;
	}
	
	.hero-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--matrix-green);
		margin-bottom: var(--spacing-md);
		line-height: 1.2;
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	
	.hero-subtitle {
		font-size: var(--text-lg);
		color: var(--light-gray);
		margin-bottom: var(--spacing-2xl);
		line-height: 1.6;
	}
	
	.search-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		align-items: center;
	}
	
	.main-search {
		display: flex;
		width: 100%;
		max-width: 500px;
		background: var(--navy-blue);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		overflow: hidden;
		border: 1px solid rgba(0, 255, 65, 0.3);
		transition: all 0.2s ease;
	}
	
	.main-search:focus-within {
		border-color: var(--matrix-green);
		box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
	}
	
	.search-input {
		flex: 1;
		padding: var(--spacing-lg);
		border: none;
		font-size: var(--text-lg);
		background: transparent;
		color: var(--white);
		font-family: 'Space Mono', monospace;
	}
	
	.search-input:focus {
		outline: none;
	}
	
	.search-input::placeholder {
		color: var(--medium-gray);
	}
	
	.search-submit {
		background: var(--matrix-green);
		color: var(--deep-dark);
		border: none;
		padding: var(--spacing-lg);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-weight: 600;
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: all 0.2s ease;
	}
	
	.search-submit:hover {
		background: var(--bright-green);
		box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
	}
	
	.quick-actions {
		display: flex;
		gap: var(--spacing-md);
	}
	
	.quick-action {
		background: transparent;
		color: var(--matrix-green);
		border: 1px solid var(--matrix-green);
		border-radius: var(--radius-md);
		padding: var(--spacing-md) var(--spacing-lg);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-weight: 600;
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: all 0.2s ease;
	}
	
	.quick-action:hover {
		background: var(--matrix-green);
		color: var(--deep-dark);
		transform: translateY(-1px);
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
	}
	
	.content-sections {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2xl);
	}
	
	.section {
		background: var(--dark-navy);
		border: 1px solid rgba(0, 255, 65, 0.2);
		border-radius: var(--radius-md);
		padding: var(--spacing-2xl);
		box-shadow: var(--shadow-sm);
		position: relative;
		overflow: hidden;
		transition: all 0.3s ease;
	}
	
	.section::before {
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
	
	.section:hover {
		border-color: var(--matrix-green);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}
	
	.section-header {
		margin-bottom: var(--spacing-xl);
	}
	
	.section-title {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		color: var(--matrix-green);
		font-size: var(--text-xl);
		margin-bottom: var(--spacing-sm);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.section-subtitle {
		color: var(--light-gray);
		font-size: var(--text-base);
		margin: 0;
	}
	
	.stats-section {
		background: linear-gradient(135deg, var(--dark-navy), var(--navy-blue));
		border: 1px solid var(--matrix-green);
		border-radius: var(--radius-md);
		padding: var(--spacing-2xl);
		color: var(--white);
		position: relative;
		overflow: hidden;
	}
	
	.stats-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--matrix-green), transparent);
		animation: scan 3s infinite;
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--spacing-lg);
	}
	
	.stat-card {
		text-align: center;
		padding: var(--spacing-md);
		border-radius: var(--radius-sm);
		background: rgba(0, 255, 65, 0.05);
		border: 1px solid rgba(0, 255, 65, 0.2);
		transition: all 0.2s ease;
	}
	
	.stat-card:hover {
		background: rgba(0, 255, 65, 0.1);
		border-color: var(--matrix-green);
	}
	
	.stat-number {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: var(--spacing-sm);
		color: var(--matrix-green);
		font-family: 'Space Mono', monospace;
	}
	
	.stat-label {
		font-size: var(--text-sm);
		opacity: 0.9;
		color: var(--light-gray);
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	@media (max-width: 768px) {
		.explore-home {
			padding: var(--spacing-md);
		}
		
		.hero-title {
			font-size: 2rem;
		}
		
		.hero-subtitle {
			font-size: var(--text-base);
		}
		
		.main-search {
			flex-direction: column;
		}
		
		.search-submit {
			justify-content: center;
		}
		
		.content-sections {
			gap: var(--spacing-xl);
		}
		
		.section {
			padding: var(--spacing-xl);
		}
	}
	
	@media (max-width: 480px) {
		.quick-actions {
			flex-direction: column;
			width: 100%;
		}
		
		.quick-action {
			justify-content: center;
		}
		
		.stats-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
		}
	}
</style>