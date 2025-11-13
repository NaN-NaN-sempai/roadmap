import { writable } from 'svelte/store';

export const translations = writable({});

export const createLanguageManager = (langPath = '$lang', defaultLang = 'PT') => {
    let selectedLanguage = defaultLang;
    const languages = [];


    
    const setupImports = (array, glob) => {
        for (const module of Object.values(glob)) {
            array.push(module.default);
        }
    }

    setupImports(languages, import.meta.glob('$lang/*.js', { eager: true }));

    let defaultLanguage = languages.find(({name}) => name == defaultLang);    
    

    const moveItemArr = (array, callback, toIndex) => {
        const index = array.findIndex(callback);

        if (index !== -1 && toIndex >= 0 && toIndex < array.length) {
            const [objectToMove] = array.splice(index, 1);

            array.splice(toIndex, 0, objectToMove);
        }

        return array;
    }

    moveItemArr(languages, ({name}) => name == defaultLang, 0);
    

    const setupLocalStorage = () => {
        const userLang = (navigator.language || '').split('-')[0].toUpperCase();
        selectedLanguage = languages.find(({ name }) => name === userLang) ? userLang : defaultLang;
        
        selectedLanguage = localStorage.getItem('language') || selectedLanguage;
        localStorage.setItem('language', selectedLanguage);
    }

    const setLanguage = (lang) => {
        selectedLanguage = lang;
        localStorage.setItem('language', lang);
        dispatch();
    };
    
    const translationProxy = (translations, fallbackTranslations={}, translationsSelected=translations) => {
        
        return new Proxy(translations, {
            get(target, key) {
                //console.log(key, key in target, key in translationsSummarized, target[key]);

                // if key exists in selected language
                if (key in translationsSelected) {
                    const value = translationsSelected[key];
                    if (typeof value === 'object' && value !== null) {
                        return translationProxy(value, fallbackTranslations[key] || {}, value);
                    }
                    return value;
                }

                //  if it does'nt exists it goes to the fallback
                if (key in fallbackTranslations) {
                    const fallbackValue = fallbackTranslations[key];
                    if (typeof fallbackValue === 'object' && fallbackValue !== null) {
                        return translationProxy(fallbackValue, {}, {});
                    }
                    return fallbackValue;
                }
            }
        });
    };
        const lang = languages.find(({ name }) => name === selectedLanguage) || defaultLanguage;



    const dispatch = () => {
        const lang = languages.find(({ name }) => name === selectedLanguage) || defaultLanguage;        
        
        const fallback = translationProxy(lang, defaultLanguage);
        translations.set(fallback.content);
    };

    const init = () => {
        setupLocalStorage();
        dispatch();
    }

    return {
        languages,
        selectedLanguage: () => selectedLanguage,
        setLanguage,
        dispatch,
        languages,
        translations,
        init,
    };    
}