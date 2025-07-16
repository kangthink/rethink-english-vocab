<script lang="ts">
	import { onMount } from 'svelte';
	import { Zap, Clock, Target, Star, Play, Award } from 'lucide-svelte';
	import TrainingCard from './TrainingCard.svelte';
	
	let trainings: any[] = [];
	let userStats = {
		totalSessions: 0,
		averageScore: 0,
		completedTrainings: 0,
		currentStreak: 0
	};
	
	const mockTrainings = [
		{
			id: 1,
			name: "Vocabulary Quiz",
			description: "Test your knowledge of recently learned words",
			difficulty: "Adaptive",
			estimatedTime: "5-10 min",
			icon: "quiz",
			color: "var(--primary-blue)",
			sessions: 23,
			bestScore: 87,
			recommended: true
		},
		{
			id: 2,
			name: "Definition Matching",
			description: "Match words with their correct definitions",
			difficulty: "Intermediate",
			estimatedTime: "8-12 min",
			icon: "match",
			color: "var(--primary-green)",
			sessions: 15,
			bestScore: 92,
			recommended: false
		},
		{
			id: 3,
			name: "Context Clues",
			description: "Understand word meanings from sentence context",
			difficulty: "Advanced",
			estimatedTime: "10-15 min",
			icon: "context",
			color: "var(--primary-orange)",
			sessions: 8,
			bestScore: 78,
			recommended: false
		},
		{
			id: 4,
			name: "Synonym Challenge",
			description: "Find synonyms and related words quickly",
			difficulty: "Basic",
			estimatedTime: "5-8 min",
			icon: "synonym",
			color: "var(--primary-yellow)",
			sessions: 31,
			bestScore: 95,
			recommended: true
		},
		{
			id: 5,
			name: "Spelling Master",
			description: "Perfect your spelling of complex vocabulary",
			difficulty: "Advanced",
			estimatedTime: "7-10 min",
			icon: "spelling",
			color: "#9B59B6",
			sessions: 12,
			bestScore: 84,
			recommended: false
		},
		{
			id: 6,
			name: "Speed Review",
			description: "Quick fire questions to reinforce learning",
			difficulty: "Adaptive",
			estimatedTime: "3-5 min",
			icon: "speed",
			color: "#E74C3C",
			sessions: 45,
			bestScore: 89,
			recommended: true
		}
	];
	
	onMount(() => {
		trainings = mockTrainings;
		userStats = {
			totalSessions: 134,
			averageScore: 86,
			completedTrainings: 6,
			currentStreak: 7
		};
	});
	
	function handleTrainingStart(training: any) {
		console.log('Starting training:', training);
		// Navigate to training session
	}
	
	function getDifficultyColor(difficulty: string): string {
		switch (difficulty.toLowerCase()) {
			case 'basic': return 'var(--lime-green)';
			case 'intermediate': return 'var(--matrix-green)';
			case 'advanced': return 'var(--warning-orange)';
			case 'adaptive': return 'var(--electric-blue)';
			default: return 'var(--medium-gray)';
		}
	}
</script>

<div class="training-page">
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">
				<Zap size={32} />
				Training Center
			</h1>
			<p class="page-subtitle">
				Strengthen your vocabulary through targeted practice sessions
			</p>
		</div>
		
		<div class="stats-overview">
			<div class="stat-item">
				<div class="stat-icon">
					<Target size={24} />
				</div>
				<div class="stat-content">
					<div class="stat-value">{userStats.totalSessions}</div>
					<div class="stat-label">Total Sessions</div>
				</div>
			</div>
			
			<div class="stat-item">
				<div class="stat-icon">
					<Star size={24} />
				</div>
				<div class="stat-content">
					<div class="stat-value">{userStats.averageScore}%</div>
					<div class="stat-label">Average Score</div>
				</div>
			</div>
			
			<div class="stat-item">
				<div class="stat-icon">
					<Award size={24} />
				</div>
				<div class="stat-content">
					<div class="stat-value">{userStats.currentStreak}</div>
					<div class="stat-label">Day Streak</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="training-sections">
		<section class="recommended-section">
			<h2 class="section-title">
				<Star size={20} />
				Recommended for You
			</h2>
			<div class="training-grid">
				{#each trainings.filter(t => t.recommended) as training}
					<TrainingCard {training} {getDifficultyColor} onStart={handleTrainingStart} featured={true} />
				{/each}
			</div>
		</section>
		
		<section class="all-trainings-section">
			<h2 class="section-title">
				<Zap size={20} />
				All Training Types
			</h2>
			<div class="training-grid">
				{#each trainings.filter(t => !t.recommended) as training}
					<TrainingCard {training} {getDifficultyColor} onStart={handleTrainingStart} featured={false} />
				{/each}
			</div>
		</section>
		
		<section class="progress-section">
			<div class="progress-card">
				<h3 class="progress-title">Your Progress</h3>
				<div class="progress-stats">
					<div class="progress-item">
						<div class="progress-circle">
							<div class="circle-progress" style="--progress: {(userStats.completedTrainings / 6) * 100}%"></div>
							<div class="circle-text">
								<span class="circle-value">{userStats.completedTrainings}</span>
								<span class="circle-total">/6</span>
							</div>
						</div>
						<p class="progress-label">Training Types Mastered</p>
					</div>
					
					<div class="achievements">
						<h4>Recent Achievements</h4>
						<div class="achievement-list">
							<div class="achievement">
								<Award size={16} />
								<span>Week Warrior - 7 day streak!</span>
							</div>
							<div class="achievement">
								<Star size={16} />
								<span>Perfect Score in Synonym Challenge</span>
							</div>
							<div class="achievement">
								<Target size={16} />
								<span>100 Sessions Completed</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	.training-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-lg);
	}
	
	.page-header {
		margin-bottom: var(--spacing-3xl);
	}
	
	.header-content {
		text-align: center;
		margin-bottom: var(--spacing-2xl);
	}
	
	.page-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--matrix-green);
		margin-bottom: var(--spacing-md);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	
	.page-subtitle {
		font-size: var(--text-lg);
		color: var(--light-gray);
		margin: 0;
	}
	
	.stats-overview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--spacing-lg);
		background: var(--dark-navy);
		border: 1px solid rgba(0, 255, 65, 0.2);
		border-radius: var(--radius-md);
		padding: var(--spacing-xl);
		box-shadow: var(--shadow-sm);
		position: relative;
		overflow: hidden;
	}
	
	.stats-overview::before {
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
	
	.stat-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}
	
	.stat-icon {
		width: 48px;
		height: 48px;
		background: rgba(0, 255, 65, 0.1);
		border: 1px solid rgba(0, 255, 65, 0.3);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--matrix-green);
	}
	
	.stat-content {
		flex: 1;
	}
	
	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--white);
		line-height: 1;
		font-family: 'Space Mono', monospace;
	}
	
	.stat-label {
		font-size: var(--text-sm);
		color: var(--light-gray);
		margin-top: 2px;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: 'Space Mono', monospace;
	}
	
	.training-sections {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3xl);
	}
	
	.section-title {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--matrix-green);
		margin-bottom: var(--spacing-xl);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.training-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: var(--spacing-lg);
	}
	
	.progress-section {
		background: var(--dark-navy);
		border: 1px solid rgba(0, 255, 65, 0.2);
		border-radius: var(--radius-md);
		padding: var(--spacing-2xl);
		box-shadow: var(--shadow-sm);
		position: relative;
		overflow: hidden;
	}
	
	.progress-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--matrix-green), transparent);
		animation: scan 3s infinite;
	}
	
	.progress-card {
		max-width: 800px;
		margin: 0 auto;
	}
	
	.progress-title {
		text-align: center;
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--matrix-green);
		margin-bottom: var(--spacing-xl);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.progress-stats {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--spacing-2xl);
		align-items: center;
	}
	
	.progress-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
	}
	
	.progress-circle {
		position: relative;
		width: 120px;
		height: 120px;
	}
	
	.circle-progress {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: conic-gradient(var(--matrix-green) calc(var(--progress) * 1%), rgba(0, 255, 65, 0.1) 0%);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid rgba(0, 255, 65, 0.3);
	}
	
	.circle-progress::before {
		content: '';
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: var(--dark-navy);
	}
	
	.circle-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
	
	.circle-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--matrix-green);
		font-family: 'Space Mono', monospace;
	}
	
	.circle-total {
		font-size: var(--text-sm);
		color: var(--light-gray);
		font-family: 'Space Mono', monospace;
	}
	
	.progress-label {
		font-size: var(--text-sm);
		color: var(--light-gray);
		text-align: center;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: 'Space Mono', monospace;
	}
	
	.achievements h4 {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--white);
		margin-bottom: var(--spacing-md);
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.achievement-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
	
	.achievement {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-md);
		background: rgba(0, 255, 65, 0.1);
		border: 1px solid rgba(0, 255, 65, 0.3);
		border-radius: var(--radius-md);
		color: var(--matrix-green);
		font-size: var(--text-sm);
		font-weight: 500;
		font-family: 'Space Mono', monospace;
		transition: all 0.2s ease;
	}
	
	.achievement:hover {
		background: rgba(0, 255, 65, 0.2);
		border-color: var(--matrix-green);
	}
	
	@media (max-width: 768px) {
		.training-page {
			padding: var(--spacing-md);
		}
		
		.page-title {
			font-size: 2rem;
		}
		
		.stats-overview {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
			padding: var(--spacing-lg);
		}
		
		.training-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
		}
		
		.progress-stats {
			grid-template-columns: 1fr;
			gap: var(--spacing-xl);
			text-align: center;
		}
		
		.training-sections {
			gap: var(--spacing-2xl);
		}
	}
</style>