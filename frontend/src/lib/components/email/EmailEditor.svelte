<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import { createEventDispatcher } from 'svelte';

	export let value = '';
	export let placeholder = 'Write email content here...';

	const dispatch = createEventDispatcher();
	let element: HTMLDivElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Placeholder.configure({
					placeholder
				})
			],
			content: value,
			onUpdate: ({ editor }) => {
				value = editor.getHTML();
				dispatch('change', value);
			},
			editorProps: {
				attributes: {
					class: 'prose prose-sm max-w-none focus:outline-none min-h-[250px] p-4 text-slate-800'
				}
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	$: if (editor && value !== editor.getHTML()) {
		editor.commands.setContent(value);
	}
</script>

<div class="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
	<!-- Simple Toolbar -->
	{#if editor}
		<div class="bg-slate-50 border-b border-slate-100 p-2 flex flex-wrap gap-1">
			<button 
				type="button"
				on:click={() => editor.chain().focus().toggleBold().run()}
				class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors font-bold text-xs"
				class:bg-slate-200={editor.isActive('bold')}
			>
				Bold
			</button>
			<button 
				type="button"
				on:click={() => editor.chain().focus().toggleItalic().run()}
				class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors italic text-xs"
				class:bg-slate-200={editor.isActive('italic')}
			>
				Italic
			</button>
			<button 
				type="button"
				on:click={() => editor.chain().focus().toggleStrike().run()}
				class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors line-through text-xs"
				class:bg-slate-200={editor.isActive('strike')}
			>
				Strike
			</button>
			<div class="w-px h-5 bg-slate-200 mx-1 align-middle self-center"></div>
			<button 
				type="button"
				on:click={() => editor.chain().focus().toggleBulletList().run()}
				class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors text-xs"
				class:bg-slate-200={editor.isActive('bulletList')}
			>
				Bullet List
			</button>
			<button 
				type="button"
				on:click={() => editor.chain().focus().toggleOrderedList().run()}
				class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors text-xs"
				class:bg-slate-200={editor.isActive('orderedList')}
			>
				Numbered List
			</button>
			<div class="w-px h-5 bg-slate-200 mx-1 align-middle self-center"></div>
			<button 
				type="button"
				on:click={() => editor.chain().focus().clearNodes().run()}
				class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors text-xs"
			>
				Clean Formatting
			</button>
		</div>
	{/if}
	<div bind:this={element}></div>
</div>

<style>
	:global(.tiptap p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #94a3b8;
		pointer-events: none;
		height: 0;
	}
	:global(.tiptap) {
		min-height: 250px;
	}
</style>
