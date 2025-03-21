import { users } from '$lib/db';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        // Validate input
        if (!username || !password) {
            return { success: false, error: 'Username and password are required.' };
        }

        try {
            // Check if username already exists
            const existingUser = await users.findOneAsync({ username });

            if (existingUser) {
                return { success: false, error: 'Username already exists.' };
            }

            // Insert user into the database
            await users.insertAsync({ username, password, createdAt: new Date() });

            return { success: true };
        } catch (error) {
            return { success: false, error: 'An error occurred during registration.' };
        }
    }
};
