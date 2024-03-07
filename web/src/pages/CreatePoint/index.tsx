import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import api from "../../services/api";
import axios from "axios";
import logo from '../../assets/logo.svg'
import './styles.css'
import MyDropzone from "../../components/Dropzone/intex";


//interfaces
interface Item {
    id: number
    title: string
    image_url: string
}

interface IBGEUfREsponse {
    sigla: string
}
interface IBGECityREsponse {
    nome: string
}

const CreatePoint = () => {
    const navigate = useNavigate();

    //variables
    const [items, setItems] = useState<Item[]>([]) //passar o tipo
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUf, setselectedUf] = useState('0')
    const [selectedCity, setselectedCity] = useState('0')
    const [cities, setCity] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [selectedPosition, setSelectedPosition] = useState([0, 0]);
    const [selectedFile, setSelectedFile] = useState<File>()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })



    const Markers = () => {

        useMapEvents({
            click: (e) => {
                const position = [e.latlng.lat, e.latlng.lng]
                setSelectedPosition(position)
            },
        })
        return <Marker position={[selectedPosition[0], selectedPosition[1]]} />
    }

    //useEffects

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUfREsponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then((res) => {
            const ufInitials = res.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })

    }, [])

    useEffect(() => {
        const uf = selectedUf.toLowerCase()
        if (selectedUf === "0") return
        axios.get<IBGECityREsponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then((res) => {
            const cityNames = res.data.map(city => city.nome)
            setCity(cityNames)
        })
    }, [selectedUf]) //this change when [] change too

    //my functions
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setselectedUf(uf)
    }
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setselectedCity(city)
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])

        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData();



        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        if (selectedFile) data.append('image', selectedFile)


        await api.post('points', data)
        alert('Ponto de coleta Criado')
        navigate('/');

    }



    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/"> <FiArrowLeft />Voltar para home</Link>
            </header>
            <form onSubmit={handleSubmit} action="">
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <MyDropzone onFileUpload={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange} />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereco</h2>
                        <span>Selecione um endereco no mapa</span>
                    </legend>

                    <MapContainer center={[-4.250247, -49.956913]} zoom={15}>

                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Markers />
                    </MapContainer>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">UF</label>
                            <select onChange={handleSelectUf} value={selectedUf} name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select onChange={handleSelectCity} value={selectedCity} name="city" id="city">
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>itens de coleta</h2>
                        <span>Selecione um ou mais intens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} className={selectedItems.includes(item.id) ? 'selected' : ''} onClick={() => handleSelectItem(item.id)}>
                                <img src={item.image_url} alt="teste" />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar Ponto de Coleta
                </button>
            </form>
        </div>
    )
}


export default CreatePoint