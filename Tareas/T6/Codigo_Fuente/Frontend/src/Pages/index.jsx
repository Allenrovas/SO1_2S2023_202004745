import React, { useEffect } from "react";
import NavBar from '../Components/NavBar'
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function Index() {
  const [albums, setAlbums] = React.useState([]);

  useEffect(() => {
    const handleGetAlbums = (data) => {
      setAlbums(data);
    };
  
    socket.emit("getAlbums");
    console.log('Evento "getAlbums" emitido');
  
    socket.on("albums", handleGetAlbums);
  
    // Limpia la suscripción al desmontar el componente
    return () => {
      socket.off("albums", handleGetAlbums);
    };
  }, []);
    



  const containerStyle = {
      justifyContent: 'space-between', // Alinea los elementos a la izquierda y a la derecha
      padding: '50px',
    };
  

  const colorBlanco = {
  color: 'white',
  };

  const alinearCentro = {
      textAlign: 'center',
      color : 'white',
  };

  return (
    <>
    <NavBar/>
    <div style={containerStyle}>
        <h1 style={alinearCentro}>Albumes de Música</h1>
        <div>
            <table class="table">
                <thead style={colorBlanco}>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Título</th>
                    <th scope="col">Artista</th>
                    <th scope="col">Año</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider" style={colorBlanco}>
                {albums.map((album, index) => (
                <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{album.album}</td>
                    <td>{album.artist}</td>
                    <td>{album.year}</td>
                </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
    </>
  );
}

export default Index;