<script>
	import { PlusCircleIcon } from 'svelte-feather-icons';
	import ToDosList from '../components/ToDosList.svelte';
	import { onMount } from 'svelte';
	import toDoStore from '$lib/ToDoStore';
	import { fetchDb } from '$lib';

	$: toDos = $toDoStore;

	onMount(async () => {
		const data = await fetchDb('todos');
		if (!data) return;
		toDoStore.set(data.todos);
	});

	const handleSubmit = async (e) => {
		const formData = new FormData(e.target);
		if (formData.get('todo').trim() === '') return; // To Do: give error that you must fill out
		const data = await fetchDb('todos', {
			method: 'POST',
			body: JSON.stringify(Object.fromEntries(formData))
		});
		console.log(data);
		if (!data) return;
		e.target.reset();
		toDoStore.update((previousToDos) => {
			const newToDos = [...data.todos, ...previousToDos];
			return newToDos;
		});
	};
</script>

<header class="p-6 shadow-sm bg-slate-100 mb-24">
	<div class="container mx-auto">
		<nav class="flex justify-between items-center gap-6">
			<a href="/">ToDo App</a>
			<ul class="flex gap-6">
				<li><a href="#">Create ToDo</a></li>
				<li><a href="#">Remove ToDo</a></li>
			</ul>
		</nav>
	</div>
</header>
<main class="container mx-auto">
	<h1 class="text-6xl font-bold mb-4">ToDo App</h1>
	<p class="mb-8">Welcome to the ToDo App. Please create, delete, or update your todos below.</p>
	<form class="flex gap-4 items-center mb-4" on:submit|preventDefault={handleSubmit}>
		<label for="todo" class="sr-only">Add your todo</label>
		<input
			type="text"
			name="todo"
			id="todo"
			placeholder="Today I want to..."
			class="p-4 bg-slate-50 shadow-sm grow rounded-sm"
			required
		/>
		<button
			type="submit"
			class="py-4 px-6 bg-teal-50 text-teal-600 rounded-sm flex gap-2 items-center hover:bg-teal-100"
		>
			Add
			<span class="sr-only">task</span>
			<PlusCircleIcon />
		</button>
	</form>
	<ToDosList {toDos} />
</main>
<footer class="p-6 bg-slate-100 mt-24">
	<div class="container mx-auto text-center">&copy; To Do List App</div>
</footer>
