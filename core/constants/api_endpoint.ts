export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register:"/api/auth/register",
  },
  user:{
    get:"/api/users",
    add:"/api/users/create",
    update:"/api/users/update/",
    delete:"/api/users/",
    getById:"/api/users/"
  },
  artist:{
    get:"/api/artist/getallArtist",
    add:"/api/artist/artistCreate",
    update:"/api/artist/artistupdate/",
    delete:"/api/artist/artistDelete/",
    getById:"/api/artist/getArtistById/",
    getOwnArtist:"/api/artist/my-artist"
  },
  genre:{
    get:"/api/genre/getall",
    add:"/api/genre/create",
    update:"/api/genre/update/",
    delete:"/api/genre/delete/",
    getById:"/api/genre/"
  },
  album:{
    get:"/api/album/all",
    add:"api/album/create",
    update:"/api/album/update/",
    delete:"/api/album/delete/",
    getById:"/api/album/",
    getArtistAlbums:"/api/album/artist/albums"
  },
  song:{
    get:"/api/song/songGetAll",
    add:"/api/song/songCreate",
    update:"/api/song/updateSong/",
    delete:"/api/song/deleteSong/",
    getById:"/api/song/getByIdSong/",
    likeSong: "/api/likeSong/like/",
    unlikeSong:"/api/likeSong/unlike/",
    isLikeSong:"/api/likeSong/is-liked/",
    getByArtist:"/api/song/songs/"

  },
  playlist:{
    get:"/api/playlist/getall",
    add:"/api/playlist/create",
    update:"/api/playlist/update/",
    delete:"/api/playlist/delete/",
    getById:"/api/playlist/",
    addSong:"/api/playlist/add-song/",
    removeSong:"/api/playlist/remove-song/"
  }

};
