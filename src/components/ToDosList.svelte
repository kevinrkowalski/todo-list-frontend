<script>
	import { CheckCircleIcon, EditIcon, Trash2Icon } from 'svelte-feather-icons';
	import ToDo from './ToDo.svelte';
	import toDoStore from '$lib/ToDoStore';
	import { fetchDb } from '$lib';

	export let toDos = [];

	const handleMarkComplete = async (toDo) => {
		const data = await fetchDb(`todos/${toDo.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ completed: !toDo.completed })
		});

		if (!data) return;

		toDoStore.update((previousToDos) => {
			const newToDos = [...previousToDos];
			const toDoIndex = newToDos.findIndex((newToDo) => newToDo.id === toDo.id);
			newToDos[toDoIndex] = { ...newToDos[toDoIndex], completed: data.todos[0].completed };
			return newToDos;
		});
	};

	const handleDelete = async (toDo) => {
		const data = await fetchDb(`todos/${toDo.id}`, {
			method: 'DELETE'
		});

		if (!data) return;

		toDoStore.update((previousToDos) => {
			const newToDos = [...previousToDos];
			const toDoIndex = newToDos.findIndex((newToDo) => newToDo.id === toDo.id);
			newToDos.splice(toDoIndex, 1);
			return newToDos;
		});
	};

	const handleEdit = async (toDo) => {
		toDoStore.update((previousToDos) => {
			const newToDos = [...previousToDos];
			const toDoIndex = newToDos.findIndex((newToDo) => newToDo.id === toDo.id);
			const newToDo = { ...newToDos[toDoIndex], isEditing: !toDo.isEditing };
			newToDos[toDoIndex] = newToDo;
			return newToDos;
		});
	};
</script>

{#if toDos && toDos.length > 0}
	<ul class="grid grid-flow-row gap-4">
		{#each toDos as toDo}
			<li class="flex gap-4 justify-between p-4 shadow-sm bg-slate-100 rounded-sm">
				<ToDo {toDo} />
				<div class="flex items-center gap-2">
					{#if !toDo.completed}
						<button
							class="text-slate-400 hover:text-slate-600"
							on:click|preventDefault={() => handleEdit(toDo)}
						>
							<span class="sr-only">edit task</span>
							<EditIcon />
						</button>
					{/if}
					<button
						class="text-slate-400 hover:text-slate-600"
						on:click|preventDefault={() => handleMarkComplete(toDo)}
					>
						<span class="sr-only">mark task complete</span>
						<CheckCircleIcon />
					</button>
					<button
						class="text-slate-400 hover:text-red-800"
						on:click|preventDefault={() => handleDelete(toDo)}
					>
						<span class="sr-only">delete task</span>
						<Trash2Icon />
					</button>
				</div>
			</li>
		{/each}
	</ul>
{/if}
