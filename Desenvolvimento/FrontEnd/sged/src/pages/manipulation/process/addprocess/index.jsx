import React, { useEffect, useState } from "react";
import Select from "react-select";
import { HouseLine, User } from '@phosphor-icons/react';

// Importa o arquivo CSS
import './styles.css';

import LayoutPage from "../../../../components/Layout/LayoutPage";
import LinkTitle from "../../../../components/Title/LinkTitle";

import { useMontage } from "../../../../object/modules/montage";
import ConnectionService from "../../../../object/service/connection";
import ListModule from "../../../../object/modules/list";
import SelectModule from '../../../../object/modules/select';

const AddProcess = () => {
  const montage = useMontage();

  useEffect(() => {
    montage.componentMounted();
  }, []);


  // Services initialization --------------------------------------------------------------------------------------------------------------------------
  const connection = new ConnectionService();
  const list_Realstate = ListModule();
  const selectBox_Realstate = SelectModule();

  const list_TypesProcess = ListModule();
  const selectBox_TypesProcess = SelectModule();

  const list_Users = ListModule();
  const selectBox_UserResponsible = SelectModule();
  const selectBox_UserApprover = SelectModule();

  const list_Engineers = ListModule();
  const selectBox_Engineer = SelectModule();
  const list_Supervisors = ListModule();
  const selectBox_Supervisor = SelectModule();

  // State hooks --------------------------------------------------------------------------------------------------------------------------------------
  const [updateData, setUpdateData] = useState(true);

  const [process, setProcess] = useState({
    identificationNumber: "",
    processSituation: "",
    processDescription: "",
    approvationDate: "",
    processStatus: 0,
  });
  const [documentsProcess, setDocumentsProcess] = useState([]);

  const [realstate, setRealstate] = useState({});
  const [owner, setOwner] = useState({});
  const [taxpayer, setTaxpayer] = useState({});
  const [use, setUse] = useState({});
  const [occupation, setOccupation] = useState({});

  const [typeProcess, setTypeProcess] = useState({});
  const [stages, setStages] = useState([]);

  const [userResponsible, setUserResponsible] = useState({});
  const [userApprover, setUserApprover] = useState({});
  const [typeResponsible, setTypeResponsible] = useState({});
  const [typeApprover, setTypeApprover] = useState({});

  const [engineer, setEngineer] = useState({});
  const [supervisor, setSupervisor] = useState({});

  // Functions ----------------------------------------------------------------------------------------------------------------------------------------

  // Imóvel
  const GetAllEnrollmentRegistrations = async () => {
    await connection.endpoint("Imovel").action("GetAllEnrollmentRegistrations").get();
    list_Realstate.setList(connection.getList());
  };

  const GetRealstate = async (idRealstate) => {
    await connection.endpoint("Imovel").data(idRealstate).get();
    setRealstate(connection.getObject());
  };

  const GetOwner = async (idOwner) => {
    await connection.endpoint("Municipe").data(idOwner).get();
    setOwner(connection.getObject());
  };

  const GetTaxpayer = async (idTaxpayer) => {
    await connection.endpoint("Municipe").data(idTaxpayer).get();
    setTaxpayer(connection.getObject());
  };

  const GetUse = async (idUse) => {
    await connection.endpoint("Uso").data(idUse).get();
    setUse(connection.getObject());
  };

  const GetOccupation = async (idOccupation) => {
    await connection.endpoint("OcupacaoAtual").data(idOccupation).get();
    setOccupation(connection.getObject());
  };


  // TipoProcesso
  const GetAllTypes = async () => {
    await connection.endpoint("TipoProcesso").action("GetAllTypes").get();
    list_TypesProcess.setList(connection.getList());
  };

  const GetTypeProcess = async (idTypeProcess) => {
    await connection.endpoint("TipoProcesso").data(idTypeProcess).get();
    setTypeProcess(connection.getObject());
  };

  const GetStages = async (idTypeProcess) => {
    await connection.endpoint("Etapa").action("GetRelatedToTypeProcess").data(idTypeProcess).get();
    setStages(connection.getList());
  };

  const GetTypeDocumentStages = async (idStage) => {
    await connection.endpoint("TipoDocumentoEtapa").action("GetTypeDocumentStagesRelatedToStage").data(idStage).get();
    return connection.getList();
  };

  const GetTypeDocument = async (idTypeDocument) => {
    await connection.endpoint("TipoDocumento").data(idTypeDocument).get();
    return connection.getObject();
  };


  // Usuario
  const GetAllNamesUsers = async () => {
    await connection.endpoint("Usuario").action("GetAllNames").get();
    list_Users.setList(connection.getList());
  };

  const GetUser = async (idUser) => {
    await connection.endpoint("Usuario").data(idUser).get();
    return connection.getObject();
  };

  const GetTypeUser = async (idTypeUser) => {
    await connection.endpoint("TipoUsuario").data(idTypeUser).get();
    return connection.getObject();
  };


  // Entidades
  const GetAllNamesEngineers = async () => {
    await connection.endpoint("Engenheiro").action("GetAllNames").get();
    list_Engineers.setList(connection.getList());
  };

  const GetEngineer = async (idEngineer) => {
    await connection.endpoint("Engenheiro").data(idEngineer).get();
    setEngineer(connection.getObject());
  };

  const GetAllNamesSupervisors = async () => {
    await connection.endpoint("Fiscal").action("GetAllNames").get();
    list_Supervisors.setList(connection.getList());
  };

  const GetSupervisor = async (idSupervisor) => {
    await connection.endpoint("Fiscal").data(idSupervisor).get();
    setSupervisor(connection.getObject());
  };


  // Cadastro
  const PostAllDatas = async () => {
    var dataProcess = {
      IdentificacaoProcesso: process.identificationNumber,
      DescricaoProcesso: process.processDescription || "",
      SituacaoProcesso: process.processSituation || "",
      DataAprovacao: process.approvationDate || "",
      Status: process.processStatus || 0,

      IdImovel: selectBox_Realstate.selectedOption.value,
      IdTipoProcesso: selectBox_TypesProcess.selectedOption.value,
      IdEngenheiro: selectBox_Engineer.selectedOption.value || null,
      IdFiscal: selectBox_Supervisor.selectedOption.value || null,
      IdResponsavel: selectBox_UserResponsible.selectedOption.value || null,
      IdAprovador: selectBox_UserApprover.selectedOption.value || null,

      DocumentosProcessoDTOs: []
    };

    console.log(dataProcess);

    await connection.endpoint("Processo").action("PostAllDatas").post(dataProcess);
    list_Engineers.setList(connection.getList());
  };



  // UseEffets ----------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (updateData) {
      GetAllEnrollmentRegistrations();
      GetAllTypes();
      GetAllNamesUsers();
      GetAllNamesEngineers();
      GetAllNamesSupervisors();

      setUpdateData(false);
    }
  }, [updateData]);


  // Imóvel
  useEffect(() => { // Para atualizar as opções do Select bem como o valor padrão selecionado
    if (list_Realstate.list.length !== 0) {
      selectBox_Realstate.updateOptions(list_Realstate.list, "id", "inscricaoCadastral");

      /*if (!city.idState) {
          selectBox_Realstate.selectOption(selectBox_Realstate.lastSelected ? selectBox_Realstate.lastSelected : listState.list[0]?.id);
          selectBox_Realstate.setLastSelected(0);
      }*/
    } else {
      selectBox_Realstate.updateOptions([]);
      selectBox_Realstate.selectOption(0);
    }
  }, [list_Realstate.list]);

  useEffect(() => {
    if (selectBox_Realstate.selectedOption.value) {
      setCurrentImageIndex(0);
      GetRealstate(selectBox_Realstate.selectedOption.value);
    }
  }, [selectBox_Realstate.selectedOption]);

  useEffect(() => {
    if (realstate.id) {
      GetOwner(realstate.idProprietario);
      GetTaxpayer(realstate.idContribuinte);
      GetUse(realstate.idUso);
      GetOccupation(realstate.idOcupacaoAtual);
    }
  }, [realstate]);


  // TipoProcesso
  useEffect(() => { // Para atualizar as opções do Select bem como o valor padrão selecionado
    if (list_TypesProcess.list.length !== 0) {
      selectBox_TypesProcess.updateOptions(list_TypesProcess.list, "id", "nomeTipoProcesso");

      /*if (!city.idState) {
          selectBox_TypesProcess.selectOption(selectBox_TypesProcess.lastSelected ? selectBox_TypesProcess.lastSelected : listState.list[0]?.id);
          selectBox_TypesProcess.setLastSelected(0);
      }*/
    } else {
      selectBox_TypesProcess.updateOptions([]);
      selectBox_TypesProcess.selectOption(0);
    }
  }, [list_TypesProcess.list]);

  useEffect(() => {
    if (selectBox_TypesProcess.selectedOption.value) {
      GetTypeProcess(selectBox_TypesProcess.selectedOption.value);
    }
  }, [selectBox_TypesProcess.selectedOption]);

  useEffect(() => {
    if (typeProcess.id) {
      GetStages(typeProcess.id);
    }
  }, [typeProcess]);

  // Usuario
  useEffect(() => { // Para atualizar as opções do Select bem como o valor padrão selecionado
    if (list_Users.list.length !== 0) {
      selectBox_UserResponsible.updateOptions(list_Users.list, "id", "nomePessoa");
      selectBox_UserApprover.updateOptions(list_Users.list, "id", "nomePessoa");

    } else {
      selectBox_UserResponsible.updateOptions([]);
      selectBox_UserResponsible.selectOption(0);

      selectBox_UserApprover.updateOptions([]);
      selectBox_UserApprover.selectOption(0);
    }
  }, [list_Users.list]);

  // Efeito para atualizar o responsável
  useEffect(() => {
    const fetchUserResponsible = async () => {
      if (selectBox_UserResponsible.selectedOption.value) {
        const user = await GetUser(selectBox_UserResponsible.selectedOption.value);
        setUserResponsible(user);
      }
    };

    fetchUserResponsible();
  }, [selectBox_UserResponsible.selectedOption]);

  // Efeito para atualizar o aprovador
  useEffect(() => {
    const fetchUserApprover = async () => {
      if (selectBox_UserApprover.selectedOption.value) {
        const user = await GetUser(selectBox_UserApprover.selectedOption.value);
        setUserApprover(user);
      }
    };

    fetchUserApprover();
  }, [selectBox_UserApprover.selectedOption]);

  // Efeito para atualizar o responsável
  useEffect(() => {
    const fetchTypeResponsible = async () => {
      if (userResponsible.idTipoUsuario) {
        const user = await GetTypeUser(userResponsible.idTipoUsuario);
        setTypeResponsible(user);
      }
    };

    fetchTypeResponsible();
  }, [userResponsible]);

  // Efeito para atualizar o aprovador
  useEffect(() => {
    const fetchTypeApprover = async () => {
      if (userApprover.idTipoUsuario) {
        const user = await GetTypeUser(userApprover.idTipoUsuario);
        setTypeApprover(user);
      }
    };

    fetchTypeApprover();
  }, [userApprover]);


  // Engenheiro
  useEffect(() => { // Para atualizar as opções do Select bem como o valor padrão selecionado
    if (list_Engineers.list.length !== 0) {
      selectBox_Engineer.updateOptions(list_Engineers.list, "id", "nomePessoa");
    } else {
      selectBox_Engineer.updateOptions([]);
      selectBox_Engineer.selectOption(0);
    }
  }, [list_Engineers.list]);

  useEffect(() => {
    if (selectBox_Engineer.selectedOption.value) {
      GetEngineer(selectBox_Engineer.selectedOption.value);
    }
  }, [selectBox_Engineer.selectedOption]);

  // Fiscal
  useEffect(() => { // Para atualizar as opções do Select bem como o valor padrão selecionado
    if (list_Supervisors.list.length !== 0) {
      selectBox_Supervisor.updateOptions(list_Supervisors.list, "id", "nomePessoa");
    } else {
      selectBox_Supervisor.updateOptions([]);
      selectBox_Supervisor.selectOption(0);
    }
  }, [list_Supervisors.list]);

  useEffect(() => {
    if (selectBox_Supervisor.selectedOption.value) {
      GetSupervisor(selectBox_Supervisor.selectedOption.value);
    }
  }, [selectBox_Supervisor.selectedOption]);


  // Imagem -------------------------------------------------------------------------------------------------------------------------------------------

  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Índice da imagem atual

  useEffect(() => {
    if (realstate.imagemImovel && realstate.imagemImovel.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === realstate.imagemImovel.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // A cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [realstate.imagemImovel]);


  // Gerenciar a lista de Etapas:
  const [expandedRows, setExpandedRows] = useState([]); // Controla quais etapas estão expandidas
  const [expandedDetail, setExpandedDetail] = useState(null); // Controla qual "detail" foi clicado
  const [typeDocumentStagesData, setTypeDocumentStagesData] = useState({}); // Armazena os dados de TipoDocumentEtapa
  const [typeDocumentsData, setTypeDocumentsData] = useState({}); // Armazena os dados de TipoDocumento

  // Controla a expansão da etapa
  const toggleRow = (rowId) => {
    setExpandedRows(
      (prevRows) =>
        prevRows.includes(rowId)
          ? prevRows.filter((id) => id !== rowId) // Remove a etapa se já estiver expandida
          : [...prevRows, rowId] // Adiciona a etapa se não estiver expandida
    );
  };

  // Controla a expansão do detalhe
  const toggleDetail = (detailId) => {
    setExpandedDetail((prevDetail) =>
      prevDetail === detailId ? null : detailId
    );
  };

  // Função para buscar os documentos relacionados a uma etapa
  const fetchTypeDocumentStages = async (stageId) => {
    const data = await GetTypeDocumentStages(stageId); // Supondo que GetTypeDocumentStages seja uma função assíncrona
    setTypeDocumentStagesData((prev) => ({
      ...prev,
      [stageId]: data,
    }));
  };

  // Função para buscar o TipoDocumento relacionado a TipoDocumentoEtapa
  const fetchTypeDocument = async (typeDocumentStageId) => {
    const data = await GetTypeDocument(typeDocumentStageId); // Supondo que GetTypeDocument seja uma função assíncrona
    setTypeDocumentsData((prev) => ({
      ...prev,
      [typeDocumentStageId]: data,
    }));
  };

  // Efeito para buscar os dados quando uma etapa é expandida
  useEffect(() => {
    expandedRows.forEach((stageId) => {
      if (!typeDocumentStagesData[stageId]) {
        fetchTypeDocumentStages(stageId);
      }
    });
  }, [expandedRows]);




  const [activeDocument, setActiveDocument] = useState(null);

  const handleToggle = (id) => {
    setActiveDocument(activeDocument === id ? null : id);
  };



  return (
    <LayoutPage>
      <LinkTitle pageName="Cadastrar Processo" otherRoute="Processo" />
      <div className="mt-8">
        <div className="flex">
          {/* Imóvel: ----------------------------------------------------------------------------------------------------*/}

          <div
            className="mr-8 h-[200px] w-[200px] rounded-lg border-[2px] flex items-center justify-center"
          >
            {realstate.imagemImovel && realstate.imagemImovel.length > 0 ? (
              <img
                src={realstate.imagemImovel[currentImageIndex]}
              />
            ) : (
              <HouseLine size={50} />
            )}
          </div>

          <div className="flex flex-col w-1/3 gap-y-3">
            <h1 className="text-lg text-gray-700">Imóvel:</h1>
            <Select
              value={selectBox_Realstate.selectedOption}
              onChange={selectBox_Realstate.handleChange}
              onInputChange={selectBox_Realstate.delayedSearch}
              loadOptions={selectBox_Realstate.loadOptions}
              options={selectBox_Realstate.options}
              placeholder="Pesquisar inscrição cadastral . . ."
              isClearable
              isSearchable
              noOptionsMessage={() => {
                if (list_Realstate.list.length === 0) {
                  return "Nenhuma Inscrição Cadastral existente!";
                } else {
                  return "Nenhuma opção encontrada!";
                }
              }}
              className="style-select"
              required
            />

            <h1 className="text-lg text-gray-700">Número:</h1>
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={realstate.numeroImovel || ''}
            />

            <h1 className="text-lg text-gray-700">Proprietário:</h1>
            <div>
              {owner.imagemPessoa ? (
                <img
                  src={owner.imagemPessoa ? owner.imagemPessoa : ""}
                  className="cursor-pointer rounded-full w-[50px] h-[50px] object-cover p-1 shadow-md"
                />
              ) : (
                <User size={50} />
              )}
              <input
                type="text"
                disabled
                className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
                value={owner.nomePessoa || ''}
              />
            </div>

            <h1 className="text-lg text-gray-700">Contribuinte:</h1>
            <div>
              {taxpayer.imagemPessoa ? (
                <img
                  src={taxpayer.imagemPessoa ? taxpayer.imagemPessoa : ""}
                  className="cursor-pointer rounded-full w-[50px] h-[50px] object-cover p-1 shadow-md"
                />
              ) : (
                <User size={50} />
              )}
              <input
                type="text"
                disabled
                className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
                value={taxpayer.nomePessoa || ''}
              />
            </div>

            <h1 className="text-lg text-gray-700">Uso:</h1>
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={use.nomeUso || ''}
            />

            <h1 className="text-lg text-gray-700">Ocupação Atual:</h1>
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={occupation.nomeOcupacaoAtual || ''}
            />
          </div>


          {/* Tipo Processo: ----------------------------------------------------------------------------------------------------*/}

          <div className="flex flex-col w-1/3 gap-y-3">
            <h1 className="text-lg text-gray-700">Tipo Processo:</h1>
            <Select
              value={selectBox_TypesProcess.selectedOption}
              onChange={selectBox_TypesProcess.handleChange}
              onInputChange={selectBox_TypesProcess.delayedSearch}
              loadOptions={selectBox_TypesProcess.loadOptions}
              options={selectBox_TypesProcess.options}
              placeholder="Pesquisar tipo processo . . ."
              isClearable
              isSearchable
              noOptionsMessage={() => {
                if (list_TypesProcess.list.length === 0) {
                  return "Nenhuma Tipo Processo existente!";
                } else {
                  return "Nenhuma opção encontrada!";
                }
              }}
              className="style-select"
              required
            />

            <h1 className="text-lg text-gray-700">Descrição:</h1>
            <textarea
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb] w-full h-32 resize-none"
              value={typeProcess.descricaoTipoProcesso || ''}
            ></textarea>


            {/* Processo: ----------------------------------------------------------------------------------------------------*/}

            <h1 className="text-lg text-gray-700">Número de Identificação:</h1>
            <input
              type="text"
              className="rounded-sm border-[#e5e7eb]"
              onChange={(e) =>
                setProcess((prevState) => ({
                  ...prevState,
                  identificationNumber: e.target.value,
                }))
              }
              value={process.identificationNumber}
              required
            />

            <h1 className="text-lg text-gray-700">Situação:</h1>
            <textarea
              className="rounded-sm border-[#e5e7eb] w-full h-32 resize-none"
              onChange={(e) =>
                setProcess((prevState) => ({
                  ...prevState,
                  processSituation: e.target.value,
                }))
              }
              value={process.processSituation}
            />

            <h1 className="text-lg text-gray-700">Descrição:</h1>
            <textarea
              className="rounded-sm border-[#e5e7eb] w-full h-32 resize-none"
              onChange={(e) =>
                setProcess((prevState) => ({
                  ...prevState,
                  processDescription: e.target.value,
                }))
              }
              value={process.processDescription}
            />

            <h1 className="text-lg text-gray-700">Data de Aprovação:</h1>
            <input
              type="date"
              className="rounded-sm border-[#e5e7eb]"
              onChange={(e) =>
                setProcess((prevState) => ({
                  ...prevState,
                  approvationDate: e.target.value,
                }))
              }
              value={process.approvationDate}
            />

            <h1 className="text-lg text-gray-700">Status:</h1>
            <input
              disabled
              type="text"
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={process.processStatus}
            />

            <h1 className="text-lg text-gray-700">Engenheiro:</h1>
            {engineer.imagemPessoa ? (
              <img
                className="h-[50px] w-[50px]"
                src={engineer.imagemPessoa}
              />
            ) : (
              <User size={50} />
            )}
            <Select
              value={selectBox_Engineer.selectedOption}
              onChange={selectBox_Engineer.handleChange}
              onInputChange={selectBox_Engineer.delayedSearch}
              loadOptions={selectBox_Engineer.loadOptions}
              options={selectBox_Engineer.options}
              placeholder="Pesquisar engenheiro . . ."
              isClearable
              isSearchable
              noOptionsMessage={() => {
                if (list_Users.list.length === 0) {
                  return "Nenhum Engenheiro existente!";
                } else {
                  return "Nenhuma opção encontrada!";
                }
              }}
              className="style-select"
            />
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={engineer.creaEngenheiro || ''}
            />

            <h1 className="text-lg text-gray-700">Fiscal:</h1>
            {supervisor.imagemPessoa ? (
              <img
                className="h-[50px] w-[50px]"
                src={supervisor.imagemPessoa}
              />
            ) : (
              <User size={50} />
            )}
            <Select
              value={selectBox_Supervisor.selectedOption}
              onChange={selectBox_Supervisor.handleChange}
              onInputChange={selectBox_Supervisor.delayedSearch}
              loadOptions={selectBox_Supervisor.loadOptions}
              options={selectBox_Supervisor.options}
              placeholder="Pesquisar fiscal . . ."
              isClearable
              isSearchable
              noOptionsMessage={() => {
                if (list_Users.list.length === 0) {
                  return "Nenhum Fiscal existente!";
                } else {
                  return "Nenhuma opção encontrada!";
                }
              }}
              className="style-select"
            />
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={supervisor.cpfCnpjPessoa || ''}
            />


            {/* Funcionário Responsável */}
            <h1 className="text-lg text-gray-700">Responsável:</h1>
            {userResponsible.imagemPessoa ? (
              <img
                className="h-[50px] w-[50px]"
                src={userResponsible.imagemPessoa}
              />
            ) : (
              <User size={50} />
            )}
            <Select
              value={selectBox_UserResponsible.selectedOption}
              onChange={selectBox_UserResponsible.handleChange}
              onInputChange={selectBox_UserResponsible.delayedSearch}
              loadOptions={selectBox_UserResponsible.loadOptions}
              options={selectBox_UserResponsible.options}
              placeholder="Pesquisar usuário . . ."
              isClearable
              isSearchable
              noOptionsMessage={() => {
                if (list_Users.list.length === 0) {
                  return "Nenhum Usuário existente!";
                } else {
                  return "Nenhuma opção encontrada!";
                }
              }}
              className="style-select"
            />
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={userResponsible.emailPessoa || ''}
            />
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={typeResponsible.nomeTipoUsuario || ''}
            />

            <h1 className="text-lg text-gray-700">Aprovador:</h1>
            {userApprover.imagemPessoa ? (
              <img
                className="h-[50px] w-[50px]"
                src={userApprover.imagemPessoa}
              />
            ) : (
              <User size={50} />
            )}
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={userApprover.nomePessoa || ''}
            />
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={userApprover.emailPessoa || ''}
            />
            <input
              type="text"
              disabled
              className="cursor-not-allowed rounded-sm border-[#e5e7eb]"
              value={typeApprover.nomeTipoUsuario || ''}
            />
          </div>

          <button className={`btn bg-[#2AA646] text-white hover:text-white hover:bg-[#059669]`} style={{ width: '100px', height: '40px' }} onClick={() => PostAllDatas()} >
            {'Cadastrar'}
          </button>
        </div>
        <hr className="my-10" />



        <div className='flex gap-x-5'>
          {/* Lista de Etapas */}
          <ul className="w-3/4">
            {stages.map((stage) => {
              const typeDocumentStages = typeDocumentStagesData[stage.id] || []; // Dados de TipoDocumentoEtapa relacionados à etapa

              return (
                <li key={stage.id} className="border-b border-gray-200 mb-4">
                  <div className="flex justify-between items-center p-4 bg-gray-300 cursor-pointer" onClick={() => toggleRow(stage.id)}>
                    <span>Etapa {stage.posicao} - {stage.nomeEtapa}</span>
                    <button className="text-blue-600">{expandedRows.includes(stage.id) ? 'Recolher' : 'Expandir'}</button>
                  </div>

                  {expandedRows.includes(stage.id) && (
                    <div className="bg-gray-100 p-4">
                      <ul>
                        {typeDocumentStages.map((typeDocumentStage) => {
                          const typeDocument = typeDocumentsData[typeDocumentStage.idTipoDocumento];

                          // Busca o documento se ainda não tiver sido carregado
                          if (!typeDocument && !typeDocumentsData[typeDocumentStage.idTipoDocumento]) {
                            fetchTypeDocument(typeDocumentStage.idTipoDocumento);
                          }

                          if (typeDocument) {
                            return (
                              <li key={typeDocument.id} className="p-2 border-b border-gray-200 cursor-pointer">
                                <span>Documento {typeDocument.posicao} - {typeDocument.nomeTipoDocumento}</span>
                                <button
                                  className="text-blue-600"
                                  onClick={() => handleToggle(typeDocument.id)}
                                >
                                  Anexar
                                </button>
                                {activeDocument === typeDocument.id && (
                                  <div className="mt-2">
                                    <form>
                                      <label htmlFor="fileUpload" className="block mb-2 text-sm font-medium text-gray-700">
                                        Selecione um arquivo:
                                      </label>
                                      <input
                                        type="file"
                                        id="fileUpload"
                                        className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                                      />
                                      <button
                                        type="submit"
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                      >
                                        Enviar
                                      </button>
                                    </form>
                                  </div>
                                )}
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Lista de Documentos Associados ao Detalhe Selecionado */}
          {expandedDetail && (
            <div className="w-1/2">
              {data.map(row =>
                row.details.map(detail =>
                  detail.id === expandedDetail && (
                    <div key={detail.id} className="bg-white p-4 border">
                      <h2 className="text-lg mb-4">Documentos para {detail.text}</h2>
                      {detail.documents.map(doc => (
                        <div key={doc.id} className="mb-2">
                          <span>{doc.name}</span>
                          <input type="file" className="ml-4" />
                        </div>
                      ))}
                    </div>
                  )
                )
              )}
            </div>
          )}
        </div>
      </div>
    </LayoutPage>
  );
};

export default AddProcess;