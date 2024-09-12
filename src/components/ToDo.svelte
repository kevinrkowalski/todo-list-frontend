<script>
	import toDoStore from '$lib/ToDoStore';
	import { fetchDb } from '$lib';
	export let toDo = {};

	$: classes = toDo.completed ? 'line-through' : '';
	$: isEditing = toDo.isEditing;
	$: text = toDo.toDo || '';

	const handleEdit = async (e) => {
		if (e.key !== 'Enter') return;

		const data = await fetchDb(`todos/${toDo.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ text: e.target.value })
		});

		if (!data) return;

		toDoStore.update((previousToDos) => {
			const newToDos = [...previousToDos];
			const toDoIndex = newToDos.findIndex((newToDo) => newToDo.id === toDo.id);
			newToDos[toDoIndex] = data.todos[0];
			return newToDos;
		});
	};

	const handleCancelEdit = (e) => {
		toDo.isEditing = false;
	};
</script>

{#if toDo.toDo}
	{#if isEditing}
		<input
			type="text"
			value={text}
			class="flex-grow px-2"
			on:keyup={handleEdit}
			on:blur={handleCancelEdit}
		/>
	{:else}
		<div class={classes}>
			{text}
		</div>
	{/if}
{/if}
