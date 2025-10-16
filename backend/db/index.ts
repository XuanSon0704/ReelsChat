import { SQLDatabase } from "encore.dev/storage/sqldb";

export default new SQLDatabase("reelschat", {
  migrations: "./migrations",
});
