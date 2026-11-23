<script>
	import ThemeToggle from '#components/theme/theme-toggle.svelte'
</script>

<nav>
	<div class="container flex w-full justify-between px-4 py-6 border-b border-(--border)">
		<div class="justify-between flex items-center gap-6">
			<h1 class="font-bold text-3xl lowercase">Wordly.</h1>
			<span class="font-medium text-[10px] uppercase text-(--text-secondary)"
				>A Daily word ritual</span
			>
		</div>

		<ul class="flex justify-between items-center gap-6 font-medium text-[13px]">
			<li><a class="hover:underline" href="/guide">How to play</a></li>
			<li><a class="hover:underline" href="#">Statistics</a></li>
			<li class="text-2xl flex items-center">
				<ThemeToggle />
			</li>
		</ul>
	</div>
</nav>
