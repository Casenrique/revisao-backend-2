import { PlaylistDB, PlaylistWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PlaylistDatabase extends BaseDatabase {
    public static TABLE_PLAYLISTS = "playlists"

    public getPlaylistsWithCreators = async () => {
        const result: PlaylistWithCreatorDB[] =  await BaseDatabase
            .connection(PlaylistDatabase.TABLE_PLAYLISTS)
            .select(
                "playlists.id",
                "playlists.creator_id",
                "playlists.name",
                "playlists.likes",
                "playlists.dislikes",
                "playlists.created_at",
                "playlists.updated_at",
                "users.name AS creator_name"
            )
            .join("users", "playlists.creator_id", "=", "users.id")        

            return result 
    }

    public insert = async (playlistDB: PlaylistDB): Promise<void> => {
        await BaseDatabase
            .connection(PlaylistDatabase.TABLE_PLAYLISTS)
            .insert(playlistDB)
    }

    public searchById = async (idToEdit: string): Promise<PlaylistDB | undefined> => {
        const result: PlaylistDB[] = await BaseDatabase
            .connection(PlaylistDatabase.TABLE_PLAYLISTS)
            .select()
            .where({ id: idToEdit  })
        
            return result[0]        
    }


    public update = async (idToEdit: string, playlistDB: PlaylistDB): Promise<void> => {
        await BaseDatabase
            .connection(PlaylistDatabase.TABLE_PLAYLISTS)
            .update(playlistDB)
            .where({ id: idToEdit })
    }
    
}