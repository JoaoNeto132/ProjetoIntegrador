import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import axios from "axios";
import SideBar from "../../components/SideBar";
import NavBar from "../../components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useSession } from '../../../../services/session';
import { FaPlus } from "react-icons/fa6";
import { PencilSimple, TrashSimple } from "@phosphor-icons/react";

export default function State() {

    const { getAuthConfig } = useSession();
    const baseUrl = "https://localhost:7096/api/Estado"

    const [data, setData] = useState([])
    const [modalInsert, setModalInsert] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [updateData, setUpdateData] = useState(true)
    const [stateName, setStateName] = useState("");
    const [stateUf, setStateUf] = useState("");
    const [stateId, setStateId] = useState("");
    const [selectState] = useState({
        id: "",
        nomeEstado: "",
        ufEstado: ""
    })

    const StateSelect = (state, option) => {
        setStateId(state.id)
        setStateName(state.nomeEstado)
        setStateUf(state.ufEstado)

        if (option === "Editar") {
            openCloseModalEdit();
        }
        else {
            openCloseModalDelete();
        }
    }

    const openCloseModalInsert = () => {
        setModalInsert(!modalInsert);
    }

    const openCloseModalEdit = () => {
        setModalEdit(!modalEdit);
    }

    const openCloseModalDelete = () => {
        setModalDelete(!modalDelete);
    }

    const GetOrder = async () => {
        await axios.get(baseUrl, getAuthConfig())
            .then(response => {
                setData(response.data)
            }).catch(error => {
                console.log(error);
            })
    }

    const PostOrder = async () => {
        delete selectState.id
        await axios.post(baseUrl, { nomeEstado: stateName, ufEstado: stateUf }, getAuthConfig())
            .then(response => {
                setData(prevData => [...prevData, response.data]);
                openCloseModalInsert();
                setUpdateData(true);
            }).catch(error => {
                console.log(error);
            })
    }

    async function PutOrder() {
        delete selectState.id
        await axios.put(baseUrl, { id: stateId, nomeEstado: stateName, ufEstado: stateUf }, getAuthConfig())
            .then(response => {
                var answer = response.data
                var aux = data
                aux.map(state => {
                    if (state.id === selectState.id) {
                        state.nomeEstado = answer.nomeEstado
                        state.ufEstado = answer.ufEstado
                    }
                })

                const updatedState = response.data;

                setData((prevData) => {
                    return prevData.map((state) => {
                        if (state.id === stateId) {
                            return updatedState;
                        }
                        return state;
                    });
                });

                openCloseModalEdit();
                setUpdateData(true);
            }).catch(error => {
                console.log(error)
            })
    }

    const DeleteOrder = async () => {
        await axios.delete(baseUrl + "/" + stateId, getAuthConfig())
            .then(response => {
                setData(data.filter(state => state.id !== response.data));
                openCloseModalDelete();
                setUpdateData(true);
            }).catch(error => {
                console.log(error);
            })
    };

    const [stateToRender, setStateToRender] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get(baseUrl, getAuthConfig());
            setData(response.data);
            setStateToRender(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const filterState = () => {
        const searchTermNormalized = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (searchTerm === '') {
            setStateToRender(data);
        } else {
            const filtered = data.filter((state) => {
                const stateNameNormalized = state.nomeEstado.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return stateNameNormalized.toLowerCase().includes(searchTermNormalized.toLowerCase());
            });
            setStateToRender(filtered);
        }
    };

    useEffect(() => {
        if (updateData) {
            GetOrder();
            setUpdateData(false);
            fetchData();
        }
    }, [updateData]);

    useEffect(() => {
        filterState();
    }, [searchTerm, data]);


    return (
        <div className="flex flex-1 min-h-screen">
            <div className="h-full w-full" style={{ display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <div className="flex flex-1 min-h-full">
                    <SideBar />
                    <div className="min-h-screen"  style={{ flex: 2, marginLeft: '80px', marginRight: '40px', marginTop: -5 }}>
                        <br />
                        <div className="flex flex-row">
                            <Link to="/a/registration">
                                <h3 className="text-2xl font-semibold text-gray-500 pr-2">Cadastros</h3>
                            </Link>
                            <h3 className="text-2xl font-semibold text-gray-600 pr-2">/</h3>
                            <h3 className="text-2xl font-semibold text-gray-700">Estado</h3>
                        </div>
                        {/* <div className="bg-slate-200 rounded-md mb-10" style={{ marginTop: 15 }}>
                                <h4 className="pl-4 pt-2 pb-2 text-gray-500">Funções</h4>
                            </div> */}
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <div className="flex justify-center items-center mx-auto">
                                <div className="relative items-stretch self-center justify-center" style={{ width: 500 }}>
                                    <label htmlFor="default-search" className="mb-5 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                            </svg>
                                        </div>
                                        <input type="search" id="default-search" className="block w-full pt-3 pb-3 pl-10 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-600 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pesquisar estado" required onChange={(e) => handleSearch(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button className="btn  hover:bg-emerald-900 pt-2 pb-2 text-lg text-center hover:text-slate-100 text-slate-100" style={{ backgroundColor: '#004C57' }} onClick={() => openCloseModalInsert()}>
                                    Novo <FaPlus className="inline-block" style={{ alignItems: 'center' }} />
                                </button>
                            </div>
                        </div>
                        <div className="w-full rounded-[20px] border-1 border-[#C8E5E5] mt-10">
                            <div className="grid grid-cols-3 w-full bg-[#58AFAE] rounded-t-[20px] h-10 items-center">
                                <span className="ml-5 text-white text-lg font-semibold">Estado</span>
                                <span className="flex justify-center items-center text-white text-lg font-semibold">UF</span>
                                <span className="flex justify-center text-white text-lg font-semibold">Ações</span>
                            </div>
                            <ul className="w-full">
                                {stateToRender.map((state) => (
                                    <li className="grid grid-cols-3 w-full" key={state.id}>
                                        <span className="pl-5 border-r-[1px] border-t-[1px] border-[#C8E5E5] pt-[7.5px] pb-[7.5px] text-gray-700">{state.nomeEstado}</span>
                                        <span className="flex justify-center items-center border-t-[1px] border-r-[1px] border-[#C8E5E5] text-gray-700">{state.ufEstado}</span>
                                        <span className="flex items-center justify-center border-t-[1px] gap-2 text-gray-700">
                                            <button
                                                className=""
                                                onClick={() => StateSelect(state, "Editar")}
                                            >
                                                <PencilSimple size={20} className="hover:text-cyan-500" />
                                            </button>{" "}
                                            <button
                                                className=""
                                                onClick={() => StateSelect(state, "Excluir")}
                                            >
                                                <TrashSimple size={20} className="hover:text-red-600" />
                                            </button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Usar centered para centralizar o modal */}
                <Modal isOpen={modalInsert} >
                    <ModalHeader className="justify-center text-white text-xl bg-[#58AFAE]">Cadastrar Estado</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-[#444444]">Nome: </label>
                            <br />
                            <input type="text" className="form-control rounded-md border-[#BCBCBC]" onChange={(e) => setStateName(e.target.value)} />
                            <br />
                            <label className="text-[#444444]">Sigla:</label>
                            <br />
                            <input type="text" className="form-control rounded-md border-[#BCBCBC]" onChange={(e) => setStateUf(e.target.value.toUpperCase())} value={stateUf} maxLength={2} />
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn bg-none border-[#D93442] text-[#D93442] hover:bg-[#D93442] hover:text-white" onClick={() => openCloseModalInsert()}>Fechar</button>
                        <button className="btn bg-[#2AA646] text-white hover:text-white hover:bg-[#059669]" onClick={() => PostOrder()}>Salvar</button>{"  "}
                    </ModalFooter>
                </Modal>
                <Modal isOpen={modalEdit}>
                    <ModalHeader className="justify-center text-white text-xl bg-[#58AFAE] border-[#BCBCBC]">Editar Estado</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-[#444444]">ID: </label><br />
                            <input type="text" className="form-control rounded-md border-[#BCBCBC]" readOnly value={stateId} /> <br />
                            <label className="text-[#444444]">Nome:</label>
                            <input type="text" className="form-control rounded-md border-[#BCBCBC]" name="nomeEstado" onChange={(e) => setStateName(e.target.value)} value={stateName} />
                            <br />
                            <label className="text-[#444444]">Sigla:</label>
                            <br />
                            <input type="text" className="form-control rounded-md border-[#BCBCBC]" name="ufEstado" onChange={(e) => setStateUf(e.target.value.toUpperCase())} value={stateUf} maxLength={2} />
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn bg-none border-[#D93442] text-[#D93442] hover:bg-[#D93442] hover:text-white" onClick={() => openCloseModalEdit()}>Cancelar</button>
                        <button className="btn bg-[#2AA646] text-white hover:text-white hover:bg-[#059669]" onClick={() => PutOrder()}>Atualizar</button>{"  "}
                    </ModalFooter>
                </Modal>
                <Modal isOpen={modalDelete}>
                    <ModalHeader className="justify-center text-[#444444] text-2xl font-medium">Atenção!</ModalHeader>
                    <ModalBody className="justify-center">
                        <div className="flex flex-row justify-center p-2">
                            Confirmar a exclusão deste estado:
                            <div className="text-[#059669] ml-1">
                                {stateName}
                            </div> ?
                        </div>
                        <div className="flex justify-center gap-2 pt-3">
                            <button className='btn bg-none border-[#D93442] text-[#D93442] hover:bg-[#D93442] hover:text-white' onClick={() => openCloseModalDelete()}>Cancelar</button>
                            <button className='btn bg-[#2AA646] text-white hover:text-white hover:bg-[#059669]' onClick={() => DeleteOrder()}>Confirmar</button>
                        </div>
                        {/* <ModalFooter>
                    </ModalFooter> */}
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
}