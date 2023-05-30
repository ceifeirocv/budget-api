declare namespace NodeJS {
	type ProcessEnv = {
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
		JWT_SECRET: string;
		PORT: number;
		// Add more environment variables and their types here
	};
}
