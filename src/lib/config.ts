// Runtime configuration
// This allows environment variables to be set at container runtime instead of build time

interface RuntimeConfig {
	apiBaseUrl: string;
}

function getRuntimeConfig(): RuntimeConfig {
	// Check if window.ENV is set (injected at runtime by Docker)
	const runtimeApiUrl = (window as any).ENV?.API_BASE_URL;

	return {
		apiBaseUrl:
			runtimeApiUrl || import.meta.env.VITE_API_BASE_URL || "/api",
	};
}

export const config = getRuntimeConfig();
