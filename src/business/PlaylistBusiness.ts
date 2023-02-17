import { PlaylistDatabase } from "../database/PlaylistDatabase";
import { GetPlaylistsInputDTO, GetPlaylistsOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Playlist } from "../models/Playlist";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PlaylistWithCreatorDB } from "../types";

export class PlaylistBusiness {
    constructor(
        private playlistDatabase: PlaylistDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ) {}

    public getPlaylists = async (input: GetPlaylistsInputDTO
        ): Promise<GetPlaylistsOutputDTO> => {
        
            const { token } = input

            if(token === undefined) {
                throw new BadRequestError("token ausente")
            }

            const payload = this.tokenManager.getPayload(token)

            if(payload === null) {
                throw new BadRequestError("token inválido")
            }

            const playlistsWithCreatorsDB: PlaylistWithCreatorDB[] = 
                await this.playlistDatabase
                    .getPlaylistsWithCreators()

            const playlists = playlistsWithCreatorsDB.map((playlistWithCreatorDB) => {
                const playlist = new Playlist(
                    playlistWithCreatorDB.id,
                    playlistWithCreatorDB.name,
                    playlistWithCreatorDB.likes,
                    playlistWithCreatorDB.dislikes,
                    playlistWithCreatorDB.created_at,
                    playlistWithCreatorDB.updated_at,
                    playlistWithCreatorDB.creator_id,
                    playlistWithCreatorDB.creator_name
                )

                    return playlist.toBusinesModel()
            })

            const output: GetPlaylistsOutputDTO = playlists
        return output
    }
}