import React from "react";
import GenreModel from "../models/GenreModel";
import {my_request} from "./Request";

interface GenresApiProps {
    genreList:GenreModel[];
    genre: GenreModel;
}
async function getGenre(endpoint: string): Promise<GenresApiProps> {
    // Gọi phương thức request()
    const response = await my_request(endpoint);

    // Lấy ra danh sách quyển sách
    const genreList: any = response._embedded.genres.map((genreData: any) => ({
        ...genreData,
    }))
    return { genreList: genreList, genre: response.genre };
}
export async function  getGenreById(idPlastic: number): Promise<GenresApiProps> {
    const endpoint = `http://localhost:8080/plastic-items/${idPlastic}/listGenres`;
    return getGenre(endpoint);
}
export async function getAllGenres(): Promise<GenresApiProps> {
    const endpoint = "http://localhost:8080/genres?sort=idGenre";
    return getGenre(endpoint);
}
export async function get1Genre(idGenre: number): Promise<GenresApiProps> {
    const endpoint = `http://localhost:8080/genres/${idGenre}`;
    const response = await my_request(endpoint);
    return { genre: response, genreList: response };
}