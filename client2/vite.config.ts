import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// Export the Vite config with a custom port
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Change this to a port that's not being used by the backend
  },
});
