import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import './fileInputField.css';

const FileInputField = ({onHandleFileChange, formSubmitted, prevImgUrl}) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(prevImgUrl ? prevImgUrl : null);

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            onHandleFileChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if(formSubmitted) {
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [formSubmitted]);

    return (
        <div className="file-input">
            <div className="file-input-field">
                <input
                    id="foto-upload"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="foto-upload">
                    <div className="file-input-field-content">
                        <Avatar 
                            src={previewUrl}
                            sx={{ width: 56, height: 56}}
                        />
                        <h3>Cargar Foto</h3>
                        {
                            selectedFile &&
                            <h5>{selectedFile.name}</h5>
                        }
                    </div>
                </label>
            </div>
        </div>
    )
}

export default FileInputField;