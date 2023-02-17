import { Request, Response } from "express"
import { PlaylistBusiness } from "../business/PlaylistBusiness"
import { GetPlaylistsInputDTO, CreatePlaylistInputDTO, EditPlaylistInputDTO } from "../dtos/userDTO"
import { BaseError } from "../errors/BaseError"

export class PlaylistController {
    constructor( 
        private playlistBusiness: PlaylistBusiness
    ) {}

    public getPlaylists = async (req: Request, res: Response) => {
        try {
            const input: GetPlaylistsInputDTO = {
                token: req.headers.authorization
            }

            const output = await this.playlistBusiness.getPlaylists(input)

            res.status(200).send(output)
            
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createPlaylists = async (req: Request, res: Response) => {
        try {
            const input: CreatePlaylistInputDTO = {
                token: req.headers.authorization,
                name: req.body.name
            }

            await this.playlistBusiness.createPlaylist(input)

            res.status(201).end()
            
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editPlaylists = async (req: Request, res: Response) => {
        try {
            const input: EditPlaylistInputDTO = {
                idToEdit: req.params.id,
                name: req.body.name,
                token: req.headers.authorization,
            }

            await this.playlistBusiness.editPlaylist(input)

            res.status(200).end()
            
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}