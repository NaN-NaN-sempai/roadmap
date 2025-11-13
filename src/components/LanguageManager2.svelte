<script>
    import { createLanguageManager, translations } from '$lib/translations/languageManager';
    import { onMount } from 'svelte';

    const langManager = createLanguageManager();

    const changeLang = (lang) => langManager.setLanguage(lang);

    onMount(() => {
        langManager.init();
    })
</script>