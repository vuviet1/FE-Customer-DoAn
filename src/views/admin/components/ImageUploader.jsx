import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function ImageUploader({ images, setImages }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            const newImages = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setImages((prevImages) => [...prevImages, ...newImages]);
        },
        [setImages]
    );

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>
            <div
                {...getRootProps({
                    className: 'dropzone',
                    style: {
                        border: '2px dashed #cccccc',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                    },
                })}
            >
                <input {...getInputProps()} />
                <p>Kéo và thả hình ảnh vào đây, hoặc nhấp để chọn tệp</p>
            </div>
            <div className="preview" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                {images.map((image, index) => (
                    <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
                        <img
                            src={image.preview}
                            alt="preview"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                cursor: 'pointer',
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageUploader;
