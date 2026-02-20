import { browser } from '$app/environment';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemPrefersDark(): boolean {
	if (!browser) return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDarkClass(isDark: boolean) {
	if (!browser) return;
	document.documentElement.classList.toggle('dark', isDark);
}

class ThemeState {
	mode = $state<ThemeMode>('system');

	isDark = $derived(
		this.mode === 'dark' || (this.mode === 'system' && getSystemPrefersDark())
	);

	constructor() {
		if (browser) {
			const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
			if (stored === 'light' || stored === 'dark') {
				this.mode = stored;
			}

			// Listen for system preference changes
			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			mq.addEventListener('change', () => {
				// Re-trigger reactivity by re-reading mode
				if (this.mode === 'system') {
					applyDarkClass(mq.matches);
				}
			});
		}
	}

	toggle() {
		if (this.mode === 'system') {
			this.mode = getSystemPrefersDark() ? 'light' : 'dark';
		} else if (this.mode === 'light') {
			this.mode = 'dark';
		} else {
			this.mode = 'system';
		}

		if (browser) {
			if (this.mode === 'system') {
				localStorage.removeItem(STORAGE_KEY);
			} else {
				localStorage.setItem(STORAGE_KEY, this.mode);
			}
			applyDarkClass(this.isDark);
		}
	}

	init() {
		applyDarkClass(this.isDark);
	}
}

export const theme = new ThemeState();
