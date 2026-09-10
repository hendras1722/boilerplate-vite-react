import { db } from "../config/db";

export async function InitDB() {
    await db.file("./server/migration/001_create_place.sql")
}

InitDB()