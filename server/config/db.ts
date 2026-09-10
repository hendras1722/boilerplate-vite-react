import { SQL } from "bun";

export const db = new SQL({
    adapter: 'postgres',
    database: "tracking",
    username: "admin",
    password: "secret",
    port: 5431,
    onconnect: (err) => {
        if (err) {
            console.error("Postgres connection error:", err);
        } else {
            console.log("Connected to Postgres");
        }
    },
    onclose: (err) => {
        if (err) {
            console.error("Postgres connection closed with error:", err);
        } else {
            console.log("Postgres connection closed");
        }
    },
})