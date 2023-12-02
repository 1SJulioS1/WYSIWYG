// src/components/MyEditor.jsx
import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const MyEditor = () => {
  const [editorContent, setEditorContent] = useState('');
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Realizar una solicitud para obtener todos los documentos al montar el componente
    axios.get('http://localhost:8000/api/documents/')
      .then(response => {
        setDocuments(response.data);
      })
      .catch(error => {
        console.error('Error al obtener documentos:', error);
      });
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSaveClick = async () => {
    try {
      // Enviar el contenido HTML al backend
      const response = await axios.post('http://localhost:8000/api/documents/', {
        content_html: editorContent,
      });

      console.log('Respuesta del backend:', response.data);

      // Actualizar la lista de documentos después de guardar
      axios.get('http://localhost:8000/api/documents/')
        .then(response => {
          setDocuments(response.data);
        })
        .catch(error => {
          console.error('Error al obtener documentos:', error);
        });

    } catch (error) {
      console.error('Error al enviar el contenido al backend:', error);
    }
  };

  return (
    <div>
      <Editor
        apiKey='tu-clave-de-api'
        init={{
          selector: 'textarea',
          plugins: 'image',
          toolbar: 'undo redo | bold italic | image',
        }}
        onEditorChange={handleEditorChange}
      />
      <div className="col-md-3">
        <button
          className="btn btn-block btn-primary btn-lg"
          type="button"
          onClick={handleSaveClick}
        >
          Save Content
        </button>
      </div>

      {/* Visualizar la lista de documentos */}
      <div>
        <h2>Document List</h2>
        <ul>
          {documents.map(document => (
            <li key={document.id}>{document.content_html}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyEditor;
