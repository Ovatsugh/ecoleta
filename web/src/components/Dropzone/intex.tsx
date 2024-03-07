import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './styles.css'
import { FiUpload } from 'react-icons/fi'

interface Props {
    onFileUpload: (File: File) => void;
}

const MyDropzone: React.FC<Props> = ({ onFileUpload }) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('')
    const onDrop = useCallback((acceptedFiles: any) => {
        const file = acceptedFiles[0]
        const fileUrl = URL.createObjectURL(file)
        setSelectedFileUrl(fileUrl)
        onFileUpload(file)
    }, [onFileUpload])
    const { getRootProps, getInputProps } = useDropzone({
        onDrop, accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
        }
    })

    return (
        <div className='dropzone' {...getRootProps()}>
            <input {...getInputProps()} />
            {selectedFileUrl
                ? <img src={selectedFileUrl} alt='Point image' />
                : (
                    <p>
                        <FiUpload />
                        Clique ou arraste algum arquivo aqui
                    </p>
                )
            }

        </div>
    )
}

export default MyDropzone