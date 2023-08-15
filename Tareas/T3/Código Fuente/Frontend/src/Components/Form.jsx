import React from "react";
import Input from './Input'

function Form() {
    const [title, setTitle] = React.useState("");
    const [artist, setArtist] = React.useState("");
    const [year, setYear] = React.useState("");
    const [genre, setGenre] = React.useState("");

    const changeTitle = (text) => {
        setTitle(text);
    }

    const changeArtist = (text) => {
        setArtist(text);
    }

    const changeYear = (text) => {
        setYear(text);
    }

    const changeGenre = (text) => {
        setGenre(text);
    }

    const containerForm = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    };

    const ingresarClick = () => {
        if(title === "" || artist === "" || year === "" || genre === ""){
            alert("No se pueden dejar campos vacíos");
        }else{
            Service.ingreso(title, artist, year, genre)
            .then((res) => {
                if(res.status === 200){
                    alert("Canción ingresada correctamente");
                }else{
                    alert("Error al ingresar canción");
                }
            })
        }
    }

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between', // Alinea los elementos a la izquierda y a la derecha
        padding: '20px',
      };
    
      const leftComponentStyle = {
        flex: 1, // Permite que el componente ocupe espacio flexible
        marginRight: '10px', // Espacio entre los componentes
        padding: '10px',
      };
    
      const rightComponentStyle = {
        flex: 1, // Permite que el componente ocupe espacio flexible
        marginLeft: '10px', // Espacio entre los componentes
        padding: '10px',
      };

      const colorBlanco = {
        color: 'white',
        };

    


    return (
        <>
        <div style={containerStyle}>
            <div style={leftComponentStyle}>
                <div style={containerForm}>
                    <h1 style={colorBlanco}>Ingreso de Datos</h1>
                    <Input text={"Título"} type={"text"} handlerChange = {changeTitle} id={"floatingTitle"}/>
                    <Input text={"Artista"} type={"text"} handlerChange = {changeArtist} id={"floatingArtist"}/>
                    <Input text={"Año"} type={"number"} handlerChange = {changeYear} id={"floatingYear"}/>
                    <Input text={"Género"} type={"text"} handlerChange = {changeGenre} id={"floatingGenre"}/>
                    <button type="button" class="btn btn-primary" style={{margin: "10px"}} onClick={ingresarClick}>Enviar</button>
                </div>
            </div>
            <div style={rightComponentStyle}>
                <table class="table">
                    <thead style={colorBlanco}>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Título</th>
                        <th scope="col">Artista</th>
                        <th scope="col">Año</th>
                        <th scope="col">Género</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider" style={colorBlanco}>
                        
                    </tbody>
                </table>

            </div>

        </div>
            
        </>
    );

}

export default Form;