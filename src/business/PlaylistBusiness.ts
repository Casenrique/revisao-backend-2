import { PlaylistDatabase } from "../database/PlaylistDatabase";
import { CreatePlaylistInputDTO, EditPlaylistInputDTO, GetPlaylistsInputDTO, GetPlaylistsOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Playlist } from "../models/Playlist";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PlaylistDB, PlaylistWithCreatorDB } from "../types";

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

    public createPlaylist = async (input: CreatePlaylistInputDTO): Promise<void> => {
        const { token, name } = input

        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        if(typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name

        const playlist = new Playlist(
            id,
            name,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName
        )

        const playlistDB = playlist.toDBModel()

        await this. playlistDatabase.insert(playlistDB)
    }

    public editPlaylist = async (input: EditPlaylistInputDTO): Promise<void> => {
        const { idToEdit, token, name } = input

        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        if(typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        const playlistDB: PlaylistDB | undefined = await this.playlistDatabase.searchById(idToEdit)

        if(!playlistDB) {
            throw new BadRequestError("'id' não encontrado")
        }

        // const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name

        if(playlistDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente o criador da playlist pode editá-la")
        }

        const playlist = new Playlist(
            playlistDB.id,
            playlistDB.name,
            playlistDB.likes,
            playlistDB.dislikes,
            playlistDB.created_at,
            playlistDB.updated_at,
            creatorId,
            creatorName
        )

        playlist.setName(name)
        playlist.setUpdatedAt(new Date().toISOString())

        const updatedPlaylistDB = playlist.toDBModel()

        await this.playlistDatabase.update(idToEdit, updatedPlaylistDB)

    }
}