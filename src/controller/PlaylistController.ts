import { Request, Response } from "express"
import { PlaylistBusiness } from "../business/PlaylistBusiness"
import { GetPlaylistsInputDTO } from "../dtos/userDTO"
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
}