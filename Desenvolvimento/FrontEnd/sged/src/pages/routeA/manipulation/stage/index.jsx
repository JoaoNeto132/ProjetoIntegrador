import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import NavBar from "../../components/NavBar";
import SideBarAdm from "../../components/Adm/SideBarAdm";
import { FaPlus } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from 'react-select';
import { CaretLeft, CaretRight, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import LinkTitle from "../../components/Title/LinkTitle";

import { useMontage } from '../../../../object/modules/montage';
import ConnectionService from '../../../../object/service/connection';
import ListModule from '../../../../object/modules/list';
import StageClass from "../../../../object/class/stage";
import SelectModule from '../../../../object/modules/select';
import Search from "../../../../assets/pages/SearchImg";
import { motion } from "framer-motion";
import RegistrationButton from "../../components/Button/RegistrationButton";

export default function Stage() {

    const { componentMounted } = useMontage();

    useEffect(() => {
        componentMounted();
    }, []);

    const connection = new ConnectionService(); connection.enablePopUp().enableGetPopUp();
    const stage = StageClass();
    const list = ListModule();
    const listTypeProcess = ListModule();
    const selectBox = SelectModule();

    const [modalInsert, setModalInsert] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [updateData, setUpdateData] = useState(true);
    const [inOperation, setInOperation] = useState(false);

    const openCloseModalInsert = (boolean) => {
        setModalInsert(boolean);
        stage.clearError();

        if (!boolean) {
            stage.clearData();
        }
    };

    const openCloseModalEdit = (boolean) => {
        setModalEdit(boolean);
        stage.clearError();

        if (!boolean) {
            stage.clearData();
        }
    };

    const openCloseModalDelete = (boolean) => {
        setModalDelete(boolean);

        if (!boolean) {
            stage.clearData();
        }
    };

    const SelectStage = (object, option) => {
        stage.setData(object);
        selectBox.selectOption(object.idTypeProcess);

        if (option === "Editar") {
            openCloseModalEdit(true);
        } else {
            openCloseModalDelete(true);
        }
    };

    const GetTypeProcess = async () => {
        await connection.endpoint("TipoProcesso").get();
        listTypeProcess.setList(connection.getList());
    };

    const GetStage = async () => {
        await connection.endpoint("Etapa").get();
        list.setList(connection.getList());
    };

    const PostStage = async () => {
        setInOperation(true);

        if (stage.verifyData(list.list)) {
            await connection.endpoint("Etapa").post(stage.getData());

            openCloseModalInsert(!connection.response.status);
            setUpdateData(connection.response.status);
        }

        setInOperation(false);
    };

    const PutStage = async () => {
        setInOperation(true);

        if (stage.verifyData(list.list)) {
            await connection.endpoint("Etapa").put(stage.getData());

            openCloseModalEdit(!connection.response.status);
            setUpdateData(connection.response.status);
        }
        
        setInOperation(false);
    };

    const DeleteStage = async () => {
        setInOperation(true);

        await connection.endpoint("Etapa").delete(stage.getData().id);

        openCloseModalDelete(!connection.response.status);
        setUpdateData(connection.response.status);

        setInOperation(false);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('nomeEtapa');

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const handleSearchBy = (value) => {
        setSearchBy(value);
    };

    const filterStage = () => {
        const searchTermNormalized = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (!searchTerm) {
            list.setListToRender(list.list);
        } else {
            if (searchBy === 'nomeTipoProcesso') {
                const filteredTypeProcess = listTypeProcess.list.filter((typeprocess) => {
                    const typeprocessFilter = typeprocess[searchBy].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    return typeprocessFilter.toLowerCase().includes(searchTermNormalized.toLowerCase());
                });

                const filteredIds = filteredTypeProcess.map((typeprocess) => typeprocess.id);

                const filtered = list.list.filter((stage) => {
                    return filteredIds.includes(stage.idTipoProcesso);
                });

                list.setListToRender(filtered);
            } else if (searchBy === "descricaoEtapa") {
                const filtered = list.list.filter((stage) => {
                    const stageFilter = stage[searchBy].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    return stageFilter.toLowerCase().includes(searchTermNormalized.toLowerCase());
                });

                list.setListToRender(filtered);
            } else {
                list.setSearchTerm(searchTerm);
                list.setSearchBy(searchBy);
            }
        }
    };

    useEffect(() => {
        filterStage();
    }, [searchTerm, searchBy, list.list]);

    useEffect(() => {
        if (updateData) {
            GetTypeProcess();
            GetStage();

            stage.setIdTypeProcess(listTypeProcess.list[0]?.id);

            setUpdateData(false);
        }
    }, [updateData]);

    useEffect(() => {
        if (!modalInsert && !modalEdit && !modalDelete) {
            selectBox.updateOptions(listTypeProcess.list, "id", "nomeTipoProcesso");
            selectBox.selectOption(listTypeProcess.list[0]?.id);
        }
    }, [listTypeProcess.list, modalInsert, modalEdit, modalDelete]);

    useEffect(() => {
        stage.setIdTypeProcess(selectBox.selectedOption.value ? selectBox.selectedOption.value : '');
    }, [selectBox.selectedOption]);

    return (
        <div className="flex min-h-screen">
            <div className="flex h-full w-full">
                <div className="fixed w-full">
                    <NavBar />
                </div>
                <div className="fixed mt-[56px] sm:mt-[64px]">
                    <SideBarAdm />
                </div>
                <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ type: 'spring', velocity: 2 }}
                    className="mt-[45px] sm:mt-[64px] ml-[60px] sm:ml-[220px] md:ml-[240px] lg:ml-[260px] xl:ml-[275px] pl-2 pr-[25px] w-full"
                >
                    <br />
                    <LinkTitle pageName="Etapa" />
                    <div className="flex items-center">
                        <div className="flex justify-center items-center mx-auto w-[450px]">
                            <div className="flex border-1 border-[#dee2e6] rounded-md w-full h-12 items-center hover:border-[#2d636b]">
                                <div className="pl-2">
                                    <Search />
                                </div>
                                <input type="search" id="default-search" className="bg-transparent border-none w-full focus:outline-transparent focus:ring-transparent text-gray-700 text-sm" placeholder="Pesquisar etapa" required onChange={(e) => handleSearch(e.target.value)} />
                                <select className="form-control w-28 text-gray-800 h-full cursor-pointer" onChange={(e) => handleSearchBy(e.target.value)}>
                                    <option key="descricaoEtapa" value="descricaoEtapa">
                                        Descrição
                                    </option>
                                    <option key="nomeTipoProcesso" value="nomeTipoProcesso">
                                        TipoProcesso
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <RegistrationButton action={() => openCloseModalInsert(true)} />
                        </div>
                    </div>
                    <div className="w-full rounded-[20px] border-1 border-[#C8E5E5] mt-10">
                        <div className="grid grid-cols-4 w-full bg-[#58AFAE] rounded-t-[20px] h-10 items-center">
                            <div className="flex ml-5 text-white text-lg font-semibold">Etapa</div>
                            <div className="flex justify-center items-center text-white text-lg font-semibold">Descrição</div>
                            <div className="flex justify-center items-center text-white text-lg font-semibold">Tipo Processo</div>
                            <div className="flex justify-center text-white text-lg font-semibold">Ações</div>
                        </div>
                        <ul className="w-full">
                            {list.currentList && list.currentList.map((stage) => {
                                const tipoprocesso = listTypeProcess.list.find((typeprocess) => typeprocess.id === stage.idTipoProcesso);
                                return (
                                    <li className="grid grid-cols-4 w-full" key={stage.id}>
                                        <div className="flex pl-5 border-r-[1px] border-t-[1px] border-[#C8E5E5] pt-[7.5px] pb-[7.5px] text-gray-700">{stage.nomeEtapa}</div>
                                        <div className="flex justify-center items-center border-t-[1px] border-r-[1px] border-[#C8E5E5] text-gray-700">{stage.descricaoEtapa}</div>
                                        <div className="flex justify-center items-center border-t-[1px] border-r-[1px] border-[#C8E5E5] text-gray-700">{tipoprocesso ? tipoprocesso.nomeTipoProcesso : "Tipo Processo não encontrado!"}</div>
                                        <div className="flex items-center justify-center border-t-[1px] gap-2 text-gray-700 border-[#C8E5E5]">
                                            <button
                                                className=""
                                                onClick={() => SelectStage(stage, "Editar")}
                                            >
                                                <PencilSimple size={20} className="hover:text-cyan-500" />
                                            </button>
                                            <button
                                                className=""
                                                onClick={() => SelectStage(stage, "Excluir")}
                                            >
                                                <TrashSimple size={20} className="hover:text-red-600" />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        {/* Estilização dos botões de navegação */}
                        <div className="pt-4 flex justify-center gap-2 border-t-[1px] border-[#C8E5E5]">
                            <button
                                className=""
                                onClick={() => list.goToPage(list.currentPage - 1)}
                            >
                                <CaretLeft size={22} className="text-[#58AFAE]" />
                            </button>
                            <select
                                className="border-[1px] border-[#C8E5E5] rounded-sm hover:border-[#C8E5E5] select-none"
                                value={list.currentPage}
                                onChange={(e) => list.goToPage(Number(e.target.value))}
                            >
                                {[...Array(list.totalPages)].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <button
                                className=""
                                onClick={() => list.goToPage(list.currentPage + 1)}
                            >
                                <CaretRight size={22} className="text-[#58AFAE]" />
                            </button>
                        </div>
                        <div className="mt-4"></div>
                    </div>
                </motion.div>
                <Modal isOpen={modalInsert}>
                    <ModalHeader className="justify-center text-white text-xl bg-[#58AFAE]">Cadastrar Etapa</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-[#444444]">Etapa: </label>
                            <br />
                            <input
                                type="text"
                                className="form-control rounded-md border-[#BCBCBC]"
                                onChange={(e) => stage.setStageName(e.target.value)}
                            />
                            <div className="text-sm text-red-600">
                                {stage.errorStageName}
                            </div>
                            <br />
                            <label className="text-[#444444]">Descrição: </label>
                            <br />
                            <textarea
                                className="form-control rounded-md border-[#BCBCBC]"
                                onChange={(e) => stage.setStageDescription(e.target.value)}
                            />
                            <br />
                            <label className="text-[#444444]">Tipo Processo:</label>
                            <br />
                            <Select
                                value={selectBox.selectedOption}
                                onChange={selectBox.handleChange}
                                onInputChange={selectBox.delayedSearch}
                                loadOptions={selectBox.loadOptions}
                                options={selectBox.options}
                                placeholder="Pesquisar tipo processo . . ."
                                isClearable
                                isSearchable
                                noOptionsMessage={() => {
                                    if (listTypeProcess.list.length === 0) {
                                        return "Nenhum Tipo Processo cadastrado!";
                                    } else {
                                        return "Nenhuma opção encontrada!";
                                    }
                                }}
                                className="style-select"
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn bg-none border-[#D93442] text-[#D93442] hover:bg-[#D93442] hover:text-white" onClick={() => openCloseModalInsert(false)}>
                            Cancelar
                        </button>
                        <button className={`btn ${inOperation ? 'border-[#E0E0E0] text-[#A7A6A5] hover:text-[#A7A6A5]' : 'bg-[#2AA646] text-white hover:text-white hover:bg-[#059669]'}`} style={{ width: '100px', height: '40px' }} onClick={() => inOperation ? null : PostStage()} disabled={inOperation} >
                            {inOperation ? 'Aguarde' : 'Cadastrar'}
                        </button>{" "}
                    </ModalFooter>
                </Modal>
                <Modal isOpen={modalEdit}>
                    <ModalHeader className="justify-center text-white text-xl bg-[#58AFAE]">Editar Etapa</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-[#444444]">ID: </label>
                            <br />
                            <input
                                type="text"
                                className="form-control rounded-md border-[#BCBCBC]"
                                readOnly
                                value={stage.stageId}
                            />
                            <br />
                            <label className="text-[#444444]">Etapa:</label>
                            <input
                                type="text"
                                className="form-control rounded-md border-[#BCBCBC]"
                                name="nomeEtapa"
                                onChange={(e) => stage.setStageName(e.target.value)}
                                value={stage.stageName}
                            />
                            <div className="text-sm text-red-600">
                                {stage.errorStageName}
                            </div>
                            <br />
                            <label className="text-[#444444]">Descrição:</label>
                            <input
                                type="text"
                                className="form-control rounded-md border-[#BCBCBC]"
                                name="descricaoEtapa"
                                onChange={(e) => stage.setStageDescription(e.target.value)}
                                value={stage.stageDescription}
                            />
                            <br />
                            <label className="text-[#444444]">Tipo Processo:</label>
                            <br />
                            <Select
                                value={selectBox.selectedOption}
                                onChange={selectBox.handleChange}
                                onInputChange={selectBox.delayedSearch}
                                loadOptions={selectBox.loadOptions}
                                options={selectBox.options}
                                placeholder="Pesquisar tipo processo . . ."
                                isClearable
                                isSearchable
                                noOptionsMessage={() => {
                                    if (listTypeProcess.list.length === 0) {
                                        return "Nenhum Tipo Processo cadastrado!";
                                    } else {
                                        return "Nenhuma opção encontrada!";
                                    }
                                }}
                            />
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn bg-none border-[#D93442] text-[#D93442] hover:bg-[#D93442] hover:text-white" onClick={() => openCloseModalEdit(false)}>
                            Cancelar
                        </button>
                        <button className={`btn ${inOperation ? 'border-[#E0E0E0] text-[#A7A6A5] hover:text-[#A7A6A5]' : 'bg-[#2AA646] text-white hover:text-white hover:bg-[#059669]'}`} style={{ width: '100px', height: '40px' }} onClick={() => inOperation ? null : PutStage()} disabled={inOperation} >
                            {inOperation ? 'Aguarde' : 'Atualizar'}
                        </button>{" "}
                    </ModalFooter>
                </Modal>
                <Modal isOpen={modalDelete}>
                    <ModalHeader className="justify-center text-[#444444] text-2xl font-medium">Atenção!</ModalHeader>
                    <ModalBody className="justify-center">
                        <div className="flex flex-row justify-center p-2">
                            Confirmar a exclusão desta etapa:
                            <div className="text-[#059669] ml-1">
                                {stage.stageName}
                            </div> ?
                        </div>
                        <div className="flex justify-center gap-2 pt-3">
                            <button className='btn bg-none border-[#D93442] text-[#D93442] hover:bg-[#D93442] hover:text-white' onClick={() => openCloseModalDelete(false)}>Cancelar</button>
                            <button className={`btn ${inOperation ? 'border-[#E0E0E0] text-[#A7A6A5] hover:text-[#A7A6A5]' : 'bg-[#2AA646] text-white hover:text-white hover:bg-[#059669]'}`} style={{ width: '100px', height: '40px' }} onClick={() => inOperation ? null : DeleteStage()} disabled={inOperation} > {inOperation ? 'Aguarde' : 'Confirmar'}</button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
}