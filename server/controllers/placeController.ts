import { type BunRequest } from "bun";
import { db } from "../config/db";

export async function getListPlace(req: BunRequest<'/api/place'>) {
    const url = new URL(req.url)
    const search = url.searchParams.get('search')
    // const page = url.searchParams.get('page')
    console.log(search, ' ')
    const res = await db`SELECT * FROM place`

    return Response.json({ data: res })
}